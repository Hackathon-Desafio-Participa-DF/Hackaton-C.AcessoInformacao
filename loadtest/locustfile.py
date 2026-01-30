"""
Teste de carga - Participa DF (Ouvidoria)
==========================================
Simula o comportamento real de usuarios cidadaos e gestores administrativos.

Perfil de carga:
  - 80% Cidadaos (consulta protocolo, cria manifestacao)
  - 20% Gestores (dashboard, lista, detalhe, resposta)

Execucao headless (exemplo):
  locust -f locustfile.py --headless -u 50 -r 5 -t 2m --host http://localhost:3001

Execucao com UI:
  locust -f locustfile.py --host http://localhost:3001
  Acesse http://localhost:8089
"""

import random
import string
import time
from locust import HttpUser, task, between, events, tag

# ---------------------------------------------------------------------------
# Dados auxiliares para geracao de payloads realistas
# ---------------------------------------------------------------------------

TIPOS = ["RECLAMACAO", "SUGESTAO", "ELOGIO", "DENUNCIA", "SOLICITACAO"]

ORGAOS = [
    "Secretaria de Estado de Governo",
    "Secretaria de Estado de Economia",
    "Secretaria de Estado de Saude",
    "Secretaria de Estado de Educacao",
    "Secretaria de Estado de Seguranca Publica",
    "Secretaria de Estado de Transporte e Mobilidade",
    "Secretaria de Estado de Desenvolvimento Urbano e Habitacao",
    "Secretaria de Estado de Meio Ambiente",
    "Secretaria de Estado de Desenvolvimento Social",
    "Secretaria de Estado de Cultura e Economia Criativa",
    "Controladoria-Geral do Distrito Federal",
]

ASSUNTOS = [
    "Demora no atendimento",
    "Problema com iluminacao publica",
    "Buraco na via principal",
    "Elogio ao atendimento do servidor",
    "Solicitacao de poda de arvore",
    "Denuncia de irregularidade",
    "Melhoria no transporte publico",
    "Falta de medicamento na UBS",
    "Sugestao de ciclovia",
    "Reclamacao sobre limpeza urbana",
]

RELATOS = [
    "Estou relatando um problema que ocorreu no dia informado. "
    "Aguardei por muito tempo e nao obtive atendimento adequado. "
    "Solicito providencias por parte do orgao responsavel.",
    "Gostaria de registrar minha insatisfacao com o servico prestado. "
    "O atendimento foi demorado e os funcionarios nao souberam orientar. "
    "Espero que medidas sejam tomadas para melhorar a qualidade.",
    "Venho por meio desta parabenizar a equipe pelo excelente trabalho "
    "realizado. O atendimento foi rapido, eficiente e cordial. "
    "Que sirva de exemplo para outros orgaos.",
    "Solicito informacoes sobre os programas sociais disponiveis. "
    "Preciso saber quais documentos sao necessarios e onde devo "
    "comparecer para realizar meu cadastro.",
    "Denuncio irregularidade observada no local e data informados. "
    "Ha evidencias de uso indevido de recursos publicos. "
    "Solicito investigacao e providencias cabiveis.",
]

LOCAIS = [
    "UPA do Gama, Setor Central",
    "Rodoviaria do Plano Piloto",
    "Hospital Regional de Taguatinga",
    "Administracao Regional de Ceilandia",
    "Escola Classe 01 de Sobradinho",
    "Terminal de Onibus do Nucleo Bandeirante",
    "Parque da Cidade Sarah Kubitschek",
]

HORARIOS = ["manha", "tarde", "noite", "madrugada", "nao_lembro"]

NOMES = [
    "Maria Silva", "Joao Santos", "Ana Oliveira", "Carlos Souza",
    "Fernanda Lima", "Pedro Costa", "Juliana Almeida", "Rafael Pereira",
]

STATUSES = ["RECEBIDA", "EM_ANALISE", "RESPONDIDA", "ARQUIVADA"]

ADMIN_EMAIL = "admin@cgdf.gov.br"
ADMIN_SENHA = "admin123"


def random_phone():
    return f"(61) 9{random.randint(1000,9999)}-{random.randint(1000,9999)}"


def random_email(name):
    slug = name.lower().replace(" ", ".") + str(random.randint(1, 9999))
    return f"{slug}@email.com"


# ---------------------------------------------------------------------------
# Armazena protocolos e IDs criados para consultas posteriores
# ---------------------------------------------------------------------------

created_protocolos = []
created_ids = []


# ---------------------------------------------------------------------------
# Usuario Cidadao - 80% do trafego
# ---------------------------------------------------------------------------

