#!/bin/bash
#
# Create Deployment Package
# Creates clean ZIP file for WordPress.org submission
#
# Usage: ./scripts/create-package.sh [version]
#

set -e

# Get version from plugin file if not provided
if [ -z "$1" ]; then
    VERSION=$(grep "Version:" modern-admin-styler.php | head -1 | sed 's/.*Version: //' | sed 's/ *$//')
else
    VERSION=$1
fi

PLUGIN_SLUG="modern-admin-styler"
BUILD_DIR="build"
PACKAGE_DIR="$BUILD_DIR/$PLUGIN_SLUG"
PACKAGE_FILE="$PLUGIN_SLUG-$VERSION.zip"

echo "=========================================="
echo "Creating Deployment Package"
echo "=========================================="
echo ""
echo "Plugin: $PLUGIN_SLUG"
echo "Version: $VERSION"
echo ""

# Clean previous build
if [ -d "$BUILD_DIR" ]; then
    echo "Cleaning previous build..."
    rm -rf "$BUILD_DIR"
fi

# Create build directory
mkdir -p "$PACKAGE_DIR"

echo "Copying files..."

# Copy main plugin file
cp modern-admin-styler.php "$PACKAGE_DIR/"

# Copy includes directory
cp -r includes "$PACKAGE_DIR/"

# Copy assets directory
cp -r assets "$PACKAGE_DIR/"

# Copy languages directory (if exists)
if [ -d "languages" ]; then
    cp -r languages "$PACKAGE_DIR/"
fi

# Copy documentation
cp README.md "$PACKAGE_DIR/"
cp CHANGELOG.md "$PACKAGE_DIR/"
cp LICENSE "$PACKAGE_DIR/" 2>/dev/null || echo "LICENSE file not found"

# Copy readme.txt
if [ -f "readme.txt" ]; then
    cp readme.txt "$PACKAGE_DIR/"
else
    echo "Warning: readme.txt not found"
fi

# Remove development files from package
echo "Cleaning development files..."
find "$PACKAGE_DIR" -name ".git*" -delete
find "$PACKAGE_DIR" -name ".DS_Store" -delete
find "$PACKAGE_DIR" -name "*.log" -delete
find "$PACKAGE_DIR" -name "*.map" -delete
find "$PACKAGE_DIR" -name "Thumbs.db" -delete

# Create ZIP file
echo "Creating ZIP archive..."
cd "$BUILD_DIR"
zip -r "../$PACKAGE_FILE" "$PLUGIN_SLUG" -q

cd ..

# Get package size
PACKAGE_SIZE=$(du -h "$PACKAGE_FILE" | cut -f1)

echo ""
echo "=========================================="
echo "Package Created Successfully"
echo "=========================================="
echo ""
echo "File: $PACKAGE_FILE"
echo "Size: $PACKAGE_SIZE"
echo ""

# Check size limit (5MB)
PACKAGE_SIZE_BYTES=$(stat -f%z "$PACKAGE_FILE" 2>/dev/null || stat -c%s "$PACKAGE_FILE" 2>/dev/null)
SIZE_LIMIT=$((5 * 1024 * 1024))

if [ "$PACKAGE_SIZE_BYTES" -gt "$SIZE_LIMIT" ]; then
    echo "⚠ WARNING: Package size exceeds 5MB limit"
    echo "   Current: $PACKAGE_SIZE"
    echo "   Limit: 5MB"
else
    echo "✓ Package size OK ($PACKAGE_SIZE < 5MB)"
fi

echo ""
echo "Package contents:"
unzip -l "$PACKAGE_FILE" | head -20

echo ""
echo "Next steps:"
echo "  1. Test installation: unzip $PACKAGE_FILE -d /tmp/test"
echo "  2. Verify all files present"
echo "  3. Upload to WordPress.org SVN"
