/**
 * Playwright Configuration for MASE Browser Compatibility Tests
 * 
 * @see https://playwright.dev/docs/test-configuration
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './',
    testMatch: 'automated-browser-tests.js',
    
    // Maximum time one test can run
    timeout: 30 * 1000,
    
    // Test execution settings
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    
    // Reporter configuration
    reporter: [
        ['html', { outputFolder: 'test-results/html-report' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['list']
    ],
    
    // Shared settings for all projects
    use: {
        // Base URL for tests
        baseURL: 'file://' + __dirname,
        
        // Collect trace on failure
        trace: 'on-first-retry',
        
        // Screenshot on failure
        screenshot: 'only-on-failure',
        
        // Video on failure
        video: 'retain-on-failure',
    },
    
    // Configure projects for major browsers
    projects: [
        // Chrome/Chromium Tests
        {
            name: 'chromium',
            use: { 
                ...devices['Desktop Chrome'],
                viewport: { width: 1920, height: 1080 }
            },
        },
        
        // Firefox Tests
        {
            name: 'firefox',
            use: { 
                ...devices['Desktop Firefox'],
                viewport: { width: 1920, height: 1080 }
            },
        },
        
        // WebKit/Safari Tests
        {
            name: 'webkit',
            use: { 
                ...devices['Desktop Safari'],
                viewport: { width: 1920, height: 1080 }
            },
        },
        
        // Edge Tests (Chromium-based)
        {
            name: 'edge',
            use: { 
                ...devices['Desktop Edge'],
                channel: 'msedge',
                viewport: { width: 1920, height: 1080 }
            },
        },
        
        // Mobile Safari (iOS)
        {
            name: 'mobile-safari',
            use: { 
                ...devices['iPhone 13']
            },
        },
        
        // Mobile Chrome (Android)
        {
            name: 'mobile-chrome',
            use: { 
                ...devices['Pixel 5']
            },
        },
        
        // Tablet Tests
        {
            name: 'tablet-ipad',
            use: { 
                ...devices['iPad Pro']
            },
        },
        
        // Different viewport sizes
        {
            name: 'desktop-1366',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1366, height: 768 }
            },
        },
        
        {
            name: 'desktop-1024',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1024, height: 768 }
            },
        },
    ],
    
    // Web server configuration (if needed)
    // webServer: {
    //     command: 'npm run start',
    //     port: 3000,
    //     timeout: 120 * 1000,
    //     reuseExistingServer: !process.env.CI,
    // },
});
