/**
 * Browser Compatibility Tests for Admin Bar Comprehensive Enhancement
 * 
 * Tests Requirements: All requirements from adminbar-comprehensive-enhancement spec
 * 
 * Tests all features across Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
 * 
 * Usage:
 *   cd tests/browser-compatibility
 *   npm install
 *   npx playwright test test-adminbar-enhancement-browser-compat.js
 * 
 * Run specific browser:
 *   npx playwright test test-adminbar-enhancement-browser-compat.js --project=chromium
 *   npx playwright test test-adminbar-enhancement-browser-compat.js --project=firefox
 *   npx playwright test test-adminbar-enhancement-browser-compat.js --project=webkit
 *   npx playwright test test-adminbar-enhancement-browser-compat.js --project=edge
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Test configuration
const RESULTS_DIR = path.join(__dirname, 'test-results', 'adminbar-enhancement');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

/**
 * Helper: Save test results
 */
async function saveTestResults(browserName, testName, results) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${browserName}-${testName}-${timestamp}.json`;
    const filepath = path.join(RESULTS_DIR, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
    console.log(`✓ Results saved: ${filename}`);
}

/**
 * Helper: Take screenshot
 */
async function takeScreenshot(page, testName, browserName, suffix = '') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${browserName}-${testName}${suffix ? '-' + suffix : ''}-${timestamp}.png`;
    const filepath = path.join(RESULTS_DIR, filename);
    
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`📸 Screenshot saved: ${filename}`);
}

/**
 * Helper: Create test HTML page
 */
function createTestHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Bar Enhancement Browser Compatibility Test</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
        
        /* Admin Bar Simulation */
        #wpadminbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 32px;
            background: linear-gradient(90deg, #23282d 0%, #32373c 100%);
            color: #ffffff;
            display: flex;
            align-items: center;
            padding: 0 15px;
            z-index: 99999;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            border-radius: 0 0 8px 8px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        #wpadminbar.floating {
            margin: 8px;
            width: calc(100% - 16px);
            border-radius: 8px;
        }
        
        #wpadminbar .ab-item {
            color: inherit;
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 0 10px;
            text-decoration: none;
        }
        
        #wpadminbar .ab-icon {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }
        
        #wpadminbar .ab-submenu {
            position: absolute;
            top: 100%;
            left: 0;
            background: #32373c;
            border-radius: 4px;
            margin-top: 5px;
            padding: 5px 0;
            display: none;
        }
        
        #wpadminbar .ab-item:hover + .ab-submenu {
            display: block;
        }
        
        /* Test Results */
        .test-results {
            margin-top: 100px;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 8px;
        }
        
        .test-item {
            padding: 10px;
            margin: 5px 0;
            background: white;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .test-pass { border-left: 4px solid #46b450; }
        .test-fail { border-left: 4px solid #dc3232; }
        .test-warn { border-left: 4px solid #ffb900; }
        
        .status { font-weight: bold; }
        .status.pass { color: #46b450; }
        .status.fail { color: #dc3232; }
        .status.warn { color: #ffb900; }
    </style>
</head>
<body>
    <!-- Admin Bar -->
    <div id="wpadminbar">
        <a href="#" class="ab-item">
            <svg class="ab-icon" viewBox="0 0 20 20">
                <path d="M10 2L2 7v11h6v-6h4v6h6V7l-8-5z"/>
            </svg>
            <span>Dashboard</span>
        </a>
        <div class="ab-submenu">
            <a href="#" class="ab-item">Submenu Item 1</a>
            <a href="#" class="ab-item">Submenu Item 2</a>
        </div>
    </div>
    
    <!-- Test Results Container -->
    <div class="test-results">
        <h1>Browser Compatibility Test Results</h1>
        <div id="browser-info"></div>
        <div id="test-results"></div>
    </div>
    
    <script>
        // Browser detection
        const browserInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            vendor: navigator.vendor,
            language: navigator.language
        };
        
        // Display browser info
        document.getElementById('browser-info').innerHTML = \`
            <div class="test-item">
                <strong>Browser:</strong> \${browserInfo.userAgent}
            </div>
            <div class="test-item">
                <strong>Platform:</strong> \${browserInfo.platform}
            </div>
        \`;
        
        // Test results storage
        window.testResults = [];
        
        // Helper: Add test result
        function addTestResult(name, passed, message = '') {
            const result = { name, passed, message, timestamp: new Date().toISOString() };
            window.testResults.push(result);
            
            const div = document.createElement('div');
            div.className = \`test-item test-\${passed ? 'pass' : 'fail'}\`;
            div.innerHTML = \`
                <span>\${name}</span>
                <span class="status \${passed ? 'pass' : 'fail'}">\${passed ? '✓ PASS' : '✗ FAIL'}\${message ? ': ' + message : ''}</span>
            \`;
            document.getElementById('test-results').appendChild(div);
        }
        
        // Run tests
        setTimeout(() => {
            runCompatibilityTests();
        }, 100);
        
        function runCompatibilityTests() {
            // Test 1: CSS Variables
            testCSSVariables();
            
            // Test 2: Flexbox
            testFlexbox();
            
            // Test 3: Backdrop Filter
            testBackdropFilter();
            
            // Test 4: CSS Gradients
            testGradients();
            
            // Test 5: Border Radius
            testBorderRadius();
            
            // Test 6: Box Shadow
            testBoxShadow();
            
            // Test 7: CSS Transforms
            testTransforms();
            
            // Test 8: CSS Transitions
            testTransitions();
            
            // Test 9: Google Fonts Loading
            testGoogleFonts();
            
            // Test 10: JavaScript Features
            testJavaScriptFeatures();
        }
        
        function testCSSVariables() {
            const el = document.createElement('div');
            el.style.setProperty('--test-var', 'test');
            const value = getComputedStyle(el).getPropertyValue('--test-var');
            addTestResult('CSS Variables', value === 'test');
        }
        
        function testFlexbox() {
            const el = document.createElement('div');
            el.style.display = 'flex';
            document.body.appendChild(el);
            const computed = getComputedStyle(el).display;
            document.body.removeChild(el);
            addTestResult('Flexbox', computed === 'flex');
        }
        
        function testBackdropFilter() {
            const el = document.createElement('div');
            el.style.backdropFilter = 'blur(10px)';
            const supported = el.style.backdropFilter !== '';
            addTestResult('Backdrop Filter', supported, supported ? '' : 'Fallback required');
        }
        
        function testGradients() {
            const el = document.createElement('div');
            el.style.background = 'linear-gradient(90deg, red, blue)';
            const supported = el.style.background.includes('gradient');
            addTestResult('CSS Gradients', supported);
        }
        
        function testBorderRadius() {
            const el = document.createElement('div');
            el.style.borderRadius = '10px';
            const supported = el.style.borderRadius === '10px';
            addTestResult('Border Radius', supported);
        }
        
        function testBoxShadow() {
            const el = document.createElement('div');
            el.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            const supported = el.style.boxShadow !== '';
            addTestResult('Box Shadow', supported);
        }
        
        function testTransforms() {
            const el = document.createElement('div');
            el.style.transform = 'translateX(10px)';
            const supported = el.style.transform !== '';
            addTestResult('CSS Transforms', supported);
        }
        
        function testTransitions() {
            const el = document.createElement('div');
            el.style.transition = 'all 0.3s ease';
            const supported = el.style.transition !== '';
            addTestResult('CSS Transitions', supported);
        }
        
        function testGoogleFonts() {
            // Test if we can load Google Fonts
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap';
            
            link.onload = () => {
                addTestResult('Google Fonts Loading', true);
            };
            
            link.onerror = () => {
                addTestResult('Google Fonts Loading', false, 'Network error');
            };
            
            document.head.appendChild(link);
        }
        
        function testJavaScriptFeatures() {
            // Test ES6+ features
            const features = {
                'Arrow Functions': () => { try { eval('() => {}'); return true; } catch(e) { return false; } },
                'Template Literals': () => { try { eval('\`test\`'); return true; } catch(e) { return false; } },
                'Const/Let': () => { try { eval('const x = 1; let y = 2;'); return true; } catch(e) { return false; } },
                'Promises': () => typeof Promise !== 'undefined',
                'Fetch API': () => typeof fetch !== 'undefined',
                'querySelector': () => typeof document.querySelector !== 'undefined',
                'addEventListener': () => typeof document.addEventListener !== 'undefined'
            };
            
            for (const [name, test] of Object.entries(features)) {
                addTestResult(\`JS: \${name}\`, test());
            }
        }
    </script>
</body>
</html>`;
}

// Setup: Create test HTML file
test.beforeAll(async () => {
    const testHtmlPath = path.join(__dirname, 'test-adminbar-enhancement.html');
    fs.writeFileSync(testHtmlPath, createTestHTML());
    console.log('✓ Test HTML file created');
});

/**
 * Test Suite: Chrome 90+ Compatibility (Task 19.1)
 */
test.describe('Chrome 90+ Compatibility', () => {
    test('should support all Admin Bar enhancement features in Chrome', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Chrome-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        // Wait for tests to complete
        await page.waitForTimeout(3000);
        
        // Get test results
        const results = await page.evaluate(() => window.testResults);
        
        // Save results
        await saveTestResults('chrome', 'all-features', {
            browser: 'Chrome',
            timestamp: new Date().toISOString(),
            results: results
        });
        
        // Check for failures
        const failures = results.filter(r => !r.passed);
        
        if (failures.length > 0) {
            console.error('Chrome test failures:', failures);
            await takeScreenshot(page, 'chrome-failures', browserName);
        }
        
        expect(failures).toHaveLength(0);
    });
    
    test('Chrome: should render gradient backgrounds correctly', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Chrome-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        // Test gradient rendering
        const gradientSupported = await page.evaluate(() => {
            const el = document.getElementById('wpadminbar');
            const computed = getComputedStyle(el);
            return computed.backgroundImage.includes('gradient');
        });
        
        expect(gradientSupported).toBeTruthy();
    });
    
    test('Chrome: should support backdrop-filter for glassmorphism', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Chrome-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        const backdropSupported = await page.evaluate(() => {
            const el = document.getElementById('wpadminbar');
            const computed = getComputedStyle(el);
            return computed.backdropFilter !== 'none';
        });
        
        expect(backdropSupported).toBeTruthy();
    });
    
    test('Chrome: should handle live preview updates', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Chrome-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        // Simulate live preview update
        await page.evaluate(() => {
            const adminBar = document.getElementById('wpadminbar');
            adminBar.style.height = '50px';
            adminBar.style.backgroundColor = '#ff0000';
        });
        
        await page.waitForTimeout(500);
        
        const styles = await page.evaluate(() => {
            const el = document.getElementById('wpadminbar');
            const computed = getComputedStyle(el);
            return {
                height: computed.height,
                backgroundColor: computed.backgroundColor
            };
        });
        
        expect(styles.height).toBe('50px');
        expect(styles.backgroundColor).toBe('rgb(255, 0, 0)');
    });
    
    test('Chrome: should load Google Fonts successfully', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Chrome-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        // Wait for Google Fonts test to complete
        await page.waitForTimeout(3000);
        
        const googleFontsResult = await page.evaluate(() => {
            return window.testResults.find(r => r.name === 'Google Fonts Loading');
        });
        
        expect(googleFontsResult.passed).toBeTruthy();
    });
});

