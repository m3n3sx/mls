# MASE Dark Mode Visual Regression Tests

Comprehensive visual testing suite for the dark mode toggle feature, covering FAB rendering, positioning, icon changes, color transitions, animations, responsive behavior, and reduced motion support.

## Overview

This test suite validates the visual aspects of the dark mode toggle feature against requirements 1.1-1.8 and 9.1-9.7.

## Test Coverage

### Test 1: FAB Rendering and Positioning
**Requirements:** 1.1, 1.2, 1.6

Tests:
- ✓ FAB exists in DOM
- ✓ FAB is visible
- ✓ FAB has fixed positioning
- ✓ FAB positioned in bottom-right corner
- ✓ FAB has high z-index (>1000)
- ✓ FAB displays sun or moon icon

### Test 2: Icon Changes (Sun/Moon)
**Requirements:** 1.2, 1.7

Tests:
- ✓ Icon changes on toggle
- ✓ Icon switches between sun and moon
- ✓ Icon changes back on second toggle

### Test 3: Color Transitions
**Requirements:** 9.1, 9.2

Tests:
- ✓ Body has transition property (0.3s)
- ✓ Colors changed after toggle
- ✓ Transition completed in ~300ms
- ✓ Dark mode class applied to body

### Test 4: Animation Smoothness
**Requirements:** 1.7, 9.2, 9.3, 9.4, 9.5

Tests:
- ✓ FAB icon has rotation transition
- ✓ Icon rotation animation progressed
- ✓ FAB disabled during transition
- ✓ FAB re-enabled after transition
- ✓ Transitioning class managed correctly

### Test 5: Responsive Behavior
**Requirements:** 1.5

Tests across three viewports:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

For each viewport:
- ✓ FAB visible
- ✓ FAB positioned correctly
- ✓ Toggle functionality works

### Test 6: Reduced Motion Mode
**Requirements:** 9.6, 9.7

Tests:
- ✓ Reduced motion preference detected
- ✓ Transitions disabled with reduced motion
- ✓ Icon rotation disabled with reduced motion
- ✓ Instant mode switching works
- ✓ Functionality preserved (colors changed)

## Prerequisites

1. **Node.js** (v14 or higher)
2. **WordPress** running at `http://localhost`
3. **MASE Plugin** installed and activated
4. **Admin credentials**: username `admin`, password `admin123`

## Installation

```bash
cd tests/visual-testing
npm install
npx playwright install chromium
```

## Running Tests

### Run all visual regression tests (headless):
```bash
./run-dark-mode-visual-regression.sh
```

### Run with visible browser (headed mode):
```bash
./run-dark-mode-visual-regression.sh --headed
```

### Run directly with Node:
```bash
node dark-mode-visual-regression-test.js
```

## Test Output

### Console Output
The test runner provides real-time feedback:
```
🎨 Starting Dark Mode Visual Regression Tests...

📍 Test 1: FAB Rendering and Positioning...
  ✓ FAB Rendering and Positioning

🌓 Test 2: Icon Changes (Sun/Moon)...
  ✓ Icon Changes

🎨 Test 3: Color Transitions...
  ✓ Color Transitions

✨ Test 4: Animation Smoothness...
  ✓ Animation Smoothness

📱 Test 5: Responsive Behavior...
  Testing Desktop (1920x1080)...
  Testing Tablet (768x1024)...
  Testing Mobile (375x667)...
  ✓ Responsive Behavior

♿ Test 6: Reduced Motion Mode...
  ✓ Reduced Motion Mode

============================================================
Test Suite: PASSED
Passed: 6
Failed: 0
============================================================
```

### HTML Report
Generated in `reports/` directory with:
- Test summary and status
- Detailed check results
- Screenshots for each test
- Interactive screenshot viewer

### JSON Results
Generated in `reports/` directory with:
- Machine-readable test results
- Detailed check data
- Timestamps and metadata

### Screenshots
Saved in `screenshots/` directory:
- `dark-mode-visual-fab-rendering-*.png`
- `dark-mode-visual-icon-before-toggle-*.png`
- `dark-mode-visual-icon-after-toggle-*.png`
- `dark-mode-visual-colors-before-*.png`
- `dark-mode-visual-colors-after-*.png`
- `dark-mode-visual-responsive-desktop-*.png`
- `dark-mode-visual-responsive-tablet-*.png`
- `dark-mode-visual-responsive-mobile-*.png`
- `dark-mode-visual-reduced-motion-before-*.png`
- `dark-mode-visual-reduced-motion-after-*.png`

