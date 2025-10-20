# Dark Mode Circle Bug Test (MASE-DARK-001)

## Overview

This test verifies that the Dark Mode feature does not display large circular obstructions that block content. It addresses the critical bug MASE-DARK-001 where a large gray circle covered the entire screen when Dark Mode was enabled.

## Requirements Covered

- **9.1**: Test enables Dark Mode via toggle
- **9.2**: Test verifies no large circular elements are visible (> 100px)
- **9.3**: Test captures screenshots of Dark Mode for visual comparison
- **9.4**: Test verifies all tabs and features remain functional in Dark Mode
- **9.5**: Test fails with descriptive error if gray circle appears

## Test File

`tests/visual-testing/dark-mode-circle-test.js`

## How to Run

### Option 1: Using the Shell Script (Recommended)

```bash
cd tests/visual-testing
./run-dark-mode-circle-test.sh
```

### Option 2: Direct Node Execution

```bash
node tests/visual-testing/dark-mode-circle-test.js
```

## Prerequisites

1. **Node.js** installed (v14 or higher)
2. **Playwright** installed (automatically installed via npm)
3. **WordPress** running locally at `http://localhost`
4. **MASE plugin** installed and activated
5. **WordPress admin credentials**: username `admin`, password `admin123`

## What the Test Does

1. **Login**: Authenticates to WordPress admin
2. **Navigate**: Goes to MASE settings page
3. **Baseline**: Takes screenshot in Light Mode
4. **Check Light Mode**: Verifies no large circles in Light Mode
5. **Enable Dark Mode**: Clicks the Dark Mode toggle
6. **Screenshot**: Captures Dark Mode state
7. **Search**: Looks for circular elements > 100px in size
8. **Test All Tabs**: Checks each tab (General, Admin Bar, Menu, Content, Typography, Effects, Templates, Advanced)
9. **Final Screenshot**: Takes final verification screenshot
10. **Report**: Generates HTML and JSON reports

## Test Logic

The test searches for elements with:
- `border-radius: 50%` (circular elements)
- Width or height > 100px (large elements)

It checks both:
- Regular DOM elements
- Pseudo-elements (::before, ::after)

## Expected Results

### PASS Criteria
- No circular elements > 100px found in Dark Mode
- All tabs accessible and functional
- Screenshots show clean Dark Mode interface

### FAIL Criteria
- Any circular element > 100px detected
- Content obscured or blocked
- Tabs not functional in Dark Mode

## Output

### Console Output
```
🌙 Starting Dark Mode Circle Bug Test (MASE-DARK-001)...

🔐 Logging in to WordPress...
✓ Logged in successfully

📍 Navigating to MASE settings page...
✓ MASE settings page loaded

📸 Taking baseline screenshot (Light Mode)...
✓ Baseline screenshot captured

🔍 Checking for large circular elements in Light Mode...
  Found 0 large circular elements in Light Mode

🌙 Enabling Dark Mode...
✓ Dark Mode enabled

📸 Taking Dark Mode screenshot...
✓ Dark Mode screenshot captured

🔍 Searching for large circular elements in Dark Mode...
  Found 0 large circular elements in Dark Mode

📋 Testing Dark Mode across all tabs...
  Testing tab: general...
    ✓ No large circles in general tab
  Testing tab: admin-bar...
    ✓ No large circles in admin-bar tab
  ...

✅ TEST PASSED: No large circular obstructions found in Dark Mode

📊 Generating test report...
✓ HTML Report: reports/dark-mode-circle-test-1234567890.html
✓ JSON Results: reports/dark-mode-circle-test-1234567890.json
```

### Generated Files

1. **HTML Report**: `reports/dark-mode-circle-test-[timestamp].html`
   - Visual report with screenshots
   - Detailed test results
   - Interactive screenshot viewer

2. **JSON Results**: `reports/dark-mode-circle-test-[timestamp].json`
   - Machine-readable test results
   - Detailed circle detection data
   - Timestamps and metadata

3. **Screenshots**: `screenshots/dark-mode-test-*.png`
   - Light Mode baseline
   - Dark Mode active
   - Final verification
   - Full-page captures

## Troubleshooting

### Test Fails to Login
- Verify WordPress is running at `http://localhost`
- Check admin credentials (admin/admin123)
- Ensure WordPress is accessible

### Playwright Not Found
```bash
cd tests/visual-testing
npm install
```

### Test Detects False Positives
- Check `CONFIG.maxCircleSize` in test file (default: 100px)
- Review screenshots to identify the element
- Adjust threshold if needed for legitimate UI elements

### Browser Doesn't Launch
- Install Chromium: `npx playwright install chromium`
- Check system requirements for Playwright

## Integration with CI/CD

Add to your test pipeline:

```yaml
- name: Run Dark Mode Circle Test
  run: |
    cd tests/visual-testing
    npm install
    node dark-mode-circle-test.js
```

## Exit Codes

- `0`: Test passed (no large circles found)
- `1`: Test failed (large circles detected or error occurred)

## Related Files

- Requirements: `.kiro/specs/critical-bugs-fix/requirements.md`
- Design: `.kiro/specs/critical-bugs-fix/design.md`
- Tasks: `.kiro/specs/critical-bugs-fix/tasks.md`
- Bug Report: `DARK-MODE-BUG-REPORT.md`

## Version

- Test Version: 1.0.0
- MASE Version: 1.2.1
- Bug ID: MASE-DARK-001
- Created: 2025-10-19
