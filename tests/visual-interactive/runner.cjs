#!/usr/bin/env node

/**
 * Visual Interactive Test Runner
 * 
 * Command-line interface for running visual interactive tests of the
 * Modern Admin Styler (MASE) WordPress plugin.
 * 
 * Usage:
 *   node runner.js [options]
 * 
 * Options:
 *   --mode <interactive|headless|debug>  Execution mode (default: interactive)
 *   --slow-mo <ms>                       Slow motion delay between actions
 *   --pause-on-failure                   Pause when test fails
 *   --tab <tab-name>                     Run tests for specific tab only
 *   --test <test-name>                   Run specific test only
 *   --tags <tag1,tag2>                   Run tests with specific tags
 *   --exclude-tags <tag1,tag2>           Exclude tests with specific tags
 *   --headed                             Show browser window
 *   --headless                           Hide browser window
 *   --screenshot-all                     Take screenshots of all steps
 *   --video                              Record video of all tests
 *   --video-on-failure                   Record video only for failed tests
 *   --fail-fast                          Stop on first failure
 *   --retries <n>                        Number of retries for failed tests
 *   --viewport <width>x<height>          Set viewport size (e.g., 1920x1080)
 *   --timeout <ms>                       Set default timeout
 *   --help                               Show help message
 */

const { chromium, firefox, webkit } = require('playwright');
const path = require('path');
const fs = require('fs').promises;

// Load configuration and classes
const defaultConfig = require('./config.cjs');
const TestOrchestrator = require('./orchestrator.cjs');
const TestHelpers = require('./helpers.cjs');
const ReportGenerator = require('./reporter.cjs');

/**
 * Parse command-line arguments
 * @returns {Object} Parsed arguments
 */
function parseArguments() {
  const args = process.argv.slice(2);
  const parsed = {
    mode: null,
    slowMo: null,
    pauseOnFailure: null,
    tab: null,
    test: null,
    tags: [],
    excludeTags: [],
    headed: null,
    headless: null,
    screenshotAll: null,
    video: null,
    videoOnFailure: null,
    failFast: null,
    retries: null,
    viewport: null,
    timeout: null,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--mode':
        parsed.mode = nextArg;
        i++;
        break;

      case '--slow-mo':
        parsed.slowMo = parseInt(nextArg, 10);
        i++;
        break;

      case '--pause-on-failure':
        parsed.pauseOnFailure = true;
        break;

      case '--tab':
        parsed.tab = nextArg;
        i++;
        break;

      case '--test':
        parsed.test = nextArg;
        i++;
        break;

      case '--tags':
        parsed.tags = nextArg.split(',').map(t => t.trim());
        i++;
        break;

      case '--exclude-tags':
        parsed.excludeTags = nextArg.split(',').map(t => t.trim());
        i++;
        break;

      case '--headed':
        parsed.headed = true;
        break;

      case '--headless':
        parsed.headless = true;
        break;

      case '--screenshot-all':
        parsed.screenshotAll = true;
        break;

      case '--video':
        parsed.video = true;
        break;

      case '--video-on-failure':
        parsed.videoOnFailure = true;
        break;

      case '--fail-fast':
        parsed.failFast = true;
        break;

      case '--retries':
        parsed.retries = parseInt(nextArg, 10);
        i++;
        break;

      case '--viewport':
        const [width, height] = nextArg.split('x').map(n => parseInt(n, 10));
        parsed.viewport = { width, height };
        i++;
        break;

      case '--timeout':
        parsed.timeout = parseInt(nextArg, 10);
        i++;
        break;

      case '--help':
      case '-h':
        parsed.help = true;
        break;

      default:
        if (arg.startsWith('--')) {
          console.warn(`⚠️  Unknown option: ${arg}`);
        }
    }
  }

  return parsed;
}

/**
 * Display help message
 */
