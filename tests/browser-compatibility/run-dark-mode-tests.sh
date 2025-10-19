#!/bin/bash

###############################################################################
# Dark Mode Toggle - Cross-Browser Compatibility Test Runner
#
# This script runs automated cross-browser tests for the dark mode toggle
# feature using Playwright.
#
# Requirements: Node.js, npm, Playwright
#
# Usage:
#   ./run-dark-mode-tests.sh                    # Run all browsers
#   ./run-dark-mode-tests.sh chrome             # Run Chrome only
#   ./run-dark-mode-tests.sh firefox            # Run Firefox only
#   ./run-dark-mode-tests.sh safari             # Run Safari only
#   ./run-dark-mode-tests.sh edge               # Run Edge only
#
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Print header
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Dark Mode Toggle - Cross-Browser Compatibility Tests         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ Error: npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm version: $(npm --version)${NC}"
echo ""

# Check if Playwright is installed
if [ ! -d "node_modules/@playwright/test" ]; then
    echo -e "${YELLOW}⚠ Playwright not found. Installing...${NC}"
    npm install --save-dev @playwright/test
    echo -e "${GREEN}✓ Playwright installed${NC}"
    echo ""
    
    echo -e "${YELLOW}⚠ Installing browser binaries...${NC}"
    npx playwright install
    echo -e "${GREEN}✓ Browser binaries installed${NC}"
    echo ""
fi

# Create results directory
mkdir -p test-results/dark-mode
echo -e "${GREEN}✓ Results directory created${NC}"
echo ""

# Determine which browser to test
BROWSER="${1:-all}"

case "$BROWSER" in
    chrome|chromium)
        echo -e "${BLUE}Running tests in Chrome...${NC}"
        npx playwright test test-dark-mode-cross-browser.js --project=chromium
        ;;
    firefox)
        echo -e "${BLUE}Running tests in Firefox...${NC}"
        npx playwright test test-dark-mode-cross-browser.js --project=firefox
        ;;
    safari|webkit)
        echo -e "${BLUE}Running tests in Safari...${NC}"
        npx playwright test test-dark-mode-cross-browser.js --project=webkit
        ;;
    edge)
        echo -e "${BLUE}Running tests in Edge...${NC}"
        npx playwright test test-dark-mode-cross-browser.js --project=edge
        ;;
    all)
        echo -e "${BLUE}Running tests in all browsers...${NC}"
        echo ""
        
        echo -e "${YELLOW}Testing Chrome...${NC}"
        npx playwright test test-dark-mode-cross-browser.js --project=chromium || true
        echo ""
        
        echo -e "${YELLOW}Testing Firefox...${NC}"
        npx playwright test test-dark-mode-cross-browser.js --project=firefox || true
        echo ""
        
        echo -e "${YELLOW}Testing Safari...${NC}"
        npx playwright test test-dark-mode-cross-browser.js --project=webkit || true
        echo ""
        
        # Edge test (optional, may not be available on all platforms)
        if command -v msedge &> /dev/null || command -v microsoft-edge &> /dev/null; then
            echo -e "${YELLOW}Testing Edge...${NC}"
            npx playwright test test-dark-mode-cross-browser.js --project=edge || true
            echo ""
        else
            echo -e "${YELLOW}⚠ Edge not available on this platform, skipping...${NC}"
            echo ""
        fi
        ;;
    *)
        echo -e "${RED}✗ Error: Unknown browser '$BROWSER'${NC}"
        echo "Usage: $0 [chrome|firefox|safari|edge|all]"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Test Execution Complete                                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if results exist
if [ -d "test-results/dark-mode" ] && [ "$(ls -A test-results/dark-mode)" ]; then
    echo -e "${GREEN}✓ Test results saved to: test-results/dark-mode/${NC}"
    echo ""
    echo "Result files:"
    ls -lh test-results/dark-mode/ | tail -n +2
    echo ""
fi

# Generate HTML report
if [ -d "test-results/html-report" ]; then
    echo -e "${GREEN}✓ HTML report available at: test-results/html-report/index.html${NC}"
    echo ""
    
    # Try to open report in browser (platform-specific)
    if command -v xdg-open &> /dev/null; then
        echo "Opening report in browser..."
        xdg-open test-results/html-report/index.html &> /dev/null &
    elif command -v open &> /dev/null; then
        echo "Opening report in browser..."
        open test-results/html-report/index.html &> /dev/null &
    elif command -v start &> /dev/null; then
        echo "Opening report in browser..."
        start test-results/html-report/index.html &> /dev/null &
    else
        echo "To view the report, open: test-results/html-report/index.html"
    fi
fi

echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Review the HTML report for detailed test results"
echo "2. Check test-results/dark-mode/ for JSON result files"
echo "3. Complete manual testing using dark-mode-browser-test-checklist.md"
echo "4. Document any browser-specific issues found"
echo ""

exit 0
