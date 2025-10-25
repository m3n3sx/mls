#!/bin/bash

# AJAX Error Response Tests Runner
# Task 10: Test AJAX error responses
# Requirements: 4.1, 4.2, 4.3, 4.4

echo "=========================================="
echo "MASE AJAX Error Response Tests"
echo "=========================================="
echo ""
echo "Test Coverage:"
echo "  ✓ HTTP 403 - Permission Denied (Requirement 4.1)"
echo "  ✓ HTTP 400 - Validation Error (Requirement 4.2)"
echo "  ✓ HTTP 500 - Server Error (Requirement 4.3)"
echo "  ✓ Network Error (Requirement 4.4)"
echo ""
echo "=========================================="
echo ""

# Check if test file exists
if [ ! -f "tests/test-ajax-error-responses.html" ]; then
    echo "❌ Error: Test file not found!"
    echo "   Expected: tests/test-ajax-error-responses.html"
    exit 1
fi

echo "✅ Test file found: tests/test-ajax-error-responses.html"
echo ""

# Check if README exists
if [ -f "tests/AJAX-ERROR-RESPONSE-TESTS-README.md" ]; then
    echo "✅ Documentation found: tests/AJAX-ERROR-RESPONSE-TESTS-README.md"
else
    echo "⚠️  Warning: README not found"
fi

echo ""
echo "=========================================="
echo "Running Tests"
echo "=========================================="
echo ""

# Detect OS and open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Opening tests in browser (macOS)..."
    open tests/test-ajax-error-responses.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "Opening tests in browser (Linux)..."
    if command -v xdg-open &> /dev/null; then
        xdg-open tests/test-ajax-error-responses.html
    elif command -v firefox &> /dev/null; then
        firefox tests/test-ajax-error-responses.html &
    elif command -v google-chrome &> /dev/null; then
        google-chrome tests/test-ajax-error-responses.html &
    else
        echo "⚠️  Could not detect browser. Please open manually:"
        echo "   file://$(pwd)/tests/test-ajax-error-responses.html"
    fi
else
    # Windows or other
    echo "⚠️  Please open the test file manually in your browser:"
    echo "   file://$(pwd)/tests/test-ajax-error-responses.html"
fi

echo ""
echo "=========================================="
echo "Test Instructions"
echo "=========================================="
echo ""
echo "1. Run individual tests by clicking test buttons"
echo "2. Or run comprehensive test: 'Test All Error Messages'"
echo "3. Check browser console for detailed logs"
echo "4. Verify all tests pass with ✅ status"
echo ""
echo "Expected Results:"
echo "  ✅ 403: 'Permission denied. You do not have access to perform this action.'"
echo "  ✅ 400: 'Please fix X validation error(s): [details]'"
echo "  ✅ 500: 'Server error. Please try again later.'"
echo "  ✅ Network: 'Network error. Please check your connection and try again.'"
echo ""
echo "=========================================="
echo "For more information, see:"
echo "  tests/AJAX-ERROR-RESPONSE-TESTS-README.md"
echo "=========================================="
