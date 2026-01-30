# Hackaton-C.AcessoInformacao

Trata-se do primeiro Hackaton em controle social promovido pe Controladoria Geral do Distrito Federal. Neste presente repositório contém o conteúdo referente a categoria de Acesso a Informação.

# Categoria Acesso à Informação

A CGDF disponibilizará no sítio eletrônico https://www.cg.df.gov.br/, um conjunto amostral de
pedidos de acesso à informação, recebidos pelo Governo do Distrito Federal e previamente
marcados como públicos. Parte dessas manifestações conterá dados sintéticos (simulações de
dados pessoais), criados exclusivamente para fins de teste, com o objetivo de permitir que os
participantes desenvolvam modelos capazes de identificar automaticamente pedidos que
contenham informações pessoais e que, portanto, deveriam ser classificados como não públicos.
Nenhum dado pessoal real será disponibilizado aos participantes.

# Execução do projeto

## Requisitos

**Opção 1**
- Node.js 20+
- npm

**Opção 2**
- Docker e Docker Compose (opcional)

### Opcao 1: npm (SQLite)

**Backend:**
```bash
cd backend
npm install
npm run setup:local   # Configura SQLite + migra + popula dados
npm run dev           # http://localhost:3001
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev           # http://localhost:5173
```

### Opcao 2: Docker Compose (PostgreSQL)


```bash
# Na raiz do projeto
docker-compose up -d

# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
# Postgres: localhost:5432
```

**Comandos uteis:**
```bash
docker-compose down          # Para os servicos
docker-compose down -v       # Para e remove volumes (reset banco)
docker-compose logs -f       # Ver logs
docker-compose logs backend  # Logs do backend
```

# Detalhes do projeto

## Estrutura do Projeto

```
/Hackaton-C.Ouvidoria

├── frontend/          # PWA React + TypeScript + Vite
├── backend/           # API Node.js + Express + Prisma
├── loadtest/          # Diretório de teste de carga
└── docker-compose.yml # Configuracao Docker
```

## Credenciais de Teste Gestor

Apos executar o seed:
- **Email:** admin@cgdf.gov.br
- **Senha:** admin123

## Funcionalidades

### Cidadao
- Registrar manifestacao (reclamacao, sugestao, elogio, denuncia, solicitacao)
- Descrever por texto ou audio gravado
- Anexar imagens e videos
- Opcao de anonimato
- Receber protocolo unico
- Consultar status por protocolo

### Gestor (Admin)
- Dashboard com estatisticas
- Listar e filtrar manifestacoes
- Atualizar status
- Responder manifestacoes

## Modelo de Manifestacao

Conforme Manual de Respostas da Ouvidoria Geral do DF:

| Campo | Descricao |
|-------|-----------|
| Relato | Relato completo do ocorrido|
| assunto | O que (objeto da demanda) |
| dataFato | Quando (data exata) |
| horarioFato | Horario ou periodo |
| local | Onde (com referencias) |
| pessoasEnvolvidas | Nomes e matriculas |

## Acessibilidade (WCAG 2.1 AA)

- Navegacao por teclado
- Labels e ARIA attributes
- Contraste de cores adequado
- Skip links
- Menu de acessibilidade (ajuste de fonte, alto contraste)

## Scripts do Backend

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run db:sqlite` | Configura para SQLite |
| `npm run db:postgres` | Configura para PostgreSQL |
| `npm run setup:local` | Setup completo local (SQLite) |
| `npm run prisma:studio` | Interface visual do banco |
| `npm run seed` | Popula dados de exemplo |

## Scripts do Frontend

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run preview` | Preview do build |

## API Endpoints

### Publicos
- `POST /api/manifestacoes` - Criar manifestacao
- `GET /api/manifestacoes/:protocolo` - Consultar por protocolo
- `POST /api/upload` - Upload de arquivos

### Admin (Autenticado)
- `POST /api/auth/login` - Login
- `GET /api/admin/dashboard` - Estatisticas
- `GET /api/admin/manifestacoes` - Listar
- `GET /api/admin/manifestacoes/:id` - Detalhes
- `PATCH /api/admin/manifestacoes/:id/status` - Atualizar status
- `POST /api/admin/manifestacoes/:id/resposta` - Responder

## Tecnologias

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Headless UI, PWA

**Backend:** Node.js, Express, TypeScript, Prisma, JWT, Multer

**Banco:** SQLite (dev local) / PostgreSQL (Docker)
