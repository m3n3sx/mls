#!/bin/bash
#
# PHP Syntax Checker
# Validates PHP syntax across all PHP files
#
# Usage: ./scripts/check-php-syntax.sh
#

set -e

echo "=========================================="
echo "PHP Syntax Validation"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo -e "${RED}Error: PHP is not installed${NC}"
    exit 1
fi

echo "PHP Version: $(php -v | head -n 1)"
echo ""
echo "Checking PHP syntax..."
echo ""

# Find all PHP files
PHP_FILES=$(find . -name "*.php" -not -path "*/vendor/*" -not -path "*/node_modules/*" -not -path "*/tests/*")

# Counter for errors
ERRORS=0
TOTAL=0

# Check each file
for file in $PHP_FILES; do
    TOTAL=$((TOTAL + 1))
    if php -l "$file" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file"
        php -l "$file"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""
echo "=========================================="
echo "Checked $TOTAL files"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}SUCCESS: All PHP files have valid syntax${NC}"
    exit 0
else
    echo -e "${RED}FAILED: $ERRORS file(s) have syntax errors${NC}"
    exit 1
fi
