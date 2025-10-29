#!/bin/bash
#
# Input Sanitization Audit
# Checks that all user inputs are sanitized
#
# Usage: ./scripts/audit-sanitization.sh
#

set -e

echo "=========================================="
echo "Input Sanitization Audit"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Checking input sanitization..."
echo ""

# Count $_POST, $_GET, $_REQUEST usage
POST_COUNT=$(grep -rn "\$_POST\[" includes/ 2>/dev/null | wc -l)
GET_COUNT=$(grep -rn "\$_GET\[" includes/ 2>/dev/null | wc -l)
REQUEST_COUNT=$(grep -rn "\$_REQUEST\[" includes/ 2>/dev/null | wc -l)
TOTAL_INPUTS=$((POST_COUNT + GET_COUNT + REQUEST_COUNT))

echo "Input sources found:"
echo "  \$_POST: $POST_COUNT"
echo "  \$_GET: $GET_COUNT"
echo "  \$_REQUEST: $REQUEST_COUNT"
echo "  Total: $TOTAL_INPUTS"
echo ""

# Count sanitization functions
SANITIZE_TEXT=$(grep -rn "sanitize_text_field\|sanitize_key\|sanitize_email" includes/ 2>/dev/null | wc -l)
SANITIZE_ARRAY=$(grep -rn "array_map.*sanitize" includes/ 2>/dev/null | wc -l)
ABSINT=$(grep -rn "absint\|intval" includes/ 2>/dev/null | wc -l)
WP_KSES=$(grep -rn "wp_kses\|wp_kses_post" includes/ 2>/dev/null | wc -l)
TOTAL_SANITIZE=$((SANITIZE_TEXT + SANITIZE_ARRAY + ABSINT + WP_KSES))

echo "Sanitization functions found:"
echo "  sanitize_text_field/key/email: $SANITIZE_TEXT"
echo "  array_map sanitization: $SANITIZE_ARRAY"
echo "  absint/intval: $ABSINT"
echo "  wp_kses: $WP_KSES"
echo "  Total: $TOTAL_SANITIZE"
echo ""

# Check for unsanitized inputs
echo "Checking for potentially unsanitized inputs..."
UNSAFE=$(grep -rn "\$_POST\[" includes/ 2>/dev/null | grep -v "sanitize_\|absint\|intval\|wp_kses\|isset" | wc -l)

if [ "$UNSAFE" -gt 0 ]; then
    echo -e "${YELLOW}⚠ Found $UNSAFE potentially unsanitized \$_POST usage${NC}"
    grep -rn "\$_POST\[" includes/ 2>/dev/null | grep -v "sanitize_\|absint\|intval\|wp_kses\|isset" | head -5 | sed "s/^/  /"
else
    echo -e "${GREEN}✓ All \$_POST usage appears sanitized${NC}"
fi
echo ""

echo "=========================================="

if [ "$TOTAL_SANITIZE" -ge "$TOTAL_INPUTS" ] && [ "$UNSAFE" -eq 0 ]; then
    echo -e "${GREEN}SUCCESS: Input sanitization implemented${NC}"
    exit 0
elif [ "$UNSAFE" -lt 5 ]; then
    echo -e "${YELLOW}WARNING: Some inputs may need review${NC}"
    exit 0
else
    echo -e "${RED}FAILED: Insufficient input sanitization${NC}"
    exit 1
fi