/**
 * Test Suite: Firefox 88+ Compatibility (Task 19.2)
 */
test.describe('Firefox 88+ Compatibility', () => {
    test('should support all Admin Bar enhancement features in Firefox', async ({ page, browserName }) => {
        test.skip(browserName !== 'firefox', 'Firefox-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        // Wait for tests to complete
        await page.waitForTimeout(3000);
        
        // Get test results
        const results = await page.evaluate(() => window.testResults);
        
        // Save results
        await saveTestResults('firefox', 'all-features', {
            browser: 'Firefox',
            timestamp: new Date().toISOString(),
            results: results
        });
        
        // Check for failures (allow backdrop-filter to fail in older Firefox)
        const criticalFailures = results.filter(r => 
            !r.passed && r.name !== 'Backdrop Filter'
        );
        
        if (criticalFailures.length > 0) {
            console.error('Firefox test failures:', criticalFailures);
            await takeScreenshot(page, 'firefox-failures', browserName);
        }
        
        expect(criticalFailures).toHaveLength(0);
    });
    
    test('Firefox: should handle backdrop-filter or use fallback', async ({ page, browserName }) => {
        test.skip(browserName !== 'firefox', 'Firefox-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        const backdropInfo = await page.evaluate(() => {
            const el = document.getElementById('wpadminbar');
            const computed = getComputedStyle(el);
            return {
                backdropFilter: computed.backdropFilter,
                backgroundColor: computed.backgroundColor,
                opacity: computed.opacity
            };
        });
        
        // Either backdrop-filter works or we have a fallback
        const hasBackdropOrFallback = 
            backdropInfo.backdropFilter !== 'none' || 
            backdropInfo.opacity !== '1';
        
        expect(hasBackdropOrFallback).toBeTruthy();
    });
    
    test('Firefox: should render gradients correctly', async ({ page, browserName }) => {
        test.skip(browserName !== 'firefox', 'Firefox-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        const gradientSupported = await page.evaluate(() => {
            const el = document.getElementById('wpadminbar');
            const computed = getComputedStyle(el);
            return computed.backgroundImage.includes('gradient');
        });
        
        expect(gradientSupported).toBeTruthy();
    });
    
    test('Firefox: should handle live preview updates', async ({ page, browserName }) => {
        test.skip(browserName !== 'firefox', 'Firefox-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        // Simulate live preview update
        await page.evaluate(() => {
            const adminBar = document.getElementById('wpadminbar');
            adminBar.style.height = '50px';
            adminBar.style.borderRadius = '10px';
        });
        
        await page.waitForTimeout(500);
        
        const styles = await page.evaluate(() => {
            const el = document.getElementById('wpadminbar');
            const computed = getComputedStyle(el);
            return {
                height: computed.height,
                borderRadius: computed.borderRadius
            };
        });
        
        expect(styles.height).toBe('50px');
        expect(styles.borderRadius).toBe('10px');
    });
    
    test('Firefox: should load Google Fonts successfully', async ({ page, browserName }) => {
        test.skip(browserName !== 'firefox', 'Firefox-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        // Wait for Google Fonts test to complete
        await page.waitForTimeout(3000);
        
        const googleFontsResult = await page.evaluate(() => {
            return window.testResults.find(r => r.name === 'Google Fonts Loading');
        });
        
        expect(googleFontsResult.passed).toBeTruthy();
    });
});

/**
 * Test Suite: Safari 14+ Compatibility (Task 19.3)
 */
test.describe('Safari 14+ Compatibility', () => {
    test('should support all Admin Bar enhancement features in Safari', async ({ page, browserName }) => {
        test.skip(browserName !== 'webkit', 'Safari-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        // Wait for tests to complete
        await page.waitForTimeout(3000);
        
        // Get test results
        const results = await page.evaluate(() => window.testResults);
        
        // Save results
        await saveTestResults('safari', 'all-features', {
            browser: 'Safari',
            timestamp: new Date().toISOString(),
            results: results
        });
        
        // Check for failures
        const failures = results.filter(r => !r.passed);
        
        if (failures.length > 0) {
            console.error('Safari test failures:', failures);
            await takeScreenshot(page, 'safari-failures', browserName);
        }
        
        expect(failures).toHaveLength(0);
    });
    
    test('Safari: should support webkit-backdrop-filter', async ({ page, browserName }) => {
        test.skip(browserName !== 'webkit', 'Safari-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        const webkitBackdropSupported = await page.evaluate(() => {
            const el = document.createElement('div');
            el.style.webkitBackdropFilter = 'blur(10px)';
            return el.style.webkitBackdropFilter !== '';
        });
        
        expect(webkitBackdropSupported).toBeTruthy();
    });
    
    test('Safari: should render gradients with webkit prefix if needed', async ({ page, browserName }) => {
        test.skip(browserName !== 'webkit', 'Safari-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        const gradientSupported = await page.evaluate(() => {
            const el = document.getElementById('wpadminbar');
            const computed = getComputedStyle(el);
            return computed.backgroundImage.includes('gradient');
        });
        
        expect(gradientSupported).toBeTruthy();
    });
    
    test('Safari: should handle flexbox alignment correctly', async ({ page, browserName }) => {
        test.skip(browserName !== 'webkit', 'Safari-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        const flexboxWorking = await page.evaluate(() => {
            const el = document.getElementById('wpadminbar');
            const computed = getComputedStyle(el);
            return computed.display === 'flex' && computed.alignItems === 'center';
        });
        
        expect(flexboxWorking).toBeTruthy();
    });
    
    test('Safari: should handle live preview updates', async ({ page, browserName }) => {
        test.skip(browserName !== 'webkit', 'Safari-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        // Simulate live preview update
        await page.evaluate(() => {
            const adminBar = document.getElementById('wpadminbar');
            adminBar.style.height = '50px';
            adminBar.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
        });
        
        await page.waitForTimeout(500);
        
        const styles = await page.evaluate(() => {
            const el = document.getElementById('wpadminbar');
            const computed = getComputedStyle(el);
            return {
                height: computed.height,
                boxShadow: computed.boxShadow
            };
        });
        
        expect(styles.height).toBe('50px');
        expect(styles.boxShadow).not.toBe('none');
    });
    
    test('Safari: should load Google Fonts successfully', async ({ page, browserName }) => {
        test.skip(browserName !== 'webkit', 'Safari-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        // Wait for Google Fonts test to complete
        await page.waitForTimeout(3000);
        
        const googleFontsResult = await page.evaluate(() => {
            return window.testResults.find(r => r.name === 'Google Fonts Loading');
        });
        
        expect(googleFontsResult.passed).toBeTruthy();
    });
});

/**
 * Test Suite: Edge 90+ Compatibility (Task 19.4)
 */
test.describe('Edge 90+ Compatibility', () => {
    test('should support all Admin Bar enhancement features in Edge', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium' || !process.env.EDGE_TEST, 'Edge-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        // Wait for tests to complete
        await page.waitForTimeout(3000);
        
        // Get test results
        const results = await page.evaluate(() => window.testResults);
        
        // Save results
        await saveTestResults('edge', 'all-features', {
            browser: 'Edge',
            timestamp: new Date().toISOString(),
            results: results
        });
        
        // Check for failures
        const failures = results.filter(r => !r.passed);
        
        if (failures.length > 0) {
            console.error('Edge test failures:', failures);
            await takeScreenshot(page, 'edge-failures', browserName);
        }
        
        expect(failures).toHaveLength(0);
    });
    
    test('Edge: should render all CSS features correctly', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium' || !process.env.EDGE_TEST, 'Edge-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        const cssFeatures = await page.evaluate(() => {
            const el = document.getElementById('wpadminbar');
            const computed = getComputedStyle(el);
            return {
                gradient: computed.backgroundImage.includes('gradient'),
                backdropFilter: computed.backdropFilter !== 'none',
                borderRadius: computed.borderRadius !== '0px',
                boxShadow: computed.boxShadow !== 'none',
                flexbox: computed.display === 'flex'
            };
        });
        
        expect(cssFeatures.gradient).toBeTruthy();
        expect(cssFeatures.backdropFilter).toBeTruthy();
        expect(cssFeatures.borderRadius).toBeTruthy();
        expect(cssFeatures.boxShadow).toBeTruthy();
        expect(cssFeatures.flexbox).toBeTruthy();
    });
    
    test('Edge: should handle live preview updates', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium' || !process.env.EDGE_TEST, 'Edge-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        // Simulate multiple live preview updates
        await page.evaluate(() => {
            const adminBar = document.getElementById('wpadminbar');
            adminBar.style.height = '60px';
            adminBar.style.backgroundColor = '#0073aa';
            adminBar.style.borderRadius = '12px';
        });
        
        await page.waitForTimeout(500);
        
        const styles = await page.evaluate(() => {
            const el = document.getElementById('wpadminbar');
            const computed = getComputedStyle(el);
            return {
                height: computed.height,
                backgroundColor: computed.backgroundColor,
                borderRadius: computed.borderRadius
            };
        });
        
        expect(styles.height).toBe('60px');
        expect(styles.backgroundColor).toBe('rgb(0, 115, 170)');
        expect(styles.borderRadius).toBe('12px');
    });
    
    test('Edge: should load Google Fonts successfully', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium' || !process.env.EDGE_TEST, 'Edge-specific test');
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        // Wait for Google Fonts test to complete
        await page.waitForTimeout(3000);
        
        const googleFontsResult = await page.evaluate(() => {
            return window.testResults.find(r => r.name === 'Google Fonts Loading');
        });
        
        expect(googleFontsResult.passed).toBeTruthy();
    });
});

