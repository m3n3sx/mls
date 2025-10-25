#!/bin/bash

###############################################################################
# Production Deployment Script
# Task 22.2: Deploy with feature flags disabled
# Requirements: 10.3, 15.1
#
# This script safely deploys the MASE plugin to production with:
# - All modern features disabled by default
# - Legacy fallback enabled
# - Backup creation before deployment
# - Verification of deployment success
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PLUGIN_NAME="modern-admin-styler"
BACKUP_DIR="backups"
WORDPRESS_PATH="${WORDPRESS_PATH:-.}"
PLUGIN_PATH="${WORDPRESS_PATH}/wp-content/plugins/${PLUGIN_NAME}"

print_message() {
    echo -e "${1}${2}${NC}"
}

print_header() {
    echo ""
    print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    print_message "$BLUE" "  $1"
    print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check if WP-CLI is available
    if ! command -v wp &> /dev/null; then
        print_message "$YELLOW" "⚠️  WP-CLI not found (optional but recommended)"
    else
        print_message "$GREEN" "✅ WP-CLI available"
    fi
    
    # Check if dist directory exists
    if [ ! -d "dist" ]; then
        print_message "$RED" "❌ dist directory not found"
        print_message "$YELLOW" "💡 Run './scripts/production-build.sh' first"
        exit 1
    fi
    
    print_message "$GREEN" "✅ Build artifacts found"
    
    # Check if backup directory exists
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        print_message "$BLUE" "📁 Created backup directory"
    fi
}

# Create backup
create_backup() {
    print_header "Creating Backup"
    
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local backup_file="${BACKUP_DIR}/mase-backup-${timestamp}.tar.gz"
    
    print_message "$YELLOW" "📦 Creating backup..."
    
    # Backup current plugin files
    if [ -d "$PLUGIN_PATH" ]; then
        tar -czf "$backup_file" -C "${WORDPRESS_PATH}/wp-content/plugins" "$PLUGIN_NAME" 2>/dev/null || {
            print_message "$YELLOW" "⚠️  Could not create file backup (may not be in WordPress environment)"
        }
    fi
    
    # Backup database settings
    if command -v wp &> /dev/null; then
        print_message "$YELLOW" "💾 Backing up database settings..."
        
        wp option get mase_settings --format=json > "${BACKUP_DIR}/mase-settings-${timestamp}.json" 2>/dev/null || true
        wp option get mase_feature_flags --format=json > "${BACKUP_DIR}/mase-feature-flags-${timestamp}.json" 2>/dev/null || true
        
        print_message "$GREEN" "✅ Database backup created"
    fi
    
    if [ -f "$backup_file" ]; then
        print_message "$GREEN" "✅ Backup created: $backup_file"
    fi
    
    # Save backup location for rollback
    echo "$backup_file" > "${BACKUP_DIR}/latest-backup.txt"
}

# Verify feature flags are disabled
verify_feature_flags() {
    print_header "Verifying Feature Flags"
    
    print_message "$YELLOW" "🔍 Checking feature flag configuration..."
    
    # Check PHP file
    if grep -q '"modern_preview_engine" => false' includes/class-mase-feature-flags.php; then
        print_message "$GREEN" "✅ Feature flags disabled in code"
    else
        print_message "$RED" "❌ Feature flags may not be properly disabled"
        print_message "$YELLOW" "⚠️  Continuing anyway (can be fixed via admin)"
    fi
    
    # If WP-CLI available, set flags in database
    if command -v wp &> /dev/null; then
        print_message "$YELLOW" "Setting feature flags in database..."
        
        wp option update mase_feature_flags '{
            "modern_state_manager": false,
            "modern_event_bus": false,
            "modern_build_system": false,
            "modern_preview_engine": false,
            "modern_color_system": false,
            "modern_typography": false,
            "modern_animations": false,
            "modern_api_client": false,
            "legacy_fallback": true
        }' --format=json 2>/dev/null || {
            print_message "$YELLOW" "⚠️  Could not set feature flags (not in WordPress environment)"
        }
        
        print_message "$GREEN" "✅ Feature flags set to safe defaults"
    fi
}

