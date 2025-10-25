/**
 * MASE Dark Mode Accessibility Test (Automated)
 * 
 * Automated accessibility testing for dark/light mode toggle feature
 * Tests keyboard navigation, screen reader support, focus indicators,
 * ARIA attributes, contrast ratios, and reduced motion support
 * 
 * Requirements: 5.1-5.7, 6.6, 9.6-9.7
 */

const { chromium } = require('playwright');

// Test configuration
const CONFIG = {
    baseUrl: 'http://localhost/wp-admin/admin.php?page=mase-settings',
    timeout: 30000,
    viewport: { width: 1920, height: 1080 }
};

/**
 * Main test runner
 */
async function runDarkModeAccessibilityTests() {
    console.log('♿ Starting Dark Mode Accessibility Tests...\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 100
    });
    
    const context = await browser.newContext({
        viewport: CONFIG.viewport
    });
    
    const page = await context.newPage();
    
    const results = {
        timestamp: new Date().toISOString(),
        testName: 'Dark Mode Accessibility Tests',
        requirements: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '6.6', '9.6', '9.7'],
        tests: [],
        summary: {
            total: 0,
            passed: 0,
            failed: 0
        }
    };
    
    try {
        // Login
        console.log('🔐 Logging in...');
        await loginToWordPress(page);
        
        // Navigate to MASE settings
        console.log('📍 Navigating to MASE settings...');
        await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
        
        // Run tests
        await testKeyboardNavigation(page, results);
        await testScreenReaderSupport(page, results);
        await testFocusIndicators(page, results);
        await testARIAAttributes(page, results);
        await testContrastRatios(page, results);
        await testReducedMotion(page, results);
        
        // Calculate summary
        results.summary.total = results.tests.length;
        results.summary.passed = results.tests.filter(t => t.passed).length;
        results.summary.failed = results.tests.filter(t => !t.passed).length;
        
        // Print results
        console.log('\n' + '='.repeat(60));
        console.log('TEST SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total Tests: ${results.summary.total}`);
        console.log(`Passed: ${results.summary.passed} ✓`);
        console.log(`Failed: ${results.summary.failed} ✗`);
        console.log(`Success Rate: ${Math.round((results.summary.passed / results.summary.total) * 100)}%`);
        
        if (results.summary.failed === 0) {
            console.log('\n✅ ALL ACCESSIBILITY TESTS PASSED!');
        } else {
            console.log('\n❌ SOME TESTS FAILED');
            console.log('\nFailed Tests:');
            results.tests.filter(t => !t.passed).forEach(t => {
                console.log(`  - ${t.name}: ${t.error}`);
            });
        }
        
    } catch (error) {
        console.error('\n❌ Test error:', error);
    } finally {
        await context.close();
        await browser.close();
    }
    
    return results;
}

/**
 * Test 1: Keyboard Navigation (Req 5.1, 5.2, 5.6)
 */
