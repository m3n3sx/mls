#!/bin/bash

# Modern Admin Styler Enterprise - Package Verification Script
# Version: 1.2.0
# Verifies the release package contains all required files

set -e

# Configuration
PACKAGE_FILE="modern-admin-styler-1.2.0.zip"
TEMP_DIR="temp_verify"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASS_COUNT=0
FAIL_COUNT=0

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_pass() {
    echo -e "${GREEN}✓ $1${NC}"
    ((PASS_COUNT++))
}

print_fail() {
    echo -e "${RED}✗ $1${NC}"
    ((FAIL_COUNT++))
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_file() {
    if [ -f "$TEMP_DIR/modern-admin-styler/$1" ]; then
        print_pass "$1"
        return 0
    else
        print_fail "$1 (MISSING)"
        return 1
    fi
}

check_not_exists() {
    if [ ! -e "$TEMP_DIR/modern-admin-styler/$1" ]; then
        print_pass "$1 (correctly excluded)"
        return 0
    else
        print_fail "$1 (should be excluded)"
        return 1
    fi
}

# Start
print_header "MASE v1.2.0 Package Verification"

# Check if package exists
if [ ! -f "$PACKAGE_FILE" ]; then
    print_fail "Package file not found: $PACKAGE_FILE"
    exit 1
fi

print_pass "Package file exists: $PACKAGE_FILE"

# Clean up old temp directory
if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi

# Extract package
print_info "Extracting package..."
unzip -q "$PACKAGE_FILE" -d "$TEMP_DIR"
print_pass "Package extracted"

# Verify core files
print_header "Verifying Core Files"
check_file "modern-admin-styler.php"
check_file "README.md"
check_file "CHANGELOG.md"
check_file "RELEASE-NOTES-v1.2.0.md"

# Verify includes directory
print_header "Verifying Includes Directory"
check_file "includes/admin-settings-page.php"
check_file "includes/class-mase-admin.php"
check_file "includes/class-mase-cache.php"
check_file "includes/class-mase-cachemanager.php"
check_file "includes/class-mase-css-generator.php"
check_file "includes/class-mase-migration.php"
check_file "includes/class-mase-mobile-optimizer.php"
check_file "includes/class-mase-settings.php"
check_file "includes/visual-effects-section.php"

# Verify assets directory
print_header "Verifying Assets Directory"
check_file "assets/css/mase-admin.css"
check_file "assets/css/mase-palettes.css"
check_file "assets/css/mase-templates.css"
check_file "assets/css/mase-responsive.css"
check_file "assets/css/mase-accessibility.css"
check_file "assets/js/mase-admin.js"

# Verify documentation
print_header "Verifying Documentation"
check_file "docs/README.md"
check_file "docs/USER-GUIDE.md"
check_file "docs/DEVELOPER.md"
check_file "docs/FAQ.md"
check_file "docs/TROUBLESHOOTING.md"
check_file "docs/HOOKS-FILTERS.md"
check_file "docs/PALETTES-TEMPLATES.md"
check_file "docs/COMPONENTS.md"
check_file "docs/CSS-VARIABLES.md"
check_file "docs/CSS-IMPLEMENTATION-GUIDE.md"
check_file "docs/RESPONSIVE.md"

# Verify excluded files
print_header "Verifying Excluded Files"
check_not_exists "tests"
check_not_exists "node_modules"
check_not_exists ".kiro"
check_not_exists "package.json"
check_not_exists "package-lock.json"

# Check for test files
print_info "Checking for test files..."
TEST_FILES=$(find "$TEMP_DIR/modern-admin-styler" -name "test-*.php" 2>/dev/null | wc -l)
if [ "$TEST_FILES" -eq 0 ]; then
    print_pass "No test files found (correct)"
else
    print_fail "Found $TEST_FILES test files (should be 0)"
fi

# Check for development markdown files
print_info "Checking for development markdown files..."
DEV_FILES=$(find "$TEMP_DIR/modern-admin-styler" -maxdepth 1 -name "BUGFIX-*.md" -o -name "TASK-*.md" -o -name "TESTING.md" 2>/dev/null | wc -l)
if [ "$DEV_FILES" -eq 0 ]; then
    print_pass "No development markdown files found (correct)"
else
    print_fail "Found $DEV_FILES development markdown files (should be 0)"
fi

# Verify version in main file
print_header "Verifying Version Numbers"
VERSION_IN_FILE=$(grep "Version: 1.2.0" "$TEMP_DIR/modern-admin-styler/modern-admin-styler.php")
if [ -n "$VERSION_IN_FILE" ]; then
    print_pass "Version 1.2.0 found in plugin header"
else
    print_fail "Version 1.2.0 not found in plugin header"
fi

VERSION_CONSTANT=$(grep "define( 'MASE_VERSION', '1.2.0' )" "$TEMP_DIR/modern-admin-styler/modern-admin-styler.php")
if [ -n "$VERSION_CONSTANT" ]; then
    print_pass "MASE_VERSION constant is 1.2.0"
else
    print_fail "MASE_VERSION constant is not 1.2.0"
fi

# Check file count
print_header "Package Statistics"
TOTAL_FILES=$(find "$TEMP_DIR/modern-admin-styler" -type f | wc -l)
print_info "Total files: $TOTAL_FILES"

TOTAL_SIZE=$(du -sh "$TEMP_DIR/modern-admin-styler" | cut -f1)
print_info "Total size: $TOTAL_SIZE"

PACKAGE_SIZE=$(du -h "$PACKAGE_FILE" | cut -f1)
print_info "Package size: $PACKAGE_SIZE"

# Clean up
print_info "Cleaning up..."
rm -rf "$TEMP_DIR"
print_pass "Cleanup complete"

# Summary
print_header "Verification Summary"
echo ""
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    print_header "✓ VERIFICATION PASSED"
    echo ""
    print_info "The package is ready for distribution!"
    exit 0
else
    print_header "✗ VERIFICATION FAILED"
    echo ""
    print_fail "$FAIL_COUNT issues found. Please fix before distribution."
    exit 1
fi
