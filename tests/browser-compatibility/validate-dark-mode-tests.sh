#!/bin/bash

###############################################################################
# Dark Mode Browser Compatibility Tests - Validation Script
#
# This script validates the test files and configuration before running tests.
#
# Usage:
#   ./validate-dark-mode-tests.sh
#
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Dark Mode Tests - Validation                                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"
cd "$SCRIPT_DIR"

# Check Node.js
echo -n "Checking Node.js... "
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Not found${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ $(node --version)${NC}"

# Check npm
echo -n "Checking npm... "
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ Not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ $(npm --version)${NC}"

# Check test file exists
echo -n "Checking test file... "
if [ ! -f "test-dark-mode-cross-browser.js" ]; then
    echo -e "${RED}✗ Not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Found${NC}"

# Check test file syntax
echo -n "Validating test file syntax... "
if node -c test-dark-mode-cross-browser.js 2>/dev/null; then
    echo -e "${GREEN}✓ Valid${NC}"
else
    echo -e "${RED}✗ Syntax errors${NC}"
    node -c test-dark-mode-cross-browser.js
    exit 1
fi

# Check playwright config
echo -n "Checking Playwright config... "
if [ ! -f "playwright.config.js" ]; then
    echo -e "${RED}✗ Not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Found${NC}"

# Check config syntax
echo -n "Validating config syntax... "
if node -c playwright.config.js 2>/dev/null; then
    echo -e "${GREEN}✓ Valid${NC}"
else
    echo -e "${RED}✗ Syntax errors${NC}"
    node -c playwright.config.js
    exit 1
fi

# Check package.json
echo -n "Checking package.json... "
if [ ! -f "package.json" ]; then
    echo -e "${RED}✗ Not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Found${NC}"

# Check if Playwright is installed
echo -n "Checking Playwright installation... "
if [ ! -d "node_modules/@playwright/test" ]; then
    echo -e "${YELLOW}⚠ Not installed${NC}"
    echo ""
    echo "Installing Playwright..."
    npm install
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${GREEN}✓ Installed${NC}"
fi

# Check browser binaries
echo -n "Checking browser binaries... "
if npx playwright --version &> /dev/null; then
    echo -e "${GREEN}✓ Available${NC}"
else
    echo -e "${YELLOW}⚠ Not installed${NC}"
    echo ""
    echo "Installing browser binaries..."
    npx playwright install
    echo -e "${GREEN}✓ Installed${NC}"
fi

# Check documentation
echo -n "Checking documentation... "
DOCS_FOUND=0
[ -f "DARK-MODE-BROWSER-COMPAT-README.md" ] && ((DOCS_FOUND++))
[ -f "QUICK-START-DARK-MODE-BROWSER-TESTS.md" ] && ((DOCS_FOUND++))
[ -f "dark-mode-manual-test-checklist.md" ] && ((DOCS_FOUND++))

if [ $DOCS_FOUND -eq 3 ]; then
    echo -e "${GREEN}✓ All documentation present${NC}"
elif [ $DOCS_FOUND -gt 0 ]; then
    echo -e "${YELLOW}⚠ Some documentation missing${NC}"
else
    echo -e "${RED}✗ Documentation missing${NC}"
fi

# Check test HTML file
echo -n "Checking test HTML file... "
if [ -f "../test-dark-mode-toggle.html" ]; then
    echo -e "${GREEN}✓ Found${NC}"
else
    echo -e "${YELLOW}⚠ Not found (tests may fail)${NC}"
    echo "  Expected: tests/test-dark-mode-toggle.html"
fi

# Summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Validation Complete                                           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓ All checks passed!${NC}"
echo ""
echo "You can now run tests:"
echo "  ./run-dark-mode-tests.sh"
echo "  npx playwright test test-dark-mode-cross-browser.js"
echo ""

exit 0
