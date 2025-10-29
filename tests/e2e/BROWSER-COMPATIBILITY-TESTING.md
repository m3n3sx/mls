# Browser Compatibility Testing Guide

This guide explains how to run and interpret browser compatibility tests for the MASE visual redesign.

## Overview

The browser compatibility test suite verifies that the visual redesign works correctly across all major browsers:

- **Chrome** (Chromium engine)
- **Firefox** (Gecko engine)
- **Safari** (WebKit engine)
- **Edge** (Chromium engine)

## What We Test

### 1. Style Rendering
- CSS custom properties (design tokens) load correctly
- All visual components render as expected
- Shadows, borders, and border-radius display properly
- Typography scales correctly
- Colors and backgrounds apply correctly

### 2. Interactions
- Tab navigation works smoothly
- Toggle switches respond to clicks
- Color pickers open and function
- Range sliders adjust values
- Buttons show hover and focus states
- Form inputs accept and display values

### 3. Responsive Behavior
- Desktop (1920x1080) - Full layout
- Laptop (1366x768) - Optimized layout
- Tablet (768x1024) - Adapted layout
- Mobile (375x667) - Mobile-optimized layout
- Touch targets meet minimum size (44x44px) on mobile

### 4. Dark Mode
- Dark mode toggle functions correctly
- Dark mode colors apply properly
- Text remains readable in dark mode
- Components maintain visual hierarchy
- Switching between modes works smoothly

## Prerequisites

### 1. WordPress Installation
Ensure WordPress is running and accessible:

```bash
# Default URL
http://localhost:8080

# Or set custom URL
export WP_BASE_URL=http://your-wordpress-url
```

### 2. Playwright Browsers
Install Playwright browsers if not already installed:

```bash
npx playwright install
```

### 3. Authentication
Ensure you have valid WordPress admin credentials in the global setup:

```javascript
// tests/e2e/global-setup.js
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';
```

## Running Tests

### Run All Browsers

```bash
# From project root
./tests/e2e/run-browser-compatibility-tests.sh

# Or using npm
npm run test:browser-compat
```

### Run Specific Browser

```bash
# Chrome only
./tests/e2e/run-browser-compatibility-tests.sh chromium

# Firefox only
./tests/e2e/run-browser-compatibility-tests.sh firefox

# Safari only
./tests/e2e/run-browser-compatibility-tests.sh webkit
```

### Run with Options

```bash
# Headed mode (visible browser)
./tests/e2e/run-browser-compatibility-tests.sh --headed

# Debug mode
./tests/e2e/run-browser-compatibility-tests.sh --debug

# UI mode (interactive)
./tests/e2e/run-browser-compatibility-tests.sh --ui

# Combine options
./tests/e2e/run-browser-compatibility-tests.sh firefox --headed --debug
```

### Using Playwright Directly

```bash
# All browsers
npx playwright test tests/e2e/browser-compatibility-test.spec.js

# Specific browser
npx playwright test tests/e2e/browser-compatibility-test.spec.js --project=chromium

# With UI
npx playwright test tests/e2e/browser-compatibility-test.spec.js --ui

# Headed mode
npx playwright test tests/e2e/browser-compatibility-test.spec.js --headed

# Debug mode
npx playwright test tests/e2e/browser-compatibility-test.spec.js --debug
```

## Test Structure

### Test Suites

1. **Chrome Browser Compatibility**
   - Verify all styles render correctly
   - Test all interactions work
   - Check responsive behavior
   - Test dark mode

2. **Firefox Browser Compatibility**
   - Verify all styles render correctly
   - Test all interactions work
   - Check responsive behavior
   - Test dark mode

3. **Safari Browser Compatibility**
   - Verify all styles render correctly
   - Test all interactions work
   - Check responsive behavior
   - Test dark mode

4. **Cross-Browser Visual Consistency**
   - Header component consistency
   - Tab navigation consistency
   - Form controls consistency
   - Card component consistency
   - Button system consistency

5. **Responsive Design Consistency**
   - Desktop viewport (1920x1080)
   - Laptop viewport (1366x768)
   - Tablet viewport (768x1024)
   - Mobile viewport (375x667)

6. **Dark Mode Consistency**
   - Dark mode toggle and styles
   - Dark mode card styles

7. **Performance Consistency**
   - Page load performance
   - CSS animation performance

## Viewing Results

### HTML Report

After running tests, view the detailed HTML report:

```bash
npx playwright show-report
```

This opens an interactive report in your browser showing:
- Test results for each browser
- Screenshots of failures
- Execution timeline
- Console logs
- Network activity

### Console Output

The test runner provides real-time console output:

```
✓ Chrome: Verify all styles render correctly
✓ Chrome: Test all interactions work
✓ Chrome: Check responsive behavior
✓ Chrome: Test dark mode
✓ Firefox: Verify all styles render correctly
...
```

### Test Results Directory

Results are saved to:
```
test-results/
├── results.json          # JSON test results
└── browser-compatibility-test-spec-js/
    ├── screenshots/      # Failure screenshots
    └── videos/          # Test videos (if enabled)
```

## Interpreting Results

### Success Indicators

✅ **All tests pass** - Visual redesign works correctly across all browsers

✅ **No console errors** - JavaScript executes without errors

✅ **Styles render consistently** - Visual appearance matches across browsers

✅ **Interactions work smoothly** - User interactions function as expected

### Common Issues

#### CSS Custom Properties Not Loading

**Symptom:** Design tokens are empty or undefined