function showHelp() {
  console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                  MASE Visual Interactive Test Runner                       ║
╚════════════════════════════════════════════════════════════════════════════╝

USAGE:
  node runner.js [options]

EXECUTION MODES:
  --mode <mode>              Execution mode (default: interactive)
                             Options: interactive, headless, debug

  interactive                Show browser window with slow motion and pauses
  headless                   Fast execution without browser window
  debug                      Step-by-step execution with verbose logging

FILTERING OPTIONS:
  --tab <name>               Run tests for specific tab only
                             Example: --tab admin-bar

  --test <name>              Run specific test (partial match)
                             Example: --test colors

  --tags <tag1,tag2>         Run tests with specific tags
                             Example: --tags smoke,visual

  --exclude-tags <tag1,tag2> Exclude tests with specific tags
                             Example: --exclude-tags slow

BROWSER OPTIONS:
  --headed                   Show browser window (overrides config)
  --headless                 Hide browser window (overrides config)
  --slow-mo <ms>             Delay between actions in milliseconds
                             Example: --slow-mo 1000

  --viewport <WxH>           Set viewport size
                             Example: --viewport 1920x1080

EXECUTION OPTIONS:
  --pause-on-failure         Pause when test fails for inspection
  --fail-fast                Stop execution on first failure
  --retries <n>              Number of retries for failed tests
                             Example: --retries 2

SCREENSHOT & VIDEO OPTIONS:
  --screenshot-all           Take screenshots of all steps
  --video                    Record video of all tests
  --video-on-failure         Record video only for failed tests (default)

TIMEOUT OPTIONS:
  --timeout <ms>             Set default timeout in milliseconds
                             Example: --timeout 30000

OTHER OPTIONS:
  --help, -h                 Show this help message

EXAMPLES:
  # Run all tests in interactive mode
  node runner.js

  # Run tests for admin-bar tab in headless mode
  node runner.js --mode headless --tab admin-bar

  # Run smoke tests with slow motion
  node runner.js --tags smoke --slow-mo 1000

  # Debug a specific test
  node runner.js --mode debug --test "Admin Bar Colors"

  # Run tests with custom viewport
  node runner.js --viewport 1366x768

  # Run tests and stop on first failure
  node runner.js --fail-fast --pause-on-failure

ENVIRONMENT VARIABLES:
  WP_BASE_URL                WordPress base URL (default: http://localhost:8080)
  WP_ADMIN_USER              WordPress admin username (default: admin)
  WP_ADMIN_PASS              WordPress admin password (default: admin)
  TEST_MODE                  Default execution mode
  HEADLESS                   Run in headless mode (true/false)
  SLOW_MO                    Slow motion delay in milliseconds
  DEBUG                      Enable verbose logging (true/false)

For more information, see: tests/visual-interactive/README.md
`);
}

/**
 * Main runner function
 */
async function main() {
  // Parse command-line arguments
  const args = parseArguments();

  // Show help if requested
  if (args.help) {
    showHelp();
    process.exit(0);
  }

  // Display banner
  console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                  MASE Visual Interactive Test Runner                       ║
║                         Starting Test Execution                            ║
╚════════════════════════════════════════════════════════════════════════════╝
`);

  let browser = null;
  let context = null;
  let page = null;

  try {
    // Build configuration by merging defaults with CLI arguments
    const config = buildConfiguration(defaultConfig, args);

    // Validate configuration
    validateConfiguration(config);

    // Display configuration summary
    displayConfiguration(config);

    // Ensure output directories exist
    await ensureDirectories(config);

    // Initialize Playwright browser
    console.log('\n🌐 Initializing browser...');
    const browserResult = await initializeBrowser(config);
    browser = browserResult.browser;
    context = browserResult.context;
    page = browserResult.page;
    console.log('✅ Browser initialized\n');

    // Initialize test helpers
    const helpers = new TestHelpers(page, config);

    // Initialize test orchestrator
    const orchestrator = new TestOrchestrator(config);

    // Load test scenarios with filters
    console.log('📂 Loading test scenarios...');
    await orchestrator.loadScenarios(config.filters);
    console.log(`✅ Loaded ${orchestrator.scenarios.length} test scenarios\n`);

    if (orchestrator.scenarios.length === 0) {
      console.log('⚠️  No test scenarios found matching the filter criteria');
      process.exit(0);
    }

    // Login to WordPress
    console.log('🔐 Logging in to WordPress...');
    await helpers.loginToWordPress();
    console.log('✅ Logged in successfully\n');

    // Navigate to MASE settings page
    console.log('🎨 Navigating to MASE settings...');
    await helpers.navigateToSettings();
    console.log('✅ Settings page loaded\n');

    // Execute tests based on mode
    let results;
    switch (config.execution.mode) {
      case 'interactive':
        results = await orchestrator.runInteractive(page, helpers);
        break;

      case 'headless':
        results = await orchestrator.runHeadless(page, helpers);
        break;

      case 'debug':
        results = await orchestrator.runDebug(page, helpers);
        break;

      default:
        results = await orchestrator.executeScenarios(page, helpers);
    }

    // Display summary
    displaySummary(orchestrator.getSummary());

    // Generate report
    console.log('\n📊 Generating test report...');
    await generateReport(orchestrator, config);
    console.log('✅ Report generated\n');

    // Determine exit code based on results
    const summary = orchestrator.getSummary();
    const exitCode = summary.failed > 0 ? 1 : 0;

    // Cleanup
    await cleanup(browser, context, page);

    process.exit(exitCode);

  } catch (error) {
    console.error('\n❌ Fatal error during test execution:');
    console.error(`   ${error.message}`);
    
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }

    // Cleanup
    await cleanup(browser, context, page);

    process.exit(1);
  }
}

