#!/bin/bash

# MASE aria-checked Synchronization Test Runner
# Runs the aria-checked synchronization test for MASE-ACC-001

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}MASE aria-checked Synchronization Test${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules not found. Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Check if Playwright browsers are installed
if [ ! -d "$HOME/.cache/ms-playwright" ] && [ ! -d "$HOME/Library/Caches/ms-playwright" ]; then
    echo -e "${YELLOW}⚠️  Playwright browsers not found. Installing...${NC}"
    npx playwright install chromium
    echo ""
fi

# Create directories if they don't exist
mkdir -p screenshots
mkdir -p reports
mkdir -p logs

# Generate timestamp for log file
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
LOG_FILE="logs/aria-checked-test-run-${TIMESTAMP}.log"

echo -e "${BLUE}📋 Test Configuration:${NC}"
echo -e "  Script: aria-checked-test.js"
echo -e "  Log file: ${LOG_FILE}"
echo -e "  Screenshots: screenshots/"
echo -e "  Reports: reports/"
echo ""

echo -e "${GREEN}🚀 Starting test...${NC}"
echo ""

# Run the test and capture output
if node aria-checked-test.js 2>&1 | tee "$LOG_FILE"; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✅ TEST COMPLETED SUCCESSFULLY${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    
    # Find the most recent report
    LATEST_REPORT=$(ls -t reports/aria-checked-test-*.html 2>/dev/null | head -1)
    if [ -n "$LATEST_REPORT" ]; then
        echo -e "${BLUE}📊 Report generated:${NC}"
        echo -e "  ${LATEST_REPORT}"
        echo ""
        echo -e "${BLUE}💡 To view the report:${NC}"
        echo -e "  Open: ${LATEST_REPORT}"
        echo ""
    fi
    
    # Show screenshot count
    SCREENSHOT_COUNT=$(ls -1 screenshots/aria-checked-test-* 2>/dev/null | wc -l)
    echo -e "${BLUE}📸 Screenshots captured: ${SCREENSHOT_COUNT}${NC}"
    echo ""
    
    exit 0
else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}❌ TEST FAILED${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo -e "${YELLOW}📋 Check the log file for details:${NC}"
    echo -e "  ${LOG_FILE}"
    echo ""
    
    # Find the most recent report even on failure
    LATEST_REPORT=$(ls -t reports/aria-checked-test-*.html 2>/dev/null | head -1)
    if [ -n "$LATEST_REPORT" ]; then
        echo -e "${BLUE}📊 Report generated:${NC}"
        echo -e "  ${LATEST_REPORT}"
        echo ""
    fi
    
    exit 1
fi
