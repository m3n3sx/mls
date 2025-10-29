#!/bin/bash
#
# Version Update Script
# Updates version number across all files
#
# Usage: ./scripts/update-version.sh <version>
# Example: ./scripts/update-version.sh 1.2.2
#

set -e

if [ -z "$1" ]; then
    echo "Error: Version number required"
    echo "Usage: $0 <version>"
    echo "Example: $0 1.2.2"
    exit 1
fi

NEW_VERSION=$1

echo "=========================================="
echo "Updating MASE to version $NEW_VERSION"
echo "=========================================="
echo ""

# Validate version format (semantic versioning)
if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid version format. Use semantic versioning (e.g., 1.2.2)"
    exit 1
fi

# 1. Update main plugin file header
echo "1. Updating modern-admin-styler.php..."
sed -i "s/\* Version: .*/\* Version: $NEW_VERSION/" modern-admin-styler.php
echo "   ✓ Plugin header updated"

# 2. Update MASE_VERSION constant
sed -i "s/define( 'MASE_VERSION', '.*' );/define( 'MASE_VERSION', '$NEW_VERSION' );/" modern-admin-styler.php
echo "   ✓ MASE_VERSION constant updated"

# 3. Update package.json
echo "2. Updating package.json..."
sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" package.json
echo "   ✓ package.json updated"

# 4. Update readme.txt (if exists)
if [ -f "readme.txt" ]; then
    echo "3. Updating readme.txt..."
    sed -i "s/Stable tag: .*/Stable tag: $NEW_VERSION/" readme.txt
    echo "   ✓ readme.txt updated"
else
    echo "3. readme.txt not found (will be created later)"
fi

echo ""
echo "=========================================="
echo "Version updated to $NEW_VERSION"
echo "=========================================="
echo ""
echo "Files updated:"
echo "  - modern-admin-styler.php (header + constant)"
echo "  - package.json"
if [ -f "readme.txt" ]; then
    echo "  - readme.txt"
fi
echo ""
echo "Next steps:"
echo "  1. Update CHANGELOG.md"
echo "  2. Commit changes: git add -A && git commit -m 'Bump version to $NEW_VERSION'"
echo "  3. Create tag: git tag -a v$NEW_VERSION -m 'Release v$NEW_VERSION'"
echo "  4. Push: git push && git push --tags"
