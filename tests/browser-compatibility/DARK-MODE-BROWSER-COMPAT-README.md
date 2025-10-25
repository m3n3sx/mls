# Dark Mode Toggle - Browser Compatibility Tests

## Overview

This test suite validates that the dark mode toggle feature works correctly across all major browsers and platforms, including:

- **Desktop Browsers:** Chrome, Firefox, Safari, Edge
- **Mobile Browsers:** iOS Safari, Android Chrome
- **Platforms:** Windows, macOS, Linux
- **Devices:** Desktop, tablet, mobile (various screen sizes)

## Requirements Coverage

These tests validate the following requirements from the global-dark-light-mode-toggle spec:

- **Requirement 3.1-3.6:** System preference detection using matchMedia API
- **Requirement 4.1-4.5:** localStorage persistence across browsers
- **Requirement 11.6:** Browser compatibility and fallbacks
- **Requirement 12.1-12.7:** Performance optimization across platforms

## Test Categories

### 1. matchMedia API Support
- Validates `window.matchMedia()` availability
- Tests `prefers-color-scheme` media query detection
- Verifies change listener support (modern and legacy APIs)
- Tests error handling for invalid queries
- Validates multiple media query support

### 2. localStorage Support
- Validates localStorage API availability
- Tests saving dark mode preference
- Tests restoring preference on page load
- Validates error handling (quota exceeded, unavailable)

### 3. CSS Custom Properties
- Validates CSS custom property support
- Tests `data-theme` attribute application
- Verifies dark mode CSS styles apply correctly
- Validates WCAG AA contrast ratios (4.5:1 minimum)

### 4. Dark Mode Appearance
- Tests visual consistency across browsers
- Validates smooth transitions
- Checks for visual glitches during toggling
- Captures screenshots for visual regression

### 5. Toggle Functionality
- Tests click-based toggling
- Validates toggle synchronization (header + settings)
- Verifies ARIA attribute updates

### 6. Accessibility
- Validates ARIA attributes (role, aria-checked, aria-label)
- Tests keyboard navigation (Tab, Space, Enter)
- Verifies visible focus indicators

### 7. JavaScript Functionality
- Checks for JavaScript errors
- Tests rapid toggling without errors
- Validates error handling

### 8. Browser-Specific Tests
- Chrome: Modern feature support
- Firefox: Data attribute handling
- Safari: Webkit prefix support
- Edge: Chromium compatibility

### 9. Mobile Device Tests
- Tests on various mobile viewports (iPhone, Android, iPad)
- Validates touch event handling
- Tests orientation changes (portrait/landscape)
- Safari-specific mobile features
- Android Chrome-specific features

### 10. Platform-Specific Tests
- Platform detection (Windows, Mac, Linux)
- Platform-specific keyboard shortcuts (Ctrl vs Cmd)
- Font rendering across platforms

### 11. Performance Tests
- Toggle speed measurement (< 100ms target)
- Memory leak detection (< 2MB increase)

## Prerequisites

### Required Software

1. **Node.js** (v14 or higher)
   ```bash
   node --version
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **Playwright** (installed automatically by script)
   ```bash
   npm install --save-dev @playwright/test
   npx playwright install
   ```

### Browser Installation

Playwright will automatically download browser binaries for:
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

For mobile testing, Playwright uses device emulation (no physical devices required).

## Running Tests

### Quick Start

Run all tests across all browsers:
```bash
cd tests/browser-compatibility
./run-dark-mode-tests.sh
```

### Browser-Specific Tests

Test specific browsers:
```bash
# Chrome only
./run-dark-mode-tests.sh chrome

# Firefox only
./run-dark-mode-tests.sh firefox

# Safari only
./run-dark-mode-tests.sh safari

# Edge only
./run-dark-mode-tests.sh edge
```

### Direct Playwright Commands

```bash
# All browsers
npx playwright test test-dark-mode-cross-browser.js

# Specific browser
npx playwright test test-dark-mode-cross-browser.js --project=chromium
npx playwright test test-dark-mode-cross-browser.js --project=firefox
npx playwright test test-dark-mode-cross-browser.js --project=webkit

