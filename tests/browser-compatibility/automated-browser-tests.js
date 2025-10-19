/**
 * Automated Browser Compatibility Tests for MASE v1.2.0
 * 
 * Tests Requirements 19.1, 19.2, 19.3, 19.4, 19.5
 * 
 * Usage:
 *   npm install @playwright/test
 *   npx playwright test automated-browser-tests.js
 * 
 * Run specific browser:
 *   npx playwright test automated-browser-tests.js --project=chromium
 *   npx playwright test automated-browser-tests.js --project=firefox
 *   npx playwright test automated-browser-tests.js --project=webkit
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_URL = 'file://' + path.resolve(__dirname, 'test-browser-compatibility.html');
const RESULTS_DIR = path.join(__dirname, 'test-results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

/**
 * Helper function to save test results
 */
async function saveTestResults(browserName, results) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${browserName}-${timestamp}.json`;
    const filepath = path.join(RESULTS_DIR, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
    console.log(`Results saved to: ${filepath}`);
}

/**
 * Helper function to take screenshot on failure
 */
async function takeScreenshot(page, testName, browserName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${browserName}-${testName}-${timestamp}.png`;
    const filepath = path.join(RESULTS_DIR, filename);
    
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`Screenshot saved to: ${filepath}`);
}

/**
 * Test Suite: Browser Detection
 */
test.describe('Browser Detection', () => {
    test('should detect browser information correctly', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        
        // Wait for browser info to be displayed
        await page.waitForSelector('#browserName');
        
        const detectedBrowser = await page.textContent('#browserName');
        const detectedVersion = await page.textContent('#browserVersion');
        const platform = await page.textContent('#platform');
        
        console.log(`Detected: ${detectedBrowser} ${detectedVersion} on ${platform}`);
        
        expect(detectedBrowser).toBeTruthy();
        expect(detectedVersion).toBeTruthy();
        expect(platform).toBeTruthy();
    });
});

/**
 * Test Suite: CSS Features
 */
test.describe('CSS Features', () => {
    test('CSS Variables should be supported', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('#cssVarResult');
        
        const result = await page.textContent('#cssVarResult');
        
        if (result !== 'PASS') {
            await takeScreenshot(page, 'css-variables', browserName);
        }
        
        expect(result).toBe('PASS');
    });
    
    test('Backdrop Filter should work or have fallback', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('#backdropResult');
        
        const result = await page.textContent('#backdropResult');
        
        // Accept PASS or EXPECTED (for Firefox <103 fallback)
        const isValid = result.includes('PASS') || result.includes('EXPECTED');
        
        if (!isValid) {
            await takeScreenshot(page, 'backdrop-filter', browserName);
        }
        
        expect(isValid).toBeTruthy();
    });
    
    test('Flexbox should be supported', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('#flexboxResult');
        
        const result = await page.textContent('#flexboxResult');
        
        if (result !== 'PASS') {
            await takeScreenshot(page, 'flexbox', browserName);
        }
        
        expect(result).toBe('PASS');
    });
    
    test('CSS Grid should be supported', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('#gridResult');
        
        const result = await page.textContent('#gridResult');
        
        if (result !== 'PASS') {
            await takeScreenshot(page, 'grid', browserName);
        }
        
        expect(result).toBe('PASS');
    });
    
    test('CSS Transforms should be supported', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('#transformResult');
        
        const result = await page.textContent('#transformResult');
        
        if (result !== 'PASS') {
            await takeScreenshot(page, 'transforms', browserName);
        }
        
        expect(result).toBe('PASS');
    });
    
    test('CSS Transitions should be supported', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('#transitionResult');
        
        const result = await page.textContent('#transitionResult');
        
        if (result !== 'PASS') {
            await takeScreenshot(page, 'transitions', browserName);
        }
        
        expect(result).toBe('PASS');
    });
    
    test('Box Shadow should be supported', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('#shadowResult');
        
        const result = await page.textContent('#shadowResult');
        
        if (result !== 'PASS') {
            await takeScreenshot(page, 'box-shadow', browserName);
        }
        
        expect(result).toBe('PASS');
    });
    
    test('Border Radius should be supported', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('#borderRadiusResult');
        
        const result = await page.textContent('#borderRadiusResult');
        
        if (result !== 'PASS') {
            await takeScreenshot(page, 'border-radius', browserName);
        }
        
        expect(result).toBe('PASS');
    });
    
    test('Media Queries should work correctly', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('#mediaQueryResult');
        
        const result = await page.textContent('#mediaQueryResult');
        
        if (result !== 'PASS') {
            await takeScreenshot(page, 'media-queries', browserName);
        }
        
        expect(result).toBe('PASS');
    });
    
    test('CSS Calc() should be supported', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('#calcResult');
        
        const result = await page.textContent('#calcResult');
        
        if (result !== 'PASS') {
            await takeScreenshot(page, 'calc', browserName);
        }
        
        expect(result).toBe('PASS');
    });
});