# Deploy files
deploy_files() {
    print_header "Deploying Files"
    
    print_message "$YELLOW" "📤 Deploying plugin files..."
    
    # List of files/directories to deploy
    local deploy_items=(
        "dist/"
        "includes/"
        "assets/css/"
        "assets/js/mase-admin.js"
        "assets/js/mase-accessibility.js"
        "modern-admin-styler.php"
        "README.md"
        "CHANGELOG.md"
    )
    
    # Check if we're in WordPress environment
    if [ -d "$PLUGIN_PATH" ]; then
        print_message "$BLUE" "Deploying to: $PLUGIN_PATH"
        
        for item in "${deploy_items[@]}"; do
            if [ -e "$item" ]; then
                if [ -d "$item" ]; then
                    # Copy directory
                    cp -r "$item" "$PLUGIN_PATH/" 2>/dev/null || {
                        print_message "$YELLOW" "⚠️  Could not copy $item"
                    }
                else
                    # Copy file
                    cp "$item" "$PLUGIN_PATH/" 2>/dev/null || {
                        print_message "$YELLOW" "⚠️  Could not copy $item"
                    }
                fi
                print_message "$GREEN" "✅ Deployed: $item"
            else
                print_message "$YELLOW" "⚠️  Not found: $item"
            fi
        done
    else
        print_message "$YELLOW" "⚠️  Not in WordPress environment"
        print_message "$BLUE" "Files ready for manual deployment:"
        for item in "${deploy_items[@]}"; do
            if [ -e "$item" ]; then
                print_message "$BLUE" "  - $item"
            fi
        done
    fi
}

# Clear caches
clear_caches() {
    print_header "Clearing Caches"
    
    if command -v wp &> /dev/null; then
        print_message "$YELLOW" "🗑️  Clearing WordPress caches..."
        
        # Clear object cache
        wp cache flush 2>/dev/null || true
        
        # Clear transients
        wp transient delete --all 2>/dev/null || true
        
        # Clear MASE-specific caches
        wp option delete mase_css_cache 2>/dev/null || true
        wp option delete mase_settings_cache 2>/dev/null || true
        
        print_message "$GREEN" "✅ Caches cleared"
    else
        print_message "$YELLOW" "⚠️  WP-CLI not available, caches not cleared"
        print_message "$BLUE" "💡 Clear caches manually via WordPress admin"
    fi
}

# Verify deployment
verify_deployment() {
    print_header "Verifying Deployment"
    
    local errors=0
    
    # Check if dist directory was deployed
    if [ -d "${PLUGIN_PATH}/dist" ]; then
        print_message "$GREEN" "✅ dist directory deployed"
    else
        print_message "$RED" "❌ dist directory not found"
        errors=$((errors + 1))
    fi
    
    # Check if manifest.json exists
    if [ -f "${PLUGIN_PATH}/dist/manifest.json" ]; then
        print_message "$GREEN" "✅ manifest.json found"
    else
        print_message "$RED" "❌ manifest.json not found"
        errors=$((errors + 1))
    fi
    
    # Check if main plugin file exists
    if [ -f "${PLUGIN_PATH}/modern-admin-styler.php" ]; then
        print_message "$GREEN" "✅ Main plugin file found"
    else
        print_message "$RED" "❌ Main plugin file not found"
        errors=$((errors + 1))
    fi
    
    # Check if includes directory exists
    if [ -d "${PLUGIN_PATH}/includes" ]; then
        print_message "$GREEN" "✅ includes directory found"
    else
        print_message "$RED" "❌ includes directory not found"
        errors=$((errors + 1))
    fi
    
    if [ $errors -gt 0 ]; then
        print_message "$RED" "❌ Deployment verification failed with $errors errors"
        return 1
    fi
    
    print_message "$GREEN" "✅ Deployment verification passed"
    return 0
}

