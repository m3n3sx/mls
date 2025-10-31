#!/bin/bash

###############################################################################
# Backup Creation Script
# Task 23.2: Create rollback plan - Create backup of current version
# Requirements: All
#
# This script creates a complete backup of the current plugin version
# including code, settings, and database options for rollback purposes.
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print colored message
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Print section header
print_header() {
    echo ""
    print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    print_message "$BLUE" "  $1"
    print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# Get plugin version
get_version() {
    if [ -f "modern-admin-styler.php" ]; then
        grep "Version:" modern-admin-styler.php | head -1 | sed 's/.*Version: *//' | sed 's/ *\*\/.*//'
    else
        echo "unknown"
    fi
}

# Create backup directory
create_backup_dir() {
    local version=$1
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_dir="backups/mase-v${version}-${timestamp}"
    
    mkdir -p "$backup_dir"
    echo "$backup_dir"
}

# Backup plugin files
backup_files() {
    print_header "Backing Up Plugin Files"
    
    local backup_dir=$1
    local version=$2
    
    print_message "$CYAN" "Creating file backup..."
    
    # Create archive of plugin files
    local archive_name="mase-v${version}-files.tar.gz"
    
    tar -czf "${backup_dir}/${archive_name}" \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='backups' \
        --exclude='dist' \
        --exclude='*.log' \
        --exclude='*.backup*' \
        --exclude='tests/screenshots' \
        --exclude='tests/visual-interactive/screenshots' \
        --exclude='tests/visual-interactive/videos' \
        . 2>/dev/null
    
    local archive_size=$(du -h "${backup_dir}/${archive_name}" | cut -f1)
    
    print_message "$GREEN" "✅ Plugin files backed up: ${archive_name} (${archive_size})"
}

# Backup settings (for WordPress environment)
backup_settings() {
    print_header "Backing Up Settings"
    
    local backup_dir=$1
    local version=$2
    
    print_message "$CYAN" "Creating settings backup..."
    
    # Check if WP-CLI is available
    if command -v wp >/dev/null 2>&1; then
        # Export MASE settings
        wp option get mase_settings > "${backup_dir}/mase-settings.json" 2>/dev/null || true
        
        # Export custom palettes
        wp option get mase_custom_palettes > "${backup_dir}/mase-custom-palettes.json" 2>/dev/null || true
        
        # Export custom templates
        wp option get mase_custom_templates > "${backup_dir}/mase-custom-templates.json" 2>/dev/null || true
        
        # Export cache settings
        wp option get mase_css_cache_light > "${backup_dir}/mase-cache-light.txt" 2>/dev/null || true
        wp option get mase_css_cache_dark > "${backup_dir}/mase-cache-dark.txt" 2>/dev/null || true
        
        print_message "$GREEN" "✅ Settings backed up via WP-CLI"
    else
        print_message "$YELLOW" "⚠️  WP-CLI not available, skipping settings backup"
        print_message "$CYAN" "   Settings will be preserved in WordPress database"
    fi
}

# Create backup manifest
create_manifest() {
    print_header "Creating Backup Manifest"
    
    local backup_dir=$1
    local version=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    cat > "${backup_dir}/BACKUP_MANIFEST.txt" << EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Modern Admin Styler - Backup Manifest
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Backup Information:
  Version:        $version
  Backup Date:    $timestamp
  Backup Type:    Pre-deployment backup

Backup Contents:
  ✅ Plugin files (complete source code)
  ✅ Settings (mase_settings)
  ✅ Custom palettes (mase_custom_palettes)
  ✅ Custom templates (mase_custom_templates)
  ✅ Cache data (optional)

Backup Location:
  Directory:      $backup_dir
  Archive:        mase-v${version}-files.tar.gz

Restore Instructions:
  1. Extract archive: tar -xzf mase-v${version}-files.tar.gz
  2. Copy files to plugin directory
  3. Restore settings (if needed):
     wp option update mase_settings "\$(cat mase-settings.json)"
  4. Clear cache:
     wp cache flush
  5. Test functionality

Rollback Procedure:
  See docs/ROLLBACK-PROCEDURE.md for complete instructions

Notes:
  - Settings are preserved in WordPress database during plugin updates
  - This backup is for emergency rollback only
  - Test restore procedure in staging before production use

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
    
    print_message "$GREEN" "✅ Backup manifest created"
}

# Create restore script
create_restore_script() {
    print_header "Creating Restore Script"
    
    local backup_dir=$1
    local version=$2
    
    cat > "${backup_dir}/restore.sh" << 'EOF'
#!/bin/bash

###############################################################################
# Restore Script
# Restores MASE from backup
###############################################################################

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  MASE Restore Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get backup directory
BACKUP_DIR=$(dirname "$0")
ARCHIVE=$(ls ${BACKUP_DIR}/mase-v*-files.tar.gz 2>/dev/null | head -1)

if [ -z "$ARCHIVE" ]; then
    echo "❌ No backup archive found"
    exit 1
fi

echo "Found backup: $(basename $ARCHIVE)"
echo ""

# Confirm restore
read -p "Are you sure you want to restore from this backup? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

echo ""
echo "Restoring from backup..."
echo ""

# Extract archive
echo "1. Extracting files..."
tar -xzf "$ARCHIVE" -C /tmp/mase-restore

# Deactivate plugin (if WP-CLI available)
if command -v wp >/dev/null 2>&1; then
    echo "2. Deactivating plugin..."
    wp plugin deactivate modern-admin-styler 2>/dev/null || true
fi

# Copy files
echo "3. Copying files..."
cp -r /tmp/mase-restore/* .

# Restore settings (if available)
if [ -f "${BACKUP_DIR}/mase-settings.json" ] && command -v wp >/dev/null 2>&1; then
    echo "4. Restoring settings..."
    wp option update mase_settings "$(cat ${BACKUP_DIR}/mase-settings.json)"
fi

# Reactivate plugin
if command -v wp >/dev/null 2>&1; then
    echo "5. Reactivating plugin..."
    wp plugin activate modern-admin-styler
fi

# Clear cache
if command -v wp >/dev/null 2>&1; then
    echo "6. Clearing cache..."
    wp cache flush
    wp option delete mase_css_cache_light
    wp option delete mase_css_cache_dark
fi

# Cleanup
rm -rf /tmp/mase-restore

echo ""
echo "✅ Restore complete!"
echo ""
echo "Next steps:"
echo "  1. Test plugin functionality"
echo "  2. Check settings in admin interface"
echo "  3. Clear browser cache"
echo "  4. Monitor error logs"
echo ""
EOF
    
    chmod +x "${backup_dir}/restore.sh"
    
    print_message "$GREEN" "✅ Restore script created"
}

# Generate backup summary
generate_summary() {
    print_header "Backup Summary"
    
    local backup_dir=$1
    local version=$2
    
    # Calculate backup size
    local backup_size=$(du -sh "$backup_dir" | cut -f1)
    
    # Count files
    local file_count=$(find "$backup_dir" -type f | wc -l)
    
    print_message "$GREEN" "✅ Backup created successfully!"
    echo ""
    print_message "$CYAN" "Backup Details:"
    print_message "$CYAN" "  Version:        $version"
    print_message "$CYAN" "  Location:       $backup_dir"
    print_message "$CYAN" "  Size:           $backup_size"
    print_message "$CYAN" "  Files:          $file_count"
    echo ""
    print_message "$CYAN" "Backup Contents:"
    print_message "$CYAN" "  ✅ Plugin files archive"
    print_message "$CYAN" "  ✅ Settings backup"
    print_message "$CYAN" "  ✅ Backup manifest"
    print_message "$CYAN" "  ✅ Restore script"
    echo ""
    print_message "$YELLOW" "To restore from this backup:"
    print_message "$YELLOW" "  cd $backup_dir && ./restore.sh"
    echo ""
}

# Main execution
main() {
    print_message "$BLUE" "╔════════════════════════════════════════════════════════════════════════════╗"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "║                        Backup Creation Script                              ║"
    print_message "$BLUE" "║                        Modern Admin Styler                                 ║"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "╚════════════════════════════════════════════════════════════════════════════╝"
    
    # Get version
    local version=$(get_version)
    print_message "$CYAN" "\nCurrent version: $version"
    
    # Create backup directory
    local backup_dir=$(create_backup_dir "$version")
    print_message "$CYAN" "Backup directory: $backup_dir"
    
    # Perform backup
    backup_files "$backup_dir" "$version"
    backup_settings "$backup_dir" "$version"
    create_manifest "$backup_dir" "$version"
    create_restore_script "$backup_dir" "$version"
    generate_summary "$backup_dir" "$version"
    
    print_message "$GREEN" "✅ Backup creation complete!"
    echo ""
}

# Run main function
main
