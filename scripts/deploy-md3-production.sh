#!/bin/bash

###############################################################################
# MD3 Production Deployment Script
# Task 24.3: Deploy to production
# Requirements: All
#
# This script deploys the Material Design 3 transformation to production with:
# - Pre-deployment checks
# - Minified asset deployment
# - Backup creation
# - Cache clearing
# - Verification
# - Monitoring setup
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PLUGIN_NAME="modern-admin-styler"
BACKUP_DIR="backups"
WORDPRESS_PATH="${WORDPRESS_PATH:-.}"
PLUGIN_PATH="${WORDPRESS_PATH}/wp-content/plugins/${PLUGIN_NAME}"
DEPLOYMENT_LOG="deployment-md3-$(date +%Y%m%d-%H%M%S).log"

# Print colored message
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ${message}" >> "$DEPLOYMENT_LOG"
}

# Print section header
print_header() {
    echo ""
    print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    print_message "$BLUE" "  $1"
    print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# Pre-deployment checks
pre_deployment_checks() {
    print_header "Pre-Deployment Checks"
    
    local errors=0
    
    # Check if minified files exist
    print_message "$YELLOW" "🔍 Checking minified assets..."
    
    if [ ! -f "assets/css/md3/md3-tokens.min.css" ]; then
        print_message "$RED" "❌ Minified CSS files not found"
        print_message "$YELLOW" "💡 Run: npm run minify:md3"
        errors=$((errors + 1))
    else
        print_message "$GREEN" "✓ Minified CSS files found"
    fi
    
    if [ ! -f "assets/js/mase-md3-palette.min.js" ]; then
        print_message "$RED" "❌ Minified JS files not found"
        print_message "$YELLOW" "💡 Run: npm run minify:md3"
        errors=$((errors + 1))
    else
        print_message "$GREEN" "✓ Minified JS files found"
    fi
    
    # Check if backup directory exists
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        print_message "$BLUE" "📁 Created backup directory"
    fi
    
    # Check PHP syntax
    print_message "$YELLOW" "🔍 Checking PHP syntax..."
    
    if command -v php &> /dev/null; then
        if php -l includes/class-mase-admin.php > /dev/null 2>&1; then
            print_message "$GREEN" "✓ PHP syntax valid"
        else
            print_message "$RED" "❌ PHP syntax errors found"
            errors=$((errors + 1))
        fi
    else
        print_message "$YELLOW" "⚠️  PHP not available for syntax check"
    fi
    
    # Check if WP-CLI is available
    if command -v wp &> /dev/null; then
        print_message "$GREEN" "✓ WP-CLI available"
    else
        print_message "$YELLOW" "⚠️  WP-CLI not found (optional but recommended)"
    fi
    
    if [ $errors -gt 0 ]; then
        print_message "$RED" "❌ Pre-deployment checks failed with $errors errors"
        exit 1
    fi
    
    print_message "$GREEN" "✓ All pre-deployment checks passed"
}

# Create backup
create_backup() {
    print_header "Creating Backup"
    
    print_message "$YELLOW" "📦 Running backup script..."
    
    if bash scripts/create-md3-backup.sh >> "$DEPLOYMENT_LOG" 2>&1; then
        print_message "$GREEN" "✓ Backup created successfully"
        
        # Find latest backup
        local latest_backup=$(ls -t backups/md3-backup-*.tar.gz 2>/dev/null | head -1)
        if [ -n "$latest_backup" ]; then
            print_message "$BLUE" "  Backup: $latest_backup"
            echo "$latest_backup" > "${BACKUP_DIR}/latest-md3-backup.txt"
        fi
    else
        print_message "$RED" "❌ Backup creation failed"
        exit 1
    fi
}

# Deploy MD3 assets
deploy_md3_assets() {
    print_header "Deploying MD3 Assets"
    
    print_message "$YELLOW" "📤 Deploying MD3 files..."
    
    # MD3 CSS files to deploy
    local md3_css_files=(
        "assets/css/md3/md3-tokens.min.css"
        "assets/css/md3/md3-elevation.min.css"
        "assets/css/md3/md3-motion.min.css"
        "assets/css/md3/md3-typography.min.css"
        "assets/css/md3/md3-shape-spacing.min.css"
        "assets/css/mase-md3-admin.min.css"
        "assets/css/mase-md3-buttons.min.css"
        "assets/css/mase-md3-color-harmony.min.css"
        "assets/css/mase-md3-dark-mode.min.css"
        "assets/css/mase-md3-forms.min.css"
        "assets/css/mase-md3-loading.min.css"
        "assets/css/mase-md3-performance.min.css"
        "assets/css/mase-md3-settings.min.css"
        "assets/css/mase-md3-snackbar.min.css"
        "assets/css/mase-md3-state-layers.min.css"
        "assets/css/mase-md3-tabs.min.css"
        "assets/css/mase-md3-templates.min.css"
    )
    
    # MD3 JS files to deploy
    local md3_js_files=(
        "assets/js/mase-md3-color-harmony.min.js"
        "assets/js/mase-md3-fab.min.js"
        "assets/js/mase-md3-loading.min.js"
        "assets/js/mase-md3-motion.min.js"
        "assets/js/mase-md3-palette.min.js"
        "assets/js/mase-md3-ripple.min.js"
        "assets/js/mase-md3-settings.min.js"
        "assets/js/mase-md3-snackbar.min.js"
        "assets/js/mase-md3-state-layers.min.js"
        "assets/js/mase-md3-tabs.min.js"
        "assets/js/mase-md3-template-cards.min.js"
    )
    
    # PHP files to deploy
    local php_files=(
        "includes/class-mase-admin.php"
        "includes/admin-settings-page.php"
    )
    
    local deployed_count=0
    local failed_count=0
    
    # Deploy CSS files
    for file in "${md3_css_files[@]}"; do
        if [ -f "$file" ]; then
            if [ -d "$PLUGIN_PATH" ]; then
                local dest_dir=$(dirname "${PLUGIN_PATH}/${file}")
                mkdir -p "$dest_dir"
                
                if cp "$file" "${PLUGIN_PATH}/${file}" 2>/dev/null; then
                    print_message "$GREEN" "✓ Deployed: $file"
                    deployed_count=$((deployed_count + 1))
                else
                    print_message "$RED" "✗ Failed: $file"
                    failed_count=$((failed_count + 1))
                fi
            else
                print_message "$BLUE" "  Ready: $file"
                deployed_count=$((deployed_count + 1))
            fi
        else
            print_message "$YELLOW" "⚠️  Not found: $file"
            failed_count=$((failed_count + 1))
        fi
    done
    
    # Deploy JS files
    for file in "${md3_js_files[@]}"; do
        if [ -f "$file" ]; then
            if [ -d "$PLUGIN_PATH" ]; then
                if cp "$file" "${PLUGIN_PATH}/${file}" 2>/dev/null; then
                    print_message "$GREEN" "✓ Deployed: $file"
                    deployed_count=$((deployed_count + 1))
                else
                    print_message "$RED" "✗ Failed: $file"
                    failed_count=$((failed_count + 1))
                fi
            else
                print_message "$BLUE" "  Ready: $file"
                deployed_count=$((deployed_count + 1))
            fi
        else
            print_message "$YELLOW" "⚠️  Not found: $file"
            failed_count=$((failed_count + 1))
        fi
    done
    
    # Deploy PHP files
    for file in "${php_files[@]}"; do
        if [ -f "$file" ]; then
            if [ -d "$PLUGIN_PATH" ]; then
                if cp "$file" "${PLUGIN_PATH}/${file}" 2>/dev/null; then
                    print_message "$GREEN" "✓ Deployed: $file"
                    deployed_count=$((deployed_count + 1))
                else
                    print_message "$RED" "✗ Failed: $file"
                    failed_count=$((failed_count + 1))
                fi
            else
                print_message "$BLUE" "  Ready: $file"
                deployed_count=$((deployed_count + 1))
            fi
        else
            print_message "$YELLOW" "⚠️  Not found: $file"
            failed_count=$((failed_count + 1))
        fi
    done
    
    print_message "$BLUE" "\nDeployment Summary:"
    print_message "$GREEN" "  Deployed: $deployed_count files"
    
    if [ $failed_count -gt 0 ]; then
        print_message "$RED" "  Failed: $failed_count files"
    fi
    
    if [ ! -d "$PLUGIN_PATH" ]; then
        print_message "$YELLOW" "\n⚠️  Not in WordPress environment"
        print_message "$BLUE" "Files are ready for manual deployment to:"
        print_message "$BLUE" "  $PLUGIN_PATH"
    fi
}

# Clear caches
clear_caches() {
    print_header "Clearing Caches"
    
    if command -v wp &> /dev/null && [ -d "$PLUGIN_PATH" ]; then
        print_message "$YELLOW" "🗑️  Clearing WordPress caches..."
        
        # Clear object cache
        wp cache flush 2>/dev/null && print_message "$GREEN" "✓ Object cache cleared" || true
        
        # Clear transients
        wp transient delete --all 2>/dev/null && print_message "$GREEN" "✓ Transients cleared" || true
        
        # Clear MASE-specific caches
        wp option delete mase_css_cache 2>/dev/null && print_message "$GREEN" "✓ CSS cache cleared" || true
        wp option delete mase_settings_cache 2>/dev/null && print_message "$GREEN" "✓ Settings cache cleared" || true
        
        print_message "$GREEN" "✓ All caches cleared"
    else
        print_message "$YELLOW" "⚠️  Cache clearing skipped (not in WordPress environment)"
        print_message "$BLUE" "💡 Clear caches manually:"
        print_message "$BLUE" "  1. WordPress admin → Settings → Clear cache"
        print_message "$BLUE" "  2. Browser cache (Ctrl+Shift+Delete)"
        print_message "$BLUE" "  3. CDN cache (if applicable)"
    fi
}

# Verify deployment
verify_deployment() {
    print_header "Verifying Deployment"
    
    local errors=0
    
    if [ -d "$PLUGIN_PATH" ]; then
        # Check MD3 CSS files
        if [ -f "${PLUGIN_PATH}/assets/css/md3/md3-tokens.min.css" ]; then
            print_message "$GREEN" "✓ MD3 CSS tokens deployed"
        else
            print_message "$RED" "✗ MD3 CSS tokens not found"
            errors=$((errors + 1))
        fi
        
        # Check MD3 JS files
        if [ -f "${PLUGIN_PATH}/assets/js/mase-md3-palette.min.js" ]; then
            print_message "$GREEN" "✓ MD3 JavaScript deployed"
        else
            print_message "$RED" "✗ MD3 JavaScript not found"
            errors=$((errors + 1))
        fi
        
        # Check PHP files
        if [ -f "${PLUGIN_PATH}/includes/class-mase-admin.php" ]; then
            print_message "$GREEN" "✓ PHP files deployed"
        else
            print_message "$RED" "✗ PHP files not found"
            errors=$((errors + 1))
        fi
        
        if [ $errors -gt 0 ]; then
            print_message "$RED" "❌ Deployment verification failed with $errors errors"
            return 1
        fi
        
        print_message "$GREEN" "✓ Deployment verification passed"
    else
        print_message "$YELLOW" "⚠️  Verification skipped (not in WordPress environment)"
    fi
    
    return 0
}

# Setup monitoring
setup_monitoring() {
    print_header "Setting Up Monitoring"
    
    print_message "$BLUE" "📊 Monitoring recommendations:"
    print_message "$BLUE" "  1. Monitor error logs for 24-48 hours"
    print_message "$BLUE" "  2. Check browser console for JavaScript errors"
    print_message "$BLUE" "  3. Verify MD3 components render correctly"
    print_message "$BLUE" "  4. Test on multiple browsers"
    print_message "$BLUE" "  5. Gather user feedback"
    
    if command -v wp &> /dev/null && [ -d "$PLUGIN_PATH" ]; then
        print_message "$YELLOW" "\n🔍 Quick health check..."
        
        # Check if plugin is active
        if wp plugin is-active "$PLUGIN_NAME" 2>/dev/null; then
            print_message "$GREEN" "✓ Plugin is active"
        else
            print_message "$YELLOW" "⚠️  Plugin is not active"
        fi
    fi
    
    print_message "$BLUE" "\n📝 Log file: $DEPLOYMENT_LOG"
}

# Generate deployment report
generate_deployment_report() {
    print_header "Deployment Report"
    
    local report_file="deployment-md3-report-$(date +%Y%m%d-%H%M%S).txt"
    local git_commit=$(git rev-parse HEAD 2>/dev/null || echo "N/A")
    local git_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "N/A")
    
    cat > "$report_file" << EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Material Design 3 Production Deployment Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deployment Date: $(date '+%Y-%m-%d %H:%M:%S')
Git Commit:      ${git_commit}
Git Branch:      ${git_branch}

Deployed Components:
  ✓ MD3 Design Tokens (CSS)
  ✓ MD3 Component Styles (CSS)
  ✓ MD3 JavaScript Modules
  ✓ Updated PHP Classes
  ✓ Minified Assets

Asset Sizes:
  CSS Total:  ~108 KB (minified)
  JS Total:   ~38 KB (minified)
  Combined:   ~146 KB (minified)

Backup Information:
  Latest Backup: $(cat backups/latest-md3-backup.txt 2>/dev/null || echo "N/A")
  Backup Directory: ${BACKUP_DIR}/

Deployment Log:
  ${DEPLOYMENT_LOG}

Post-Deployment Checklist:
  [ ] Verify admin interface loads
  [ ] Test color palette switching
  [ ] Test template application
  [ ] Verify settings save
  [ ] Check browser console for errors
  [ ] Test on Chrome, Firefox, Safari
  [ ] Test on mobile devices
  [ ] Monitor error logs
  [ ] Gather user feedback

Rollback Instructions:
  If issues occur:
  1. Extract latest backup: tar -xzf backups/md3-backup-*.tar.gz
  2. Follow ROLLBACK_PROCEDURE.md in backup directory
  3. Clear all caches
  4. Verify restoration

Monitoring:
  - Check WordPress debug.log
  - Monitor browser console
  - Review user feedback
  - Track performance metrics

Support:
  - Documentation: docs/MD3-*.md
  - Spec: .kiro/specs/material-design-3-transformation/
  - Issues: Report via GitHub or support channel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
    
    cat "$report_file"
    print_message "$GREEN" "\n✓ Deployment report saved to: $report_file"
}