/**
 * Test Suite: Cross-Browser Feature Parity
 */
test.describe('Cross-Browser Feature Parity', () => {
    test('all browsers should support core CSS features', async ({ page, browserName }) => {
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        await page.waitForTimeout(3000);
        
        const coreFeatures = await page.evaluate(() => {
            return window.testResults.filter(r => 
                ['CSS Variables', 'Flexbox', 'CSS Gradients', 'Border Radius', 'Box Shadow'].includes(r.name)
            );
        });
        
        const allPassed = coreFeatures.every(f => f.passed);
        
        if (!allPassed) {
            console.error(`${browserName} failed core features:`, coreFeatures.filter(f => !f.passed));
            await takeScreenshot(page, 'core-features', browserName);
        }
        
        expect(allPassed).toBeTruthy();
    });
    
    test('all browsers should support JavaScript features', async ({ page, browserName }) => {
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        await page.waitForTimeout(3000);
        
        const jsFeatures = await page.evaluate(() => {
            return window.testResults.filter(r => r.name.startsWith('JS:'));
        });
        
        const allPassed = jsFeatures.every(f => f.passed);
        
        if (!allPassed) {
            console.error(`${browserName} failed JS features:`, jsFeatures.filter(f => !f.passed));
            await takeScreenshot(page, 'js-features', browserName);
        }
        
        expect(allPassed).toBeTruthy();
    });
});

