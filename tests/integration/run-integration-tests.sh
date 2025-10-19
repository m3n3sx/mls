#!/bin/bash

# MASE Integration Tests Runner
# Runs complete workflow integration tests for Task 25

echo "================================================"
echo "MASE Integration Tests - Complete Workflows"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PLUGIN_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"

echo "Plugin Directory: $PLUGIN_DIR"
echo ""

# Check if WordPress is available
if [ ! -f "$PLUGIN_DIR/../../../wp-load.php" ]; then
    echo -e "${RED}✗ Error: WordPress not found${NC}"
    echo "Please ensure this plugin is installed in a WordPress installation"
    exit 1
fi

echo -e "${GREEN}✓ WordPress found${NC}"
echo ""

# Check if required classes exist
echo "Checking required files..."

REQUIRED_FILES=(
    "$PLUGIN_DIR/includes/class-mase-settings.php"
    "$PLUGIN_DIR/includes/class-mase-css-generator.php"
    "$PLUGIN_DIR/includes/class-mase-cachemanager.php"
    "$PLUGIN_DIR/includes/class-mase-admin.php"
    "$SCRIPT_DIR/test-complete-workflows.php"
)

ALL_FILES_EXIST=true

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $(basename "$file")"
    else
        echo -e "${RED}✗${NC} $(basename "$file") - NOT FOUND"
        ALL_FILES_EXIST=false
    fi
done

echo ""

if [ "$ALL_FILES_EXIST" = false ]; then
    echo -e "${RED}✗ Error: Some required files are missing${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All required files found${NC}"
echo ""

# Run tests via WP-CLI if available
if command -v wp &> /dev/null; then
    echo "Running tests via WP-CLI..."
    echo "================================================"
    echo ""
    
    cd "$PLUGIN_DIR/../../../" || exit 1
    wp eval-file "$SCRIPT_DIR/test-complete-workflows.php"
    
    EXIT_CODE=$?
    
    echo ""
    echo "================================================"
    
    if [ $EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}✓ All tests passed!${NC}"
    else
        echo -e "${RED}✗ Some tests failed${NC}"
    fi
    
    exit $EXIT_CODE
else
    echo -e "${YELLOW}⚠ WP-CLI not found${NC}"
    echo ""
    echo "To run tests, either:"
    echo "1. Install WP-CLI: https://wp-cli.org/"
    echo "2. Access via browser: /wp-content/plugins/woow-admin/tests/integration/test-complete-workflows.php?run_integration_tests=1"
    echo ""
    exit 1
fi
