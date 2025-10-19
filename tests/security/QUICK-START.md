# Security Audit Quick Start Guide

## Overview

This guide helps you quickly run security tests on the MASE plugin to verify all security requirements are met.

## Requirements

- WordPress 5.0+
- PHP 7.4+
- MASE plugin installed and activated
- Administrator access

## Quick Test (5 minutes)

### 1. Run Automated Security Audit

**Option A: Via Browser**
```
Navigate to: /wp-admin/admin.php?page=mase-settings&run_security_audit=1
```

**Option B: Via Command Line**
```bash
cd /path/to/wordpress/wp-content/plugins/woow-admin
php tests/security/test-security-audit.php
```

### 2. Check Results

Look for the security score at the bottom of the report:
- **90-100%**: Excellent - All tests passed
- **70-89%**: Good - Minor issues found
- **50-69%**: Fair - Some issues need attention
- **Below 50%**: Poor - Critical issues found

### 3. Review Failures

If any tests fail, check the detailed output for:
- Which endpoint failed
- What security check failed
- Recommended fix

## Comprehensive Test (30 minutes)

### 1. AJAX Nonce Verification

```bash
# Test all AJAX endpoints have nonce checks
grep -r "check_ajax_referer" includes/
```

Expected: Should find nonce checks in all AJAX handlers.

### 2. Capability Checks

```bash
# Test all AJAX endpoints check capabilities
grep -r "current_user_can" includes/
```

Expected: Should find capability checks in all AJAX handlers.

### 3. Input Validation

```bash
# Test input sanitization
grep -r "sanitize_" includes/class-mase-settings.php
```

Expected: Should find multiple sanitization functions.

### 4. Output Escaping

```bash
# Test output escaping in templates
grep -r "esc_" includes/admin-settings-page.php
```

Expected: Should find esc_html, esc_attr, esc_url usage.

### 5. XSS Testing

1. Open `tests/security/test-xss-vectors.html` in browser
2. Try each XSS payload in the Custom CSS field
3. Verify no JavaScript executes

### 6. CSRF Testing

1. Open `tests/security/test-csrf-protection.html` in browser
2. Click "Run Test" buttons
3. Verify all requests without nonces are rejected

### 7. SQL Injection Testing

```bash
# Verify no direct SQL queries
grep -r "\$wpdb->query" includes/
```

Expected: Should find no results (plugin uses Options API).

## Manual Verification Checklist

### AJAX Security
- [ ] Open browser DevTools Network tab
- [ ] Navigate to MASE settings page
- [ ] Save settings
- [ ] Verify nonce is sent in request
- [ ] Verify response is successful
- [ ] Try request without nonce (should fail)

### Input Validation
- [ ] Try entering invalid hex color (e.g., "invalid")
- [ ] Try entering out-of-range number (e.g., 9999)
- [ ] Try entering script tags in Custom CSS
- [ ] Verify all invalid inputs are rejected

### Output Escaping
- [ ] View page source
- [ ] Search for user-generated content
- [ ] Verify all content is properly escaped
- [ ] No raw HTML from user input

### Capability Checks
- [ ] Log in as Editor (not Administrator)
- [ ] Try to access MASE settings page
- [ ] Should see "You do not have sufficient permissions"

## Common Issues and Fixes

### Issue: Nonce Verification Failing

**Symptom:** AJAX requests return 403 error

**Check:**
```php
// In class-mase-admin.php
if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
    wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
}
```

**Fix:** Ensure nonce is passed in AJAX request:
```javascript
data: {
    action: 'mase_save_settings',
    nonce: maseAdmin.nonce,
    settings: settings
}
```

### Issue: Capability Check Failing

**Symptom:** Unauthorized users can access settings

**Check:**
```php
if ( ! current_user_can( 'manage_options' ) ) {
    wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
}
```

**Fix:** Add capability check after nonce verification in all AJAX handlers.

### Issue: XSS Vulnerability

**Symptom:** JavaScript executes from user input

**Check:**
```php
// Custom CSS should be sanitized
$validated['advanced']['custom_css'] = wp_kses_post( $input['advanced']['custom_css'] );
```

**Fix:** Use `wp_kses_post()` for HTML content, `sanitize_text_field()` for plain text.

### Issue: SQL Injection

**Symptom:** Direct SQL queries with user input

**Check:**
```php
// BAD - Don't do this
$wpdb->query( "SELECT * FROM table WHERE id = " . $_POST['id'] );

// GOOD - Use Options API
get_option( 'mase_settings' );
update_option( 'mase_settings', $validated_data );
```

**Fix:** Always use WordPress Options API or prepared statements.

## Automated Testing Script

Create a simple test runner:

```bash
#!/bin/bash
# tests/security/run-security-tests.sh

echo "Running MASE Security Tests..."
echo "=============================="

# Test 1: Nonce verification
echo "Test 1: Checking nonce verification..."
if grep -q "check_ajax_referer" includes/class-mase-admin.php; then
    echo "✓ PASS: Nonce verification found"
else
    echo "✗ FAIL: Nonce verification missing"
fi

# Test 2: Capability checks
echo "Test 2: Checking capability checks..."
if grep -q "current_user_can" includes/class-mase-admin.php; then
    echo "✓ PASS: Capability checks found"
else
    echo "✗ FAIL: Capability checks missing"
fi

# Test 3: Input sanitization
echo "Test 3: Checking input sanitization..."
if grep -q "sanitize_" includes/class-mase-settings.php; then
    echo "✓ PASS: Input sanitization found"
else
    echo "✗ FAIL: Input sanitization missing"
fi

# Test 4: Output escaping
echo "Test 4: Checking output escaping..."
if grep -q "esc_" includes/admin-settings-page.php; then
    echo "✓ PASS: Output escaping found"
else
    echo "✗ FAIL: Output escaping missing"
fi

# Test 5: Custom CSS sanitization
echo "Test 5: Checking custom CSS sanitization..."
if grep -q "wp_kses_post" includes/class-mase-settings.php; then
    echo "✓ PASS: Custom CSS sanitization found"
else
    echo "✗ FAIL: Custom CSS sanitization missing"
fi

echo "=============================="
echo "Security tests complete!"
```

Make it executable:
```bash
chmod +x tests/security/run-security-tests.sh
./tests/security/run-security-tests.sh
```

## Expected Results

All tests should pass with these results:

```
✓ PASS: Nonce verification found
✓ PASS: Capability checks found
✓ PASS: Input sanitization found
✓ PASS: Output escaping found
✓ PASS: Custom CSS sanitization found
✓ PASS: No SQL injection vulnerabilities
✓ PASS: No XSS vulnerabilities
✓ PASS: No CSRF vulnerabilities
```

**Security Score: 100%** ✓

## Next Steps

1. Review the full security audit report: `SECURITY-AUDIT-REPORT.md`
2. Check the verification checklist: `VERIFICATION-CHECKLIST.md`
3. Run manual XSS tests: `test-xss-vectors.html`
4. Run manual CSRF tests: `test-csrf-protection.html`
5. Document any findings
6. Schedule next security audit (recommended: every 6 months)

## Support

If you find any security issues:

1. Do NOT post publicly
2. Email security team privately
3. Include detailed reproduction steps
4. Wait for security patch before disclosure

## References

- [WordPress Plugin Security Best Practices](https://developer.wordpress.org/plugins/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/)
