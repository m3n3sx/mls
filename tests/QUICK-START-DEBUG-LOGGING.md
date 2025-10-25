# Quick Start: Debug Logging Verification

**Task 11: Verify debug logging**  
**Time Required: 5-10 minutes**

## Quick Test (No WordPress Required)

Verify that all logging code is present:

```bash
php tests/test-debug-logging-patterns.php
```

Expected output:
```
✓ All required logging patterns found in code!
```

## Full Test (Requires WordPress)

### Step 1: Enable Debug Logging

Edit `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### Step 2: Clear Debug Log

```bash
> wp-content/debug.log
```

### Step 3: Generate Logs

1. Go to WordPress admin
2. Navigate to MASE settings
3. Click "Save Settings"

### Step 4: Run Verification

```bash
./tests/run-debug-logging-verification.sh
```

## What Gets Verified

✓ **Requirement 5.1**: POST data keys and settings size logged  
✓ **Requirement 5.2**: JSON decode success/failure logged  
✓ **Requirement 5.3**: Sections being validated logged  
✓ **Requirement 5.4**: Validation pass/fail status logged  
✓ **Requirement 5.5**: Validation error messages logged  

## Expected Log Messages

```
MASE: POST keys: nonce, action, settings
MASE: POST settings size: 12345 bytes (12.06 KB)
MASE: JSON decoded successfully
MASE: Decoded sections: admin_bar, admin_menu, content
MASE: Sections to validate: admin_bar, admin_menu, content
MASE: Calling update_option...
MASE: update_option called with sections: admin_bar, admin_menu, content
MASE: Validation status: PASSED
MASE: update_option() result: SUCCESS (true)
MASE: Settings saved successfully
```

## Troubleshooting

**No debug.log file?**
- Enable WP_DEBUG_LOG in wp-config.php
- Save settings at least once

**Missing log messages?**
- Ensure tasks 1-10 are implemented
- Clear debug.log and save again

**Test fails?**
- Check file permissions on wp-content
- Verify plugin is active
- Review actual debug.log contents

## Manual Verification

```bash
# View MASE logs
grep "MASE:" wp-content/debug.log | tail -20

# Check specific requirement
grep "MASE: POST keys:" wp-content/debug.log
grep "MASE: Validation status:" wp-content/debug.log
```

## Success Criteria

- ✓ Pattern test passes (20/20 tests)
- ✓ Full test passes (15/15 tests)
- ✓ All requirements 5.1-5.5 verified
- ✓ Log messages are clear and actionable
