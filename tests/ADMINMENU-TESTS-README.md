# Admin Menu Enhancement Test Suite

Comprehensive test suite for admin menu enhancements in Modern Admin Styler (MASE).

## Test Coverage

This test suite covers all requirements for the admin menu comprehensive enhancement feature:

- Menu item spacing optimization (Requirement 1)
- Icon color synchronization (Requirement 2)
- Dynamic submenu positioning (Requirement 3)
- Height Mode persistence (Requirement 4)
- Live preview for all options (Requirement 5)
- Gradient backgrounds (Requirement 6)
- Submenu customization (Requirements 7-10)
- Google Fonts integration (Requirement 11)
- Individual corner radius (Requirement 12)
- Advanced shadows (Requirement 13)
- Width controls (Requirement 14)
- Floating margins (Requirement 15)
- Logo placement (Requirement 16)

## Test Types

### 1. Unit Tests

**Location:** `tests/unit/test-css-generator-adminmenu.php`

Tests CSS generation methods for all admin menu features:
- Menu item padding CSS
- Icon color CSS (auto and custom modes)
- Submenu positioning CSS
- Height Mode CSS (full and content)
- Gradient background CSS (linear, radial, conic)
- Border radius CSS (uniform and individual)
- Shadow CSS (preset and custom)
- Floating margin CSS (uniform and individual)
- Submenu styling CSS
- Logo placement CSS

**Run:**
```bash
php tests/unit/test-css-generator-adminmenu.php
```

### 2. Integration Tests

**Location:** `tests/integration/`

#### Settings Save/Load Tests
**File:** `test-adminmenu-settings-save-load.php`

Tests persistence of all admin menu settings:
- Height Mode persistence
- Padding settings
- Icon color settings
- Gradient settings
- Border radius settings
- Shadow settings
- Floating margin settings
- Submenu settings
- Logo settings
- Width unit settings

**Run:**
```bash
php tests/integration/test-adminmenu-settings-save-load.php
```

#### Live Preview Tests
**File:** `test-adminmenu-live-preview-complete.html`

Interactive HTML test page for live preview functionality:
- Height Mode live updates
- Padding live updates
- Icon color live updates
- Width and submenu positioning live updates
- Border radius live updates
- All visual effects live updates

**Run:**
Open in browser: `tests/integration/test-adminmenu-live-preview-complete.html`

### 3. Visual Tests

**Location:** `tests/visual-testing/`

**File:** `adminmenu-enhancement-visual-test.js`

Automated visual regression tests using Playwright:
- Menu item spacing at different padding values
- Submenu positioning at different menu widths (160px, 200px, 250px, 300px)
- Height Mode visual changes (full vs content)
- Logo display and positioning

**Run:**
```bash
cd tests/visual-testing
./run-adminmenu-visual-tests.sh
```

**Screenshots:** Saved to `tests/visual-testing/screenshots/`

### 4. Browser Compatibility Tests

**Location:** `tests/browser-compatibility/`

**File:** `test-adminmenu-browser-compat.js`

Tests on multiple browsers:
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

Tests all live preview functionality:
- Height Mode live preview
- Padding live preview
- Width and submenu live preview
- Icon color live preview
- Border Radius live preview
- Google Fonts loading

**Run:**
```bash
cd tests/browser-compatibility
./run-adminmenu-browser-tests.sh
```

## Quick Start

### Prerequisites

- PHP 7.4+ (for unit and integration tests)
- Node.js 14+ (for visual and browser tests)
- Playwright (auto-installed by test scripts)

### Run All Tests

```bash
# Unit tests
php tests/unit/test-css-generator-adminmenu.php

# Integration tests
php tests/integration/test-adminmenu-settings-save-load.php

# Visual tests
cd tests/visual-testing && ./run-adminmenu-visual-tests.sh

# Browser compatibility tests
cd tests/browser-compatibility && ./run-adminmenu-browser-tests.sh
```

### Run Individual Test Categories

```bash
# Only CSS generator tests
php tests/unit/test-css-generator-adminmenu.php

# Only settings persistence tests
php tests/integration/test-adminmenu-settings-save-load.php

# Only visual tests
cd tests/visual-testing && node adminmenu-enhancement-visual-test.js

# Only browser tests
cd tests/browser-compatibility && node test-adminmenu-browser-compat.js
```

## Test Results

### Expected Output

All tests should pass with 100% success rate. Example output:

```
=== Admin Menu CSS Generator Unit Tests ===

✓ PASS: Menu item padding CSS - Contains 'padding: 12px 18px'
✓ PASS: Icon color matches text color in auto mode - Contains 'color: #ffffff'
✓ PASS: Submenu left position matches menu width - Contains 'left: 200px'
✓ PASS: Full height mode CSS - Contains 'height: 100%'
✓ PASS: Linear gradient type - Contains 'linear-gradient'

=== Test Summary ===
Total: 25
Passed: 25
Failed: 0
Success Rate: 100.00%
```

## Troubleshooting

### Unit Tests Fail

**Issue:** Method not found errors

**Solution:** Ensure you're using the latest version of `class-mase-css-generator.php`

### Visual Tests Fail

**Issue:** Playwright not installed

**Solution:**
```bash
npm install playwright
npx playwright install
```

### Browser Tests Fail

**Issue:** Browser binaries missing

**Solution:**
```bash
npx playwright install chromium firefox webkit
```

### Screenshots Not Generated

**Issue:** Screenshots directory doesn't exist

**Solution:**
```bash
mkdir -p tests/visual-testing/screenshots
```

## Test Maintenance

### Adding New Tests

1. **Unit Tests:** Add new test methods to `test-css-generator-adminmenu.php`
2. **Integration Tests:** Add new test methods to `test-adminmenu-settings-save-load.php`
3. **Visual Tests:** Add new test functions to `adminmenu-enhancement-visual-test.js`
4. **Browser Tests:** Add new test functions to `test-adminmenu-browser-compat.js`

### Updating Tests

When CSS generation methods change:
1. Update unit tests to match new method signatures
2. Update expected CSS output in assertions
3. Re-run all tests to verify

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Unit Tests
  run: php tests/unit/test-css-generator-adminmenu.php

- name: Run Integration Tests
  run: php tests/integration/test-adminmenu-settings-save-load.php

- name: Run Visual Tests
  run: |
    cd tests/visual-testing
    npm install playwright
    npx playwright install
    node adminmenu-enhancement-visual-test.js

- name: Run Browser Tests
  run: |
    cd tests/browser-compatibility
    node test-adminmenu-browser-compat.js
```

## Related Documentation

- [Requirements Document](../.kiro/specs/admin-menu-comprehensive-enhancement/requirements.md)
- [Design Document](../.kiro/specs/admin-menu-comprehensive-enhancement/design.md)
- [Implementation Tasks](../.kiro/specs/admin-menu-comprehensive-enhancement/tasks.md)
- [User Guide](../docs/USER-GUIDE.md)
- [Developer Guide](../docs/DEVELOPER-GUIDE.md)
