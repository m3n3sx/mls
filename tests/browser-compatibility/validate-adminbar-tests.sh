#!/bin/bash

###############################################################################
# Validation Script for Admin Bar Enhancement Browser Compatibility Tests
# 
# Validates that all test files are properly created and configured
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Validating Admin Bar Enhancement Browser Tests               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

ERRORS=0

# Check test files exist
echo -e "${BLUE}Checking test files...${NC}"

if [ -f "test-adminbar-enhancement-browser-compat.js" ]; then
    echo -e "${GREEN}✓ test-adminbar-enhancement-browser-compat.js${NC}"
else
    echo -e "${RED}✗ test-adminbar-enhancement-browser-compat.js NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "run-adminbar-enhancement-tests.sh" ]; then
    echo -e "${GREEN}✓ run-adminbar-enhancement-tests.sh${NC}"
else
    echo -e "${RED}✗ run-adminbar-enhancement-tests.sh NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "ADMINBAR-ENHANCEMENT-BROWSER-TESTS-README.md" ]; then
    echo -e "${GREEN}✓ ADMINBAR-ENHANCEMENT-BROWSER-TESTS-README.md${NC}"
else
    echo -e "${RED}✗ ADMINBAR-ENHANCEMENT-BROWSER-TESTS-README.md NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check test file structure
echo -e "${BLUE}Validating test file structure...${NC}"

if grep -q "Test Suite: Chrome 90+ Compatibility" test-adminbar-enhancement-browser-compat.js; then
    echo -e "${GREEN}✓ Chrome 90+ test suite (Task 19.1)${NC}"
else
    echo -e "${RED}✗ Chrome 90+ test suite missing${NC}"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "Test Suite: Firefox 88+ Compatibility" test-adminbar-enhancement-browser-compat.js; then
    echo -e "${GREEN}✓ Firefox 88+ test suite (Task 19.2)${NC}"
else
    echo -e "${RED}✗ Firefox 88+ test suite missing${NC}"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "Test Suite: Safari 14+ Compatibility" test-adminbar-enhancement-browser-compat.js; then
    echo -e "${GREEN}✓ Safari 14+ test suite (Task 19.3)${NC}"
else
    echo -e "${RED}✗ Safari 14+ test suite missing${NC}"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "Test Suite: Edge 90+ Compatibility" test-adminbar-enhancement-browser-compat.js; then
    echo -e "${GREEN}✓ Edge 90+ test suite (Task 19.4)${NC}"
else
    echo -e "${RED}✗ Edge 90+ test suite missing${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check for key features being tested
echo -e "${BLUE}Validating feature coverage...${NC}"

FEATURES=(
    "gradient"
    "backdrop-filter"
    "flexbox"
    "border-radius"
    "box-shadow"
    "Google Fonts"
    "live preview"
)

for feature in "${FEATURES[@]}"; do
    if grep -qi "$feature" test-adminbar-enhancement-browser-compat.js; then
        echo -e "${GREEN}✓ ${feature} tests${NC}"
    else
        echo -e "${YELLOW}⚠ ${feature} tests may be missing${NC}"
    fi
done

echo ""

# Check package.json
echo -e "${BLUE}Checking package.json...${NC}"

if [ -f "package.json" ]; then
    if grep -q "@playwright/test" package.json; then
        echo -e "${GREEN}✓ Playwright dependency configured${NC}"
    else
        echo -e "${RED}✗ Playwright dependency missing${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗ package.json NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check playwright.config.js
echo -e "${BLUE}Checking Playwright configuration...${NC}"

if [ -f "playwright.config.js" ]; then
    echo -e "${GREEN}✓ playwright.config.js exists${NC}"
    
    if grep -q "chromium" playwright.config.js; then
        echo -e "${GREEN}✓ Chrome/Chromium configured${NC}"
    fi
    
    if grep -q "firefox" playwright.config.js; then
        echo -e "${GREEN}✓ Firefox configured${NC}"
    fi
    
    if grep -q "webkit" playwright.config.js; then
        echo -e "${GREEN}✓ Safari/WebKit configured${NC}"
    fi
    
    if grep -q "edge" playwright.config.js; then
        echo -e "${GREEN}✓ Edge configured${NC}"
    fi
else
    echo -e "${RED}✗ playwright.config.js NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Validation Summary                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All validation checks PASSED${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "  1. Install dependencies: npm install"
    echo "  2. Install browsers: npx playwright install"
    echo "  3. Run tests: ./run-adminbar-enhancement-tests.sh"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Validation FAILED with ${ERRORS} error(s)${NC}"
    echo ""
    exit 1
fi