# Mobile devices
npx playwright test test-dark-mode-cross-browser.js --project=mobile-safari
npx playwright test test-dark-mode-cross-browser.js --project=mobile-chrome

# Headed mode (see browser window)
npx playwright test test-dark-mode-cross-browser.js --headed

# Debug mode
npx playwright test test-dark-mode-cross-browser.js --debug

# Specific test
npx playwright test test-dark-mode-cross-browser.js -g "should support localStorage API"
```

## Test Results

### Output Locations

1. **Console Output:** Real-time test results with ✓/✗ indicators
2. **HTML Report:** `test-results/html-report/index.html`
3. **JSON Results:** `test-results/dark-mode/*.json`
4. **Screenshots:** `test-results/dark-mode/*.png` (on failures)
5. **Videos:** `test-results/` (on failures, if enabled)

### Viewing Results

The HTML report opens automatically after tests complete. To manually open:

**macOS:**
```bash
open test-results/html-report/index.html
```

**Linux:**
```bash
xdg-open test-results/html-report/index.html
```

**Windows:**
```bash
start test-results/html-report/index.html
```

### Understanding Results

**Test Status:**
- ✓ **Passed:** Feature works correctly
- ✗ **Failed:** Feature has issues (see details)
- ⊘ **Skipped:** Test not applicable to this browser

**Performance Metrics:**
- Toggle speed (should be < 100ms)
- Memory usage (should increase < 2MB)

**Compatibility Matrix:**
| Feature | Chrome | Firefox | Safari | Edge | Mobile |
|---------|--------|---------|--------|------|--------|
| localStorage | ✓ | ✓ | ✓ | ✓ | ✓ |
| matchMedia | ✓ | ✓ | ✓ | ✓ | ✓ |
| CSS Custom Props | ✓ | ✓ | ✓ | ✓ | ✓ |
| Touch Events | N/A | N/A | N/A | N/A | ✓ |

## Troubleshooting

### Common Issues

**1. Playwright not installed**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**2. Browser binaries missing**
```bash
npx playwright install chromium firefox webkit
```

**3. Tests fail with "Cannot find test file"**
- Ensure you're in the `tests/browser-compatibility` directory
- Check that `test-dark-mode-cross-browser.js` exists

**4. Tests timeout**
- Increase timeout in `playwright.config.js`:
  ```javascript
  timeout: 60 * 1000, // 60 seconds
  ```

**5. Mobile tests fail**
- Mobile tests use device emulation, not real devices
- Ensure viewport sizes are set correctly
- Check touch event simulation

**6. Safari tests fail on Linux**
- WebKit tests may have limitations on Linux
- Use macOS for full Safari testing
- Consider using BrowserStack for real Safari testing

### Debug Mode

Run tests in debug mode to step through:
```bash
npx playwright test test-dark-mode-cross-browser.js --debug
```

This opens Playwright Inspector where you can:
- Step through each test action
- Inspect the page at any point
- View console logs and network requests
- Take screenshots manually

### Verbose Output

Get detailed logs:
```bash
DEBUG=pw:api npx playwright test test-dark-mode-cross-browser.js
```

## Manual Testing Checklist

While automated tests cover most scenarios, some aspects require manual verification:

### Desktop Browsers

**Chrome (Windows/Mac/Linux):**
- [ ] Dark mode toggle works
- [ ] localStorage persists across sessions
- [ ] System preference detection works
- [ ] Smooth transitions (no flicker)
- [ ] DevTools shows no errors

**Firefox (Windows/Mac/Linux):**
- [ ] Dark mode toggle works
- [ ] localStorage persists across sessions
- [ ] System preference detection works
- [ ] Smooth transitions (no flicker)
- [ ] Browser Console shows no errors

**Safari (Mac):**
- [ ] Dark mode toggle works
- [ ] localStorage persists across sessions
- [ ] System preference detection works
- [ ] Smooth transitions (no flicker)
- [ ] Web Inspector shows no errors

**Edge (Windows):**
- [ ] Dark mode toggle works
- [ ] localStorage persists across sessions
- [ ] System preference detection works
- [ ] Smooth transitions (no flicker)
- [ ] DevTools shows no errors

### Mobile Devices

**iOS Safari (iPhone/iPad):**
- [ ] Dark mode toggle works on touch
- [ ] localStorage persists across sessions
- [ ] System preference detection works
- [ ] Smooth transitions (no flicker)
- [ ] Works in portrait and landscape
- [ ] No console errors (use Safari Remote Debugging)

**Android Chrome (Phone/Tablet):**
- [ ] Dark mode toggle works on touch
- [ ] localStorage persists across sessions
- [ ] System preference detection works
- [ ] Smooth transitions (no flicker)
- [ ] Works in portrait and landscape
- [ ] No console errors (use Chrome Remote Debugging)

### System Preference Testing

**macOS:**
1. Open System Preferences → General
2. Change Appearance between Light and Dark
3. Verify WordPress admin updates automatically (if no manual preference set)

**Windows 10/11:**
1. Open Settings → Personalization → Colors
2. Change "Choose your color" between Light and Dark
3. Verify WordPress admin updates automatically (if no manual preference set)

**Linux (GNOME):**
1. Open Settings → Appearance
2. Change between Light and Dark
3. Verify WordPress admin updates automatically (if no manual preference set)

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Browser Compatibility Tests

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
        run: |
          cd tests/browser-compatibility
          npm install
          npx playwright install --with-deps
      - name: Run tests
        run: |
          cd tests/browser-compatibility
          npx playwright test test-dark-mode-cross-browser.js
      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: tests/browser-compatibility/test-results/
```

## Real Device Testing

For comprehensive testing on real devices, consider:

### BrowserStack
- Real device testing (iOS, Android)
- Multiple OS versions
- Network throttling
- Geolocation testing

### Sauce Labs
- Real device cloud
- Automated and manual testing
- Video recording
- Performance metrics

### LambdaTest
- Real browser testing
- Mobile app testing
- Screenshot testing
- Responsive testing

## Performance Benchmarks

### Expected Performance

| Metric | Target | Chrome | Firefox | Safari | Edge |
|--------|--------|--------|---------|--------|------|
| Toggle Speed | < 100ms | ~50ms | ~60ms | ~55ms | ~50ms |
| Memory Increase | < 2MB | ~0.5MB | ~0.8MB | ~0.6MB | ~0.5MB |
| Initial Load | < 50ms | ~30ms | ~35ms | ~32ms | ~30ms |

### Measuring Performance

Use browser DevTools:

**Chrome DevTools:**
1. Open DevTools (F12)
2. Go to Performance tab
3. Record while toggling dark mode
4. Analyze timeline

**Firefox Developer Tools:**
1. Open Developer Tools (F12)
2. Go to Performance tab
3. Start recording
4. Toggle dark mode
5. Stop and analyze

## Known Browser Limitations

### Safari
- `prefers-color-scheme` support: Safari 12.1+
- CSS custom properties: Safari 10+
- matchMedia listeners: Use legacy `addListener` for Safari < 14

### Firefox
- CSS custom properties: Firefox 31+
- `prefers-color-scheme`: Firefox 67+

### Edge (Legacy)
- Legacy Edge (pre-Chromium) not supported
- Use Edge Chromium (version 79+)

### Internet Explorer
- Not supported (no CSS custom properties)
- Graceful degradation recommended

## Contributing

When adding new browser compatibility tests:

1. Follow existing test structure
2. Use descriptive test names
3. Add console.log for success messages
4. Include error handling
5. Update this README with new test coverage
6. Ensure tests work across all browsers

## Support

For issues or questions:
- Check existing test results in `test-results/`
- Review browser console for errors
- Check Playwright documentation: https://playwright.dev
- Review MASE documentation in `docs/`

## References

- [Playwright Documentation](https://playwright.dev)
- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [MDN: matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Can I Use: CSS Custom Properties](https://caniuse.com/css-variables)
- [Can I Use: prefers-color-scheme](https://caniuse.com/prefers-color-scheme)
