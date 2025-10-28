# Design Document

## Overview

This document outlines the technical design for an advanced visual interactive testing system for the Modern Admin Styler (MASE) WordPress plugin. The system will provide comprehensive automated testing with real-time visual verification in a browser window, allowing testers to observe and validate every plugin option's behavior.

### Goals

1. **Visual Verification**: Enable testers to see changes in real-time as tests execute
2. **Comprehensive Coverage**: Test every available plugin option across all 13 tabs
3. **Interactive Mode**: Support both automated and manual inspection modes
4. **Rich Reporting**: Generate detailed reports with screenshots, videos, and execution logs
5. **Extensibility**: Make it easy to add new test scenarios as features evolve

### Non-Goals

- Performance testing (covered by existing tests)
- Load testing or stress testing
- Security penetration testing
- Cross-browser compatibility testing (already covered by Playwright config)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Test Runner CLI                          │
│  (Entry point with mode selection and configuration)         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Test Orchestrator                           │
│  - Test discovery and loading                                │
│  - Execution flow control                                    │
│  - Mode management (interactive/headless/debug)              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Test Scenario Modules                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Admin Bar   │  │    Menu      │  │   Content    │      │
│  │   Tests      │  │    Tests     │  │    Tests     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Typography  │  │   Buttons    │  │  Templates   │      │
│  │   Tests      │  │    Tests     │  │    Tests     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                        ... etc ...                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Helper Library                              │
│  - WordPress login/navigation                                │
│  - Setting manipulation (change, save, verify)               │
│  - Visual verification (screenshots, color checks)           │
│  - Console monitoring                                        │
│  - AJAX waiting                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Playwright Browser                          │
│  - Browser automation                                        │
│  - Visual rendering                                          │
│  - Network interception                                      │
│  - Screenshot/video capture                                  │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Report Generator                            │
│  - HTML report with screenshots                              │
│  - Video recordings of failures                              │
│  - Execution logs and metrics                                │
│  - Console error summary                                     │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Test Runner CLI

**File**: `tests/visual-interactive/runner.js`

**Purpose**: Entry point for running visual tests with various modes and options.

**Interface**:
```javascript
// Command line usage
node tests/visual-interactive/runner.js [options]

// Options:
--mode <interactive|headless|debug>  // Execution mode
--slow-mo <ms>                       // Slow motion delay between actions
--pause-on-failure                   // Pause when test fails
--tab <tab-name>                     // Run tests for specific tab only
--test <test-name>                   // Run specific test only
--headed                             // Show browser window (default in interactive)
--headless                           // Hide browser window
--screenshot-all                     // Take screenshots of all steps
--video                              // Record video of all tests
```

**Responsibilities**:
- Parse command line arguments
- Initialize Playwright with appropriate configuration
- Load and execute test scenarios
- Handle graceful shutdown

### 2. Test Orchestrator

**File**: `tests/visual-interactive/orchestrator.js`

**Purpose**: Manages test discovery, loading, and execution flow.

**Interface**:
```javascript
class TestOrchestrator {
  constructor(config) {
    this.config = config;
    this.scenarios = [];
    this.results = [];
  }

  // Discover all test scenario files
  async discoverTests(directory) {
    // Returns array of test scenario modules
  }

  // Load test scenarios based on filters
  async loadScenarios(filters = {}) {
    // Filters: { tab, test, tags }
  }

  // Execute loaded scenarios
  async executeScenarios(page, helpers) {
    // Returns execution results
  }

  // Handle execution modes
  async runInteractive(page, helpers) {
    // Slow execution with visual pauses
  }

  async runHeadless(page, helpers) {
    // Fast execution without delays
  }

  async runDebug(page, helpers) {
    // Step-by-step with detailed logging
  }
}
```

**Responsibilities**:
- Discover test files in `tests/visual-interactive/scenarios/`
- Filter tests based on CLI arguments
- Execute tests in appropriate mode
- Collect and aggregate results
- Handle test failures and retries

### 3. Test Scenario Modules

**Directory**: `tests/visual-interactive/scenarios/`