**Solution:**
- Verify `mase-admin.css` is enqueued correctly
- Check browser console for CSS loading errors
- Ensure `:root` selector contains custom properties

#### Styles Render Differently

**Symptom:** Visual appearance varies between browsers

**Solution:**
- Check for browser-specific CSS prefixes
- Verify fallback values for unsupported properties
- Test with vendor-specific properties (-webkit-, -moz-)

#### Interactions Don't Work

**Symptom:** Clicks, hovers, or focus states fail

**Solution:**
- Verify JavaScript is loaded and initialized
- Check for browser-specific event handling
- Ensure selectors match actual DOM structure

#### Dark Mode Issues

**Symptom:** Dark mode doesn't apply or looks incorrect

**Solution:**
- Verify `data-theme="dark"` attribute is set on `<html>`
- Check dark mode CSS custom properties
- Ensure dark mode toggle JavaScript works

#### Responsive Layout Breaks

**Symptom:** Layout doesn't adapt to viewport size

**Solution:**
- Verify media queries are correct
- Check for fixed widths that prevent responsiveness
- Ensure viewport meta tag is present

## Debugging Failed Tests

### 1. Run in Headed Mode

See what's happening in the browser:

```bash
./tests/e2e/run-browser-compatibility-tests.sh chromium --headed
```

### 2. Use Debug Mode

Step through tests interactively:

```bash
./tests/e2e/run-browser-compatibility-tests.sh chromium --debug
```

### 3. Use UI Mode

Interactive test runner with time-travel debugging:

```bash
./tests/e2e/run-browser-compatibility-tests.sh --ui
```

### 4. Check Screenshots

Failed tests automatically capture screenshots:

```
test-results/browser-compatibility-test-spec-js/
└── Chrome-Verify-all-styles-render-correctly/
    └── test-failed-1.png
```

### 5. Review Console Logs

Check browser console output in the HTML report:

```bash
npx playwright show-report
```

Click on a test → Console tab

### 6. Inspect Network Activity

View network requests in the HTML report:

```bash
npx playwright show-report
```

Click on a test → Network tab

## Browser-Specific Notes

### Chrome (Chromium)

- **Engine:** Blink
- **CSS Support:** Excellent, latest features
- **Known Issues:** None expected
- **Testing Priority:** High (most common browser)

### Firefox

- **Engine:** Gecko
- **CSS Support:** Excellent, standards-compliant
- **Known Issues:** 
  - Scrollbar styling may differ
  - Some CSS filters may render differently
- **Testing Priority:** High

### Safari (WebKit)

- **Engine:** WebKit
- **CSS Support:** Good, but may lag behind Chrome/Firefox
- **Known Issues:**
  - Backdrop-filter may need `-webkit-` prefix
  - Some flexbox behaviors differ
  - Date/time inputs render differently
- **Testing Priority:** High (iOS users)

### Edge

- **Engine:** Chromium (since 2020)
- **CSS Support:** Same as Chrome
- **Known Issues:** None expected (uses Chromium)
- **Testing Priority:** Medium (similar to Chrome)

## Performance Benchmarks

### Expected Performance

- **Page Load:** < 5 seconds
- **Tab Switch:** < 200ms per switch
- **Dark Mode Toggle:** < 500ms
- **Live Preview Update:** < 1 second

### Performance Tests

The suite includes performance tests:

```javascript
test('All browsers: Page load performance', async ({ page, browserName }) => {
    const startTime = Date.now();
    await navigateToSettings(page);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
});
```

## Continuous Integration

### GitHub Actions

Add to `.github/workflows/browser-tests.yml`:

```yaml
name: Browser Compatibility Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:browser-compat
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### WordPress Not Accessible

```bash
# Check if WordPress is running
curl http://localhost:8080

# Start WordPress (if using Docker)
docker-compose up -d

# Set custom URL
export WP_BASE_URL=http://your-wordpress-url
```

### Playwright Browsers Not Installed

```bash
# Install all browsers
npx playwright install

# Install specific browser
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

### Authentication Fails

Check `tests/e2e/global-setup.js` credentials:

```javascript
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';
```

Update to match your WordPress installation.

### Tests Timeout

Increase timeouts in `playwright.config.js`:

```javascript
use: {
    actionTimeout: 30000,  // Increase from 10000
    navigationTimeout: 60000,  // Increase from 30000
}
```

## Best Practices

1. **Run tests before committing** - Catch issues early
2. **Test all browsers** - Don't assume Chrome = all browsers
3. **Check responsive behavior** - Test multiple viewport sizes
4. **Verify dark mode** - Ensure both themes work
5. **Review HTML report** - Don't just check pass/fail
6. **Fix failures immediately** - Don't let them accumulate
7. **Update tests with changes** - Keep tests in sync with code

## Related Documentation

- [Playwright Documentation](https://playwright.dev/)
- [MASE Testing Guide](../TESTING-GUIDE.md)
- [Visual Redesign Requirements](.kiro/specs/visual-redesign-settings-page/requirements.md)
- [Visual Redesign Design](.kiro/specs/visual-redesign-settings-page/design.md)

## Support

If you encounter issues:

1. Check this documentation
2. Review the HTML test report
3. Run tests in headed/debug mode
4. Check browser console for errors
5. Verify WordPress is accessible
6. Ensure Playwright browsers are installed

## Changelog

### Version 1.0.0 (2025-01-29)
- Initial browser compatibility test suite
- Support for Chrome, Firefox, Safari, Edge
- Responsive design testing
- Dark mode testing
- Performance benchmarks
