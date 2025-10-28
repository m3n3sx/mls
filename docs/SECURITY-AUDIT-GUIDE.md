# Security Audit Guide
## Task 21.4: Security Audit

**Date:** October 23, 2025  
**Requirements:** 8.1, 8.4

---

## Overview

This guide provides comprehensive security audit procedures for the MASE plugin to ensure all security measures are properly implemented and effective.

---

## Security Requirements

### Requirement 8.1: API Security
- Automatic nonce verification
- Request timeout handling
- Response validation
- Secure communication

### Requirement 8.4: Input Validation
- All user inputs sanitized
- XSS prevention
- SQL injection prevention
- CSRF protection

---

## 1. Input Validation Audit

### 1.1 Color Input Validation

**Files to Review:**
- `assets/js/modules/color-system.js`
- `includes/class-mase-settings.php`

**Validation Checklist:**

- [ ] **Hex Color Validation**
  ```javascript
  // Check: assets/js/modules/color-system.js
  function validateHexColor(color) {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    return hexRegex.test(color);
  }
  ```
  - Verify regex pattern correct
  - Verify invalid colors rejected
  - Verify error messages displayed

- [ ] **RGB Color Validation**
  ```javascript
  function validateRgbColor(r, g, b) {
    return r >= 0 && r <= 255 &&
           g >= 0 && g <= 255 &&
           b >= 0 && b <= 255;
  }
  ```
  - Verify range checking
  - Verify type checking
  - Verify invalid values rejected

- [ ] **Server-Side Validation**
  ```php
  // Check: includes/class-mase-settings.php
  public function sanitize_color($color) {
    if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $color)) {
      return '#000000'; // Default fallback
    }
    return $color;
  }
  ```
  - Verify PHP validation matches JavaScript
  - Verify fallback values safe
  - Verify no bypass possible

**Test Cases:**

```javascript
// Valid inputs
validateHexColor('#FF0000') // Should pass
validateHexColor('#00ff00') // Should pass

// Invalid inputs
validateHexColor('red') // Should fail
validateHexColor('#FF') // Should fail
validateHexColor('#GGGGGG') // Should fail
validateHexColor('javascript:alert(1)') // Should fail
```

---

### 1.2 Typography Input Validation

**Files to Review:**
- `assets/js/modules/typography.js`
- `includes/class-mase-settings.php`

**Validation Checklist:**

- [ ] **Font Family Validation**
  ```javascript
  function validateFontFamily(font) {
    // Only allow alphanumeric, spaces, hyphens
    const fontRegex = /^[a-zA-Z0-9\s\-]+$/;
    return fontRegex.test(font);
  }
  ```
  - Verify whitelist approach
  - Verify special characters blocked
  - Verify injection attempts blocked

- [ ] **Font Size Validation**
  ```javascript
  function validateFontSize(size) {
    const num = parseInt(size, 10);
    return num >= 8 && num <= 72;
  }
  ```
  - Verify range limits
  - Verify type coercion safe
  - Verify negative values rejected

- [ ] **Line Height Validation**
  ```javascript
  function validateLineHeight(height) {
    const num = parseFloat(height);
    return num >= 1.0 && num <= 3.0;
  }
  ```
  - Verify range limits
  - Verify decimal handling
  - Verify invalid values rejected

**Test Cases:**

```javascript
// Valid inputs
validateFontFamily('Roboto') // Should pass
validateFontFamily('Open Sans') // Should pass

// Invalid inputs
validateFontFamily('<script>alert(1)</script>') // Should fail
validateFontFamily('font-family: evil') // Should fail
validateFontFamily('../../etc/passwd') // Should fail
```

---

### 1.3 Custom CSS Validation

**Files to Review:**
- `includes/class-mase-settings.php`

**Validation Checklist:**