/**
 * Test Suite: JavaScript Features
 */
test.describe('JavaScript Features', () => {
    test('should have no JavaScript errors on page load', async ({ page, browserName }) => {
        const errors = [];
        
        page.on('pageerror', error => {
            errors.push(error.message);
        });
        
        await page.goto(TEST_URL);
        await page.waitForTimeout(2000); // Wait for all scripts to execute
        
        if (errors.length > 0) {
            console.error('JavaScript errors detected:', errors);
            await takeScreenshot(page, 'js-errors', browserName);
        }
        
        expect(errors).toHaveLength(0);
    });
    
    test('should have no console warnings', async ({ page, browserName }) => {
        const warnings = [];
        
        page.on('console', msg => {
            if (msg.type() === 'warning') {
                warnings.push(msg.text());
            }
        });
        
        await page.goto(TEST_URL);
        await page.waitForTimeout(2000);
        
        // Filter out expected warnings
        const unexpectedWarnings = warnings.filter(w => 
            !w.includes('DevTools') && !w.includes('Extension')
        );
        
        if (unexpectedWarnings.length > 0) {
            console.warn('Console warnings detected:', unexpectedWarnings);
        }
        
        expect(unexpectedWarnings).toHaveLength(0);
    });
    
    test('all JavaScript features should be supported', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('#jsFeatures');
        
        const featuresHtml = await page.innerHTML('#jsFeatures');
        
        // Check that all features show green checkmarks
        const failedFeatures = featuresHtml.match(/✗/g);
        
        if (failedFeatures) {
            console.error('Some JavaScript features not supported');
            await takeScreenshot(page, 'js-features', browserName);
        }
        
        expect(failedFeatures).toBeNull();
    });
});

/**
 * Test Suite: Visual Rendering
 */
test.describe('Visual Rendering', () => {
    test('page should render without layout shifts', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        
        // Wait for page to fully load
        await page.waitForLoadState('networkidle');
        
        // Take initial screenshot
        const screenshot1 = await page.screenshot();
        
        // Wait a bit and take another screenshot
        await page.waitForTimeout(1000);
        const screenshot2 = await page.screenshot();
        
        // Screenshots should be identical (no layout shifts)
        expect(screenshot1.equals(screenshot2)).toBeTruthy();
    });
    
    test('should handle viewport resize correctly', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        
        // Test desktop viewport
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(500);
        
        let errors = [];
        page.on('pageerror', error => errors.push(error.message));
        
        // Test tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(500);
        
        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        
        if (errors.length > 0) {
            console.error('Errors during viewport resize:', errors);
            await takeScreenshot(page, 'viewport-resize', browserName);
        }
        
        expect(errors).toHaveLength(0);
    });
});

/**
 * Test Suite: Performance
 */
