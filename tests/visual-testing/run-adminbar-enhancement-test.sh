#!/bin/bash

# MASE Admin Bar Enhancement Visual Test Runner
# Runs comprehensive visual tests for admin bar enhancements

echo "🎨 MASE Admin Bar Enhancement Visual Tests"
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
    echo "📦 Installing Playwright..."
    npm install
    
    echo "🌐 Installing browser binaries..."
    npx playwright install chromium
fi

# Check if WordPress is running
echo "🔍 Checking WordPress availability..."
if ! curl -s http://localhost/wp-login.php > /dev/null; then
    echo "⚠️  Warning: WordPress doesn't appear to be running at http://localhost"
    echo "Please ensure WordPress is running before continuing"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run the tests
echo ""
echo "🚀 Running Admin Bar Enhancement Visual Tests..."
echo ""

node adminbar-enhancement-test.js

# Capture exit code
EXIT_CODE=$?

echo ""
echo "=========================================="
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed. Check the report for details."
fi

echo ""
echo "📊 Reports generated in: tests/visual-testing/reports/"
echo "📸 Screenshots saved in: tests/visual-testing/screenshots/"
echo ""

exit $EXIT_CODE
