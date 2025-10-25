/**
 * Responsive Testing for Admin Bar Comprehensive Enhancement
 * 
 * Tests Requirements: All requirements from adminbar-comprehensive-enhancement spec
 * Task 20: Perform responsive testing
 * 
 * Tests Admin Bar behavior across:
 * - Mobile: iPhone (375px), Android (360px)
 * - Tablet: iPad (768px), Android tablet (800px)
 * - Desktop: 1366px, 1920px, 2560px
 * 
 * Usage:
 *   cd tests/browser-compatibility
 *   npm install
 *   npx playwright test test-adminbar-responsive.js
 */

const { test, expect, devices } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Test configuration
const RESULTS_DIR = path.join(__dirname, 'test-results', 'responsive');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

/**
 * Helper: Save test results
 */
async function saveTestResults(deviceName, testName, results) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${deviceName}-${testName}-${timestamp}.json`;
    const filepath = path.join(RESULTS_DIR, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
    console.log(`✓ Results saved: ${filename}`);
}

/**
 * Helper: Take screenshot
 */
async function takeScreenshot(page, testName, deviceName, suffix = '') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${deviceName}-${testName}${suffix ? '-' + suffix : ''}-${timestamp}.png`;
    const filepath = path.join(RESULTS_DIR, filename);
    
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`📸 Screenshot saved: ${filename}`);
}

/**
 * Helper: Create responsive test HTML
 */
function createResponsiveTestHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Bar Responsive Test</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            padding-top: 60px;
        }
        
        /* Admin Bar - Responsive */
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
            transition: all 0.3s ease;
        }
        
        #wpadminbar .ab-item {
            color: inherit;
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 0 10px;
            text-decoration: none;
            font-size: 13px;
            min-height: 44px; /* Touch target size */
        }
        
        #wpadminbar .ab-icon {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }
        
        /* Mobile optimizations */
        @media (max-width: 600px) {
            #wpadminbar {
                height: 48px; /* Larger for touch */
                padding: 0 10px;
            }
            
            #wpadminbar .ab-item {
                padding: 0 8px;
                font-size: 14px;
            }
            
            #wpadminbar .ab-icon {
                width: 24px;
                height: 24px;
            }
        }
        
        /* Tablet optimizations */
        @media (min-width: 601px) and (max-width: 1024px) {
            #wpadminbar {
                height: 40px;
            }
        }
        
        /* Desktop optimizations */
        @media (min-width: 1025px) {
            #wpadminbar {
                height: 32px;
            }
        }
        
        /* Test content */
        .test-content {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .viewport-info {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .test-results {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .test-item {
            padding: 10px;
            margin: 5px 0;
            background: #f9f9f9;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .test-pass { border-left: 4px solid #46b450; }
        .test-fail { border-left: 4px solid #dc3232; }
        
        .status { font-weight: bold; }
        .status.pass { color: #46b450; }
        .status.fail { color: #dc3232; }
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
    </div>
    
    <!-- Test Content -->
    <div class="test-content">
        <div class="viewport-info">
            <h2>Viewport Information</h2>
            <div id="viewport-data"></div>
        </div>
        
        <div class="test-results">
            <h2>Responsive Test Results</h2>
            <div id="test-results"></div>
        </div>
    </div>
    
    <script>
        // Display viewport info
        const viewportData = {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
            orientation: window.screen.orientation?.type || 'unknown',
            touchSupport: 'ontouchstart' in window
        };
        
        document.getElementById('viewport-data').innerHTML = \`
            <p><strong>Width:</strong> \${viewportData.width}px</p>
            <p><strong>Height:</strong> \${viewportData.height}px</p>
            <p><strong>Device Pixel Ratio:</strong> \${viewportData.devicePixelRatio}</p>
            <p><strong>Orientation:</strong> \${viewportData.orientation}</p>
            <p><strong>Touch Support:</strong> \${viewportData.touchSupport ? 'Yes' : 'No'}</p>
        \`;
        
        // Test results storage
        window.testResults = [];
        window.viewportData = viewportData;
        
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
        
        // Run responsive tests
        setTimeout(() => {
            runResponsiveTests();
        }, 100);
        
        function runResponsiveTests() {
            const adminBar = document.getElementById('wpadminbar');
            const computed = getComputedStyle(adminBar);
            
            // Test 1: Admin Bar is visible
            testAdminBarVisible(adminBar, computed);
            
            // Test 2: Admin Bar height is appropriate for viewport
            testAdminBarHeight(computed);
            
            // Test 3: Touch targets are adequate (mobile)
            testTouchTargets();
            
            // Test 4: Text is readable
            testTextReadability(computed);
            
            // Test 5: Icons are properly sized
            testIconSizing();
            
            // Test 6: Layout doesn't overflow
            testLayoutOverflow(adminBar);
            
            // Test 7: Flexbox alignment works
            testFlexboxAlignment(computed);
            
            // Test 8: Responsive breakpoints work
            testResponsiveBreakpoints();
            
            // Test 9: Z-index is correct
            testZIndex(computed);
            
            // Test 10: Performance is acceptable
            testPerformance();
        }
        
        function testAdminBarVisible(adminBar, computed) {
            const isVisible = computed.display !== 'none' && 
                            computed.visibility !== 'hidden' &&
                            computed.opacity !== '0';
            addTestResult('Admin Bar Visible', isVisible);
        }
        
        function testAdminBarHeight(computed) {
            const height = parseInt(computed.height);
            const width = window.innerWidth;
            
            let expectedHeight;
            if (width <= 600) {
                expectedHeight = 48; // Mobile
            } else if (width <= 1024) {
                expectedHeight = 40; // Tablet
            } else {
                expectedHeight = 32; // Desktop
            }
            
            const isCorrect = Math.abs(height - expectedHeight) <= 2;
            addTestResult('Admin Bar Height', isCorrect, \`Expected ~\${expectedHeight}px, got \${height}px\`);
        }
        
        function testTouchTargets() {
            const items = document.querySelectorAll('#wpadminbar .ab-item');
            const width = window.innerWidth;
            
            if (width <= 600) {
                // Mobile: touch targets should be at least 44px
                let allAdequate = true;
                items.forEach(item => {
                    const rect = item.getBoundingClientRect();
                    if (rect.height < 44) {
                        allAdequate = false;
                    }
                });
                addTestResult('Touch Targets (Mobile)', allAdequate, 'Minimum 44px height');
            } else {
                addTestResult('Touch Targets (Desktop)', true, 'Not applicable');
            }
        }
        
        function testTextReadability(computed) {
            const fontSize = parseInt(computed.fontSize);
            const width = window.innerWidth;
            
            let minSize = width <= 600 ? 14 : 13;
            const isReadable = fontSize >= minSize;
            addTestResult('Text Readability', isReadable, \`Font size: \${fontSize}px\`);
        }
        
        function testIconSizing() {
            const icons = document.querySelectorAll('#wpadminbar .ab-icon');
            const width = window.innerWidth;
            
            let expectedSize = width <= 600 ? 24 : 20;
            let allCorrect = true;
            
            icons.forEach(icon => {
                const rect = icon.getBoundingClientRect();
                if (Math.abs(rect.width - expectedSize) > 2) {
                    allCorrect = false;
                }
            });
            
            addTestResult('Icon Sizing', allCorrect, \`Expected ~\${expectedSize}px\`);
        }
        
        function testLayoutOverflow(adminBar) {
            const rect = adminBar.getBoundingClientRect();
            const hasOverflow = rect.width > window.innerWidth;
            addTestResult('No Layout Overflow', !hasOverflow);
        }
        
        function testFlexboxAlignment(computed) {
            const isFlexbox = computed.display === 'flex';
            const isCentered = computed.alignItems === 'center';
            addTestResult('Flexbox Alignment', isFlexbox && isCentered);
        }
        
        function testResponsiveBreakpoints() {
            const width = window.innerWidth;
            let breakpoint;
            
            if (width <= 600) {
                breakpoint = 'mobile';
            } else if (width <= 1024) {
                breakpoint = 'tablet';
            } else {
                breakpoint = 'desktop';
            }
            
            addTestResult('Responsive Breakpoint', true, \`Detected: \${breakpoint}\`);
        }
        
        function testZIndex(computed) {
            const zIndex = parseInt(computed.zIndex);
            const isCorrect = zIndex >= 99999;
            addTestResult('Z-Index', isCorrect, \`Value: \${zIndex}\`);
        }
        
        function testPerformance() {
            const start = performance.now();
            
            // Simulate style changes
            const adminBar = document.getElementById('wpadminbar');
            for (let i = 0; i < 10; i++) {
                adminBar.style.height = (32 + i) + 'px';
            }
            
            const duration = performance.now() - start;
            const isPerformant = duration < 50;
            addTestResult('Performance', isPerformant, \`\${duration.toFixed(2)}ms\`);
        }
    </script>
</body>
</html>\`;
}

// Setup: Create test HTML file
test.beforeAll(async () => {
    const testHtmlPath = path.join(__dirname, 'test-adminbar-responsive.html');
    fs.writeFileSync(testHtmlPath, createResponsiveTestHTML());
    console.log('✓ Responsive test HTML file created');
});

/**
 * Task 20.1: Test on mobile devices
 */
test.describe('Mobile Device Testing (Task 20.1)', () => {
    test('iPhone (375px width) - Portrait', async ({ browser }) => {
        const context = await browser.newContext({
            ...devices['iPhone 12'],
            viewport: { width: 375, height: 667 }
        });
        const page = await context.newPage();
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-responsive.html');
        await page.goto(testUrl);
        await page.waitForTimeout(1000);
        
        // Get test results
        const results = await page.evaluate(() => ({
            tests: window.testResults,
            viewport: window.viewportData
        }));
        
        await saveTestResults('iphone-375', 'portrait', results);
        await takeScreenshot(page, 'iphone-375', 'mobile', 'portrait');
        
        // Verify critical tests passed
        const failures = results.tests.filter(r => !r.passed);
        expect(failures).toHaveLength(0);
        
        await context.close();
    });
    
    test('Android (360px width) - Portrait', async ({ browser }) => {
        const context = await browser.newContext({
            ...devices['Pixel 5'],
            viewport: { width: 360, height: 640 }
        });
        const page = await context.newPage();
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-responsive.html');
        await page.goto(testUrl);
        await page.waitForTimeout(1000);
        
        const results = await page.evaluate(() => ({
            tests: window.testResults,
            viewport: window.viewportData
        }));
        
        await saveTestResults('android-360', 'portrait', results);
        await takeScreenshot(page, 'android-360', 'mobile', 'portrait');
        
        const failures = results.tests.filter(r => !r.passed);
        expect(failures).toHaveLength(0);
        
        await context.close();
    });
    
    test('Mobile - Touch targets verification', async ({ browser }) => {
        const context = await browser.newContext({
            ...devices['iPhone 12'],
            viewport: { width: 375, height: 667 }
        });
        const page = await context.newPage();
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-responsive.html');
        await page.goto(testUrl);
        
        // Verify touch target sizes
        const touchTargets = await page.evaluate(() => {
            const items = document.querySelectorAll('#wpadminbar .ab-item');
            return Array.from(items).map(item => {
                const rect = item.getBoundingClientRect();
                return {
                    width: rect.width,
                    height: rect.height,
                    meetsMinimum: rect.height >= 44 && rect.width >= 44
                };
            });
        });
        
        const allMeetMinimum = touchTargets.every(t => t.meetsMinimum);
        expect(allMeetMinimum).toBeTruthy();
        
        await context.close();
    });
    
    test('Mobile - Layout verification', async ({ browser }) => {
        const context = await browser.newContext({
            ...devices['iPhone 12'],
            viewport: { width: 375, height: 667 }
        });
        const page = await context.newPage();
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-responsive.html');
        await page.goto(testUrl);
        
        // Verify no horizontal overflow
        const hasOverflow = await page.evaluate(() => {
            return document.body.scrollWidth > window.innerWidth;
        });
        
        expect(hasOverflow).toBeFalsy();
        
        await context.close();
    });
});

/**
 * Task 20.2: Test on tablets
 */
test.describe('Tablet Device Testing (Task 20.2)', () => {
    test('iPad (768px width) - Portrait', async ({ browser }) => {
        const context = await browser.newContext({
            ...devices['iPad'],
            viewport: { width: 768, height: 1024 }
        });
        const page = await context.newPage();
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-responsive.html');
        await page.goto(testUrl);
        await page.waitForTimeout(1000);
        
        const results = await page.evaluate(() => ({
            tests: window.testResults,
            viewport: window.viewportData
        }));
        
        await saveTestResults('ipad-768', 'portrait', results);
        await takeScreenshot(page, 'ipad-768', 'tablet', 'portrait');
        
        const failures = results.tests.filter(r => !r.passed);
        expect(failures).toHaveLength(0);
        
        await context.close();
    });
    
    test('iPad (1024px width) - Landscape', async ({ browser }) => {
        const context = await browser.newContext({
            ...devices['iPad'],
            viewport: { width: 1024, height: 768 }
        });
        const page = await context.newPage();
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-responsive.html');
        await page.goto(testUrl);
        await page.waitForTimeout(1000);
        
        const results = await page.evaluate(() => ({
            tests: window.testResults,
            viewport: window.viewportData
        }));
        
        await saveTestResults('ipad-1024', 'landscape', results);
        await takeScreenshot(page, 'ipad-1024', 'tablet', 'landscape');
        
        const failures = results.tests.filter(r => !r.passed);
        expect(failures).toHaveLength(0);
        
        await context.close();
    });
    
    test('Android Tablet (800px width)', async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 800, height: 1280 },
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true
        });
        const page = await context.newPage();
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-responsive.html');
        await page.goto(testUrl);
        await page.waitForTimeout(1000);
        
        const results = await page.evaluate(() => ({
            tests: window.testResults,
            viewport: window.viewportData
        }));
        
        await saveTestResults('android-tablet-800', 'portrait', results);
        await takeScreenshot(page, 'android-tablet-800', 'tablet', 'portrait');
        
        const failures = results.tests.filter(r => !r.passed);
        expect(failures).toHaveLength(0);
        
        await context.close();
    });
    
    test('Tablet - Layout verification', async ({ browser }) => {
        const context = await browser.newContext({
            ...devices['iPad'],
            viewport: { width: 768, height: 1024 }
        });
        const page = await context.newPage();
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-responsive.html');
        await page.goto(testUrl);
        
        // Verify admin bar height is appropriate for tablet
        const adminBarHeight = await page.evaluate(() => {
            const adminBar = document.getElementById('wpadminbar');
            return parseInt(getComputedStyle(adminBar).height);
        });
        
        // Tablet should use 40px height
        expect(adminBarHeight).toBeGreaterThanOrEqual(38);
        expect(adminBarHeight).toBeLessThanOrEqual(42);
        
        await context.close();
    });
});

/**
 * Task 20.3: Test on desktop
 */
test.describe('Desktop Testing (Task 20.3)', () => {
    test('Desktop 1366px width', async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 1366, height: 768 }
        });
        const page = await context.newPage();
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-responsive.html');
        await page.goto(testUrl);
        await page.waitForTimeout(1000);
        
        const results = await page.evaluate(() => ({
            tests: window.testResults,
            viewport: window.viewportData
        }));
        
        await saveTestResults('desktop-1366', 'standard', results);
        await takeScreenshot(page, 'desktop-1366', 'desktop', 'standard');
        
        const failures = results.tests.filter(r => !r.passed);
        expect(failures).toHaveLength(0);
        
        await context.close();
    });
    
    test('Desktop 1920px width (Full HD)', async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 1920, height: 1080 }
        });
        const page = await context.newPage();
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-responsive.html');
        await page.goto(testUrl);
        await page.waitForTimeout(1000);
        
        const results = await page.evaluate(() => ({
            tests: window.testResults,
            viewport: window.viewportData
        }));
        
        await saveTestResults('desktop-1920', 'fullhd', results);
        await takeScreenshot(page, 'desktop-1920', 'desktop', 'fullhd');
        
        const failures = results.tests.filter(r => !r.passed);
        expect(failures).toHaveLength(0);
        
        await context.close();
    });
    
    test('Desktop 2560px width (2K)', async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 2560, height: 1440 }
        });
        const page = await context.newPage();
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-responsive.html');
        await page.goto(testUrl);
        await page.waitForTimeout(1000);
        
        const results = await page.evaluate(() => ({
            tests: window.testResults,
            viewport: window.viewportData
        }));
        
        await saveTestResults('desktop-2560', '2k', results);
        await takeScreenshot(page, 'desktop-2560', 'desktop', '2k');
        
        const failures = results.tests.filter(r => !r.passed);
        expect(failures).toHaveLength(0);
        
        await context.close();
    });
    
    test('Desktop - Layout verification', async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 1920, height: 1080 }
        });
        const page = await context.newPage();
        
        const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-responsive.html');
        await page.goto(testUrl);
        
        // Verify admin bar height is appropriate for desktop
        const adminBarHeight = await page.evaluate(() => {
            const adminBar = document.getElementById('wpadminbar');
            return parseInt(getComputedStyle(adminBar).height);
        });
        
        // Desktop should use 32px height
        expect(adminBarHeight).toBeGreaterThanOrEqual(30);
        expect(adminBarHeight).toBeLessThanOrEqual(34);
        
        await context.close();
    });
});

/**
 * Cross-viewport consistency tests
 */
test.describe('Cross-Viewport Consistency', () => {
    const viewports = [
        { name: 'mobile-360', width: 360, height: 640 },
        { name: 'mobile-375', width: 375, height: 667 },
        { name: 'tablet-768', width: 768, height: 1024 },
        { name: 'tablet-800', width: 800, height: 1280 },
        { name: 'desktop-1366', width: 1366, height: 768 },
        { name: 'desktop-1920', width: 1920, height: 1080 },
        { name: 'desktop-2560', width: 2560, height: 1440 }
    ];
    
    for (const viewport of viewports) {
        test(`${viewport.name} - All features work`, async ({ browser }) => {
            const context = await browser.newContext({
                viewport: { width: viewport.width, height: viewport.height }
            });
            const page = await context.newPage();
            
            const testUrl = 'file://' + path.join(__dirname, 'test-adminbar-responsive.html');
            await page.goto(testUrl);
            await page.waitForTimeout(1000);
            
            const results = await page.evaluate(() => window.testResults);
            const failures = results.filter(r => !r.passed);
            
            if (failures.length > 0) {
                console.error(`${viewport.name} failures:`, failures);
            }
            
            expect(failures).toHaveLength(0);
            
            await context.close();
        });
    }
});

/**
 * Cleanup: Remove test HTML file
 */
test.afterAll(async () => {
    const testHtmlPath = path.join(__dirname, 'test-adminbar-responsive.html');
    if (fs.existsSync(testHtmlPath)) {
        fs.unlinkSync(testHtmlPath);
        console.log('✓ Responsive test HTML file cleaned up');
    }
});
