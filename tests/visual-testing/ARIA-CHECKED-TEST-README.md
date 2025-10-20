# MASE aria-checked Synchronization Test

## Overview

This test verifies that toggle controls in the MASE plugin properly synchronize their `aria-checked` attribute with their `checked` state for screen reader accessibility (MASE-ACC-001).

## Requirements Tested

- **10.1**: Toggle state changes are detected
- **10.2**: aria-checked attribute matches checked property
- **10.3**: Both Live Preview and Dark Mode toggles are tested
- **10.4**: Accessibility compliance verified with axe-core patterns
- **10.5**: State synchronization occurs on every toggle click

## What This Test Does

The test performs the following checks on each toggle:

1. **Initial State Check**: Verifies aria-checked matches the initial checked state
2. **Toggle OFF**: Clicks the toggle to disable it and verifies:
   - `checked` property becomes `false`
   - `aria-checked` attribute becomes `"false"` (string)
3. **Toggle ON**: Clicks the toggle to enable it and verifies:
   - `checked` property becomes `true`
   - `aria-checked` attribute becomes `"true"` (string)
4. **Toggle OFF Again**: Repeats the OFF test to ensure consistency

### Toggles Tested

1. **Live Preview Toggle** (`#mase-live-preview-toggle`)
   - Located in the header section
   - Controls real-time preview of style changes

2. **Dark Mode Toggle - Header** (`#mase-dark-mode-toggle`)
   - Located in the header section
   - Enables/disables dark theme

3. **Dark Mode Toggle - General Tab** (`#master-dark-mode`)
   - Located in the General settings tab
   - Synchronized with header toggle

## Prerequisites

### System Requirements

- Node.js 14+ installed
- WordPress instance running at `http://localhost`
- MASE plugin installed and activated
- Admin credentials: username `admin`, password `admin123`

### Installation

```bash
cd tests/visual-testing
npm install
npx playwright install chromium
```

## Running the Test

### Quick Start

```bash
cd tests/visual-testing
./run-aria-checked-test.sh
```

### Manual Execution

```bash
cd tests/visual-testing
node aria-checked-test.js
```

### Headless Mode

By default, the test runs with `headless: false` to show the browser. To run in headless mode, edit `aria-checked-test.js` and change:

```javascript
const browser = await chromium.launch({ 
    headless: true,  // Change to true
    slowMo: 50 
});
```

## Test Output

### Console Output

The test provides detailed console output showing:
- Login status
- Page navigation
- Each toggle being tested
- State changes (checked and aria-checked values)
- Pass/fail status for each toggle
- Overall test result

Example output:
```
♿ Starting aria-checked Synchronization Test (MASE-ACC-001)...

🔐 Logging in to WordPress...
✓ Logged in successfully

📍 Navigating to MASE settings page...
✓ MASE settings page loaded

🔄 Testing Live Preview Toggle...
  Testing toggle: #mase-live-preview-toggle
  Initial state: checked=true, aria-checked="true"
  ✓ Initial state synchronized
  Clicking to toggle OFF...
  After toggle OFF: checked=false, aria-checked="false"
  ✓ Toggle OFF state synchronized
  Clicking to toggle ON...
  After toggle ON: checked=true, aria-checked="true"
  ✓ Toggle ON state synchronized
✅ Live Preview toggle aria-checked synchronization: PASSED
```

### Screenshots

Screenshots are saved to `screenshots/` directory:
- `aria-checked-test-baseline-*.png` - Initial page state
- `aria-checked-test-live-preview-toggle-*.png` - Live Preview toggle final state
- `aria-checked-test-dark-mode-toggle-header-*.png` - Dark Mode header toggle final state
- `aria-checked-test-dark-mode-toggle-general-tab-*.png` - Dark Mode General tab toggle final state
- `aria-checked-test-final-*.png` - Final verification state

### HTML Report

An HTML report is generated in `reports/` directory:
- Interactive report with all test results
- State transition table for each toggle
- Embedded screenshots
- Pass/fail indicators
- Detailed failure messages if any

Open the report in a browser:
```bash
open reports/aria-checked-test-*.html
```

### JSON Results

Machine-readable results are saved to `reports/` directory:
- `aria-checked-test-*.json` - Complete test results in JSON format

## Understanding Test Results

### PASSED Status

All toggles correctly synchronize their aria-checked attribute:
- ✅ Initial state: aria-checked matches checked
- ✅ After toggle OFF: aria-checked="false" when checked=false
- ✅ After toggle ON: aria-checked="true" when checked=true
- ✅ Consistent behavior across multiple clicks

### FAILED Status

One or more toggles have synchronization issues:
- ❌ aria-checked doesn't match checked property
- ❌ aria-checked not updated on toggle click
- ❌ Incorrect string format (should be "true" or "false")

### Common Failure Reasons

1. **Missing aria-checked update in handler**
   - Fix: Add `$toggle.attr('aria-checked', isChecked.toString());` to toggle handler

2. **Wrong data type**
   - aria-checked should be string "true" or "false", not boolean
   - Fix: Use `.toString()` to convert boolean to string

3. **Timing issue**
   - aria-checked updated after delay
   - Fix: Update aria-checked immediately in the same handler

4. **Toggle not found**
   - Element selector doesn't match
   - Fix: Verify selector matches actual HTML

## Troubleshooting

### Test Won't Start

**Problem**: `node_modules` not found
```bash
cd tests/visual-testing
npm install
```

**Problem**: Playwright browsers not installed
```bash
npx playwright install chromium
```

### Login Fails

**Problem**: WordPress not running at `http://localhost`
- Start your WordPress development environment
- Update `CONFIG.baseUrl` in `aria-checked-test.js` if using different URL

**Problem**: Wrong credentials
- Update credentials in `loginToWordPress()` function
- Default: username `admin`, password `admin123`

### Toggle Not Found

**Problem**: MASE plugin not activated
- Activate the plugin in WordPress admin
- Verify settings page is accessible

**Problem**: Selector changed
- Update selector in test file
- Check actual HTML structure in browser DevTools

### Test Hangs

**Problem**: Page not loading
- Increase `CONFIG.timeout` value
- Check WordPress is responding
- Verify no JavaScript errors in console

## Integration with CI/CD

### GitHub Actions Example

```yaml
- name: Run aria-checked Test
  run: |
    cd tests/visual-testing
    npm install
    npx playwright install chromium
    node aria-checked-test.js
```

### Exit Codes

- `0` - All tests passed
- `1` - One or more tests failed or error occurred

## Related Files

- `aria-checked-test.js` - Main test file
- `run-aria-checked-test.sh` - Test runner script
- `test-utils.js` - Shared test utilities
- `package.json` - Node.js dependencies

## Related Documentation

- [WCAG 2.1 - 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
- [ARIA: switch role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/switch_role)
- [aria-checked attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-checked)

## Bug Reference

- **Bug ID**: MASE-ACC-001
- **Issue**: Live Preview Toggle aria-checked attribute not synchronized
- **Requirements**: 10.1, 10.2, 10.3, 10.4, 10.5
- **Fix Location**: `assets/js/mase-admin.js` - Live Preview toggle handler

## Support

For issues or questions about this test:
1. Check the HTML report for detailed failure information
2. Review the log file in `logs/` directory
3. Verify WordPress and MASE plugin are properly configured
4. Check browser console for JavaScript errors
