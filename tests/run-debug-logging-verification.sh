#!/bin/bash

# Debug Logging Verification Test Runner
# Task 11: Verify debug logging
# Requirements: 5.1, 5.2, 5.3, 5.4, 5.5

echo "=========================================="
echo "Debug Logging Verification Test"
echo "Task 11 - Requirements 5.1-5.5"
echo "=========================================="
echo ""

# Check if we're in the plugin directory
if [ ! -f "modern-admin-styler.php" ]; then
    echo "Error: Must be run from plugin root directory"
    exit 1
fi

# Check if WordPress is installed
if [ ! -f "../../wp-config.php" ]; then
    echo "Error: WordPress installation not found"
    echo "Expected wp-config.php at: ../../wp-config.php"
    exit 1
fi

# Check if WP_DEBUG is enabled
if ! grep -q "define.*WP_DEBUG.*true" ../../wp-config.php; then
    echo "Warning: WP_DEBUG may not be enabled in wp-config.php"
    echo ""
    echo "To enable debug logging, add these lines to wp-config.php:"
    echo "  define('WP_DEBUG', true);"
    echo "  define('WP_DEBUG_LOG', true);"
    echo "  define('WP_DEBUG_DISPLAY', false);"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if debug.log exists
DEBUG_LOG="../../wp-content/debug.log"
if [ ! -f "$DEBUG_LOG" ]; then
    echo "Warning: debug.log not found at: $DEBUG_LOG"
    echo ""
    echo "Please ensure:"
    echo "1. WP_DEBUG_LOG is enabled in wp-config.php"
    echo "2. You have saved settings at least once to generate logs"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "Found debug.log: $DEBUG_LOG"
    echo "Log file size: $(wc -c < "$DEBUG_LOG") bytes"
    echo "Last modified: $(stat -c %y "$DEBUG_LOG" 2>/dev/null || stat -f %Sm "$DEBUG_LOG" 2>/dev/null)"
    echo ""
fi

# Option to clear debug.log before test
read -p "Clear debug.log before running test? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "$DEBUG_LOG" ]; then
        > "$DEBUG_LOG"
        echo "✓ Cleared debug.log"
        echo ""
        echo "Please perform the following actions to generate logs:"
        echo "1. Go to WordPress admin"
        echo "2. Navigate to MASE settings page"
        echo "3. Make a change and click 'Save Settings'"
        echo "4. Return here and press Enter to continue"
        read -p ""
    fi
fi

echo ""
echo "Running debug logging verification test..."
echo ""

# Run the PHP test
php tests/test-debug-logging-verification.php

TEST_EXIT_CODE=$?

echo ""
echo "=========================================="

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✓ All debug logging tests passed!"
    echo ""
    echo "Verified Requirements:"
    echo "  5.1 - POST data keys and settings size logged"
    echo "  5.2 - JSON decode success/failure logged"
    echo "  5.3 - Sections being validated logged"
    echo "  5.4 - Validation pass/fail status logged"
    echo "  5.5 - Validation error messages logged"
else
    echo "✗ Some tests failed"
    echo ""
    echo "Troubleshooting:"
    echo "1. Ensure WP_DEBUG is enabled in wp-config.php"
    echo "2. Ensure you have saved settings at least once"
    echo "3. Check that all tasks 1-10 are implemented"
    echo "4. Review debug.log for actual log messages"
fi

echo "=========================================="

exit $TEST_EXIT_CODE
