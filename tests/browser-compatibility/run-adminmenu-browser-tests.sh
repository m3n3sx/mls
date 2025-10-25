#!/bin/bash

# Admin Menu Browser Compatibility Tests Runner
# Tests on Chrome, Firefox, Safari (WebKit), and Edge

echo "=== Admin Menu Browser Compatibility Tests ==="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js to run browser compatibility tests"
    exit 1
fi

# Check if Playwright is installed
if [ ! -d "node_modules/playwright" ]; then
    echo "Installing Playwright..."
    npm install playwright
    
    # Install browser binaries
    echo "Installing browser binaries..."
    npx playwright install
fi

# Run the browser compatibility tests
echo "Running browser compatibility tests..."
echo "Testing on: Chromium (Chrome/Edge), Firefox, WebKit (Safari)"
echo ""

node test-adminmenu-browser-compat.js

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Browser compatibility tests completed"
    exit 0
else
    echo ""
    echo "✗ Browser compatibility tests failed"
    exit 1
fi
