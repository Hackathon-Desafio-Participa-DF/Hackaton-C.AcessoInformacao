#!/bin/bash
#
# Teste de Carga - Participa DF
# ==============================
# Executa testes incrementais para encontrar a capacidade maxima do servico.
#
# Ambiente simulado: single thread, 4GB RAM
#
# Uso: ./run_loadtest.sh [host]
#   Exemplo: ./run_loadtest.sh http://localhost:3001
#

set -e

HOST="${1:-http://localhost:3001}"
RESULTS_DIR="./results/$(date +%Y%m%d_%H%M%S)"
LOCUSTFILE="$(dirname "$0")/locustfile.py"

mkdir -p "$RESULTS_DIR"

echo "============================================="
echo "  Teste de Carga - Participa DF"
echo "============================================="
echo "Host: $HOST"
echo "Resultados: $RESULTS_DIR"
echo ""

# Verifica se o servidor esta rodando
echo "[*] Verificando servidor..."
if ! curl -s "$HOST/health" > /dev/null 2>&1; then
    echo "[ERRO] Servidor nao esta respondendo em $HOST"
    echo "       Inicie o backend antes de executar o teste."
    exit 1
fi
echo "[OK] Servidor respondendo."
echo ""

# ---------------------------------------------------------------------------
# Fase 1: Aquecimento - 10 usuarios, 1 minuto
# ---------------------------------------------------------------------------
echo "============================================="
echo "  FASE 1: Aquecimento (10 usuarios, 1 min)"
echo "============================================="
locust -f "$LOCUSTFILE" \
    --headless \
    --host "$HOST" \
    -u 10 -r 2 -t 1m \
    --csv "$RESULTS_DIR/fase1_aquecimento" \
    --html "$RESULTS_DIR/fase1_aquecimento.html" \
    --only-summary \
    2>&1 | tee "$RESULTS_DIR/fase1_output.log"
echo ""

# ---------------------------------------------------------------------------
# Fase 2: Carga moderada - 50 usuarios, 2 minutos
# ---------------------------------------------------------------------------
echo "============================================="
echo "  FASE 2: Carga Moderada (50 usuarios, 2 min)"
echo "============================================="
locust -f "$LOCUSTFILE" \
    --headless \
    --host "$HOST" \
    -u 50 -r 5 -t 2m \
    --csv "$RESULTS_DIR/fase2_moderada" \
    --html "$RESULTS_DIR/fase2_moderada.html" \
    --only-summary \
    2>&1 | tee "$RESULTS_DIR/fase2_output.log"
echo ""

# ---------------------------------------------------------------------------
# Fase 3: Carga alta - 100 usuarios, 2 minutos
# ---------------------------------------------------------------------------
echo "============================================="
echo "  FASE 3: Carga Alta (100 usuarios, 2 min)"
echo "============================================="
locust -f "$LOCUSTFILE" \
    --headless \
    --host "$HOST" \
    -u 100 -r 10 -t 2m \
    --csv "$RESULTS_DIR/fase3_alta" \
    --html "$RESULTS_DIR/fase3_alta.html" \
    --only-summary \
    2>&1 | tee "$RESULTS_DIR/fase3_output.log"
echo ""

# ---------------------------------------------------------------------------
# Fase 4: Estresse - 200 usuarios, 2 minutos
# ---------------------------------------------------------------------------
echo "============================================="
echo "  FASE 4: Estresse (200 usuarios, 2 min)"
echo "============================================="
locust -f "$LOCUSTFILE" \
    --headless \
    --host "$HOST" \
    -u 200 -r 20 -t 2m \
    --csv "$RESULTS_DIR/fase4_estresse" \
    --html "$RESULTS_DIR/fase4_estresse.html" \
    --only-summary \
    2>&1 | tee "$RESULTS_DIR/fase4_output.log"
echo ""

# ---------------------------------------------------------------------------
# Fase 5: Limite - 500 usuarios, 2 minutos
# ---------------------------------------------------------------------------
echo "============================================="
echo "  FASE 5: Limite (500 usuarios, 2 min)"
echo "============================================="
locust -f "$LOCUSTFILE" \
    --headless \
    --host "$HOST" \
    -u 500 -r 50 -t 2m \
    --csv "$RESULTS_DIR/fase5_limite" \
    --html "$RESULTS_DIR/fase5_limite.html" \
    --only-summary \
    2>&1 | tee "$RESULTS_DIR/fase5_output.log"
echo ""

# ---------------------------------------------------------------------------
# Resumo final
# ---------------------------------------------------------------------------
echo "============================================="
echo "  RESULTADO FINAL"
echo "============================================="
echo ""
echo "Relatorios HTML gerados em: $RESULTS_DIR/"
echo ""
echo "Arquivos CSV (para analise detalhada):"
ls -1 "$RESULTS_DIR"/*.csv 2>/dev/null || echo "  Nenhum CSV gerado"
echo ""
echo "Para comparar as fases, verifique:"
echo "  - RPS (Requests Per Second) de cada fase"
echo "  - Percentil 95 do tempo de resposta"
echo "  - Taxa de falhas (%)"
echo "  - O ponto onde RPS para de crescer = capacidade maxima"
echo ""
echo "============================================="
echo "  Teste concluido!"
echo "============================================="
