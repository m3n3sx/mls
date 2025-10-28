# Visual Interactive Testing - Helper Functions

This document provides comprehensive documentation for all helper functions available in the TestHelpers class. These functions simplify common testing operations and provide a consistent interface for test scenarios.

## Table of Contents

- [Navigation Helpers](#navigation-helpers)
- [Setting Manipulation](#setting-manipulation)
- [Live Preview Helpers](#live-preview-helpers)
- [Visual Verification](#visual-verification)
- [Palette Operations](#palette-operations)
- [Template Operations](#template-operations)
- [Import/Export Operations](#importexport-operations)
- [Console Monitoring](#console-monitoring)
- [AJAX Helpers](#ajax-helpers)
- [Assertions](#assertions)
- [Pause Helpers](#pause-helpers)
- [Viewport Helpers](#viewport-helpers)
- [Common Patterns](#common-patterns)

---

## Navigation Helpers

### `loginToWordPress(username, password)`

Logs into WordPress admin panel.

**Parameters:**
- `username` (string): WordPress username
- `password` (string): WordPress password

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.loginToWordPress('admin', 'admin');
```

**Notes:**
- Automatically called by the test runner before executing scenarios
- Waits for successful login and dashboard load
- Handles login errors gracefully

---

### `navigateToSettings()`

Navigates to the MASE settings page.

**Parameters:** None

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.navigateToSettings();
```

**Notes:**
- Waits for page load and settings form to be ready
- Automatically called before test execution
- URL: `/wp-admin/admin.php?page=mase-settings`

---

### `navigateToTab(tabName)`

Navigates to a specific tab within the MASE settings page.

**Parameters:**
- `tabName` (string): Name of the tab to navigate to

**Available Tabs:**
- `'admin-bar'` - Admin Bar settings
- `'menu'` - Menu settings
- `'content'` - Content area settings
- `'typography'` - Typography settings
- `'buttons'` - Universal Buttons settings
- `'effects'` - Visual Effects settings
- `'templates'` - Templates management
- `'palettes'` - Color Palettes management
- `'backgrounds'` - Background settings
- `'widgets'` - Dashboard Widgets settings
- `'form-controls'` - Form Controls settings
- `'login'` - Login Page settings
- `'advanced'` - Advanced settings

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.navigateToTab('admin-bar');
await helpers.navigateToTab('typography');
```

**Notes:**
- Waits for tab content to load
- Validates tab name before navigation
- Throws error if tab doesn't exist

---

## Setting Manipulation

### `changeSetting(fieldName, value)`

Changes a plugin setting value.

**Parameters:**
- `fieldName` (string): Name attribute of the form field
- `value` (string|number|boolean): New value for the setting

**Returns:** Promise<void>

**Field Types Supported:**
- Text inputs
- Color pickers
- Select dropdowns
- Checkboxes
- Radio buttons
- Number inputs
- Textareas

**Examples:**
```javascript
// Change color setting
await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');

// Change text setting
await helpers.changeSetting('admin_bar[font_size]', '16');

// Change select dropdown
await helpers.changeSetting('menu[height_mode]', 'full');

// Change checkbox
await helpers.changeSetting('effects[enable_animations]', true);
```

**Field Name Format:**
- Admin Bar: `admin_bar[property]`
- Menu: `menu[property]`
- Content: `content[property]`
- Typography: `typography[property]`
- Buttons: `buttons[property]`
- Effects: `effects[property]`

**Notes:**
- Automatically detects field type
- Triggers appropriate events (change, input, click)
- Works with Live Preview when enabled

---

### `saveSettings()`

Saves all current settings via AJAX.

**Parameters:** None

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.saveSettings();
```

**Notes:**
- Clicks the "Save Settings" button
- Waits for AJAX request to complete
- Waits for success notification
- Throws error if save fails

---

### `verifySetting(fieldName, expectedValue)`

Verifies that a setting has the expected value.

**Parameters:**
- `fieldName` (string): Name attribute of the form field
- `expectedValue` (string|number|boolean): Expected value

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.verifySetting('admin_bar[bg_color]', '#FF0000');
```

**Notes:**
- Reads current value from form field
- Throws assertion error if value doesn't match
- Useful for verifying persistence after page reload

---

### `resetSettings()`

Resets all settings to default values.

**Parameters:** None

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.resetSettings();
```

**Notes:**
- Navigates to Advanced tab
- Clicks "Reset to Defaults" button
- Confirms the reset dialog
- Waits for reset to complete

---

## Live Preview Helpers

### `enableLivePreview()`

Enables the Live Preview feature.

**Parameters:** None

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.enableLivePreview();
```

**Notes:**
- Checks the Live Preview toggle
- Waits for Live Preview to initialize
- Verifies Live Preview is active

---

### `disableLivePreview()`

Disables the Live Preview feature.

**Parameters:** None

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.disableLivePreview();
```

**Notes:**
- Unchecks the Live Preview toggle
- Waits for Live Preview to deactivate
- Changes won't appear until saved

---

### `waitForLivePreview(timeout = 1000)`

Waits for Live Preview to apply changes.

**Parameters:**
- `timeout` (number, optional): Maximum wait time in milliseconds (default: 1000)

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
await helpers.waitForLivePreview();
// Color is now applied in the preview
```

**Notes:**
- Waits for CSS injection to complete
- Waits for visual updates to render
- Use after every setting change when Live Preview is enabled

---

## Visual Verification

### `takeScreenshot(name, options = {})`

Captures a screenshot of the current page state.

**Parameters:**
- `name` (string): Name for the screenshot (without extension)
- `options` (object, optional): Screenshot options
  - `fullPage` (boolean): Capture full page (default: false)
  - `selector` (string): Capture specific element only

**Returns:** Promise<string> - Path to screenshot file

**Examples:**
```javascript
// Basic screenshot
await helpers.takeScreenshot('admin-bar-initial');

// Full page screenshot
await helpers.takeScreenshot('full-page', { fullPage: true });

// Element screenshot
await helpers.takeScreenshot('menu-only', { 
  selector: '#adminmenu' 
});
```

**Notes:**
- Screenshots saved to `test-results/visual-interactive/screenshots/`
- Automatically included in test reports
- PNG format with timestamp

---

### `getComputedStyle(selector, property)`

Gets the computed CSS style of an element.

**Parameters:**
- `selector` (string): CSS selector for the element
- `property` (string): CSS property name (camelCase)

**Returns:** Promise<string> - Computed style value

**Examples:**
```javascript
// Get background color
const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
// Returns: 'rgb(255, 0, 0)'

// Get font size
const fontSize = await helpers.getComputedStyle('#adminmenu', 'fontSize');
// Returns: '16px'

// Get display property
const display = await helpers.getComputedStyle('.mase-panel', 'display');
// Returns: 'block'
```

**Notes:**
- Returns computed values (not CSS source values)
- Colors returned in RGB format
- Sizes returned with units (px, em, etc.)

---

### `verifyColor(selector, expectedColor)`

Verifies that an element has the expected color.

**Parameters:**
- `selector` (string): CSS selector for the element
- `expectedColor` (string): Expected color (hex, rgb, or color name)

**Returns:** Promise<void>

**Examples:**
```javascript
// Verify with hex color
await helpers.verifyColor('#wpadminbar', '#FF0000');

// Verify with RGB
await helpers.verifyColor('#wpadminbar', 'rgb(255, 0, 0)');

// Verify with color name
await helpers.verifyColor('#wpadminbar', 'red');
```

**Notes:**
- Automatically converts between color formats
- Checks both color and backgroundColor properties
- Throws assertion error if color doesn't match

---

### `verifyVisibility(selector, shouldBeVisible)`

Verifies that an element is visible or hidden.

**Parameters:**
- `selector` (string): CSS selector for the element
- `shouldBeVisible` (boolean): Expected visibility state

**Returns:** Promise<void>

**Examples:**
```javascript
// Verify element is visible
await helpers.verifyVisibility('.mase-panel', true);

// Verify element is hidden
await helpers.verifyVisibility('.mase-hidden', false);
```

**Notes:**
- Checks display, visibility, and opacity properties
- Considers element dimensions
- Throws assertion error if visibility doesn't match

---

## Palette Operations

### `applyPalette(paletteId)`

Applies a color palette.

**Parameters:**
- `paletteId` (string): ID of the palette to apply

**Available Palettes:**
- `'default'` - Default WordPress colors
- `'ocean-blue'` - Ocean Blue palette
- `'forest-green'` - Forest Green palette
- `'sunset-orange'` - Sunset Orange palette
- `'midnight-purple'` - Midnight Purple palette
- `'creative-purple'` - Creative Purple palette

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.applyPalette('ocean-blue');
```

**Notes:**
- Navigates to Palettes section if needed
- Clicks the palette card
- Confirms application dialog
- Waits for colors to update
- Verifies "Active" badge appears

---

### `saveCustomPalette(name, colors)`

Saves a custom color palette.

**Parameters:**
- `name` (string): Name for the custom palette
- `colors` (object): Color values for the palette
  - `primary` (string): Primary color
  - `secondary` (string): Secondary color
  - `accent` (string): Accent color
  - (additional colors as needed)

**Returns:** Promise<string> - ID of the saved palette

**Example:**
```javascript
const paletteId = await helpers.saveCustomPalette('My Palette', {
  primary: '#FF0000',
  secondary: '#00FF00',
  accent: '#0000FF'
});
```

**Notes:**
- Opens the "Save Custom Palette" dialog
- Fills in palette name and colors
- Saves and waits for confirmation
- Returns palette ID for later use

---

### `deleteCustomPalette(paletteId)`

Deletes a custom color palette.

**Parameters:**
- `paletteId` (string): ID of the palette to delete

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.deleteCustomPalette('my-custom-palette');
```

**Notes:**
- Finds the palette card
- Clicks delete button
- Confirms deletion dialog
- Waits for palette to be removed
- Cannot delete predefined palettes

---

## Template Operations

### `applyTemplate(templateId)`

Applies a template configuration.

**Parameters:**
- `templateId` (string): ID of the template to apply

**Available Templates:**
- `'default'` - Default WordPress theme
- `'modern-dark'` - Modern Dark theme
- `'minimal-light'` - Minimal Light theme
- `'professional'` - Professional theme
- `'creative'` - Creative theme

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.applyTemplate('modern-dark');
```

**Notes:**
- Navigates to Templates tab if needed
- Clicks the template card
- Confirms application dialog
- Waits for settings to update
- Verifies "Active" badge appears

---

### `saveCustomTemplate(name, settings)`

Saves current settings as a custom template.

**Parameters:**
- `name` (string): Name for the custom template
- `settings` (object, optional): Specific settings to save (defaults to current)

**Returns:** Promise<string> - ID of the saved template

**Example:**
```javascript
const templateId = await helpers.saveCustomTemplate('My Template');
```

**Notes:**
- Opens the "Save Custom Template" dialog
- Fills in template name
- Saves current configuration
- Returns template ID for later use

---

### `deleteCustomTemplate(templateId)`

Deletes a custom template.

**Parameters:**
- `templateId` (string): ID of the template to delete

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.deleteCustomTemplate('my-custom-template');
```

**Notes:**
- Finds the template card
- Clicks delete button
- Confirms deletion dialog
- Waits for template to be removed
- Cannot delete predefined templates

---

## Import/Export Operations

### `exportSettings()`

Exports current settings to a JSON file.

**Parameters:** None

**Returns:** Promise<string> - Path to exported file

**Example:**
```javascript
const exportPath = await helpers.exportSettings();
console.log('Settings exported to:', exportPath);
```

**Notes:**
- Navigates to Advanced tab if needed
- Clicks "Export Settings" button
- Waits for download to complete
- Returns path to downloaded file

---

### `importSettings(filePath)`

Imports settings from a JSON file.

**Parameters:**
- `filePath` (string): Path to the JSON file to import

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.importSettings('./my-settings.json');
```

**Notes:**
- Navigates to Advanced tab if needed
- Uploads the file
- Waits for import to complete
- Verifies settings were applied

---

### `createBackup()`

Creates a backup of current settings.

**Parameters:** None

**Returns:** Promise<string> - ID of the created backup

**Example:**
```javascript
const backupId = await helpers.createBackup();
```

**Notes:**
- Navigates to Advanced tab if needed
- Clicks "Create Backup" button
- Waits for backup to be created
- Returns backup ID for restoration

---

### `restoreBackup(backupId)`

Restores settings from a backup.

**Parameters:**
- `backupId` (string): ID of the backup to restore

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.restoreBackup('backup-2025-10-27-123456');
```

**Notes:**
- Navigates to Advanced tab if needed
- Finds the backup in the list
- Clicks restore button
- Confirms restoration dialog
- Waits for settings to be restored

---

## Console Monitoring

### `startConsoleMonitoring()`

Starts monitoring browser console for errors.

**Parameters:** None

**Returns:** void

**Example:**
```javascript
helpers.startConsoleMonitoring();
// ... perform test actions ...
const errors = helpers.getConsoleErrors();
```

**Notes:**
- Automatically started by test runner
- Captures console.error, console.warn
- Filters out non-critical errors (favicon, extensions)

---

### `getConsoleErrors()`

Gets all console errors captured since monitoring started.

**Parameters:** None

**Returns:** Array<Object> - Array of error objects

**Example:**
```javascript
const errors = helpers.getConsoleErrors();
errors.forEach(error => {
  console.log('Error:', error.message);
  console.log('Type:', error.type);
  console.log('Timestamp:', error.timestamp);
});
```

**Error Object Structure:**
```javascript
{
  type: 'error' | 'warning',
  message: 'Error message',
  timestamp: '2025-10-27T10:30:00Z',
  stack: 'Stack trace...'
}
```

---

### `clearConsoleErrors()`

Clears the console error log.

**Parameters:** None

**Returns:** void

**Example:**
```javascript
helpers.clearConsoleErrors();
// Start fresh error tracking
```

---

## AJAX Helpers

### `waitForAjaxComplete(timeout = 10000)`

Waits for all AJAX requests to complete.

**Parameters:**
- `timeout` (number, optional): Maximum wait time in milliseconds (default: 10000)

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.saveSettings();
await helpers.waitForAjaxComplete();
// All AJAX requests are now complete
```

**Notes:**
- Monitors jQuery.active counter
- Waits for counter to reach 0
- Throws timeout error if requests don't complete

---

### `waitForResponse(urlPattern, timeout = 10000)`

Waits for a specific AJAX response.

**Parameters:**
- `urlPattern` (string|RegExp): URL pattern to match
- `timeout` (number, optional): Maximum wait time in milliseconds (default: 10000)

**Returns:** Promise<Object> - Response object

**Example:**
```javascript
const response = await helpers.waitForResponse('/wp-admin/admin-ajax.php');
console.log('Response:', response.status, response.data);
```

**Notes:**
- Intercepts network requests
- Matches URL against pattern
- Returns response when matched
- Throws timeout error if not found

---

## Assertions

### `assert.equals(actual, expected, message)`

Asserts that two values are equal.

**Parameters:**
- `actual` (any): Actual value
- `expected` (any): Expected value
- `message` (string): Assertion message

**Returns:** void (throws on failure)

**Example:**
```javascript
const fontSize = await helpers.getComputedStyle('#wpadminbar', 'fontSize');
helpers.assert.equals(fontSize, '16px', 'Font size should be 16px');
```

---

### `assert.contains(actual, substring, message)`

Asserts that a string contains a substring.

**Parameters:**
- `actual` (string): Actual string
- `substring` (string): Expected substring
- `message` (string): Assertion message

**Returns:** void (throws on failure)

**Example:**
```javascript
const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
helpers.assert.contains(bgColor, '255, 0, 0', 'Background should be red');
```

---

### `assert.isTrue(value, message)`

Asserts that a value is true.

**Parameters:**
- `value` (any): Value to check
- `message` (string): Assertion message

**Returns:** void (throws on failure)

**Example:**
```javascript
const isVisible = await page.isVisible('.mase-panel');
helpers.assert.isTrue(isVisible, 'Panel should be visible');
```

---

### `assert.isFalse(value, message)`

Asserts that a value is false.

**Parameters:**
- `value` (any): Value to check
- `message` (string): Assertion message

**Returns:** void (throws on failure)

**Example:**
```javascript
const isHidden = await page.isHidden('.mase-hidden');
helpers.assert.isFalse(isHidden, 'Element should not be hidden');
```

---

## Pause Helpers

### `pause(duration)`

Pauses test execution for a specified duration.

**Parameters:**
- `duration` (number): Pause duration in milliseconds

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.pause(2000); // Pause for 2 seconds
```

**Notes:**
- Useful in interactive mode for visual inspection
- Not recommended in headless mode
- Use sparingly to avoid slow tests

---

### `pauseForInspection(message)`

Pauses test execution and displays a message (interactive mode only).

**Parameters:**
- `message` (string): Message to display

**Returns:** Promise<void>

**Example:**
```javascript
await helpers.pauseForInspection('Check the admin bar color');
// Test pauses, user can inspect, press Enter to continue
```

**Notes:**
- Only works in interactive mode
- Displays message in console
- Waits for user to press Enter
- No-op in headless mode

---

## Viewport Helpers

### `setViewport(width, height)`

Sets the browser viewport size.

**Parameters:**
- `width` (number): Viewport width in pixels
- `height` (number): Viewport height in pixels

**Returns:** Promise<void>

**Example:**
```javascript
// Desktop
await helpers.setViewport(1920, 1080);

// Tablet
await helpers.setViewport(768, 1024);

// Mobile
await helpers.setViewport(375, 667);
```

**Predefined Sizes:**
- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667

---

## Common Patterns

### Pattern 1: Test Single Setting with Live Preview

```javascript
async execute(page, helpers) {
  // Navigate and enable Live Preview
  await helpers.navigateToTab('admin-bar');
  await helpers.enableLivePreview();
  
  // Change setting
  await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
  await helpers.waitForLivePreview();
  
  // Verify visual change
  const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
  helpers.assert.contains(bgColor, '255, 0, 0', 'Background should be red');
  
  // Screenshot
  await helpers.takeScreenshot('admin-bar-red');
}
```

### Pattern 2: Test Setting Persistence

```javascript
async execute(page, helpers) {
  // Change and save
  await helpers.navigateToTab('admin-bar');
  await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
  await helpers.saveSettings();
  
  // Reload and verify
  await page.reload({ waitUntil: 'networkidle' });
  await helpers.navigateToTab('admin-bar');
  await helpers.verifySetting('admin_bar[bg_color]', '#FF0000');
}
```

### Pattern 3: Test Multiple Related Settings

```javascript
async execute(page, helpers) {
  await helpers.navigateToTab('admin-bar');
  await helpers.enableLivePreview();
  
  // Change multiple settings
  await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
  await helpers.waitForLivePreview();
  
  await helpers.changeSetting('admin_bar[text_color]', '#FFFFFF');
  await helpers.waitForLivePreview();
  
  await helpers.changeSetting('admin_bar[font_size]', '16');
  await helpers.waitForLivePreview();
  
  // Verify all changes
  const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
  helpers.assert.contains(bgColor, '255, 0, 0');
  
  const textColor = await helpers.getComputedStyle('#wpadminbar', 'color');
  helpers.assert.contains(textColor, '255, 255, 255');
  
  const fontSize = await helpers.getComputedStyle('#wpadminbar', 'fontSize');
  helpers.assert.equals(fontSize, '16px');
}
```

### Pattern 4: Test Palette Application

```javascript
async execute(page, helpers) {
  // Apply palette
  await helpers.applyPalette('ocean-blue');
  
  // Verify multiple colors changed
  await helpers.navigateToTab('admin-bar');
  const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
  helpers.assert.contains(bgColor, '0, 119, 179'); // Ocean blue
  
  // Verify Active badge
  const badge = await page.locator('.mase-palette-card[data-palette="ocean-blue"] .mase-active-badge');
  helpers.assert.isTrue(await badge.isVisible(), 'Active badge should be visible');
}
```

### Pattern 5: Test Import/Export

```javascript
async execute(page, helpers) {
  // Export current settings
  const exportPath = await helpers.exportSettings();
  
  // Change settings
  await helpers.navigateToTab('admin-bar');
  await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
  await helpers.saveSettings();
  
  // Import original settings
  await helpers.importSettings(exportPath);
  
  // Verify original settings restored
  await page.reload({ waitUntil: 'networkidle' });
  await helpers.navigateToTab('admin-bar');
  const bgColor = await page.inputValue('input[name="admin_bar[bg_color]"]');
  helpers.assert.equals(bgColor, '#23282d', 'Should restore original color');
}
```

### Pattern 6: Responsive Testing

```javascript
async execute(page, helpers) {
  const viewports = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ];
  
  for (const viewport of viewports) {
    await helpers.setViewport(viewport.width, viewport.height);
    await helpers.takeScreenshot(`responsive-${viewport.name.toLowerCase()}`);
    
    // Verify interface is functional
    const menuVisible = await page.isVisible('#adminmenu');
    helpers.assert.isTrue(menuVisible, `Menu should be visible on ${viewport.name}`);
  }
}
```

---

## Tips and Best Practices

1. **Always use try-catch**: Wrap test logic in try-catch to handle errors gracefully
2. **Take screenshots**: Capture screenshots at key points for debugging
3. **Use descriptive names**: Name screenshots and assertions clearly
4. **Wait appropriately**: Use waitForLivePreview, waitForAjaxComplete as needed
5. **Clean up**: Reset settings if your test modifies global state
6. **Test independence**: Don't rely on other tests running first
7. **Stable selectors**: Use IDs and data attributes over classes
8. **Meaningful assertions**: Include descriptive messages in assertions
9. **Console monitoring**: Check for JavaScript errors after each test
10. **Document your tests**: Add comments explaining what you're testing

---

## Troubleshooting

### Element Not Found
```javascript
// Check if element exists before interacting
const exists = await page.locator(selector).count() > 0;
if (!exists) {
  throw new Error(`Element not found: ${selector}`);
}
```

### Timeout Errors
```javascript
// Increase timeout for slow operations
await helpers.waitForAjaxComplete(30000); // 30 seconds
```

### Assertion Failures
```javascript
// Log actual value for debugging
const actual = await helpers.getComputedStyle(selector, property);
console.log('Actual value:', actual);
helpers.assert.equals(actual, expected, 'Message');
```

### Live Preview Not Working
```javascript
// Verify Live Preview is enabled
const isEnabled = await page.isChecked('#mase-live-preview-toggle');
if (!isEnabled) {
  await helpers.enableLivePreview();
}
```

---

For more examples, see the test scenarios in `tests/visual-interactive/scenarios/`.
