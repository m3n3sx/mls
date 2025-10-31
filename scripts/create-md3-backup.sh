#!/bin/bash

###############################################################################
# MD3 Backup Script
# Task 24.2: Create backup
# Requirements: All
#
# This script creates a complete backup of the MD3 transformation including:
# - All MD3 CSS and JavaScript files
# - Configuration files
# - Documentation
# - Backup metadata
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="backups"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BACKUP_NAME="md3-backup-${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

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

# Create backup directory structure
create_backup_structure() {
    print_header "Creating Backup Structure"
    
    # Create main backup directory if it doesn't exist
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        print_message "$GREEN" "✓ Created backup directory: $BACKUP_DIR"
    fi
    
    # Create backup subdirectories
    mkdir -p "${BACKUP_PATH}/assets/css/md3"
    mkdir -p "${BACKUP_PATH}/assets/js"
    mkdir -p "${BACKUP_PATH}/includes"
    mkdir -p "${BACKUP_PATH}/docs"
    mkdir -p "${BACKUP_PATH}/scripts"
    mkdir -p "${BACKUP_PATH}/specs"
    
    print_message "$GREEN" "✓ Created backup structure at: $BACKUP_PATH"
}

# Backup MD3 CSS files
backup_css_files() {
    print_header "Backing Up MD3 CSS Files"
    
    local file_count=0
    
    # Backup MD3 token files
    if [ -d "assets/css/md3" ]; then
        for file in assets/css/md3/*.css; do
            if [ -f "$file" ]; then
                cp "$file" "${BACKUP_PATH}/assets/css/md3/"
                print_message "$GREEN" "✓ Backed up: $file"
                file_count=$((file_count + 1))
            fi
        done
    fi
    
    # Backup MD3 component CSS files
    for file in assets/css/mase-md3-*.css; do
        if [ -f "$file" ]; then
            cp "$file" "${BACKUP_PATH}/assets/css/"
            print_message "$GREEN" "✓ Backed up: $file"
            file_count=$((file_count + 1))
        fi
    done
    
    print_message "$BLUE" "Total CSS files backed up: $file_count"
}

# Backup MD3 JavaScript files
backup_js_files() {
    print_header "Backing Up MD3 JavaScript Files"
    
    local file_count=0
    
    for file in assets/js/mase-md3*.js; do
        if [ -f "$file" ]; then
            cp "$file" "${BACKUP_PATH}/assets/js/"
            print_message "$GREEN" "✓ Backed up: $file"
            file_count=$((file_count + 1))
        fi
    done
    
    print_message "$BLUE" "Total JavaScript files backed up: $file_count"
}

# Backup PHP files
backup_php_files() {
    print_header "Backing Up PHP Files"
    
    local file_count=0
    
    # Backup main admin class
    if [ -f "includes/class-mase-admin.php" ]; then
        cp "includes/class-mase-admin.php" "${BACKUP_PATH}/includes/"
        print_message "$GREEN" "✓ Backed up: includes/class-mase-admin.php"
        file_count=$((file_count + 1))
    fi
    
    # Backup settings page
    if [ -f "includes/admin-settings-page.php" ]; then
        cp "includes/admin-settings-page.php" "${BACKUP_PATH}/includes/"
        print_message "$GREEN" "✓ Backed up: includes/admin-settings-page.php"
        file_count=$((file_count + 1))
    fi
    
    print_message "$BLUE" "Total PHP files backed up: $file_count"
}

# Backup documentation
backup_documentation() {
    print_header "Backing Up Documentation"
    
    local file_count=0
    
    # Backup MD3 documentation
    for file in docs/MD3-*.md; do
        if [ -f "$file" ]; then
            cp "$file" "${BACKUP_PATH}/docs/"
            print_message "$GREEN" "✓ Backed up: $file"
            file_count=$((file_count + 1))
        fi
    done
    
    print_message "$BLUE" "Total documentation files backed up: $file_count"
}

# Backup spec files
backup_specs() {
    print_header "Backing Up Spec Files"
    
    if [ -d ".kiro/specs/material-design-3-transformation" ]; then
        cp -r ".kiro/specs/material-design-3-transformation" "${BACKUP_PATH}/specs/"
        print_message "$GREEN" "✓ Backed up: .kiro/specs/material-design-3-transformation"
    fi
}

# Backup scripts
backup_scripts() {
    print_header "Backing Up Scripts"
    
    local file_count=0
    
    # Backup minification and test scripts
    for file in scripts/minify-md3-assets.cjs scripts/test-minified-assets.cjs; do
        if [ -f "$file" ]; then
            cp "$file" "${BACKUP_PATH}/scripts/"
            print_message "$GREEN" "✓ Backed up: $file"
            file_count=$((file_count + 1))
        fi
    done
    
    print_message "$BLUE" "Total script files backed up: $file_count"
}

# Create backup metadata
create_metadata() {
    print_header "Creating Backup Metadata"
    
    local backup_date=$(date '+%Y-%m-%d %H:%M:%S')
    local git_commit=$(git rev-parse HEAD 2>/dev/null || echo "N/A")
    local git_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "N/A")
    
    # Count files
    local css_count=$(find "${BACKUP_PATH}/assets/css" -name "*.css" 2>/dev/null | wc -l)
    local js_count=$(find "${BACKUP_PATH}/assets/js" -name "*.js" 2>/dev/null | wc -l)
    local php_count=$(find "${BACKUP_PATH}/includes" -name "*.php" 2>/dev/null | wc -l)
    local doc_count=$(find "${BACKUP_PATH}/docs" -name "*.md" 2>/dev/null | wc -l)
    
    # Calculate total size
    local total_size=$(du -sh "${BACKUP_PATH}" | cut -f1)
    
    cat > "${BACKUP_PATH}/BACKUP_INFO.txt" << EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MD3 Transformation Backup Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Backup Name:    ${BACKUP_NAME}
Backup Date:    ${backup_date}
Git Commit:     ${git_commit}
Git Branch:     ${git_branch}

Backup Contents:
  CSS Files:          ${css_count}
  JavaScript Files:   ${js_count}
  PHP Files:          ${php_count}
  Documentation:      ${doc_count}
  Total Size:         ${total_size}

Backup Location:
  ${BACKUP_PATH}

Restoration Instructions:
  See ROLLBACK_PROCEDURE.md for detailed restoration steps

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
    
    print_message "$GREEN" "✓ Created backup metadata: ${BACKUP_PATH}/BACKUP_INFO.txt"
}

# Create rollback procedure
create_rollback_procedure() {
    print_header "Creating Rollback Procedure"
    
    cat > "${BACKUP_PATH}/ROLLBACK_PROCEDURE.md" << 'EOF'
# MD3 Transformation Rollback Procedure

## Overview

This document provides step-by-step instructions for rolling back the Material Design 3 transformation to the backed-up state.

## Prerequisites

- SSH/terminal access to the server
- Backup files in this directory
- WordPress admin access

## Rollback Steps

### 1. Stop WordPress (Optional but Recommended)

```bash
# If using maintenance mode plugin
wp maintenance-mode activate

# Or create maintenance file manually
touch .maintenance
```

### 2. Restore CSS Files

```bash
# Restore MD3 token files
cp -r assets/css/md3/* /path/to/wordpress/wp-content/plugins/modern-admin-styler/assets/css/md3/

# Restore MD3 component CSS
cp assets/css/mase-md3-*.css /path/to/wordpress/wp-content/plugins/modern-admin-styler/assets/css/
```

### 3. Restore JavaScript Files

```bash
# Restore MD3 JavaScript files
cp assets/js/mase-md3*.js /path/to/wordpress/wp-content/plugins/modern-admin-styler/assets/js/
```

### 4. Restore PHP Files

```bash
# Restore admin class
cp includes/class-mase-admin.php /path/to/wordpress/wp-content/plugins/modern-admin-styler/includes/

# Restore settings page
cp includes/admin-settings-page.php /path/to/wordpress/wp-content/plugins/modern-admin-styler/includes/
```

### 5. Clear Caches

```bash
# Clear WordPress object cache
wp cache flush

# Clear MASE cache
wp option delete mase_css_cache
wp option delete mase_settings_cache

# Clear browser cache (instruct users)
```

### 6. Verify Restoration

1. Log into WordPress admin
2. Navigate to MASE settings page
3. Verify interface displays correctly
4. Test key functionality:
   - Color palette switching
   - Template application
   - Settings save
   - Live preview

### 7. Re-enable WordPress

```bash
# If using maintenance mode plugin
wp maintenance-mode deactivate

# Or remove maintenance file
rm .maintenance
```

## Verification Checklist

- [ ] All MD3 CSS files restored
- [ ] All MD3 JavaScript files restored
- [ ] PHP files restored
- [ ] Caches cleared
- [ ] Admin interface loads correctly
- [ ] No JavaScript errors in console
- [ ] Settings can be saved
- [ ] Live preview works
- [ ] No PHP errors in debug log

## Troubleshooting

### Issue: White screen after rollback

**Solution:**
1. Check PHP error log: `tail -f /var/log/php-error.log`
2. Verify file permissions: `chmod 644 includes/*.php`
3. Check for syntax errors: `php -l includes/class-mase-admin.php`

### Issue: Styles not loading

**Solution:**
1. Clear all caches (WordPress, browser, CDN)
2. Verify CSS files exist: `ls -la assets/css/mase-md3-*.css`
3. Check file permissions: `chmod 644 assets/css/*.css`
4. Regenerate CSS cache: Delete `mase_css_cache` option

### Issue: JavaScript errors

**Solution:**
1. Check browser console for specific errors
2. Verify JS files exist: `ls -la assets/js/mase-md3*.js`
3. Check file permissions: `chmod 644 assets/js/*.js`
4. Clear browser cache completely

## Emergency Contact

If rollback fails, contact:
- Development team
- System administrator
- WordPress support

## Post-Rollback

1. Document what went wrong
2. Review logs for errors
3. Plan corrective actions
4. Test in staging before re-deploying

EOF
    
    print_message "$GREEN" "✓ Created rollback procedure: ${BACKUP_PATH}/ROLLBACK_PROCEDURE.md"
}

# Create compressed archive
create_archive() {
    print_header "Creating Compressed Archive"
    
    local archive_name="${BACKUP_NAME}.tar.gz"
    local archive_path="${BACKUP_DIR}/${archive_name}"
    
    # Create tar.gz archive
    tar -czf "$archive_path" -C "$BACKUP_DIR" "$BACKUP_NAME"
    
    local archive_size=$(du -sh "$archive_path" | cut -f1)
    
    print_message "$GREEN" "✓ Created archive: $archive_path"
    print_message "$BLUE" "  Archive size: $archive_size"
    
    # Create checksum
    if command -v sha256sum &> /dev/null; then
        sha256sum "$archive_path" > "${archive_path}.sha256"
        print_message "$GREEN" "✓ Created checksum: ${archive_path}.sha256"
    fi
}

# Test rollback procedure
test_rollback() {
    print_header "Testing Rollback Procedure"
    
    print_message "$YELLOW" "⚠️  Rollback test requires manual verification"
    print_message "$BLUE" "To test rollback:"
    print_message "$BLUE" "1. Review ${BACKUP_PATH}/ROLLBACK_PROCEDURE.md"
    print_message "$BLUE" "2. Verify all backup files are present"
    print_message "$BLUE" "3. Test restoration in staging environment"
    print_message "$BLUE" "4. Verify functionality after restoration"
}

# Main execution
main() {
    print_message "$BLUE" "╔════════════════════════════════════════════════════════════════════════════╗"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "║                    MD3 Backup Script                                       ║"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "╚════════════════════════════════════════════════════════════════════════════╝"
    
    create_backup_structure
    backup_css_files
    backup_js_files
    backup_php_files
    backup_documentation
    backup_specs
    backup_scripts
    create_metadata
    create_rollback_procedure
    create_archive
    test_rollback
    
    print_header "Backup Complete"
    print_message "$GREEN" "✓ Backup completed successfully!"
    print_message "$BLUE" "📦 Backup location: $BACKUP_PATH"
    print_message "$BLUE" "📄 Archive: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
    print_message "$BLUE" "📋 Info: ${BACKUP_PATH}/BACKUP_INFO.txt"
    print_message "$BLUE" "📖 Rollback: ${BACKUP_PATH}/ROLLBACK_PROCEDURE.md"
    echo ""
}

# Run main function
main
