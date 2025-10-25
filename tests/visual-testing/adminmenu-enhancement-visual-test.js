/**
 * Visual Tests for Admin Menu Enhancements
 * 
 * Tests menu item spacing, submenu positioning, Height Mode, and logo display
 * Requirements: 1.1, 3.1, 4.1, 16.5
 * 
 * @package ModernAdminStyler
 */

const { chromium } = require('playwright');
const path = require('path');

async function runVisualTests() {
    console.log('=== Admin Menu Enhancement Visual Tests ===\n');
    
    const browser = await chromium.launch({ headless: false });
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
        
        // Test 1: Menu Item Spacing (Requirement 1.1)
        console.log('Test 1: Menu Item Spacing...');
        const spacingResult = await testMenuItemSpacing(page);
        testResults.push(spacingResult);
        
        // Test 2: Submenu Positioning at Different Widths (Requirement 3.1)
        console.log('Test 2: Submenu Positioning...');
        const submenuResult = await testSubmenuPositioning(page);
        testResults.push(submenuResult);
        
        // Test 3: Height Mode Visual Changes (Requirement 4.1)
        console.log('Test 3: Height Mode...');
        const heightModeResult = await testHeightMode(page);
        testResults.push(heightModeResult);
        
        // Test 4: Logo Display and Positioning (Requirement 16.5)
        console.log('Test 4: Logo Display...');
        const logoResult = await testLogoDisplay(page);
        testResults.push(logoResult);
        
        // Print summary
        printSummary(testResults);
        
    } catch (error) {
        console.error('Test execution error:', error);
    } finally {
        await browser.close();
    }
}

/**
 * Test menu item spacing at different padding values
 */
async function testMenuItemSpacing(page) {
    const results = [];
    
    // Test default padding
    let menuItem = await page.locator('#adminmenu li.menu-top > a').first();
    let padding = await menuItem.evaluate(el => window.getComputedStyle(el).padding);
    results.push({
        name: 'Default padding',
        passed: padding.includes('10px') && padding.includes('15px'),
        message: `Padding: ${padding}`
    });
    
    // Test custom padding (12px vertical, 18px horizontal)
    await page.locator('#padding-vertical').fill('12');
    await page.locator('#padding-horizontal').fill('18');
    await page.waitForTimeout(500);
    
    padding = await menuItem.evaluate(el => window.getComputedStyle(el).padding);
    results.push({
        name: 'Custom padding (12px, 18px)',
        passed: padding.includes('12px') && padding.includes('18px'),
        message: `Padding: ${padding}`
    });
    
    // Test compact padding (5px vertical, 10px horizontal)
    await page.locator('#padding-vertical').fill('5');
    await page.locator('#padding-horizontal').fill('10');
    await page.waitForTimeout(500);
    
    padding = await menuItem.evaluate(el => window.getComputedStyle(el).padding);
    results.push({
        name: 'Compact padding (5px, 10px)',
        passed: padding.includes('5px') && padding.includes('10px'),
        message: `Padding: ${padding}`
    });
    
    // Screenshot
    await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/adminmenu-spacing-test.png'),
        fullPage: true 
    });
    
    return {
        category: 'Menu Item Spacing',
        tests: results
    };
}

/**
 * Test submenu positioning at different menu widths
 */
async function testSubmenuPositioning(page) {
    const results = [];
    const widths = [160, 200, 250, 300];
    
    for (const width of widths) {
        await page.locator('#menu-width').fill(width.toString());
        await page.waitForTimeout(500);
        
        const submenu = await page.locator('#adminmenu .wp-submenu').first();
        const left = await submenu.evaluate(el => window.getComputedStyle(el).left);
        
        results.push({
            name: `Submenu position at ${width}px width`,
            passed: left === `${width}px`,
            message: `Expected: ${width}px, Got: ${left}`
        });
        
        // Screenshot for each width
        await page.screenshot({ 
            path: path.join(__dirname, `screenshots/adminmenu-submenu-${width}px.png`),
            fullPage: true 
        });
    }
    
    // Test submenu spacing offset
    await page.locator('#menu-width').fill('200');
    await page.locator('#submenu-spacing').fill('10');
    await page.waitForTimeout(500);
    
    const submenu = await page.locator('#adminmenu .wp-submenu').first();
    const top = await submenu.evaluate(el => window.getComputedStyle(el).top);
    
    results.push({
        name: 'Submenu spacing offset',
        passed: top === '10px',
        message: `Expected: 10px, Got: ${top}`
    });
    
    return {
        category: 'Submenu Positioning',
        tests: results
    };
}

/**
 * Test Height Mode visual changes
 */
async function testHeightMode(page) {
    const results = [];
    const menu = await page.locator('#adminmenu');
    
    // Test full height mode
    await page.locator('#height-mode').selectOption('full');
    await page.waitForTimeout(500);
    
    let height = await menu.evaluate(el => window.getComputedStyle(el).height);
    results.push({
        name: 'Full height mode',
        passed: height !== 'auto',
        message: `Height: ${height}`
    });
    
    await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/adminmenu-height-full.png'),
        fullPage: true 
    });
    
    // Test content height mode
    await page.locator('#height-mode').selectOption('content');
    await page.waitForTimeout(500);
    
    height = await menu.evaluate(el => window.getComputedStyle(el).height);
    const minHeight = await menu.evaluate(el => window.getComputedStyle(el).minHeight);
    
    results.push({
        name: 'Content height mode',
        passed: height === 'auto' || minHeight !== '0px',
        message: `Height: ${height}, Min-height: ${minHeight}`
    });
    
    await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/adminmenu-height-content.png'),
        fullPage: true 
    });
    
    return {
        category: 'Height Mode',
        tests: results
    };
}

/**
 * Test logo display and positioning
 */
async function testLogoDisplay(page) {
    const results = [];
    const logo = await page.locator('.mase-menu-logo');
    
    // Test logo visibility (should be hidden by default)
    let isVisible = await logo.isVisible();
    results.push({
        name: 'Logo hidden by default',
        passed: !isVisible,
        message: `Logo visible: ${isVisible}`
    });
    
    // Show logo
    await logo.evaluate(el => el.style.display = 'block');
    await page.waitForTimeout(500);
    
    isVisible = await logo.isVisible();
    results.push({
        name: 'Logo can be shown',
        passed: isVisible,
        message: `Logo visible: ${isVisible}`
    });
    
    await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/adminmenu-logo-visible.png'),
        fullPage: true 
    });
    
    // Test logo alignment
    const textAlign = await logo.evaluate(el => window.getComputedStyle(el).textAlign);
    results.push({
        name: 'Logo alignment',
        passed: textAlign === 'center',
        message: `Text align: ${textAlign}`
    });
    
    return {
        category: 'Logo Display',
        tests: results
    };
}

/**
 * Print test summary
 */
function printSummary(testResults) {
    console.log('\n=== Test Summary ===\n');
    
    let totalTests = 0;
    let totalPassed = 0;
    
    testResults.forEach(category => {
        console.log(`\n${category.category}:`);
        category.tests.forEach(test => {
            totalTests++;
            if (test.passed) totalPassed++;
            
            const status = test.passed ? '✓ PASS' : '✗ FAIL';
            console.log(`  ${status}: ${test.name} - ${test.message}`);
        });
    });
    
    const totalFailed = totalTests - totalPassed;
    const successRate = ((totalPassed / totalTests) * 100).toFixed(2);
    
    console.log(`\nTotal: ${totalTests}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalFailed}`);
    console.log(`Success Rate: ${successRate}%`);
}

// Run tests
runVisualTests().catch(console.error);