**Structure**:
```
scenarios/
├── admin-bar/
│   ├── colors.spec.js
│   ├── typography.spec.js
│   ├── gradient.spec.js
│   └── height.spec.js
├── menu/
│   ├── colors.spec.js
│   ├── typography.spec.js
│   ├── height-mode.spec.js
│   └── hover-effects.spec.js
├── content/
│   ├── background.spec.js
│   ├── spacing.spec.js
│   └── layout.spec.js
├── typography/
│   ├── global-fonts.spec.js
│   └── section-fonts.spec.js
├── buttons/
│   ├── primary-buttons.spec.js
│   ├── secondary-buttons.spec.js
│   └── button-states.spec.js
├── effects/
│   ├── animations.spec.js
│   ├── hover-effects.spec.js
│   └── transitions.spec.js
├── templates/
│   ├── apply-template.spec.js
│   ├── save-custom.spec.js
│   └── delete-template.spec.js
├── palettes/
│   ├── apply-palette.spec.js
│   ├── save-custom.spec.js
│   └── delete-palette.spec.js
├── backgrounds/
│   ├── solid-backgrounds.spec.js
│   ├── gradient-backgrounds.spec.js
│   └── image-backgrounds.spec.js
├── widgets/
│   └── widget-styling.spec.js
├── form-controls/
│   └── form-styling.spec.js
├── login/
│   └── login-page.spec.js
└── advanced/
    ├── import-export.spec.js
    ├── backup-restore.spec.js
    └── custom-css.spec.js
```

**Scenario Module Interface**:
```javascript
export default {
  // Metadata
  name: 'Admin Bar Colors',
  description: 'Test all color settings in Admin Bar tab',
  tab: 'admin-bar',
  tags: ['colors', 'visual', 'smoke'],
  
  // Test steps
  async execute(page, helpers) {
    const { navigate, changeSetting, verifySetting, takeScreenshot } = helpers;
    
    // Navigate to tab
    await navigate.toTab('admin-bar');
    await takeScreenshot('admin-bar-initial');
    
    // Test background color
    await changeSetting('admin_bar[bg_color]', '#FF0000');
    await helpers.waitForLivePreview();
    await takeScreenshot('admin-bar-bg-red');
    
    // Verify color applied
    const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
    helpers.assert.contains(bgColor, '255, 0, 0', 'Background color should be red');
    
    // Test text color
    await changeSetting('admin_bar[text_color]', '#FFFFFF');
    await helpers.waitForLivePreview();
    await takeScreenshot('admin-bar-text-white');
    
    // Save and verify persistence
    await helpers.saveSettings();
    await helpers.reloadPage();
    await verifySetting('admin_bar[bg_color]', '#FF0000');
    
    return {
      passed: true,
      screenshots: ['admin-bar-initial', 'admin-bar-bg-red', 'admin-bar-text-white'],
      duration: Date.now() - startTime
    };
  }
};
```

### 4. Helper Library

**File**: `tests/visual-interactive/helpers.js`

**Purpose**: Provide reusable functions for common test operations.

**Interface**:
```javascript
class TestHelpers {
  constructor(page, config) {
    this.page = page;
    this.config = config;
    this.screenshots = [];
    this.consoleErrors = [];
  }

  // Navigation helpers
  async loginToWordPress(username, password) {}
  async navigateToSettings() {}
  async navigateToTab(tabName) {}
  
  // Setting manipulation
  async changeSetting(fieldName, value) {}
  async saveSettings() {}
  async verifySetting(fieldName, expectedValue) {}
  async resetSettings() {}
  
  // Live Preview helpers
  async enableLivePreview() {}
  async disableLivePreview() {}
  async waitForLivePreview(timeout = 1000) {}
  
  // Visual verification
  async takeScreenshot(name, options = {}) {}
  async getComputedStyle(selector, property) {}
  async verifyColor(selector, expectedColor) {}
  async verifyVisibility(selector, shouldBeVisible) {}
  
  // Palette operations
  async applyPalette(paletteId) {}
  async saveCustomPalette(name, colors) {}
  async deleteCustomPalette(paletteId) {}
  
  // Template operations
  async applyTemplate(templateId) {}
  async saveCustomTemplate(name, settings) {}
  async deleteCustomTemplate(templateId) {}
  
  // Import/Export
  async exportSettings() {}
  async importSettings(filePath) {}
  async createBackup() {}
  async restoreBackup(backupId) {}
  
  // Console monitoring
  startConsoleMonitoring() {}
  getConsoleErrors() {}
  clearConsoleErrors() {}
  
  // AJAX helpers
  async waitForAjaxComplete(timeout = 10000) {}
  async waitForResponse(urlPattern, timeout = 10000) {}
  
  // Assertions
  assert = {
    equals(actual, expected, message) {},
    contains(actual, substring, message) {},
    isTrue(value, message) {},
    isFalse(value, message) {}
  };
  
  // Pause helpers (for interactive mode)
  async pause(duration) {}
  async pauseForInspection(message) {}
}
```

