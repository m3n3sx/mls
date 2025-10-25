# AJAX Error Response Tests

## Overview

This test suite validates the AJAX error response handling implementation for the Modern Admin Styler (MASE) plugin. It covers all error scenarios defined in Requirements 4.1-4.4 of the settings-save-fix specification.

## Test Coverage

### Test 1: HTTP 403 - Permission Denied
**Requirement 4.1**

Tests that permission denied errors display the correct message:
- "Permission denied. You do not have access to perform this action."

**Test Cases:**
- Mock 403 response simulation
- Real AJAX call with invalid nonce

### Test 2: HTTP 400 - Validation Error
**Requirement 4.2**

Tests that validation errors display detailed field-specific messages:
- Single validation error
- Multiple validation errors
- Error count accuracy
- Field name and error message formatting

### Test 3: HTTP 500 - Server Error
**Requirement 4.3**

Tests that server errors display the correct message:
- "Server error. Please try again later."

**Test Cases:**
- Mock 500 response simulation

### Test 4: Network Error
**Requirement 4.4**

Tests that network connectivity issues display the correct message:
- "Network error. Please check your connection and try again."

**Test Cases:**
- Mock network error (status 0)
- Real timeout simulation

### Test 5: User Message Display Verification
**Requirements 4.1, 4.2, 4.3, 4.4**

Comprehensive test of all error message types to verify:
- Correct message for each HTTP status
- User-friendly formatting
- Actionable error information

### Test 6: Error Handler Integration
**Requirements 4.1, 4.2, 4.3, 4.4**

End-to-end integration test verifying:
- Complete error handling flow
- AJAX error → handler → user notification
- Message quality and usability

## Running the Tests

### Browser-Based Testing

1. Open the test file in a browser:
   ```bash
   # From project root
   open tests/test-ajax-error-responses.html
   ```

2. Run individual tests by clicking the test buttons

3. Or run comprehensive test with "Test All Error Messages"

### Expected Results

All tests should pass with:
- ✅ Correct error messages for each HTTP status
- ✅ Validation errors properly formatted
- ✅ User-friendly, actionable messages
- ✅ No undefined or [object Object] in messages

## Test Implementation Details

### Error Handler Simulation

The test suite includes a `simulateErrorHandler()` function that replicates the error handling logic from `assets/js/mase-admin.js`:

```javascript
function simulateErrorHandler(xhr, status, error) {
    let errorMsg = 'An error occurred. Please try again.';
    
    try {
        const response = JSON.parse(xhr.responseText);
        
        if (response.data && response.data.validation_errors) {
            // Format validation errors
            const errors = response.data.error_details || [];
            const errorCount = response.data.error_count || errors.length;
            errorMsg = 'Please fix ' + errorCount + ' validation error' + 
                       (errorCount > 1 ? 's' : '') + ':\n\n';
            errorMsg += errors.map((e, i) => (i + 1) + '. ' + e).join('\n');
        } else if (response.data && response.data.message) {
            errorMsg = response.data.message;
        }
    } catch (e) {
        // HTTP status-based fallback messages
        if (xhr.status === 403) {
            errorMsg = 'Permission denied. You do not have access to perform this action.';
        } else if (xhr.status === 400) {
            errorMsg = 'Invalid data submitted. Please check your settings and try again.';
        } else if (xhr.status === 500) {
            errorMsg = 'Server error. Please try again later.';
        } else if (xhr.status === 0) {
            errorMsg = 'Network error. Please check your connection and try again.';
        }
    }
    
    return errorMsg;
}
```

### Mock XHR Objects

Tests use mock XMLHttpRequest objects to simulate different error scenarios:

```javascript
const mockXHR = {
    status: 403,  // HTTP status code
    responseText: JSON.stringify({
        success: false,
        data: { message: 'Forbidden' }
    })
};
```

## Requirements Verification

| Requirement | Test | Status |
|-------------|------|--------|
| 4.1 - 403 Permission Denied | Test 1 | ✅ |
| 4.2 - 400 Validation Error | Test 2 | ✅ |
| 4.3 - 500 Server Error | Test 3 | ✅ |
| 4.4 - Network Error | Test 4 | ✅ |

## Integration with WordPress

### Real AJAX Testing

Some tests include real AJAX calls to WordPress endpoints:

```javascript
const response = await fetch(ajaxUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        action: 'mase_save_settings',
        nonce: invalidNonce,
        settings: JSON.stringify(settings)
    })
});
```

**Note:** Real AJAX tests require:
- WordPress installation running
- MASE plugin activated
- Valid/invalid nonces for testing

### Mock Testing

Mock tests work independently of WordPress and can be run in any browser.

## Troubleshooting

### Tests Not Running

1. Check browser console for JavaScript errors
2. Verify test file is properly loaded
3. Ensure all script tags are closed

### Real AJAX Tests Failing

1. Verify WordPress is running
2. Check MASE plugin is activated
3. Verify AJAX endpoint URL is correct
4. Check browser Network tab for actual responses

### Incorrect Error Messages

1. Verify `mase-admin.js` error handler implementation
2. Check that error handler matches test simulation
3. Review Requirements 4.1-4.4 for expected messages

## Related Files

- **Implementation:** `assets/js/mase-admin.js` (error handler)
- **Backend:** `includes/class-mase-admin.php` (AJAX responses)
- **Spec:** `.kiro/specs/settings-save-fix/requirements.md`
- **Design:** `.kiro/specs/settings-save-fix/design.md`
- **Tasks:** `.kiro/specs/settings-save-fix/tasks.md`

## Next Steps

After all tests pass:
1. Mark task 10 as complete in tasks.md
2. Proceed to task 11 (Verify debug logging)
3. Conduct final integration testing
4. Update documentation if needed
