#!/bin/bash

# Validation Script for Responsive Tests
# Verifies test files are properly structured

set -e

echo "=========================================="
echo "Validating Responsive Test Files"
echo "=========================================="
echo ""

# Check if test file exists
if [ ! -f "test-adminbar-responsive.js" ]; then
    echo "✗ test-adminbar-responsive.js not found"
    exit 1
fi
echo "✓ test-adminbar-responsive.js exists"

# Check if README exists
if [ ! -f "RESPONSIVE-TESTS-README.md" ]; then
    echo "✗ RESPONSIVE-TESTS-README.md not found"
    exit 1
fi
echo "✓ RESPONSIVE-TESTS-README.md exists"

# Check if quick start guide exists
if [ ! -f "QUICK-START-RESPONSIVE.md" ]; then
    echo "✗ QUICK-START-RESPONSIVE.md not found"
    exit 1
fi
echo "✓ QUICK-START-RESPONSIVE.md exists"

# Check if run script exists
if [ ! -f "run-responsive-tests.sh" ]; then
    echo "✗ run-responsive-tests.sh not found"
    exit 1
fi
echo "✓ run-responsive-tests.sh exists"

# Check if run script is executable
if [ ! -x "run-responsive-tests.sh" ]; then
    echo "⚠ run-responsive-tests.sh is not executable, fixing..."
    chmod +x run-responsive-tests.sh
fi
echo "✓ run-responsive-tests.sh is executable"

# Check for required test patterns
echo ""
echo "Checking test structure..."

if grep -q "test.describe('Mobile Device Testing" test-adminbar-responsive.js; then
    echo "✓ Mobile device tests found"
else
    echo "✗ Mobile device tests not found"
    exit 1
fi

if grep -q "test.describe('Tablet Device Testing" test-adminbar-responsive.js; then
    echo "✓ Tablet device tests found"
else
    echo "✗ Tablet device tests not found"
    exit 1
fi

if grep -q "test.describe('Desktop Testing" test-adminbar-responsive.js; then
    echo "✓ Desktop tests found"
else
    echo "✗ Desktop tests not found"
    exit 1
fi

if grep -q "test.describe('Cross-Viewport Consistency" test-adminbar-responsive.js; then
    echo "✓ Cross-viewport tests found"
else
    echo "✗ Cross-viewport tests not found"
    exit 1
fi

# Check for viewport configurations
echo ""
echo "Checking viewport configurations..."

if grep -q "width: 375" test-adminbar-responsive.js; then
    echo "✓ iPhone 375px viewport configured"
else
    echo "✗ iPhone 375px viewport not found"
    exit 1
fi

if grep -q "width: 360" test-adminbar-responsive.js; then
    echo "✓ Android 360px viewport configured"
else
    echo "✗ Android 360px viewport not found"
    exit 1
fi

if grep -q "width: 768" test-adminbar-responsive.js; then
    echo "✓ iPad 768px viewport configured"
else
    echo "✗ iPad 768px viewport not found"
    exit 1
fi

if grep -q "width: 800" test-adminbar-responsive.js; then
    echo "✓ Android tablet 800px viewport configured"
else
    echo "✗ Android tablet 800px viewport not found"
    exit 1
fi

if grep -q "width: 1366" test-adminbar-responsive.js; then
    echo "✓ Desktop 1366px viewport configured"
else
    echo "✗ Desktop 1366px viewport not found"
    exit 1
fi

if grep -q "width: 1920" test-adminbar-responsive.js; then
    echo "✓ Desktop 1920px viewport configured"
else
    echo "✗ Desktop 1920px viewport not found"
    exit 1
fi

if grep -q "width: 2560" test-adminbar-responsive.js; then
    echo "✓ Desktop 2560px viewport configured"
else
    echo "✗ Desktop 2560px viewport not found"
    exit 1
fi

# Check for test helpers
echo ""
echo "Checking test helpers..."

if grep -q "function saveTestResults" test-adminbar-responsive.js; then
    echo "✓ saveTestResults helper found"
else
    echo "✗ saveTestResults helper not found"
    exit 1
fi

if grep -q "function takeScreenshot" test-adminbar-responsive.js; then
    echo "✓ takeScreenshot helper found"
else
    echo "✗ takeScreenshot helper not found"
    exit 1
fi

if grep -q "function createResponsiveTestHTML" test-adminbar-responsive.js; then
    echo "✓ createResponsiveTestHTML helper found"
else
    echo "✗ createResponsiveTestHTML helper not found"
    exit 1
fi

# Check for results directory creation
if grep -q "test-results.*responsive" test-adminbar-responsive.js; then
    echo "✓ Results directory configuration found"
else
    echo "✗ Results directory configuration not found"
    exit 1
fi

echo ""
echo "=========================================="
echo "✓ All Validation Checks Passed!"
echo "=========================================="
echo ""
echo "Responsive tests are properly configured."
echo ""
echo "To run tests:"
echo "  ./run-responsive-tests.sh"
echo ""
echo "Or run specific tests:"
echo "  npx playwright test test-adminbar-responsive.js --grep 'Mobile'"
echo "  npx playwright test test-adminbar-responsive.js --grep 'Tablet'"
echo "  npx playwright test test-adminbar-responsive.js --grep 'Desktop'"
echo ""
