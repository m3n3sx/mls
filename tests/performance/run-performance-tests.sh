#!/bin/bash

###############################################################################
# Performance Test Runner
# 
# Runs all performance tests and generates a comprehensive report
# 
# Usage: ./run-performance-tests.sh
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test directory
TEST_DIR="$(cd "$(dirname "$0")" && pwd)"
RESULTS_DIR="$TEST_DIR/performance-results"

# Create results directory
mkdir -p "$RESULTS_DIR"

# Timestamp for this test run
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
REPORT_FILE="$RESULTS_DIR/performance-report-$TIMESTAMP.txt"

echo "==================================================================="
echo "           MASE v1.2.0 Performance Test Suite"
echo "==================================================================="
echo ""
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo "Results Directory: $RESULTS_DIR"
echo ""

# Initialize report
{
    echo "==================================================================="
    echo "           MASE v1.2.0 Performance Test Report"
    echo "==================================================================="
    echo ""
    echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
} > "$REPORT_FILE"

# Track overall status
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test and capture results
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "${BLUE}Running: $test_name${NC}"
    echo "-------------------------------------------------------------------"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        {
            echo "[$test_name] PASS"
            echo ""
        } >> "$REPORT_FILE"
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        {
            echo "[$test_name] FAIL"
            echo ""
        } >> "$REPORT_FILE"
    fi
    
    echo ""
}

# Run PHP tests
echo "==================================================================="
echo "                    PHP Performance Tests"
echo "==================================================================="
echo ""

run_test "CSS Generation Performance" \
    "php '$TEST_DIR/test-css-generation-performance.php'"

run_test "Settings Save Performance" \
    "php '$TEST_DIR/test-settings-save-performance.php'"

run_test "Memory Usage" \
    "php '$TEST_DIR/test-memory-usage.php'"

run_test "Cache Performance" \
    "php '$TEST_DIR/test-cache-performance.php'"

# JavaScript tests
echo "==================================================================="
echo "                JavaScript Performance Tests"
echo "==================================================================="
echo ""

echo -e "${YELLOW}⚠️  JavaScript tests require manual execution${NC}"
echo ""
echo "To run JavaScript tests:"
echo "  1. Open: $TEST_DIR/test-javascript-performance.html"
echo "  2. Click 'Run All Tests'"
echo "  3. Export results"
echo ""

{
    echo "[JavaScript Performance] MANUAL"
    echo "  Open test-javascript-performance.html in browser"
    echo ""
} >> "$REPORT_FILE"

# Lighthouse audit
echo "==================================================================="
echo "                    Lighthouse Audit"
echo "==================================================================="
echo ""

if command -v lighthouse &> /dev/null; then
    echo -e "${YELLOW}⚠️  Lighthouse requires a running WordPress site${NC}"
    echo ""
    echo "To run Lighthouse audit:"
    echo "  node lighthouse-audit.js http://your-site.com/wp-admin"
    echo ""
    
    {
        echo "[Lighthouse Audit] MANUAL"
        echo "  Run: node lighthouse-audit.js [url]"
        echo ""
    } >> "$REPORT_FILE"
else
    echo -e "${YELLOW}⚠️  Lighthouse not installed${NC}"
    echo ""
    echo "Install Lighthouse:"
    echo "  npm install -g lighthouse"
    echo ""
    
    {
        echo "[Lighthouse Audit] SKIPPED"
        echo "  Lighthouse not installed"
        echo ""
    } >> "$REPORT_FILE"
fi

# Profiling
echo "==================================================================="
echo "                      Profiling Tools"
echo "==================================================================="
echo ""

echo -e "${YELLOW}⚠️  Profiling requires manual execution${NC}"
echo ""
echo "PHP Profiling (Xdebug):"
echo "  ./profile-php-xdebug.sh"
echo ""
echo "JavaScript Profiling (Chrome DevTools):"
echo "  See: profile-chrome-devtools.md"
echo ""

{
    echo "[PHP Profiling] MANUAL"
    echo "  Run: ./profile-php-xdebug.sh"
    echo ""
    echo "[JavaScript Profiling] MANUAL"
    echo "  See: profile-chrome-devtools.md"
    echo ""
} >> "$REPORT_FILE"

