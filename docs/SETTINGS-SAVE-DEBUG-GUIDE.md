# Settings Save Debug Guide

## Overview

Enhanced debugging has been added to diagnose Error 400 issues when saving MASE settings.

## What Was Added

### JavaScript Debugging (assets/js/mase-admin.js)

**Location:** Line ~6251

**Features:**
- JSON size validation (1MB limit)
- Size reporting in KB and bytes
- Section listing
- Early error detection before AJAX call

**Console Output:**
```
MASE: Sending AJAX request - Save Settings
MASE: JSON size: 45.23 KB (46315 bytes)
MASE: Form data sections: master, admin_bar, admin_menu, typography, visual_effects, performance, advanced
```

**Size Limit Protection:**
```
MASE: Settings data too large: 1.2 MB
Error: Settings data too large (1.2 MB). Please reduce custom CSS or other large fields.
```

### PHP Debugging (includes/class-mase-admin.php)

**Location:** Line ~402

**Features:**
- POST data size logging
- JSON decode validation
- Section size breakdown
- Validation error details

**debug.log Output:**
```
=== MASE: Save Settings Debug ===
MASE: POST keys: action, nonce, settings
MASE: POST settings size: 46315 bytes (45.23 KB)
MASE: POST settings preview (first 200 chars): {"master":{"enable":true},"admin_bar":{"bg_color":"#1F2937"...
MASE: JSON decoded successfully
MASE: Decoded sections: master, admin_bar, admin_menu, typography, visual_effects
MASE: Section "admin_bar" size: 2.34 KB
MASE: Section "admin_menu" size: 15.67 KB
MASE: Section "typography" size: 8.45 KB
```

### Settings Validation Debugging (includes/class-mase-settings.php)

**Location:** Line ~107

**Features:**
- Input section logging
- Validation error details
- Validated section confirmation

**debug.log Output:**
```
MASE: update_option called with sections: master, admin_bar, admin_menu
MASE: Validation passed, validated sections: master, admin_bar, admin_menu
MASE: Settings saved successfully
```

## How to Use

### 1. Enable WordPress Debug Logging

Add to `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### 2. Open Browser DevTools

- Chrome/Edge: F12 or Ctrl+Shift+I
- Firefox: F12 or Ctrl+Shift+K
- Safari: Cmd+Option+I

### 3. Reproduce the Issue

1. Go to MASE settings page
2. Make changes to settings
3. Click "Save Settings"
4. Watch browser console for JavaScript logs
5. Check `wp-content/debug.log` for PHP logs

### 4. Run Debug Test Page

Open in WordPress admin:
```
/wp-content/plugins/modern-admin-styler/test-save-settings-debug.html
```

This page provides:
- Small settings test (should pass)
- Large settings test (size validation)
- Invalid JSON test (error handling)

## Interpreting Results

### Scenario 1: JSON Too Large

**Console:**
```
MASE: JSON size: 1.2 MB
Error: Settings data too large
```

**Solution:**
- Reduce custom CSS in Advanced tab
- Remove unused Google Fonts
- Clear backup history

### Scenario 2: JSON Parse Error

**debug.log:**
```
MASE: JSON decode error: Syntax error
MASE: JSON error code: 4
```

**Solution:**
- Check for special characters in text fields
- Verify color picker values are valid hex
- Look for unescaped quotes in custom CSS

### Scenario 3: Validation Error

**debug.log:**
```
MASE: Validation error: Invalid hex color format
MASE: Validation errors: Array
(
    [admin_bar_bg_color] => Invalid hex color format
)
```

**Solution:**
- Fix the specific field mentioned
- Verify value is in correct format
- Check field constraints (min/max values)

### Scenario 4: PHP Limits Exceeded

**debug.log:**
```
MASE: POST settings size: 8388608 bytes (8 MB)
PHP Fatal error: Allowed memory size exhausted
```

**Solution:**
Increase PHP limits in `wp-config.php`:
```php
@ini_set('memory_limit', '256M');
@ini_set('post_max_size', '64M');
@ini_set('upload_max_filesize', '64M');
```

Or in `.htaccess`:
```apache
php_value memory_limit 256M
php_value post_max_size 64M
php_value upload_max_filesize 64M
```

### Scenario 5: max_input_vars Exceeded

**Symptoms:**
- Some settings not saved
- Partial data in debug.log

**Solution:**
Increase in `php.ini` or `.htaccess`:
```
php_value max_input_vars 3000
```

Note: MASE sends settings as JSON string to avoid this issue, but other POST params may still hit the limit.

## Common Issues and Solutions

### Issue: "Invalid nonce" Error

**Cause:** Session expired or cache issue

**Solution:**
1. Refresh the page
2. Clear browser cache
3. Check if caching plugin is interfering

### Issue: "Unauthorized access" Error

**Cause:** User doesn't have manage_options capability

**Solution:**
1. Verify user is Administrator
2. Check if role was modified by security plugin
3. Temporarily disable security plugins

### Issue: Settings Save but Don't Apply

**Cause:** Cache not invalidated

**debug.log should show:**
```
MASE: Settings saved successfully
```

**Solution:**
1. Clear WordPress object cache
2. Clear browser cache
3. Regenerate CSS (save settings again)

## Debug Checklist

When reporting issues, provide:

- [ ] Browser console output (full log)
- [ ] wp-content/debug.log excerpt (last 100 lines)
- [ ] JSON size from console
- [ ] Section sizes from debug.log
- [ ] PHP version and limits (from phpinfo)
- [ ] WordPress version
- [ ] Active plugins list
- [ ] Theme name

## Removing Debug Code

Once issue is resolved, you can:

1. **Keep it:** Debug code only logs when WP_DEBUG is enabled
2. **Remove it:** Revert changes to original code
3. **Disable logging:** Set `WP_DEBUG_LOG` to `false`

## Performance Impact

**Minimal:**
- JavaScript: ~5ms overhead for JSON.stringify
- PHP: ~10ms overhead for logging
- Only active when WP_DEBUG is enabled
- No impact on production sites

## Next Steps

If debugging reveals:

1. **JSON too large:** Implement section-based saving (Long-Term Fix)
2. **Specific field issues:** Fix field validation or collection
3. **PHP limits:** Document required server configuration
4. **Browser issues:** Add browser-specific handling

## Support

If issue persists after debugging:

1. Collect all debug output
2. Note exact steps to reproduce
3. Include server environment details
4. Create detailed bug report
