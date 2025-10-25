# Settings Save Issue - Debug Guide

## Problem

Settings fail to save with error: `{"success":false,"data":{"message":"Failed to save settings"}}`

## Root Cause Analysis

The error occurs when `$this->settings->update_option( $input )` returns `false`, which happens when validation fails.

**Evidence**: [includes/class-mase-admin.php:351-380]
**Evidence**: [includes/class-mase-settings.php:101-157]

## Debug Steps

### 1. Enable Debug Logging

Ensure WP_DEBUG is enabled (already done):
```bash
wp config get WP_DEBUG
# Should return: 1
```

### 2. Check Debug Log Location

```bash
# Check if debug.log exists
ls -lh wp-content/debug.log

# Watch logs in real-time
tail -f wp-content/debug.log | grep MASE
```

### 3. Try to Save Settings

1. Go to Admin Styler settings page
2. Make a change (e.g., change admin bar color)
3. Click "Save Settings"
4. Watch the debug log output

### 4. Check What's Being Logged

Look for these log entries:
- `MASE: handle_ajax_save_settings called` - Handler was triggered
- `MASE: Nonce verified` - Security check passed
- `MASE: User capability verified` - Permission check passed
- `MASE: Incoming settings keys: ...` - What data was received
- `MASE: Validation error: ...` - **THIS IS THE KEY** - shows validation failure
- `MASE: Settings save failed - validation error` - Confirms validation failed

### 5. Manual Test

Test validation directly:
```bash
wp eval '
require_once WP_PLUGIN_DIR . "/woow-admin/includes/class-mase-settings.php";
$settings = new MASE_Settings();
$test_data = array(
    "admin_bar" => array(
        "bg_color" => "#1F2937",
        "text_color" => "#F9FAFB",
        "height" => 32
    )
);
$result = $settings->validate($test_data);
if (is_wp_error($result)) {
    echo "VALIDATION FAILED\n";
    echo "Error: " . $result->get_error_message() . "\n";
    echo "Details:\n";
    print_r($result->get_error_data());
} else {
    echo "VALIDATION PASSED\n";
    echo "Validated keys: " . implode(", ", array_keys($result)) . "\n";
}
'
```

## Common Issues

### Issue 1: Validation Fails for Missing Fields

**Symptom**: Validation expects all fields but form only sends changed fields

**Solution**: Validation should merge with defaults (already implemented in line 1019 of class-mase-settings.php)

### Issue 2: Invalid Color Format

**Symptom**: Color validation fails

**Check**: Ensure colors are in format `#RRGGBB` (6 hex digits)

### Issue 3: Out of Range Values

**Symptom**: Numeric values outside allowed ranges

**Check**:
- Height: 0-500px
- Width percent: 50-100%
- Width pixels: 800-3000px
- Border radius: 0-50px
- Margins: 0-100px

### Issue 4: Invalid Enum Values

**Symptom**: String values not in allowed list

**Check**:
- `bg_type`: must be 'solid' or 'gradient'
- `gradient_type`: must be 'linear', 'radial', or 'conic'
- `width_unit`: must be 'percent' or 'pixels'
- `border_radius_mode`: must be 'uniform' or 'individual'
- `shadow_mode`: must be 'preset' or 'custom'

## Immediate Fixes Applied

### Fix #1: Enhanced Logging
Added detailed logging to `handle_ajax_save_settings()`:
- Log when handler is called
- Log nonce verification
- Log capability check
- Log incoming data keys
- Log validation failure

**File**: `includes/class-mase-admin.php` lines 351-380

### Fix #2: JSON Decoding
Added support for settings sent as JSON string:
- Check if `$_POST['settings']` is string or array
- Decode JSON if needed with `stripslashes()`
- Log the format received

**File**: `includes/class-mase-admin.php` lines 368-385

**Reason**: JavaScript may send settings as JSON string instead of array, causing PHP to receive wrong data type.

### Fix #3: Validation Error Details
Added detailed validation error logging:
- Log validation error message
- Log validation error data (specific fields that failed)
- Log validated keys on success

**File**: `includes/class-mase-settings.php` lines 101-112

## Testing the Fix

1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Open browser console (F12)
3. Go to Admin Styler settings
4. Make a change
5. Click "Save Settings"
6. Check:
   - Browser console for JavaScript errors
   - Network tab for AJAX response
   - `wp-content/debug.log` for PHP errors

## Expected Log Output (Success)

```
MASE: handle_ajax_save_settings called
MASE: Nonce verified
MASE: User capability verified
MASE: Incoming settings keys: admin_bar, admin_menu, ...
MASE: Admin bar settings keys: bg_color, text_color, height, ...
MASE: Merging settings - Existing keys: admin_bar, admin_menu, ...
MASE: Merging settings - Validated keys: admin_bar, admin_menu, ...
MASE: Merging settings - Merged keys: admin_bar, admin_menu, ...
MASE: update_option result: true
```

## Expected Log Output (Failure)

```
MASE: handle_ajax_save_settings called
MASE: Nonce verified
MASE: User capability verified
MASE: Incoming settings keys: admin_bar
MASE: Admin bar settings keys: bg_color, text_color, height
MASE: Validation error: Validation failed
MASE: Settings save failed - validation error
```

## Next Steps

1. **If nonce fails**: Check if nonce is being sent correctly from JavaScript
2. **If validation fails**: Check debug.log for specific validation errors
3. **If no logs appear**: Check if WP_DEBUG_LOG is enabled and writable

## Files Modified

1. `includes/class-mase-admin.php` - Added debug logging to AJAX handler

## Related Files

- `includes/class-mase-settings.php` - Validation logic
- `assets/js/mase-admin.js` - JavaScript that sends AJAX request
- `wp-content/debug.log` - Debug output location

## Status

🔍 **Debugging in Progress** - Waiting for log output to identify root cause
