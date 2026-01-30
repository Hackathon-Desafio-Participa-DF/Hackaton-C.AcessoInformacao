/*
  Warnings:

  - You are about to drop the column `descricao` on the `Manifestacao` table. All the data in the column will be lost.
  - Added the required column `assunto` to the `Manifestacao` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Manifestacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "protocolo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "orgao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEBIDA',
    "anonimo" BOOLEAN NOT NULL DEFAULT false,
    "assunto" TEXT NOT NULL,
    "dataFato" DATETIME,
    "horarioFato" TEXT,
    "local" TEXT,
    "pessoasEnvolvidas" TEXT,
    "informacoesComplementares" TEXT,
    "audioUrl" TEXT,
    "nome" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Manifestacao" ("anonimo", "audioUrl", "createdAt", "email", "id", "nome", "orgao", "protocolo", "status", "telefone", "tipo", "updatedAt") SELECT "anonimo", "audioUrl", "createdAt", "email", "id", "nome", "orgao", "protocolo", "status", "telefone", "tipo", "updatedAt" FROM "Manifestacao";
DROP TABLE "Manifestacao";
ALTER TABLE "new_Manifestacao" RENAME TO "Manifestacao";
CREATE UNIQUE INDEX "Manifestacao_protocolo_key" ON "Manifestacao"("protocolo");
CREATE INDEX "Manifestacao_protocolo_idx" ON "Manifestacao"("protocolo");
CREATE INDEX "Manifestacao_status_idx" ON "Manifestacao"("status");
CREATE INDEX "Manifestacao_tipo_idx" ON "Manifestacao"("tipo");
CREATE INDEX "Manifestacao_orgao_idx" ON "Manifestacao"("orgao");
CREATE INDEX "Manifestacao_createdAt_idx" ON "Manifestacao"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
