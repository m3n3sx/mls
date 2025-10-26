# MASE Testing Guide

Complete guide for testing Modern Admin Styler Enterprise functionality.

## Quick Start

### Prerequisites
- WordPress running on http://localhost:8080
- Admin credentials (default: admin/admin)
- Modern browser (Chrome, Firefox, Safari, or Edge)

## Testing Methods

### Method 1: Manual Testing (Recommended for Comprehensive Testing)

Use the detailed manual testing checklist:

1. Open `tests/MANUAL-TESTING-CHECKLIST.md`
2. Navigate to http://localhost:8080/wp-admin/admin.php?page=mase-settings
3. Follow each test step systematically
4. Check off completed tests
5. Document any issues found

**Time Required:** 2-3 hours for complete testing

**Best For:**
- Comprehensive functionality verification
- Visual inspection
- User experience testing
- Cross-browser testing

---

### Method 2: Browser Console Testing (Quick Automated Check)

Run automated tests directly in the browser console:

1. Navigate to http://localhost:8080/wp-admin/admin.php?page=mase-settings
2. Open Browser Console (F12)
3. Copy contents of `tests/browser-console-test.js`
4. Paste into console and press Enter
5. Watch automated tests run
6. Review results

**Time Required:** 2-3 minutes

**Best For:**
- Quick smoke testing
- Verifying page structure
- Checking JavaScript functionality
- Rapid regression testing

**Example Output:**
```
🚀 MASE Automated Test Suite Starting...
═══════════════════════════════════════════

▶ TEST: 1.1: MASE settings page exists
✓ PASSED: 1.1: MASE settings page exists

▶ TEST: 2.1: Live Preview toggle exists
✓ PASSED: 2.1: Live Preview toggle exists

...

📊 TEST RESULTS
═══════════════════════════════════════════
Total Tests: 20
✓ Passed: 20
✗ Failed: 0
Pass Rate: 100.0%

🎉 ALL TESTS PASSED!
```

---

### Method 3: Playwright E2E Testing (Automated Full Testing)

Run comprehensive automated tests with Playwright:

```bash
# Install dependencies (if not already installed)
npm install

# Run all tests
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/comprehensive-functionality-test.spec.js

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Generate HTML report
npx playwright show-report
```

**Time Required:** 10-15 minutes

**Best For:**
- CI/CD integration
- Regression testing
- Multi-browser testing
- Automated testing pipeline

---

## Test Priority Levels

### ⭐ CRITICAL (Must Pass Before Release)
1. Settings Save System (TEST 1)
2. Live Preview System (TEST 2)
3. Menu Height Mode (TEST 3)
4. Color Palette Application (TEST 4.1)
5. Template Application (TEST 5.1)

### 🔶 HIGH (Should Pass Before Release)
6. Custom Palette Save/Delete (TEST 4.2-4.3)
7. Custom Template Save (TEST 5.2)
8. Universal Buttons (TEST 8)
9. Import/Export (TEST 11)
10. Backup/Restore (TEST 12)

### 🔷 MEDIUM (Nice to Have)
11. Typography Settings (TEST 6)
12. Visual Effects (TEST 7)
13. Background System (TEST 9)
14. Login Page Customization (TEST 10)

### 🔹 LOW (Optional)
15. Mobile Responsiveness (TEST 13)
16. Performance Testing (TEST 14)
17. Browser Compatibility (TEST 15)

---

## Common Issues & Solutions

### Issue: "Live Preview toggle not working"

**Symptoms:**
- Toggle doesn't switch state
- No live preview CSS injected
- Console shows "dashicons intercepts pointer events"

**Solution:**
```javascript
// Check if dashicons are blocking clicks
const toggle = document.querySelector('#mase-live-preview-toggle');
const dashicon = toggle.closest('label').querySelector('.dashicons');
console.log('Dashicon pointer-events:', window.getComputedStyle(dashicon).pointerEvents);
// Should be "none"
```

**Fix Applied:** CSS rule sets `pointer-events: none` on dashicons

---

### Issue: "Settings not saving"

**Symptoms:**
- Save button clicked but no response
- Network tab shows 400/500 error
- Console shows validation errors

**Debugging Steps:**
1. Open Network tab (F12)
2. Click "Save Settings"
3. Find `admin-ajax.php` request
4. Check response:
   - Status 200 = Success
   - Status 400 = Validation error
   - Status 403 = Permission denied
   - Status 500 = Server error

