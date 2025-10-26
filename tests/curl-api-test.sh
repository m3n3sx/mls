#!/bin/bash

###############################################################################
# MASE API Test Script
# 
# Testuje podstawową funkcjonalność MASE poprzez HTTP requests
###############################################################################

BASE_URL="http://localhost:8080"
ADMIN_USER="admin"
ADMIN_PASS="admin"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
TOTAL=0

# Test function
test_case() {
    TOTAL=$((TOTAL + 1))
    echo -e "\n${BLUE}▶ TEST $TOTAL: $1${NC}"
}

pass() {
    PASSED=$((PASSED + 1))
    echo -e "${GREEN}✓ PASSED: $1${NC}"
}

fail() {
    FAILED=$((FAILED + 1))
    echo -e "${RED}✗ FAILED: $1${NC}"
}

echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 MASE API Test Suite${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"

# TEST 1: WordPress is accessible
test_case "WordPress jest dostępny"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
    pass "WordPress odpowiada (HTTP $HTTP_CODE)"
else
    fail "WordPress nie odpowiada (HTTP $HTTP_CODE)"
fi

# TEST 2: WordPress admin is accessible
test_case "WordPress admin jest dostępny"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/wp-admin/")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
    pass "WordPress admin odpowiada (HTTP $HTTP_CODE)"
else
    fail "WordPress admin nie odpowiada (HTTP $HTTP_CODE)"
fi

# TEST 3: MASE plugin files exist
test_case "Pliki pluginu MASE istnieją"
if [ -f "modern-admin-styler.php" ]; then
    pass "Główny plik pluginu istnieje"
else
    fail "Główny plik pluginu nie istnieje"
fi

# TEST 4: MASE JavaScript files exist
test_case "Pliki JavaScript MASE istnieją"
if [ -f "assets/js/mase-admin.js" ]; then
    pass "mase-admin.js istnieje"
else
    fail "mase-admin.js nie istnieje"
fi

# TEST 5: MASE CSS files exist
test_case "Pliki CSS MASE istnieją"
if [ -f "assets/css/mase-admin.css" ]; then
    pass "mase-admin.css istnieje"
else
    fail "mase-admin.css nie istnieje"
fi

# TEST 6: MASE classes exist
test_case "Klasy PHP MASE istnieją"
if [ -f "includes/class-mase-admin.php" ]; then
    pass "class-mase-admin.php istnieje"
else
    fail "class-mase-admin.php nie istnieje"
fi

# TEST 7: Check for syntax errors in main plugin file
test_case "Sprawdzanie składni PHP w głównym pliku"
php -l modern-admin-styler.php > /dev/null 2>&1
if [ $? -eq 0 ]; then
    pass "Brak błędów składni w modern-admin-styler.php"
else
    fail "Błędy składni w modern-admin-styler.php"
fi

# TEST 8: Check for syntax errors in admin class
test_case "Sprawdzanie składni PHP w class-mase-admin.php"
php -l includes/class-mase-admin.php > /dev/null 2>&1
if [ $? -eq 0 ]; then
    pass "Brak błędów składni w class-mase-admin.php"
else
    fail "Błędy składni w class-mase-admin.php"
fi

# TEST 9: Check JavaScript syntax
test_case "Sprawdzanie składni JavaScript"
if command -v node &> /dev/null; then
    node -c assets/js/mase-admin.js > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        pass "Brak błędów składni w mase-admin.js"
    else
        fail "Błędy składni w mase-admin.js"
    fi
else
    echo -e "${YELLOW}⚠ Node.js nie jest zainstalowany, pomijam test${NC}"
fi

# TEST 10: Check file permissions
test_case "Sprawdzanie uprawnień plików"
if [ -r "modern-admin-styler.php" ]; then
    pass "Plik główny jest czytelny"
else
    fail "Plik główny nie jest czytelny"
fi

# TEST 11: Check if assets directory exists
test_case "Sprawdzanie struktury katalogów"
if [ -d "assets" ] && [ -d "includes" ]; then
    pass "Struktura katalogów jest poprawna"
else
    fail "Brak wymaganych katalogów"
fi

# TEST 12: Check for required JavaScript modules
test_case "Sprawdzanie modułów JavaScript"
MODULES_IN_MODULES=("mase-gradient-builder.js" "mase-asset-loader.js" "mase-compatibility.js")
MODULES_IN_JS=("mase-pattern-library.js" "mase-position-picker.js")
MISSING=0
for module in "${MODULES_IN_MODULES[@]}"; do
    if [ ! -f "assets/js/modules/$module" ]; then
        MISSING=$((MISSING + 1))
    fi
done
for module in "${MODULES_IN_JS[@]}"; do
    if [ ! -f "assets/js/$module" ]; then
        MISSING=$((MISSING + 1))
    fi
done
if [ $MISSING -eq 0 ]; then
    pass "Wszystkie moduły JavaScript istnieją"
else
    fail "$MISSING modułów JavaScript brakuje"
fi

# TEST 13: Check for required CSS files
test_case "Sprawdzanie plików CSS"
CSS_FILES=("mase-admin.css" "mase-palettes.css" "mase-templates.css")
MISSING=0
for css in "${CSS_FILES[@]}"; do
    if [ ! -f "assets/css/$css" ]; then
        MISSING=$((MISSING + 1))
    fi
done
if [ $MISSING -eq 0 ]; then
    pass "Wszystkie pliki CSS istnieją"
else
    fail "$MISSING plików CSS brakuje"
fi

# TEST 14: Check for required PHP classes
test_case "Sprawdzanie klas PHP"
CLASSES=("class-mase-admin.php" "class-mase-settings.php" "class-mase-css-generator.php")
MISSING=0
for class in "${CLASSES[@]}"; do
    if [ ! -f "includes/$class" ]; then
        MISSING=$((MISSING + 1))
    fi
done
if [ $MISSING -eq 0 ]; then
    pass "Wszystkie klasy PHP istnieją"
else
    fail "$MISSING klas PHP brakuje"
fi

# TEST 15: Check file sizes (basic sanity check)
test_case "Sprawdzanie rozmiarów plików"
MAIN_SIZE=$(stat -f%z modern-admin-styler.php 2>/dev/null || stat -c%s modern-admin-styler.php 2>/dev/null)
if [ "$MAIN_SIZE" -gt 1000 ]; then
    pass "Główny plik ma rozsądny rozmiar ($MAIN_SIZE bytes)"
else
    fail "Główny plik jest podejrzanie mały ($MAIN_SIZE bytes)"
fi

# Summary
echo -e "\n${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}📊 WYNIKI TESTÓW${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "\nCałkowita liczba testów: ${BLUE}$TOTAL${NC}"
echo -e "${GREEN}✓ Zaliczone: $PASSED${NC}"
echo -e "${RED}✗ Niezaliczone: $FAILED${NC}"

PASS_RATE=$(echo "scale=1; $PASSED * 100 / $TOTAL" | bc)
echo -e "Wskaźnik powodzenia: ${BLUE}${PASS_RATE}%${NC}"

echo -e "\n${GREEN}═══════════════════════════════════════════${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 WSZYSTKIE TESTY ZALICZONE!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  NIEKTÓRE TESTY NIE POWIODŁY SIĘ${NC}"
    exit 1
fi