/**
 * Deep clone an object, preserving RegExp and other special types
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Build configuration by merging defaults with CLI arguments
 * @param {Object} defaultConfig - Default configuration
 * @param {Object} args - Parsed CLI arguments
 * @returns {Object} Merged configuration
 */
function buildConfiguration(defaultConfig, args) {
  const config = deepClone(defaultConfig); // Deep clone preserving RegExp

  // Apply CLI arguments
  if (args.mode !== null) {
    config.execution.mode = args.mode;
  }

  if (args.slowMo !== null) {
    config.browser.slowMo = args.slowMo;
  }

  if (args.pauseOnFailure !== null) {
    config.execution.pauseOnFailure = args.pauseOnFailure;
  }

  if (args.headed !== null) {
    config.browser.headless = false;
  }

  if (args.headless !== null) {
    config.browser.headless = true;
  }

  if (args.screenshotAll !== null) {
    config.execution.screenshotAll = args.screenshotAll;
  }

  if (args.video !== null) {
    config.execution.video = args.video;
  }

  if (args.videoOnFailure !== null) {
    config.execution.videoOnFailure = args.videoOnFailure;
  }

  if (args.failFast !== null) {
    config.execution.failFast = args.failFast;
  }

  if (args.retries !== null) {
    config.execution.retries = args.retries;
  }

  if (args.viewport !== null) {
    config.browser.viewport = args.viewport;
  }

  if (args.timeout !== null) {
    config.timeouts.navigation = args.timeout;
    config.timeouts.element = args.timeout;
  }

  // Apply filters
  if (args.tab !== null) {
    config.filters.tab = args.tab;
  }

  if (args.test !== null) {
    config.filters.test = args.test;
  }

  if (args.tags.length > 0) {
    config.filters.tags = args.tags;
  }

  if (args.excludeTags.length > 0) {
    config.filters.excludeTags = args.excludeTags;
  }

  // Adjust headless based on mode if not explicitly set
  if (args.headed === null && args.headless === null) {
    if (config.execution.mode === 'headless') {
      config.browser.headless = true;
    } else if (config.execution.mode === 'interactive' || config.execution.mode === 'debug') {
      config.browser.headless = false;
    }
  }

  // Enable verbose logging for debug mode
  if (config.execution.mode === 'debug') {
    config.debug.verbose = true;
    config.debug.logActions = true;
    config.debug.logConsole = true;
  }

  return config;
}

/**
 * Validate configuration
 * @param {Object} config - Configuration to validate
 * @throws {Error} If configuration is invalid
 */
function validateConfiguration(config) {
  // Validate mode
  const validModes = ['interactive', 'headless', 'debug'];
  if (!validModes.includes(config.execution.mode)) {
    throw new Error(
      `Invalid mode: ${config.execution.mode}. Must be one of: ${validModes.join(', ')}`
    );
  }

  // Validate slow motion
  if (config.browser.slowMo < 0) {
    throw new Error(`Invalid slow-mo value: ${config.browser.slowMo}. Must be >= 0`);
  }

  // Validate viewport
  if (config.browser.viewport.width <= 0 || config.browser.viewport.height <= 0) {
    throw new Error(
      `Invalid viewport size: ${config.browser.viewport.width}x${config.browser.viewport.height}`
    );
  }

  // Validate timeouts
  if (config.timeouts.navigation <= 0) {
    throw new Error(`Invalid navigation timeout: ${config.timeouts.navigation}. Must be > 0`);
  }

  // Validate retries
  if (config.execution.retries < 0) {
    throw new Error(`Invalid retries value: ${config.execution.retries}. Must be >= 0`);
  }

  // Validate WordPress URL
  if (!config.wordpress.baseURL) {
    throw new Error('WordPress base URL is required');
  }

  // Validate credentials
  if (!config.wordpress.credentials.username || !config.wordpress.credentials.password) {
    throw new Error('WordPress credentials are required');
  }
}

