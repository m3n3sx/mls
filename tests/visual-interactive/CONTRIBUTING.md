# Contributing to Visual Interactive Testing

This guide explains how to add new test scenarios to the MASE visual interactive testing system. Whether you're testing a new feature or improving coverage of existing functionality, this document will help you create effective test scenarios.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Organization](#test-organization)
- [Creating a New Test Scenario](#creating-a-new-test-scenario)
- [Naming Conventions](#naming-conventions)
- [Test Structure](#test-structure)
- [Writing Effective Tests](#writing-effective-tests)
- [Testing Checklist](#testing-checklist)
- [Running Your Tests](#running-your-tests)
- [Debugging Tests](#debugging-tests)
- [Best Practices](#best-practices)

## Quick Start

1. Copy the template file:
   ```bash
   cp tests/visual-interactive/scenarios/TEMPLATE.spec.cjs \
      tests/visual-interactive/scenarios/[category]/[feature].spec.cjs
   ```

2. Update the metadata (name, description, tab, tags)

3. Write your test logic in the `execute()` function

4. Run your test:
   ```bash
   npm run test:visual -- --test "[your-test-name]"
   ```

## Test Organization

Tests are organized by plugin tab/feature in subdirectories:

```
scenarios/
├── admin-bar/          # Admin Bar tab tests
├── menu/               # Menu tab tests
├── content/            # Content tab tests
├── typography/         # Typography tab tests
├── buttons/            # Universal Buttons tab tests
├── effects/            # Visual Effects tab tests
├── templates/          # Template management tests
├── palettes/           # Palette management tests
├── backgrounds/        # Background settings tests
├── widgets/            # Dashboard Widgets tests
├── form-controls/      # Form Controls tests
├── login/              # Login Page tests
├── advanced/           # Advanced settings tests
├── responsive/         # Responsive/viewport tests
└── live-preview/       # Live Preview feature tests
```


### Choosing the Right Directory

- **Feature-specific tests**: Place in the tab directory (e.g., `admin-bar/colors.spec.cjs`)
- **Cross-feature tests**: Place in appropriate category (e.g., `live-preview/comprehensive.spec.cjs`)
- **Responsive tests**: Place in `responsive/` directory
- **Integration tests**: Place in the most relevant feature directory

## Creating a New Test Scenario

### Step 1: Copy the Template

Start with the template file to ensure you have the correct structure:

```bash
cp tests/visual-interactive/scenarios/TEMPLATE.spec.cjs \
   tests/visual-interactive/scenarios/admin-bar/my-new-test.spec.cjs
```

### Step 2: Update Metadata

Edit the metadata section at the top of your file:

```javascript
module.exports = {
  name: 'Admin Bar Custom Feature',
  description: 'Test the custom feature in Admin Bar tab',
  tab: 'admin-bar',
  tags: ['visual', 'smoke'],
  
  async execute(page, helpers) {
    // Your test logic here
  }
};
```

**Metadata Fields:**

- **name** (required): Human-readable test name shown in reports
- **description** (required): Brief description of what the test validates
- **tab** (required): Plugin tab this test belongs to
- **tags** (required): Array of tags for filtering and categorization

### Step 3: Write Test Logic

Implement the `execute()` function with your test steps:

```javascript
async execute(page, helpers) {
  try {
    const startTime = Date.now();
    
    // 1. Navigate to the appropriate tab
    await helpers.navigateToTab('admin-bar');
    
    // 2. Take initial screenshot
    await helpers.takeScreenshot('initial-state');
    
    // 3. Perform test actions
    await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
    await helpers.waitForLivePreview();
    
    // 4. Verify results
    const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
    helpers.assert.contains(bgColor, '255, 0, 0', 'Background should be red');
    
    // 5. Take final screenshot
    await helpers.takeScreenshot('final-state');
    
    // 6. Return success
    return {
      passed: true,
      duration: Date.now() - startTime,
      screenshots: ['initial-state', 'final-state']
    };
    
  } catch (error) {
    await helpers.takeScreenshot('failure');
    return {
      passed: false,
      error: error.message,
      stack: error.stack,
      duration: Date.now() - startTime,
      screenshots: ['failure']
    };
  }
}
```


## Naming Conventions

### File Names

Use kebab-case for file names:

- ✅ Good: `admin-bar-colors.spec.cjs`
- ✅ Good: `menu-hover-effects.spec.cjs`
- ❌ Bad: `AdminBarColors.spec.cjs`
- ❌ Bad: `menu_hover_effects.spec.cjs`

**Pattern**: `[feature-description].spec.cjs`

### Test Names

Use descriptive, human-readable names:

- ✅ Good: `'Admin Bar Background Colors'`
- ✅ Good: `'Menu Hover Effects with Transitions'`
- ❌ Bad: `'Test 1'`
- ❌ Bad: `'admin_bar_test'`

### Screenshot Names

Use descriptive, sequential names:

- ✅ Good: `'admin-bar-initial'`, `'admin-bar-red-bg'`, `'admin-bar-after-save'`
- ✅ Good: `'step-1-navigation'`, `'step-2-color-change'`, `'step-3-verification'`
- ❌ Bad: `'screenshot1'`, `'test'`, `'img'`

### Tab Names

Use the exact tab identifier from the plugin:

**Valid Tab Names:**
- `'admin-bar'`
- `'menu'`
- `'content'`
- `'typography'`
- `'buttons'`
- `'effects'`
- `'templates'`
- `'palettes'`
- `'backgrounds'`
- `'widgets'`
- `'form-controls'`
- `'login'`
- `'advanced'`

### Tag Names

Use lowercase, descriptive tags:

**Common Tags:**
- `'smoke'` - Critical path tests
- `'visual'` - Tests that verify visual appearance
- `'persistence'` - Tests that verify data persistence
- `'live-preview'` - Tests that verify Live Preview functionality
- `'ajax'` - Tests that involve AJAX operations
- `'responsive'` - Tests that verify responsive behavior
- `'regression'` - Tests for previously fixed bugs

**Examples:**
```javascript
tags: ['smoke', 'visual']
tags: ['persistence', 'ajax']
tags: ['responsive', 'visual']
```


## Test Structure

Every test scenario should follow this structure:

### 1. Metadata Section

```javascript
module.exports = {
  name: 'Test Name',
  description: 'What this test does',
  tab: 'tab-name',
  tags: ['tag1', 'tag2'],
  // ...
};
```

### 2. Execute Function

```javascript
async execute(page, helpers) {
  try {
    const startTime = Date.now();
    
    // Test logic here
    
    return {
      passed: true,
      duration: Date.now() - startTime,
      screenshots: ['screenshot-names']
    };
  } catch (error) {
    return {
      passed: false,
      error: error.message,
      stack: error.stack,
      duration: Date.now() - startTime,
      screenshots: ['failure-screenshot']
    };
  }
}
```

### 3. Test Steps

Organize your test into logical steps:

1. **Navigation**: Navigate to the appropriate tab
2. **Setup**: Enable Live Preview, take initial screenshot
3. **Action**: Perform the test action (change setting, click button, etc.)
4. **Verification**: Verify the expected result
5. **Persistence** (optional): Save and reload to verify persistence
6. **Cleanup** (optional): Reset settings if needed
7. **Return**: Return test result

### 4. Error Handling

Always wrap test logic in try-catch:

```javascript
try {
  // Test logic
  return { passed: true, ... };
} catch (error) {
  await helpers.takeScreenshot('failure');
  return { 
    passed: false, 
    error: error.message,
    stack: error.stack,
    ...
  };
}
```


## Writing Effective Tests

### Test One Thing

Each test should focus on a single feature or behavior:

✅ **Good**: Test admin bar background color
```javascript
// Test only background color
await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
await helpers.waitForLivePreview();
const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
helpers.assert.contains(bgColor, '255, 0, 0');
```

❌ **Bad**: Test everything at once
```javascript
// Testing too many things in one test
await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
await helpers.changeSetting('menu[bg_color]', '#00FF00');
await helpers.changeSetting('content[bg_color]', '#0000FF');
// ... this should be multiple tests
```

### Use Descriptive Assertions

Include meaningful messages in assertions:

✅ **Good**:
```javascript
helpers.assert.contains(
  bgColor, 
  '255, 0, 0', 
  'Admin bar background should be red (#FF0000)'
);
```

❌ **Bad**:
```javascript
helpers.assert.contains(bgColor, '255, 0, 0');
```

### Take Strategic Screenshots

Capture screenshots at key points:

1. **Initial state**: Before making changes
2. **After each major change**: To show progression
3. **Final state**: After all changes applied
4. **Failure state**: When test fails

```javascript
await helpers.takeScreenshot('admin-bar-initial');
await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
await helpers.takeScreenshot('admin-bar-red-background');
await helpers.saveSettings();
await helpers.takeScreenshot('admin-bar-after-save');
```

### Wait Appropriately

Use the right wait function for each situation:

```javascript
// After changing a setting with Live Preview
await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
await helpers.waitForLivePreview(); // Wait for CSS injection

// After saving settings
await helpers.saveSettings();
await helpers.waitForAjaxComplete(); // Wait for AJAX

// After applying a palette
await helpers.applyPalette('ocean-blue');
await helpers.waitForAjaxComplete(); // Wait for palette application
```

### Verify Visual Changes

Always verify that visual changes actually occurred:

```javascript
// Change the color
await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
await helpers.waitForLivePreview();

// Verify it changed
const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
helpers.assert.contains(bgColor, '255, 0, 0', 'Background should be red');
```


## Testing Checklist

Before submitting your test, verify:

- [ ] Test has unique, descriptive name
- [ ] Test has clear description
- [ ] Correct tab specified
- [ ] Appropriate tags added
- [ ] Test logic wrapped in try-catch
- [ ] Initial screenshot taken
- [ ] Settings changes use `changeSetting()`
- [ ] Appropriate waits used (`waitForLivePreview`, `waitForAjaxComplete`)
- [ ] Visual changes verified with assertions
- [ ] Final screenshot taken
- [ ] Failure screenshot captured in catch block
- [ ] Test returns proper result object
- [ ] Test runs successfully in interactive mode
- [ ] Test runs successfully in headless mode
- [ ] No console errors during test execution
- [ ] Test is independent (doesn't rely on other tests)
- [ ] Test cleans up after itself (if needed)

## Running Your Tests

### Run a Single Test

```bash
# By test name
npm run test:visual -- --test "Admin Bar Colors"

# By file (runs all tests in that file)
npm run test:visual -- --file scenarios/admin-bar/colors.spec.cjs
```

### Run Tests by Tab

```bash
npm run test:visual -- --tab admin-bar
```

### Run Tests by Tag

```bash
# Run smoke tests only
npm run test:visual -- --tags smoke

# Run visual tests only
npm run test:visual -- --tags visual
```

### Run in Different Modes

```bash
# Interactive mode (default) - visible browser, slow motion
npm run test:visual

# Headless mode - no browser window, fast execution
npm run test:visual:headless

# Debug mode - step-by-step with verbose logging
npm run test:visual:debug
```

### Run with Custom Options

```bash
# Slow motion with 1 second delay
npm run test:visual -- --slow-mo 1000

# Pause on failure
npm run test:visual -- --pause-on-failure

# Take screenshots of all steps
npm run test:visual -- --screenshot-all
```


## Debugging Tests

### Enable Debug Mode

Run your test in debug mode for detailed logging:

```bash
npm run test:visual:debug -- --test "Your Test Name"
```

### Check Console Errors

Monitor console errors during test execution:

```javascript
helpers.startConsoleMonitoring();

// ... perform test actions ...

const errors = helpers.getConsoleErrors();
if (errors.length > 0) {
  console.log('Console errors:', errors);
}
```

### Use Pause for Inspection

In interactive mode, pause to inspect the page:

```javascript
await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
await helpers.pauseForInspection('Check if color changed');
// Test pauses, you can inspect the page, then press Enter to continue
```

### Take Extra Screenshots

Add screenshots at problematic points:

```javascript
await helpers.takeScreenshot('before-problem');
// ... problematic code ...
await helpers.takeScreenshot('after-problem');
```

### Log Values for Debugging

Log actual values to understand what's happening:

```javascript
const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
console.log('Actual background color:', bgColor);
helpers.assert.contains(bgColor, '255, 0, 0');
```

### Check Element Existence

Verify elements exist before interacting:

```javascript
const exists = await page.locator('#wpadminbar').count() > 0;
console.log('Admin bar exists:', exists);

if (!exists) {
  throw new Error('Admin bar not found');
}
```

### Verify Selectors

Test selectors in browser console:

```javascript
// In the test
await page.evaluate(() => {
  console.log('Element count:', document.querySelectorAll('#wpadminbar').length);
  console.log('Element:', document.querySelector('#wpadminbar'));
});
```


## Best Practices

### 1. Test Independence

Each test should be completely independent:

✅ **Good**: Test starts with known state
```javascript
async execute(page, helpers) {
  // Navigate to tab (fresh state)
  await helpers.navigateToTab('admin-bar');
  
  // Test logic
  await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
  
  // Clean up if needed
  // await helpers.resetSettings();
}
```

❌ **Bad**: Test relies on previous test
```javascript
async execute(page, helpers) {
  // Assumes we're already on admin-bar tab
  // Assumes certain settings are already set
  await helpers.changeSetting('admin_bar[text_color]', '#FFFFFF');
}
```

### 2. Use Helper Functions

Always use helper functions instead of direct Playwright calls:

✅ **Good**: Use helpers
```javascript
await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
await helpers.saveSettings();
await helpers.verifySetting('admin_bar[bg_color]', '#FF0000');
```

❌ **Bad**: Direct Playwright calls
```javascript
await page.fill('input[name="admin_bar[bg_color]"]', '#FF0000');
await page.click('#submit-button');
// ... manual verification ...
```

### 3. Meaningful Test Names

Use descriptive names that explain what's being tested:

✅ **Good**:
- `'Admin Bar Background Color with Live Preview'`
- `'Menu Hover Effects Transition Duration'`
- `'Template Application Updates Multiple Settings'`

❌ **Bad**:
- `'Test 1'`
- `'Color Test'`
- `'Admin Bar'`

### 4. Appropriate Tags

Tag tests appropriately for filtering:

```javascript
// Critical functionality - tag as smoke
tags: ['smoke', 'visual']

// Tests data persistence
tags: ['persistence', 'ajax']

// Tests responsive behavior
tags: ['responsive', 'visual']

// Tests for bug fixes
tags: ['regression', 'bugfix']
```

### 5. Clear Assertions

Write assertions that clearly state what's expected:

✅ **Good**:
```javascript
helpers.assert.contains(
  bgColor,
  '255, 0, 0',
  'Admin bar background should be red (#FF0000) after setting change'
);
```

❌ **Bad**:
```javascript
helpers.assert.contains(bgColor, '255, 0, 0');
```

### 6. Strategic Screenshots

Don't over-screenshot, but capture key moments:

```javascript
// Initial state
await helpers.takeScreenshot('initial');

// After significant change
await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
await helpers.takeScreenshot('color-changed');

// After save (if testing persistence)
await helpers.saveSettings();
await helpers.takeScreenshot('after-save');

// After reload (if testing persistence)
await page.reload();
await helpers.takeScreenshot('after-reload');
```

### 7. Proper Error Handling

Always handle errors and provide useful information:

```javascript
try {
  // Test logic
  return { passed: true, ... };
} catch (error) {
  // Capture failure state
  await helpers.takeScreenshot('failure');
  
  // Get console errors
  const consoleErrors = helpers.getConsoleErrors();
  
  // Return detailed failure info
  return {
    passed: false,
    error: error.message,
    stack: error.stack,
    consoleErrors: consoleErrors,
    screenshots: ['failure']
  };
}
```

### 8. Clean Code

Write clean, readable test code:

```javascript
// Use clear variable names
const adminBarBgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');

// Add comments for complex logic
// Verify that the gradient is applied correctly
// Expected format: linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)

// Break long operations into steps
await helpers.navigateToTab('admin-bar');
await helpers.enableLivePreview();
await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
await helpers.waitForLivePreview();
```

### 9. Test Real Functionality

Test actual functionality, not implementation details:

✅ **Good**: Test visual result
```javascript
const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
helpers.assert.contains(bgColor, '255, 0, 0', 'Background should be red');
```

❌ **Bad**: Test internal state
```javascript
const cssInjected = await page.evaluate(() => {
  return document.querySelector('style#mase-live-preview') !== null;
});
```

### 10. Document Complex Tests

Add comments for complex test logic:

```javascript
// Test that applying a palette updates multiple color settings simultaneously
// 1. Record initial colors
// 2. Apply palette
// 3. Verify all colors changed to palette values
// 4. Verify "Active" badge appears on palette card

const initialColors = {
  adminBar: await page.inputValue('input[name="admin_bar[bg_color]"]'),
  menu: await page.inputValue('input[name="menu[bg_color]"]')
};

await helpers.applyPalette('ocean-blue');

// Verify colors changed
const newAdminBarColor = await page.inputValue('input[name="admin_bar[bg_color]"]');
helpers.assert.notEquals(newAdminBarColor, initialColors.adminBar);
```


## Example Test Scenarios

### Example 1: Simple Color Test

```javascript
module.exports = {
  name: 'Admin Bar Background Color',
  description: 'Test changing admin bar background color with Live Preview',
  tab: 'admin-bar',
  tags: ['smoke', 'visual', 'live-preview'],
  
  async execute(page, helpers) {
    try {
      const startTime = Date.now();
      
      // Navigate and setup
      await helpers.navigateToTab('admin-bar');
      await helpers.enableLivePreview();
      await helpers.takeScreenshot('initial');
      
      // Change color
      await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('red-background');
      
      // Verify
      const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
      helpers.assert.contains(bgColor, '255, 0, 0', 'Background should be red');
      
      return {
        passed: true,
        duration: Date.now() - startTime,
        screenshots: ['initial', 'red-background']
      };
    } catch (error) {
      await helpers.takeScreenshot('failure');
      return {
        passed: false,
        error: error.message,
        stack: error.stack,
        duration: Date.now() - startTime,
        screenshots: ['failure']
      };
    }
  }
};
```

### Example 2: Persistence Test

```javascript
module.exports = {
  name: 'Admin Bar Color Persistence',
  description: 'Test that admin bar color persists after save and reload',
  tab: 'admin-bar',
  tags: ['persistence', 'ajax'],
  
  async execute(page, helpers) {
    try {
      const startTime = Date.now();
      
      // Change and save
      await helpers.navigateToTab('admin-bar');
      await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
      await helpers.saveSettings();
      await helpers.takeScreenshot('after-save');
      
      // Reload and verify
      await page.reload({ waitUntil: 'networkidle' });
      await helpers.navigateToTab('admin-bar');
      await helpers.verifySetting('admin_bar[bg_color]', '#FF0000');
      await helpers.takeScreenshot('after-reload');
      
      return {
        passed: true,
        duration: Date.now() - startTime,
        screenshots: ['after-save', 'after-reload']
      };
    } catch (error) {
      await helpers.takeScreenshot('failure');
      return {
        passed: false,
        error: error.message,
        stack: error.stack,
        duration: Date.now() - startTime,
        screenshots: ['failure']
      };
    }
  }
};
```

### Example 3: Multiple Settings Test

```javascript
module.exports = {
  name: 'Admin Bar Complete Styling',
  description: 'Test multiple admin bar styling options together',
  tab: 'admin-bar',
  tags: ['visual', 'live-preview'],
  
  async execute(page, helpers) {
    try {
      const startTime = Date.now();
      
      await helpers.navigateToTab('admin-bar');
      await helpers.enableLivePreview();
      await helpers.takeScreenshot('initial');
      
      // Change multiple settings
      await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
      await helpers.waitForLivePreview();
      
      await helpers.changeSetting('admin_bar[text_color]', '#FFFFFF');
      await helpers.waitForLivePreview();
      
      await helpers.changeSetting('admin_bar[font_size]', '16');
      await helpers.waitForLivePreview();
      
      await helpers.takeScreenshot('all-changes-applied');
      
      // Verify all changes
      const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
      helpers.assert.contains(bgColor, '255, 0, 0', 'Background should be red');
      
      const textColor = await helpers.getComputedStyle('#wpadminbar', 'color');
      helpers.assert.contains(textColor, '255, 255, 255', 'Text should be white');
      
      const fontSize = await helpers.getComputedStyle('#wpadminbar', 'fontSize');
      helpers.assert.equals(fontSize, '16px', 'Font size should be 16px');
      
      return {
        passed: true,
        duration: Date.now() - startTime,
        screenshots: ['initial', 'all-changes-applied']
      };
    } catch (error) {
      await helpers.takeScreenshot('failure');
      return {
        passed: false,
        error: error.message,
        stack: error.stack,
        duration: Date.now() - startTime,
        screenshots: ['failure']
      };
    }
  }
};
```

## Common Pitfalls to Avoid

1. **Not waiting for Live Preview**: Always call `waitForLivePreview()` after changing settings
2. **Not waiting for AJAX**: Always call `waitForAjaxComplete()` after save operations
3. **Hardcoding selectors**: Use helper functions that handle selectors internally
4. **Testing too much**: Keep tests focused on one feature
5. **Not handling errors**: Always wrap test logic in try-catch
6. **Not taking screenshots**: Screenshots are crucial for debugging failures
7. **Vague assertions**: Always include descriptive messages
8. **Not verifying visual changes**: Don't just change settings, verify they worked
9. **Relying on test order**: Tests should be independent
10. **Not cleaning up**: Reset settings if your test modifies global state

## Getting Help

- **Helper Documentation**: See `HELPERS.md` for detailed helper function documentation
- **Template File**: See `scenarios/TEMPLATE.spec.cjs` for a complete template
- **Example Tests**: Browse `scenarios/` directories for real examples
- **README**: See `README.md` for system overview and usage

## Questions?

If you have questions about writing tests or encounter issues:

1. Check the helper documentation in `HELPERS.md`
2. Look at existing tests in `scenarios/` for examples
3. Run tests in debug mode for detailed logging
4. Check the test report for error details

Happy testing! 🎉