class CidadaoUser(HttpUser):
    """Simula o cidadao que acessa o sistema para registrar manifestacoes
    e consultar protocolos existentes."""

    weight = 8  # 80% do trafego
    wait_time = between(1, 5)

    @tag("health")
    @task(1)
    def health_check(self):
        """Verifica disponibilidade do servico."""
        self.client.get("/health", name="/health")

    @tag("criar")
    @task(3)
    def criar_manifestacao(self):
        """Cria uma nova manifestacao - operacao mais pesada (escrita no banco)."""
        anonimo = random.choice([True, False])
        nome = random.choice(NOMES)

        payload = {
            "tipo": random.choice(TIPOS),
            "orgao": random.choice(ORGAOS),
            "assunto": random.choice(ASSUNTOS),
            "relato": random.choice(RELATOS),
            "local": random.choice(LOCAIS),
            "horarioFato": random.choice(HORARIOS),
            "pessoasEnvolvidas": "Servidor de plantao",
            "anonimo": anonimo,
        }

        if not anonimo:
            payload["nome"] = nome
            payload["email"] = random_email(nome)
            payload["telefone"] = random_phone()

        with self.client.post(
            "/api/manifestacoes",
            json=payload,
            name="/api/manifestacoes [POST]",
            catch_response=True,
        ) as response:
            if response.status_code == 201:
                data = response.json()
                protocolo = data.get("protocolo")
                manifestacao = data.get("manifestacao")
                if protocolo:
                    created_protocolos.append(protocolo)
                if manifestacao and manifestacao.get("id"):
                    created_ids.append(manifestacao["id"])
                response.success()
            else:
                response.failure(f"Status {response.status_code}: {response.text[:200]}")

    @tag("consultar")
    @task(5)
    def consultar_protocolo(self):
        """Consulta manifestacao por protocolo - operacao mais frequente."""
        if not created_protocolos:
            # Tenta protocolos do seed
            protocolo = random.choice([
                "2024-000001", "2024-000002", "2024-000003",
                "2024-000004", "2024-000005",
            ])
        else:
            protocolo = random.choice(created_protocolos)

        self.client.get(
            f"/api/manifestacoes/{protocolo}",
            name="/api/manifestacoes/:protocolo [GET]",
        )

    @tag("consultar")
    @task(1)
    def consultar_protocolo_inexistente(self):
        """Consulta protocolo que nao existe - testa o caminho de erro (404)."""
        self.client.get(
            "/api/manifestacoes/0000-000000",
            name="/api/manifestacoes/:protocolo [GET 404]",
        )


# ---------------------------------------------------------------------------
# Usuario Gestor (Admin) - 20% do trafego
# ---------------------------------------------------------------------------

class GestorUser(HttpUser):
    """Simula o gestor administrativo que acessa o painel para
    visualizar, filtrar e responder manifestacoes."""

    weight = 2  # 20% do trafego
    wait_time = between(2, 6)

    token = None

    def on_start(self):
        """Faz login ao iniciar para obter token JWT."""
        response = self.client.post(
            "/api/auth/login",
            json={"email": ADMIN_EMAIL, "senha": ADMIN_SENHA},
            name="/api/auth/login",
        )
        if response.status_code == 200:
            self.token = response.json().get("token")
        else:
            self.token = None

    def _headers(self):
        if self.token:
            return {"Authorization": f"Bearer {self.token}"}
        return {}

    @tag("admin")
    @task(3)
    def dashboard(self):
        """Acessa o dashboard de estatisticas."""
        self.client.get(
            "/api/admin/dashboard",
            headers=self._headers(),
            name="/api/admin/dashboard",
        )

    @tag("admin")
    @task(5)
    def listar_manifestacoes(self):
        """Lista manifestacoes com paginacao e filtros variados."""
        params = {"page": "1", "limit": "10"}

        # Adiciona filtros aleatorios
        filtro = random.choice(["none", "status", "tipo", "orgao", "search"])
        if filtro == "status":
            params["status"] = random.choice(STATUSES)
        elif filtro == "tipo":
            params["tipo"] = random.choice(TIPOS)
        elif filtro == "orgao":
            params["orgao"] = random.choice(ORGAOS)
        elif filtro == "search":
            params["search"] = random.choice(["atendimento", "transporte", "saude"])

        self.client.get(
            "/api/admin/manifestacoes",
            params=params,
            headers=self._headers(),
            name="/api/admin/manifestacoes [GET]",
        )

    @tag("admin")
    @task(3)
    def detalhe_manifestacao(self):
        """Visualiza detalhes de uma manifestacao especifica."""
        if not created_ids:
            return

        mid = random.choice(created_ids)
        self.client.get(
            f"/api/admin/manifestacoes/{mid}",
            headers=self._headers(),
            name="/api/admin/manifestacoes/:id [GET]",
        )

    @tag("admin")
    @task(2)
    def atualizar_status(self):
        """Atualiza status de uma manifestacao."""
        if not created_ids:
            return

        mid = random.choice(created_ids)
        novo_status = random.choice(STATUSES)

        self.client.patch(
            f"/api/admin/manifestacoes/{mid}/status",
            json={"status": novo_status},
            headers=self._headers(),
            name="/api/admin/manifestacoes/:id/status [PATCH]",
        )

    @tag("admin")
    @task(1)
    def responder_manifestacao(self):
        """Gestor responde a uma manifestacao."""
        if not created_ids:
            return

        mid = random.choice(created_ids)
        texto = (
            "Prezado(a) cidadao(a), agradecemos sua manifestacao. "
            "Informamos que sua demanda foi encaminhada ao setor "
            "responsavel para analise e providencias. "
            f"Ref. interna: {random.randint(1000, 9999)}."
        )

        self.client.post(
            f"/api/admin/manifestacoes/{mid}/resposta",
            json={"texto": texto},
            headers=self._headers(),
            name="/api/admin/manifestacoes/:id/resposta [POST]",
        )