- [ ] **Dangerous Pattern Detection**
  ```php
  public function sanitize_custom_css($css) {
    // Remove dangerous patterns
    $dangerous = [
      'javascript:',
      'expression(',
      '@import',
      'behavior:',
      '-moz-binding:',
      'vbscript:',
      'data:text/html',
    ];
    
    foreach ($dangerous as $pattern) {
      $css = str_ireplace($pattern, '', $css);
    }
    
    return wp_strip_all_tags($css);
  }
  ```
  - Verify all dangerous patterns blocked
  - Verify case-insensitive matching
  - Verify no bypass possible

- [ ] **URL Validation in CSS**
  ```php
  // Check for malicious URLs in url() functions
  if (preg_match('/url\s*\([^)]*javascript:/i', $css)) {
    // Block or sanitize
  }
  ```
  - Verify URL validation
  - Verify protocol checking
  - Verify data URIs handled safely

**Test Cases:**

```php
// Valid inputs
sanitize_custom_css('.class { color: red; }') // Should pass

// Invalid inputs
sanitize_custom_css('javascript:alert(1)') // Should be sanitized
sanitize_custom_css('expression(alert(1))') // Should be sanitized
sanitize_custom_css('@import url(evil.css)') // Should be sanitized
sanitize_custom_css('<script>alert(1)</script>') // Should be sanitized
```

---

## 2. XSS Prevention Audit

### 2.1 Output Escaping

**Files to Review:**
- `includes/admin-settings-page.php`
- All PHP files that output data

**Escaping Checklist:**

- [ ] **HTML Context**
  ```php
  // Check all instances of:
  echo esc_html($variable);
  echo esc_html__('String', 'mase');
  ```
  - Verify all user data escaped
  - Verify translations escaped
  - Verify no raw echo statements

- [ ] **Attribute Context**
  ```php
  // Check all instances of:
  echo '<input value="' . esc_attr($value) . '">';
  echo '<div class="' . esc_attr($class) . '">';
  ```
  - Verify all attributes escaped
  - Verify quotes used consistently
  - Verify no unescaped attributes

- [ ] **URL Context**
  ```php
  // Check all instances of:
  echo '<a href="' . esc_url($url) . '">';
  echo '<img src="' . esc_url($image) . '">';
  ```
  - Verify all URLs escaped
  - Verify protocol validation
  - Verify no javascript: URLs

- [ ] **JavaScript Context**
  ```php
  // Check all instances of:
  wp_localize_script('mase-admin', 'maseData', [
    'nonce' => wp_create_nonce('mase_nonce'),
    'ajaxUrl' => admin_url('admin-ajax.php'),
  ]);
  ```
  - Verify wp_localize_script used
  - Verify no inline JavaScript with PHP variables
  - Verify JSON encoding used

**Audit Script:**

```bash
#!/bin/bash
# Find potentially unsafe output

echo "Searching for unescaped output..."

# Find raw echo statements
grep -rn "echo \$" includes/ --include="*.php"

# Find raw print statements
grep -rn "print \$" includes/ --include="*.php"

# Find potential XSS in attributes
grep -rn 'value="<?php echo \$' includes/ --include="*.php"

# Find potential XSS in URLs
grep -rn 'href="<?php echo \$' includes/ --include="*.php"
```

---

### 2.2 JavaScript XSS Prevention

**Files to Review:**
- `assets/js/modules/*.js`
- `assets/js/mase-admin.js`

**Prevention Checklist:**

- [ ] **DOM Manipulation**
  ```javascript
  // Safe: textContent
  element.textContent = userInput;
  
  // Unsafe: innerHTML
  element.innerHTML = userInput; // ❌ AVOID
  ```
  - Verify textContent used instead of innerHTML
  - Verify insertAdjacentText used instead of insertAdjacentHTML
  - Verify no eval() or Function() with user input

- [ ] **jQuery Methods**
  ```javascript
  // Safe
  $element.text(userInput);
  
  // Unsafe
  $element.html(userInput); // ❌ AVOID
  ```
  - Verify .text() used instead of .html()
  - Verify .attr() used safely
  - Verify no .append() with unescaped HTML

