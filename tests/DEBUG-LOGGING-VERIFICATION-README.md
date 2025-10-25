# Debug Logging Verification Test

**Task 11: Verify debug logging**  
**Requirements: 5.1, 5.2, 5.3, 5.4, 5.5**

## Overview

This test verifies that all expected log messages appear in `debug.log` when WP_DEBUG is enabled and settings are saved. It ensures comprehensive logging for debugging settings save issues.

## Requirements Tested

### Requirement 5.1: Log POST Data Keys and Settings Size
- ✓ Logs incoming POST data keys
- ✓ Logs settings data size in kilobytes
- ✓ Logs section sizes individually

### Requirement 5.2: Log JSON Decode Success/Failure
- ✓ Logs when JSON decoding succeeds
- ✓ Logs specific JSON error message when decoding fails
- ✓ Logs JSON error code

### Requirement 5.3: Log Sections Being Validated
- ✓ Logs sections before calling validate()
- ✓ Logs sections in update_option()
- ✓ Logs decoded sections after JSON parsing

### Requirement 5.4: Log Validation Pass/Fail Status
- ✓ Logs "Validation status: PASSED" when validation succeeds
- ✓ Logs "Validation status: FAILED" when validation fails
- ✓ Logs update_option() result (SUCCESS/FAILED)

### Requirement 5.5: Log Validation Error Messages
- ✓ Logs all validation error messages with field names
- ✓ Logs total validation error count
- ✓ Logs each field error individually

## Setup Instructions

### 1. Enable WordPress Debug Logging

Edit `wp-config.php` and add these lines before `/* That's all, stop editing! */`:

```php
// Enable debug logging
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
@ini_set('display_errors', 0);
```

### 2. Clear Existing Debug Log (Optional)

```bash
rm wp-content/debug.log
```

### 3. Generate Log Entries

1. Go to WordPress admin
2. Navigate to MASE settings page
3. Make a change to any setting
4. Click "Save Settings"
5. Verify you see "Settings saved successfully" message

## Running the Test

### Option 1: Using Shell Script (Recommended)

```bash
cd /path/to/wp-content/plugins/modern-admin-styler
./tests/run-debug-logging-verification.sh
```

The script will:
- Check if WP_DEBUG is enabled
- Check if debug.log exists
- Optionally clear debug.log before testing
- Run the verification test
- Display detailed results

### Option 2: Direct PHP Execution

```bash
cd /path/to/wp-content/plugins/modern-admin-styler
php tests/test-debug-logging-verification.php
```

## Expected Output

### Successful Test Run

```
===========================================
Debug Logging Verification Test
Task 11 - Requirements 5.1, 5.2, 5.3, 5.4, 5.5
===========================================

✓ PASS: Debug log file exists and readable
✓ PASS: Read debug log contents

--- Testing Requirement 5.1: Log POST data keys and settings size ---
✓ PASS: Requirement 5.1: Logs POST data keys
✓ PASS: Requirement 5.1: Logs settings data size in kilobytes

--- Testing Requirement 5.2: Log JSON decode success/failure ---
✓ PASS: Requirement 5.2: Logs JSON decode success

--- Testing Requirement 5.3: Log sections being validated ---
✓ PASS: Requirement 5.3: Logs sections being validated before validate() call
✓ PASS: Requirement 5.3: Logs sections in update_option()

--- Testing Requirement 5.4: Log validation pass/fail status ---
✓ PASS: Requirement 5.4: Logs validation passed status

--- Testing Requirement 5.5: Log validation error messages ---
✓ PASS: Requirement 5.5: Validation error logging

--- Testing Additional Logging ---
✓ PASS: Additional: Logs before calling update_option()
✓ PASS: Additional: Logs update_option() result
✓ PASS: Additional: Logs successful save completion

===========================================
Test Summary
===========================================
Total Tests: 15
Passed: 15
Failed: 0
Success Rate: 100.00%

✓ All debug logging tests passed!
```

## Log Messages Verified

### POST Data Logging (Requirement 5.1)
```
MASE: POST keys: nonce, action, settings
MASE: POST settings size: 12345 bytes (12.06 KB)
MASE: Section "admin_bar" size: 2.34 KB
```

### JSON Decode Logging (Requirement 5.2)
```
MASE: JSON decoded successfully
MASE: Decoded sections: admin_bar, admin_menu, content, typography
```

Or on error:
```
MASE: JSON decode error: Syntax error
MASE: JSON error code: 4
```

### Validation Logging (Requirement 5.3)
```
MASE: Sections to validate: admin_bar, admin_menu, content
MASE: update_option called with sections: admin_bar, admin_menu, content
```

### Validation Status Logging (Requirement 5.4)
```
MASE: Validation status: PASSED
MASE: update_option() result: SUCCESS (true)
```

Or on failure:
```
MASE: Validation status: FAILED
MASE: Validation failed - Validation failed
```

### Validation Error Logging (Requirement 5.5)
```
MASE: Total validation errors: 2
MASE: Validation error - admin_bar_bg_color: Invalid hex color format
MASE: Validation error - admin_menu_width: Width must be between 100 and 400
```

## Troubleshooting

### Test Fails: "Debug log file not found"

**Solution:**
1. Verify WP_DEBUG_LOG is enabled in wp-config.php
2. Check file permissions on wp-content directory
3. Save settings at least once to generate the log file

### Test Fails: "Missing log messages"

**Solution:**
1. Ensure all tasks 1-10 are implemented
2. Clear debug.log and save settings again
3. Check that you're testing the correct WordPress installation
4. Verify the plugin is active

### Test Fails: "Neither success nor error message found"

**Solution:**
1. The log may be from an old version without logging
2. Clear debug.log completely
3. Save settings to generate fresh logs
4. Re-run the test

### Log File Too Large

**Solution:**
```bash
# Backup current log
cp wp-content/debug.log wp-content/debug.log.backup

# Clear log
> wp-content/debug.log

# Save settings to generate fresh logs
# Then run test
```

## Manual Verification

If automated test fails, manually verify log messages:

```bash
# View recent MASE log entries
grep "MASE:" wp-content/debug.log | tail -50

# Check for specific requirement
grep "MASE: POST keys:" wp-content/debug.log
grep "MASE: JSON decoded" wp-content/debug.log
grep "MASE: Validation status:" wp-content/debug.log
```

## Integration with Other Tests

This test should be run after:
- Task 1: JavaScript initialization diagnostics
- Task 2: Validation error return
- Task 3: Mobile optimizer error handling
- Task 4: AJAX error response handling
- Task 5: Frontend error display
- Task 6: Comprehensive save debugging logs

## Success Criteria

All tests must pass with:
- ✓ All 5 requirements verified (5.1-5.5)
- ✓ Log messages include relevant data
- ✓ Log messages are clear and actionable
- ✓ No missing or incomplete log entries

## Files Modified

This test verifies logging in:
- `includes/class-mase-admin.php` - AJAX handler logging
- `includes/class-mase-settings.php` - Validation and save logging

## Related Documentation

- [Requirements Document](.kiro/specs/settings-save-fix/requirements.md)
- [Design Document](.kiro/specs/settings-save-fix/design.md)
- [Tasks Document](.kiro/specs/settings-save-fix/tasks.md)
- [Settings Save Debug Guide](../docs/SETTINGS-SAVE-DEBUG-GUIDE.md)
