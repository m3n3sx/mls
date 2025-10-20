#!/bin/bash

###############################################################################
# MASE Accessibility Audit Test Runner
# 
# Runs axe-core accessibility audit on MASE settings page
# Tests both Light and Dark modes for WCAG 2.1 Level AA compliance
# 
# Requirements: 10.3, 10.4
# Bug Fixes: MASE-ACC-001, MASE-DARK-001
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_FILE="$SCRIPT_DIR/axe-audit-test.js"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   MASE Accessibility Audit Test Runner                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Error: Node.js is not installed${NC}"
    echo "  Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check if Playwright is installed
if ! node -e "require('playwright')" 2>/dev/null; then
    echo -e "${YELLOW}⚠ Playwright not found. Installing...${NC}"
    cd "$SCRIPT_DIR/../visual-testing"
    npm install
    cd "$SCRIPT_DIR"
fi

echo -e "${GREEN}✓ Playwright is installed${NC}"
echo ""

# Check if test file exists
if [ ! -f "$TEST_FILE" ]; then
    echo -e "${RED}✗ Error: Test file not found: $TEST_FILE${NC}"
    exit 1
fi

echo -e "${BLUE}Running accessibility audit...${NC}"
echo ""

# Run the test
if node "$TEST_FILE"; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅ ACCESSIBILITY AUDIT PASSED                            ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    EXIT_CODE=$?
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║   ❌ ACCESSIBILITY AUDIT FAILED                            ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Check the HTML report in: $SCRIPT_DIR/reports/${NC}"
    exit $EXIT_CODE
fi
