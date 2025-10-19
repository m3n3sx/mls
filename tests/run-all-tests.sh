#!/bin/bash

# MASE v1.2.0 - Complete Test Suite Runner
# This script runs all tests: unit, integration, and E2E

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     MASE v1.2.0 Complete Test Suite                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to print section header
print_section() {
    echo ""
    echo "┌─────────────────────────────────────────────────────────────┐"
    printf "│ %-59s │\n" "$1"
    echo "└─────────────────────────────────────────────────────────────┘"
}

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "Running: $test_name... "
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Change to plugin directory
cd "$(dirname "$0")/.."

# 1. PHP Syntax Validation
print_section "PHP Syntax Validation"

for file in $(find . -name "*.php" -not -path "./vendor/*" -not -path "./node_modules/*"); do
    run_test "$(basename $file)" "php -l $file"
done

# 2. Final Validation Script
print_section "Final Validation"

if [ -f "tests/final-validation.php" ]; then
    run_test "Final Validation Script" "php tests/final-validation.php"
else
    echo -e "${YELLOW}⚠ Final validation script not found${NC}"
fi

# 3. Unit Tests
print_section "Unit Tests"

if [ -f "tests/run-unit-tests.sh" ]; then
    run_test "PHP Unit Tests" "bash tests/run-unit-tests.sh"
else
    echo -e "${YELLOW}⚠ Unit test runner not found${NC}"
fi

# 4. Integration Tests
print_section "Integration Tests"

if [ -f "tests/integration/run-integration-tests.sh" ]; then
    run_test "Integration Tests" "bash tests/integration/run-integration-tests.sh"
else
    echo -e "${YELLOW}⚠ Integration test runner not found${NC}"
fi

# 5. Browser Compatibility Tests
print_section "Browser Compatibility"

if [ -f "tests/browser-compatibility/automated-browser-tests.js" ]; then
    if command -v node &> /dev/null; then
        run_test "Browser Compatibility Tests" "node tests/browser-compatibility/automated-browser-tests.js"
    else
        echo -e "${YELLOW}⚠ Node.js not found, skipping browser tests${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Browser compatibility tests not found${NC}"
fi

# 6. Accessibility Tests
print_section "Accessibility Tests"

if [ -f "tests/accessibility/automated-accessibility-tests.js" ]; then
    if command -v node &> /dev/null; then
        run_test "Accessibility Tests" "node tests/accessibility/automated-accessibility-tests.js"
    else
        echo -e "${YELLOW}⚠ Node.js not found, skipping accessibility tests${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Accessibility tests not found${NC}"
fi

# 7. Performance Tests
print_section "Performance Tests"

if [ -f "tests/performance/run-performance-tests.sh" ]; then
    run_test "Performance Tests" "bash tests/performance/run-performance-tests.sh"
else
    echo -e "${YELLOW}⚠ Performance test runner not found${NC}"
fi

# 8. Security Tests
print_section "Security Tests"

if [ -f "tests/security/test-security-audit.php" ]; then
    run_test "Security Audit" "php tests/security/test-security-audit.php"
else
    echo -e "${YELLOW}⚠ Security tests not found${NC}"
fi

# Print Summary
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    TEST SUMMARY                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    echo ""
    exit 1
fi
