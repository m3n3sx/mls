# Dark Mode Toggle - Cross-Browser Testing Quick Start Guide

## Overview

This guide helps you quickly set up and run cross-browser compatibility tests for the dark mode toggle feature.

---

## Prerequisites

### Required Software

1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Playwright** (will be installed automatically)
   - Installs Chrome, Firefox, and Safari (WebKit) browsers

### Optional Software

- **Microsoft Edge** (for Edge testing on Windows)
- **Screen reader** (for accessibility testing)
  - Windows: NVDA or JAWS
  - macOS: VoiceOver (built-in)
  - Linux: Orca

---

## Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd tests/browser-compatibility
npm install --save-dev @playwright/test
npx playwright install
```

### Step 2: Run Automated Tests

**All browsers:**
```bash
./run-dark-mode-tests.sh
```

**Specific browser:**
```bash
./run-dark-mode-tests.sh chrome
./run-dark-mode-tests.sh firefox
./run-dark-mode-tests.sh safari
./run-dark-mode-tests.sh edge
```

### Step 3: View Results

The script will automatically open the HTML report in your browser.

Alternatively, open manually:
```bash
open test-results/html-report/index.html  # macOS
xdg-open test-results/html-report/index.html  # Linux
start test-results/html-report/index.html  # Windows
```

---

## Manual Testing (10 Minutes)

### Step 1: Open Test File

Open `tests/test-dark-mode-toggle.html` in each browser:

**Chrome:**
```bash
google-chrome tests/test-dark-mode-toggle.html
```

**Firefox:**
```bash
firefox tests/test-dark-mode-toggle.html
```

**Safari:**
```bash
open -a Safari tests/test-dark-mode-toggle.html
```

**Edge:**
```bash
microsoft-edge tests/test-dark-mode-toggle.html
```

### Step 2: Follow Test Instructions

The test file contains interactive tests with instructions. Follow each test section:

1. **Test 1:** Header Toggle Click Behavior
2. **Test 2:** Synchronization with General Tab
3. **Test 3:** localStorage Persistence
4. **Test 4:** Dark Mode Application
5. **Test 5:** Accessibility Attributes
6. **Test 6:** Keyboard Navigation

### Step 3: Document Results

Use the checklist: `dark-mode-browser-test-checklist.md`

---

## Test Scenarios

### Scenario 1: Basic Toggle Functionality

1. Open test file in browser
2. Click dark mode toggle
3. Verify page turns dark
4. Click again to disable
5. Verify page returns to light

**Expected:** Toggle works smoothly, no errors

### Scenario 2: localStorage Persistence

1. Enable dark mode
2. Reload page
3. Verify dark mode is still enabled
4. Disable dark mode
5. Reload page
6. Verify light mode is restored

**Expected:** Preference persists across reloads

### Scenario 3: Toggle Synchronization

1. Click header toggle
2. Verify General tab checkbox updates
3. Click General tab checkbox
4. Verify header toggle updates

**Expected:** Both toggles stay synchronized

### Scenario 4: Keyboard Navigation

1. Press Tab until toggle is focused
2. Verify focus indicator is visible
3. Press Space to toggle
4. Verify dark mode enables/disables

**Expected:** Fully keyboard accessible

### Scenario 5: Rapid Toggling

1. Click toggle rapidly 10 times
2. Verify no errors in console
3. Verify page doesn't freeze
4. Verify final state is correct

**Expected:** Handles rapid clicks gracefully

---

## Common Issues and Solutions

### Issue: Playwright not found

**Solution:**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Issue: Browser binaries not installed

**Solution:**
```bash
npx playwright install chromium firefox webkit
```

### Issue: Permission denied on run-dark-mode-tests.sh

**Solution:**
```bash
chmod +x run-dark-mode-tests.sh
```

### Issue: localStorage not working in Safari Private Browsing

**Expected behavior:** This is normal. The code handles this gracefully with try-catch.

### Issue: Tests fail in Safari

**Solution:** Make sure Safari allows local file access:
1. Safari → Preferences → Advanced
2. Enable "Show Develop menu"
3. Develop → Disable Local File Restrictions

---

## Interpreting Test Results

### Automated Test Output

**Pass (✓):**
```
✓ Chrome: localStorage API supported
✓ Chrome: Dark mode saved to localStorage
```

**Fail (✗):**
```
✗ Chrome: Dark mode not restored from localStorage
  Expected: 'dark'
  Received: null
