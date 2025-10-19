#!/bin/bash

###############################################################################
# MASE Detailed Visual Testing Runner
# Szczegółowe testy wszystkich opcji wtyczki
###############################################################################

set -e

# Kolory
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   MASE - Szczegółowe Testy Wizualne                     ║"
echo "║   Wszystkie opcje wtyczki                               ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}📋 Przygotowanie...${NC}"
mkdir -p screenshots reports logs

echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"
echo -e "${GREEN}✓ WordPress działa${NC}"
echo ""

echo -e "${YELLOW}⏱️  Szacowany czas: 30-40 minut${NC}"
echo -e "${YELLOW}📸 Oczekiwane zrzuty: 80-100${NC}"
echo ""

echo -e "${BLUE}🚀 Uruchamianie szczegółowych testów...${NC}"
echo ""

node playwright-detailed-tests.js 2>&1 | tee logs/detailed-test-run-$(date +%Y%m%d-%H%M%S).log

EXIT_CODE=${PIPESTATUS[0]}

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ Testy zakończone pomyślnie!                          ║${NC}"
    echo -e "${GREEN}║  📸 Zrzuty ekranu: screenshots/                         ║${NC}"
    echo -e "${GREEN}║  📊 Raporty: reports/                                   ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    
    # Otwórz najnowszy raport
    LATEST_REPORT=$(ls -t reports/detailed-report-*.html 2>/dev/null | head -1)
    if [ -n "$LATEST_REPORT" ]; then
        echo ""
        echo -e "${YELLOW}🌐 Otwieranie raportu...${NC}"
        if command -v xdg-open &> /dev/null; then
            xdg-open "$LATEST_REPORT"
        elif command -v open &> /dev/null; then
            open "$LATEST_REPORT"
        fi
    fi
else
    echo -e "${RED}❌ Testy zakończone z błędami${NC}"
fi

exit $EXIT_CODE
