#!/bin/bash

# MASE Plugin - Complete Cache Cleaner
# Clears ALL caches (file system + WordPress)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Start
clear
print_header "MASE Complete Cache Cleaner"
echo ""
print_warning "This will clear ALL MASE caches!"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Cancelled by user"
    exit 0
fi

echo ""
TOTAL_CLEARED=0
ERRORS=0

# Step 1: File system cache
print_header "Step 1: File System Cache"
if [ -f "clear-cache.sh" ]; then
    bash clear-cache.sh
    print_success "File system cache cleared"
    ((TOTAL_CLEARED++))
else
    print_error "clear-cache.sh not found"
    ((ERRORS++))
fi

echo ""

# Step 2: WordPress cache
print_header "Step 2: WordPress Cache"
if [ -f "clear-plugin-cache.php" ]; then
    php clear-plugin-cache.php
    print_success "WordPress cache cleared"
    ((TOTAL_CLEARED++))
else
    print_error "clear-plugin-cache.php not found"
    ((ERRORS++))
fi

echo ""

# Step 3: Additional cleanup
print_header "Step 3: Additional Cleanup"

# Clear any remaining temp files
print_info "Clearing additional temp files..."
find . -name "*.tmp" -type f -delete 2>/dev/null && print_success "Removed .tmp files" || print_warning "No .tmp files found"
find . -name "*.cache" -type f -delete 2>/dev/null && print_success "Removed .cache files" || print_warning "No .cache files found"

# Clear any backup temp files
if [ -d "backup_temp" ]; then
    rm -rf backup_temp
    print_success "Removed backup_temp directory"
fi

# Clear any test output files
find . -maxdepth 1 -name "test-output-*.txt" -type f -delete 2>/dev/null && print_success "Removed test output files" || true

echo ""

# Step 4: Verify cleanup
print_header "Step 4: Verification"

print_info "Checking for remaining cache files..."

# Check for temp directories
TEMP_DIRS=$(find . -maxdepth 1 -type d -name "temp*" 2>/dev/null | wc -l)
if [ "$TEMP_DIRS" -eq 0 ]; then
    print_success "No temp directories found"
else
    print_warning "Found $TEMP_DIRS temp directories"
fi

# Check for cache files
CACHE_FILES=$(find . -name "*.cache" -type f 2>/dev/null | wc -l)
if [ "$CACHE_FILES" -eq 0 ]; then
    print_success "No cache files found"
else
    print_warning "Found $CACHE_FILES cache files"
fi

echo ""

# Summary
print_header "Cleanup Summary"
echo ""

if [ $ERRORS -eq 0 ]; then
    print_success "All cache cleared successfully!"
    print_success "Operations completed: $TOTAL_CLEARED"
else
    print_warning "Cleanup completed with $ERRORS errors"
    print_success "Successful operations: $TOTAL_CLEARED"
fi

echo ""
print_header "Next Steps"
echo ""
print_info "1. Clear browser cache (Ctrl+Shift+Delete)"
print_info "2. Reload WordPress admin page"
print_info "3. Go to MASE settings and verify everything works"
print_info "4. CSS will be regenerated on next page load"
echo ""

print_success "Cache cleanup complete!"
echo ""
