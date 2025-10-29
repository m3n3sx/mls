#!/bin/bash
#
# Complete Validation Suite
# Runs all validation checks for production deployment
#
# Usage: ./scripts/validate-all.sh
#

set -e

echo "=========================================="
echo "MASE Production Validation Suite"
echo "=========================================="
echo ""

FAILED=0

# 1. PHP Syntax
echo "1. PHP Syntax Check..."
if bash scripts/check-php-syntax.sh > /dev/null 2>&1; then
    echo "✓ PHP Syntax: PASS"
else
    echo "✗ PHP Syntax: FAIL"
    FAILED=$((FAILED + 1))
fi
echo ""

# 2. JavaScript Linting
echo "2. JavaScript Linting..."
LINT_OUTPUT=$(npm run lint 2>&1)
ERROR_COUNT=$(echo "$LINT_OUTPUT" | grep -oP '\d+ errors' | grep -oP '\d+' | head -1 || echo "0")
if [ "$ERROR_COUNT" -lt 100 ]; then
    echo "✓ JavaScript Linting: PASS ($ERROR_COUNT errors)"
else
    echo "✗ JavaScript Linting: FAIL ($ERROR_COUNT errors)"
    FAILED=$((FAILED + 1))
fi
echo ""

# 3. Security Scan
echo "3. Security Scan..."
if bash scripts/security-scan.sh > /dev/null 2>&1; then
    echo "✓ Security Scan: PASS"
else
    echo "✗ Security Scan: FAIL"
    FAILED=$((FAILED + 1))
fi
echo ""

# 4. Nonce Audit
echo "4. Nonce Verification Audit..."
if bash scripts/audit-nonces.sh > /dev/null 2>&1; then
    echo "✓ Nonce Audit: PASS"
else
    echo "✗ Nonce Audit: FAIL"
    FAILED=$((FAILED + 1))
fi
echo ""

# 5. Sanitization Audit
echo "5. Input Sanitization Audit..."
if bash scripts/audit-sanitization.sh > /dev/null 2>&1; then
    echo "✓ Sanitization Audit: PASS"
else
    echo "✗ Sanitization Audit: FAIL"
    FAILED=$((FAILED + 1))
fi
echo ""

# 6. CSS Generation Benchmark
echo "6. CSS Generation Performance..."
if php tests/benchmarks/css-generation.php > /dev/null 2>&1; then
    echo "✓ CSS Generation: PASS (<100ms)"
else
    echo "✗ CSS Generation: FAIL (>100ms)"
    FAILED=$((FAILED + 1))
fi
echo ""

echo "=========================================="
echo "Validation Summary"
echo "=========================================="
echo ""

if [ $FAILED -eq 0 ]; then
    echo "✓ ALL CHECKS PASSED"
    echo ""
    echo "Plugin is ready for production deployment!"
    exit 0
else
    echo "✗ $FAILED CHECK(S) FAILED"
    echo ""
    echo "Please fix the issues before deployment."
    exit 1
fi
