#!/bin/bash

###############################################################################
# MASE Playwright Visual Testing Runner
# Automatyczne testy wizualne z zrzutami ekranu
###############################################################################

set -e

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Banner
echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   MASE - Playwright Visual Testing v1.0.0               ║"
echo "║   Automatyczne testy z zrzutami ekranu                  ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Sprawdź czy jesteśmy w odpowiednim katalogu
if [ ! -f "playwright-visual-tests.js" ]; then
    echo -e "${RED}❌ Błąd: Uruchom skrypt z katalogu tests/visual-testing/${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Przygotowanie środowiska...${NC}"

# Utwórz katalogi
mkdir -p screenshots
mkdir -p screenshots/videos
mkdir -p reports
mkdir -p logs

echo -e "${GREEN}✓ Katalogi utworzone${NC}"

# Sprawdź Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js nie jest zainstalowany${NC}"
    echo -e "${YELLOW}Zainstaluj Node.js: https://nodejs.org/${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js znaleziony: $NODE_VERSION${NC}"

# Sprawdź czy package.json istnieje
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Brak pliku package.json${NC}"
    exit 1
fi

# Zainstaluj zależności jeśli potrzeba
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalowanie zależności...${NC}"
    npm install
    echo -e "${GREEN}✓ Zależności zainstalowane${NC}"
fi

# Sprawdź czy Playwright jest zainstalowany
if [ ! -d "node_modules/playwright" ]; then
    echo -e "${YELLOW}📦 Instalowanie Playwright...${NC}"
    npm install playwright
    echo -e "${GREEN}✓ Playwright zainstalowany${NC}"
fi

# Zainstaluj przeglądarki Playwright
echo -e "${YELLOW}🌐 Sprawdzanie przeglądarek Playwright...${NC}"
if [ ! -d "$HOME/.cache/ms-playwright" ]; then
    echo -e "${YELLOW}📥 Instalowanie przeglądarek Playwright...${NC}"
    npx playwright install chromium
    echo -e "${GREEN}✓ Przeglądarki zainstalowane${NC}"
else
    echo -e "${GREEN}✓ Przeglądarki już zainstalowane${NC}"
fi

# Sprawdź czy WordPress działa
echo -e "${YELLOW}🔍 Sprawdzanie WordPress...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/wp-login.php)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
    echo -e "${GREEN}✓ WordPress działa (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ WordPress nie odpowiada na http://localhost/${NC}"
    echo -e "${YELLOW}Upewnij się że WordPress jest uruchomiony${NC}"
    echo -e "${YELLOW}Sprawdź: systemctl status nginx${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║  ✓ Wszystko gotowe do uruchomienia testów!              ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Uruchom testy
echo -e "${BLUE}🚀 Uruchamianie testów Playwright...${NC}"
echo ""

node playwright-visual-tests.js 2>&1 | tee logs/test-run-$(date +%Y%m%d-%H%M%S).log

EXIT_CODE=${PIPESTATUS[0]}

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}║  ✅ Testy zakończone pomyślnie!                          ║${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}║  📸 Zrzuty ekranu: screenshots/                         ║${NC}"
    echo -e "${GREEN}║  📊 Raporty: reports/                                   ║${NC}"
    echo -e "${GREEN}║  📹 Wideo: screenshots/videos/                          ║${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    
    # Otwórz najnowszy raport
    LATEST_REPORT=$(ls -t reports/*.html 2>/dev/null | head -1)
    if [ -n "$LATEST_REPORT" ]; then
        echo ""
        echo -e "${YELLOW}🌐 Otwieranie raportu...${NC}"
        if command -v xdg-open &> /dev/null; then
            xdg-open "$LATEST_REPORT"
        elif command -v open &> /dev/null; then
            open "$LATEST_REPORT"
        else
            echo -e "${YELLOW}Otwórz ręcznie: $LATEST_REPORT${NC}"
        fi
    fi
else
    echo -e "${RED}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                           ║${NC}"
    echo -e "${RED}║  ❌ Testy zakończone z błędami                           ║${NC}"
    echo -e "${RED}║                                                           ║${NC}"
    echo -e "${RED}║  Sprawdź logi: logs/                                     ║${NC}"
    echo -e "${RED}║                                                           ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════╝${NC}"
fi

exit $EXIT_CODE
