# Browser Compatibility Testing - Quick Start

Quick reference for running browser compatibility tests.

## Prerequisites

```bash
# 1. Ensure WordPress is running
curl http://localhost:8080

# 2. Install Playwright browsers (first time only)
npx playwright install
```

## Run Tests

### All Browsers (Recommended)

```bash
npm run test:browser-compat
```

### Specific Browser

```bash
# Chrome
npm run test:browser-compat:chrome

# Firefox
npm run test:browser-compat:firefox

# Safari
npm run test:browser-compat:safari
```

### Interactive Mode

```bash
# UI mode with time-travel debugging
npm run test:browser-compat:ui

# Headed mode (visible browser)
npx playwright test tests/e2e/browser-compatibility-test.spec.js --headed

# Debug mode (step through tests)
npx playwright test tests/e2e/browser-compatibility-test.spec.js --debug
```

## View Results

```bash
# Open HTML report
npx playwright show-report
```

## What Gets Tested

✅ **Styles** - CSS custom properties, design tokens, visual components  
✅ **Interactions** - Tabs, toggles, color pickers, buttons, forms  
✅ **Responsive** - Desktop, laptop, tablet, mobile viewports  
✅ **Dark Mode** - Toggle functionality, color schemes, readability  
✅ **Performance** - Page load times, animation smoothness  

## Expected Results

- ✅ All tests pass across all browsers
- ✅ No console errors
- ✅ Consistent visual appearance
- ✅ Smooth interactions
- ✅ Page loads < 5 seconds
- ✅ Dark mode works correctly

## Troubleshooting

### WordPress Not Running

```bash
# Start WordPress (Docker)
docker-compose up -d

# Or set custom URL
export WP_BASE_URL=http://your-wordpress-url
```

### Browsers Not Installed

```bash
npx playwright install
```

### Tests Fail

```bash
# Run in headed mode to see what's happening
npx playwright test tests/e2e/browser-compatibility-test.spec.js --headed

# Run with UI for debugging
npm run test:browser-compat:ui

# Check HTML report for details
npx playwright show-report
```

## Full Documentation

See [BROWSER-COMPATIBILITY-TESTING.md](./BROWSER-COMPATIBILITY-TESTING.md) for complete documentation.

## Test Coverage

### Browsers Tested
- Chrome (Chromium)
- Firefox (Gecko)
- Safari (WebKit)
- Edge (Chromium)

### Viewports Tested
- Desktop: 1920x1080
- Laptop: 1366x768
- Tablet: 768x1024
- Mobile: 375x667

### Components Tested
- Header component
- Tab navigation
- Card components
- Form controls (toggles, color pickers, sliders, inputs)
- Button system
- Palette cards
- Template cards
- Dark mode toggle

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Run Browser Compatibility Tests
  run: npm run test:browser-compat
```

## Support

Issues? Check:
1. WordPress is accessible
2. Playwright browsers installed
3. HTML report for details
4. Run in headed/debug mode
5. Full documentation

---

**Quick Commands:**

```bash
# Run all browsers
npm run test:browser-compat

# Run Chrome only
npm run test:browser-compat:chrome

# Interactive UI
npm run test:browser-compat:ui

# View report
npx playwright show-report
```
