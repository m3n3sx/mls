#!/bin/bash

###############################################################################
# MASE Katalon Tests Runner
# Skrypt do automatycznego uruchamiania testów Katalon Studio
###############################################################################

# Kolory dla outputu
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ścieżki
KATALON_PATH="/home/ooxo/Pobrane/Katalon_Studio_Enterprise_Linux_64-10.3.2"
PROJECT_PATH="/var/www/html/wp-content/plugins/woow-admin/katalon-tests/MASE-Tests.prj"
REPORT_DIR="/var/www/html/wp-content/plugins/woow-admin/katalon-tests/Reports"
SCREENSHOT_DIR="/var/www/html/wp-content/plugins/woow-admin/katalon-tests/Screenshots"

# Funkcja wyświetlająca banner
show_banner() {
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║     Modern Admin Styler Enterprise - Katalon Tests       ║"
    echo "║                                                           ║"
    echo "║                    Test Runner v1.0                       ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Funkcja sprawdzająca wymagania
check_requirements() {
    echo -e "${YELLOW}Sprawdzanie wymagań...${NC}"
    
    # Sprawdź Katalon
    if [ ! -f "$KATALON_PATH/katalon" ]; then
        echo -e "${RED}✗ Katalon Studio nie znaleziony w: $KATALON_PATH${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Katalon Studio znaleziony${NC}"
    
    # Sprawdź projekt
    if [ ! -f "$PROJECT_PATH" ]; then
        echo -e "${RED}✗ Projekt nie znaleziony: $PROJECT_PATH${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Projekt MASE znaleziony${NC}"
    
    # Sprawdź WordPress
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/wp-admin)
    if ! echo "$HTTP_CODE" | grep -q "200\|301\|302"; then
        echo -e "${RED}✗ WordPress nie odpowiada na http://localhost/wp-admin${NC}"
        echo -e "${YELLOW}  Uruchom serwer: sudo systemctl start apache2 lub nginx${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ WordPress działa${NC}"
    
    # Sprawdź katalogi
    mkdir -p "$REPORT_DIR" "$SCREENSHOT_DIR"
    chmod 777 "$REPORT_DIR" "$SCREENSHOT_DIR" 2>/dev/null
    echo -e "${GREEN}✓ Katalogi przygotowane${NC}"
    
    echo ""
}

# Funkcja uruchamiająca test suite
run_test_suite() {
    local suite_path=$1
    local suite_name=$2
    local estimated_time=$3
    
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}Uruchamianie: ${suite_name}${NC}"
    echo -e "${YELLOW}Szacowany czas: ${estimated_time}${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local report_name="${suite_name}_${timestamp}"
    
    cd "$KATALON_PATH"
    
    ./katalon -noSplash -runMode=console \
        -projectPath="$PROJECT_PATH" \
        -retry=0 \
        -testSuitePath="$suite_path" \
        -browserType="Chrome" \
        -reportFolder="$REPORT_DIR" \
        -reportFileName="$report_name" \
        2>&1 | tee "$REPORT_DIR/${report_name}.log"
    
    local exit_code=${PIPESTATUS[0]}
    
    echo ""
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✓ Testy zakończone pomyślnie!${NC}"
    else
        echo -e "${RED}✗ Testy zakończone z błędami (kod: $exit_code)${NC}"
    fi
    
    echo -e "${BLUE}Raport: ${REPORT_DIR}/${report_name}.html${NC}"
    echo -e "${BLUE}Logi: ${REPORT_DIR}/${report_name}.log${NC}"
    echo -e "${BLUE}Zrzuty: ${SCREENSHOT_DIR}/${NC}"
    echo ""
    
    # Otwórz raport w przeglądarce (opcjonalnie)
    read -p "Otworzyć raport w przeglądarce? (t/n): " open_report
    if [ "$open_report" = "t" ] || [ "$open_report" = "T" ]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "$REPORT_DIR/${report_name}/${report_name}.html" 2>/dev/null &
        elif command -v firefox &> /dev/null; then
            firefox "$REPORT_DIR/${report_name}/${report_name}.html" 2>/dev/null &
        fi
    fi
    
    return $exit_code
}

# Funkcja wyświetlająca menu
show_menu() {
    echo -e "${YELLOW}Wybierz test suite do uruchomienia:${NC}"
    echo ""
    echo "  1. Smoke Tests (szybkie testy podstawowe)"
    echo "     Czas: ~5 minut | Testy: 6"
    echo ""
    echo "  2. Color Palettes (wszystkie palety kolorów)"
    echo "     Czas: ~30 minut | Testy: 10 palet"
    echo ""
    echo "  3. Templates (wszystkie szablony designu)"
    echo "     Czas: ~45 minut | Testy: 11 szablonów"
    echo ""
    echo "  4. Visual Effects (efekty wizualne)"
    echo "     Czas: ~20 minut | Testy: 5"
    echo ""
    echo "  5. Full Regression (wszystkie testy)"
    echo "     Czas: ~2-3 godziny | Testy: 50+"
    echo ""
    echo "  6. Custom (wybierz własny test case)"
    echo ""
    echo "  0. Wyjście"
    echo ""
}

