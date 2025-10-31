#!/bin/bash

###############################################################################
# Deployment Checklist Script
# Task 23.3: Deploy to production - Comprehensive pre-deployment checklist
# Requirements: All
#
# This script provides an interactive checklist to ensure all deployment
# requirements are met before going to production.
###############################################################################

set -e

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

# Ask yes/no question
ask_question() {
    local question=$1
    local response
    
    while true; do
        read -p "$question (yes/no): " response
        case $response in
            yes|y|Y) return 0 ;;
            no|n|N) return 1 ;;
            *) print_message "$YELLOW" "Please answer yes or no" ;;
        esac
    done
}

# Track checklist progress
declare -A checklist_items
total_items=0
completed_items=0

# Add checklist item
add_item() {
    local key=$1
    local description=$2
    checklist_items[$key]=$description
    total_items=$((total_items + 1))
}

# Mark item complete
mark_complete() {
    local key=$1
    completed_items=$((completed_items + 1))
    print_message "$GREEN" "✅ $key: ${checklist_items[$key]}"
}

# Mark item incomplete
mark_incomplete() {
    local key=$1
    print_message "$RED" "❌ $key: ${checklist_items[$key]}"
}

# Pre-deployment checks
pre_deployment_checks() {
    print_header "Pre-Deployment Checks"
    
    # Code Quality
    add_item "CODE_QUALITY" "Code quality checks passed"
    if ask_question "Have all code quality checks (linting, formatting) passed?"; then
        mark_complete "CODE_QUALITY"
    else
        mark_incomplete "CODE_QUALITY"
        print_message "$YELLOW" "   Run: npm run lint && npm run format:check"
    fi
    
    # Tests
    add_item "TESTS" "All tests passing"
    if ask_question "Have all tests passed (unit, integration, e2e)?"; then
        mark_complete "TESTS"
    else
        mark_incomplete "TESTS"
        print_message "$YELLOW" "   Run: npm run test && npm run test:e2e"
    fi
    
    # Security
    add_item "SECURITY" "Security audit completed"
    if ask_question "Has security audit been completed?"; then
        mark_complete "SECURITY"
    else
        mark_incomplete "SECURITY"
        print_message "$YELLOW" "   Run: bash scripts/security-scan.sh"
    fi
    
    # Performance
    add_item "PERFORMANCE" "Performance benchmarks met"
    if ask_question "Do performance benchmarks meet targets?"; then
        mark_complete "PERFORMANCE"
    else
        mark_incomplete "PERFORMANCE"
        print_message "$YELLOW" "   Run: npm run profile"
    fi
    
    # Documentation
    add_item "DOCUMENTATION" "Documentation updated"
    if ask_question "Is all documentation up to date?"; then
        mark_complete "DOCUMENTATION"
    else
        mark_incomplete "DOCUMENTATION"
        print_message "$YELLOW" "   Update: README.md, CHANGELOG.md, docs/"
    fi
}

# Build checks
build_checks() {
    print_header "Build Checks"
    
    # Production build
    add_item "PROD_BUILD" "Production build successful"
    if ask_question "Has production build completed successfully?"; then
        mark_complete "PROD_BUILD"
    else
        mark_incomplete "PROD_BUILD"
        print_message "$YELLOW" "   Run: bash scripts/production-build.sh"
    fi
    
    # Minification
    add_item "MINIFICATION" "Assets minified"
    if ask_question "Are all CSS and JS files minified?"; then
        mark_complete "MINIFICATION"
    else
        mark_incomplete "MINIFICATION"
        print_message "$YELLOW" "   Run: bash scripts/prepare-release.sh"
    fi
    
    # Bundle size
    add_item "BUNDLE_SIZE" "Bundle sizes within limits"
    if ask_question "Are bundle sizes within acceptable limits?"; then
        mark_complete "BUNDLE_SIZE"
    else
        mark_incomplete "BUNDLE_SIZE"
        print_message "$YELLOW" "   Run: npm run check-size"
    fi
}

