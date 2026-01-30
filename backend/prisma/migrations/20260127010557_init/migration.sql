-- CreateTable
CREATE TABLE "Manifestacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "protocolo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "orgao" TEXT NOT NULL,
    "descricao" TEXT,
    "audioUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RECEBIDA',
    "anonimo" BOOLEAN NOT NULL DEFAULT false,
    "nome" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Anexo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "manifestacaoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Anexo_manifestacaoId_fkey" FOREIGN KEY ("manifestacaoId") REFERENCES "Manifestacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Resposta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "texto" TEXT NOT NULL,
    "gestorId" TEXT NOT NULL,
    "manifestacaoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Resposta_gestorId_fkey" FOREIGN KEY ("gestorId") REFERENCES "Gestor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Resposta_manifestacaoId_fkey" FOREIGN KEY ("manifestacaoId") REFERENCES "Manifestacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Gestor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "orgao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Manifestacao_protocolo_key" ON "Manifestacao"("protocolo");

-- CreateIndex
CREATE INDEX "Manifestacao_protocolo_idx" ON "Manifestacao"("protocolo");

-- CreateIndex
CREATE INDEX "Manifestacao_status_idx" ON "Manifestacao"("status");

-- CreateIndex
CREATE INDEX "Manifestacao_tipo_idx" ON "Manifestacao"("tipo");

-- CreateIndex
CREATE INDEX "Manifestacao_orgao_idx" ON "Manifestacao"("orgao");

-- CreateIndex
CREATE INDEX "Manifestacao_createdAt_idx" ON "Manifestacao"("createdAt");

-- CreateIndex
CREATE INDEX "Anexo_manifestacaoId_idx" ON "Anexo"("manifestacaoId");

-- CreateIndex
CREATE INDEX "Resposta_manifestacaoId_idx" ON "Resposta"("manifestacaoId");

-- CreateIndex
CREATE INDEX "Resposta_gestorId_idx" ON "Resposta"("gestorId");

-- CreateIndex
CREATE UNIQUE INDEX "Gestor_email_key" ON "Gestor"("email");

-- CreateIndex
CREATE INDEX "Gestor_email_idx" ON "Gestor"("email");
