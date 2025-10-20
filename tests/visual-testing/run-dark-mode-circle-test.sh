#!/bin/bash

# MASE Dark Mode Circle Test Runner
# Runs the Dark Mode circle bug test (MASE-DARK-001)

echo "🌙 MASE Dark Mode Circle Bug Test"
echo "=================================="
echo ""
echo "This test verifies that Dark Mode does not display large circular obstructions."
echo "Bug ID: MASE-DARK-001"
echo "Requirements: 9.1, 9.2, 9.3, 9.4, 9.5"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js to run this test"
    exit 1
fi

# Check if Playwright is installed
if [ ! -d "node_modules/playwright" ]; then
    echo "⚠️  Playwright not found. Installing dependencies..."
    npm install
    echo ""
fi

# Run the test
echo "🚀 Starting test..."
echo ""

node dark-mode-circle-test.js

# Capture exit code
EXIT_CODE=$?

echo ""
echo "=================================="

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Test completed successfully"
    echo ""
    echo "📊 View the HTML report in: reports/"
    echo "📸 View screenshots in: screenshots/"
else
    echo "❌ Test failed or encountered an error"
    echo ""
    echo "📊 Check the report for details: reports/"
    echo "📸 Check screenshots for visual evidence: screenshots/"
fi

exit $EXIT_CODE
