/**
 * Visual Interactive Testing Configuration
 * 
 * This configuration file defines default settings for the visual interactive
 * testing system. Values can be overridden via environment variables or
 * command-line arguments.
 */

module.exports = {
  // WordPress Configuration
  wordpress: {
    // Base URL for WordPress installation
    baseURL: process.env.WP_BASE_URL || 'http://localhost:8080',
    
    // Admin credentials
    credentials: {
      username: process.env.WP_ADMIN_USER || 'admin',
      password: process.env.WP_ADMIN_PASS || 'admin'
    },
    
    // MASE settings page URL
    settingsPage: '/wp-admin/admin.php?page=mase-settings'
  },

  // Browser Configuration
  browser: {
    // Browser type: 'chromium', 'firefox', 'webkit'
    type: process.env.BROWSER_TYPE || 'chromium',
    
    // Headless mode (true for CI/CD, false for interactive)
    headless: process.env.HEADLESS === 'true',
    
    // Slow motion delay between actions (milliseconds)
    slowMo: parseInt(process.env.SLOW_MO || '500', 10),
    
    // Default viewport size
    viewport: {
      width: parseInt(process.env.VIEWPORT_WIDTH || '1920', 10),
      height: parseInt(process.env.VIEWPORT_HEIGHT || '1080', 10)
    },
    
    // Browser launch arguments
    args: [
      '--disable-dev-shm-usage',
      '--no-sandbox'
    ]
  },

  // Test Execution Configuration
  execution: {
    // Execution mode: 'interactive', 'headless', 'debug'
    mode: process.env.TEST_MODE || 'interactive',
    
    // Pause on test failure for inspection
    pauseOnFailure: process.env.PAUSE_ON_FAILURE !== 'false',
    
    // Take screenshots of all steps (not just failures)
    screenshotAll: process.env.SCREENSHOT_ALL === 'true',
    
    // Record video of all tests
    video: process.env.VIDEO === 'true',
    
    // Record video only for failed tests
    videoOnFailure: process.env.VIDEO_ON_FAILURE !== 'false',
    
    // Fail fast - stop on first failure
    failFast: process.env.FAIL_FAST === 'true',
    
    // Maximum number of retries for failed tests
    retries: parseInt(process.env.TEST_RETRIES || '0', 10)
  },

  // Timeout Configuration (milliseconds)
  timeouts: {
    // Default timeout for page navigation
    navigation: parseInt(process.env.TIMEOUT_NAVIGATION || '30000', 10),
    
    // Default timeout for element selection
    element: parseInt(process.env.TIMEOUT_ELEMENT || '10000', 10),
    
    // Timeout for AJAX requests to complete
    ajax: parseInt(process.env.TIMEOUT_AJAX || '10000', 10),
    
    // Timeout for Live Preview updates
    livePreview: parseInt(process.env.TIMEOUT_LIVE_PREVIEW || '2000', 10),
    
    // Timeout for settings save operation
    save: parseInt(process.env.TIMEOUT_SAVE || '5000', 10),
    
    // Pause duration for visual inspection (interactive mode)
    inspection: parseInt(process.env.TIMEOUT_INSPECTION || '2000', 10)
  },

  // Output Configuration
  output: {
    // Directory for test results
    resultsDir: process.env.RESULTS_DIR || 'test-results/visual-interactive',
    
    // Directory for screenshots
    screenshotsDir: process.env.SCREENSHOTS_DIR || 'test-results/visual-interactive/screenshots',
    
    // Directory for videos
    videosDir: process.env.VIDEOS_DIR || 'test-results/visual-interactive/videos',
    
    // Directory for HTML reports
    reportDir: process.env.REPORT_DIR || 'playwright-report/visual-interactive',
    
    // Report filename
    reportFile: 'index.html',
    
    // Screenshot format: 'png' or 'jpeg'
    screenshotFormat: 'png',
    
    // Screenshot quality (1-100, only for jpeg)
    // Note: Quality is ignored for PNG format
    screenshotQuality: null,
    
    // Video format: 'webm' or 'mp4'
    videoFormat: 'webm'
  },

  // Test Filtering
  filters: {
    // Filter by tab name (null = all tabs)
    tab: process.env.TEST_TAB || null,
    
    // Filter by test name (null = all tests)
    test: process.env.TEST_NAME || null,
    
    // Filter by tags (comma-separated)
    tags: process.env.TEST_TAGS ? process.env.TEST_TAGS.split(',') : [],
    
    // Exclude tags (comma-separated)
    excludeTags: process.env.EXCLUDE_TAGS ? process.env.EXCLUDE_TAGS.split(',') : []
  },

  // Responsive Testing Viewports
  viewports: {
    desktop: { width: 1920, height: 1080 },
    laptop: { width: 1366, height: 768 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 }
  },

  // Console Monitoring
  console: {
    // Monitor console for errors
    monitorErrors: true,
    
    // Fail test on console errors
    failOnErrors: process.env.FAIL_ON_CONSOLE_ERRORS === 'true',
    
    // Patterns to ignore (e.g., favicon 404, browser extensions)
    ignorePatterns: [
      /favicon\.ico/,
      /chrome-extension/,
      /moz-extension/,
      /Failed to load resource.*favicon/
    ]
  },

  // Live Preview Configuration
  livePreview: {
    // Enable Live Preview by default in tests
    enableByDefault: true,
    
    // Wait time after enabling Live Preview
    enableWait: 500,
    
    // Wait time after changing a setting with Live Preview
    changeWait: 1000
  },

  // Debug Configuration
  debug: {
    // Verbose logging
    verbose: process.env.DEBUG === 'true',
    
    // Log all Playwright actions
    logActions: process.env.LOG_ACTIONS === 'true',
    
    // Log all AJAX requests
    logAjax: process.env.LOG_AJAX === 'true',
    
    // Log console messages from browser
    logConsole: process.env.LOG_CONSOLE === 'true'
  }
};