async function testKeyboardNavigation(page, results) {
    console.log('\n🎹 Test 1: Keyboard Navigation');
    
    // Test 1.1: FAB is reachable via Tab
    try {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(200);
        
        const fabFocused = await page.evaluate(() => {
            const fab = document.querySelector('.mase-dark-mode-fab');
            return document.activeElement === fab;
        });
        
        results.tests.push({
            name: 'FAB reachable via Tab',
            requirement: '5.1',
            passed: fabFocused,
            error: fabFocused ? null : 'FAB not focused after Tab press'
        });
        console.log(`  ${fabFocused ? '✓' : '✗'} FAB reachable via Tab`);
    } catch (error) {
        results.tests.push({
            name: 'FAB reachable via Tab',
            requirement: '5.1',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ FAB reachable via Tab: ${error.message}`);
    }
    
    // Test 1.2: Enter key toggles mode
    try {
        const initialMode = await page.evaluate(() => {
            return document.body.classList.contains('mase-dark-mode') ? 'dark' : 'light';
        });
        
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);
        
        const newMode = await page.evaluate(() => {
            return document.body.classList.contains('mase-dark-mode') ? 'dark' : 'light';
        });
        
        const toggled = initialMode !== newMode;
        
        results.tests.push({
            name: 'Enter key toggles mode',
            requirement: '5.2',
            passed: toggled,
            error: toggled ? null : 'Mode did not toggle with Enter key'
        });
        console.log(`  ${toggled ? '✓' : '✗'} Enter key toggles mode`);
    } catch (error) {
        results.tests.push({
            name: 'Enter key toggles mode',
            requirement: '5.2',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ Enter key toggles mode: ${error.message}`);
    }
    
    // Test 1.3: Space key toggles mode
    try {
        const initialMode = await page.evaluate(() => {
            return document.body.classList.contains('mase-dark-mode') ? 'dark' : 'light';
        });
        
        await page.keyboard.press('Space');
        await page.waitForTimeout(500);
        
        const newMode = await page.evaluate(() => {
            return document.body.classList.contains('mase-dark-mode') ? 'dark' : 'light';
        });
        
        const toggled = initialMode !== newMode;
        
        results.tests.push({
            name: 'Space key toggles mode',
            requirement: '5.2',
            passed: toggled,
            error: toggled ? null : 'Mode did not toggle with Space key'
        });
        console.log(`  ${toggled ? '✓' : '✗'} Space key toggles mode`);
    } catch (error) {
        results.tests.push({
            name: 'Space key toggles mode',
            requirement: '5.2',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ Space key toggles mode: ${error.message}`);
    }
    
    // Test 1.4: Keyboard shortcut (Ctrl+Shift+D)
    try {
        const initialMode = await page.evaluate(() => {
            return document.body.classList.contains('mase-dark-mode') ? 'dark' : 'light';
        });
        
        await page.keyboard.press('Control+Shift+KeyD');
        await page.waitForTimeout(500);
        
        const newMode = await page.evaluate(() => {
            return document.body.classList.contains('mase-dark-mode') ? 'dark' : 'light';
        });
        
        const toggled = initialMode !== newMode;
        
        results.tests.push({
            name: 'Keyboard shortcut Ctrl+Shift+D works',
            requirement: '5.1',
            passed: toggled,
            error: toggled ? null : 'Keyboard shortcut did not toggle mode'
        });
        console.log(`  ${toggled ? '✓' : '✗'} Keyboard shortcut works`);
    } catch (error) {
        results.tests.push({
            name: 'Keyboard shortcut Ctrl+Shift+D works',
            requirement: '5.1',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ Keyboard shortcut: ${error.message}`);
    }
    
    // Test 1.5: Focus indicator visible
    try {
        const fab = await page.$('.mase-dark-mode-fab');
        await fab.focus();
        await page.waitForTimeout(200);
        
        const focusIndicator = await page.evaluate(() => {
            const fab = document.querySelector('.mase-dark-mode-fab');
            const styles = window.getComputedStyle(fab);
            const outlineWidth = parseFloat(styles.getPropertyValue('outline-width'));
            const outlineOffset = parseFloat(styles.getPropertyValue('outline-offset'));
            
            return {
                width: outlineWidth,
                offset: outlineOffset,
                visible: outlineWidth >= 2 && outlineOffset >= 2
            };
        });
        
        results.tests.push({
            name: 'Focus indicator visible (2px outline, 2px offset)',
            requirement: '5.7',
            passed: focusIndicator.visible,
            error: focusIndicator.visible ? null : `Outline: ${focusIndicator.width}px, Offset: ${focusIndicator.offset}px`
        });
        console.log(`  ${focusIndicator.visible ? '✓' : '✗'} Focus indicator visible`);
    } catch (error) {
        results.tests.push({
            name: 'Focus indicator visible',
            requirement: '5.7',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ Focus indicator: ${error.message}`);
    }
}

/**
 * Test 2: Screen Reader Support (Req 5.4, 5.7)
 */
async function testScreenReaderSupport(page, results) {
    console.log('\n🔊 Test 2: Screen Reader Support');
    
    // Test 2.1: FAB has aria-label
    try {
        const ariaLabel = await page.getAttribute('.mase-dark-mode-fab', 'aria-label');
        const hasLabel = ariaLabel && ariaLabel.length > 0;
        
        results.tests.push({
            name: 'FAB has descriptive aria-label',
            requirement: '5.4',
            passed: hasLabel,
            error: hasLabel ? null : 'FAB missing aria-label'
        });
        console.log(`  ${hasLabel ? '✓' : '✗'} FAB has aria-label: "${ariaLabel}"`);
    } catch (error) {
        results.tests.push({
            name: 'FAB has aria-label',
            requirement: '5.4',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ aria-label: ${error.message}`);
    }
    
    // Test 2.2: FAB has aria-pressed
    try {
        const ariaPressed = await page.getAttribute('.mase-dark-mode-fab', 'aria-pressed');
        const hasPressed = ariaPressed === 'true' || ariaPressed === 'false';
        
        results.tests.push({
            name: 'FAB has aria-pressed attribute',
            requirement: '5.4',
            passed: hasPressed,
            error: hasPressed ? null : `aria-pressed is "${ariaPressed}"`
        });
        console.log(`  ${hasPressed ? '✓' : '✗'} FAB has aria-pressed: "${ariaPressed}"`);
    } catch (error) {
        results.tests.push({
            name: 'FAB has aria-pressed',
            requirement: '5.4',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ aria-pressed: ${error.message}`);
    }
    
    // Test 2.3: aria-pressed updates on toggle
    try {
        const initialPressed = await page.getAttribute('.mase-dark-mode-fab', 'aria-pressed');
        
        await page.click('.mase-dark-mode-fab');
        await page.waitForTimeout(500);
        
        const newPressed = await page.getAttribute('.mase-dark-mode-fab', 'aria-pressed');
        const updated = initialPressed !== newPressed;
        
        results.tests.push({
            name: 'aria-pressed updates on toggle',
            requirement: '5.4',
            passed: updated,
            error: updated ? null : `aria-pressed stayed "${initialPressed}"`
        });
        console.log(`  ${updated ? '✓' : '✗'} aria-pressed updates: ${initialPressed} → ${newPressed}`);
    } catch (error) {
        results.tests.push({
            name: 'aria-pressed updates',
            requirement: '5.4',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ aria-pressed update: ${error.message}`);
    }
    
    // Test 2.4: ARIA live region exists
    try {
        const liveRegion = await page.$('[aria-live]');
        const exists = liveRegion !== null;
        
        results.tests.push({
            name: 'ARIA live region exists for announcements',
            requirement: '5.7',
            passed: exists,
            error: exists ? null : 'No ARIA live region found'
        });
        console.log(`  ${exists ? '✓' : '✗'} ARIA live region exists`);
    } catch (error) {
        results.tests.push({
            name: 'ARIA live region exists',
            requirement: '5.7',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ ARIA live region: ${error.message}`);
    }
    
    // Test 2.5: Icon has aria-hidden
    try {
        const iconHidden = await page.evaluate(() => {
            const fab = document.querySelector('.mase-dark-mode-fab');
            const icon = fab ? fab.querySelector('[class*="dashicons"], svg, i') : null;
            return icon ? icon.getAttribute('aria-hidden') === 'true' : false;
        });
        
        results.tests.push({
            name: 'Icon has aria-hidden="true"',
            requirement: '5.7',
            passed: iconHidden,
            error: iconHidden ? null : 'Icon not hidden from screen readers'
        });
        console.log(`  ${iconHidden ? '✓' : '✗'} Icon has aria-hidden`);
    } catch (error) {
        results.tests.push({
            name: 'Icon has aria-hidden',
            requirement: '5.7',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ Icon aria-hidden: ${error.message}`);
    }
}

/**
 * Test 3: Focus Indicators (Req 5.7)
 */
async function testFocusIndicators(page, results) {
    console.log('\n🎯 Test 3: Focus Indicators');
    
    // Test in both light and dark modes
    const modes = ['light', 'dark'];
    
    for (const mode of modes) {
        // Set mode
        const currentMode = await page.evaluate(() => {
            return document.body.classList.contains('mase-dark-mode') ? 'dark' : 'light';
        });
        
        if (currentMode !== mode) {
            await page.click('.mase-dark-mode-fab');
            await page.waitForTimeout(500);
        }
        
        try {
            const fab = await page.$('.mase-dark-mode-fab');
            await fab.focus();
            await page.waitForTimeout(200);
            
            const focusStyles = await page.evaluate(() => {
                const fab = document.querySelector('.mase-dark-mode-fab');
                const styles = window.getComputedStyle(fab);
                
                return {
                    outlineWidth: parseFloat(styles.getPropertyValue('outline-width')),
                    outlineOffset: parseFloat(styles.getPropertyValue('outline-offset')),
                    outlineStyle: styles.getPropertyValue('outline-style'),
                    outlineColor: styles.getPropertyValue('outline-color')
                };
            });
            
            const meetsStandards = focusStyles.outlineWidth >= 2 && 
                                  focusStyles.outlineOffset >= 2 &&
                                  focusStyles.outlineStyle !== 'none';
            
            results.tests.push({
                name: `Focus indicator visible in ${mode} mode`,
                requirement: '5.7',
                passed: meetsStandards,
                error: meetsStandards ? null : `Width: ${focusStyles.outlineWidth}px, Offset: ${focusStyles.outlineOffset}px`
            });
            console.log(`  ${meetsStandards ? '✓' : '✗'} Focus indicator in ${mode} mode`);
        } catch (error) {
            results.tests.push({
                name: `Focus indicator in ${mode} mode`,
                requirement: '5.7',
                passed: false,
                error: error.message
            });
            console.log(`  ✗ Focus indicator ${mode}: ${error.message}`);
        }
    }
}

/**
 * Test 4: ARIA Attributes (Req 5.4, 5.7)
 */
async function testARIAAttributes(page, results) {
    console.log('\n🏷️  Test 4: ARIA Attributes');
    
    try {
        const ariaAttributes = await page.evaluate(() => {
            const fab = document.querySelector('.mase-dark-mode-fab');
            if (!fab) return null;
            
            return {
                role: fab.getAttribute('role'),
                ariaLabel: fab.getAttribute('aria-label'),
                ariaPressed: fab.getAttribute('aria-pressed'),
                tabindex: fab.getAttribute('tabindex')
            };
        });
        
        // Test role
        const hasValidRole = ariaAttributes.role === 'switch' || ariaAttributes.role === 'button';
        results.tests.push({
            name: 'FAB has valid role (switch or button)',
            requirement: '5.4',
            passed: hasValidRole,
            error: hasValidRole ? null : `Role is "${ariaAttributes.role}"`
        });
        console.log(`  ${hasValidRole ? '✓' : '✗'} Valid role: "${ariaAttributes.role}"`);
        
        // Test aria-label
        const hasAriaLabel = ariaAttributes.ariaLabel && ariaAttributes.ariaLabel.length > 0;
        results.tests.push({
            name: 'FAB has aria-label',
            requirement: '5.4',
            passed: hasAriaLabel,
            error: hasAriaLabel ? null : 'Missing aria-label'
        });
        console.log(`  ${hasAriaLabel ? '✓' : '✗'} aria-label present`);
        
        // Test aria-pressed
        const hasAriaPressed = ariaAttributes.ariaPressed === 'true' || ariaAttributes.ariaPressed === 'false';
        results.tests.push({
            name: 'FAB has aria-pressed',
            requirement: '5.4',
            passed: hasAriaPressed,
            error: hasAriaPressed ? null : `aria-pressed is "${ariaAttributes.ariaPressed}"`
        });
        console.log(`  ${hasAriaPressed ? '✓' : '✗'} aria-pressed present`);
        
    } catch (error) {
        results.tests.push({
            name: 'ARIA attributes check',
            requirement: '5.4',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ ARIA attributes: ${error.message}`);
    }
}

/**
 * Test 5: Contrast Ratios - WCAG 2.1 AA (Req 6.6)
 */
async function testContrastRatios(page, results) {
    console.log('\n🎨 Test 5: Contrast Ratios (WCAG 2.1 AA)');
    
    // Helper function to calculate contrast
    const calculateContrast = async (selector, property = 'color') => {
        return await page.evaluate((sel, prop) => {
            const element = document.querySelector(sel);
            if (!element) return null;
            
            const styles = window.getComputedStyle(element);
            const color = styles.getPropertyValue(prop);
            const bgColor = styles.getPropertyValue('background-color');
            
            // Parse RGB
            const parseRgb = (rgb) => {
                const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : null;
            };
            
            // Calculate luminance
            const getLuminance = (r, g, b) => {
                const [rs, gs, bs] = [r, g, b].map(c => {
                    c = c / 255;
                    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                });
                return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
            };
            
            const colorRgb = parseRgb(color);
            const bgRgb = parseRgb(bgColor);
            
            if (!colorRgb || !bgRgb) return null;
            
            const l1 = getLuminance(...colorRgb);
            const l2 = getLuminance(...bgRgb);
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            
            return (lighter + 0.05) / (darker + 0.05);
        }, selector, property);
    };
    
    // Test light mode
    await page.evaluate(() => {
        document.body.classList.remove('mase-dark-mode');
    });
    await page.waitForTimeout(500);
    
    try {
        const lightContrast = await calculateContrast('#wpadminbar');
        const meetsAA = lightContrast >= 4.5;
        
        results.tests.push({
            name: 'Light mode admin bar contrast ≥ 4.5:1',
            requirement: '6.6',
            passed: meetsAA,
            error: meetsAA ? null : `Contrast ratio: ${lightContrast.toFixed(2)}:1`
        });
        console.log(`  ${meetsAA ? '✓' : '✗'} Light mode contrast: ${lightContrast.toFixed(2)}:1`);
    } catch (error) {
        results.tests.push({
            name: 'Light mode contrast',
            requirement: '6.6',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ Light mode contrast: ${error.message}`);
    }
    
    // Test dark mode
    await page.evaluate(() => {
        document.body.classList.add('mase-dark-mode');
    });
    await page.waitForTimeout(500);
    
    try {
        const darkContrast = await calculateContrast('#wpadminbar');
        const meetsAA = darkContrast >= 4.5;
        
        results.tests.push({
            name: 'Dark mode admin bar contrast ≥ 4.5:1',
            requirement: '6.6',
            passed: meetsAA,
            error: meetsAA ? null : `Contrast ratio: ${darkContrast.toFixed(2)}:1`
        });
        console.log(`  ${meetsAA ? '✓' : '✗'} Dark mode contrast: ${darkContrast.toFixed(2)}:1`);
    } catch (error) {
        results.tests.push({
            name: 'Dark mode contrast',
            requirement: '6.6',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ Dark mode contrast: ${error.message}`);
    }
}

/**
 * Test 6: Reduced Motion Support (Req 9.6, 9.7)
 */
async function testReducedMotion(page, results) {
    console.log('\n🎬 Test 6: Reduced Motion Support');
    
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(500);
    
    try {
        const transitionDuration = await page.evaluate(() => {
            const fab = document.querySelector('.mase-dark-mode-fab');
            const styles = window.getComputedStyle(fab);
            return parseFloat(styles.getPropertyValue('transition-duration'));
        });
        
        const isReduced = transitionDuration <= 0.01; // 0.01s or less
        
        results.tests.push({
            name: 'Transitions disabled with reduced motion',
            requirement: '9.6',
            passed: isReduced,
            error: isReduced ? null : `Transition duration: ${transitionDuration}s`
        });
        console.log(`  ${isReduced ? '✓' : '✗'} Transitions reduced: ${transitionDuration}s`);
    } catch (error) {
        results.tests.push({
            name: 'Reduced motion transitions',
            requirement: '9.6',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ Reduced motion: ${error.message}`);
    }
    
    // Test that functionality still works
    try {
        const initialMode = await page.evaluate(() => {
            return document.body.classList.contains('mase-dark-mode') ? 'dark' : 'light';
        });
        
        await page.click('.mase-dark-mode-fab');
        await page.waitForTimeout(200);
        
        const newMode = await page.evaluate(() => {
            return document.body.classList.contains('mase-dark-mode') ? 'dark' : 'light';
        });
        
        const stillWorks = initialMode !== newMode;
        
        results.tests.push({
            name: 'Functionality works with reduced motion',
            requirement: '9.7',
            passed: stillWorks,
            error: stillWorks ? null : 'Toggle did not work with reduced motion'
        });
        console.log(`  ${stillWorks ? '✓' : '✗'} Functionality still works`);
    } catch (error) {
        results.tests.push({
            name: 'Reduced motion functionality',
            requirement: '9.7',
            passed: false,
            error: error.message
        });
        console.log(`  ✗ Reduced motion functionality: ${error.message}`);
    }
    
    // Reset
    await page.emulateMedia({ reducedMotion: 'no-preference' });
}

/**
 * Login helper
 */
async function loginToWordPress(page) {
    try {
        await page.goto('http://localhost/wp-login.php', { 
            waitUntil: 'domcontentloaded',
            timeout: CONFIG.timeout 
        });
        
        await page.waitForSelector('#user_login', { timeout: 10000 });
        await page.fill('#user_login', 'admin');
        await page.fill('#user_pass', 'admin123');
        
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            page.click('#wp-submit')
        ]);
        
        await page.waitForTimeout(2000);
    } catch (error) {
        console.warn('⚠️  Login may have failed:', error.message);
    }
}

// Run tests
if (require.main === module) {
    runDarkModeAccessibilityTests()
        .then(results => {
            process.exit(results.summary.failed === 0 ? 0 : 1);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { runDarkModeAccessibilityTests };