- [ ] **Event Handlers**
  ```javascript
  // Safe
  element.addEventListener('click', handler);
  
  // Unsafe
  element.setAttribute('onclick', userInput); // ❌ AVOID
  ```
  - Verify addEventListener used
  - Verify no inline event handlers
  - Verify no eval() in event handlers

**Audit Script:**

```bash
#!/bin/bash
# Find potentially unsafe JavaScript

echo "Searching for unsafe JavaScript patterns..."

# Find innerHTML usage
grep -rn "innerHTML" assets/js/ --include="*.js"

# Find eval usage
grep -rn "eval(" assets/js/ --include="*.js"

# Find Function constructor
grep -rn "new Function" assets/js/ --include="*.js"

# Find jQuery .html() usage
grep -rn "\.html(" assets/js/ --include="*.js"
```

---

## 3. CSRF Protection Audit

### 3.1 Nonce Verification

**Files to Review:**
- `includes/class-mase-admin.php`
- `includes/class-mase-rest-api.php`

**Nonce Checklist:**

- [ ] **Nonce Generation**
  ```php
  // Check: includes/class-mase-admin.php
  public function enqueue_admin_assets() {
    wp_localize_script('mase-admin', 'maseData', [
      'nonce' => wp_create_nonce('mase_nonce'),
      'restNonce' => wp_create_nonce('wp_rest'),
    ]);
  }
  ```
  - Verify nonces created for all AJAX actions
  - Verify unique nonce names
  - Verify REST API nonce included

- [ ] **Nonce Verification (AJAX)**
  ```php
  // Check all AJAX handlers
  public function handle_save_settings() {
    check_ajax_referer('mase_nonce', 'nonce');
    
    if (!current_user_can('manage_options')) {
      wp_send_json_error('Insufficient permissions');
    }
    
    // Process request
  }
  ```
  - Verify check_ajax_referer() called first
  - Verify capability check after nonce
  - Verify early exit on failure

- [ ] **Nonce Verification (REST API)**
  ```php
  // Check: includes/class-mase-rest-api.php
  public function register_routes() {
    register_rest_route('mase/v1', '/settings', [
      'methods' => 'POST',
      'callback' => [$this, 'save_settings'],
      'permission_callback' => [$this, 'check_permissions'],
    ]);
  }
  
  public function check_permissions() {
    return current_user_can('manage_options');
  }
  ```
  - Verify permission_callback defined
  - Verify capability check correct
  - Verify nonce verified by WordPress

- [ ] **JavaScript Nonce Usage**
  ```javascript
  // Check: assets/js/modules/api-client.js
  async saveSettings(settings) {
    const response = await fetch(this.baseURL + '/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': this.nonce,
      },
      body: JSON.stringify(settings),
    });
  }
  ```
  - Verify nonce included in all requests
  - Verify nonce in correct header
  - Verify nonce refresh on expiration

**Test Cases:**

```bash
# Test nonce verification
curl -X POST http://localhost:8080/wp-json/mase/v1/settings \
  -H "Content-Type: application/json" \
  -d '{"colors":{"primary":"#ff0000"}}'
# Should fail: No nonce

curl -X POST http://localhost:8080/wp-json/mase/v1/settings \
  -H "Content-Type: application/json" \
  -H "X-WP-Nonce: invalid_nonce" \
  -d '{"colors":{"primary":"#ff0000"}}'
# Should fail: Invalid nonce

curl -X POST http://localhost:8080/wp-json/mase/v1/settings \
  -H "Content-Type: application/json" \
  -H "X-WP-Nonce: valid_nonce" \
  -d '{"colors":{"primary":"#ff0000"}}'
# Should succeed: Valid nonce
```

---

### 3.2 Capability Checks

**Files to Review:**
- All AJAX handlers
- All REST API endpoints

**Capability Checklist:**

