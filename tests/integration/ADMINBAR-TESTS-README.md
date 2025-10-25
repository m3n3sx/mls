# Admin Bar Enhancement Integration Tests

This directory contains comprehensive integration tests for the Admin Bar enhancement feature (Task 17).

## Test Files

### 17.1 Settings Save and Load
**File:** `test-adminbar-settings-save-load.php`

Tests all new Admin Bar settings save and load functionality:
- Gradient background settings
- Width controls (pixels/percentage)
- Individual corner radius settings
- Advanced shadow settings
- Individual floating margin settings
- Submenu styling settings
- Font family settings
- Default values verification
- Backward compatibility

**How to Run:**
```bash
# Via browser (requires WordPress admin access)
http://your-site.com/wp-content/plugins/modern-admin-styler/tests/integration/test-adminbar-settings-save-load.php?run_adminbar_saveload_tests=1

# Via WP-CLI
wp eval-file tests/integration/test-adminbar-settings-save-load.php
```

**Requirements Tested:** All (1-13)

---

### 17.2 Live Preview Updates
**File:** `test-adminbar-live-preview.html`

Tests real-time preview updates for all controls:
- Color picker updates (background, text, hover)
- Slider updates (height, width, border radius)
- Selector updates (gradient type, shadow preset)
- Toggle updates (glassmorphism, floating mode)
- Performance testing (<100ms update time)

**How to Run:**
```bash
# Open in browser
open tests/integration/test-adminbar-live-preview.html
# or
firefox tests/integration/test-adminbar-live-preview.html
```

**Requirements Tested:** 4.1-4.8

---

### 17.3 Google Font Loading
**File:** `test-adminbar-google-fonts.html`

Tests Google Font loading functionality:
- Font loading success
- Font loading failure handling
- Font caching mechanism
- Fallback fonts
- Multiple font loading

**How to Run:**
```bash
# Open in browser
open tests/integration/test-adminbar-google-fonts.html
# or
firefox tests/integration/test-adminbar-google-fonts.html
```

**Requirements Tested:** 8.2, 8.3

---

### 17.4 Conditional Field Visibility
**File:** `test-adminbar-conditional-fields.html`

Tests conditional field show/hide functionality:
- Gradient controls visibility (based on background type)
- Individual corner controls (based on radius mode)
- Individual margin controls (based on margin mode)
- Custom shadow controls (based on shadow mode)
- Multiple conditional fields simultaneously

**How to Run:**
```bash
# Open in browser
open tests/integration/test-adminbar-conditional-fields.html
# or
firefox tests/integration/test-adminbar-conditional-fields.html
```

**Requirements Tested:** 5.5, 9.3, 10.3, 11.3

---

## Running All Tests

### PHP Tests
```bash
# Run settings save/load test
php tests/integration/test-adminbar-settings-save-load.php
```

### HTML Tests
```bash
# Open all HTML tests in browser
open tests/integration/test-adminbar-live-preview.html
open tests/integration/test-adminbar-google-fonts.html
open tests/integration/test-adminbar-conditional-fields.html
```

### Automated Testing
For CI/CD integration, use a headless browser like Puppeteer or Playwright:

```javascript
// Example with Playwright
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Test live preview
  await page.goto('file://' + __dirname + '/test-adminbar-live-preview.html');
  await page.click('button:has-text("Run Test 1")');
  // ... check results
  
  await browser.close();
})();
```

---

## Test Coverage

### Requirements Coverage
- **Requirement 1-3:** Text/icon alignment, color sync, dynamic positioning
- **Requirement 4:** Live preview for all options (4.1-4.8)
- **Requirement 5:** Gradient backgrounds (5.1-5.5)
- **Requirement 6-7:** Submenu styling and typography (6.1-6.3, 7.1-7.5)
- **Requirement 8:** Font family selection (8.1-8.5)
- **Requirement 9:** Individual corner radius (9.1-9.5)
- **Requirement 10:** Advanced shadows (10.1-10.5)
- **Requirement 11:** Width controls (11.1-11.5)
- **Requirement 12:** Individual floating margins (12.1-12.5)
- **Requirement 13:** Floating mode layout fix (13.1-13.5)

### Test Statistics
- **Total Tests:** 40+
- **PHP Tests:** 9 test methods
- **HTML Tests:** 15+ interactive tests
- **Coverage:** All requirements (1-13)

---

## Expected Results

### Pass Criteria
- All settings save and load correctly
- Live preview updates within 100ms
- Google Fonts load successfully
- Conditional fields show/hide correctly
- Backward compatibility maintained
- Default values present

### Common Issues
1. **Font loading failures:** Check internet connection and Google Fonts API availability
2. **Slow preview updates:** Check browser performance and CSS complexity
3. **Settings not saving:** Verify WordPress database permissions
4. **Conditional fields not hiding:** Check JavaScript console for errors

---

## Troubleshooting

### PHP Tests
```bash
# Enable WordPress debug mode
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);

# Check error log
tail -f wp-content/debug.log
```

### HTML Tests
```javascript
// Open browser console (F12)
// Check for JavaScript errors
// Verify jQuery is loaded
console.log(jQuery.fn.jquery);
```

---

## Contributing

When adding new tests:
1. Follow existing test structure
2. Include clear test descriptions
3. Test both success and failure cases
4. Document requirements tested
5. Update this README

---

## Related Documentation
- [Requirements Document](../../.kiro/specs/adminbar-comprehensive-enhancement/requirements.md)
- [Design Document](../../.kiro/specs/adminbar-comprehensive-enhancement/design.md)
- [Tasks Document](../../.kiro/specs/adminbar-comprehensive-enhancement/tasks.md)