test.describe('Performance', () => {
    test('page should load within acceptable time', async ({ page, browserName }) => {
        const startTime = Date.now();
        
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        
        console.log(`Page load time: ${loadTime}ms`);
        
        // Should load within 3 seconds
        expect(loadTime).toBeLessThan(3000);
    });
    
    test('should not have memory leaks', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        
        // Get initial memory usage
        const initialMetrics = await page.metrics();
        
        // Trigger some interactions
        await page.click('button.btn-primary');
        await page.waitForTimeout(1000);
        
        // Get final memory usage
        const finalMetrics = await page.metrics();
        
        // Memory should not increase significantly (allow 10MB increase)
        const memoryIncrease = finalMetrics.JSHeapUsedSize - initialMetrics.JSHeapUsedSize;
        const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
        
        console.log(`Memory increase: ${memoryIncreaseMB.toFixed(2)}MB`);
        
        expect(memoryIncreaseMB).toBeLessThan(10);
    });
});

/**
 * Test Suite: Accessibility
 */
test.describe('Accessibility', () => {
    test('should have no accessibility violations', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        
        // Inject axe-core for accessibility testing
        await page.addScriptTag({
            url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js'
        });
        
        // Run accessibility tests
        const results = await page.evaluate(() => {
            return new Promise((resolve) => {
                axe.run((err, results) => {
                    if (err) throw err;
                    resolve(results);
                });
            });
        });
        
        if (results.violations.length > 0) {
            console.error('Accessibility violations:', results.violations);
            await takeScreenshot(page, 'a11y-violations', browserName);
        }
        
        expect(results.violations).toHaveLength(0);
    });
    
    test('should be keyboard navigable', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        
        // Try to tab through interactive elements
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
        
        // Check if focus is visible
        const focusedElement = await page.evaluate(() => {
            return document.activeElement.tagName;
        });
        
        expect(focusedElement).not.toBe('BODY');
    });
});

/**
 * Test Suite: Export Results
 */
test.describe('Export Test Results', () => {
    test('should export comprehensive test results', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        
        // Wait for all tests to complete
        await page.waitForTimeout(3000);
        
        // Get test results from page
        const results = await page.evaluate(() => {
            return {
                timestamp: new Date().toISOString(),
                browser: {
                    name: document.getElementById('browserName').textContent,
                    version: document.getElementById('browserVersion').textContent,
                    userAgent: document.getElementById('userAgent').textContent,
                    platform: document.getElementById('platform').textContent
                },
                tests: {
                    cssVariables: document.getElementById('cssVarResult').textContent,
                    backdropFilter: document.getElementById('backdropResult').textContent,
                    flexbox: document.getElementById('flexboxResult').textContent,
                    grid: document.getElementById('gridResult').textContent,
                    transforms: document.getElementById('transformResult').textContent,
                    transitions: document.getElementById('transitionResult').textContent,
                    boxShadow: document.getElementById('shadowResult').textContent,
                    borderRadius: document.getElementById('borderRadiusResult').textContent,
                    mediaQueries: document.getElementById('mediaQueryResult').textContent,
                    calc: document.getElementById('calcResult').textContent
                },
                consoleOutput: document.getElementById('consoleOutput').innerText
            };
        });
        
        // Save results
        await saveTestResults(browserName, results);
        
        expect(results).toBeTruthy();
    });
});

/**
 * Browser-Specific Tests
 */
test.describe('Browser-Specific Tests', () => {
    test('Firefox: should handle backdrop-filter correctly', async ({ page, browserName }) => {
        test.skip(browserName !== 'firefox', 'Firefox-specific test');
        
        await page.goto(TEST_URL);
        await page.waitForSelector('#backdropResult');
        
        const result = await page.textContent('#backdropResult');
        const browserVersion = await page.textContent('#browserVersion');
        const version = parseInt(browserVersion);
        
        if (version < 103) {
            // Should use fallback
            expect(result).toContain('EXPECTED');
        } else {
            // Should support backdrop-filter
            expect(result).toContain('PASS');
        }
    });
    
    test('Safari: should handle webkit prefixes', async ({ page, browserName }) => {
        test.skip(browserName !== 'webkit', 'Safari-specific test');
        
        await page.goto(TEST_URL);
        
        // Check for webkit-specific features
        const hasWebkitSupport = await page.evaluate(() => {
            const style = document.createElement('div').style;
            return 'webkitBackdropFilter' in style;
        });
        
        expect(hasWebkitSupport).toBeTruthy();
    });
});
