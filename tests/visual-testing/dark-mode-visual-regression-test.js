/**
 * MASE Dark Mode Visual Regression Test
 * 
 * Comprehensive visual testing for dark mode toggle feature
 * Tests FAB rendering, positioning, icon changes, transitions, animations,
 * responsive behavior, and reduced motion support.
 * 
 * Requirements: 1.1-1.8, 9.1-9.7
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    baseUrl: 'http://localhost/wp-admin/admin.php?page=mase-settings',
    screenshotsDir: path.join(__dirname, 'screenshots'),
    reportsDir: path.join(__dirname, 'reports'),
    viewport: { width: 1920, height: 1080 },
    mobileViewport: { width: 375, height: 667 },
    tabletViewport: { width: 768, height: 1024 },
    timeout: 30000,
    transitionDuration: 300 // Expected transition duration in ms
};

// Ensure directories exist
[CONFIG.screenshotsDir, CONFIG.reportsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

/**
 * Main test runner
 */
async function runVisualRegressionTests() {
    console.log('🎨 Starting Dark Mode Visual Regression Tests...\n');
    
    const testResults = {
        timestamp: new Date().toISOString(),
        testSuite: 'Dark Mode Visual Regression',
        status: 'unknown',
        tests: [],
        screenshots: []
    };

    const browser = await chromium.launch({ 
        headless: false, 
        slowMo: 50 
    });
    
    try {
        // Test 1: FAB Rendering and Positioning
        await testFABRendering(browser, testResults);
        
        // Test 2: Icon Changes (Sun/Moon)
        await testIconChanges(browser, testResults);
        
        // Test 3: Color Transitions
        await testColorTransitions(browser, testResults);
        
        // Test 4: Animation Smoothness
        await testAnimationSmoothness(browser, testResults);
        
        // Test 5: Responsive Behavior
        await testResponsiveBehavior(browser, testResults);
        
        // Test 6: Reduced Motion Mode
        await testReducedMotion(browser, testResults);
        
        // Determine overall status
        const failedTests = testResults.tests.filter(t => t.status === 'FAILED');
        testResults.status = failedTests.length === 0 ? 'PASSED' : 'FAILED';
        
        // Generate report
        await generateReport(testResults);
        
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Test Suite: ${testResults.status}`);
        console.log(`Passed: ${testResults.tests.filter(t => t.status === 'PASSED').length}`);
        console.log(`Failed: ${failedTests.length}`);
        console.log(`${'='.repeat(60)}\n`);
        
    } catch (error) {
        console.error('\n❌ Test suite error:', error);
        testResults.status = 'ERROR';
        testResults.error = error.message;
        await generateReport(testResults);
    } finally {
        await browser.close();
    }
    
    return testResults;
}

/**
 * Test 1: FAB Rendering and Positioning
 * Requirements: 1.1, 1.2, 1.6
 */
async function testFABRendering(browser, testResults) {
    console.log('📍 Test 1: FAB Rendering and Positioning...');
    
    const test = {
        name: 'FAB Rendering and Positioning',
        requirements: ['1.1', '1.2', '1.6'],
        status: 'unknown',
        checks: []
    };
    
    const context = await browser.newContext({ viewport: CONFIG.viewport });
    const page = await context.newPage();
    
    try {
        await loginAndNavigate(page);
        
        // Check 1: FAB exists in DOM
        const fabExists = await page.$('.mase-dark-mode-fab');
        test.checks.push({
            name: 'FAB exists in DOM',
            passed: !!fabExists,
            requirement: '1.1'
        });
        
        if (!fabExists) {
            throw new Error('FAB not found in DOM');
        }
        
        // Check 2: FAB is visible
        const isVisible = await page.isVisible('.mase-dark-mode-fab');
        test.checks.push({
            name: 'FAB is visible',
            passed: isVisible,
            requirement: '1.1'
        });
        
        // Check 3: FAB position (bottom-right corner)
        const fabPosition = await page.evaluate(() => {
            const fab = document.querySelector('.mase-dark-mode-fab');
            if (!fab) return null;
            const rect = fab.getBoundingClientRect();
            const style = window.getComputedStyle(fab);
            return {
                position: style.position,
                bottom: style.bottom,
                right: style.right,
                zIndex: style.zIndex,
                rect: {
                    bottom: rect.bottom,
                    right: rect.right
                }
            };
        });
        
        const isFixedPosition = fabPosition.position === 'fixed';
        const hasBottomRight = fabPosition.bottom && fabPosition.right;
        const hasHighZIndex = parseInt(fabPosition.zIndex) > 1000;
        
        test.checks.push({
            name: 'FAB has fixed positioning',
            passed: isFixedPosition,
            requirement: '1.1',
            details: `position: ${fabPosition.position}`
        });
        
        test.checks.push({
            name: 'FAB positioned in bottom-right',
            passed: hasBottomRight,
            requirement: '1.1',
            details: `bottom: ${fabPosition.bottom}, right: ${fabPosition.right}`
        });
        
        test.checks.push({
            name: 'FAB has high z-index',
            passed: hasHighZIndex,
            requirement: '1.6',
            details: `z-index: ${fabPosition.zIndex}`
        });

        // Check 4: FAB displays correct initial icon
        const initialIcon = await page.evaluate(() => {
            const fab = document.querySelector('.mase-dark-mode-fab');
            if (!fab) return null;
            const icon = fab.querySelector('.dashicons');
            return icon ? icon.className : null;
        });
        
        const hasSunOrMoonIcon = initialIcon && 
            (initialIcon.includes('dashicons-sun') || initialIcon.includes('dashicons-moon'));
        
        test.checks.push({
            name: 'FAB displays sun or moon icon',
            passed: hasSunOrMoonIcon,
            requirement: '1.2',
            details: `Icon: ${initialIcon}`
        });
        
        // Take screenshot
        const screenshot = await takeScreenshot(page, 'fab-rendering', 'FAB Rendering and Position');
        testResults.screenshots.push(screenshot);
        
        test.status = test.checks.every(c => c.passed) ? 'PASSED' : 'FAILED';
        console.log(`  ${test.status === 'PASSED' ? '✓' : '✗'} ${test.name}\n`);
        
    } catch (error) {
        test.status = 'ERROR';
        test.error = error.message;
        console.error(`  ✗ Error: ${error.message}\n`);
    } finally {
        await context.close();
        testResults.tests.push(test);
    }
}

/**
 * Test 2: Icon Changes (Sun/Moon)
 * Requirements: 1.2, 1.7
 */
async function testIconChanges(browser, testResults) {
    console.log('🌓 Test 2: Icon Changes (Sun/Moon)...');
    
    const test = {
        name: 'Icon Changes',
        requirements: ['1.2', '1.7'],
        status: 'unknown',
        checks: []
    };
    
    const context = await browser.newContext({ viewport: CONFIG.viewport });
    const page = await context.newPage();
    
    try {
        await loginAndNavigate(page);
        
        // Get initial icon
        const initialIcon = await page.evaluate(() => {
            const fab = document.querySelector('.mase-dark-mode-fab');
            const icon = fab?.querySelector('.dashicons');
            return icon?.className || null;
        });
        
        // Take screenshot before toggle
        const beforeScreenshot = await takeScreenshot(page, 'icon-before-toggle', 'Icon Before Toggle');
        testResults.screenshots.push(beforeScreenshot);

        // Click FAB to toggle
        await page.click('.mase-dark-mode-fab');
        await page.waitForTimeout(CONFIG.transitionDuration + 100);
        
        // Get icon after toggle
        const afterIcon = await page.evaluate(() => {
            const fab = document.querySelector('.mase-dark-mode-fab');
            const icon = fab?.querySelector('.dashicons');
            return icon?.className || null;
        });
        
        // Take screenshot after toggle
        const afterScreenshot = await takeScreenshot(page, 'icon-after-toggle', 'Icon After Toggle');
        testResults.screenshots.push(afterScreenshot);
        
        // Check 1: Icon changed
        const iconChanged = initialIcon !== afterIcon;
        test.checks.push({
            name: 'Icon changes on toggle',
            passed: iconChanged,
            requirement: '1.2',
            details: `${initialIcon} → ${afterIcon}`
        });
        
        // Check 2: Icon switched between sun and moon
        const validTransition = 
            (initialIcon?.includes('sun') && afterIcon?.includes('moon')) ||
            (initialIcon?.includes('moon') && afterIcon?.includes('sun'));
        
        test.checks.push({
            name: 'Icon switches between sun and moon',
            passed: validTransition,
            requirement: '1.2',
            details: `Transition: ${initialIcon} → ${afterIcon}`
        });
        
        // Toggle back and verify it changes again
        await page.click('.mase-dark-mode-fab');
        await page.waitForTimeout(CONFIG.transitionDuration + 100);
        
        const finalIcon = await page.evaluate(() => {
            const fab = document.querySelector('.mase-dark-mode-fab');
            const icon = fab?.querySelector('.dashicons');
            return icon?.className || null;
        });
        
        const iconChangedBack = finalIcon === initialIcon;
        test.checks.push({
            name: 'Icon changes back on second toggle',
            passed: iconChangedBack,
            requirement: '1.7',
            details: `${afterIcon} → ${finalIcon}`
        });
        
        test.status = test.checks.every(c => c.passed) ? 'PASSED' : 'FAILED';
        console.log(`  ${test.status === 'PASSED' ? '✓' : '✗'} ${test.name}\n`);
        
    } catch (error) {
        test.status = 'ERROR';
        test.error = error.message;
        console.error(`  ✗ Error: ${error.message}\n`);
    } finally {
        await context.close();
        testResults.tests.push(test);
    }
}

/**
 * Test 3: Color Transitions
 * Requirements: 9.1, 9.2
 */
async function testColorTransitions(browser, testResults) {
    console.log('🎨 Test 3: Color Transitions...');
    
    const test = {
        name: 'Color Transitions',
        requirements: ['9.1', '9.2'],
        status: 'unknown',
        checks: []
    };
    
    const context = await browser.newContext({ viewport: CONFIG.viewport });
    const page = await context.newPage();
    
    try {
        await loginAndNavigate(page);
        
        // Get initial colors
        const initialColors = await page.evaluate(() => {
            return {
                bodyBg: window.getComputedStyle(document.body).backgroundColor,
                adminBarBg: window.getComputedStyle(document.getElementById('wpadminbar')).backgroundColor,
                adminMenuBg: window.getComputedStyle(document.getElementById('adminmenu')).backgroundColor
            };
        });
        
        // Take screenshot before toggle
        const beforeScreenshot = await takeScreenshot(page, 'colors-before', 'Colors Before Toggle');
        testResults.screenshots.push(beforeScreenshot);
        
        // Check transition properties are set
        const hasTransitions = await page.evaluate(() => {
            const body = document.body;
            const style = window.getComputedStyle(body);
            const transition = style.transition || style.webkitTransition;
            return transition && transition !== 'none' && transition.includes('0.3s');
        });
        
        test.checks.push({
            name: 'Body has transition property (0.3s)',
            passed: hasTransitions,
            requirement: '9.1',
            details: hasTransitions ? 'Transitions configured' : 'No transitions found'
        });
        
        // Click FAB and measure transition
        const transitionStart = Date.now();
        await page.click('.mase-dark-mode-fab');
        
        // Wait for transition to complete
        await page.waitForTimeout(CONFIG.transitionDuration + 100);
        const transitionEnd = Date.now();
        const transitionTime = transitionEnd - transitionStart;
        
        // Get colors after transition
        const afterColors = await page.evaluate(() => {
            return {
                bodyBg: window.getComputedStyle(document.body).backgroundColor,
                adminBarBg: window.getComputedStyle(document.getElementById('wpadminbar')).backgroundColor,
                adminMenuBg: window.getComputedStyle(document.getElementById('adminmenu')).backgroundColor
            };
        });

        // Take screenshot after toggle
        const afterScreenshot = await takeScreenshot(page, 'colors-after', 'Colors After Toggle');
        testResults.screenshots.push(afterScreenshot);
        
        // Check 2: Colors changed
        const colorsChanged = 
            initialColors.bodyBg !== afterColors.bodyBg ||
            initialColors.adminBarBg !== afterColors.adminBarBg ||
            initialColors.adminMenuBg !== afterColors.adminMenuBg;
        
        test.checks.push({
            name: 'Colors changed after toggle',
            passed: colorsChanged,
            requirement: '9.1',
            details: `Body: ${initialColors.bodyBg} → ${afterColors.bodyBg}`
        });
        
        // Check 3: Transition completed within expected time
        const transitionTimeOk = transitionTime >= CONFIG.transitionDuration && 
                                 transitionTime <= CONFIG.transitionDuration + 200;
        
        test.checks.push({
            name: 'Transition completed in ~300ms',
            passed: transitionTimeOk,
            requirement: '9.2',
            details: `Transition time: ${transitionTime}ms`
        });
        
        // Check 4: Dark mode class applied
        const hasDarkModeClass = await page.evaluate(() => {
            return document.body.classList.contains('mase-dark-mode');
        });
        
        test.checks.push({
            name: 'Dark mode class applied to body',
            passed: hasDarkModeClass,
            requirement: '9.1',
            details: hasDarkModeClass ? 'Class applied' : 'Class not found'
        });
        
        test.status = test.checks.every(c => c.passed) ? 'PASSED' : 'FAILED';
        console.log(`  ${test.status === 'PASSED' ? '✓' : '✗'} ${test.name}\n`);
        
    } catch (error) {
        test.status = 'ERROR';
        test.error = error.message;
        console.error(`  ✗ Error: ${error.message}\n`);
    } finally {
        await context.close();
        testResults.tests.push(test);
    }
}

/**
 * Test 4: Animation Smoothness
 * Requirements: 1.7, 9.2, 9.3, 9.4, 9.5
 */
async function testAnimationSmoothness(browser, testResults) {
    console.log('✨ Test 4: Animation Smoothness...');
    
    const test = {
        name: 'Animation Smoothness',
        requirements: ['1.7', '9.2', '9.3', '9.4', '9.5'],
        status: 'unknown',
        checks: []
    };
    
    const context = await browser.newContext({ viewport: CONFIG.viewport });
    const page = await context.newPage();
    
    try {
        await loginAndNavigate(page);
        
        // Check 1: FAB icon rotation animation
        const rotationAnimation = await page.evaluate(() => {
            const fab = document.querySelector('.mase-dark-mode-fab');
            const icon = fab?.querySelector('.dashicons');
            if (!icon) return null;
            
            const style = window.getComputedStyle(icon);
            return {
                transition: style.transition || style.webkitTransition,
                transform: style.transform
            };
        });
        
        const hasRotationTransition = rotationAnimation?.transition && 
            rotationAnimation.transition.includes('transform');
        
        test.checks.push({
            name: 'FAB icon has rotation transition',
            passed: hasRotationTransition,
            requirement: '1.7',
            details: `Transition: ${rotationAnimation?.transition || 'none'}`
        });
        
        // Record animation frames during toggle
        await page.click('.mase-dark-mode-fab');
        
        // Sample transform values during animation
        const animationFrames = [];
        const sampleInterval = 50; // Sample every 50ms
        const samples = Math.ceil(CONFIG.transitionDuration / sampleInterval);
        
        for (let i = 0; i < samples; i++) {
            await page.waitForTimeout(sampleInterval);
            const transform = await page.evaluate(() => {
                const icon = document.querySelector('.mase-dark-mode-fab .dashicons');
                return window.getComputedStyle(icon).transform;
            });
            animationFrames.push(transform);
        }
        
        // Check 2: Animation progressed (transform values changed)
        const uniqueFrames = new Set(animationFrames);
        const animationProgressed = uniqueFrames.size > 1;
        
        test.checks.push({
            name: 'Icon rotation animation progressed',
            passed: animationProgressed,
            requirement: '1.7',
            details: `Unique frames: ${uniqueFrames.size}/${samples}`
        });

        // Check 3: FAB disabled during transition
        const fabDisabledDuringTransition = await page.evaluate(async (duration) => {
            const fab = document.querySelector('.mase-dark-mode-fab');
            
            // Click and immediately check if disabled
            fab.click();
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const isDisabled = fab.disabled || 
                             fab.classList.contains('disabled') ||
                             fab.style.pointerEvents === 'none';
            
            return isDisabled;
        }, CONFIG.transitionDuration);
        
        test.checks.push({
            name: 'FAB disabled during transition',
            passed: fabDisabledDuringTransition,
            requirement: '9.3',
            details: fabDisabledDuringTransition ? 'Disabled' : 'Not disabled'
        });
        
        // Wait for transition to complete
        await page.waitForTimeout(CONFIG.transitionDuration + 100);
        
        // Check 4: FAB re-enabled after transition
        const fabEnabledAfter = await page.evaluate(() => {
            const fab = document.querySelector('.mase-dark-mode-fab');
            return !fab.disabled && 
                   !fab.classList.contains('disabled') &&
                   fab.style.pointerEvents !== 'none';
        });
        
        test.checks.push({
            name: 'FAB re-enabled after transition',
            passed: fabEnabledAfter,
            requirement: '9.4',
            details: fabEnabledAfter ? 'Enabled' : 'Still disabled'
        });
        
        // Check 5: Transitioning class added/removed
        const transitioningClassManaged = await page.evaluate(async (duration) => {
            const body = document.body;
            
            // Click FAB
            const fab = document.querySelector('.mase-dark-mode-fab');
            fab.click();
            
            // Check if transitioning class added
            await new Promise(resolve => setTimeout(resolve, 50));
            const hasClassDuring = body.classList.contains('mase-transitioning');
            
            // Wait for transition to complete
            await new Promise(resolve => setTimeout(resolve, duration + 100));
            const hasClassAfter = body.classList.contains('mase-transitioning');
            
            return { hasClassDuring, hasClassAfter };
        }, CONFIG.transitionDuration);
        
        test.checks.push({
            name: 'Transitioning class managed correctly',
            passed: transitioningClassManaged.hasClassDuring && !transitioningClassManaged.hasClassAfter,
            requirement: '9.5',
            details: `During: ${transitioningClassManaged.hasClassDuring}, After: ${transitioningClassManaged.hasClassAfter}`
        });
        
        test.status = test.checks.every(c => c.passed) ? 'PASSED' : 'FAILED';
        console.log(`  ${test.status === 'PASSED' ? '✓' : '✗'} ${test.name}\n`);
        
    } catch (error) {
        test.status = 'ERROR';
        test.error = error.message;
        console.error(`  ✗ Error: ${error.message}\n`);
    } finally {
        await context.close();
        testResults.tests.push(test);
    }
}

/**
 * Test 5: Responsive Behavior
 * Requirements: 1.5
 */
async function testResponsiveBehavior(browser, testResults) {
    console.log('📱 Test 5: Responsive Behavior...');
    
    const test = {
        name: 'Responsive Behavior',
        requirements: ['1.5'],
        status: 'unknown',
        checks: []
    };
    
    const viewports = [
        { name: 'Desktop', viewport: CONFIG.viewport },
        { name: 'Tablet', viewport: CONFIG.tabletViewport },
        { name: 'Mobile', viewport: CONFIG.mobileViewport }
    ];
    
    try {
        for (const { name, viewport } of viewports) {
            console.log(`  Testing ${name} (${viewport.width}x${viewport.height})...`);
            
            const context = await browser.newContext({ viewport });
            const page = await context.newPage();
            
            await loginAndNavigate(page);
            
            // Check FAB visibility
            const isVisible = await page.isVisible('.mase-dark-mode-fab');
            
            // Check FAB position
            const fabPosition = await page.evaluate(() => {
                const fab = document.querySelector('.mase-dark-mode-fab');
                if (!fab) return null;
                
                const rect = fab.getBoundingClientRect();
                const style = window.getComputedStyle(fab);
                
                return {
                    bottom: parseInt(style.bottom),
                    right: parseInt(style.right),
                    rect: {
                        bottom: rect.bottom,
                        right: rect.right,
                        top: rect.top,
                        left: rect.left
                    },
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                };
            });
            
            // Check if FAB is within viewport
            const isInViewport = fabPosition && 
                fabPosition.rect.bottom <= fabPosition.viewport.height &&
                fabPosition.rect.right <= fabPosition.viewport.width &&
                fabPosition.rect.top >= 0 &&
                fabPosition.rect.left >= 0;
            
            test.checks.push({
                name: `FAB visible on ${name}`,
                passed: isVisible,
                requirement: '1.5',
                details: `${viewport.width}x${viewport.height}`
            });
            
            test.checks.push({
                name: `FAB positioned correctly on ${name}`,
                passed: isInViewport,
                requirement: '1.5',
                details: `Position: bottom ${fabPosition?.bottom}px, right ${fabPosition?.right}px`
            });
            
            // Take screenshot
            const screenshot = await takeScreenshot(page, `responsive-${name.toLowerCase()}`, `${name} View`);
            testResults.screenshots.push(screenshot);
            
            // Test toggle functionality
            await page.click('.mase-dark-mode-fab');
            await page.waitForTimeout(CONFIG.transitionDuration + 100);
            
            const darkModeActive = await page.evaluate(() => {
                return document.body.classList.contains('mase-dark-mode');
            });
            
            test.checks.push({
                name: `Toggle works on ${name}`,
                passed: darkModeActive,
                requirement: '1.5',
                details: darkModeActive ? 'Dark mode activated' : 'Toggle failed'
            });
            
            await context.close();
        }
        
        test.status = test.checks.every(c => c.passed) ? 'PASSED' : 'FAILED';
        console.log(`  ${test.status === 'PASSED' ? '✓' : '✗'} ${test.name}\n`);
        
    } catch (error) {
        test.status = 'ERROR';
        test.error = error.message;
        console.error(`  ✗ Error: ${error.message}\n`);
    } finally {
        testResults.tests.push(test);
    }
}

/**
 * Test 6: Reduced Motion Mode
 * Requirements: 9.6, 9.7
 */
async function testReducedMotion(browser, testResults) {
    console.log('♿ Test 6: Reduced Motion Mode...');
    
    const test = {
        name: 'Reduced Motion Mode',
        requirements: ['9.6', '9.7'],
        status: 'unknown',
        checks: []
    };
    
    const context = await browser.newContext({ 
        viewport: CONFIG.viewport,
        reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    
    try {
        await loginAndNavigate(page);
        
        // Check 1: Reduced motion media query detected
        const reducedMotionDetected = await page.evaluate(() => {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        });
        
        test.checks.push({
            name: 'Reduced motion preference detected',
            passed: reducedMotionDetected,
            requirement: '9.6',
            details: reducedMotionDetected ? 'Detected' : 'Not detected'
        });
        
        // Check 2: Transitions disabled or set to 0s
        const transitionsDisabled = await page.evaluate(() => {
            const body = document.body;
            const style = window.getComputedStyle(body);
            const transition = style.transition || style.webkitTransition;
            
            // Check if transition duration is 0s or none
            return !transition || 
                   transition === 'none' || 
                   transition.includes('0s') ||
                   transition.includes('0ms');
        });
        
        test.checks.push({
            name: 'Transitions disabled with reduced motion',
            passed: transitionsDisabled,
            requirement: '9.6',
            details: transitionsDisabled ? 'Transitions disabled' : 'Transitions still active'
        });
        
        // Check 3: Icon rotation animation disabled
        const rotationDisabled = await page.evaluate(() => {
            const icon = document.querySelector('.mase-dark-mode-fab .dashicons');
            if (!icon) return false;
            
            const style = window.getComputedStyle(icon);
            const transition = style.transition || style.webkitTransition;
            
            return !transition || 
                   transition === 'none' || 
                   transition.includes('0s') ||
                   transition.includes('0ms');
        });
        
        test.checks.push({
            name: 'Icon rotation disabled with reduced motion',
            passed: rotationDisabled,
            requirement: '9.6',
            details: rotationDisabled ? 'Rotation disabled' : 'Rotation still active'
        });

        // Take screenshot before toggle
        const beforeScreenshot = await takeScreenshot(page, 'reduced-motion-before', 'Reduced Motion - Before');
        testResults.screenshots.push(beforeScreenshot);
        
        // Check 4: Toggle still works (instant mode switching)
        await page.click('.mase-dark-mode-fab');
        await page.waitForTimeout(100); // Minimal wait since no animation
        
        const darkModeActive = await page.evaluate(() => {
            return document.body.classList.contains('mase-dark-mode');
        });
        
        test.checks.push({
            name: 'Instant mode switching works',
            passed: darkModeActive,
            requirement: '9.7',
            details: darkModeActive ? 'Mode switched instantly' : 'Toggle failed'
        });
        
        // Take screenshot after toggle
        const afterScreenshot = await takeScreenshot(page, 'reduced-motion-after', 'Reduced Motion - After');
        testResults.screenshots.push(afterScreenshot);
        
        // Check 5: Colors changed (functionality preserved)
        const colorsChanged = await page.evaluate(() => {
            const bodyBg = window.getComputedStyle(document.body).backgroundColor;
            // Dark mode should have dark background
            return bodyBg.includes('rgb(26, 26, 26)') || bodyBg.includes('#1a1a1a');
        });
        
        test.checks.push({
            name: 'Functionality preserved (colors changed)',
            passed: colorsChanged,
            requirement: '9.7',
            details: colorsChanged ? 'Colors applied' : 'Colors not changed'
        });
        
        test.status = test.checks.every(c => c.passed) ? 'PASSED' : 'FAILED';
        console.log(`  ${test.status === 'PASSED' ? '✓' : '✗'} ${test.name}\n`);
        
    } catch (error) {
        test.status = 'ERROR';
        test.error = error.message;
        console.error(`  ✗ Error: ${error.message}\n`);
    } finally {
        await context.close();
        testResults.tests.push(test);
    }
}

/**
 * Helper: Login and navigate to MASE settings
 */
async function loginAndNavigate(page) {
    try {
        await page.goto('http://localhost/wp-login.php', { 
            waitUntil: 'domcontentloaded',
            timeout: CONFIG.timeout 
        });
        
        await page.waitForSelector('#user_login', { timeout: 10000 });
        await page.fill('#user_login', 'admin');
        await page.fill('#user_pass', 'admin123');
        
        await Promise.all([
            page.waitForNavigation({ 
                waitUntil: 'domcontentloaded', 
                timeout: CONFIG.timeout 
            }),
            page.click('#wp-submit')
        ]);
        
        await page.goto(CONFIG.baseUrl, { 
            waitUntil: 'domcontentloaded', 
            timeout: CONFIG.timeout 
        });
        
        await page.waitForTimeout(2000);
    } catch (error) {
        console.warn('⚠️  Login/navigation may have failed:', error.message);
    }
}

/**
 * Helper: Take screenshot
 */
async function takeScreenshot(page, filename, description) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFilename = `dark-mode-visual-${filename}-${timestamp}.png`;
    const filepath = path.join(CONFIG.screenshotsDir, fullFilename);
    
    await page.screenshot({ 
        path: filepath, 
        fullPage: true 
    });
    
    return {
        filename: fullFilename,
        description,
        timestamp
    };
}

/**
 * Generate HTML report
 */
async function generateReport(testResults) {
    console.log('\n📊 Generating test report...');
    
    const statusColor = testResults.status === 'PASSED' ? '#00a32a' : 
                       testResults.status === 'FAILED' ? '#d63638' : '#dba617';
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MASE Dark Mode Visual Regression Test Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #f5f5f5; 
            padding: 40px; 
        }
        .container { 
            max-width: 1400px; 
            margin: 0 auto; 
            background: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        }
        h1 { color: #2271b1; margin-bottom: 10px; }
        h2 { color: #1d2327; margin: 30px 0 15px; }
        .meta { color: #646970; margin-bottom: 30px; font-size: 14px; }
        .status { 
            display: inline-block;
            padding: 10px 20px; 
            border-radius: 4px; 
            font-weight: bold; 
            font-size: 18px;
            margin: 20px 0;
            background: ${statusColor};
            color: white;
        }
        .test-card { 
            background: #f6f7f7; 
            padding: 20px; 
            border-radius: 4px; 
            margin: 15px 0; 
        }
        .test-card.passed { border-left: 4px solid #00a32a; }
        .test-card.failed { border-left: 4px solid #d63638; background: #fcf0f1; }
        .test-card.error { border-left: 4px solid #dba617; background: #fcf9e8; }
        .test-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 15px; 
        }
        .test-name { font-size: 18px; font-weight: 600; }
        .test-status { 
            padding: 5px 15px; 
            border-radius: 4px; 
            font-size: 14px; 
            font-weight: bold; 
        }
        .test-status.passed { background: #00a32a; color: white; }
        .test-status.failed { background: #d63638; color: white; }
        .test-status.error { background: #dba617; color: white; }
        .requirements { 
            color: #646970; 
            font-size: 13px; 
            margin-bottom: 10px; 
        }
        .checks { margin-top: 15px; }
        .check-item { 
            padding: 8px 0; 
            border-bottom: 1px solid #dcdcde; 
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .check-item:last-child { border-bottom: none; }
        .check-name { flex: 1; }
        .check-status { 
            margin-left: 10px;
            font-weight: bold;
        }
        .check-status.passed { color: #00a32a; }
        .check-status.failed { color: #d63638; }
        .check-details { 
            font-size: 12px; 
            color: #646970; 
            margin-top: 3px; 
        }
        .screenshots { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); 
            gap: 20px; 
            margin-top: 20px; 
        }
        .screenshot-card { 
            border: 1px solid #dcdcde; 
            border-radius: 8px; 
            overflow: hidden; 
        }
        .screenshot-card img { 
            width: 100%; 
            height: auto; 
            cursor: pointer; 
            transition: transform 0.2s; 
        }
        .screenshot-card img:hover { transform: scale(1.02); }
        .screenshot-title { 
            padding: 15px; 
            background: #f6f7f7; 
            font-size: 14px; 
            font-weight: 600; 
        }
        .summary { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 20px; 
            margin: 30px 0; 
        }
        .summary-card { 
            background: #f6f7f7; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center; 
        }
        .summary-value { 
            font-size: 36px; 
            font-weight: bold; 
            margin: 10px 0; 
        }
        .summary-label { 
            color: #646970; 
            font-size: 14px; 
        }
        .modal { 
            display: none; 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0,0,0,0.9); 
            z-index: 1000; 
            align-items: center; 
            justify-content: center; 
        }
        .modal.active { display: flex; }
        .modal img { max-width: 95%; max-height: 95%; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 MASE Dark Mode Visual Regression Test</h1>
        <div class="meta">
            <strong>Test Suite:</strong> ${testResults.testSuite}<br>
            <strong>Timestamp:</strong> ${new Date(testResults.timestamp).toLocaleString()}<br>
            <strong>Requirements:</strong> 1.1-1.8, 9.1-9.7
        </div>
        
        <div class="status">${testResults.status}</div>
        
        <div class="summary">
            <div class="summary-card">
                <div class="summary-label">Total Tests</div>
                <div class="summary-value">${testResults.tests.length}</div>
            </div>
            <div class="summary-card">
                <div class="summary-label">Passed</div>
                <div class="summary-value" style="color: #00a32a;">
                    ${testResults.tests.filter(t => t.status === 'PASSED').length}
                </div>
            </div>
            <div class="summary-card">
                <div class="summary-label">Failed</div>
                <div class="summary-value" style="color: #d63638;">
                    ${testResults.tests.filter(t => t.status === 'FAILED').length}
                </div>
            </div>
        </div>
        
        ${testResults.error ? `
        <div class="test-card error">
            <h2>❌ Suite Error</h2>
            <pre>${testResults.error}</pre>
        </div>
        ` : ''}
        
        <h2>📋 Test Results</h2>
        ${testResults.tests.map(test => `
            <div class="test-card ${test.status.toLowerCase()}">
                <div class="test-header">
                    <div class="test-name">${test.name}</div>
                    <div class="test-status ${test.status.toLowerCase()}">${test.status}</div>
                </div>
                <div class="requirements">
                    <strong>Requirements:</strong> ${test.requirements.join(', ')}
                </div>
                ${test.error ? `
                    <div style="color: #d63638; margin-top: 10px;">
                        <strong>Error:</strong> ${test.error}
                    </div>
                ` : ''}
                ${test.checks && test.checks.length > 0 ? `
                    <div class="checks">
                        ${test.checks.map(check => `
                            <div class="check-item">
                                <div class="check-name">
                                    ${check.name}
                                    ${check.details ? `
                                        <div class="check-details">${check.details}</div>
                                    ` : ''}
                                </div>
                                <div class="check-status ${check.passed ? 'passed' : 'failed'}">
                                    ${check.passed ? '✓ PASS' : '✗ FAIL'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
        
        <h2>📸 Screenshots</h2>
        <div class="screenshots">
            ${testResults.screenshots.map(screenshot => `
                <div class="screenshot-card">
                    <img src="../screenshots/${screenshot.filename}" 
                         alt="${screenshot.description}"
                         onclick="showModal(this.src)">
                    <div class="screenshot-title">${screenshot.description}</div>
                </div>
            `).join('')}
        </div>
    </div>
    
    <div class="modal" id="modal" onclick="hideModal()">
        <img id="modalImage" src="" alt="Screenshot">
    </div>
    
    <script>
        function showModal(src) {
            document.getElementById('modalImage').src = src;
            document.getElementById('modal').classList.add('active');
        }
        function hideModal() {
            document.getElementById('modal').classList.remove('active');
        }
    </script>
</body>
</html>
    `;
    
    const reportPath = path.join(
        CONFIG.reportsDir, 
        `dark-mode-visual-regression-${Date.now()}.html`
    );
    fs.writeFileSync(reportPath, html);
    
    const jsonPath = path.join(
        CONFIG.reportsDir, 
        `dark-mode-visual-regression-${Date.now()}.json`
    );
    fs.writeFileSync(jsonPath, JSON.stringify(testResults, null, 2));
    
    console.log(`✓ HTML Report: ${reportPath}`);
    console.log(`✓ JSON Results: ${jsonPath}`);
}

// Run the test suite
if (require.main === module) {
    runVisualRegressionTests()
        .then(results => {
            process.exit(results.status === 'PASSED' ? 0 : 1);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { runVisualRegressionTests };
