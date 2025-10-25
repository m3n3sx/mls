#!/bin/bash

# Admin Menu Enhancement Visual Tests Runner
# Tests menu spacing, submenu positioning, Height Mode, and logo display

echo "=== Admin Menu Enhancement Visual Tests ==="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js to run visual tests"
    exit 1
fi

# Check if Playwright is installed
if [ ! -d "node_modules/playwright" ]; then
    echo "Installing Playwright..."
    npm install playwright
fi

# Create screenshots directory if it doesn't exist
mkdir -p screenshots

# Run the visual tests
echo "Running visual tests..."
node adminmenu-enhancement-visual-test.js

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Visual tests completed successfully"
    echo "Screenshots saved to: tests/visual-testing/screenshots/"
    exit 0
else
    echo ""
    echo "✗ Visual tests failed"
    exit 1
fi
