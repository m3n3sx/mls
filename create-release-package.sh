#!/bin/bash

# Modern Admin Styler Enterprise - Release Package Creator
# Version: 1.2.0
# Creates a clean ZIP file for WordPress plugin distribution

set -e  # Exit on error

# Configuration
PLUGIN_SLUG="modern-admin-styler"
VERSION="1.2.0"
BUILD_DIR="build"
PACKAGE_NAME="${PLUGIN_SLUG}-${VERSION}"
PACKAGE_FILE="${PACKAGE_NAME}.zip"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
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

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Start
print_header "MASE v${VERSION} Release Package Creator"

# Check if we're in the right directory
if [ ! -f "modern-admin-styler.php" ]; then
    print_error "Error: modern-admin-styler.php not found!"
    print_info "Please run this script from the plugin root directory."
    exit 1
fi

print_success "Found plugin root directory"

# Clean up old build
if [ -d "$BUILD_DIR" ]; then
    print_info "Cleaning up old build directory..."
    rm -rf "$BUILD_DIR"
fi

if [ -f "$PACKAGE_FILE" ]; then
    print_info "Removing old package file..."
    rm -f "$PACKAGE_FILE"
fi

print_success "Cleaned up old files"

# Create build directory
print_info "Creating build directory..."
mkdir -p "$BUILD_DIR/$PLUGIN_SLUG"
print_success "Build directory created"

# Copy files
print_header "Copying Plugin Files"

# Core files
print_info "Copying core files..."
cp modern-admin-styler.php "$BUILD_DIR/$PLUGIN_SLUG/"
cp README.md "$BUILD_DIR/$PLUGIN_SLUG/"
cp CHANGELOG.md "$BUILD_DIR/$PLUGIN_SLUG/"
cp RELEASE-NOTES-v1.2.0.md "$BUILD_DIR/$PLUGIN_SLUG/"
print_success "Core files copied"

# Includes directory
print_info "Copying includes directory..."
cp -r includes "$BUILD_DIR/$PLUGIN_SLUG/"
print_success "Includes directory copied"

# Assets directory
print_info "Copying assets directory..."
cp -r assets "$BUILD_DIR/$PLUGIN_SLUG/"
print_success "Assets directory copied"

# Documentation
print_info "Copying documentation..."
cp -r docs "$BUILD_DIR/$PLUGIN_SLUG/"
print_success "Documentation copied"

# Clean up unnecessary files from build
print_header "Cleaning Up Build"

# Remove development files
print_info "Removing development files..."
find "$BUILD_DIR/$PLUGIN_SLUG" -name ".DS_Store" -delete
find "$BUILD_DIR/$PLUGIN_SLUG" -name "Thumbs.db" -delete
find "$BUILD_DIR/$PLUGIN_SLUG" -name ".gitkeep" -delete
print_success "Development files removed"

# Remove test files (they're not needed in production)
if [ -d "$BUILD_DIR/$PLUGIN_SLUG/tests" ]; then
    print_info "Removing test directory..."
    rm -rf "$BUILD_DIR/$PLUGIN_SLUG/tests"
    print_success "Test directory removed"
fi

# Remove node_modules if present
if [ -d "$BUILD_DIR/$PLUGIN_SLUG/node_modules" ]; then
    print_info "Removing node_modules..."
    rm -rf "$BUILD_DIR/$PLUGIN_SLUG/node_modules"
    print_success "node_modules removed"
fi

# Remove package files
if [ -f "$BUILD_DIR/$PLUGIN_SLUG/package.json" ]; then
    rm -f "$BUILD_DIR/$PLUGIN_SLUG/package.json"
fi
if [ -f "$BUILD_DIR/$PLUGIN_SLUG/package-lock.json" ]; then
    rm -f "$BUILD_DIR/$PLUGIN_SLUG/package-lock.json"
fi

# Remove development markdown files
print_info "Removing development documentation..."
rm -f "$BUILD_DIR/$PLUGIN_SLUG/BUGFIX-"*.md
rm -f "$BUILD_DIR/$PLUGIN_SLUG/CSS-FRAMEWORK-"*.md
rm -f "$BUILD_DIR/$PLUGIN_SLUG/CURRENT-STATUS.md"
rm -f "$BUILD_DIR/$PLUGIN_SLUG/EMERGENCY-"*.md
rm -f "$BUILD_DIR/$PLUGIN_SLUG/PERFORMANCE-"*.md
rm -f "$BUILD_DIR/$PLUGIN_SLUG/REFACTORING-"*.md
rm -f "$BUILD_DIR/$PLUGIN_SLUG/ROLLBACK-"*.md
rm -f "$BUILD_DIR/$PLUGIN_SLUG/TASK-"*.md
rm -f "$BUILD_DIR/$PLUGIN_SLUG/TESTING.md"
print_success "Development documentation removed"

# Remove test PHP files
print_info "Removing test PHP files..."
rm -f "$BUILD_DIR/$PLUGIN_SLUG/test-"*.php
print_success "Test PHP files removed"

# Remove .kiro directory if present
if [ -d "$BUILD_DIR/$PLUGIN_SLUG/.kiro" ]; then
    print_info "Removing .kiro directory..."
    rm -rf "$BUILD_DIR/$PLUGIN_SLUG/.kiro"
    print_success ".kiro directory removed"
fi

# Create ZIP package
print_header "Creating ZIP Package"

print_info "Creating ${PACKAGE_FILE}..."
cd "$BUILD_DIR"
zip -r "../${PACKAGE_FILE}" "$PLUGIN_SLUG" -q
cd ..
print_success "ZIP package created"

# Get file size
FILE_SIZE=$(du -h "$PACKAGE_FILE" | cut -f1)
print_success "Package size: ${FILE_SIZE}"

# Verify ZIP contents
print_header "Verifying Package Contents"

print_info "Listing package contents..."
unzip -l "$PACKAGE_FILE" | head -20
echo "..."
echo ""

# Count files
FILE_COUNT=$(unzip -l "$PACKAGE_FILE" | tail -1 | awk '{print $2}')
print_success "Total files in package: ${FILE_COUNT}"

# Clean up build directory
print_info "Cleaning up build directory..."
rm -rf "$BUILD_DIR"
print_success "Build directory cleaned"

# Final summary
print_header "Package Creation Complete!"

echo ""
print_success "Package: ${PACKAGE_FILE}"
print_success "Version: ${VERSION}"
print_success "Size: ${FILE_SIZE}"
print_success "Files: ${FILE_COUNT}"
echo ""

print_info "Next steps:"
echo "  1. Test installation: Install ${PACKAGE_FILE} on a test WordPress site"
echo "  2. Test upgrade: Upgrade from v1.1.0 using ${PACKAGE_FILE}"
echo "  3. Verify all files: Check that all necessary files are included"
echo "  4. Test functionality: Verify all features work correctly"
echo "  5. Tag release: git tag -a v${VERSION} -m 'Release v${VERSION}'"
echo "  6. Push tag: git push origin v${VERSION}"
echo ""

print_success "Release package ready for distribution!"
