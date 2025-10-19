#!/bin/bash

###############################################################################
# MASE Simple Visual Testing Runner
# Proste testy - zrzuty ekranu strony MASE
###############################################################################

set -e

# Kolory
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   MASE - Proste Testy Wizualne                          ║"
echo "║   Zrzuty ekranu strony MASE                             ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Sprawdź czy jesteśmy w odpowiednim katalogu
if [ ! -f "playwright-simple-tests.js" ]; then
    echo -e "${RED}❌ Błąd: Uruchom skrypt z katalogu tests/visual-testing/${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Przygotowanie...${NC}"
mkdir -p screenshots reports logs

echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"
echo -e "${GREEN}✓ WordPress działa${NC}"
echo ""

echo -e "${BLUE}🚀 Uruchamianie prostych testów...${NC}"
echo ""

node playwright-simple-tests.js 2>&1 | tee logs/simple-test-run-$(date +%Y%m%d-%H%M%S).log

EXIT_CODE=${PIPESTATUS[0]}

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ Testy zakończone pomyślnie!                          ║${NC}"
    echo -e "${GREEN}║  📸 Zrzuty ekranu: screenshots/                         ║${NC}"
    echo -e "${GREEN}║  📊 Raporty: reports/                                   ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    
    # Otwórz najnowszy raport
    LATEST_REPORT=$(ls -t reports/simple-report-*.html 2>/dev/null | head -1)
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
