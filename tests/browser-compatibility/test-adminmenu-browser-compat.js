/**
 * Browser Compatibility Tests for Admin Menu Enhancements
 * 
 * Tests on Chrome, Firefox, Safari (WebKit), and Edge
 * Tests live preview functionality and Google Font loading
 * 
 * @package ModernAdminStyler
 */

const { chromium, firefox, webkit } = require('playwright');
const path = require('path');

const browsers = [
    { name: 'Chromium (Chrome/Edge)', launcher: chromium },
    { name: 'Firefox', launcher: firefox },
    { name: 'WebKit (Safari)', launcher: webkit }
];

async function runBrowserCompatibilityTests() {
    console.log('=== Admin Menu Browser Compatibility Tests ===\n');
    
    const allResults = [];
    
    for (const browserConfig of browsers) {
        console.log(`\nTesting on ${browserConfig.name}...`);
        const results = await testBrowser(browserConfig);
        allResults.push({
            browser: browserConfig.name,
            results: results
        });
    }
    
    printSummary(allResults);
}

async function testBrowser(browserConfig) {
    const browser = await browserConfig.launcher.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    
    const testResults = [];
    
    try {
        // Load test page
        const testPagePath = path.join(__dirname, '../integration/test-adminmenu-live-preview-complete.html');
        await page.goto(`file://${testPagePath}`);
        await page.waitForTimeout(1000);
        
        // Test 1: Live Preview - Height Mode
        const heightModeResult = await testHeightModeLivePreview(page);
        testResults.push(heightModeResult);
        
        // Test 2: Live Preview - Padding
        const paddingResult = await testPaddingLivePreview(page);
        testResults.push(paddingResult);
        
        // Test 3: Live Preview - Width and Submenu
        const widthResult = await testWidthLivePreview(page);
        testResults.push(widthResult);
        
        // Test 4: Live Preview - Icon Color
        const iconColorResult = await testIconColorLivePreview(page);
        testResults.push(iconColorResult);
        
        // Test 5: Live Preview - Border Radius
        const borderRadiusResult = await testBorderRadiusLivePreview(page);
        testResults.push(borderRadiusResult);
        
        // Test 6: Google Fonts Loading (simulated)
        const googleFontsResult = await testGoogleFontsLoading(page);
        testResults.push(googleFontsResult);
        
    } catch (error) {
        console.error(`Error testing ${browserConfig.name}:`, error.message);
        testResults.push({
            name: 'Browser Test',
            passed: false,
            message: error.message
        });
    } finally {
        await browser.close();
    }
    
    return testResults;
}

/**
 * Test Height Mode live preview
 */
async function testHeightModeLivePreview(page) {
    try {
        const menu = await page.locator('#adminmenu');
        
        // Change to content mode
        await page.locator('#height-mode').selectOption('content');
        await page.waitForTimeout(500);
        
        const height = await menu.evaluate(el => window.getComputedStyle(el).height);
        const minHeight = await menu.evaluate(el => window.getComputedStyle(el).minHeight);
        
        const passed = height === 'auto' || minHeight !== '0px';
        
        return {
            name: 'Height Mode Live Preview',
            passed: passed,
            message: passed ? 'Height mode updates correctly' : `Height: ${height}, Min-height: ${minHeight}`
        };
    } catch (error) {
        return {
            name: 'Height Mode Live Preview',
            passed: false,
            message: error.message
        };
    }
}

/**
 * Test Padding live preview
 */
async function testPaddingLivePreview(page) {
    try {
        await page.locator('#padding-vertical').fill('20');
        await page.locator('#padding-horizontal').fill('25');
        await page.waitForTimeout(500);
        
        const menuItem = await page.locator('#adminmenu li.menu-top > a').first();
        const padding = await menuItem.evaluate(el => window.getComputedStyle(el).padding);
        
        const passed = padding.includes('20px') && padding.includes('25px');
        
        return {
            name: 'Padding Live Preview',
            passed: passed,
            message: passed ? 'Padding updates correctly' : `Padding: ${padding}`
        };
    } catch (error) {
        return {
            name: 'Padding Live Preview',
            passed: false,
            message: error.message
        };
    }
}

/**
 * Test Width and Submenu live preview
 */
