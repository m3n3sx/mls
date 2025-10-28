# Visual Interactive Testing System

Comprehensive visual testing framework for the Modern Admin Styler (MASE) WordPress plugin.

## Overview

This testing system provides automated visual verification of every plugin option with real-time browser display, allowing testers to observe and validate changes as they happen.

## Features

- **Visual Verification**: See changes in real-time as tests execute
- **Multiple Execution Modes**: Interactive, headless, and debug modes
- **Comprehensive Coverage**: Test every plugin option across all tabs
- **Rich Reporting**: HTML reports with screenshots and videos
- **Flexible Filtering**: Run specific tests by tab, name, or tags
- **Console Monitoring**: Detect JavaScript errors during testing

## Quick Start

### Prerequisites

- Node.js 18+ installed
- WordPress instance running (default: http://localhost:8080)
- MASE plugin installed and activated
- Playwright installed (`npm install`)

### Running Tests

```bash
# Run all tests in interactive mode (browser visible)
npm run test:visual

# Run tests in headless mode (no browser window)
npm run test:visual:headless

# Run tests in debug mode (step-by-step with verbose logging)
npm run test:visual:debug

# Run tests for a specific tab
npm run test:visual -- --tab admin-bar

# Run specific test by name
npm run test:visual -- --test "Admin Bar Colors"

# Run tests with specific tags
npm run test:visual -- --tags smoke,visual

# Run with custom slow motion delay
npm run test:visual -- --slow-mo 1000
```

## Execution Modes

### Interactive Mode (Default)

- Browser window visible
- Slow motion between actions (500ms default)
- Visual pauses for inspection
- Detailed progress information
- Best for: Manual testing, debugging, demonstrations

```bash
npm run test:visual
# or
node tests/visual-interactive/runner.cjs --mode interactive
```

### Headless Mode

- No browser window
- Fast execution
- Minimal logging
- Best for: CI/CD pipelines, automated testing

```bash
npm run test:visual:headless
# or
node tests/visual-interactive/runner.cjs --mode headless
```

### Debug Mode

- Browser window visible
- Step-by-step execution with pauses
- Verbose logging of all actions
- Console error highlighting
- Best for: Troubleshooting test failures

```bash
npm run test:visual:debug
# or
node tests/visual-interactive/runner.cjs --mode debug
```

## Command-Line Options

### Execution Modes

```bash
--mode <interactive|headless|debug>  # Execution mode (default: interactive)
```

### Filtering Options

```bash
--tab <name>                # Run tests for specific tab only
--test <name>               # Run specific test (partial match)
--tags <tag1,tag2>          # Run tests with specific tags
--exclude-tags <tag1,tag2>  # Exclude tests with specific tags
```

### Browser Options

```bash
--headed                    # Show browser window (overrides config)
--headless                  # Hide browser window (overrides config)
--slow-mo <ms>              # Delay between actions in milliseconds
--viewport <WxH>            # Set viewport size (e.g., 1920x1080)
```

### Execution Options

```bash
--pause-on-failure          # Pause when test fails for inspection
--fail-fast                 # Stop execution on first failure
--retries <n>               # Number of retries for failed tests
```

### Screenshot & Video Options

```bash
--screenshot-all            # Take screenshots of all steps
--video                     # Record video of all tests
--video-on-failure          # Record video only for failed tests (default)
```

### Timeout Options

```bash
--timeout <ms>              # Set default timeout in milliseconds
```

## Environment Variables

Configure the test environment using environment variables:

```bash
# WordPress Configuration
export WP_BASE_URL="http://localhost:8080"
export WP_ADMIN_USER="admin"
export WP_ADMIN_PASS="admin"

# Test Configuration
export TEST_MODE="interactive"
export HEADLESS="false"
export SLOW_MO="500"
export DEBUG="false"

# Timeout Configuration
export TIMEOUT_NAVIGATION="30000"
export TIMEOUT_ELEMENT="10000"
export TIMEOUT_AJAX="10000"

# Output Configuration
export RESULTS_DIR="test-results/visual-interactive"
export REPORT_DIR="playwright-report/visual-interactive"
```

## Examples

### Run All Tests

```bash
npm run test:visual
```

### Run Tests for Specific Tab

```bash
npm run test:visual -- --tab admin-bar
npm run test:visual -- --tab menu
npm run test:visual -- --tab content
```

### Run Smoke Tests

```bash
npm run test:visual -- --tags smoke
```

### Debug a Failing Test

```bash
npm run test:visual:debug -- --test "Admin Bar Colors" --pause-on-failure
```

### Run Tests with Custom Viewport

```bash
npm run test:visual -- --viewport 1366x768
```

### Run Tests and Stop on First Failure

```bash
npm run test:visual -- --fail-fast --pause-on-failure
```

### Run Tests in CI/CD

```bash
npm run test:visual:headless -- --fail-fast
```

## Test Results

### Console Output

Test results are displayed in the console with:
- Test name and description
- Pass/fail status
- Execution time
- Progress summary
- Console errors (if any)

### HTML Report

After test execution, a comprehensive HTML report is generated at:
```
playwright-report/visual-interactive/index.html
```

The report includes:
- **Summary Statistics**: Total, passed, failed, skipped tests with pass rate
- **Execution Time**: Total duration and per-test timing
- **Tab Navigation**: Filter results by plugin tab
- **Test Results**: Detailed results for each test with status icons
- **Error Details**: Full error messages and stack traces for failed tests
- **Console Errors**: JavaScript errors detected during test execution
- **Screenshots**: Embedded screenshots with thumbnail and full-size views
- **Videos**: Embedded video recordings for failed tests
- **Interactive Features**: Click screenshots for full-size view, tab navigation

The report is fully responsive and works on desktop, tablet, and mobile devices.

### Screenshots

Screenshots are saved to:
```
test-results/visual-interactive/screenshots/
```

### Videos

Videos are saved to:
```
test-results/visual-interactive/videos/
```

## Configuration

The default configuration is defined in `config.cjs`. You can override settings using:

1. Environment variables (highest priority)
2. Command-line arguments
3. Default configuration file (lowest priority)

### Configuration File

Edit `tests/visual-interactive/config.cjs` to change defaults:

```javascript
module.exports = {
  wordpress: {
    baseURL: 'http://localhost:8080',
    credentials: {
      username: 'admin',
      password: 'admin'
    }
  },
  browser: {
    type: 'chromium',
    headless: false,
    slowMo: 500,
    viewport: {
      width: 1920,
      height: 1080
    }
  },
  execution: {
    mode: 'interactive',
    pauseOnFailure: true,
    screenshotAll: false,
    video: false,
    videoOnFailure: true,
    failFast: false,
    retries: 0
  },
  timeouts: {
    navigation: 30000,
    element: 10000,
    ajax: 10000,
    livePreview: 2000,
    save: 5000,
    inspection: 2000
  }
};
```

## Project Structure

```
tests/visual-interactive/
├── runner.cjs              # CLI entry point
├── config.cjs              # Configuration
├── orchestrator.cjs        # Test discovery and execution
├── helpers.cjs             # Helper functions
├── scenarios/              # Test scenario files
│   ├── admin-bar/         # Admin Bar tests
│   ├── menu/              # Menu tests
│   ├── content/           # Content tests
│   ├── typography/        # Typography tests
│   ├── buttons/           # Button tests
│   ├── effects/           # Effects tests
│   ├── templates/         # Template tests
│   ├── palettes/          # Palette tests
│   ├── backgrounds/       # Background tests
│   ├── widgets/           # Widget tests
│   ├── form-controls/     # Form Control tests
│   ├── login/             # Login Page tests
│   └── advanced/          # Advanced tests
├── reports/               # Generated reports
├── screenshots/           # Test screenshots
└── videos/                # Test videos
```

## Writing Test Scenarios

Test scenarios will be implemented in tasks 5-15. Each scenario is a JavaScript module that exports:

```javascript
module.exports = {
  // Metadata
  name: 'Test Name',
  description: 'Test description',
  tab: 'admin-bar',
  tags: ['colors', 'visual', 'smoke'],
  requirements: ['1.1', '2.1'],
  
  // Test execution function
  async execute(page, helpers) {
    // Test implementation
    await helpers.navigateToTab('admin-bar');
    await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
    await helpers.waitForLivePreview();
    await helpers.takeScreenshot('admin-bar-red');
    
    // Assertions
    const bgColor = await helpers.getComputedStyle('#wpadminbar', 'backgroundColor');
    helpers.assert.contains(bgColor, '255, 0, 0', 'Background should be red');
    
    return {
      passed: true,
      screenshots: ['admin-bar-red']
    };
  }
};
```

## Troubleshooting

### Browser Not Launching

If the browser doesn't launch:

1. Check Playwright is installed: `npm install`
2. Install browser binaries: `npx playwright install chromium`
3. Try running in headless mode: `npm run test:visual:headless`

### WordPress Connection Failed

If tests can't connect to WordPress:

1. Verify WordPress is running: `curl http://localhost:8080`
2. Check the base URL: `echo $WP_BASE_URL`
3. Verify credentials are correct
4. Check WordPress admin is accessible

### Tests Timing Out

If tests are timing out:

1. Increase timeout: `npm run test:visual -- --timeout 60000`
2. Check network connectivity
3. Verify WordPress is responding quickly
4. Run in debug mode to see where it's hanging

### No Tests Found

If no tests are found:

1. Check test scenario files exist in `scenarios/` directory
2. Verify file names end with `.spec.js`
3. Check filter criteria aren't too restrictive
4. Run without filters: `npm run test:visual`

## Support

For issues or questions:

1. Check this README
2. Review the design document: `.kiro/specs/visual-interactive-testing/design.md`
3. Review the requirements: `.kiro/specs/visual-interactive-testing/requirements.md`
4. Check the task list: `.kiro/specs/visual-interactive-testing/tasks.md`

## Report Generator

The report generator (`reporter.cjs`) creates comprehensive HTML reports with:

### Features

- **Responsive Design**: Works on all screen sizes
- **Tab Navigation**: Filter results by plugin tab
- **Summary Statistics**: Visual cards showing test metrics
- **Test Details**: Expandable test results with full information
- **Screenshot Gallery**: Grid layout with thumbnail previews
- **Video Embedding**: Inline video player for failed tests
- **Console Logs**: Formatted console errors with timestamps
- **Error Highlighting**: Clear display of error messages and stack traces
- **Interactive Modal**: Click screenshots for full-size view
- **Professional Styling**: Modern gradient header and clean layout

### Report Structure

```
Report
├── Header (with timestamp)
├── Navigation (tab filters)
├── Summary Section
│   ├── Total Tests
│   ├── Passed Tests
│   ├── Failed Tests
│   ├── Skipped Tests
│   ├── Pass Rate
│   └── Duration
└── Test Results (by tab)
    ├── Test Name & Status
    ├── Duration & Metadata
    ├── Description & Tags
    ├── Error Details (if failed)
    ├── Console Errors (if any)
    ├── Screenshots (grid view)
    └── Videos (if failed)
```

## Next Steps

The following tasks are still pending:

- Task 17: Add responsive viewport testing
- Task 18: Implement Live Preview comprehensive testing
- Task 19: Add test scenario template and documentation
- Task 20: Integration and end-to-end testing

See `tasks.md` for the complete implementation plan.