## Configuration

Edit `CONFIG` object in `dark-mode-visual-regression-test.js`:

```javascript
const CONFIG = {
    baseUrl: 'http://localhost/wp-admin/admin.php?page=mase-settings',
    screenshotsDir: path.join(__dirname, 'screenshots'),
    reportsDir: path.join(__dirname, 'reports'),
    viewport: { width: 1920, height: 1080 },
    mobileViewport: { width: 375, height: 667 },
    tabletViewport: { width: 768, height: 1024 },
    timeout: 30000,
    transitionDuration: 300
};
```

## Troubleshooting

### WordPress Not Running
```
⚠️  Warning: WordPress may not be running at http://localhost
```
**Solution:** Start WordPress with Docker or local server

### Login Failed
```
⚠️  Login may have failed
```
**Solution:** Verify admin credentials (admin/admin123)

### FAB Not Found
```
❌ FAB not found in DOM
```
**Solution:** Ensure dark mode feature is enabled in MASE settings

### Playwright Not Installed
```
❌ Error: Playwright browsers not installed
```
**Solution:** Run `npx playwright install chromium`

## Integration with CI/CD

### GitHub Actions Example
```yaml
- name: Run Visual Regression Tests
  run: |
    cd tests/visual-testing
    npm install
    npx playwright install chromium
    ./run-dark-mode-visual-regression.sh
```

### Exit Codes
- `0`: All tests passed
- `1`: One or more tests failed or error occurred

## Requirements Mapping

| Requirement | Test | Check |
|-------------|------|-------|
| 1.1 | Test 1 | FAB rendering in bottom-right corner |
| 1.2 | Test 1, 2 | Sun/moon icon display and changes |
| 1.5 | Test 5 | Responsive behavior across viewports |
| 1.6 | Test 1 | High z-index for visibility |
| 1.7 | Test 2, 4 | Icon rotation animation |
| 9.1 | Test 3 | Color transitions with 0.3s duration |
| 9.2 | Test 3, 4 | Smooth transitions and animations |
| 9.3 | Test 4 | FAB disabled during transition |
| 9.4 | Test 4 | FAB re-enabled after transition |
| 9.5 | Test 4 | Transitioning class management |
| 9.6 | Test 6 | Reduced motion support |
| 9.7 | Test 6 | Instant mode switching with reduced motion |

## Development

### Adding New Tests
1. Create test function in `dark-mode-visual-regression-test.js`
2. Add to test runner in `runVisualRegressionTests()`
3. Update this README with test details

### Test Structure
```javascript
async function testNewFeature(browser, testResults) {
    const test = {
        name: 'Test Name',
        requirements: ['X.X'],
        status: 'unknown',
        checks: []
    };
    
    const context = await browser.newContext({ viewport: CONFIG.viewport });
    const page = await context.newPage();
    
    try {
        await loginAndNavigate(page);
        
        // Perform checks
        test.checks.push({
            name: 'Check description',
            passed: true/false,
            requirement: 'X.X',
            details: 'Additional info'
        });
        
        test.status = test.checks.every(c => c.passed) ? 'PASSED' : 'FAILED';
    } catch (error) {
        test.status = 'ERROR';
        test.error = error.message;
    } finally {
        await context.close();
        testResults.tests.push(test);
    }
}
```

## Related Documentation

- [Dark Mode Requirements](../../.kiro/specs/global-dark-light-mode-toggle/requirements.md)
- [Dark Mode Design](../../.kiro/specs/global-dark-light-mode-toggle/design.md)
- [Dark Mode Tasks](../../.kiro/specs/global-dark-light-mode-toggle/tasks.md)
- [Unit Tests](../unit/test-dark-mode-complete.test.js)
- [Integration Tests](../integration/test-dark-mode-comprehensive-integration.html)

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review test output and screenshots
3. Check browser console for JavaScript errors
4. Verify WordPress and MASE plugin are running correctly