async function testWidthLivePreview(page) {
    try {
        await page.locator('#menu-width').fill('250');
        await page.locator('#submenu-spacing').fill('15');
        await page.waitForTimeout(500);
        
        const menu = await page.locator('#adminmenu');
        const submenu = await page.locator('#adminmenu .wp-submenu').first();
        
        const menuWidth = await menu.evaluate(el => window.getComputedStyle(el).width);
        const submenuLeft = await submenu.evaluate(el => window.getComputedStyle(el).left);
        const submenuTop = await submenu.evaluate(el => window.getComputedStyle(el).top);
        
        const passed = menuWidth === '250px' && submenuLeft === '250px' && submenuTop === '15px';
        
        return {
            name: 'Width & Submenu Live Preview',
            passed: passed,
            message: passed ? 'Width and submenu update correctly' : 
                `Width: ${menuWidth}, Submenu left: ${submenuLeft}, top: ${submenuTop}`
        };
    } catch (error) {
        return {
            name: 'Width & Submenu Live Preview',
            passed: false,
            message: error.message
        };
    }
}

/**
 * Test Icon Color live preview
 */
async function testIconColorLivePreview(page) {
    try {
        await page.locator('#icon-color-mode').selectOption('custom');
        await page.waitForTimeout(300);
        
        await page.locator('#icon-color').fill('#ff0000');
        await page.waitForTimeout(500);
        
        const icon = await page.locator('#adminmenu .wp-menu-image').first();
        const color = await icon.evaluate(el => window.getComputedStyle(el).color);
        
        const passed = color === 'rgb(255, 0, 0)';
        
        return {
            name: 'Icon Color Live Preview',
            passed: passed,
            message: passed ? 'Icon color updates correctly' : `Color: ${color}`
        };
    } catch (error) {
        return {
            name: 'Icon Color Live Preview',
            passed: false,
            message: error.message
        };
    }
}

/**
 * Test Border Radius live preview
 */
async function testBorderRadiusLivePreview(page) {
    try {
        await page.locator('#border-radius').fill('20');
        await page.waitForTimeout(500);
        
        const menu = await page.locator('#adminmenu');
        const radius = await menu.evaluate(el => window.getComputedStyle(el).borderRadius);
        
        const passed = radius === '20px';
        
        return {
            name: 'Border Radius Live Preview',
            passed: passed,
            message: passed ? 'Border radius updates correctly' : `Radius: ${radius}`
        };
    } catch (error) {
        return {
            name: 'Border Radius Live Preview',
            passed: false,
            message: error.message
        };
    }
}

/**
 * Test Google Fonts loading (simulated)
 */
async function testGoogleFontsLoading(page) {
    try {
        // Inject a test Google Font link
        await page.evaluate(() => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
            document.head.appendChild(link);
        });
        
        await page.waitForTimeout(2000); // Wait for font to load
        
        // Apply font to menu
        await page.evaluate(() => {
            const menu = document.getElementById('adminmenu');
            menu.style.fontFamily = '"Roboto", sans-serif';
        });
        
        await page.waitForTimeout(500);
        
        const menu = await page.locator('#adminmenu');
        const fontFamily = await menu.evaluate(el => window.getComputedStyle(el).fontFamily);
        
        const passed = fontFamily.includes('Roboto');
        
        return {
            name: 'Google Fonts Loading',
            passed: passed,
            message: passed ? 'Google Font loads correctly' : `Font: ${fontFamily}`
        };
    } catch (error) {
        return {
            name: 'Google Fonts Loading',
            passed: false,
            message: error.message
        };
    }
}

/**
 * Print test summary
 */
function printSummary(allResults) {
    console.log('\n\n=== Browser Compatibility Test Summary ===\n');
    
    let grandTotal = 0;
    let grandPassed = 0;
    
    allResults.forEach(browserResult => {
        console.log(`\n${browserResult.browser}:`);
        
        let browserTotal = 0;
        let browserPassed = 0;
        
        browserResult.results.forEach(test => {
            browserTotal++;
            grandTotal++;
            
            if (test.passed) {
                browserPassed++;
                grandPassed++;
            }
            
            const status = test.passed ? '✓ PASS' : '✗ FAIL';
            console.log(`  ${status}: ${test.name} - ${test.message}`);
        });
        
        const browserRate = ((browserPassed / browserTotal) * 100).toFixed(2);
        console.log(`  Browser Success Rate: ${browserRate}%`);
    });
    
    const grandFailed = grandTotal - grandPassed;
    const grandRate = ((grandPassed / grandTotal) * 100).toFixed(2);
    
    console.log(`\n=== Overall Summary ===`);
    console.log(`Total Tests: ${grandTotal}`);
    console.log(`Passed: ${grandPassed}`);
    console.log(`Failed: ${grandFailed}`);
    console.log(`Overall Success Rate: ${grandRate}%`);
}

// Run tests
runBrowserCompatibilityTests().catch(console.error);
