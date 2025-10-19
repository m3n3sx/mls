#!/bin/bash

# MASE Plugin Cache Cleaner (File System Level)
# Clears temporary files and caches

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

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Start
print_header "MASE Plugin Cache Cleaner"
echo ""

CLEARED=0

# 1. Clear temporary test files
print_info "1. Clearing temporary test files..."
if [ -d "temp" ]; then
    rm -rf temp
    print_success "Removed temp/ directory"
    ((CLEARED++))
fi

if [ -d "temp_verify" ]; then
    rm -rf temp_verify
    print_success "Removed temp_verify/ directory"
    ((CLEARED++))
fi

if [ -d "build" ]; then
    rm -rf build
    print_success "Removed build/ directory"
    ((CLEARED++))
fi

# 2. Clear node_modules cache (if exists)
print_info "2. Checking node_modules..."
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    print_success "Cleared node_modules/.cache"
    ((CLEARED++))
else
    print_warning "No node_modules/.cache found"
fi

# 3. Clear npm cache
print_info "3. Clearing npm cache..."
if command -v npm &> /dev/null; then
    npm cache clean --force 2>/dev/null || true
    print_success "NPM cache cleared"
    ((CLEARED++))
else
    print_warning "NPM not found, skipping"
fi

# 4. Clear PHP opcache (if running)
print_info "4. Clearing PHP opcache..."
if command -v php &> /dev/null; then
    # Try to clear opcache via CLI
    php -r "if (function_exists('opcache_reset')) { opcache_reset(); echo 'OPcache cleared'; } else { echo 'OPcache not available'; }" 2>/dev/null || print_warning "Could not clear opcache"
    ((CLEARED++))
else
    print_warning "PHP not found, skipping"
fi

# 5. Clear any .DS_Store files (Mac)
print_info "5. Removing .DS_Store files..."
DSSTORE_COUNT=$(find . -name ".DS_Store" -type f 2>/dev/null | wc -l)
if [ "$DSSTORE_COUNT" -gt 0 ]; then
    find . -name ".DS_Store" -type f -delete 2>/dev/null
    print_success "Removed $DSSTORE_COUNT .DS_Store files"
    ((CLEARED++))
else
    print_warning "No .DS_Store files found"
fi

# 6. Clear Thumbs.db files (Windows)
print_info "6. Removing Thumbs.db files..."
THUMBS_COUNT=$(find . -name "Thumbs.db" -type f 2>/dev/null | wc -l)
if [ "$THUMBS_COUNT" -gt 0 ]; then
    find . -name "Thumbs.db" -type f -delete 2>/dev/null
    print_success "Removed $THUMBS_COUNT Thumbs.db files"
    ((CLEARED++))
else
    print_warning "No Thumbs.db files found"
fi

# 7. Clear any *.log files in plugin directory
print_info "7. Checking for log files..."
LOG_COUNT=$(find . -maxdepth 1 -name "*.log" -type f 2>/dev/null | wc -l)
if [ "$LOG_COUNT" -gt 0 ]; then
    echo "Found $LOG_COUNT log files:"
    find . -maxdepth 1 -name "*.log" -type f -exec basename {} \;
    read -p "Do you want to delete them? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        find . -maxdepth 1 -name "*.log" -type f -delete
        print_success "Removed $LOG_COUNT log files"
        ((CLEARED++))
    else
        print_warning "Log files kept"
    fi
else
    print_warning "No log files found"
fi

# 8. Clear browser cache instructions
echo ""
print_header "Browser Cache"
print_info "To clear browser cache:"
echo "  Chrome: Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)"
echo "  Firefox: Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)"
echo "  Safari: Cmd+Option+E"
echo "  Edge: Ctrl+Shift+Delete"

# 9. WordPress cache instructions
echo ""
print_header "WordPress Cache"
print_info "To clear WordPress cache, run:"
echo "  php clear-plugin-cache.php"
echo ""
print_info "Or from WordPress admin:"
echo "  1. Go to MASE settings page"
echo "  2. Click 'Clear Cache' button (if available)"
echo "  3. Or deactivate and reactivate the plugin"

# Summary
echo ""
print_header "Cache Cleanup Summary"
print_success "Completed $CLEARED cleanup operations"
echo ""
print_info "Next steps:"
echo "  1. Clear WordPress cache: php clear-plugin-cache.php"
echo "  2. Clear browser cache: Ctrl+Shift+Delete"
echo "  3. Reload WordPress admin page"
echo "  4. Verify MASE settings load correctly"
echo ""
print_success "File system cache cleanup complete!"