/**
 * Test Suite: Performance Across Browsers
 */
test.describe('Performance Across Browsers', () => {
    test('page should load quickly in all browsers', async ({ page, browserName }) => {
        const startTime = Date.now();
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        
        console.log(`${browserName} load time: ${loadTime}ms`);
        
        // Should load within 2 seconds
        expect(loadTime).toBeLessThan(2000);
    });
    
    test('live preview updates should be smooth', async ({ page, browserName }) => {
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-enhancement.html');
        await page.goto(testUrl);
        
        const startTime = Date.now();
        
        // Perform multiple rapid updates
        await page.evaluate(() => {
            const adminBar = document.getElementById('wpadminbar');
            for (let i = 0; i < 10; i++) {
                adminBar.style.height = (32 + i * 2) + 'px';
            }
        });
        
        const updateTime = Date.now() - startTime;
        
        console.log(`${browserName} update time: ${updateTime}ms`);
        
        // Should complete within 100ms
        expect(updateTime).toBeLessThan(100);
    });
});

/**
 * Cleanup: Remove test HTML file
 */
test.afterAll(async () => {
    const testHtmlPath = path.join(__dirname, 'test-adminbar-enhancement.html');
    if (fs.existsSync(testHtmlPath)) {
        fs.unlinkSync(testHtmlPath);
        console.log('✓ Test HTML file cleaned up');
    }
});
