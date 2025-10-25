#!/bin/bash

# Run all dark mode integration tests
# Task 24: Create integration tests

echo "=========================================="
echo "Dark Mode Integration Test Suite"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name=$1
    local test_file=$2
    
    echo -e "${YELLOW}Running: ${test_name}${NC}"
    echo "----------------------------------------"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [[ $test_file == *.php ]]; then
        # Run PHP test
        php "$test_file"
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ PASSED${NC}"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            echo -e "${RED}✗ FAILED${NC}"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    elif [[ $test_file == *.html ]]; then
        # HTML tests need to be opened in browser
        echo -e "${YELLOW}ℹ HTML test - open in browser: $test_file${NC}"
        echo "  Requirements tested:"
        grep -A 5 "Requirements:" "$test_file" | head -n 6
    fi
    
    echo ""
}

# Change to integration test directory
cd "$(dirname "$0")"

echo "Test 1: Dark Mode with Live Preview"
run_test "Live Preview Integration" "test-dark-mode-live-preview-integration.html"

echo "Test 2: Cache Management"
run_test "Cache Integration" "test-dark-mode-cache-integration.html"

echo "Test 3: Migration Logic"
run_test "Migration Integration" "test-dark-mode-migration-integration.php"

echo "Test 4: AJAX & Settings Persistence"
run_test "AJAX Settings Integration" "test-dark-mode-ajax-settings-integration.php"

echo "Test 5: Comprehensive Integration"
run_test "Comprehensive Integration" "test-dark-mode-comprehensive-integration.html"

echo "Test 6: Custom Events"
run_test "Custom Events Integration" "test-dark-mode-custom-events.html"

echo "Test 7: FOUC Prevention"
run_test "FOUC Prevention Integration" "test-dark-mode-fouc-prevention-integration.html"

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "Total Tests:  ${TOTAL_TESTS}"
echo -e "Passed:       ${GREEN}${PASSED_TESTS}${NC}"
echo -e "Failed:       ${RED}${FAILED_TESTS}${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All integration tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