- [ ] **Admin Page Access**
  ```php
  // Check: includes/class-mase-admin.php
  public function add_admin_menu() {
    add_menu_page(
      'MASE Settings',
      'MASE',
      'manage_options', // Required capability
      'mase-settings',
      [$this, 'render_settings_page']
    );
  }
  ```
  - Verify 'manage_options' capability required
  - Verify no lower capabilities allowed
  - Verify capability check in render function

- [ ] **AJAX Handler Capabilities**
  ```php
  public function handle_ajax_action() {
    check_ajax_referer('mase_nonce', 'nonce');
    
    if (!current_user_can('manage_options')) {
      wp_send_json_error([
        'message' => 'Insufficient permissions'
      ]);
      return;
    }
    
    // Process request
  }
  ```
  - Verify capability check in every handler
  - Verify early exit on failure
  - Verify error message appropriate

- [ ] **REST API Capabilities**
  ```php
  public function check_permissions() {
    if (!current_user_can('manage_options')) {
      return new WP_Error(
        'rest_forbidden',
        'You do not have permission to access this resource',
        ['status' => 403]
      );
    }
    return true;
  }
  ```
  - Verify permission callback defined
  - Verify appropriate capability checked
  - Verify proper error response

**Test Cases:**

```php
// Test as non-admin user
wp_set_current_user($subscriber_id);
$result = $mase_admin->handle_save_settings();
// Should fail: Insufficient permissions

// Test as admin user
wp_set_current_user($admin_id);
$result = $mase_admin->handle_save_settings();
// Should succeed: Has permissions
```

---

## 4. SQL Injection Prevention

### 4.1 Database Queries

**Files to Review:**
- `includes/class-mase-settings.php`
- `includes/class-mase-cache.php`

**SQL Safety Checklist:**

- [ ] **Prepared Statements**
  ```php
  // Safe: Using $wpdb->prepare()
  $wpdb->query($wpdb->prepare(
    "UPDATE {$wpdb->options} SET option_value = %s WHERE option_name = %s",
    $value,
    $option_name
  ));
  ```
  - Verify all queries use $wpdb->prepare()
  - Verify placeholders used correctly
  - Verify no string concatenation

- [ ] **WordPress Options API**
  ```php
  // Safe: Using WordPress functions
  update_option('mase_settings', $settings);
  get_option('mase_settings', $defaults);
  delete_option('mase_settings');
  ```
  - Verify WordPress functions used
  - Verify no direct SQL queries
  - Verify option names sanitized

- [ ] **Transients API**
  ```php
  // Safe: Using transients
  set_transient('mase_cache_' . $key, $value, $expiration);
  get_transient('mase_cache_' . $key);
  delete_transient('mase_cache_' . $key);
  ```
  - Verify transients used for caching
  - Verify keys sanitized
  - Verify no direct database access

**Audit Script:**

```bash
#!/bin/bash
# Find potentially unsafe SQL queries

echo "Searching for unsafe SQL queries..."

# Find direct SQL queries
grep -rn "\$wpdb->query(" includes/ --include="*.php" | grep -v "prepare"

# Find string concatenation in queries
grep -rn "\$wpdb->query.*\." includes/ --include="*.php"

# Find unescaped variables in queries
grep -rn "\$wpdb->query.*\$" includes/ --include="*.php" | grep -v "prepare"
```

---

## 5. File Upload Security

### 5.1 Import/Export Security

**Files to Review:**
- Import/export functionality (if implemented)

**File Upload Checklist:**

- [ ] **File Type Validation**
  ```php
  public function validate_import_file($file) {
    // Check file extension
    $allowed = ['json'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    
    if (!in_array(strtolower($ext), $allowed)) {
      return new WP_Error('invalid_file', 'Only JSON files allowed');
    }
    
    // Check MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if ($mime !== 'application/json') {
      return new WP_Error('invalid_mime', 'Invalid file type');
    }
    
    return true;
  }
  ```
  - Verify file extension checked
  - Verify MIME type checked
  - Verify both checks required

