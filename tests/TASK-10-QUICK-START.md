# Task 10: Security and Error Handling Tests - Quick Start Guide

## Overview
This guide provides step-by-step instructions for running security and error handling tests for the template system.

## Prerequisites
- Web browser (Chrome, Firefox, Safari, or Edge)
- No server required - tests run in standalone HTML file

## Quick Start

### 1. Open the Test File
```bash
# Navigate to the tests directory
cd tests/

# Open the test file in your browser
# Option 1: Double-click the file
# Option 2: Use command line
open test-task-10-security-error-handling.html  # macOS
xdg-open test-task-10-security-error-handling.html  # Linux
start test-task-10-security-error-handling.html  # Windows
```

### 2. Run Test 10.1: Nonce Verification
**Goal**: Verify that invalid nonce triggers 403 error

1. Locate the "Subtask 10.1: Test Nonce Verification" section
2. Click the **"Corrupt Nonce"** button
3. Observe the nonce value change to "corrupted-nonce-invalid"
4. Click the **"Apply"** button on the Professional Blue template card
5. Confirm the dialog that appears
6. **Verify**:
   - ✅ Error notification appears with security error message
   - ✅ Console log shows "403" status code
   - ✅ Button returns to enabled state
   - ✅ Card opacity returns to normal
7. Check off items in the verification checklist
8. Click **"Restore Nonce"** to reset for other tests

### 3. Run Test 10.2: Permission Check
**Goal**: Verify that insufficient permissions trigger 403 error

1. Locate the "Subtask 10.2: Test Permission Check" section
2. Click the **"Simulate Insufficient Permissions"** button
3. Observe the permission status change to "Subscriber (no manage_options)"
4. Click the **"Apply"** button on the Modern Dark template card
5. Confirm the dialog that appears
6. **Verify**:
   - ✅ Error notification appears with "Insufficient permissions" message
   - ✅ Console log shows 403 status code
   - ✅ Button returns to enabled state
   - ✅ Card opacity returns to normal
7. Check off items in the verification checklist
8. Click **"Restore Permissions"** to reset

### 4. Run Test 10.3: Invalid Template ID
**Goal**: Verify that invalid template ID triggers 404 error

1. Locate the "Subtask 10.3: Test Invalid Template ID" section
2. Click the **"Corrupt Template ID"** button
3. Observe the template ID change to "invalid-template-xyz-999"
4. Click the **"Apply"** button on the Minimal Light template card
5. Confirm the dialog that appears
6. **Verify**:
   - ✅ Error notification appears with "Template not found" message
   - ✅ Console log shows 404 status code
   - ✅ Button returns to enabled state
   - ✅ Card opacity returns to normal
7. Check off items in the verification checklist
8. Click **"Restore Template ID"** to reset

### 5. Run Test 10.4: Console Logging
**Goal**: Verify that all events are logged to console

1. **Open browser console**: Press F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)
2. Locate the "Subtask 10.4: Test Console Logging" section
3. Click the **"Apply"** button on the Elegant Purple template card
4. Confirm the dialog that appears
5. **Verify in browser console**:
   - ✅ "MASE: Apply button clicked for template: elegant-purple"
   - ✅ "MASE: Sending AJAX request - Apply Template" with request data
   - ✅ "MASE: AJAX response - Apply Template" with response data
6. **Verify in on-page console** (scroll down to "Console Log Output" section):
   - ✅ All events are logged with timestamps
   - ✅ Color-coded entries (info=blue, success=green, error=red)
7. Check off items in the verification checklist

### 6. Export Test Results
1. Scroll to the "Console Log Output" section
2. Click the **"Export Test Results"** button
3. A JSON file will be downloaded: `task-10-test-results.json`
4. Open the file to review all test results
5. Verify all checklists show completion status

## Expected Results

### Test 10.1: Nonce Verification ✅
- **Error Type**: 403 Forbidden
- **Error Message**: "Invalid nonce - Security check failed" or "Insufficient permissions"
- **Console Log**: Shows 403 status code and error details
- **UI Behavior**: Button and card state restored after error

### Test 10.2: Permission Check ✅
- **Error Type**: 403 Forbidden
- **Error Message**: "Insufficient permissions"
- **Console Log**: Shows 403 status code and permission error
- **UI Behavior**: Button and card state restored after error

### Test 10.3: Invalid Template ID ✅
- **Error Type**: 404 Not Found
- **Error Message**: "Template not found"
- **Console Log**: Shows 404 status code and error details
- **UI Behavior**: Button and card state restored after error

### Test 10.4: Console Logging ✅
- **Browser Console**: All events logged with "MASE:" prefix
- **On-Page Console**: Color-coded entries with timestamps
- **Logged Events**:
  - Template ID on button click
  - AJAX request data (action, nonce, template_id)
  - AJAX response data (success/error details)
  - Error details (status code, message)

## Troubleshooting

### Issue: No error notification appears
**Solution**: Check that you clicked the appropriate manipulation button (Corrupt Nonce, Simulate Permissions, etc.) before clicking Apply

### Issue: Console logs not visible
**Solution**: 
- Make sure browser console is open (F12)
- Scroll down to the "Console Log Output" section on the page
- Click "Clear Log" and try again

### Issue: Button stays disabled
**Solution**: 
- Refresh the page to reset all state
- Or wait 3 seconds for automatic restoration

### Issue: Tests pass when they should fail
**Solution**: 
- Make sure you clicked the manipulation button first
- Verify the status display shows the corrupted value
- Click "Restore" buttons and try again

## Test Checklist Summary

Use this checklist to track your testing progress:

- [ ] **Test 10.1**: Nonce verification (4 checks)
- [ ] **Test 10.2**: Permission check (4 checks)
- [ ] **Test 10.3**: Invalid template ID (4 checks)
- [ ] **Test 10.4**: Console logging (4 checks)
- [ ] **Export**: Test results exported successfully

## Requirements Verified

This test suite verifies the following requirements:

- ✅ **Requirement 7.2**: Nonce verification
- ✅ **Requirement 7.3**: Permission check
- ✅ **Requirement 10.1**: Missing template ID validation
- ✅ **Requirement 10.2**: Template existence check
- ✅ **Requirement 10.3**: Security error handling (403)
- ✅ **Requirement 10.4**: Application error handling
- ✅ **Requirement 10.5**: Error recovery and state restoration
- ✅ **Requirement 8.1**: Template ID logging
- ✅ **Requirement 8.3**: AJAX request/response logging
- ✅ **Requirement 8.4**: Debug information logging

## Next Steps

After completing all tests:

1. Review the exported test results JSON file
2. Verify all checklist items are checked
3. Document any issues found
4. Proceed to Task 11: Cross-browser compatibility testing

## Support

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Verify the test file is opened in a modern browser
3. Try refreshing the page to reset all state
4. Review the implementation summary: `tests/TASK-10-IMPLEMENTATION-SUMMARY.md`

## Security Note

⚠️ **Important**: These tests simulate security vulnerabilities for testing purposes only. Do not use these techniques on production systems without proper authorization. The tests are designed to verify that security controls are working correctly.
