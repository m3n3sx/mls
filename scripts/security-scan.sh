#!/bin/bash
#
# Security Vulnerability Scanner
# Scans for common security vulnerabilities in WordPress plugins
#
# Usage: ./scripts/security-scan.sh
#

set -e

echo "=========================================="
echo "Security Vulnerability Scanner"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ISSUES=0

echo "Scanning for security vulnerabilities..."
echo ""

# 1. Check for SQL injection vulnerabilities
echo "1. Checking for SQL injection vulnerabilities..."
# Check for direct queries without prepare() on the same or previous line
SQL_ISSUES=0
while IFS= read -r file; do
    if grep -Pzo "\\\$wpdb->(query|get_results|get_var|get_row|get_col)\s*\([^)]*\\\$" "$file" 2>/dev/null | grep -vzP "prepare\s*\(" > /dev/null 2>&1; then
        SQL_ISSUES=$((SQL_ISSUES + 1))
        echo -e "${YELLOW}⚠ Potential SQL injection in: $file${NC}"
    fi
done < <(find includes/ -name "*.php" 2>/dev/null)

if [ "$SQL_ISSUES" -eq 0 ]; then
    echo -e "${GREEN}✓ No SQL injection vulnerabilities found${NC}"
else
    ISSUES=$((ISSUES + SQL_ISSUES))
fi
echo ""

# 2. Check for XSS vulnerabilities (unescaped output)
echo "2. Checking for XSS vulnerabilities..."
XSS_ISSUES=$(grep -rn "echo \$\|print \$" includes/ 2>/dev/null | grep -v "esc_html\|esc_attr\|esc_url\|wp_kses" | wc -l || true)
if [ "$XSS_ISSUES" -gt 0 ]; then
    echo -e "${YELLOW}⚠ Found $XSS_ISSUES potential XSS vulnerabilities (unescaped output)${NC}"
    grep -rn "echo \$\|print \$" includes/ 2>/dev/null | grep -v "esc_html\|esc_attr\|esc_url\|wp_kses" | head -5
    ISSUES=$((ISSUES + XSS_ISSUES))
else
    echo -e "${GREEN}✓ No XSS vulnerabilities found${NC}"
fi
echo ""

# 3. Check for file inclusion vulnerabilities
echo "3. Checking for file inclusion vulnerabilities..."
FILE_ISSUES=$(grep -rn "^[^/]*include\s*(\|^[^/]*require\s*(" includes/ modern-admin-styler.php 2>/dev/null | grep "\$_GET\|\$_POST\|\$_REQUEST" | wc -l || true)
if [ "$FILE_ISSUES" -gt 0 ]; then
    echo -e "${YELLOW}⚠ Found $FILE_ISSUES potential file inclusion vulnerabilities${NC}"
    grep -rn "^[^/]*include\s*(\|^[^/]*require\s*(" includes/ modern-admin-styler.php 2>/dev/null | grep "\$_GET\|\$_POST\|\$_REQUEST" | head -5
    ISSUES=$((ISSUES + FILE_ISSUES))
else
    echo -e "${GREEN}✓ No file inclusion vulnerabilities found${NC}"
fi
echo ""

# 4. Check for eval() usage
echo "4. Checking for eval() usage..."
EVAL_ISSUES=$(grep -rn "eval(" includes/ modern-admin-styler.php 2>/dev/null | wc -l || true)
if [ "$EVAL_ISSUES" -gt 0 ]; then
    echo -e "${RED}✗ Found $EVAL_ISSUES eval() usage (CRITICAL)${NC}"
    grep -rn "eval(" includes/ modern-admin-styler.php 2>/dev/null
    ISSUES=$((ISSUES + EVAL_ISSUES * 10))
else
    echo -e "${GREEN}✓ No eval() usage found${NC}"
fi
echo ""

# 5. Check for base64_decode usage (potential obfuscation)
echo "5. Checking for base64_decode usage..."
BASE64_ISSUES=$(grep -rn "base64_decode" includes/ modern-admin-styler.php 2>/dev/null | wc -l || true)
if [ "$BASE64_ISSUES" -gt 0 ]; then
    echo -e "${YELLOW}⚠ Found $BASE64_ISSUES base64_decode usage (review for obfuscation)${NC}"
    grep -rn "base64_decode" includes/ modern-admin-styler.php 2>/dev/null
else
    echo -e "${GREEN}✓ No base64_decode usage found${NC}"
fi
echo ""

# 6. Check for system/exec calls
echo "6. Checking for system/exec calls..."
EXEC_ISSUES=$(grep -rn "^\s*system\s*(\|^\s*exec\s*(\|^\s*shell_exec\s*(\|^\s*passthru\s*(" includes/ modern-admin-styler.php 2>/dev/null | wc -l || true)
if [ "$EXEC_ISSUES" -gt 0 ]; then
    echo -e "${RED}✗ Found $EXEC_ISSUES system/exec calls (CRITICAL)${NC}"
    grep -rn "^\s*system\s*(\|^\s*exec\s*(\|^\s*shell_exec\s*(\|^\s*passthru\s*(" includes/ modern-admin-styler.php 2>/dev/null
    ISSUES=$((ISSUES + EXEC_ISSUES * 10))
else
    echo -e "${GREEN}✓ No system/exec calls found${NC}"
fi
echo ""

# 7. Check for file upload vulnerabilities
echo "7. Checking for file upload handling..."
UPLOAD_COUNT=$(grep -rn "\$_FILES" includes/ modern-admin-styler.php 2>/dev/null | wc -l || true)
UPLOAD_VALIDATED=$(grep -rn "wp_check_filetype\|wp_handle_upload" includes/ modern-admin-styler.php 2>/dev/null | wc -l || true)
if [ "$UPLOAD_COUNT" -gt 0 ]; then
    if [ "$UPLOAD_VALIDATED" -gt 0 ]; then
        echo -e "${GREEN}✓ Found $UPLOAD_COUNT file upload handlers (validated with WordPress functions)${NC}"
    else
        echo -e "${YELLOW}⚠ Found $UPLOAD_COUNT file upload handlers without validation${NC}"
        ISSUES=$((ISSUES + UPLOAD_COUNT))
    fi
else
    echo -e "${GREEN}✓ No file upload handlers found${NC}"
fi
echo ""

# 8. Check for hardcoded credentials
echo "8. Checking for hardcoded credentials..."
CRED_ISSUES=$(grep -rni "password\s*=\|api_key\s*=\|secret\s*=" includes/ modern-admin-styler.php 2>/dev/null | grep -v "//\|/\*" | wc -l || true)
if [ "$CRED_ISSUES" -gt 0 ]; then
    echo -e "${RED}✗ Found $CRED_ISSUES potential hardcoded credentials (CRITICAL)${NC}"
    grep -rni "password\s*=\|api_key\s*=\|secret\s*=" includes/ modern-admin-styler.php 2>/dev/null | grep -v "//\|/\*"
    ISSUES=$((ISSUES + CRED_ISSUES * 10))
else
    echo -e "${GREEN}✓ No hardcoded credentials found${NC}"
fi
echo ""

echo "=========================================="
echo "Security Scan Complete"
echo ""

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}SUCCESS: No critical security vulnerabilities found${NC}"
    exit 0
elif [ $ISSUES -lt 10 ]; then
    echo -e "${YELLOW}WARNING: $ISSUES potential security issues found (review recommended)${NC}"
    exit 0
else
    echo -e "${RED}FAILED: $ISSUES security issues found (fix required)${NC}"
    exit 1
fi
