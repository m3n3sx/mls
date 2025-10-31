#!/bin/bash

###############################################################################
# User Feedback Collection Script
# Task 23.3: Deploy to production - Gather user feedback
# Requirements: All
#
# This script helps collect and analyze user feedback after deployment.
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

# Create feedback directory
create_feedback_dir() {
    local feedback_dir="feedback/$(date +%Y%m%d)"
    mkdir -p "$feedback_dir"
    echo "$feedback_dir"
}

# Collect WordPress.org reviews
collect_wporg_reviews() {
    print_header "WordPress.org Reviews"
    
    print_message "$CYAN" "Checking WordPress.org for recent reviews..."
    
    # This would integrate with WordPress.org API
    # For now, provide instructions
    
    print_message "$YELLOW" "Manual steps to collect WordPress.org reviews:"
    print_message "$CYAN" "  1. Visit: https://wordpress.org/support/plugin/modern-admin-styler/reviews/"
    print_message "$CYAN" "  2. Check recent reviews (last 7 days)"
    print_message "$CYAN" "  3. Note any issues or feedback"
    print_message "$CYAN" "  4. Respond to reviews promptly"
    echo ""
    
    read -p "Have you checked WordPress.org reviews? (yes/no): " checked
    if [ "$checked" == "yes" ]; then
        print_message "$GREEN" "✅ WordPress.org reviews checked"
    fi
}

# Collect support forum feedback
collect_support_feedback() {
    print_header "Support Forum Feedback"
    
    print_message "$CYAN" "Checking support forums for feedback..."
    
    print_message "$YELLOW" "Manual steps to collect support forum feedback:"
    print_message "$CYAN" "  1. Visit: https://wordpress.org/support/plugin/modern-admin-styler/"
    print_message "$CYAN" "  2. Check recent topics (last 7 days)"
    print_message "$CYAN" "  3. Identify common issues or requests"
    print_message "$CYAN" "  4. Respond to open topics"
    echo ""
    
    read -p "Have you checked support forums? (yes/no): " checked
    if [ "$checked" == "yes" ]; then
        print_message "$GREEN" "✅ Support forums checked"
    fi
}

# Analyze error logs
analyze_error_logs() {
    print_header "Error Log Analysis"
    
    print_message "$CYAN" "Analyzing error logs..."
    
    local log_file="wp-content/debug.log"
    
    if [ -f "$log_file" ]; then
        # Count MASE-related errors
        local error_count=$(grep -c "MASE" "$log_file" 2>/dev/null | tail -100 || echo "0")
        
        print_message "$CYAN" "MASE-related errors (last 100 lines): $error_count"
        
        if [ "$error_count" -gt 0 ]; then
            print_message "$YELLOW" "\nRecent errors:"
            grep "MASE" "$log_file" | tail -10 || true
        else
            print_message "$GREEN" "✅ No MASE-related errors found"
        fi
    else
        print_message "$YELLOW" "⚠️  Debug log not found"
        print_message "$CYAN" "   Enable WP_DEBUG in wp-config.php"
    fi
}

# Check performance metrics
check_performance_metrics() {
    print_header "Performance Metrics"
    
    print_message "$CYAN" "Checking performance metrics..."
    
    # Check if WP-CLI is available
    if command -v wp >/dev/null 2>&1; then
        # Get plugin status
        if wp plugin is-active modern-admin-styler 2>/dev/null; then
            print_message "$GREEN" "✅ Plugin is active"
            
            # Check settings
            local settings_size=$(wp option get mase_settings --format=json 2>/dev/null | wc -c || echo "0")
            print_message "$CYAN" "Settings size: $settings_size bytes"
            
            # Check cache
            local cache_exists=$(wp option get mase_css_cache_light 2>/dev/null && echo "yes" || echo "no")
            if [ "$cache_exists" == "yes" ]; then
                print_message "$GREEN" "✅ CSS cache is working"
            else
                print_message "$YELLOW" "⚠️  CSS cache not found"
            fi
        else
            print_message "$YELLOW" "⚠️  Plugin is not active"
        fi
    else
        print_message "$YELLOW" "⚠️  WP-CLI not available"
    fi
}

