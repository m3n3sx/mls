#!/bin/bash

###############################################################################
# MASE Visual Testing Runner
# Automatyczne uruchamianie testów wizualnych
###############################################################################

set -e

# Kolory dla outputu
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║     MASE - Automatyczne Testy Wizualne v1.2.0           ║"
echo "║     Modern Admin Styler Enterprise                       ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Sprawdź czy jesteśmy w odpowiednim katalogu
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Błąd: Uruchom skrypt z katalogu tests/visual-testing/${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Przygotowanie środowiska testowego...${NC}"

# Utwórz katalogi jeśli nie istnieją
mkdir -p screenshots
mkdir -p reports
mkdir -p logs

echo -e "${GREEN}✓ Katalogi utworzone${NC}"

# Sprawdź czy Python jest zainstalowany
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo -e "${RED}❌ Python nie jest zainstalowany${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Python znaleziony: $PYTHON_CMD${NC}"

# Uruchom lokalny serwer
PORT=8765
echo -e "${YELLOW}🚀 Uruchamianie serwera testowego na porcie $PORT...${NC}"

# Zabij poprzedni proces jeśli istnieje
lsof -ti:$PORT | xargs kill -9 2>/dev/null || true

# Uruchom serwer w tle
$PYTHON_CMD -m http.server $PORT > logs/server.log 2>&1 &
SERVER_PID=$!

echo -e "${GREEN}✓ Serwer uruchomiony (PID: $SERVER_PID)${NC}"

# Poczekaj na uruchomienie serwera
sleep 2

# URL testów
TEST_URL="http://localhost:$PORT/index.html"

echo -e "${BLUE}🌐 URL testów: $TEST_URL${NC}"

# Sprawdź czy przeglądarka jest dostępna
if command -v google-chrome &> /dev/null; then
    BROWSER="google-chrome"
elif command -v chromium-browser &> /dev/null; then
    BROWSER="chromium-browser"
elif command -v firefox &> /dev/null; then
    BROWSER="firefox"
elif command -v open &> /dev/null; then
    BROWSER="open"
else
    echo -e "${YELLOW}⚠️  Nie znaleziono przeglądarki, otwórz ręcznie: $TEST_URL${NC}"
    BROWSER=""
fi

if [ ! -z "$BROWSER" ]; then
    echo -e "${YELLOW}🌐 Otwieranie przeglądarki: $BROWSER${NC}"
    $BROWSER "$TEST_URL" &
    sleep 3
fi

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║  ✓ Testy wizualne są gotowe do uruchomienia!            ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║  Instrukcje:                                             ║${NC}"
echo -e "${GREEN}║  1. Kliknij 'Uruchom Wszystkie Testy' w przeglądarce   ║${NC}"
echo -e "${GREEN}║  2. Poczekaj na zakończenie testów                      ║${NC}"
echo -e "${GREEN}║  3. Przejrzyj wyniki i screenshoty                      ║${NC}"
echo -e "${GREEN}║  4. Wygeneruj raport klikając 'Generuj Raport'         ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║  Aby zatrzymać serwer: Ctrl+C                           ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Funkcja czyszcząca
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Zatrzymywanie serwera...${NC}"
    kill $SERVER_PID 2>/dev/null || true
    echo -e "${GREEN}✓ Serwer zatrzymany${NC}"
    echo -e "${BLUE}👋 Do zobaczenia!${NC}"
    exit 0
}

# Przechwytuj Ctrl+C
trap cleanup INT TERM

# Czekaj na zakończenie
echo -e "${YELLOW}⏳ Serwer działa... Naciśnij Ctrl+C aby zatrzymać${NC}"
wait $SERVER_PID
