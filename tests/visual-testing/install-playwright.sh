#!/bin/bash

###############################################################################
# MASE Playwright - Instalator
# Automatyczna instalacja wszystkich wymagań
###############################################################################

set -e

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   MASE Playwright - Instalator                          ║"
echo "║   Automatyczna instalacja wszystkich wymagań             ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Funkcja sprawdzająca
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓ $1 jest zainstalowany${NC}"
        return 0
    else
        echo -e "${RED}✗ $1 nie jest zainstalowany${NC}"
        return 1
    fi
}

# Sprawdź Node.js
echo -e "${BLUE}1. Sprawdzanie Node.js...${NC}"
if check_command node; then
    NODE_VERSION=$(node --version)
    echo -e "  Wersja: ${GREEN}$NODE_VERSION${NC}"
else
    echo -e "${YELLOW}  Instalowanie Node.js...${NC}"
    
    # Wykryj system operacyjny
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            # Debian/Ubuntu
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif command -v yum &> /dev/null; then
            # CentOS/RHEL
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            sudo yum install -y nodejs
        else
            echo -e "${RED}  Nieobsługiwany system Linux. Zainstaluj Node.js ręcznie.${NC}"
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install node
        else
            echo -e "${RED}  Homebrew nie jest zainstalowany. Zainstaluj Node.js ręcznie.${NC}"
            exit 1
        fi
    else
        echo -e "${RED}  Nieobsługiwany system operacyjny. Zainstaluj Node.js ręcznie.${NC}"
        exit 1
    fi
    
    if check_command node; then
        echo -e "${GREEN}  ✓ Node.js zainstalowany pomyślnie${NC}"
    else
        echo -e "${RED}  ✗ Instalacja Node.js nie powiodła się${NC}"
        exit 1
    fi
fi
echo ""

# Sprawdź npm
echo -e "${BLUE}2. Sprawdzanie npm...${NC}"
if check_command npm; then
    NPM_VERSION=$(npm --version)
    echo -e "  Wersja: ${GREEN}$NPM_VERSION${NC}"
else
    echo -e "${RED}  npm powinien być zainstalowany z Node.js${NC}"
    exit 1
fi
echo ""

# Utwórz katalogi
echo -e "${BLUE}3. Tworzenie katalogów...${NC}"
mkdir -p screenshots
mkdir -p screenshots/videos
mkdir -p reports
mkdir -p logs
echo -e "${GREEN}✓ Katalogi utworzone${NC}"
echo ""

# Zainstaluj zależności npm
echo -e "${BLUE}4. Instalowanie zależności npm...${NC}"
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✓ Zależności zainstalowane${NC}"
else
    echo -e "${RED}✗ Brak pliku package.json${NC}"
    exit 1
fi
echo ""

# Zainstaluj przeglądarki Playwright
echo -e "${BLUE}5. Instalowanie przeglądarek Playwright...${NC}"
echo -e "${YELLOW}  To może potrwać kilka minut (~170MB)...${NC}"
npx playwright install chromium
echo -e "${GREEN}✓ Przeglądarka Chromium zainstalowana${NC}"
echo ""

# Sprawdź WordPress
echo -e "${BLUE}6. Sprawdzanie WordPress...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost/wp-login.php | grep -q "200"; then
    echo -e "${GREEN}✓ WordPress działa na http://localhost/${NC}"
else
    echo -e "${YELLOW}⚠️  WordPress nie odpowiada na http://localhost/${NC}"
    echo -e "${YELLOW}  Upewnij się że WordPress jest uruchomiony przed testami${NC}"
fi
echo ""

# Ustaw uprawnienia
echo -e "${BLUE}7. Ustawianie uprawnień...${NC}"
chmod +x run-playwright-tests.sh
chmod +x install-playwright.sh
chmod -R 755 screenshots reports logs
echo -e "${GREEN}✓ Uprawnienia ustawione${NC}"
echo ""

# Podsumowanie
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║  ✅ Instalacja zakończona pomyślnie!                     ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║  Aby uruchomić testy:                                    ║${NC}"
echo -e "${GREEN}║  ./run-playwright-tests.sh                               ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║  Dokumentacja:                                           ║${NC}"
echo -e "${GREEN}║  cat PLAYWRIGHT-GUIDE.md                                 ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Weryfikacja końcowa
echo -e "${BLUE}Weryfikacja instalacji:${NC}"
echo -e "  Node.js: ${GREEN}$(node --version)${NC}"
echo -e "  npm: ${GREEN}$(npm --version)${NC}"
echo -e "  Playwright: ${GREEN}$(npm list playwright 2>/dev/null | grep playwright | awk '{print $2}')${NC}"
echo ""

echo -e "${YELLOW}💡 Wskazówka: Przeczytaj PLAYWRIGHT-GUIDE.md aby dowiedzieć się więcej${NC}"
echo ""