```

### Manual Test Checklist

- ✅ = Test passed
- ❌ = Test failed
- ⚠️ = Test passed with issues
- ⬜ = Not tested

### Performance Metrics

**Good:**
- Toggle response: < 50ms
- Memory increase: < 1MB

**Acceptable:**
- Toggle response: 50-100ms
- Memory increase: 1-2MB

**Poor:**
- Toggle response: > 100ms
- Memory increase: > 2MB

---

## Reporting Issues

### What to Include

1. **Browser and version**
   - Example: Chrome 120.0.6099.109

2. **Operating system**
   - Example: macOS 14.1.1

3. **Steps to reproduce**
   - Numbered list of exact steps

4. **Expected behavior**
   - What should happen

5. **Actual behavior**
   - What actually happens

6. **Screenshots**
   - Before and after images

7. **Console errors**
   - Copy/paste from browser console

### Example Issue Report

```markdown
**Browser:** Firefox 121.0
**OS:** Windows 11
**Issue:** Dark mode not persisting after reload

**Steps:**
1. Open test-dark-mode-toggle.html
2. Click dark mode toggle
3. Reload page
4. Dark mode is not restored

**Expected:** Dark mode should be restored from localStorage

**Actual:** Page loads in light mode

**Console Errors:**
```
SecurityError: The operation is insecure.
```

**Screenshot:** [attached]
```

---

## Next Steps

### After Automated Tests

1. Review HTML report
2. Check for any failed tests
3. Investigate failures
4. Run manual tests for verification

### After Manual Tests

1. Complete checklist for each browser
2. Document any issues found
3. Take screenshots of visual differences
4. Fill out test report template

### Final Steps

1. Complete `DARK-MODE-TEST-REPORT.md`
2. Attach all screenshots and logs
3. Submit for review
4. Update tasks.md with results

---

## Time Estimates

| Activity | Time |
|----------|------|
| Install dependencies | 5 min |
| Run automated tests (all browsers) | 10 min |
| Manual testing (per browser) | 10 min |
| Document results | 15 min |
| **Total (all browsers)** | **1 hour** |

---

## Checklist

Before starting:
- [ ] Node.js installed
- [ ] npm installed
- [ ] Test files accessible
- [ ] Browsers installed

After automated tests:
- [ ] All tests passed
- [ ] HTML report reviewed
- [ ] Screenshots captured
- [ ] Issues documented

After manual tests:
- [ ] Checklist completed for each browser
- [ ] Visual consistency verified
- [ ] Accessibility tested
- [ ] Performance acceptable

Final:
- [ ] Test report completed
- [ ] All issues documented
- [ ] Screenshots attached
- [ ] Ready for review

---

## Support

**Questions?** Check these resources:

1. **Requirements:** `.kiro/specs/header-dark-mode-toggle/requirements.md`
2. **Design:** `.kiro/specs/header-dark-mode-toggle/design.md`
3. **Playwright Docs:** https://playwright.dev/
4. **Browser Compatibility:** https://caniuse.com/

**Need Help?** Contact the development team.

---

## Summary

This quick start guide covers:
- ✅ Installing dependencies
- ✅ Running automated tests
- ✅ Performing manual tests
- ✅ Interpreting results
- ✅ Reporting issues

**Estimated time:** 1 hour for complete cross-browser testing

**Next:** Open `DARK-MODE-TEST-REPORT.md` to document your findings.
