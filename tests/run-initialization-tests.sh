#!/bin/bash

# MASE Initialization Error Handling Tests Runner
# Task 7: Test initialization error handling
# Requirements: 1.1, 1.2, 1.3, 1.4

echo "========================================="
echo "MASE Initialization Error Handling Tests"
echo "========================================="
echo ""
echo "Task 7: Test initialization error handling"
echo "Requirements: 1.1, 1.2, 1.3, 1.4"
echo ""

# Check if test file exists
if [ ! -f "tests/test-initialization-error-handling.html" ]; then
    echo "❌ Error: Test file not found!"
    echo "Expected: tests/test-initialization-error-handling.html"
    exit 1
fi

echo "✓ Test file found"
echo ""

# Detect OS and open browser
echo "Opening test file in browser..."
echo ""

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open &> /dev/null; then
        xdg-open "tests/test-initialization-error-handling.html"
    elif command -v firefox &> /dev/null; then
        firefox "tests/test-initialization-error-handling.html"
    elif command -v google-chrome &> /dev/null; then
        google-chrome "tests/test-initialization-error-handling.html"
    else
        echo "⚠️  Could not detect browser. Please open manually:"
        echo "   tests/test-initialization-error-handling.html"
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "tests/test-initialization-error-handling.html"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start "tests/test-initialization-error-handling.html"
else
    echo "⚠️  Unknown OS. Please open manually:"
    echo "   tests/test-initialization-error-handling.html"
fi

echo ""
echo "========================================="
echo "Test Instructions:"
echo "========================================="
echo ""
echo "The test page will automatically run all tests."
echo ""
echo "Tests included:"
echo "  1. jQuery not loaded - Should display alert and not initialize"
echo "  2. maseAdmin object missing - Should display alert and not initialize"
echo "  3. All dependencies present - Should initialize successfully"
echo "  4. Console logs in correct order - Verify log sequence"
echo ""
echo "Expected Results:"
echo "  ✓ All 4 tests should PASS"
echo "  ✓ Requirements 1.1, 1.2, 1.3, 1.4 should be SATISFIED"
echo ""
echo "If any tests fail:"
echo "  1. Check the console logs in the test page"
echo "  2. Review the error details provided"
echo "  3. Verify the implementation in assets/js/mase-admin.js"
echo ""
echo "========================================="
