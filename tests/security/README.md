# MASE Security Testing Suite

Comprehensive security testing for Modern Admin Styler Enterprise (MASE) plugin.

## Overview

This directory contains security audit tools, test files, and documentation for verifying that MASE meets all security requirements.

## Requirements Covered

- **11.1** - AJAX requests include WordPress nonce
- **11.2** - Server verifies nonce before processing
- **11.3** - Server checks user capabilities
- **14.1** - All inputs are validated
- **14.2** - Invalid inputs are rejected
- **14.3** - All outputs are escaped
- **14.4** - Custom CSS is sanitized with wp_kses_post()
- **14.5** - Protection against SQL injection, XSS, and CSRF

## Files

### Test Files
- `test-security-audit.php` - Automated security audit script
- `test-xss-vectors.html` - XSS vulnerability testing interface
- `test-csrf-protection.html` - CSRF protection testing interface

### Documentation
- `SECURITY-AUDIT-REPORT.md` - Complete security audit report
- `QUICK-START.md` - Quick start guide for running tests
- `VERIFICATION-CHECKLIST.md` - Detailed verification checklist
- `README.md` - This file

## Quick Start

### Run Automated Tests

**Option 1: Via Browser**
```
Navigate to: /wp-admin/admin.php?page=mase-settings&run_security_audit=1
```

**Option 2: Via Command Line**
```bash
cd /path/to/wordpress/wp-content/plugins/woow-admin
php tests/security/test-security-audit.php
```

### Run Manual Tests

1. **XSS Testing**
   - Open `test-xss-vectors.html` in browser
   - Follow testing instructions
   - Try each XSS payload

2. **CSRF Testing**
   - Open `test-csrf-protection.html` in browser
   - Click "Run Test" buttons
   - Verify protection is working

## Test Categories

### 1. AJAX Security
- Nonce verification
- Capability checks
- Error handling
- Response validation

### 2. Input Validation
- Color validation
- Numeric validation
- Text sanitization
- Range checking
- Type validation

### 3. Output Escaping
- HTML escaping
- Attribute escaping
- URL escaping
- JavaScript escaping

### 4. SQL Injection Prevention
- Options API usage
- No direct SQL queries
- Prepared statements (if needed)

### 5. XSS Prevention
- Input sanitization
- Output escaping
- Safe JavaScript practices
- Content Security Policy

### 6. CSRF Prevention
- Nonce generation
- Nonce verification
- POST-only state changes
- Referer checking

## Expected Results

All tests should pass with these results:

```
✓ PASS: All AJAX endpoints verify nonces
✓ PASS: All AJAX endpoints check capabilities
✓ PASS: All inputs are validated
✓ PASS: All outputs are escaped
✓ PASS: Custom CSS is sanitized
✓ PASS: No SQL injection vulnerabilities
✓ PASS: No XSS vulnerabilities
✓ PASS: No CSRF vulnerabilities
```

**Security Score: 100%** ✓

## Test Execution Flow

```
1. Pre-Audit Setup
   ├── Enable WP_DEBUG
   ├── Create test users
   └── Prepare test environment

2. Automated Tests
   ├── Run test-security-audit.php
   ├── Review results
   └── Document findings

3. Manual Tests
   ├── XSS vector testing
   ├── CSRF protection testing
   └── Capability bypass attempts

4. Verification
   ├── Complete checklist
   ├── Calculate security score
   └── Generate report

5. Sign-off
   ├── Review all findings
   ├── Approve for production
   └── Schedule next audit
```

## Security Testing Best Practices

### Do's
✓ Test in development environment first  
✓ Document all findings  
✓ Retest after fixes  
✓ Keep test data separate from production  
✓ Use realistic test scenarios  
✓ Test with different user roles  
✓ Test edge cases and boundary conditions  

### Don'ts
✗ Don't test on production sites  
✗ Don't skip manual verification  
✗ Don't ignore warnings  
✗ Don't test with real user data  
✗ Don't share security findings publicly  
✗ Don't assume automated tests catch everything  

## Common Vulnerabilities Tested

### OWASP Top 10 (2021)
1. **A01: Broken Access Control** - Capability checks
2. **A03: Injection** - SQL injection, XSS
3. **A05: Security Misconfiguration** - Secure defaults
4. **A07: Authentication Failures** - Nonce verification
5. **A08: Software and Data Integrity** - CSRF protection

### WordPress-Specific
- Nonce verification
- Capability checks
- Data validation
- Data sanitization
- Output escaping
- SQL injection via $wpdb
- File inclusion
- Direct file access

## Troubleshooting

### Tests Failing?

1. **Check WordPress Version**
   - Requires WordPress 5.0+
   - Some functions may not exist in older versions

2. **Check PHP Version**
   - Requires PHP 7.4+
   - Some syntax may not work in older versions

3. **Check File Permissions**
   - Test files must be readable
   - Plugin files must be readable

4. **Check WP_DEBUG**
   - Enable WP_DEBUG for detailed errors
   - Check debug.log for error messages

### Common Issues

**Issue: "Nonce verification failed"**
- Check nonce is being generated
- Check nonce is being passed in AJAX request
- Check nonce name matches

**Issue: "Capability check failed"**
- Check user has manage_options capability
- Check capability check is after nonce verification
- Check user is logged in

**Issue: "XSS test passed (bad)"**
- Check wp_kses_post() is being used
- Check output is being escaped
- Check JavaScript is safe

## Security Audit Schedule

- **Initial Audit:** Before v1.2.0 release
- **Regular Audits:** Every 6 months
- **Emergency Audits:** After security incidents
- **Pre-Release Audits:** Before major version releases

## Reporting Security Issues

If you find a security vulnerability:

1. **Do NOT** create a public issue
2. Email security team privately
3. Include:
   - Detailed description
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
4. Wait for security patch before disclosure

## Resources

### WordPress Security
- [WordPress Plugin Security](https://developer.wordpress.org/plugins/security/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [Data Validation](https://developer.wordpress.org/plugins/security/data-validation/)
- [Securing Input](https://developer.wordpress.org/plugins/security/securing-input/)
- [Securing Output](https://developer.wordpress.org/plugins/security/securing-output/)

### OWASP
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

### Tools
- [WPScan](https://wpscan.com/) - WordPress security scanner
- [Sucuri SiteCheck](https://sitecheck.sucuri.net/) - Website security scanner
- [OWASP ZAP](https://www.zaproxy.org/) - Web application security scanner

## License

These security tests are part of the MASE plugin and are licensed under GPL v2 or later.

## Support

For security-related questions or concerns:
- Email: security@example.com
- Documentation: See SECURITY-AUDIT-REPORT.md
- Issues: Private security disclosure only

---

**Last Updated:** 2025-01-18  
**Version:** 1.0.0  
**Maintainer:** MASE Security Team