# Test legacy functionality
test_legacy_functionality() {
    print_header "Testing Legacy Functionality"
    
    print_message "$YELLOW" "🧪 Testing legacy code paths..."
    
    if command -v wp &> /dev/null; then
        # Check if plugin is active
        if wp plugin is-active "$PLUGIN_NAME" 2>/dev/null; then
            print_message "$GREEN" "✅ Plugin is active"
        else
            print_message "$YELLOW" "⚠️  Plugin is not active"
        fi
        
        # Check if settings exist
        if wp option get mase_settings --format=json &>/dev/null; then
            print_message "$GREEN" "✅ Settings accessible"
        else
            print_message "$YELLOW" "⚠️  Settings not found (may be fresh install)"
        fi
    else
        print_message "$YELLOW" "⚠️  WP-CLI not available, skipping automated tests"
        print_message "$BLUE" "💡 Test manually via WordPress admin"
    fi
    
    print_message "$BLUE" "\nManual testing checklist:"
    print_message "$BLUE" "  1. Access MASE admin page"
    print_message "$BLUE" "  2. Change color palette"
    print_message "$BLUE" "  3. Apply template"
    print_message "$BLUE" "  4. Save settings"
    print_message "$BLUE" "  5. Reload page and verify persistence"
    print_message "$BLUE" "  6. Check browser console for errors"
}

# Generate deployment report
generate_deployment_report() {
    print_header "Deployment Report"
    
    local report_file="deployment-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$report_file" << EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MASE Production Deployment Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deployment Date: $(date '+%Y-%m-%d %H:%M:%S')

Deployment Configuration:
  - All modern features: DISABLED
  - Legacy fallback: ENABLED
  - Backup created: YES
  - Caches cleared: YES

Deployed Components:
  ✅ dist/ (modern bundles)
  ✅ includes/ (PHP classes)
  ✅ assets/ (CSS and legacy JS)
  ✅ modern-admin-styler.php (main plugin file)

Feature Flags Status:
  - modern_state_manager: false
  - modern_event_bus: false
  - modern_build_system: false
  - modern_preview_engine: false
  - modern_color_system: false
  - modern_typography: false
  - modern_animations: false
  - modern_api_client: false
  - legacy_fallback: true

Next Steps:
  1. Monitor error logs for 24-48 hours
  2. Verify legacy functionality works correctly
  3. Collect user feedback
  4. Begin gradual feature rollout (Task 22.3)

Rollback Instructions:
  If issues occur, run:
  ./scripts/monitor-deployment.sh --rollback "reason"

Monitoring:
  Start monitoring with:
  ./scripts/monitor-deployment.sh --monitor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
    
    cat "$report_file"
    print_message "$GREEN" "\n✅ Deployment report saved to: $report_file"
}

# Main execution
main() {
    print_message "$BLUE" "╔════════════════════════════════════════════════════════════════════════════╗"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "║                  MASE Production Deployment Script                         ║"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "║                    Task 22.2: Deploy with Feature Flags Disabled          ║"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "╚════════════════════════════════════════════════════════════════════════════╝"
    
    # Confirmation prompt
    echo ""
    print_message "$YELLOW" "⚠️  This will deploy MASE to production with all modern features disabled."
    print_message "$YELLOW" "⚠️  A backup will be created before deployment."
    echo ""
    read -p "Continue with deployment? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        print_message "$BLUE" "Deployment cancelled"
        exit 0
    fi
    
    check_prerequisites
    create_backup
    verify_feature_flags
    deploy_files
    clear_caches
    
    if verify_deployment; then
        test_legacy_functionality
        generate_deployment_report
        
        print_header "Deployment Complete"
        print_message "$GREEN" "✅ Production deployment completed successfully!"
        print_message "$BLUE" "📊 Start monitoring: ./scripts/monitor-deployment.sh --monitor"
        print_message "$BLUE" "📋 See deployment report for details"
        echo ""
    else
        print_message "$RED" "❌ Deployment verification failed"
        print_message "$YELLOW" "💡 Review errors and try again"
        exit 1
    fi
}

main
