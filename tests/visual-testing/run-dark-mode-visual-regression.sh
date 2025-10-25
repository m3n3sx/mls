#!/bin/bash

# MASE Dark Mode Visual Regression Test Runner
# Runs comprehensive visual tests for dark mode toggle feature

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🎨 MASE Dark Mode Visual Regression Tests"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js to run these tests"
    exit 1
fi

# Check if Playwright is installed
if [ ! -d "node_modules/playwright" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if Playwright browsers are installed
if [ ! -d "node_modules/playwright/.local-browsers" ]; then
    echo "🌐 Installing Playwright browsers..."
    npx playwright install chromium
    echo ""
fi

# Check if WordPress is running
echo "🔍 Checking WordPress availability..."
if ! curl -s -o /dev/null -w "%{http_code}" http://localhost/wp-login.php | grep -q "200"; then
    echo "⚠️  Warning: WordPress may not be running at http://localhost"
    echo "Please ensure WordPress is running before continuing"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run the tests
echo ""
echo "🚀 Running visual regression tests..."
echo ""

if [ "$1" == "--headed" ]; then
    HEADLESS=false node dark-mode-visual-regression-test.js
else
    node dark-mode-visual-regression-test.js
fi

TEST_EXIT_CODE=$?

echo ""
echo "=========================================="
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ All visual regression tests passed!"
else
    echo "❌ Some visual regression tests failed"
fi
echo ""
echo "📊 View detailed report in: reports/"
echo "📸 View screenshots in: screenshots/"
echo ""

exit $TEST_EXIT_CODE