# Collect user satisfaction data
collect_satisfaction_data() {
    print_header "User Satisfaction Survey"
    
    print_message "$CYAN" "User satisfaction survey template:"
    echo ""
    
    cat << 'EOF'
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Modern Admin Styler - User Satisfaction Survey
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for using Modern Admin Styler! We'd love to hear your feedback.

1. Overall Satisfaction (1-5 stars)
   ☐ 1 star  ☐ 2 stars  ☐ 3 stars  ☐ 4 stars  ☐ 5 stars

2. Ease of Use (1-5 stars)
   ☐ 1 star  ☐ 2 stars  ☐ 3 stars  ☐ 4 stars  ☐ 5 stars

3. Performance (1-5 stars)
   ☐ 1 star  ☐ 2 stars  ☐ 3 stars  ☐ 4 stars  ☐ 5 stars

4. Visual Appeal (1-5 stars)
   ☐ 1 star  ☐ 2 stars  ☐ 3 stars  ☐ 4 stars  ☐ 5 stars

5. What do you like most about MASE?
   _________________________________________________________________

6. What could be improved?
   _________________________________________________________________

7. Have you experienced any issues?
   ☐ Yes (please describe): _________________________________________
   ☐ No

8. Would you recommend MASE to others?
   ☐ Yes  ☐ No  ☐ Maybe

9. Additional comments:
   _________________________________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
    
    echo ""
    print_message "$CYAN" "Survey distribution options:"
    print_message "$CYAN" "  1. WordPress.org support forum"
    print_message "$CYAN" "  2. Plugin admin notice (after 7 days of use)"
    print_message "$CYAN" "  3. Email to registered users"
    print_message "$CYAN" "  4. Social media channels"
}

# Analyze feedback trends
analyze_feedback_trends() {
    print_header "Feedback Trends Analysis"
    
    local feedback_dir=$(create_feedback_dir)
    
    print_message "$CYAN" "Analyzing feedback trends..."
    echo ""
    
    print_message "$BLUE" "Common Feedback Categories:"
    print_message "$CYAN" "  1. Performance Issues"
    print_message "$CYAN" "  2. Visual/Design Feedback"
    print_message "$CYAN" "  3. Feature Requests"
    print_message "$CYAN" "  4. Bug Reports"
    print_message "$CYAN" "  5. Usability Concerns"
    print_message "$CYAN" "  6. Compatibility Issues"
    echo ""
    
    print_message "$YELLOW" "Track feedback in: $feedback_dir"
}

# Generate feedback report
generate_feedback_report() {
    print_header "Feedback Report"
    
    local feedback_dir=$(create_feedback_dir)
    local report_file="${feedback_dir}/feedback-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$report_file" << EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  User Feedback Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report Date: $(date '+%Y-%m-%d %H:%M:%S')
Collection Period: Last 7 days

Feedback Sources:
  ☐ WordPress.org reviews
  ☐ Support forum topics
  ☐ Error logs
  ☐ User surveys
  ☐ Direct feedback

Summary Statistics:
  Total Feedback Items: ___
  Positive Feedback: ___
  Negative Feedback: ___
  Neutral Feedback: ___
  Bug Reports: ___
  Feature Requests: ___

Common Themes:
  1. _________________________________________________________________
  2. _________________________________________________________________
  3. _________________________________________________________________

Critical Issues:
  1. _________________________________________________________________
  2. _________________________________________________________________

Action Items:
  Priority 1 (Immediate):
    - _________________________________________________________________
  
  Priority 2 (This Week):
    - _________________________________________________________________
  
  Priority 3 (This Month):
    - _________________________________________________________________

User Satisfaction:
  Overall Rating: ___ / 5 stars
  Ease of Use: ___ / 5 stars
  Performance: ___ / 5 stars
  Visual Appeal: ___ / 5 stars

Recommendations:
  - _________________________________________________________________
  - _________________________________________________________________

Next Steps:
  1. Address critical issues immediately
  2. Plan fixes for common problems
  3. Consider feature requests for future releases
  4. Continue monitoring feedback

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
    
    cat "$report_file"
    print_message "$GREEN" "\n✅ Feedback report template saved to: $report_file"
    print_message "$CYAN" "   Fill in the template with actual feedback data"
}

# Main execution
main() {
    print_message "$BLUE" "╔════════════════════════════════════════════════════════════════════════════╗"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "║                    User Feedback Collection                                ║"
    print_message "$BLUE" "║                    Modern Admin Styler                                     ║"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "╚════════════════════════════════════════════════════════════════════════════╝"
    
    print_message "$CYAN" "\nThis script helps collect and analyze user feedback after deployment."
    echo ""
    
    # Collect feedback from various sources
    collect_wporg_reviews
    collect_support_feedback
    analyze_error_logs
    check_performance_metrics
    collect_satisfaction_data
    analyze_feedback_trends
    generate_feedback_report
    
    print_header "Feedback Collection Complete"
    print_message "$GREEN" "✅ Feedback collection process completed"
    print_message "$CYAN" "   Review feedback report and take action on issues"
    echo ""
}

# Run main function
main
