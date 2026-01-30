# Backend - Participa DF (API)

API REST do sistema de ouvidoria, construída com Node.js, Express, TypeScript e Prisma ORM.

## Configuração do ambiente

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Criar o arquivo `.env`

Crie o arquivo `.env` na raiz da pasta `backend/`:

```bash
cp .env.example .env
```

Ou crie manualmente o arquivo `backend/.env` com o seguinte conteúdo:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="participa-df-secret-key-change-in-production"
PORT=3001
UPLOAD_DIR="./uploads"
```

| Variável | Descrição | Valor padrão |
|----------|-----------|--------------|
| `DATABASE_URL` | Caminho do banco SQLite | `file:./dev.db` |
| `JWT_SECRET` | Chave secreta para geração de tokens JWT | `default-secret` |
| `PORT` | Porta do servidor | `3001` |
| `UPLOAD_DIR` | Diretório para arquivos enviados | `./uploads` |

### 3. Configurar o banco de dados

Execute o comando abaixo para criar o banco, aplicar as migrações e popular com dados iniciais:

```bash
npm run setup
```

Esse comando executa em sequência:
1. Remove o banco anterior (se existir)
2. Gera o Prisma Client
3. Aplica as migrações
4. Executa o seed (dados de exemplo)

### 4. Iniciar o servidor

```bash
npm run dev
```

O servidor estará disponível em **http://localhost:3001**.

Para verificar se está funcionando:

```bash
curl http://localhost:3001/health
```

## Credenciais de teste

Após o seed:
- **Email:** admin@cgdf.gov.br
- **Senha:** admin123

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm start` | Executa o build compilado |
| `npm run setup` | Setup completo (reset + migrate + seed) |
| `npm run db:reset` | Remove o banco SQLite |
| `npm run seed` | Popula o banco com dados de exemplo |
| `npm run prisma:studio` | Abre interface visual do banco |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate` | Cria/aplica migrações |
| `npm test` | Executa testes unitários |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:coverage` | Testes com relatório de cobertura |