# Funkcja uruchamiająca pojedynczy test case
run_single_test() {
    echo -e "${YELLOW}Dostępne test cases:${NC}"
    echo ""
    echo "  1. TC01 - WordPress Login"
    echo "  2. TC02 - Navigate to MASE"
    echo "  3. TC03 - Test All Color Palettes"
    echo "  4. TC04 - Test All Templates"
    echo "  5. TC44 - Live Preview Toggle"
    echo "  6. TC40 - Export Settings"
    echo "  7. TC41 - Import Settings"
    echo ""
    read -p "Wybierz test case (1-7): " tc_choice
    
    case $tc_choice in
        1) test_path="Test Cases/01-Login/TC01_WordPress_Login" ;;
        2) test_path="Test Cases/02-Navigation/TC02_Navigate_To_MASE" ;;
        3) test_path="Test Cases/03-ColorPalettes/TC03_Test_All_Color_Palettes" ;;
        4) test_path="Test Cases/04-Templates/TC04_Test_All_Templates" ;;
        5) test_path="Test Cases/12-LivePreview/TC44_Live_Preview_Toggle" ;;
        6) test_path="Test Cases/11-ImportExport/TC40_Export_Settings" ;;
        7) test_path="Test Cases/11-ImportExport/TC41_Import_Settings" ;;
        *)
            echo -e "${RED}Nieprawidłowy wybór${NC}"
            return 1
            ;;
    esac
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local report_name="SingleTest_${timestamp}"
    
    cd "$KATALON_PATH"
    
    ./katalon -noSplash -runMode=console \
        -projectPath="$PROJECT_PATH" \
        -retry=0 \
        -testCasePath="$test_path" \
        -browserType="Chrome" \
        -reportFolder="$REPORT_DIR" \
        -reportFileName="$report_name"
    
    echo -e "${GREEN}Test zakończony!${NC}"
    echo -e "${BLUE}Raport: ${REPORT_DIR}/${report_name}.html${NC}"
}

# Funkcja wyświetlająca statystyki
show_statistics() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}Statystyki testów MASE${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # Liczba zrzutów ekranu
    local screenshot_count=$(find "$SCREENSHOT_DIR" -type f -name "*.png" 2>/dev/null | wc -l)
    echo -e "Zrzuty ekranu: ${GREEN}${screenshot_count}${NC}"
    
    # Rozmiar zrzutów
    local screenshot_size=$(du -sh "$SCREENSHOT_DIR" 2>/dev/null | cut -f1)
    echo -e "Rozmiar zrzutów: ${GREEN}${screenshot_size}${NC}"
    
    # Liczba raportów
    local report_count=$(find "$REPORT_DIR" -type f -name "*.html" 2>/dev/null | wc -l)
    echo -e "Raporty: ${GREEN}${report_count}${NC}"
    
    # Ostatni test
    local last_report=$(ls -t "$REPORT_DIR"/*.html 2>/dev/null | head -1)
    if [ -n "$last_report" ]; then
        echo -e "Ostatni test: ${GREEN}$(basename "$last_report")${NC}"
    fi
    
    echo ""
}

# Funkcja czyszcząca stare wyniki
clean_old_results() {
    echo -e "${YELLOW}Czyszczenie starych wyników...${NC}"
    
    read -p "Usunąć wszystkie zrzuty ekranu? (t/n): " clean_screenshots
    if [ "$clean_screenshots" = "t" ] || [ "$clean_screenshots" = "T" ]; then
        rm -rf "$SCREENSHOT_DIR"/*
        echo -e "${GREEN}✓ Zrzuty ekranu usunięte${NC}"
    fi
    
    read -p "Usunąć wszystkie raporty? (t/n): " clean_reports
    if [ "$clean_reports" = "t" ] || [ "$clean_reports" = "T" ]; then
        rm -rf "$REPORT_DIR"/*
        echo -e "${GREEN}✓ Raporty usunięte${NC}"
    fi
    
    echo ""
}

# Główna funkcja
main() {
    show_banner
    check_requirements
    
    while true; do
        show_menu
        read -p "Wybór (0-6): " choice
        echo ""
        
        case $choice in
            1)
                run_test_suite "Test Suites/TS01_Smoke_Tests" "Smoke_Tests" "5 minut"
                ;;
            2)
                run_test_suite "Test Suites/TS03_Color_Palettes" "Color_Palettes" "30 minut"
                ;;
            3)
                run_test_suite "Test Suites/TS04_Templates" "Templates" "45 minut"
                ;;
            4)
                run_test_suite "Test Suites/TS05_Visual_Effects" "Visual_Effects" "20 minut"
                ;;
            5)
                echo -e "${RED}UWAGA: Ten test trwa 2-3 godziny!${NC}"
                read -p "Kontynuować? (t/n): " confirm
                if [ "$confirm" = "t" ] || [ "$confirm" = "T" ]; then
                    run_test_suite "Test Suites/TS02_Full_Regression" "Full_Regression" "2-3 godziny"
                fi
                ;;
            6)
                run_single_test
                ;;
            s|S)
                show_statistics
                ;;
            c|C)
                clean_old_results
                ;;
            0)
                echo -e "${GREEN}Do widzenia!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Nieprawidłowy wybór. Spróbuj ponownie.${NC}"
                echo ""
                ;;
        esac
        
        echo ""
        read -p "Naciśnij Enter aby kontynuować..."
        clear
        show_banner
    done
}

# Uruchom główną funkcję
main
