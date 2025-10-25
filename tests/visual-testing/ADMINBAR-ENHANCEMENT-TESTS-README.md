# Admin Bar Enhancement Visual Tests

Comprehensive visual testing suite for the MASE Admin Bar Enhancement feature.

## Overview

This test suite validates all visual aspects of the admin bar comprehensive enhancement, including:

- **Test 18.1**: Text and Icon Alignment (Requirements: 1.1, 1.2, 1.3, 3.1, 3.2, 3.3)
- **Test 18.2**: Icon Color Synchronization (Requirements: 2.1, 2.2)
- **Test 18.3**: Floating Mode Layout (Requirements: 13.1, 13.2, 13.3, 13.4, 13.5)
- **Test 18.4**: Gradient Backgrounds (Requirements: 5.1, 5.2, 5.3)
- **Test 18.5**: Submenu Styling (Requirements: 6.1, 6.2, 6.3, 7.1-7.5)

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

### Quick Start

```bash
./run-adminbar-enhancement-test.sh
```

### Manual Execution

```bash
node adminbar-enhancement-test.js
```

### Headless Mode

By default, tests run in headed mode (browser visible). To run headless:

```javascript
// Edit adminbar-enhancement-test.js
const browser = await chromium.launch({ 
    headless: true,  // Change to true
    slowMo: 50 
});
```

## Test Details

### Test 18.1: Text and Icon Alignment

**Purpose**: Verify that text and icons in the admin bar are properly aligned at different heights.

**Test Cases**:
- Height 32px (default)
- Height 50px (medium)
- Height 100px (large)

**Validation**:
- Admin bar uses flexbox (`display: flex`)
- Items are vertically centered (`align-items: center`)
- Text and icons share the same baseline

**Expected Result**: All elements properly aligned at all tested heights.

---

### Test 18.2: Icon Color Synchronization

**Purpose**: Verify that icon colors automatically match text color changes.

**Test Cases**:
- Red (#ff0000)
- Green (#00ff00)
- Blue (#0000ff)
- Yellow (#ffff00)

**Validation**:
- Icon color matches text color
- Dashicons color matches
- SVG fill color matches
- Hover states work correctly

**Expected Result**: Icons always match the current text color.

---

### Test 18.3: Floating Mode Layout

**Purpose**: Verify that floating mode doesn't cause layout issues with the side menu.

**Test Cases**:
- Height 32px, Margin 8px
- Height 50px, Margin 16px
- Height 100px, Margin 24px

**Validation**:
- Admin bar floats above content
- Side menu has correct top padding
- No overlap between admin bar and side menu
- Padding equals height + margin

**Expected Result**: No overlap at any height/margin combination.

---

### Test 18.4: Gradient Backgrounds

**Purpose**: Verify that gradient backgrounds work correctly for all gradient types.

**Test Cases**:
- Linear gradients at 0°, 90°, 180°, 270°
- Radial gradient
- Conic gradient

**Validation**:
- Gradient is applied to admin bar
- `background-image` contains gradient CSS
- Multiple color stops work
- Angle changes affect linear gradients

**Expected Result**: All gradient types render correctly.

---

### Test 18.5: Submenu Styling

**Purpose**: Verify that submenu styling controls work independently from admin bar.

**Test Cases**:
- Background color change
- Border radius adjustment
- Spacing from admin bar
- Typography changes (font size, color)

**Validation**:
- Submenu background color applies
- Border radius rounds corners
- Spacing adjusts vertical offset
- Typography changes affect submenu text

**Expected Result**: All submenu styling options work correctly.

## Test Output

### Screenshots

All screenshots are saved to `tests/visual-testing/screenshots/` with descriptive filenames:

```
adminbar-alignment-height-32px-2025-10-23T12-00-00-000Z.png
adminbar-icon-color-ff0000-2025-10-23T12-00-05-000Z.png
adminbar-floating-h50-m16-2025-10-23T12-00-10-000Z.png
adminbar-gradient-linear-90deg-2025-10-23T12-00-15-000Z.png
adminbar-submenu-typography-2025-10-23T12-00-20-000Z.png
```

### Reports

Test reports are generated in two formats:

1. **HTML Report**: `tests/visual-testing/reports/adminbar-enhancement-test-[timestamp].html`
   - Visual report with embedded screenshots
   - Test status summary
   - Detailed results for each test
   - Click screenshots to view full size

2. **JSON Report**: `tests/visual-testing/reports/adminbar-enhancement-test-[timestamp].json`
   - Machine-readable test results
   - Detailed test data
   - Suitable for CI/CD integration

## Interpreting Results

### Test Status

- **PASSED** ✅: All validations passed
- **FAILED** ❌: One or more validations failed
- **ERROR** ⚠️: Test encountered an error

### Common Issues

**Issue**: "Admin bar or items not found"
- **Cause**: Page not fully loaded or MASE not active
- **Solution**: Increase wait times or verify plugin activation

**Issue**: "Icons don't match text color"
- **Cause**: CSS not applied or live preview not working
- **Solution**: Check CSS generator and JavaScript event handlers

**Issue**: "Admin bar overlaps side menu"
- **Cause**: Floating layout fix not applied
- **Solution**: Verify `generate_floating_layout_fixes()` method

**Issue**: "Gradient not applied"
- **Cause**: Background type not set to gradient
- **Solution**: Check gradient CSS generation logic

## Troubleshooting

### WordPress Not Running

```bash
# Start WordPress (if using Docker)
docker-compose up -d

# Or start local server
php -S localhost:80 -t /path/to/wordpress
```

### Playwright Installation Issues

```bash
# Reinstall Playwright
npm uninstall playwright
npm install playwright
npx playwright install chromium
```

### Login Failures

Update credentials in `adminbar-enhancement-test.js`:

```javascript
await page.fill('#user_login', 'your-username');
await page.fill('#user_pass', 'your-password');
```

### Timeout Errors

Increase timeout in CONFIG:

```javascript
const CONFIG = {
    timeout: 60000  // Increase to 60 seconds
};
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Visual Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: |
          cd tests/visual-testing
          npm install
          npx playwright install chromium
      - name: Start WordPress
        run: docker-compose up -d
      - name: Run tests
        run: ./tests/visual-testing/run-adminbar-enhancement-test.sh
      - name: Upload screenshots
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: screenshots
          path: tests/visual-testing/screenshots/
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: reports
          path: tests/visual-testing/reports/
```

## Maintenance

### Adding New Tests

1. Create new test function following the pattern:
```javascript
async function testNewFeature(page, testResults) {
    const testResult = {
        id: '18.X',
        name: 'New Feature Test',
        requirements: ['X.X'],
        status: 'PASSED',
        details: [],
        screenshots: []
    };
    
    // Test implementation
    
    testResults.tests.push(testResult);
}
```

2. Add to main test runner:
```javascript
await testNewFeature(page, testResults);
```

### Updating Test Cases

Modify test configurations in each test function:

```javascript
const testColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
const heights = [32, 50, 100];
const gradientTypes = ['linear', 'radial', 'conic'];
```

## Support

For issues or questions:
- Check existing test reports for similar failures
- Review WordPress debug logs
- Verify MASE plugin is up to date
- Consult the main MASE documentation

## License

GPL-2.0-or-later