**Common Causes:**
- Invalid color format (must be hex: #RRGGBB)
- Numeric values out of range
- Missing required fields
- Nonce expired (reload page)

---

### Issue: "Height Mode not working"

**Symptoms:**
- Menu still full height after changing to "Fit to Content"
- CSS not applied

**Debugging:**
```javascript
// Check if CSS is generated
const adminMenu = document.querySelector('#adminmenuwrap');
console.log('Height:', window.getComputedStyle(adminMenu).height);
console.log('Min-height:', window.getComputedStyle(adminMenu).minHeight);
// Should be "auto" for Fit to Content mode
```

---

### Issue: "Palette not applying"

**Symptoms:**
- Click Apply but colors don't change
- Network request fails
- Active badge doesn't appear

**Debugging:**
1. Check Network tab for `mase_apply_palette` request
2. Check response status and message
3. Verify nonce is valid
4. Check user has `manage_options` capability

---

## Performance Benchmarks

### Expected Performance Metrics

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| Page Load Time | < 2s | < 3s | > 3s |
| AJAX Response | < 500ms | < 1s | > 1s |
| Live Preview Update | < 100ms | < 300ms | > 300ms |
| Memory Usage | < 50MB | < 100MB | > 100MB |

### How to Measure

**Page Load Time:**
```javascript
// In console after page load
performance.timing.loadEventEnd - performance.timing.navigationStart
```

**AJAX Response Time:**
```javascript
// Check Network tab → admin-ajax.php → Timing
```

**Memory Usage:**
```javascript
// Chrome DevTools → Performance Monitor
// Enable "JS heap size"
```

---

## Browser Compatibility Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Live Preview | ✅ | ✅ | ✅ | ✅ |
| Color Pickers | ✅ | ✅ | ⚠️ | ✅ |
| File Upload | ✅ | ✅ | ✅ | ✅ |
| Glassmorphism | ✅ | ✅ | ⚠️ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Flexbox | ✅ | ✅ | ✅ | ✅ |

Legend:
- ✅ Fully supported
- ⚠️ Partial support (may have visual differences)
- ❌ Not supported

---

## Accessibility Testing

### Keyboard Navigation Test
1. Press Tab to navigate through form
2. Verify focus indicators are visible
3. Press Enter/Space to activate buttons
4. Verify all controls are keyboard accessible

### Screen Reader Test
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate through settings page
3. Verify all labels are announced
4. Verify state changes are announced
5. Verify error messages are announced

### Color Contrast Test
1. Use browser extension (WAVE, axe DevTools)
2. Check all text has sufficient contrast
3. Verify focus indicators are visible
4. Check color-blind friendly palette

---

## Reporting Issues

### Issue Report Template

```markdown
## Issue Title
Brief description of the issue

### Environment
- **Browser:** Chrome 120.0.6099.109
- **OS:** Windows 11
- **WordPress:** 6.4.2
- **MASE Version:** 1.2.1

### Steps to Reproduce
1. Navigate to...
2. Click on...
3. Enter value...
4. Observe...

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Screenshots
[Attach screenshots]

### Console Errors
```
[Paste console errors]
```

### Network Errors
```
[Paste network errors]
```

### Additional Context
Any other relevant information
```

---

## Test Coverage

### Current Test Coverage

| Component | Manual Tests | Automated Tests | Coverage |
|-----------|--------------|-----------------|----------|
| Settings Save | ✅ | ✅ | 100% |
| Live Preview | ✅ | ✅ | 100% |
| Palettes | ✅ | ✅ | 100% |
| Templates | ✅ | ✅ | 100% |
| Buttons | ✅ | ⚠️ | 80% |
| Backgrounds | ✅ | ⚠️ | 70% |
| Login Page | ✅ | ❌ | 50% |
| Import/Export | ✅ | ⚠️ | 60% |
| Backup/Restore | ✅ | ⚠️ | 60% |

Legend:
- ✅ Full coverage
- ⚠️ Partial coverage
- ❌ No automated tests

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: MASE E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Start WordPress
        run: docker-compose up -d
      - name: Wait for WordPress
        run: sleep 30
      - name: Run tests
        run: npm run test:e2e
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Next Steps

After completing tests:

1. **Document Results**
   - Fill out test checklist
   - Record pass/fail rates
   - Note any issues found

2. **Create Bug Reports**
   - Use issue report template
   - Include all debugging information
   - Prioritize by severity

3. **Verify Fixes**
   - Re-run failed tests after fixes
   - Verify no regressions introduced
   - Update test documentation

4. **Update Documentation**
   - Document any new features
   - Update user guide
   - Update developer guide

---

## Support

For questions or issues with testing:

1. Check this guide first
2. Review `docs/TROUBLESHOOTING.md`
3. Check console for error messages
4. Review Network tab for AJAX errors
5. Create detailed bug report

---

## Changelog

### Version 1.2.1
- Added comprehensive manual testing checklist
- Added browser console automated tests
- Added Playwright E2E test suite
- Fixed Live Preview toggle issue
- Fixed Height Mode CSS generation

### Version 1.2.0
- Initial testing documentation
- Basic manual test cases
- Performance benchmarks
