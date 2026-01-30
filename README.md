# Hackaton-C.Ouvidoria

Trata-se do primeiro Hackaton em controle social promovido pela Controladoria Geral do Distrito Federal. Neste presente repositório contém o conteúdo referente a categoria de Ouvidoria.

# Categoria Ouvidoria

O desafio da categoria Ouvidoria consiste no desenvolvimento de uma versão PWA do
Sistema Participa DF, que amplie o acesso e a inclusão dos cidadãos na abertura de manifestações.
A solução deverá contemplar recursos de acessibilidade e permitir o envio de relatos em múltiplos
formatos, como texto e áudio, com possibilidade de anexar imagem e vídeo, além de assegurar
anonimato opcional, emissão de protocolo e conformidade com as diretrizes de acessibilidade
digital (WCAG).

# Execução do projeto

## Requisitos

- Node.js 20+
- npm

## Instalação e execução

> **Importante:** o backend e o frontend devem ser executados em **terminais separados**, pois são serviços independentes.

### Terminal 1 - Backend (API)

Consulte o passo a passo completo de configuração do ambiente em [backend/README.md](backend/README.md).

Resumo rápido:

```bash
cd backend
npm install
# Crie o arquivo .env (veja backend/README.md para detalhes)
npm run setup         # Cria banco, migra e popula dados
npm run dev           # http://localhost:3001
```

### Terminal 2 - Frontend (PWA)

```bash
cd frontend
npm install
npm run dev           # http://localhost:5173
```

Após ambos os serviços estarem rodando, acesse **http://localhost:5173** no navegador.

## Credenciais de Teste (Gestor)

Após executar o seed:
- **Email:** admin@cgdf.gov.br
- **Senha:** admin123

## Testes

```bash
# Backend (no diretório backend/)
npm test

# Frontend (no diretório frontend/)
npm test
```

# Detalhes do projeto

## Estrutura do Projeto

```
OUV/
├── frontend/          # PWA React + TypeScript + Vite
├── backend/           # API Node.js + Express + Prisma
└── loadtest/          # Testes de carga (Locust / Python)
```

## Funcionalidades

### Cidadão
- Registrar manifestação (reclamação, sugestão, elogio, denúncia, solicitação)
- Descrever por texto ou áudio gravado
- Anexar imagens e vídeos
- Opção de anonimato
- Receber protocolo único
- Consultar status por protocolo

### Gestor (Admin)
- Dashboard com estatísticas
- Listar e filtrar manifestações
- Atualizar status
- Responder manifestações

## Modelo de Manifestação

Conforme Manual de Respostas da Ouvidoria Geral do DF:

| Campo | Descrição |
|-------|-----------|
| Relato | Relato completo do ocorrido |
| Assunto | O quê (objeto da demanda) |
| Data do Fato | Quando (data exata) |
| Horário do Fato | Horário ou período |
| Local | Onde (com referências) |
| Pessoas Envolvidas | Nomes e matrículas |

## Acessibilidade (WCAG 2.1 AA)

- Navegação por teclado
- Labels e ARIA attributes
- Contraste de cores adequado
- Skip links
- Menu de acessibilidade (ajuste de fonte, alto contraste)

## API Endpoints

### Públicos
- `POST /api/manifestacoes` - Criar manifestação
- `GET /api/manifestacoes/:protocolo` - Consultar por protocolo
- `POST /api/upload` - Upload de arquivos

### Admin (Autenticado)
- `POST /api/auth/login` - Login
- `GET /api/admin/dashboard` - Estatísticas
- `GET /api/admin/manifestacoes` - Listar
- `GET /api/admin/manifestacoes/:id` - Detalhes
- `PATCH /api/admin/manifestacoes/:id/status` - Atualizar status
- `POST /api/admin/manifestacoes/:id/resposta` - Responder

## Tecnologias

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Headless UI, PWA

**Backend:** Node.js, Express, TypeScript, Prisma, JWT, Multer

**Banco:** SQLite

**Testes:** Vitest (unitários), Locust (carga)
