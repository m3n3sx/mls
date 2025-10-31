# QA Testing Guide for Template Visual Enhancements

Complete guide for running comprehensive quality assurance tests for the MASE template visual enhancements.

## Overview

This testing suite covers:
- ✅ Visual regression testing (all themes and variants)
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- ✅ Mobile device testing (iOS, Android, various screen sizes)
- ✅ Performance testing (FPS, memory, load times, Lighthouse)
- ✅ Accessibility testing (WCAG 2.1 AA compliance)

## Prerequisites

### Required Software
- Node.js 18+ and npm
- WordPress running at http://localhost:8080
- Playwright browsers installed

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install optional accessibility testing
npm install --save-dev @axe-core/playwright
```

## Quick Start

### Run All QA Tests

```bash
npm run test:qa
```

This runs the complete test suite including:
1. Visual regression tests
2. Cross-browser tests (Chrome, Firefox, Safari)
3. Mobile device tests
4. Performance tests
5. Accessibility tests

### Run Individual Test Suites

```bash
# Visual regression testing
npm run test:qa:visual

# Cross-browser testing
npm run test:qa:cross-browser

# Mobile device testing
npm run test:qa:mobile

# Performance testing
npm run test:qa:performance

# Accessibility testing
npm run test:qa:accessibility
```

### Run Browser-Specific Tests

```bash
# Chrome only
npm run test:qa:chrome

# Firefox only
npm run test:qa:firefox

# Safari only
npm run test:qa:safari
```

## Test Suites

### 1. Visual Regression Testing

**File:** `tests/e2e/visual-regression-comprehensive.spec.js`

**What it tests:**
- Baseline screenshots for all 8 themes
- All theme color variants
- All intensity levels (low, medium, high)
- Dark mode visual consistency
- Responsive layouts (mobile, tablet, desktop)
- Animation states (idle, hover, active)

**Output:**
- Screenshots saved to `tests/screenshots/`
- Comparison reports in Playwright HTML report

**Run:**
```bash
npm run test:qa:visual
```

**Expected Results:**
- All themes render correctly
- Variants maintain visual effects
- No unexpected visual regressions
- Responsive layouts adapt properly

### 2. Cross-Browser Testing

**File:** `tests/e2e/cross-browser-comprehensive.spec.js`

**What it tests:**
- CSS custom properties support
- Backdrop-filter support (glassmorphism)
- CSS Grid and Flexbox
- CSS animations and transitions
- Theme application
- Preview modal functionality
- Intensity controls
- Color variant switching
- Micro-interactions
- Performance mode
- Dark mode
- Keyboard navigation
- Reduced motion preference
- Export/import functionality

**Browsers tested:**
- Chromium (Chrome, Edge)
- Firefox
- WebKit (Safari)

**Run:**
```bash
npm run test:qa:cross-browser

# Or specific browser
npm run test:qa:chrome
npm run test:qa:firefox
npm run test:qa:safari
```

**Expected Results:**
- All features work in all browsers
- Graceful degradation for unsupported features
- Consistent user experience across browsers

### 3. Mobile Device Testing

**File:** `tests/e2e/mobile-device-comprehensive.spec.js`

**What it tests:**
- Responsive layouts (320px to 1366px)
- Animation scaling on mobile
- Particle effects disabled on mobile
- Backdrop-filter reduction
- Touch interactions
- Touch target sizes (minimum 44x44px)
- Hover effects removed on touch devices
- Performance mode auto-enabled
- Orientation changes (portrait/landscape)
- Mobile menu behavior
- Theme cards stacking
- Form inputs on mobile
- Scrolling performance
- Memory usage

**Devices tested:**
- iPhone 12, 12 Pro, SE
- Pixel 5
- Galaxy S21
- iPad Pro, iPad Mini

**Run:**
```bash
npm run test:qa:mobile
```

**Expected Results:**
- Layouts adapt to all screen sizes
- Touch interactions work smoothly
- Performance optimized for mobile
- No horizontal scrolling
- Readable text without zooming

### 4. Performance Testing

**File:** `tests/e2e/performance-comprehensive.spec.js`

**What it tests:**
- FPS measurement for all themes (target: 60 FPS)
- Memory usage (target: < 100MB)
- Load times (target: < 3s)
- CSS file sizes (target: < 50KB each)
- JavaScript file sizes (target: < 100KB each)
- Animation performance (target: < 16.67ms per frame)
- AJAX response times (target: < 1s)
- DOM complexity
- Performance Mode impact
- Lighthouse audits (target: score > 70)

**Output:**
- Performance data saved to `tests/performance-results/`
- Comprehensive report: `comprehensive-report.json`
- Lighthouse report: `lighthouse-report.json`

**Run:**
```bash
npm run test:qa:performance
```

**Expected Results:**
- All themes maintain 60 FPS
- Memory usage under 100MB
- Fast load times
- Optimized file sizes
- Performance Mode improves metrics

### 5. Accessibility Testing

**File:** `tests/e2e/accessibility-comprehensive.spec.js`

**What it tests:**
- Automated accessibility scans (axe-core)
- Contrast ratios (WCAG AA: 4.5:1, AAA: 7:1)
- High-contrast variants
- Focus indicator visibility
- Focus indicator size (minimum 3px)
- Keyboard navigation (Tab, Shift+Tab, Enter, Space, Escape)
- Logical tab order
- Skip links
- Animations disabled with prefers-reduced-motion
- Functionality without animations
- ARIA labels and roles
- Form labels
- Color-blind friendly palettes
- Screen reader announcements

**Standards:**
- WCAG 2.1 Level AA compliance
- Section 508 compliance

**Run:**
```bash
npm run test:qa:accessibility
```

**Expected Results:**
- Zero critical accessibility violations
- All text meets contrast requirements
- Keyboard navigation works completely
- Screen reader compatible
- Reduced motion respected

## Test Results

### Viewing Results

After running tests, view the HTML report:

```bash
npx playwright show-report
```

This opens an interactive report at http://localhost:9323 showing:
- Test pass/fail status
- Screenshots and videos
- Performance metrics
- Detailed error messages

### Result Locations

```
tests/
├── screenshots/           # Visual regression screenshots
│   ├── baseline/         # Baseline theme screenshots
│   ├── variants/         # Color variant screenshots
│   ├── intensity/        # Intensity level screenshots
│   ├── dark-mode/        # Dark mode screenshots
│   ├── responsive/       # Responsive layout screenshots
│   ├── animations/       # Animation state screenshots
│   ├── mobile/           # Mobile viewport screenshots
│   └── devices/          # Device-specific screenshots
├── performance-results/   # Performance test data
│   ├── fps-results.json
│   ├── memory-results.json
│   ├── load-time-results.json
│   ├── css-sizes.json
│   ├── js-sizes.json
│   ├── animation-results.json
│   ├── ajax-times.json
│   ├── dom-stats.json
│   ├── performance-mode-impact.json
│   ├── comprehensive-report.json
│   └── lighthouse-report.json
└── test-results/          # Playwright test results
    └── results.json
