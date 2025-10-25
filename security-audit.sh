#!/bin/bash

# MASE Security Audit Script
# Automated security checks for the MASE plugin

echo "=========================================="
echo "MASE Security Audit"
echo "=========================================="
echo ""

ISSUES_FOUND=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to report issue
report_issue() {
    echo -e "${RED}❌ ISSUE: $1${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
}

# Function to report pass
report_pass() {
    echo -e "${GREEN}✅ PASS: $1${NC}"
}

# Function to report warning
report_warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
}

echo "1. Checking for unescaped output..."
echo "=========================================="

# Check for raw echo statements
UNESCAPED_ECHO=$(grep -rn "echo \$" includes/ --include="*.php" | grep -v "esc_" | wc -l)
if [ "$UNESCAPED_ECHO" -gt 0 ]; then
    report_issue "Found $UNESCAPED_ECHO potentially unescaped echo statements"
    grep -rn "echo \$" includes/ --include="*.php" | grep -v "esc_" | head -5
else
    report_pass "No unescaped echo statements found"
fi

echo ""
echo "2. Checking for unsafe JavaScript patterns..."
echo "=========================================="

# Check for innerHTML usage
INNERHTML_USAGE=$(grep -rn "innerHTML" assets/js/ --include="*.js" | wc -l)
if [ "$INNERHTML_USAGE" -gt 0 ]; then
    report_warning "Found $INNERHTML_USAGE innerHTML usages (review for XSS)"
    grep -rn "innerHTML" assets/js/ --include="*.js" | head -5
else
    report_pass "No innerHTML usage found"
fi

# Check for eval usage
EVAL_USAGE=$(grep -rn "eval(" assets/js/ --include="*.js" | wc -l)
if [ "$EVAL_USAGE" -gt 0 ]; then
    report_issue "Found $EVAL_USAGE eval() usages"
    grep -rn "eval(" assets/js/ --include="*.js"
else
    report_pass "No eval() usage found"
fi

echo ""
echo "3. Checking for nonce verification..."
echo "=========================================="

# Check AJAX handlers have nonce verification
AJAX_HANDLERS=$(grep -rn "wp_ajax_" includes/ --include="*.php" | wc -l)
NONCE_CHECKS=$(grep -rn "check_ajax_referer" includes/ --include="*.php" | wc -l)

if [ "$AJAX_HANDLERS" -gt "$NONCE_CHECKS" ]; then
    report_warning "Found $AJAX_HANDLERS AJAX handlers but only $NONCE_CHECKS nonce checks"
else
    report_pass "All AJAX handlers appear to have nonce verification"
fi

echo ""
echo "4. Checking for capability checks..."
echo "=========================================="

# Check for capability checks in AJAX handlers
CAPABILITY_CHECKS=$(grep -rn "current_user_can" includes/ --include="*.php" | wc -l)

if [ "$CAPABILITY_CHECKS" -lt "$AJAX_HANDLERS" ]; then
    report_warning "Found $AJAX_HANDLERS AJAX handlers but only $CAPABILITY_CHECKS capability checks"
else
    report_pass "All AJAX handlers appear to have capability checks"
fi

echo ""
echo "5. Checking for SQL injection vulnerabilities..."
echo "=========================================="

# Check for unprepared SQL queries
UNSAFE_SQL=$(grep -rn "\$wpdb->query(" includes/ --include="*.php" | grep -v "prepare" | wc -l)
if [ "$UNSAFE_SQL" -gt 0 ]; then
    report_issue "Found $UNSAFE_SQL potentially unsafe SQL queries"
    grep -rn "\$wpdb->query(" includes/ --include="*.php" | grep -v "prepare" | head -5
else
    report_pass "No unsafe SQL queries found"
fi

echo ""
echo "6. Checking NPM dependencies for vulnerabilities..."
echo "=========================================="

if command -v npm &> /dev/null; then
    npm audit --json > /tmp/npm-audit.json 2>&1
    VULNERABILITIES=$(cat /tmp/npm-audit.json | grep -o '"vulnerabilities":{[^}]*}' | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
    
    if [ -z "$VULNERABILITIES" ] || [ "$VULNERABILITIES" -eq 0 ]; then
        report_pass "No NPM vulnerabilities found"
    else
        report_issue "Found $VULNERABILITIES NPM vulnerabilities"
        npm audit
    fi
else
    report_warning "npm not found, skipping dependency check"
fi

echo ""
echo "7. Checking for hardcoded secrets..."
echo "=========================================="

# Check for potential API keys or passwords
SECRETS=$(grep -rni "api[_-]key\|password\|secret" includes/ assets/ --include="*.php" --include="*.js" | grep -v "// " | grep -v "/\*" | wc -l)
if [ "$SECRETS" -gt 0 ]; then
    report_warning "Found $SECRETS potential hardcoded secrets (review manually)"
    grep -rni "api[_-]key\|password\|secret" includes/ assets/ --include="*.php" --include="*.js" | grep -v "// " | grep -v "/\*" | head -5
else
    report_pass "No obvious hardcoded secrets found"
fi

echo ""
echo "8. Checking file permissions..."
echo "=========================================="

# Check for world-writable files
WRITABLE_FILES=$(find . -type f -perm -002 ! -path "./node_modules/*" ! -path "./.git/*" | wc -l)
if [ "$WRITABLE_FILES" -gt 0 ]; then
    report_issue "Found $WRITABLE_FILES world-writable files"
    find . -type f -perm -002 ! -path "./node_modules/*" ! -path "./.git/*" | head -5
else
    report_pass "No world-writable files found"
fi

echo ""
echo "9. Checking for debug code..."
echo "=========================================="

# Check for console.log statements
CONSOLE_LOGS=$(grep -rn "console\.log" assets/js/ --include="*.js" | wc -l)
if [ "$CONSOLE_LOGS" -gt 0 ]; then
    report_warning "Found $CONSOLE_LOGS console.log statements (should be removed for production)"
else
    report_pass "No console.log statements found"
fi

# Check for var_dump/print_r
DEBUG_PHP=$(grep -rn "var_dump\|print_r" includes/ --include="*.php" | wc -l)
if [ "$DEBUG_PHP" -gt 0 ]; then
    report_warning "Found $DEBUG_PHP debug statements (should be removed for production)"
else
    report_pass "No PHP debug statements found"
fi

echo ""
echo "10. Checking for TODO/FIXME comments..."
echo "=========================================="

# Check for TODO/FIXME comments that might indicate incomplete security
TODOS=$(grep -rni "TODO\|FIXME" includes/ assets/ --include="*.php" --include="*.js" | grep -i "security\|sanitize\|escape\|validate" | wc -l)
if [ "$TODOS" -gt 0 ]; then
    report_warning "Found $TODOS security-related TODO/FIXME comments"
    grep -rni "TODO\|FIXME" includes/ assets/ --include="*.php" --include="*.js" | grep -i "security\|sanitize\|escape\|validate" | head -5
else
    report_pass "No security-related TODO/FIXME comments found"
fi

echo ""
echo "=========================================="
echo "Security Audit Complete"
echo "=========================================="
echo ""

if [ "$ISSUES_FOUND" -eq 0 ]; then
    echo -e "${GREEN}✅ No critical issues found!${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $ISSUES_FOUND critical issues that need attention${NC}"
    exit 1
fi
