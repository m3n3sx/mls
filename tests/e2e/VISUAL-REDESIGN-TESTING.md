# Visual Redesign Functional Regression Testing

This document describes the functional regression test suite created to verify that the visual redesign maintains 100% functional compatibility with existing features.

## Test File

**Location:** `tests/e2e/visual-redesign-regression.spec.js`

## Test Coverage

The test suite covers all requirements from Task 19 of the visual redesign specification:

### 19.1: Form Controls Functionality
- ✅ Toggle switches save correctly
- ✅ Color pickers work properly
- ✅ Range sliders update values
- ✅ Text inputs and selects work

### 19.2: Palette and Template Application
- ✅ Palette preview works
- ✅ Palette application saves correctly
- ✅ Template preview functionality
- ✅ Template application works

### 19.3: Live Preview Functionality
- ✅ Live preview toggle works
- ✅ Changes preview correctly
- ✅ Preview doesn't affect saved settings
- ✅ Preview can be disabled

### 19.4: Settings Save/Load
- ✅ All settings save correctly
- ✅ Settings load on page refresh
- ✅ No data is lost during save
- ✅ Reset functionality works

## Prerequisites

1. **WordPress Installation**: Running WordPress instance with MASE plugin installed
2. **Environment Variables**:
   ```bash
   export WP_BASE_URL="http://localhost:8080"
   export WP_ADMIN_USER="admin"
   export WP_ADMIN_PASS="admin123"
   ```

3. **Playwright Installation**:
   ```bash
   npm install
   npx playwright install
   ```

## Running Tests

### Run All Regression Tests
```bash
npx playwright test tests/e2e/visual-redesign-regression.spec.js
```

### Run Specific Test Suite
```bash
# Form controls only
npx playwright test tests/e2e/visual-redesign-regression.spec.js -g "19.1"

# Palette and template tests
npx playwright test tests/e2e/visual-redesign-regression.spec.js -g "19.2"

# Live preview tests
npx playwright test tests/e2e/visual-redesign-regression.spec.js -g "19.3"

# Settings save/load tests
npx playwright test tests/e2e/visual-redesign-regression.spec.js -g "19.4"
```

### Run in Specific Browser
```bash
# Chrome only
npx playwright test tests/e2e/visual-redesign-regression.spec.js --project=chromium

# Firefox only
npx playwright test tests/e2e/visual-redesign-regression.spec.js --project=firefox

# Safari only
npx playwright test tests/e2e/visual-redesign-regression.spec.js --project=webkit
```

### Run with UI Mode (Interactive)
```bash
npx playwright test tests/e2e/visual-redesign-regression.spec.js --ui
```

### Run with Debug Mode
```bash
npx playwright test tests/e2e/visual-redesign-regression.spec.js --debug
```

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Expected Results

All tests should pass, confirming:
- ✅ Form controls work identically to pre-redesign
- ✅ Palette and template systems function correctly
- ✅ Live preview operates as expected
- ✅ Settings persistence is maintained
- ✅ No functional regressions introduced by visual changes

## Troubleshooting

### Tests Fail to Connect
- Verify WordPress is running at `WP_BASE_URL`
- Check admin credentials are correct
- Ensure MASE plugin is activated

### Authentication Issues
- Delete `tests/e2e/.auth/user.json`
- Run global setup: `npx playwright test --project=setup`

### Timeout Errors
- Increase timeout in test file or config
- Check WordPress performance
- Verify network connectivity

### Element Not Found
- Inspect actual HTML structure in browser
- Update selectors if CSS classes changed
- Check if tabs/sections are visible

## Integration with CI/CD

Add to your CI pipeline:
```yaml
- name: Run Visual Redesign Regression Tests
  run: |
    npx playwright test tests/e2e/visual-redesign-regression.spec.js
  env:
    WP_BASE_URL: ${{ secrets.WP_BASE_URL }}
    WP_ADMIN_USER: ${{ secrets.WP_ADMIN_USER }}
    WP_ADMIN_PASS: ${{ secrets.WP_ADMIN_PASS }}
```

## Test Maintenance

When updating the visual redesign:
1. Run full regression suite before changes
2. Run after each significant change
3. Update selectors if CSS classes change
4. Add new tests for new functionality
5. Keep tests focused on functionality, not styling

## Related Documentation

- Main test suite: `tests/e2e/comprehensive-functionality-test.spec.js`
- Visual interactive tests: `tests/visual-interactive/`
- Accessibility tests: `tests/accessibility/`
- Browser compatibility: `tests/e2e/browser-compatibility-test.spec.js`

## Success Criteria

The visual redesign is considered functionally compatible when:
- ✅ All 20+ regression tests pass
- ✅ No console errors during test execution
- ✅ Settings persist correctly across page reloads
- ✅ Live preview works without affecting saved data
- ✅ Palette and template systems function identically
- ✅ All form controls save and load correctly
