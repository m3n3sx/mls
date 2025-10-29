#!/bin/bash

##
# Browser Compatibility Test Runner
# 
# Runs the visual redesign browser compatibility tests across all major browsers.
# 
# Usage:
#   ./run-browser-compatibility-tests.sh [browser] [options]
# 
# Arguments:
#   browser   - Optional: chromium, firefox, webkit, or 'all' (default: all)
# 
# Options:
#   --headed  - Run tests in headed mode (visible browser)
#   --debug   - Run with debug output
#   --ui      - Run with Playwright UI mode
# 
# Examples:
#   ./run-browser-compatibility-tests.sh                    # Run all browsers
#   ./run-browser-compatibility-tests.sh chromium           # Run Chrome only
#   ./run-browser-compatibility-tests.sh firefox --headed   # Run Firefox in headed mode
#   ./run-browser-compatibility-tests.sh --ui               # Run with UI mode
##

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
BROWSER="all"
HEADED=""
DEBUG=""
UI_MODE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        chromium|firefox|webkit)
            BROWSER="$1"
            shift
            ;;
        all)
            BROWSER="all"
            shift
            ;;
        --headed)
            HEADED="--headed"
            shift
            ;;
        --debug)
            DEBUG="--debug"
            shift
            ;;
        --ui)
            UI_MODE="--ui"
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Browser Compatibility Test Suite${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if WordPress is running
echo -e "${YELLOW}Checking WordPress connection...${NC}"
WP_URL="${WP_BASE_URL:-http://localhost:8080}"
if curl -s -o /dev/null -w "%{http_code}" "$WP_URL" | grep -q "200\|302"; then
    echo -e "${GREEN}✓ WordPress is accessible at $WP_URL${NC}"
else
    echo -e "${RED}✗ WordPress is not accessible at $WP_URL${NC}"
    echo -e "${YELLOW}Please start WordPress and set WP_BASE_URL environment variable${NC}"
    exit 1
fi

echo ""

# Build test command
TEST_CMD="npx playwright test tests/e2e/browser-compatibility-test.spec.js"

if [ "$BROWSER" != "all" ]; then
    TEST_CMD="$TEST_CMD --project=$BROWSER"
fi

if [ -n "$HEADED" ]; then
    TEST_CMD="$TEST_CMD $HEADED"
fi

if [ -n "$DEBUG" ]; then
    TEST_CMD="$TEST_CMD $DEBUG"
fi

if [ -n "$UI_MODE" ]; then
    TEST_CMD="$TEST_CMD $UI_MODE"
fi

# Add reporter
TEST_CMD="$TEST_CMD --reporter=list --reporter=html"

echo -e "${YELLOW}Running tests...${NC}"
echo -e "${BLUE}Command: $TEST_CMD${NC}"
echo ""

# Run tests
if eval "$TEST_CMD"; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ All browser compatibility tests passed!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}View detailed report:${NC}"
    echo -e "  npx playwright show-report"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}✗ Some tests failed${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo -e "${YELLOW}View detailed report:${NC}"
    echo -e "  npx playwright show-report"
    echo ""
    echo -e "${YELLOW}Run specific browser:${NC}"
    echo -e "  ./run-browser-compatibility-tests.sh chromium"
    echo -e "  ./run-browser-compatibility-tests.sh firefox"
    echo -e "  ./run-browser-compatibility-tests.sh webkit"
    echo ""
    exit 1
fi
