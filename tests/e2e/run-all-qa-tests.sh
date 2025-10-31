#!/bin/bash

# Comprehensive QA Test Runner for Template Visual Enhancements
# Runs all testing suites: visual regression, cross-browser, mobile, performance, and accessibility

set -e

echo "🚀 Starting Comprehensive QA Test Suite"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create results directories
echo "📁 Creating test result directories..."
mkdir -p tests/screenshots/{baseline,variants,intensity,dark-mode,responsive,animations,mobile,devices}
mkdir -p tests/performance-results
mkdir -p test-results

# Check if WordPress is running
echo "🔍 Checking WordPress availability..."
if ! curl -s http://localhost:8080 > /dev/null; then
    echo -e "${RED}❌ WordPress is not running at http://localhost:8080${NC}"
    echo "   Please start WordPress with: docker-compose up -d"
    exit 1
fi
echo -e "${GREEN}✓ WordPress is running${NC}"
echo ""

# Run Visual Regression Tests
echo "📸 Running Visual Regression Tests..."
echo "--------------------------------------"
npx playwright test tests/e2e/visual-regression-comprehensive.spec.js --project=chromium || {
    echo -e "${YELLOW}⚠ Visual regression tests had issues${NC}"
}
echo ""

# Run Cross-Browser Tests
echo "🌐 Running Cross-Browser Tests..."
echo "--------------------------------------"
echo "Testing on Chromium..."
npx playwright test tests/e2e/cross-browser-comprehensive.spec.js --project=chromium || {
    echo -e "${YELLOW}⚠ Chromium tests had issues${NC}"
}

echo "Testing on Firefox..."
npx playwright test tests/e2e/cross-browser-comprehensive.spec.js --project=firefox || {
    echo -e "${YELLOW}⚠ Firefox tests had issues${NC}"
}

echo "Testing on WebKit (Safari)..."
npx playwright test tests/e2e/cross-browser-comprehensive.spec.js --project=webkit || {
    echo -e "${YELLOW}⚠ WebKit tests had issues${NC}"
}
echo ""

# Run Mobile Device Tests
echo "📱 Running Mobile Device Tests..."
echo "--------------------------------------"
npx playwright test tests/e2e/mobile-device-comprehensive.spec.js --project=chromium || {
    echo -e "${YELLOW}⚠ Mobile tests had issues${NC}"
}
echo ""

# Run Performance Tests
echo "⚡ Running Performance Tests..."
echo "--------------------------------------"
npx playwright test tests/e2e/performance-comprehensive.spec.js --project=chromium || {
    echo -e "${YELLOW}⚠ Performance tests had issues${NC}"
}
echo ""

# Run Accessibility Tests
echo "♿ Running Accessibility Tests..."
echo "--------------------------------------"
npx playwright test tests/e2e/accessibility-comprehensive.spec.js --project=chromium || {
    echo -e "${YELLOW}⚠ Accessibility tests had issues${NC}"
}
echo ""

# Generate HTML Report
echo "📊 Generating Test Report..."
echo "--------------------------------------"
npx playwright show-report --host 0.0.0.0 &
REPORT_PID=$!

echo ""
echo "========================================"
echo -e "${GREEN}✅ QA Test Suite Complete!${NC}"
echo "========================================"
echo ""
echo "📊 Test Results:"
echo "   - Visual Regression: tests/screenshots/"
echo "   - Performance Data: tests/performance-results/"
echo "   - HTML Report: playwright-report/index.html"
echo ""
echo "🌐 View HTML report at: http://localhost:9323"
echo ""
echo "Press Ctrl+C to exit..."

# Wait for user to exit
wait $REPORT_PID