```

## Performance Benchmarks

### Target Metrics

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| FPS | 60 | 45-59 | < 45 |
| Memory Usage | < 50MB | 50-100MB | > 100MB |
| Load Time | < 2s | 2-3s | > 3s |
| AJAX Response | < 500ms | 500ms-1s | > 1s |
| CSS File Size | < 30KB | 30-50KB | > 50KB |
| JS File Size | < 50KB | 50-100KB | > 100KB |
| Lighthouse Score | > 90 | 70-90 | < 70 |

### Performance Mode Impact

Performance Mode should:
- Increase FPS by 10-20%
- Reduce memory usage by 30-50%
- Disable expensive effects (particles, backdrop-filter)
- Maintain full functionality

## Accessibility Requirements

### WCAG 2.1 Level AA

✅ **Perceivable**
- Text contrast ratio ≥ 4.5:1
- Non-text contrast ratio ≥ 3:1
- Resize text up to 200%
- Images have alt text

✅ **Operable**
- Keyboard accessible
- No keyboard traps
- Focus visible (3px minimum)
- Skip links available

✅ **Understandable**
- Consistent navigation
- Form labels present
- Error messages clear
- Language identified

✅ **Robust**
- Valid HTML
- ARIA used correctly
- Compatible with assistive tech

## Troubleshooting

### Tests Failing

**WordPress not running:**
```bash
# Start WordPress
docker-compose up -d

# Verify it's running
curl http://localhost:8080
```

**Playwright browsers not installed:**
```bash
npx playwright install
```

**Authentication issues:**
```bash
# Re-run global setup
npx playwright test tests/e2e/global-setup.js
```

### Performance Issues

**Low FPS:**
- Check if Performance Mode is disabled
- Verify GPU acceleration is enabled
- Close other applications
- Test on different hardware

**High memory usage:**
- Check for memory leaks
- Verify cleanup in theme switching
- Test with Performance Mode enabled

### Accessibility Issues

**Contrast failures:**
- Use browser DevTools to inspect colors
- Test with high-contrast mode
- Verify dark mode colors

**Keyboard navigation issues:**
- Check tab order with Tab key
- Verify focus indicators are visible
- Test with screen reader

## CI/CD Integration

### GitHub Actions Example

```yaml
name: QA Tests

on: [push, pull_request]

jobs:
  qa-tests:
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
      
      - name: Run QA tests
        run: npm run test:qa
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            playwright-report/
            tests/screenshots/
            tests/performance-results/
```

## Best Practices

### Before Running Tests

1. ✅ Ensure WordPress is running
2. ✅ Clear browser cache
3. ✅ Close unnecessary applications
4. ✅ Use consistent test environment
5. ✅ Update test data if needed

### During Testing

1. ✅ Don't interact with browser during tests
2. ✅ Monitor console for errors
3. ✅ Check network tab for failed requests
4. ✅ Note any unexpected behavior

### After Testing

1. ✅ Review HTML report
2. ✅ Check screenshots for visual issues
3. ✅ Analyze performance metrics
4. ✅ Document any failures
5. ✅ Create bug reports if needed

## Reporting Issues

### Bug Report Template

```markdown
## Issue Description
Brief description of the issue

## Test Suite
- [ ] Visual Regression
- [ ] Cross-Browser
- [ ] Mobile Device
- [ ] Performance
- [ ] Accessibility

## Environment
- Browser: Chrome 120.0
- OS: Ubuntu 22.04
- Viewport: 1920x1080
- Theme: Glass

## Steps to Reproduce
1. Run test: npm run test:qa:visual
2. Apply glass theme
3. Observe issue

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
[Attach screenshots]

## Test Output
```
[Paste test output]
```

## Additional Context
Any other relevant information
```

## Support

For questions or issues:
1. Check this guide
2. Review test output and logs
3. Check Playwright documentation
4. Create detailed bug report

## Changelog

### Version 1.0.0 (2025-01-30)
- Initial QA testing suite
- Visual regression testing
- Cross-browser testing
- Mobile device testing
- Performance testing
- Accessibility testing
- Comprehensive test runner
- Documentation