# Generate summary
echo "==================================================================="
echo "                         Summary"
echo "==================================================================="
echo ""

{
    echo "==================================================================="
    echo "                         Summary"
    echo "==================================================================="
    echo ""
} >> "$REPORT_FILE"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ All automated tests passed!${NC}"
    {
        echo "Status: ✅ ALL TESTS PASSED"
        echo ""
    } >> "$REPORT_FILE"
else
    echo -e "${RED}❌ Some tests failed${NC}"
    {
        echo "Status: ❌ SOME TESTS FAILED"
        echo ""
    } >> "$REPORT_FILE"
fi

echo ""
echo "Total Tests:  $TOTAL_TESTS"
echo "Passed:       $PASSED_TESTS"
echo "Failed:       $FAILED_TESTS"
echo ""

{
    echo "Total Tests:  $TOTAL_TESTS"
    echo "Passed:       $PASSED_TESTS"
    echo "Failed:       $FAILED_TESTS"
    echo ""
} >> "$REPORT_FILE"

# Performance targets summary
echo "==================================================================="
echo "                   Performance Targets"
echo "==================================================================="
echo ""

{
    echo "==================================================================="
    echo "                   Performance Targets"
    echo "==================================================================="
    echo ""
} >> "$REPORT_FILE"

echo "Target                          Status"
echo "-------------------------------------------------------------------"

{
    echo "Target                          Status"
    echo "-------------------------------------------------------------------"
} >> "$REPORT_FILE"

# Check if result files exist and extract status
check_target() {
    local target_name="$1"
    local result_pattern="$2"
    local target_value="$3"
    
    local latest_file=$(ls -t "$RESULTS_DIR"/$result_pattern 2>/dev/null | head -1)
    
    if [ -f "$latest_file" ]; then
        local passed=$(jq -r '.pass' "$latest_file" 2>/dev/null || echo "unknown")
        
        if [ "$passed" = "true" ]; then
            echo -e "$target_name $target_value ${GREEN}✅ PASS${NC}"
            echo "$target_name $target_value ✅ PASS" >> "$REPORT_FILE"
        elif [ "$passed" = "false" ]; then
            echo -e "$target_name $target_value ${RED}❌ FAIL${NC}"
            echo "$target_name $target_value ❌ FAIL" >> "$REPORT_FILE"
        else
            echo -e "$target_name $target_value ${YELLOW}⚠️  UNKNOWN${NC}"
            echo "$target_name $target_value ⚠️  UNKNOWN" >> "$REPORT_FILE"
        fi
    else
        echo -e "$target_name $target_value ${YELLOW}⚠️  NOT RUN${NC}"
        echo "$target_name $target_value ⚠️  NOT RUN" >> "$REPORT_FILE"
    fi
}

check_target "CSS Generation Time        " "css-generation-*.json" "<100ms"
check_target "Settings Save Time         " "settings-save-*.json" "<500ms"
check_target "Page Load Time             " "lighthouse-*.json" "<450ms"
check_target "Memory Usage               " "memory-usage-*.json" "<50MB"
check_target "Cache Hit Rate             " "cache-performance-*.json" ">80%"

echo ""
{
    echo ""
} >> "$REPORT_FILE"

# Next steps
echo "==================================================================="
echo "                       Next Steps"
echo "==================================================================="
echo ""

{
    echo "==================================================================="
    echo "                       Next Steps"
    echo "==================================================================="
    echo ""
} >> "$REPORT_FILE"

echo "1. Review detailed results in: $RESULTS_DIR"
echo "2. Run JavaScript tests manually in browser"
echo "3. Run Lighthouse audit on live site"
echo "4. Profile with Xdebug if performance issues found"
echo "5. Profile with Chrome DevTools for JavaScript issues"
echo ""

{
    echo "1. Review detailed results in: $RESULTS_DIR"
    echo "2. Run JavaScript tests manually in browser"
    echo "3. Run Lighthouse audit on live site"
    echo "4. Profile with Xdebug if performance issues found"
    echo "5. Profile with Chrome DevTools for JavaScript issues"
    echo ""
} >> "$REPORT_FILE"

echo "Report saved to: $REPORT_FILE"
echo ""

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    exit 0
else
    exit 1
fi