### 5. Report Generator

**File**: `tests/visual-interactive/reporter.js`

**Purpose**: Generate comprehensive HTML reports with visual evidence.

**Interface**:
```javascript
class ReportGenerator {
  constructor(results, config) {
    this.results = results;
    this.config = config;
  }

  async generateReport() {
    // Generate HTML report
    // Returns path to report file
  }

  async generateSummary() {
    // Generate summary statistics
  }

  async embedScreenshots() {
    // Embed screenshots in report
  }

  async embedVideos() {
    // Embed video recordings
  }

  async formatConsoleLogs() {
    // Format console errors and warnings
  }
}
```

**Report Structure**:
```html
<!DOCTYPE html>
<html>
<head>
  <title>MASE Visual Test Report</title>
  <style>/* Report styles */</style>
</head>
<body>
  <header>
    <h1>MASE Visual Interactive Test Report</h1>
    <div class="summary">
      <span class="total">Total: 150</span>
      <span class="passed">Passed: 145</span>
      <span class="failed">Failed: 5</span>
      <span class="duration">Duration: 15m 32s</span>
    </div>
  </header>
  
  <nav class="tabs">
    <button data-tab="admin-bar">Admin Bar (12/12)</button>
    <button data-tab="menu">Menu (15/15)</button>
    <!-- ... -->
  </nav>
  
  <main>
    <section class="test-category" data-category="admin-bar">
      <h2>Admin Bar Tests</h2>
      
      <article class="test-result passed">
        <h3>✓ Admin Bar Colors</h3>
        <div class="test-details">
          <p>Duration: 5.2s</p>
          <p>Screenshots: 3</p>
        </div>
        <div class="screenshots">
          <img src="screenshots/admin-bar-initial.png" />
          <img src="screenshots/admin-bar-bg-red.png" />
          <img src="screenshots/admin-bar-text-white.png" />
        </div>
      </article>
      
      <article class="test-result failed">
        <h3>✗ Admin Bar Gradient</h3>
        <div class="test-details">
          <p>Duration: 3.8s</p>
          <p>Error: Expected gradient to be applied</p>
        </div>
        <div class="error-details">
          <pre>AssertionError: Expected background to contain 'gradient'
  at verifyGradient (helpers.js:245)
  at execute (gradient.spec.js:32)</pre>
        </div>
        <div class="screenshots">
          <img src="screenshots/admin-bar-gradient-failed.png" />
        </div>
        <video controls>
          <source src="videos/admin-bar-gradient-failed.webm" />
        </video>
      </article>
    </section>
  </main>
</body>
</html>
```

## Data Models

### Test Configuration

```javascript
{
  mode: 'interactive',           // 'interactive' | 'headless' | 'debug'
  slowMo: 500,                   // Milliseconds between actions
  pauseOnFailure: true,          // Pause when test fails
  screenshotAll: false,          // Screenshot every step
  video: true,                   // Record video
  baseURL: 'http://localhost:8080',
  credentials: {
    username: 'admin',
    password: 'admin'
  },
  filters: {
    tab: null,                   // Filter by tab name
    test: null,                  // Filter by test name
    tags: []                     // Filter by tags
  },
  viewport: {
    width: 1920,
    height: 1080
  },
  outputDir: 'test-results/visual-interactive',
  reportDir: 'playwright-report/visual-interactive'
}
```

### Test Result

