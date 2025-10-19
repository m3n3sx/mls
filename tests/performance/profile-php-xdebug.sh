#!/bin/bash

###############################################################################
# PHP Profiling with Xdebug
# 
# Profiles PHP execution to identify performance bottlenecks (Requirement 17.3)
# 
# Prerequisites:
# - Xdebug installed and configured
# - KCachegrind or QCachegrind for viewing results
# 
# Usage: ./profile-php-xdebug.sh
###############################################################################

set -e

echo "=== PHP Profiling with Xdebug ==="
echo ""

# Check if Xdebug is installed
if ! php -m | grep -q xdebug; then
    echo "❌ Xdebug is not installed"
    echo ""
    echo "Install Xdebug:"
    echo "  Ubuntu/Debian: sudo apt-get install php-xdebug"
    echo "  macOS: pecl install xdebug"
    echo "  Or see: https://xdebug.org/docs/install"
    echo ""
    exit 1
fi

echo "✅ Xdebug is installed"
echo ""

# Create output directory
OUTPUT_DIR="$(dirname "$0")/performance-results/xdebug"
mkdir -p "$OUTPUT_DIR"

echo "Output directory: $OUTPUT_DIR"
echo ""

# Configure Xdebug for profiling
XDEBUG_CONFIG="xdebug.mode=profile xdebug.output_dir=$OUTPUT_DIR xdebug.profiler_output_name=cachegrind.out.%t"

echo "=== Profiling CSS Generation ==="
echo ""

XDEBUG_CONFIG="$XDEBUG_CONFIG" php -d xdebug.start_with_request=yes \
    "$(dirname "$0")/test-css-generation-performance.php"

echo ""
echo "=== Profiling Settings Save ==="
echo ""

XDEBUG_CONFIG="$XDEBUG_CONFIG" php -d xdebug.start_with_request=yes \
    "$(dirname "$0")/test-settings-save-performance.php"

echo ""
echo "=== Profiling Memory Usage ==="
echo ""

XDEBUG_CONFIG="$XDEBUG_CONFIG" php -d xdebug.start_with_request=yes \
    "$(dirname "$0")/test-memory-usage.php"

echo ""
echo "=== Profiling Complete ==="
echo ""

# List generated files
echo "Profile files generated:"
ls -lh "$OUTPUT_DIR"/cachegrind.out.* 2>/dev/null || echo "No profile files found"

echo ""
echo "=== Viewing Results ==="
echo ""
echo "To view the profiling results, use KCachegrind or QCachegrind:"
echo ""
echo "  Linux:   kcachegrind $OUTPUT_DIR/cachegrind.out.*"
echo "  macOS:   qcachegrind $OUTPUT_DIR/cachegrind.out.*"
echo "  Windows: Use WinCacheGrind"
echo ""
echo "Install viewers:"
echo "  Ubuntu/Debian: sudo apt-get install kcachegrind"
echo "  macOS: brew install qcachegrind"
echo ""

# Generate text summary if possible
if command -v callgrind_annotate &> /dev/null; then
    echo "=== Text Summary ==="
    echo ""
    
    for file in "$OUTPUT_DIR"/cachegrind.out.*; do
        if [ -f "$file" ]; then
            echo "File: $(basename "$file")"
            callgrind_annotate "$file" | head -30
            echo ""
        fi
    done
else
    echo "Install valgrind for text summaries: sudo apt-get install valgrind"
fi

echo "=== Key Metrics to Look For ==="
echo ""
echo "1. Function Call Count - Should be minimal"
echo "2. Inclusive Time - Total time including called functions"
echo "3. Self Time - Time spent in function itself"
echo "4. Memory Usage - Should be under 50MB"
echo ""
echo "Focus on:"
echo "- MASE_CSS_Generator::generate()"
echo "- MASE_Settings::update_option()"
echo "- Database queries (get_option, update_option)"
echo ""
