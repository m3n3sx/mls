#!/bin/bash

# MASE v1.2.0 - Test Suite Validation Script
# This script verifies that all test files are present and properly structured

echo "=========================================="
echo "MASE v1.2.0 Test Suite Validation"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
PASSED=0
FAILED=0

# Function to check file existence
check_file() {
    TOTAL=$((TOTAL + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $2 - File not found: $1"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Function to check file content
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} Contains: $2"
        return 0
    else
        echo -e "  ${YELLOW}⚠${NC} Missing: $2"
        return 1
    fi
}

echo "Checking Test Files..."
echo "----------------------------------------"

# Check main integration test suite
check_file "integration-test-suite.html" "Main Integration Test Suite"
if [ $? -eq 0 ]; then
    check_content "integration-test-suite.html" "test_9_1_LivePreview"
    check_content "integration-test-suite.html" "test_9_2_DarkMode"
    check_content "integration-test-suite.html" "test_9_3_SettingsSave"
    check_content "integration-test-suite.html" "test_9_4_TabNavigation"
    check_content "integration-test-suite.html" "test_9_5_CardLayout"
    check_content "integration-test-suite.html" "test_9_6_CrossBrowser"
    check_content "integration-test-suite.html" "test_9_7_ErrorHandling"
fi

echo ""

# Check individual test files
check_file "test-live-preview.html" "Live Preview Test"
check_file "test-dark-mode.html" "Dark Mode Test"
check_file "test-ajax-save.html" "AJAX Save Test"
check_file "test-tab-navigation.html" "Tab Navigation Test"
check_file "test-card-layout.html" "Card Layout Test"
check_file "test-console-logging.html" "Console Logging Test"

echo ""
echo "Checking Documentation..."
echo "----------------------------------------"

# Check documentation files
check_file "TASK-9-TESTING-GUIDE.md" "Testing Guide"
check_file "TASK-9-IMPLEMENTATION-SUMMARY.md" "Implementation Summary"
check_file "QUICK-TEST-REFERENCE.md" "Quick Test Reference"

echo ""
echo "Checking Core Assets..."
echo "----------------------------------------"

# Check core JavaScript and CSS files
check_file "../../../assets/js/mase-admin.js" "Main JavaScript File"
check_file "../../../assets/css/mase-admin.css" "Main CSS File"

echo ""
echo "Checking Requirements and Design..."
echo "----------------------------------------"

# Check spec files
check_file "requirements.md" "Requirements Document"
check_file "design.md" "Design Document"
check_file "tasks.md" "Tasks Document"

echo ""
echo "=========================================="
echo "Validation Results"
echo "=========================================="
echo -e "Total Checks: ${TOTAL}"
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All validation checks passed!${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Open integration-test-suite.html in a browser"
    echo "2. Click 'Run All Tests'"
    echo "3. Verify all tests pass"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some validation checks failed${NC}"
    echo "Please review the missing files above"
    echo ""
    exit 1
fi