```javascript
{
  name: 'Admin Bar Colors',
  description: 'Test all color settings in Admin Bar tab',
  tab: 'admin-bar',
  status: 'passed',              // 'passed' | 'failed' | 'skipped'
  duration: 5234,                // Milliseconds
  startTime: '2025-10-26T10:30:00Z',
  endTime: '2025-10-26T10:30:05Z',
  screenshots: [
    {
      name: 'admin-bar-initial',
      path: 'screenshots/admin-bar-initial.png',
      timestamp: '2025-10-26T10:30:01Z'
    },
    // ...
  ],
  videos: [
    {
      path: 'videos/admin-bar-colors.webm',
      duration: 5234
    }
  ],
  consoleErrors: [
    {
      type: 'error',
      message: 'Uncaught TypeError: Cannot read property...',
      timestamp: '2025-10-26T10:30:03Z',
      stack: '...'
    }
  ],
  assertions: [
    {
      type: 'equals',
      actual: 'rgb(255, 0, 0)',
      expected: 'rgb(255, 0, 0)',
      passed: true,
      message: 'Background color should be red'
    }
  ],
  error: null                    // Error object if failed
}
```

### Test Scenario Metadata

```javascript
{
  name: 'Admin Bar Colors',
  description: 'Test all color settings in Admin Bar tab',
  tab: 'admin-bar',
  tags: ['colors', 'visual', 'smoke'],
  requirements: ['1.1', '2.1', '2.2'],  // References to requirements.md
  estimatedDuration: 5000,       // Milliseconds
  dependencies: [],              // Other tests that must run first
  priority: 'high'               // 'high' | 'medium' | 'low'
}
```

## Error Handling

### Error Types

1. **Navigation Errors**: Failed to navigate to page or tab
2. **Element Not Found**: Selector doesn't match any element
3. **Assertion Failures**: Expected value doesn't match actual
4. **Timeout Errors**: Operation took too long
5. **AJAX Errors**: AJAX request failed or returned error
6. **Console Errors**: JavaScript errors in browser console

### Error Handling Strategy

```javascript
try {
  await testScenario.execute(page, helpers);
} catch (error) {
  // Capture screenshot of failure state
  await helpers.takeScreenshot(`${testName}-failure`);
  
  // Record video if enabled
  if (config.video) {
    await page.video().saveAs(`${testName}-failure.webm`);
  }
  
  // Collect console errors
  const consoleErrors = helpers.getConsoleErrors();
  
  // Create detailed error report
  const errorReport = {
    test: testName,
    error: error.message,
    stack: error.stack,
    screenshot: `${testName}-failure.png`,
    consoleErrors: consoleErrors,
    timestamp: new Date().toISOString()
  };
  
  // In interactive mode, pause for inspection
  if (config.mode === 'interactive' && config.pauseOnFailure) {
    console.log('Test failed. Press Enter to continue...');
    await helpers.pauseForInspection('Test failed');
  }
  
  // Continue with next test or fail suite
  if (config.failFast) {
    throw error;
  } else {
    results.push({ ...errorReport, status: 'failed' });
  }
}
```

## Testing Strategy

### Test Organization

Tests are organized by plugin tab and feature:

1. **Admin Bar Tests** (12 tests)
   - Colors (background, text, hover)
   - Typography (font size, weight, line height)
   - Gradient backgrounds
   - Height adjustment

2. **Menu Tests** (15 tests)
   - Colors (background, text, hover, active)
   - Typography
   - Height modes (full height, fit to content)
   - Hover effects
   - Submenu styling

3. **Content Tests** (8 tests)
   - Background colors
   - Spacing (padding, margins)
   - Layout options

4. **Typography Tests** (10 tests)
   - Global font settings
   - Section-specific fonts
   - Font weights and sizes

5. **Button Tests** (12 tests)
   - Primary button states (normal, hover, active)
   - Secondary button states
   - Button sizing
   - Border radius

6. **Effects Tests** (8 tests)
   - Animations
   - Hover effects
   - Transitions
   - Visual effects

7. **Template Tests** (6 tests)
   - Apply predefined templates
   - Save custom templates
   - Delete custom templates
   - Template preview

8. **Palette Tests** (6 tests)
   - Apply predefined palettes
   - Save custom palettes
   - Delete custom palettes
   - Palette preview

