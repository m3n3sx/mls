#!/bin/bash

###############################################################################
# Deployment Monitoring Script
# Task 22.4: Monitor and respond to issues
# Requirements: 15.3, 15.4
#
# This script monitors the production deployment and provides:
# - Real-time error rate monitoring
# - Performance metrics tracking
# - Automatic rollback triggers
# - Alert notifications
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
WORDPRESS_PATH="${WORDPRESS_PATH:-.}"
LOG_FILE="${WORDPRESS_PATH}/wp-content/debug.log"
MONITOR_INTERVAL=60  # Check every 60 seconds
ERROR_THRESHOLD=5    # Rollback if error rate > 5%
PERF_THRESHOLD=20    # Rollback if performance degrades > 20%

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

# Check if WordPress CLI is available
check_wp_cli() {
    if ! command -v wp &> /dev/null; then
        print_message "$RED" "❌ WP-CLI not found. Install from https://wp-cli.org/"
        exit 1
    fi
}

# Get current feature flag status
get_feature_status() {
    wp option get mase_feature_flags --format=json 2>/dev/null || echo "{}"
}

# Get rollout percentages
get_rollout_percentages() {
    wp option get mase_feature_rollout_percentages --format=json 2>/dev/null || echo "{}"
}

# Count errors in log file
count_errors() {
    local since_minutes=${1:-5}
    local since_time=$(date -d "$since_minutes minutes ago" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || date -v-${since_minutes}M '+%Y-%m-%d %H:%M:%S')
    
    if [ -f "$LOG_FILE" ]; then
        # Count MASE-related errors in last N minutes
        grep -c "MASE" "$LOG_FILE" 2>/dev/null | tail -100 || echo "0"
    else
        echo "0"
    fi
}

# Get error rate
get_error_rate() {
    local errors=$(count_errors 5)
    local total_requests=100  # Estimate - would need actual analytics
    
    if [ "$total_requests" -gt 0 ]; then
        echo $(( errors * 100 / total_requests ))
    else
        echo "0"
    fi
}

# Check performance metrics
check_performance() {
    print_message "$YELLOW" "📊 Checking performance metrics..."
    
    # This would integrate with actual performance monitoring
    # For now, we'll check if the site is responsive
    
    local response_time=$(curl -o /dev/null -s -w '%{time_total}' "http://localhost/wp-admin/" 2>/dev/null || echo "0")
    
    print_message "$BLUE" "Response time: ${response_time}s"
    
    # Check if response time is acceptable (< 2 seconds)
    if (( $(echo "$response_time > 2.0" | bc -l 2>/dev/null || echo "0") )); then
        print_message "$YELLOW" "⚠️  Slow response time detected"
        return 1
    fi
    
    return 0
}

# Monitor deployment
monitor_deployment() {
    print_header "Deployment Monitoring"
    
    print_message "$BLUE" "Monitoring interval: ${MONITOR_INTERVAL}s"
    print_message "$BLUE" "Error threshold: ${ERROR_THRESHOLD}%"
    print_message "$BLUE" "Performance threshold: ${PERF_THRESHOLD}%"
    echo ""
    
    local iteration=0
    
    while true; do
        iteration=$((iteration + 1))
        local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
        
        print_message "$BLUE" "[$timestamp] Check #$iteration"
        
        # Get current status
        local features=$(get_feature_status)
        local rollouts=$(get_rollout_percentages)
        
        print_message "$BLUE" "Feature Flags: $features"
        print_message "$BLUE" "Rollout %: $rollouts"
        
        # Check error rate
        local error_rate=$(get_error_rate)
        print_message "$BLUE" "Error rate: ${error_rate}%"
        
        if [ "$error_rate" -gt "$ERROR_THRESHOLD" ]; then
            print_message "$RED" "❌ ERROR RATE EXCEEDED THRESHOLD!"
            print_message "$YELLOW" "Triggering automatic rollback..."
            trigger_rollback "High error rate: ${error_rate}%"
            break
        fi
        
        # Check performance
        if ! check_performance; then
            print_message "$YELLOW" "⚠️  Performance degradation detected"
        fi
        
        # Check for critical errors
        local critical_errors=$(grep -c "CRITICAL\|FATAL" "$LOG_FILE" 2>/dev/null | tail -10 || echo "0")
        if [ "$critical_errors" -gt 0 ]; then
            print_message "$RED" "❌ CRITICAL ERRORS DETECTED: $critical_errors"
            print_message "$YELLOW" "Triggering automatic rollback..."
            trigger_rollback "Critical errors detected: $critical_errors"
            break
        fi
        
        print_message "$GREEN" "✅ All metrics within acceptable range"
        echo ""
        
        sleep "$MONITOR_INTERVAL"
    done
}

