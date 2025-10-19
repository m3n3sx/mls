#!/bin/bash

###############################################################################
# Browser Compatibility Test Runner for Template System Fixes
# 
# This script runs cross-browser tests for the template system fixes
# across Chrome, Firefox, Safari, and Edge.
#
# Usage:
#   ./run-template-system-tests.sh [browser]
#
# Examples:
#   ./run-template-system-tests.sh              # Run all browsers
#   ./run-template-system-tests.sh chromium     # Chrome only
#   ./run-template-system-tests.sh firefox      # Firefox only
#   ./run-template-system-tests.sh webkit       # Safari only
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
cd "$SCRIPT_DIR"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Template System Fixes - Browser Compatibility Tests      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Playwright is installed
if ! command -v npx &> /dev/null; then
    echo -e "${RED}✗ Error: npx not found. Please install Node.js and npm.${NC}"
    exit 1
fi

# Check if Playwright is installed
if [ ! -d "node_modules/@playwright/test" ]; then
    echo -e "${YELLOW}⚠ Playwright not found. Installing...${NC}"
    npm install @playwright/test
    npx playwright install
fi

# Create results directory
mkdir -p test-results/template-system

# Determine which browser(s) to test
BROWSER="${1:-all}"

echo -e "${BLUE}Test Configuration:${NC}"
echo -e "  Browser: ${YELLOW}${BROWSER}${NC}"
echo -e "  Test File: test-template-system-fixes.js"
echo -e "  Results: test-results/template-system/"
echo ""

# Function to run tests for a specific browser
run_browser_test() {
    local browser=$1
    local browser_name=$2
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Testing in ${browser_name}...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if npx playwright test test-template-system-fixes.js --project="${browser}"; then
        echo -e "${GREEN}✓ ${browser_name} tests passed${NC}"
        return 0
    else
        echo -e "${RED}✗ ${browser_name} tests failed${NC}"
        return 1
    fi
}

# Run tests based on browser selection
FAILED_BROWSERS=()

if [ "$BROWSER" = "all" ]; then
    echo -e "${YELLOW}Running tests in all browsers...${NC}"
    echo ""
    
    # Test Chrome
    if ! run_browser_test "chromium" "Chrome"; then
        FAILED_BROWSERS+=("Chrome")
    fi
    echo ""
    
    # Test Firefox
    if ! run_browser_test "firefox" "Firefox"; then
        FAILED_BROWSERS+=("Firefox")
    fi
    echo ""
    
    # Test Safari (WebKit)
    if ! run_browser_test "webkit" "Safari"; then
        FAILED_BROWSERS+=("Safari")
    fi
    echo ""
    
    # Test Edge (if available)
    if command -v microsoft-edge &> /dev/null || command -v msedge &> /dev/null; then
        if ! run_browser_test "edge" "Edge"; then
            FAILED_BROWSERS+=("Edge")
        fi
        echo ""
    else
        echo -e "${YELLOW}⚠ Edge not found, skipping...${NC}"
        echo ""
    fi
else
    # Run single browser test
    case "$BROWSER" in
        chromium|chrome)
            run_browser_test "chromium" "Chrome"
            ;;
        firefox)
            run_browser_test "firefox" "Firefox"
            ;;
        webkit|safari)
            run_browser_test "webkit" "Safari"
            ;;
        edge)
            run_browser_test "edge" "Edge"
            ;;
        *)
            echo -e "${RED}✗ Unknown browser: ${BROWSER}${NC}"
            echo -e "Valid options: chromium, firefox, webkit, edge, all"
            exit 1
            ;;
    esac
fi

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ ${#FAILED_BROWSERS[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ All browser tests passed!${NC}"
    echo ""
    echo -e "Results saved to: ${YELLOW}test-results/template-system/${NC}"
    echo -e "HTML Report: ${YELLOW}test-results/html-report/index.html${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Tests failed in: ${FAILED_BROWSERS[*]}${NC}"
    echo ""
    echo -e "Check results in: ${YELLOW}test-results/template-system/${NC}"
    echo -e "HTML Report: ${YELLOW}test-results/html-report/index.html${NC}"
    echo ""
    exit 1
fi
