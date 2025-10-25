#!/bin/bash

###############################################################################
# Browser Compatibility Test Runner for Admin Bar Enhancement
# 
# Tests Requirements 19.1, 19.2, 19.3, 19.4
# 
# Usage:
#   ./run-adminbar-enhancement-tests.sh [browser]
# 
# Examples:
#   ./run-adminbar-enhancement-tests.sh              # Run all browsers
#   ./run-adminbar-enhancement-tests.sh chrome       # Chrome only
#   ./run-adminbar-enhancement-tests.sh firefox      # Firefox only
#   ./run-adminbar-enhancement-tests.sh safari       # Safari only
#   ./run-adminbar-enhancement-tests.sh edge         # Edge only
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

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Admin Bar Enhancement - Browser Compatibility Tests          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Playwright is installed
if [ ! -d "node_modules/@playwright/test" ]; then
    echo -e "${YELLOW}⚠ Playwright not found. Installing...${NC}"
    npm install
    echo -e "${GREEN}✓ Playwright installed${NC}"
    echo ""
fi

# Check if browsers are installed
echo -e "${BLUE}Checking browser installations...${NC}"
if ! npx playwright --version > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Installing Playwright browsers...${NC}"
    npx playwright install
    echo -e "${GREEN}✓ Browsers installed${NC}"
    echo ""
fi

# Determine which browser(s) to test
BROWSER="${1:-all}"

echo -e "${BLUE}Test Configuration:${NC}"
echo -e "  Browser: ${YELLOW}${BROWSER}${NC}"
echo -e "  Test File: test-adminbar-enhancement-browser-compat.js"
echo ""

# Function to run tests for a specific browser
run_browser_test() {
    local browser=$1
    local project=$2
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Testing: ${YELLOW}${browser}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    if npx playwright test test-adminbar-enhancement-browser-compat.js --project="${project}"; then
        echo ""
        echo -e "${GREEN}✓ ${browser} tests PASSED${NC}"
        echo ""
        return 0
    else
        echo ""
        echo -e "${RED}✗ ${browser} tests FAILED${NC}"
        echo ""
        return 1
    fi
}

# Run tests based on browser selection
FAILED_BROWSERS=()

case "$BROWSER" in
    chrome|chromium)
        run_browser_test "Chrome" "chromium" || FAILED_BROWSERS+=("Chrome")
        ;;
    
    firefox)
        run_browser_test "Firefox" "firefox" || FAILED_BROWSERS+=("Firefox")
        ;;
    
    safari|webkit)
        run_browser_test "Safari" "webkit" || FAILED_BROWSERS+=("Safari")
        ;;
    
    edge)
        echo -e "${YELLOW}Note: Edge tests require Edge browser to be installed${NC}"
        echo -e "${YELLOW}Setting EDGE_TEST=1 environment variable${NC}"
        echo ""
        EDGE_TEST=1 run_browser_test "Edge" "edge" || FAILED_BROWSERS+=("Edge")
        ;;
    
    all)
        echo -e "${BLUE}Running tests on all browsers...${NC}"
        echo ""
        
        run_browser_test "Chrome" "chromium" || FAILED_BROWSERS+=("Chrome")
        run_browser_test "Firefox" "firefox" || FAILED_BROWSERS+=("Firefox")
        run_browser_test "Safari" "webkit" || FAILED_BROWSERS+=("Safari")
        
        # Edge is optional
        if command -v microsoft-edge &> /dev/null || command -v msedge &> /dev/null; then
            EDGE_TEST=1 run_browser_test "Edge" "edge" || FAILED_BROWSERS+=("Edge")
        else
            echo -e "${YELLOW}⚠ Edge browser not found, skipping Edge tests${NC}"
            echo ""
        fi
        ;;
    
    *)
        echo -e "${RED}✗ Unknown browser: ${BROWSER}${NC}"
        echo ""
        echo "Usage: $0 [chrome|firefox|safari|edge|all]"
        exit 1
        ;;
esac

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Test Summary                                                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ ${#FAILED_BROWSERS[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ All browser tests PASSED${NC}"
    echo ""
    echo -e "${BLUE}Results saved to: test-results/adminbar-enhancement/${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some browser tests FAILED:${NC}"
    for browser in "${FAILED_BROWSERS[@]}"; do
        echo -e "  ${RED}✗ ${browser}${NC}"
    done
    echo ""
    echo -e "${YELLOW}Check test-results/adminbar-enhancement/ for details${NC}"
    echo ""
    exit 1
fi
