#!/bin/bash
#
# Run MASE Palette Activation Integration Tests
#
# This script runs the palette activation integration test suite.
# It can be executed via WP-CLI or directly in a browser.
#

echo "=========================================="
echo "MASE Palette Activation Integration Tests"
echo "=========================================="
echo ""

# Check if WP-CLI is available
if command -v wp &> /dev/null; then
    echo "Running tests via WP-CLI..."
    echo ""
    wp eval-file tests/integration/test-palette-activation-flow.php
    exit_code=$?
    
    echo ""
    if [ $exit_code -eq 0 ]; then
        echo "✓ All tests passed!"
    else
        echo "✗ Some tests failed. Exit code: $exit_code"
    fi
    
    exit $exit_code
else
    echo "WP-CLI not found."
    echo ""
    echo "To run tests manually:"
    echo "1. Via browser: Navigate to:"
    echo "   /wp-content/plugins/woow-admin/tests/integration/test-palette-activation-flow.php?run_palette_activation_tests=1"
    echo ""
    echo "2. Via WP-CLI (install first):"
    echo "   wp eval-file tests/integration/test-palette-activation-flow.php"
    echo ""
    exit 1
fi