# Backup checks
backup_checks() {
    print_header "Backup Checks"
    
    # Backup created
    add_item "BACKUP" "Backup created"
    if ask_question "Has a backup been created?"; then
        mark_complete "BACKUP"
    else
        mark_incomplete "BACKUP"
        print_message "$YELLOW" "   Run: bash scripts/create-backup.sh"
    fi
    
    # Rollback tested
    add_item "ROLLBACK_TEST" "Rollback procedure tested"
    if ask_question "Has rollback procedure been tested?"; then
        mark_complete "ROLLBACK_TEST"
    else
        mark_incomplete "ROLLBACK_TEST"
        print_message "$YELLOW" "   Run: bash scripts/test-rollback.sh"
    fi
    
    # Rollback plan
    add_item "ROLLBACK_PLAN" "Rollback plan documented"
    if ask_question "Is rollback plan documented and understood?"; then
        mark_complete "ROLLBACK_PLAN"
    else
        mark_incomplete "ROLLBACK_PLAN"
        print_message "$YELLOW" "   Review: docs/ROLLBACK-PROCEDURE.md"
    fi
}

# Team readiness
team_readiness() {
    print_header "Team Readiness"
    
    # Team notified
    add_item "TEAM_NOTIFIED" "Team notified of deployment"
    if ask_question "Has the team been notified of deployment?"; then
        mark_complete "TEAM_NOTIFIED"
    else
        mark_incomplete "TEAM_NOTIFIED"
        print_message "$YELLOW" "   Notify: Development, Support, QA teams"
    fi
    
    # Support ready
    add_item "SUPPORT_READY" "Support team ready"
    if ask_question "Is support team ready to handle issues?"; then
        mark_complete "SUPPORT_READY"
    else
        mark_incomplete "SUPPORT_READY"
        print_message "$YELLOW" "   Brief support team on changes"
    fi
    
    # Monitoring ready
    add_item "MONITORING" "Monitoring tools ready"
    if ask_question "Are monitoring tools configured and ready?"; then
        mark_complete "MONITORING"
    else
        mark_incomplete "MONITORING"
        print_message "$YELLOW" "   Setup: Error tracking, performance monitoring"
    fi
}

# Deployment environment
deployment_environment() {
    print_header "Deployment Environment"
    
    # Staging tested
    add_item "STAGING" "Tested in staging environment"
    if ask_question "Has deployment been tested in staging?"; then
        mark_complete "STAGING"
    else
        mark_incomplete "STAGING"
        print_message "$YELLOW" "   Deploy to staging first"
    fi
    
    # Database backup
    add_item "DB_BACKUP" "Database backup created"
    if ask_question "Has database backup been created?"; then
        mark_complete "DB_BACKUP"
    else
        mark_incomplete "DB_BACKUP"
        print_message "$YELLOW" "   Create database backup"
    fi
    
    # Maintenance mode
    add_item "MAINTENANCE" "Maintenance mode plan"
    if ask_question "Is maintenance mode plan in place (if needed)?"; then
        mark_complete "MAINTENANCE"
    else
        mark_incomplete "MAINTENANCE"
        print_message "$YELLOW" "   Plan maintenance window if needed"
    fi
}

# Post-deployment plan
post_deployment_plan() {
    print_header "Post-Deployment Plan"
    
    # Monitoring plan
    add_item "MONITOR_PLAN" "Monitoring plan defined"
    if ask_question "Is post-deployment monitoring plan defined?"; then
        mark_complete "MONITOR_PLAN"
    else
        mark_incomplete "MONITOR_PLAN"
        print_message "$YELLOW" "   Define: What to monitor, for how long"
    fi
    
    # Feedback collection
    add_item "FEEDBACK" "User feedback collection ready"
    if ask_question "Is user feedback collection mechanism ready?"; then
        mark_complete "FEEDBACK"
    else
        mark_incomplete "FEEDBACK"
        print_message "$YELLOW" "   Setup: Feedback forms, surveys"
    fi
    
    # Communication plan
    add_item "COMMUNICATION" "Communication plan ready"
    if ask_question "Is user communication plan ready?"; then
        mark_complete "COMMUNICATION"
    else
        mark_incomplete "COMMUNICATION"
        print_message "$YELLOW" "   Prepare: Release notes, announcements"
    fi
}

