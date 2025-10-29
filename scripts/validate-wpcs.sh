#!/bin/bash
#
# WPCS Validation Script
# Validates PHP code against WordPress Coding Standards
#
# Usage: ./scripts/validate-wpcs.sh
#

set -e

echo "=========================================="
echo "WordPress Coding Standards Validation"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if phpcs is installed
if ! command -v phpcs &> /dev/null; then
    echo -e "${RED}Error: PHP_CodeSniffer (phpcs) is not installed${NC}"
    echo "Install with: composer global require squizlabs/php_codesniffer"
    exit 1
fi

# Check if WordPress standards are installed
if ! phpcs -i | grep -q "WordPress"; then
    echo -e "${YELLOW}Warning: WordPress Coding Standards not found${NC}"
    echo "Installing WordPress Coding Standards..."
    # Use PHPCSStandards version compatible with PHPCS 4.0
    composer global require --dev phpcsstandards/phpcsutils:"^1.0"
    composer global require --dev wp-coding-standards/wpcs:"^3.0"
    phpcs --config-set installed_paths ~/.composer/vendor/wp-coding-standards/wpcs,~/.composer/vendor/phpcsstandards/phpcsutils
fi

echo "Checking PHP files against WordPress Coding Standards..."
echo ""

# Files and directories to check
TARGETS=(
    "modern-admin-styler.php"
    "includes/"
)

# Temporary file for results
RESULTS_FILE=$(mktemp)

# Run phpcs
ERRORS=0
for target in "${TARGETS[@]}"; do
    if [ -e "$target" ]; then
        echo "Checking: $target"
        if phpcs --standard=WordPress --extensions=php --ignore=*/vendor/*,*/node_modules/* "$target" >> "$RESULTS_FILE" 2>&1; then
            echo -e "${GREEN}✓ $target passed${NC}"
        else
            echo -e "${RED}✗ $target has violations${NC}"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo -e "${YELLOW}⚠ $target not found, skipping${NC}"
    fi
done

echo ""
echo "=========================================="

# Display results
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}SUCCESS: All files pass WordPress Coding Standards${NC}"
    rm "$RESULTS_FILE"
    exit 0
else
    echo -e "${RED}FAILED: $ERRORS file(s) have coding standard violations${NC}"
    echo ""
    echo "Detailed violations:"
    echo "=========================================="
    cat "$RESULTS_FILE"
    rm "$RESULTS_FILE"
    echo ""
    echo "To fix automatically (where possible):"
    echo "  phpcbf --standard=WordPress includes/"
    exit 1
fi