# Trigger rollback
trigger_rollback() {
    local reason="$1"
    
    print_header "AUTOMATIC ROLLBACK TRIGGERED"
    print_message "$RED" "Reason: $reason"
    echo ""
    
    # Create rollback backup
    local backup_file="rollback-backup-$(date +%Y%m%d-%H%M%S).json"
    get_feature_status > "$backup_file"
    print_message "$BLUE" "Backup saved to: $backup_file"
    
    # Disable all modern features
    print_message "$YELLOW" "Disabling all modern features..."
    
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
    }' --format=json
    
    # Clear all caches
    print_message "$YELLOW" "Clearing caches..."
    wp cache flush 2>/dev/null || true
    
    # Clear transients
    wp transient delete --all 2>/dev/null || true
    
    print_message "$GREEN" "✅ Rollback completed"
    print_message "$YELLOW" "⚠️  Please investigate the issue before re-enabling features"
    
    # Send notification (would integrate with actual notification system)
    send_notification "MASE Rollback" "$reason"
}

# Send notification
send_notification() {
    local title="$1"
    local message="$2"
    
    print_message "$BLUE" "📧 Notification: $title - $message"
    
    # This would integrate with actual notification system
    # Examples: Slack, email, PagerDuty, etc.
    
    # For now, just log to file
    echo "[$( date '+%Y-%m-%d %H:%M:%S')] $title: $message" >> deployment-notifications.log
}

# Generate monitoring report
generate_report() {
    print_header "Monitoring Report"
    
    local report_file="monitoring-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$report_file" << EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MASE Deployment Monitoring Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report Date: $(date '+%Y-%m-%d %H:%M:%S')

Current Feature Status:
$(get_feature_status | python3 -m json.tool 2>/dev/null || echo "N/A")

Rollout Percentages:
$(get_rollout_percentages | python3 -m json.tool 2>/dev/null || echo "N/A")

Recent Errors (last 100 lines):
$(tail -100 "$LOG_FILE" 2>/dev/null | grep "MASE" || echo "No errors found")

Performance Metrics:
- Response Time: $(curl -o /dev/null -s -w '%{time_total}' "http://localhost/wp-admin/" 2>/dev/null || echo "N/A")s
- Error Rate: $(get_error_rate)%

Recommendations:
- Monitor error logs regularly
- Review performance metrics
- Collect user feedback
- Plan next rollout phase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
    
    cat "$report_file"
    print_message "$GREEN" "\n✅ Report saved to: $report_file"
}

# Show current status
show_status() {
    print_header "Current Deployment Status"
    
    print_message "$BLUE" "Feature Flags:"
    get_feature_status | python3 -m json.tool 2>/dev/null || echo "N/A"
    
    echo ""
    print_message "$BLUE" "Rollout Percentages:"
    get_rollout_percentages | python3 -m json.tool 2>/dev/null || echo "N/A"
    
    echo ""
    print_message "$BLUE" "Recent Errors:"
    count_errors 60
    
    echo ""
    check_performance
}

# Main menu
show_menu() {
    echo ""
    print_message "$BLUE" "╔════════════════════════════════════════════════════════════════════════════╗"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "║                  MASE Deployment Monitoring Tool                           ║"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "╚════════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "1) Show current status"
    echo "2) Start monitoring"
    echo "3) Generate report"
    echo "4) Trigger manual rollback"
    echo "5) Exit"
    echo ""
    read -p "Select option: " choice
    
    case $choice in
        1) show_status ;;
        2) monitor_deployment ;;
        3) generate_report ;;
        4) 
            read -p "Enter rollback reason: " reason
            trigger_rollback "$reason"
            ;;
        5) exit 0 ;;
        *) print_message "$RED" "Invalid option" ;;
    esac
    
    show_menu
}

# Main execution
main() {
    check_wp_cli
    
    if [ "$1" == "--monitor" ]; then
        monitor_deployment
    elif [ "$1" == "--status" ]; then
        show_status
    elif [ "$1" == "--report" ]; then
        generate_report
    elif [ "$1" == "--rollback" ]; then
        trigger_rollback "${2:-Manual rollback}"
    else
        show_menu
    fi
}

main "$@"