# Generate checklist report
generate_report() {
    print_header "Deployment Checklist Report"
    
    local completion_percent=$((completed_items * 100 / total_items))
    
    cat > DEPLOYMENT_CHECKLIST_REPORT.txt << EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Deployment Checklist Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date: $(date '+%Y-%m-%d %H:%M:%S')

Completion Status:
  Completed: $completed_items / $total_items items
  Progress: ${completion_percent}%

Checklist Items:
EOF
    
    for key in "${!checklist_items[@]}"; do
        echo "  - $key: ${checklist_items[$key]}" >> DEPLOYMENT_CHECKLIST_REPORT.txt
    done
    
    cat >> DEPLOYMENT_CHECKLIST_REPORT.txt << EOF

Deployment Readiness:
EOF
    
    if [ $completion_percent -eq 100 ]; then
        cat >> DEPLOYMENT_CHECKLIST_REPORT.txt << EOF
  ✅ READY FOR DEPLOYMENT
  
  All checklist items completed. Proceed with deployment:
  1. Run: bash scripts/prepare-release.sh
  2. Run: bash scripts/deploy-production.sh
  3. Run: bash scripts/monitor-deployment.sh --monitor
EOF
    elif [ $completion_percent -ge 80 ]; then
        cat >> DEPLOYMENT_CHECKLIST_REPORT.txt << EOF
  ⚠️  MOSTLY READY (${completion_percent}%)
  
  Most items completed. Review incomplete items before deployment.
  Consider proceeding with caution or completing remaining items.
EOF
    else
        cat >> DEPLOYMENT_CHECKLIST_REPORT.txt << EOF
  ❌ NOT READY (${completion_percent}%)
  
  Too many incomplete items. Complete remaining items before deployment.
  Do not proceed until at least 80% complete.
EOF
    fi
    
    cat >> DEPLOYMENT_CHECKLIST_REPORT.txt << EOF

Next Steps:
  1. Complete all incomplete items
  2. Re-run this checklist
  3. Proceed with deployment when 100% complete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
    
    cat DEPLOYMENT_CHECKLIST_REPORT.txt
    print_message "$GREEN" "\n✅ Report saved to DEPLOYMENT_CHECKLIST_REPORT.txt"
}

# Show summary
show_summary() {
    print_header "Checklist Summary"
    
    local completion_percent=$((completed_items * 100 / total_items))
    
    print_message "$CYAN" "Completed: $completed_items / $total_items items"
    print_message "$CYAN" "Progress: ${completion_percent}%"
    echo ""
    
    if [ $completion_percent -eq 100 ]; then
        print_message "$GREEN" "✅ ALL CHECKS PASSED - READY FOR DEPLOYMENT!"
        echo ""
        print_message "$CYAN" "Next steps:"
        print_message "$CYAN" "  1. bash scripts/prepare-release.sh"
        print_message "$CYAN" "  2. bash scripts/deploy-production.sh"
        print_message "$CYAN" "  3. bash scripts/monitor-deployment.sh --monitor"
    elif [ $completion_percent -ge 80 ]; then
        print_message "$YELLOW" "⚠️  MOSTLY READY (${completion_percent}%)"
        print_message "$YELLOW" "   Review incomplete items before proceeding"
    else
        print_message "$RED" "❌ NOT READY (${completion_percent}%)"
        print_message "$RED" "   Complete remaining items before deployment"
    fi
    
    echo ""
}

# Main execution
main() {
    print_message "$BLUE" "╔════════════════════════════════════════════════════════════════════════════╗"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "║                    Deployment Checklist                                    ║"
    print_message "$BLUE" "║                    Modern Admin Styler v1.2.2                              ║"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "╚════════════════════════════════════════════════════════════════════════════╝"
    
    print_message "$CYAN" "\nThis checklist ensures all deployment requirements are met."
    print_message "$CYAN" "Answer each question honestly to assess deployment readiness."
    echo ""
    
    read -p "Press Enter to begin checklist..."
    
    # Run all checks
    pre_deployment_checks
    build_checks
    backup_checks
    team_readiness
    deployment_environment
    post_deployment_plan
    
    # Show summary
    show_summary
    
    # Generate report
    generate_report
}

# Run main function
main
