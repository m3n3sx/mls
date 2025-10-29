#!/bin/bash
#
# AJAX Nonce Verification Audit
# Checks that all AJAX endpoints verify nonces
#
# Usage: ./scripts/audit-nonces.sh
#

set -e

echo "=========================================="
echo "AJAX Nonce Verification Audit"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Counting AJAX endpoints and nonce verifications..."
echo ""

# Count AJAX action registrations (excluding nopriv)
AJAX_COUNT=$(grep -rn "add_action.*'wp_ajax_mase_" includes/ modern-admin-styler.php 2>/dev/null | grep -v "wp_ajax_nopriv" | wc -l)

# Count nonce verifications
NONCE_COUNT=$(grep -rn "check_ajax_referer\|wp_verify_nonce" includes/class-mase-admin.php 2>/dev/null | grep -v "^\s*//" | grep -v "^\s*\*" | wc -l)

echo "AJAX Endpoints registered: $AJAX_COUNT"
echo "Nonce verifications found: $NONCE_COUNT"
echo ""

# List all AJAX actions
echo "Registered AJAX actions:"
grep -rn "add_action.*'wp_ajax_mase_" includes/ modern-admin-styler.php 2>/dev/null | grep -v "wp_ajax_nopriv" | sed "s/.*'wp_ajax_/  - /" | sed "s/'.*$//" | sort -u
echo ""

# Check if we have enough nonce checks (should be at least as many as endpoints)
if [ "$NONCE_COUNT" -ge "$AJAX_COUNT" ]; then
    echo -e "${GREEN}✓ All AJAX endpoints appear to have nonce verification${NC}"
    echo ""
    echo "Sample nonce verifications:"
    grep -rn "check_ajax_referer" includes/class-mase-admin.php 2>/dev/null | head -5 | sed "s/^/  /"
    echo ""
    echo "=========================================="
    echo -e "${GREEN}SUCCESS: Nonce verification implemented${NC}"
    exit 0
else
    echo -e "${RED}✗ Insufficient nonce verifications${NC}"
    echo -e "${RED}Expected at least $AJAX_COUNT, found $NONCE_COUNT${NC}"
    echo ""
    echo "=========================================="
    echo -e "${RED}FAILED: Some endpoints may be missing nonce verification${NC}"
    exit 1
fi
