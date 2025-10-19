#!/bin/bash

# Setup and run template system browser tests

set -e

echo "Setting up browser compatibility tests..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    npx playwright install chromium firefox webkit
fi

echo ""
echo "Running template system tests..."
echo ""

# Run the tests
npx playwright test test-template-system-fixes.js --reporter=list

echo ""
echo "Tests complete! Check test-results/ for detailed results."