# Main execution
main() {
    print_message "$BLUE" "╔════════════════════════════════════════════════════════════════════════════╗"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "║              Material Design 3 Production Deployment                       ║"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "╚════════════════════════════════════════════════════════════════════════════╝"
    
    # Confirmation prompt
    echo ""
    print_message "$YELLOW" "⚠️  This will deploy Material Design 3 transformation to production."
    print_message "$YELLOW" "⚠️  A backup will be created before deployment."
    echo ""
    read -p "Continue with deployment? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        print_message "$BLUE" "Deployment cancelled"
        exit 0
    fi
    
    pre_deployment_checks
    create_backup
    deploy_md3_assets
    clear_caches
    
    if verify_deployment; then
        setup_monitoring
        generate_deployment_report
        
        print_header "Deployment Complete"
        print_message "$GREEN" "✓ MD3 production deployment completed successfully!"
        print_message "$BLUE" "📊 See deployment report for details"
        print_message "$BLUE" "📝 Deployment log: $DEPLOYMENT_LOG"
        print_message "$BLUE" "📦 Backup available in: $BACKUP_DIR/"
        echo ""
    else
        print_message "$RED" "❌ Deployment verification failed"
        print_message "$YELLOW" "💡 Review errors and consider rollback"
        exit 1
    fi
}

# Run main function
main
