#!/bin/sh
set -e

echo "Aguardando banco de dados..."
sleep 2

echo "Aplicando migracoes..."
npx prisma db push --accept-data-loss

echo "Verificando se precisa popular dados..."
npm run seed 2>/dev/null || echo "Seed ja executado ou erro ignorado"

echo "Iniciando servidor..."
exec npm run dev