/**
 * Display configuration summary
 * @param {Object} config - Configuration to display
 */
function displayConfiguration(config) {
  console.log('⚙️  Configuration:');
  console.log(`   Mode: ${config.execution.mode}`);
  console.log(`   Browser: ${config.browser.type} (${config.browser.headless ? 'headless' : 'headed'})`);
  console.log(`   Viewport: ${config.browser.viewport.width}x${config.browser.viewport.height}`);
  console.log(`   Slow Motion: ${config.browser.slowMo}ms`);
  console.log(`   WordPress: ${config.wordpress.baseURL}`);
  
  if (config.filters.tab) {
    console.log(`   Filter - Tab: ${config.filters.tab}`);
  }
  
  if (config.filters.test) {
    console.log(`   Filter - Test: ${config.filters.test}`);
  }
  
  if (config.filters.tags.length > 0) {
    console.log(`   Filter - Tags: [${config.filters.tags.join(', ')}]`);
  }
  
  if (config.filters.excludeTags.length > 0) {
    console.log(`   Filter - Exclude Tags: [${config.filters.excludeTags.join(', ')}]`);
  }
}

/**
 * Ensure output directories exist
 * @param {Object} config - Configuration
 */
async function ensureDirectories(config) {
  const directories = [
    config.output.resultsDir,
    config.output.screenshotsDir,
    config.output.videosDir,
    config.output.reportDir
  ];

  for (const dir of directories) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's okay
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }
}

/**
 * Initialize Playwright browser
 * @param {Object} config - Configuration
 * @returns {Promise<Object>} Browser, context, and page objects
 */
async function initializeBrowser(config) {
  // Select browser type
  let browserType;
  switch (config.browser.type) {
    case 'firefox':
      browserType = firefox;
      break;
    case 'webkit':
      browserType = webkit;
      break;
    case 'chromium':
    default:
      browserType = chromium;
  }

  // Launch browser
  const browser = await browserType.launch({
    headless: config.browser.headless,
    slowMo: config.browser.slowMo,
    args: config.browser.args
  });

  // Create context
  const contextOptions = {
    viewport: config.browser.viewport,
    recordVideo: config.execution.video || config.execution.videoOnFailure ? {
      dir: config.output.videosDir,
      size: config.browser.viewport
    } : undefined
  };

  const context = await browser.newContext(contextOptions);

  // Create page
  const page = await context.newPage();

  // Set default timeouts
  page.setDefaultTimeout(config.timeouts.element);
  page.setDefaultNavigationTimeout(config.timeouts.navigation);

  return { browser, context, page };
}

/**
 * Display test execution summary
 * @param {Object} summary - Test summary
 */
function displaySummary(summary) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST EXECUTION SUMMARY');
  console.log('='.repeat(80));
  console.log(`   Total Tests:    ${summary.total}`);
  console.log(`   ✅ Passed:      ${summary.passed}`);
  console.log(`   ❌ Failed:      ${summary.failed}`);
  console.log(`   ⊘  Skipped:     ${summary.skipped}`);
  console.log(`   📈 Pass Rate:   ${summary.passRate}%`);
  console.log(`   ⏱️  Duration:    ${(summary.duration / 1000).toFixed(2)}s`);
  console.log('='.repeat(80));
}

/**
 * Generate HTML test report
 * @param {Object} orchestrator - Test orchestrator
 * @param {Object} config - Configuration
 */
async function generateReport(orchestrator, config) {
  try {
    // Create report generator
    const reporter = new ReportGenerator(orchestrator.results, config);

    // Generate comprehensive HTML report
    const reportPath = await reporter.generateReport();

    console.log(`   Report saved to: ${reportPath}`);
    console.log(`   Open in browser: file://${path.resolve(reportPath)}`);
  } catch (error) {
    console.error(`   Failed to generate report: ${error.message}`);
    // Don't fail the entire test run if report generation fails
  }
}

/**
 * Cleanup resources
 * @param {Browser} browser - Playwright browser
 * @param {BrowserContext} context - Browser context
 * @param {Page} page - Page object
 */
async function cleanup(browser, context, page) {
  try {
    if (page) {
      await page.close();
    }
    if (context) {
      await context.close();
    }
    if (browser) {
      await browser.close();
    }
  } catch (error) {
    console.error('Error during cleanup:', error.message);
  }
}

// Run the main function
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { main, parseArguments, buildConfiguration, validateConfiguration };
