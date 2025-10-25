# MASE Initialization Error Handling Tests

## Overview

This test suite validates the JavaScript initialization error handling implemented in Task 1-6 of the settings-save-fix spec.

**Task:** 7. Test initialization error handling  
**Requirements:** 1.1, 1.2, 1.3, 1.4  
**Spec:** `.kiro/specs/settings-save-fix/`

## Test Coverage

### Test 1: jQuery Not Loaded (Requirement 1.2)
**Purpose:** Verify that MASE displays an alert and does not initialize when jQuery is missing.

**Expected Behavior:**
- Console error: "MASE: jQuery not loaded"
- Alert displayed: "Failed to initialize MASE Admin: jQuery is not loaded. Please refresh the page."
- Initialization stops (no success log)

**Validation:**
- ✓ Alert is called
- ✓ Alert message contains "jQuery is not loaded"
- ✓ Error log is present
- ✓ Init log is present
- ✓ No success log appears

### Test 2: maseAdmin Object Missing (Requirement 1.3)
**Purpose:** Verify that MASE displays an alert and does not initialize when maseAdmin object is missing.

**Expected Behavior:**
- Console error: "MASE: maseAdmin object missing - check wp_localize_script"
- Alert displayed: "Failed to initialize MASE Admin: Configuration data is missing. Please refresh the page."
- Initialization stops (no success log)

**Validation:**
- ✓ Alert is called
- ✓ Alert message contains "Configuration data is missing"
- ✓ Error log is present
- ✓ Init log is present
- ✓ No success log appears

### Test 3: All Dependencies Present (Requirement 1.4)
**Purpose:** Verify that MASE initializes successfully when all dependencies are available.

**Expected Behavior:**
- Console log: "MASE: Script loaded, version check..."
- Console log: "MASE: Initializing v1.2.0"
- Console log: "MASE: Admin initialized successfully"
- No alerts displayed
- No error logs

**Validation:**
- ✓ No alert is called
- ✓ Init log is present
- ✓ Version log is present
- ✓ Success log is present
- ✓ No error logs appear

### Test 4: Console Log Order (Requirement 1.1)
**Purpose:** Verify that console logs appear in the correct sequence.

**Expected Order:**
1. "MASE: Script loaded, version check..."
2. "MASE: Initializing v1.2.0"
3. "MASE: Admin initialized successfully"

**Validation:**
- ✓ Script loaded log appears first
- ✓ Initializing log appears second
- ✓ Success log appears last
- ✓ All logs are present

## Running the Tests

### Method 1: Using the Shell Script (Recommended)

```bash
# From project root
./tests/run-initialization-tests.sh
```

This will:
1. Verify the test file exists
2. Open the test page in your default browser
3. Display test instructions

### Method 2: Manual Browser Testing

1. Open `tests/test-initialization-error-handling.html` in a web browser
2. Tests will run automatically on page load
3. Review the results displayed on the page

### Method 3: Direct File Access

```bash
# Linux
xdg-open tests/test-initialization-error-handling.html

# macOS
open tests/test-initialization-error-handling.html

# Windows
start tests/test-initialization-error-handling.html
```

## Test Results

The test page displays:
- Individual test results with PASS/FAIL status
- Detailed validation information for each test
- Console logs captured during each test
- Summary statistics (Total, Passed, Failed)
- Requirement satisfaction status

### Success Criteria

All tests must PASS for Task 7 to be considered complete:
- ✓ Test 1: jQuery Not Loaded - PASS
- ✓ Test 2: maseAdmin Object Missing - PASS
- ✓ Test 3: All Dependencies Present - PASS
- ✓ Test 4: Console Log Order - PASS

## Implementation Details

### Test Isolation

Each test runs in an isolated iframe to prevent interference:
- Separate DOM context
- Independent console logs
- Isolated global variables
- Mock alert() function

### Console Log Capture

The test suite captures console output:
- `console.log()` - Standard logs
- `console.error()` - Error logs
- `console.warn()` - Warning logs

Logs are displayed in the test results for debugging.

### Alert Mocking

The `alert()` function is mocked in each test to:
- Capture alert calls
- Record alert messages
- Prevent actual browser alerts during testing

## Troubleshooting

### Tests Not Running

**Issue:** Test page loads but tests don't run  
**Solution:** Check browser console for JavaScript errors

**Issue:** Tests run but all fail  
**Solution:** Verify jQuery CDN is accessible (requires internet connection)

### Specific Test Failures

**Test 1 Fails:**
- Check that jQuery detection is working
- Verify error log message matches expected text
- Ensure alert is called with correct message

**Test 2 Fails:**
- Check that maseAdmin detection is working
- Verify error log message matches expected text
- Ensure alert is called with correct message

**Test 3 Fails:**
- Verify jQuery loads successfully
- Check that maseAdmin object is defined
- Ensure success log is generated

**Test 4 Fails:**
- Review console log order in test results
- Verify all expected logs are present
- Check log message text matches expected values

## Related Files

### Implementation Files
- `assets/js/mase-admin.js` - Main initialization code (lines 6713-6850)
- `includes/class-mase-admin.php` - PHP asset enqueuing

### Spec Files
- `.kiro/specs/settings-save-fix/requirements.md` - Requirements 1.1-1.5
- `.kiro/specs/settings-save-fix/design.md` - Design documentation
- `.kiro/specs/settings-save-fix/tasks.md` - Task 7 details

### Test Files
- `tests/test-initialization-error-handling.html` - Main test file
- `tests/run-initialization-tests.sh` - Test runner script
- `tests/INITIALIZATION-ERROR-HANDLING-TESTS-README.md` - This file

## Next Steps

After all tests pass:
1. Mark Task 7 as complete in `tasks.md`
2. Proceed to Task 8: Test validation error communication
3. Continue with remaining test tasks (9-11)

## Support

If tests fail consistently:
1. Review the implementation in `assets/js/mase-admin.js`
2. Check that Tasks 1-6 were completed correctly
3. Verify browser compatibility (Chrome, Firefox, Safari, Edge)
4. Check browser console for additional error details

## Test Maintenance

When updating the initialization code:
1. Run these tests to verify no regressions
2. Update test expectations if behavior changes intentionally
3. Add new tests for new error conditions
4. Keep test documentation synchronized with implementation
