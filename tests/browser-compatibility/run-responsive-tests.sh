#!/bin/bash

# Responsive Testing Script for Admin Bar Enhancement
# Task 20: Perform responsive testing

set -e

echo "=========================================="
echo "Admin Bar Responsive Testing"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "test-adminbar-responsive.js" ]; then
    echo "Error: Must run from tests/browser-compatibility directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Create results directory
mkdir -p test-results/responsive

echo "Running responsive tests..."
echo ""

# Run all responsive tests
echo "Testing mobile devices (360px, 375px)..."
npx playwright test test-adminbar-responsive.js --grep "Mobile Device Testing"

echo ""
echo "Testing tablet devices (768px, 800px)..."
npx playwright test test-adminbar-responsive.js --grep "Tablet Device Testing"

echo ""
echo "Testing desktop resolutions (1366px, 1920px, 2560px)..."
npx playwright test test-adminbar-responsive.js --grep "Desktop Testing"

echo ""
echo "Testing cross-viewport consistency..."
npx playwright test test-adminbar-responsive.js --grep "Cross-Viewport Consistency"

echo ""
echo "=========================================="
echo "Responsive Testing Complete!"
echo "=========================================="
echo ""
echo "Results saved to: test-results/responsive/"
echo ""
echo "To view detailed results:"
echo "  ls -lh test-results/responsive/"
echo ""
