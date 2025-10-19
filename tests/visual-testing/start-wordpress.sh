#!/bin/bash

###############################################################################
# Uruchom WordPress dla testów Playwright
###############################################################################

set -e

# Kolory
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   WordPress Development Server                           ║"
echo "║   Dla testów Playwright                                  ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Sprawdź PHP
if ! command -v php &> /dev/null; then
    echo -e "${RED}❌ PHP nie jest zainstalowany${NC}"
    exit 1
fi

PHP_VERSION=$(php --version | head -1)
echo -e "${GREEN}✓ PHP znaleziony: $PHP_VERSION${NC}"

# Katalog WordPress
WP_DIR="/var/www/html"

if [ ! -f "$WP_DIR/wp-config.php" ]; then
    echo -e "${RED}❌ WordPress nie znaleziony w $WP_DIR${NC}"
    exit 1
fi

echo -e "${GREEN}✓ WordPress znaleziony w $WP_DIR${NC}"

# Port
PORT=80

echo ""
echo -e "${YELLOW}🚀 Uruchamianie serwera WordPress...${NC}"
echo -e "${BLUE}   Port: $PORT${NC}"
echo -e "${BLUE}   URL: http://localhost:$PORT${NC}"
echo ""

# Uruchom serwer
cd "$WP_DIR"
php -S localhost:$PORT -t "$WP_DIR"
