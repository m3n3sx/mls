#!/bin/bash

###############################################################################
# Gradual Feature Rollout Script
# Task 22.3: Gradual feature rollout
# Requirements: 15.1, 15.2
#
# This script manages the gradual rollout of modern features:
# - Enable Preview Engine for 10% → 50% → 100%
# - Monitor error rates and performance
# - Automatic rollback on issues
# - Enable remaining features incrementally
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Check WP-CLI
check_wp_cli() {
    if ! command -v wp &> /dev/null; then
        print_message "$RED" "❌ WP-CLI not found. Install from https://wp-cli.org/"
        exit 1
    fi
}

# Get current rollout percentage
get_rollout_percentage() {
    local feature="$1"
    local percentages=$(wp option get mase_feature_rollout_percentages --format=json 2>/dev/null || echo "{}")
    echo "$percentages" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('$feature', 0))" 2>/dev/null || echo "0"
}

# Set rollout percentage
set_rollout_percentage() {
    local feature="$1"
    local percentage="$2"
    
    print_message "$YELLOW" "Setting $feature rollout to ${percentage}%..."
    
    # Get current percentages
    local percentages=$(wp option get mase_feature_rollout_percentages --format=json 2>/dev/null || echo "{}")
    
    # Update percentage
    local updated=$(echo "$percentages" | python3 -c "
import sys, json
data = json.load(sys.stdin) if sys.stdin.read().strip() else {}
data['$feature'] = $percentage
print(json.dumps(data))
" 2>/dev/null || echo "{\"$feature\": $percentage}")
    
    # Save to database
    wp option update mase_feature_rollout_percentages "$updated" --format=json
    
    print_message "$GREEN" "✅ Rollout percentage set to ${percentage}%"
}

# Enable feature fully
enable_feature() {
    local feature="$1"
    
    print_message "$YELLOW" "Enabling $feature fully..."
    
    # Get current flags
    local flags=$(wp option get mase_feature_flags --format=json 2>/dev/null || echo "{}")
    
    # Update flag
    local updated=$(echo "$flags" | python3 -c "
import sys, json
data = json.load(sys.stdin) if sys.stdin.read().strip() else {}
data['$feature'] = True
print(json.dumps(data))
" 2>/dev/null)
    
    # Save to database
    wp option update mase_feature_flags "$updated" --format=json
    
    print_message "$GREEN" "✅ Feature enabled"
}

# Monitor rollout
monitor_rollout() {
    local feature="$1"
    local duration="${2:-300}"  # Default 5 minutes
    
    print_message "$YELLOW" "Monitoring $feature for ${duration} seconds..."
    
    local start_time=$(date +%s)
    local end_time=$((start_time + duration))
    local errors=0
    
    while [ $(date +%s) -lt $end_time ]; do
        # Check error logs
        local recent_errors=$(grep -c "MASE.*ERROR" wp-content/debug.log 2>/dev/null | tail -10 || echo "0")
        
        if [ "$recent_errors" -gt 5 ]; then
            print_message "$RED" "❌ High error rate detected: $recent_errors errors"
            return 1
        fi
        
        # Show progress
        local elapsed=$(($(date +%s) - start_time))
        local remaining=$((duration - elapsed))
        echo -ne "\r⏱️  Monitoring... ${remaining}s remaining (${recent_errors} errors)   "
        
        sleep 10
    done
    
    echo ""
    print_message "$GREEN" "✅ Monitoring complete - no issues detected"
    return 0
}

# Rollout Preview Engine
rollout_preview_engine() {
    print_header "Phase 1: Preview Engine Rollout"
    
    # Stage 1: 10%
    print_message "$BLUE" "\n📊 Stage 1: Enabling for 10% of users"
    set_rollout_percentage "modern_preview_engine" 10
    
    print_message "$YELLOW" "Monitoring for 5 minutes..."
    if ! monitor_rollout "modern_preview_engine" 300; then
        print_message "$RED" "❌ Issues detected at 10% rollout"
        set_rollout_percentage "modern_preview_engine" 0
        return 1
    fi
    
    print_message "$GREEN" "✅ 10% rollout successful"
    read -p "Continue to 50%? (yes/no): " confirm
    [ "$confirm" != "yes" ] && return 0
    
    # Stage 2: 50%
    print_message "$BLUE" "\n📊 Stage 2: Enabling for 50% of users"
    set_rollout_percentage "modern_preview_engine" 50
    
    print_message "$YELLOW" "Monitoring for 5 minutes..."
    if ! monitor_rollout "modern_preview_engine" 300; then
        print_message "$RED" "❌ Issues detected at 50% rollout"
        set_rollout_percentage "modern_preview_engine" 10
        return 1
    fi
    
    print_message "$GREEN" "✅ 50% rollout successful"
    read -p "Continue to 100%? (yes/no): " confirm
    [ "$confirm" != "yes" ] && return 0
    
    # Stage 3: 100%
    print_message "$BLUE" "\n📊 Stage 3: Enabling for 100% of users"
    enable_feature "modern_preview_engine"
    set_rollout_percentage "modern_preview_engine" 100
    
    print_message "$YELLOW" "Monitoring for 10 minutes..."
    if ! monitor_rollout "modern_preview_engine" 600; then
        print_message "$RED" "❌ Issues detected at 100% rollout"
        set_rollout_percentage "modern_preview_engine" 50
        return 1
    fi
    
    print_message "$GREEN" "✅ Preview Engine fully rolled out!"
}

# Rollout State Manager
rollout_state_manager() {
    print_header "Phase 2: State Manager Rollout"
    
    print_message "$BLUE" "Rolling out State Manager..."
    
    # 10% → 50% → 100%
    for percentage in 10 50 100; do
        print_message "$BLUE" "\n📊 Enabling for ${percentage}% of users"
        
        if [ $percentage -eq 100 ]; then
            enable_feature "modern_state_manager"
        fi
        
        set_rollout_percentage "modern_state_manager" $percentage
        
        local monitor_time=300
        [ $percentage -eq 100 ] && monitor_time=600
        
        if ! monitor_rollout "modern_state_manager" $monitor_time; then
            print_message "$RED" "❌ Issues detected at ${percentage}% rollout"
            return 1
        fi
        
        print_message "$GREEN" "✅ ${percentage}% rollout successful"
        
        if [ $percentage -lt 100 ]; then
            read -p "Continue to next stage? (yes/no): " confirm
            [ "$confirm" != "yes" ] && return 0
        fi
    done
    
    print_message "$GREEN" "✅ State Manager fully rolled out!"
}

# Rollout API Client
rollout_api_client() {
    print_header "Phase 3: API Client Rollout"
    
    print_message "$BLUE" "Rolling out API Client..."
    
    for percentage in 10 50 100; do
        print_message "$BLUE" "\n📊 Enabling for ${percentage}% of users"
        
        if [ $percentage -eq 100 ]; then
            enable_feature "modern_api_client"
        fi
        
        set_rollout_percentage "modern_api_client" $percentage
        
        local monitor_time=300
        [ $percentage -eq 100 ] && monitor_time=600
        
        if ! monitor_rollout "modern_api_client" $monitor_time; then
            print_message "$RED" "❌ Issues detected at ${percentage}% rollout"
            return 1
        fi
        
        print_message "$GREEN" "✅ ${percentage}% rollout successful"
        
        if [ $percentage -lt 100 ]; then
            read -p "Continue to next stage? (yes/no): " confirm
            [ "$confirm" != "yes" ] && return 0
        fi
    done
    
    print_message "$GREEN" "✅ API Client fully rolled out!"
}

# Rollout remaining features
rollout_remaining_features() {
    print_header "Phase 4: Remaining Features Rollout"
    
    local features=(
        "modern_event_bus"
        "modern_color_system"
        "modern_typography"
        "modern_animations"
    )
    
    for feature in "${features[@]}"; do
        print_message "$BLUE" "\n📊 Rolling out $feature..."
        
        for percentage in 10 50 100; do
            print_message "$BLUE" "Enabling for ${percentage}% of users"
            
            if [ $percentage -eq 100 ]; then
                enable_feature "$feature"
            fi
            
            set_rollout_percentage "$feature" $percentage
            
            if ! monitor_rollout "$feature" 180; then
                print_message "$RED" "❌ Issues detected with $feature"
                return 1
            fi
            
            print_message "$GREEN" "✅ ${percentage}% successful"
            
            if [ $percentage -lt 100 ]; then
                read -p "Continue? (yes/no): " confirm
                [ "$confirm" != "yes" ] && return 0
            fi
        done
        
        print_message "$GREEN" "✅ $feature fully rolled out!"
    done
}

# Show current status
show_status() {
    print_header "Current Rollout Status"
    
    print_message "$BLUE" "Feature Flags:"
    wp option get mase_feature_flags --format=json | python3 -m json.tool 2>/dev/null || echo "N/A"
    
    echo ""
    print_message "$BLUE" "Rollout Percentages:"
    wp option get mase_feature_rollout_percentages --format=json | python3 -m json.tool 2>/dev/null || echo "N/A"
}

# Generate rollout report
generate_report() {
    print_header "Rollout Report"
    
    local report_file="rollout-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$report_file" << EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MASE Gradual Rollout Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report Date: $(date '+%Y-%m-%d %H:%M:%S')

Current Feature Status:
$(wp option get mase_feature_flags --format=json 2>/dev/null | python3 -m json.tool || echo "N/A")

Rollout Percentages:
$(wp option get mase_feature_rollout_percentages --format=json 2>/dev/null | python3 -m json.tool || echo "N/A")

Rollout Progress:
  Phase 1: Preview Engine
  Phase 2: State Manager
  Phase 3: API Client
  Phase 4: Remaining Features

Next Steps:
  - Continue monitoring error logs
  - Collect user feedback
  - Proceed to next phase when stable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
    
    cat "$report_file"
    print_message "$GREEN" "\n✅ Report saved to: $report_file"
}

# Main menu
show_menu() {
    echo ""
    print_message "$BLUE" "╔════════════════════════════════════════════════════════════════════════════╗"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "║                  MASE Gradual Rollout Tool                                 ║"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "╚════════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "1) Show current status"
    echo "2) Rollout Preview Engine (10% → 50% → 100%)"
    echo "3) Rollout State Manager (10% → 50% → 100%)"
    echo "4) Rollout API Client (10% → 50% → 100%)"
    echo "5) Rollout remaining features"
    echo "6) Full automated rollout (all phases)"
    echo "7) Generate report"
    echo "8) Exit"
    echo ""
    read -p "Select option: " choice
    
    case $choice in
        1) show_status ;;
        2) rollout_preview_engine ;;
        3) rollout_state_manager ;;
        4) rollout_api_client ;;
        5) rollout_remaining_features ;;
        6) 
            rollout_preview_engine && \
            rollout_state_manager && \
            rollout_api_client && \
            rollout_remaining_features
            ;;
        7) generate_report ;;
        8) exit 0 ;;
        *) print_message "$RED" "Invalid option" ;;
    esac
    
    show_menu
}

# Main execution
main() {
    check_wp_cli
    
    if [ "$1" == "--status" ]; then
        show_status
    elif [ "$1" == "--report" ]; then
        generate_report
    elif [ "$1" == "--auto" ]; then
        rollout_preview_engine && \
        rollout_state_manager && \
        rollout_api_client && \
        rollout_remaining_features
    else
        show_menu
    fi
}

main "$@"