- [ ] **File Size Limits**
  ```php
  public function validate_file_size($file) {
    $max_size = 1024 * 1024; // 1 MB
    
    if ($file['size'] > $max_size) {
      return new WP_Error('file_too_large', 'File exceeds size limit');
    }
    
    return true;
  }
  ```
  - Verify size limit enforced
  - Verify limit reasonable
  - Verify error handling

- [ ] **File Content Validation**
  ```php
  public function validate_json_content($content) {
    $data = json_decode($content, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
      return new WP_Error('invalid_json', 'Invalid JSON format');
    }
    
    // Validate structure
    if (!isset($data['version']) || !isset($data['settings'])) {
      return new WP_Error('invalid_structure', 'Invalid file structure');
    }
    
    return $data;
  }
  ```
  - Verify JSON validation
  - Verify structure validation
  - Verify no code execution

---

## 6. Authentication and Authorization

### 6.1 Session Security

**Session Checklist:**

- [ ] **WordPress Session Handling**
  - Verify WordPress handles sessions
  - Verify no custom session management
  - Verify session cookies secure

- [ ] **Cookie Security**
  ```php
  // Check WordPress configuration
  define('COOKIE_DOMAIN', '.example.com');
  define('COOKIEPATH', '/');
  define('SITECOOKIEPATH', '/');
  define('ADMIN_COOKIE_PATH', '/wp-admin');
  define('PLUGINS_COOKIE_PATH', '/wp-content/plugins');
  ```
  - Verify cookies use secure flag (HTTPS)
  - Verify cookies use httponly flag
  - Verify cookies use samesite attribute

---

### 6.2 Password Security

**Password Checklist:**

- [ ] **No Password Storage**
  - Verify plugin doesn't store passwords
  - Verify plugin doesn't handle authentication
  - Verify WordPress handles all auth

- [ ] **API Key Security** (if applicable)
  - Verify API keys not in code
  - Verify API keys in wp-config.php
  - Verify API keys not in version control

---

## 7. Security Headers

### 7.1 HTTP Security Headers

**Headers Checklist:**

- [ ] **Content Security Policy**
  ```php
  // Check if CSP headers set
  header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
  ```
  - Verify CSP header present
  - Verify policy appropriate
  - Verify no unsafe-eval

- [ ] **X-Frame-Options**
  ```php
  header('X-Frame-Options: SAMEORIGIN');
  ```
  - Verify header present
  - Verify clickjacking prevention

- [ ] **X-Content-Type-Options**
  ```php
  header('X-Content-Type-Options: nosniff');
  ```
  - Verify header present
  - Verify MIME sniffing prevented

- [ ] **X-XSS-Protection**
  ```php
  header('X-XSS-Protection: 1; mode=block');
  ```
  - Verify header present
  - Verify XSS filter enabled

---

## 8. Dependency Security

### 8.1 NPM Audit

**Command:**
```bash
npm audit
```

**Expected Output:**
```
found 0 vulnerabilities
```

**If Vulnerabilities Found:**
```bash
# Review vulnerabilities
npm audit --json > audit-report.json

# Fix automatically if possible
npm audit fix

# Fix with breaking changes if needed
npm audit fix --force

# Update specific package
npm update package-name
```

---

### 8.2 Composer Audit (if using PHP dependencies)

**Command:**
```bash
composer audit
```

**Expected Output:**
```
No security vulnerability advisories found
```

---

## 9. Security Scanning Tools

### 9.1 WPScan

**Installation:**
```bash
gem install wpscan
```

**Scan Plugin:**
```bash
wpscan --url http://localhost:8080 --enumerate p --plugins-detection aggressive
```

**Expected Results:**
- No known vulnerabilities
- No outdated dependencies
- No security warnings

---

### 9.2 OWASP ZAP

**Steps:**

1. **Install OWASP ZAP**
   - Download from https://www.zaproxy.org/

2. **Configure ZAP**
   - Set target URL
   - Configure authentication
   - Set scan policy

