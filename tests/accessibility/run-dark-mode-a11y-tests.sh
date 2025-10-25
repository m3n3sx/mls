#!/bin/bash

# MASE Dark Mode Accessibility Tests Runner
# Runs comprehensive accessibility tests for dark/light mode toggle
# Requirements: 5.1-5.7, 6.6, 9.6-9.7

set -e

echo "♿ MASE Dark Mode Accessibility Tests"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "Please install Node.js to run automated tests"
    exit 1
fi

# Check if Playwright is installed
if ! npm list playwright &> /dev/null; then
    echo -e "${YELLOW}⚠ Playwright not found, installing...${NC}"
    npm install playwright
fi

# Run automated tests
echo -e "${YELLOW}Running automated accessibility tests...${NC}"
echo ""

node tests/accessibility/test-dark-mode-a11y.js

TEST_EXIT_CODE=$?

echo ""
echo "======================================"

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ All accessibility tests passed!${NC}"
    echo ""
    echo "Manual Testing:"
    echo "  1. Open tests/accessibility/test-dark-mode-accessibility.html in browser"
    echo "  2. Test with screen reader (NVDA, VoiceOver, or Orca)"
    echo "  3. Enable reduced motion in system settings and verify"
    echo "  4. Test keyboard navigation thoroughly"
    exit 0
else
    echo -e "${RED}✗ Some accessibility tests failed${NC}"
    echo ""
    echo "Please review the test output above and fix the issues"
    exit 1
fi