9. **Background Tests** (9 tests)
   - Solid backgrounds
   - Gradient backgrounds
   - Image backgrounds
   - Background positioning

10. **Widget Tests** (5 tests)
    - Widget styling
    - Widget colors

11. **Form Control Tests** (5 tests)
    - Input styling
    - Select styling
    - Checkbox/radio styling

12. **Login Page Tests** (4 tests)
    - Login page colors
    - Login page logo
    - Login page background

13. **Advanced Tests** (10 tests)
    - Import settings
    - Export settings
    - Create backup
    - Restore backup
    - Custom CSS
    - Custom JavaScript

**Total: ~110 test scenarios**

### Test Execution Modes

#### Interactive Mode
- Browser window visible
- Slow motion between actions (500ms default)
- Pause after each major step
- Pause on failure for inspection
- Detailed console logging

#### Headless Mode
- No browser window
- Fast execution
- No pauses
- Minimal logging
- Suitable for CI/CD

#### Debug Mode
- Browser window visible
- Step-by-step execution
- Pause before each action
- Verbose logging
- Console error highlighting

### Test Tags

Tests can be tagged for selective execution:

- `@smoke`: Critical path tests (run first)
- `@visual`: Tests that verify visual appearance
- `@persistence`: Tests that verify data persistence
- `@live-preview`: Tests that verify live preview functionality
- `@ajax`: Tests that involve AJAX operations
- `@responsive`: Tests that verify responsive behavior
- `@regression`: Tests for previously fixed bugs

Example usage:
```bash
# Run only smoke tests
node runner.js --tags smoke

# Run visual tests for admin-bar tab
node runner.js --tab admin-bar --tags visual

# Run all tests except responsive
node runner.js --exclude-tags responsive
```

## Performance Considerations

### Optimization Strategies

1. **Parallel Execution**: Run independent tests in parallel
2. **Test Isolation**: Each test starts with clean state
3. **Resource Cleanup**: Close browser contexts after each test
4. **Screenshot Optimization**: Compress screenshots to reduce report size
5. **Video Recording**: Only record videos for failed tests
6. **Caching**: Cache WordPress login session across tests

### Performance Targets

- Single test execution: < 10 seconds
- Full test suite (110 tests): < 20 minutes
- Report generation: < 30 seconds
- Memory usage: < 2GB

## Security Considerations

1. **Credentials**: Store credentials in environment variables, not in code
2. **Test Data**: Use test-specific data, don't modify production settings
3. **Cleanup**: Reset settings after test suite completes
4. **Isolation**: Run tests in isolated WordPress instance

## Deployment and CI/CD Integration

### Local Development

```bash
# Install dependencies
npm install

# Run interactive tests
npm run test:visual

# Run specific tab tests
npm run test:visual -- --tab admin-bar

# Run in debug mode
npm run test:visual:debug
```

### CI/CD Pipeline

```yaml
# .github/workflows/visual-tests.yml
name: Visual Interactive Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start WordPress
        run: docker-compose up -d
      
      - name: Wait for WordPress
        run: ./scripts/wait-for-wordpress.sh
      
      - name: Run visual tests
        run: npm run test:visual -- --headless
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: visual-test-results
          path: playwright-report/visual-interactive/
      
      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: failure-screenshots
          path: test-results/visual-interactive/screenshots/
```

## Future Enhancements

1. **AI-Powered Visual Regression**: Use AI to detect visual differences
2. **Accessibility Testing**: Integrate axe-core for WCAG compliance
3. **Performance Profiling**: Measure and report performance metrics
4. **Cross-Browser Testing**: Extend to Firefox, Safari, Edge
5. **Mobile Testing**: Add mobile viewport testing
6. **API Testing**: Test REST API endpoints
7. **Database Verification**: Verify settings in database
8. **Multi-Language Testing**: Test with different WordPress languages

## Conclusion

This design provides a comprehensive framework for visual interactive testing of the MASE plugin. The modular architecture allows for easy extension and maintenance, while the multiple execution modes support both development and CI/CD workflows. The rich reporting capabilities ensure that test results are actionable and easy to understand.