3. **Run Automated Scan**
   - Spider the application
   - Active scan
   - Review alerts

4. **Expected Results**
   - No high-risk vulnerabilities
   - No medium-risk vulnerabilities
   - Low-risk issues documented

---

### 9.3 Snyk

**Installation:**
```bash
npm install -g snyk
```

**Scan Dependencies:**
```bash
snyk test
```

**Expected Output:**
```
✓ Tested 45 dependencies for known issues, no vulnerable paths found.
```

---

## 10. Security Checklist

### Input Validation
- [ ] All color inputs validated
- [ ] All typography inputs validated
- [ ] Custom CSS sanitized
- [ ] Numeric inputs range-checked
- [ ] String inputs length-limited

### XSS Prevention
- [ ] All output escaped (esc_html, esc_attr, esc_url)
- [ ] No innerHTML usage
- [ ] No eval() usage
- [ ] textContent used instead of innerHTML
- [ ] wp_localize_script used for data passing

### CSRF Protection
- [ ] Nonces generated for all actions
- [ ] Nonces verified in all handlers
- [ ] Capability checks in all handlers
- [ ] REST API permissions configured
- [ ] Early exit on auth failure

### SQL Injection Prevention
- [ ] All queries use $wpdb->prepare()
- [ ] WordPress Options API used
- [ ] No string concatenation in queries
- [ ] Transients used for caching

### File Upload Security
- [ ] File type validation
- [ ] MIME type validation
- [ ] File size limits
- [ ] Content validation
- [ ] No code execution

### Authentication/Authorization
- [ ] WordPress handles authentication
- [ ] manage_options capability required
- [ ] No custom session management
- [ ] Secure cookies configured

### Security Headers
- [ ] Content Security Policy
- [ ] X-Frame-Options
- [ ] X-Content-Type-Options
- [ ] X-XSS-Protection

### Dependency Security
- [ ] npm audit clean
- [ ] No known vulnerabilities
- [ ] Dependencies up to date
- [ ] Security patches applied

### Security Scanning
- [ ] WPScan clean
- [ ] OWASP ZAP clean
- [ ] Snyk clean
- [ ] No critical issues

---

## 11. Security Report Template

```markdown
# Security Audit Report

**Date:** [Date]
**Version:** [Version]
**Auditor:** [Name]

## Executive Summary

- **Overall Status:** ✅ SECURE / ⚠️ ISSUES FOUND / ❌ CRITICAL ISSUES
- **Critical Issues:** [Count]
- **High Issues:** [Count]
- **Medium Issues:** [Count]
- **Low Issues:** [Count]

## Audit Results

### 1. Input Validation
- Status: ✅ PASS / ❌ FAIL
- Issues: [Count]
- Notes: [Details]

### 2. XSS Prevention
- Status: ✅ PASS / ❌ FAIL
- Issues: [Count]
- Notes: [Details]

### 3. CSRF Protection
- Status: ✅ PASS / ❌ FAIL
- Issues: [Count]
- Notes: [Details]

### 4. SQL Injection Prevention
- Status: ✅ PASS / ❌ FAIL
- Issues: [Count]
- Notes: [Details]

### 5. Authentication/Authorization
- Status: ✅ PASS / ❌ FAIL
- Issues: [Count]
- Notes: [Details]

### 6. Dependency Security
- Status: ✅ PASS / ❌ FAIL
- Vulnerabilities: [Count]
- Notes: [Details]

## Issues Found

| ID | Severity | Category | Description | Status |
|----|----------|----------|-------------|--------|
| | | | | |

## Recommendations

1. [Recommendation 1]
2. [Recommendation 2]

## Sign-Off

- **Status:** ✅ APPROVED / ❌ REJECTED
- **Date:** [Date]
- **Signature:** [Name]
```

---

**Document Version:** 1.0  
**Last Updated:** October 23, 2025  
**Task:** 21.4 - Security audit
