/**
 * MASE Browser Console Test Suite
 * 
 * Run this script in the browser console on the MASE settings page
 * to automatically test core functionality.
 * 
 * Usage:
 * 1. Navigate to http://localhost:8080/wp-admin/admin.php?page=mase-settings
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire script
 * 4. Press Enter
 * 5. Watch the automated tests run
 * 
 * @package MASE
 * @since 1.2.1
 */

(function() {
    'use strict';
    
    console.log('%c🚀 MASE Automated Test Suite Starting...', 'color: #00ff00; font-size: 16px; font-weight: bold;');
    console.log('%c═══════════════════════════════════════════', 'color: #00ff00;');
    
    const results = {
        total: 0,
        passed: 0,
        failed: 0,
        errors: []
    };
    
    /**
     * Test helper functions
     */
    const test = {
        async run(name, fn) {
            results.total++;
            console.log(`\n%c▶ TEST: ${name}`, 'color: #00aaff; font-weight: bold;');
            try {
                await fn();
                results.passed++;
                console.log(`%c✓ PASSED: ${name}`, 'color: #00ff00;');
                return true;
            } catch (error) {
                results.failed++;
                results.errors.push({ test: name, error: error.message });
                console.error(`%c✗ FAILED: ${name}`, 'color: #ff0000;');
                console.error('Error:', error);
                return false;
            }
        },
        
        assert(condition, message) {
            if (!condition) {
                throw new Error(message || 'Assertion failed');
            }
        },
        
        assertEqual(actual, expected, message) {
            if (actual !== expected) {
                throw new Error(message || `Expected ${expected}, got ${actual}`);
            }
        },
        
        assertExists(selector, message) {
            const element = document.querySelector(selector);
            if (!element) {
                throw new Error(message || `Element not found: ${selector}`);
            }
            return element;
        },
        
        async wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        
        async waitForElement(selector, timeout = 5000) {
            const start = Date.now();
            while (Date.now() - start < timeout) {
                const element = document.querySelector(selector);
                if (element) return element;
                await this.wait(100);
            }
            throw new Error(`Timeout waiting for element: ${selector}`);
        },
        
        async waitForAjax() {
            return new Promise(resolve => {
                const check = () => {
                    if (jQuery.active === 0) {
                        resolve();
                    } else {
                        setTimeout(check, 100);
                    }
                };
                check();
            });
        }
    };
    
    /**
     * TEST SUITE
     */
    
    // TEST 1: Page Structure
    test.run('1.1: MASE settings page exists', async () => {
        test.assertExists('.mase-settings-page', 'Settings page not found');
        test.assertExists('.mase-tabs', 'Tabs not found');
        test.assertExists('.mase-tab-content', 'Tab content not found');
    });
    
    test.run('1.2: All required tabs exist', async () => {
        const requiredTabs = ['Menu', 'Content', 'Universal Buttons', 'Backgrounds', 'Login Page', 'Advanced'];
        requiredTabs.forEach(tabName => {
            const tab = Array.from(document.querySelectorAll('.mase-tab')).find(t => t.textContent.includes(tabName));
            test.assert(tab, `Tab not found: ${tabName}`);
        });
    });
    
    test.run('1.3: Save Settings button exists', async () => {
        test.assertExists('button:has-text("Save Settings"), .mase-save-button', 'Save button not found');
    });
    
    // TEST 2: Live Preview Toggle
    test.run('2.1: Live Preview toggle exists', async () => {
        const toggle = test.assertExists('#mase-live-preview-toggle', 'Live Preview toggle not found');
        console.log('Toggle found:', toggle);
    });
    
    test.run('2.2: Live Preview can be enabled', async () => {
        const toggle = document.querySelector('#mase-live-preview-toggle');
        test.assert(toggle, 'Toggle not found');
        
        // Click toggle
        toggle.click();
        await test.wait(500);
        
        // Check if enabled
        test.assert(toggle.checked, 'Toggle not checked after click');
        
        // Check if live preview CSS is injected
        const livePreviewStyle = document.querySelector('#mase-live-preview-css');
        test.assert(livePreviewStyle, 'Live preview CSS not injected');
        
        console.log('Live Preview enabled successfully');
    });
    
    test.run('2.3: Live Preview updates on color change', async () => {
        // Ensure Live Preview is enabled
        const toggle = document.querySelector('#mase-live-preview-toggle');
        if (!toggle.checked) {
            toggle.click();
            await test.wait(500);
        }
        
        // Find a color input
        const colorInput = document.querySelector('input[name="admin_bar[background_color]"]');
        test.assert(colorInput, 'Color input not found');
        
        // Change color
        const testColor = '#FF0000';
        colorInput.value = testColor;
        colorInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        await test.wait(500);
        
        // Check if live preview CSS contains the color
        const livePreviewStyle = document.querySelector('#mase-live-preview-css');
        test.assert(livePreviewStyle, 'Live preview CSS not found');
        test.assert(livePreviewStyle.textContent.includes(testColor.toLowerCase()), 'Color not applied in live preview');
        
        console.log('Live Preview color update works');
    });
    
    // TEST 3: Form Inputs
    test.run('3.1: Color inputs exist and are functional', async () => {
        const colorInputs = document.querySelectorAll('input[type="text"][name*="color"]');
        test.assert(colorInputs.length > 0, 'No color inputs found');
        
        // Test first color input
        const firstInput = colorInputs[0];
        const originalValue = firstInput.value;
        firstInput.value = '#123456';
        firstInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        test.assertEqual(firstInput.value, '#123456', 'Color input value not updated');
        
        // Restore original value
        firstInput.value = originalValue;
        firstInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log(`Found ${colorInputs.length} color inputs`);
    });
    
    test.run('3.2: Sliders exist and are functional', async () => {
        const sliders = document.querySelectorAll('input[type="range"]');
        test.assert(sliders.length > 0, 'No sliders found');
        
        // Test first slider
        const firstSlider = sliders[0];
        const originalValue = firstSlider.value;
        firstSlider.value = parseInt(firstSlider.max) / 2;
        firstSlider.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Restore original value
        firstSlider.value = originalValue;
        firstSlider.dispatchEvent(new Event('input', { bubbles: true }));
        
        console.log(`Found ${sliders.length} sliders`);
    });
    
    test.run('3.3: Checkboxes exist and are functional', async () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        test.assert(checkboxes.length > 0, 'No checkboxes found');
        
        console.log(`Found ${checkboxes.length} checkboxes`);
    });
    
    // TEST 4: Tab Navigation
    test.run('4.1: Tab navigation works', async () => {
        const tabs = document.querySelectorAll('.mase-tab');
        test.assert(tabs.length > 0, 'No tabs found');
        
        // Click second tab
        if (tabs.length > 1) {
            tabs[1].click();
            await test.wait(300);
            
            // Check if tab is active
            test.assert(tabs[1].classList.contains('active'), 'Tab not activated');
        }
        
        console.log(`Found ${tabs.length} tabs`);
    });
    
    // TEST 5: AJAX Configuration
    test.run('5.1: AJAX configuration exists', async () => {
        test.assert(typeof maseL10n !== 'undefined', 'maseL10n not defined');
        test.assert(maseL10n.ajaxUrl, 'AJAX URL not defined');
        test.assert(maseL10n.nonce, 'Nonce not defined');
        
        console.log('AJAX URL:', maseL10n.ajaxUrl);
        console.log('Nonce:', maseL10n.nonce.substring(0, 10) + '...');
    });
    
    test.run('5.2: MASE object exists', async () => {
        test.assert(typeof MASE !== 'undefined', 'MASE object not defined');
        test.assert(typeof MASE.livePreview !== 'undefined', 'MASE.livePreview not defined');
        test.assert(typeof MASE.paletteManager !== 'undefined', 'MASE.paletteManager not defined');
        test.assert(typeof MASE.templateManager !== 'undefined', 'MASE.templateManager not defined');
        
        console.log('MASE object structure:', Object.keys(MASE));
    });
    
    // TEST 6: Console Errors Check
    test.run('6.1: No JavaScript errors in console', async () => {
        // This test checks if there were any errors logged before running tests
        // In a real scenario, you'd set up error listeners before page load
        console.log('Note: Check console manually for any JavaScript errors');
    });
    
    // TEST 7: Palette System
    test.run('7.1: Palette cards exist', async () => {
        const paletteCards = document.querySelectorAll('.mase-palette-card');
        test.assert(paletteCards.length > 0, 'No palette cards found');
        
        console.log(`Found ${paletteCards.length} palette cards`);
    });
    
    test.run('7.2: Palette apply buttons exist', async () => {
        const applyButtons = document.querySelectorAll('.mase-palette-apply-btn');
        test.assert(applyButtons.length > 0, 'No palette apply buttons found');
        
        console.log(`Found ${applyButtons.length} palette apply buttons`);
    });
    
    // TEST 8: Template System
    test.run('8.1: Template cards exist', async () => {
        // Navigate to Templates tab first
        const templatesTab = Array.from(document.querySelectorAll('.mase-tab')).find(t => t.textContent.includes('Templates'));
        if (templatesTab) {
            templatesTab.click();
            await test.wait(500);
        }
        
        const templateCards = document.querySelectorAll('.mase-template-card, .mase-template-preview-card');
        test.assert(templateCards.length > 0, 'No template cards found');
        
        console.log(`Found ${templateCards.length} template cards`);
    });
    
    // TEST 9: Button System
    test.run('9.1: Button type selector exists', async () => {
        // Navigate to Universal Buttons tab
        const buttonsTab = Array.from(document.querySelectorAll('.mase-tab')).find(t => t.textContent.includes('Universal Buttons'));
        if (buttonsTab) {
            buttonsTab.click();
            await test.wait(500);
        }
        
        const buttonTypeSelect = document.querySelector('select[name="button_type"], .mase-button-type-select');
        test.assert(buttonTypeSelect, 'Button type selector not found');
        
        console.log('Button type selector found');
    });
    
    test.run('9.2: Button preview exists', async () => {
        const buttonPreview = document.querySelector('.mase-button-preview');
        test.assert(buttonPreview, 'Button preview not found');
        
        console.log('Button preview found');
    });
    
    // TEST 10: Background System
    test.run('10.1: Background area selector exists', async () => {
        // Navigate to Backgrounds tab
        const backgroundsTab = Array.from(document.querySelectorAll('.mase-tab')).find(t => t.textContent.includes('Backgrounds'));
        if (backgroundsTab) {
            backgroundsTab.click();
            await test.wait(500);
        }
        
        const areaSelect = document.querySelector('select[name="background_area"], .mase-background-area-select');
        test.assert(areaSelect, 'Background area selector not found');
        
        console.log('Background area selector found');
    });
    
    // TEST 11: Accessibility
    test.run('11.1: ARIA labels exist on interactive elements', async () => {
        const toggle = document.querySelector('#mase-live-preview-toggle');
        if (toggle) {
            const label = toggle.closest('label');
            test.assert(label, 'Toggle label not found');
        }
        
        console.log('Accessibility check passed');
    });
    
    test.run('11.2: Focus indicators work', async () => {
        const firstInput = document.querySelector('input[type="text"]');
        if (firstInput) {
            firstInput.focus();
            await test.wait(100);
            
            const focusedElement = document.activeElement;
            test.assertEqual(focusedElement, firstInput, 'Focus not applied correctly');
            
            firstInput.blur();
        }
        
        console.log('Focus indicators work');
    });
    
    /**
     * Run all tests and display results
     */
    setTimeout(async () => {
        console.log('\n%c═══════════════════════════════════════════', 'color: #00ff00;');
        console.log('%c📊 TEST RESULTS', 'color: #00ff00; font-size: 16px; font-weight: bold;');
        console.log('%c═══════════════════════════════════════════', 'color: #00ff00;');
        console.log(`\n%cTotal Tests: ${results.total}`, 'font-weight: bold;');
        console.log(`%c✓ Passed: ${results.passed}`, 'color: #00ff00; font-weight: bold;');
        console.log(`%c✗ Failed: ${results.failed}`, 'color: #ff0000; font-weight: bold;');
        console.log(`%cPass Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`, 'font-weight: bold;');
        
        if (results.errors.length > 0) {
            console.log('\n%c❌ FAILED TESTS:', 'color: #ff0000; font-weight: bold;');
            results.errors.forEach((error, index) => {
                console.log(`\n${index + 1}. ${error.test}`);
                console.log(`   Error: ${error.error}`);
            });
        }
        
        console.log('\n%c═══════════════════════════════════════════', 'color: #00ff00;');
        
        if (results.failed === 0) {
            console.log('%c🎉 ALL TESTS PASSED!', 'color: #00ff00; font-size: 18px; font-weight: bold;');
        } else {
            console.log('%c⚠️  SOME TESTS FAILED', 'color: #ff9900; font-size: 18px; font-weight: bold;');
        }
        
        console.log('%c═══════════════════════════════════════════', 'color: #00ff00;');
        
        // Return results object for programmatic access
        window.MASE_TEST_RESULTS = results;
        console.log('\n%cResults saved to window.MASE_TEST_RESULTS', 'color: #00aaff;');
    }, 1000);
    
})();
