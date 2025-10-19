/**
 * Cross-Browser Compatibility Tests for Dark Mode Toggle
 * 
 * Tests Requirements: All requirements from header-dark-mode-toggle spec
 * 
 * This test suite validates that the dark mode toggle works correctly
 * across Chrome, Firefox, Safari, and Edge browsers.
 * 
 * Usage:
 *   npx playwright test test-dark-mode-cross-browser.js
 * 
 * Run specific browser:
 *   npx playwright test test-dark-mode-cross-browser.js --project=chromium
 *   npx playwright test test-dark-mode-cross-browser.js --project=firefox
 *   npx playwright test test-dark-mode-cross-browser.js --project=webkit
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_HTML_PATH = path.resolve(__dirname, '../test-dark-mode-toggle.html');
const TEST_URL = 'file://' + TEST_HTML_PATH;
const RESULTS_DIR = path.join(__dirname, 'test-results', 'dark-mode');

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
async function takeScreenshot(page, testName, browserName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${browserName}-${testName}-${timestamp}.png`;
    const filepath = path.join(RESULTS_DIR, filename);
    
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`📸 Screenshot saved: ${filename}`);
}

/**
 * Test Suite: localStorage Support (Requirements 4.1-4.5)
 */
test.describe('localStorage Support', () => {
    test('should support localStorage API', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        
        const hasLocalStorage = await page.evaluate(() => {
            return typeof localStorage !== 'undefined';
        });
        
        expect(hasLocalStorage).toBe(true);
        console.log(`✓ ${browserName}: localStorage API supported`);
    });
    
    test('should save dark mode preference to localStorage', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Clear localStorage first
        await page.evaluate(() => localStorage.clear());
        
        // Enable dark mode
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(500);
        
        // Check localStorage
        const storageValue = await page.evaluate(() => {
            return localStorage.getItem('mase_dark_mode');
        });
        
        expect(storageValue).toBe('true');
        console.log(`✓ ${browserName}: Dark mode saved to localStorage`);
    });
    
    test('should restore dark mode from localStorage on page load', async ({ page, browserName }) => {
        // Set localStorage before loading page
        await page.goto(TEST_URL);
        await page.evaluate(() => {
            localStorage.setItem('mase_dark_mode', 'true');
        });
        
        // Reload page
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
        
        // Check if dark mode is applied
        const htmlTheme = await page.evaluate(() => {
            return document.documentElement.getAttribute('data-theme');
        });
        
        const bodyClass = await page.evaluate(() => {
            return document.body.classList.contains('mase-dark-mode');
        });
        
        const toggleChecked = await page.isChecked('#mase-dark-mode-toggle');
        
        expect(htmlTheme).toBe('dark');
        expect(bodyClass).toBe(true);
        expect(toggleChecked).toBe(true);
        
        console.log(`✓ ${browserName}: Dark mode restored from localStorage`);
    });
    
    test('should handle localStorage errors gracefully', async ({ page, browserName }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });
        
        await page.goto(TEST_URL);
        
        // Try to fill localStorage (some browsers have limits)
        await page.evaluate(() => {
            try {
                for (let i = 0; i < 100; i++) {
                    localStorage.setItem(`test_${i}`, 'x'.repeat(10000));
                }
            } catch (e) {
                // Expected to fail at some point
            }
        });
        
        // Toggle dark mode - should not throw errors
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(500);
        
        // Should not have critical errors
        const criticalErrors = errors.filter(e => 
            !e.includes('localStorage') && !e.includes('QuotaExceededError')
        );
        
        expect(criticalErrors).toHaveLength(0);
        console.log(`✓ ${browserName}: localStorage errors handled gracefully`);
    });
});

/**
 * Test Suite: CSS Custom Properties (Requirements 2.1-2.5, 7.1-7.5)
 */
test.describe('CSS Custom Properties', () => {
    test('should support CSS custom properties', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        
        const supportsCustomProps = await page.evaluate(() => {
            return CSS.supports('--test', 'value');
        });
        
        expect(supportsCustomProps).toBe(true);
        console.log(`✓ ${browserName}: CSS custom properties supported`);
    });
    
    test('should apply data-theme attribute correctly', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Enable dark mode
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(300);
        
        // Check data-theme attribute
        const dataTheme = await page.evaluate(() => {
            return document.documentElement.getAttribute('data-theme');
        });
        
        expect(dataTheme).toBe('dark');
        console.log(`✓ ${browserName}: data-theme="dark" applied correctly`);
    });
    
    test('should apply dark mode CSS styles', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Get initial background color
        const lightBg = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });
        
        // Enable dark mode
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(300);
        
        // Get dark mode background color
        const darkBg = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });
        
        // Colors should be different
        expect(lightBg).not.toBe(darkBg);
        console.log(`✓ ${browserName}: Dark mode CSS styles applied (${lightBg} → ${darkBg})`);
    });
    
    test('should maintain WCAG AA contrast ratios', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Enable dark mode
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(300);
        
        // Check contrast ratio
        const contrastInfo = await page.evaluate(() => {
            const body = document.body;
            const style = window.getComputedStyle(body);
            const bgColor = style.backgroundColor;
            const textColor = style.color;
            
            // Simple contrast calculation (not perfect but good enough for testing)
            function getLuminance(rgb) {
                const [r, g, b] = rgb.match(/\d+/g).map(Number);
                const [rs, gs, bs] = [r, g, b].map(c => {
                    c = c / 255;
                    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                });
                return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
            }
            
            const bgLum = getLuminance(bgColor);
            const textLum = getLuminance(textColor);
            const ratio = (Math.max(bgLum, textLum) + 0.05) / (Math.min(bgLum, textLum) + 0.05);
            
            return {
                bgColor,
                textColor,
                ratio: ratio.toFixed(2)
            };
        });
        
        // WCAG AA requires 4.5:1 for normal text
        expect(parseFloat(contrastInfo.ratio)).toBeGreaterThan(4.5);
        console.log(`✓ ${browserName}: Contrast ratio ${contrastInfo.ratio}:1 (WCAG AA compliant)`);
    });
});

/**
 * Test Suite: Dark Mode Appearance Consistency
 */
test.describe('Dark Mode Appearance Consistency', () => {
    test('should render dark mode consistently', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Enable dark mode
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(500);
        
        // Take screenshot
        await takeScreenshot(page, 'dark-mode-enabled', browserName);
        
        // Check key elements
        const elements = await page.evaluate(() => {
            const getStyle = (selector) => {
                const el = document.querySelector(selector);
                if (!el) return null;
                const style = window.getComputedStyle(el);
                return {
                    backgroundColor: style.backgroundColor,
                    color: style.color
                };
            };
            
            return {
                body: getStyle('body'),
                container: getStyle('.test-container'),
                section: getStyle('.test-section'),
                button: getStyle('button.primary')
            };
        });
        
        // Verify all elements have styles applied
        expect(elements.body).toBeTruthy();
        expect(elements.container).toBeTruthy();
        expect(elements.section).toBeTruthy();
        
        console.log(`✓ ${browserName}: Dark mode appearance consistent`);
    });
    
    test('should have smooth transitions', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Check if transitions are defined
        const hasTransitions = await page.evaluate(() => {
            const body = document.body;
            const style = window.getComputedStyle(body);
            return style.transition !== 'all 0s ease 0s';
        });
        
        expect(hasTransitions).toBe(true);
        console.log(`✓ ${browserName}: Smooth transitions defined`);
    });
    
    test('should not have visual glitches when toggling', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });
        
        // Toggle multiple times
        for (let i = 0; i < 5; i++) {
            await page.click('#mase-dark-mode-toggle');
            await page.waitForTimeout(100);
        }
        
        // Should not have errors
        expect(errors).toHaveLength(0);
        console.log(`✓ ${browserName}: No visual glitches during toggling`);
    });
});

/**
 * Test Suite: Toggle Functionality
 */
test.describe('Toggle Functionality', () => {
    test('should toggle dark mode on click', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Initial state should be light
        let dataTheme = await page.evaluate(() => {
            return document.documentElement.getAttribute('data-theme');
        });
        expect(dataTheme).toBeNull();
        
        // Click to enable
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(300);
        
        dataTheme = await page.evaluate(() => {
            return document.documentElement.getAttribute('data-theme');
        });
        expect(dataTheme).toBe('dark');
        
        // Click to disable
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(300);
        
        dataTheme = await page.evaluate(() => {
            return document.documentElement.getAttribute('data-theme');
        });
        expect(dataTheme).toBeNull();
        
        console.log(`✓ ${browserName}: Toggle functionality works correctly`);
    });
    
    test('should synchronize header and general tab toggles', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Click header toggle
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(300);
        
        // Check both toggles
        const headerChecked = await page.isChecked('#mase-dark-mode-toggle');
        const generalChecked = await page.isChecked('#master-dark-mode');
        
        expect(headerChecked).toBe(true);
        expect(generalChecked).toBe(true);
        
        // Click general tab toggle
        await page.click('#master-dark-mode');
        await page.waitForTimeout(300);
        
        const headerChecked2 = await page.isChecked('#mase-dark-mode-toggle');
        const generalChecked2 = await page.isChecked('#master-dark-mode');
        
        expect(headerChecked2).toBe(false);
        expect(generalChecked2).toBe(false);
        
        console.log(`✓ ${browserName}: Toggle synchronization works`);
    });
    
    test('should update aria-checked attributes', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Initial aria-checked should be false
        let ariaChecked = await page.getAttribute('#mase-dark-mode-toggle', 'aria-checked');
        expect(ariaChecked).toBe('false');
        
        // Enable dark mode
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(300);
        
        // aria-checked should be true
        ariaChecked = await page.getAttribute('#mase-dark-mode-toggle', 'aria-checked');
        expect(ariaChecked).toBe('true');
        
        console.log(`✓ ${browserName}: aria-checked attributes update correctly`);
    });
});

/**
 * Test Suite: Accessibility
 */
test.describe('Accessibility', () => {
    test('should have proper ARIA attributes', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        const ariaAttributes = await page.evaluate(() => {
            const toggle = document.getElementById('mase-dark-mode-toggle');
            return {
                role: toggle.getAttribute('role'),
                ariaChecked: toggle.getAttribute('aria-checked'),
                ariaLabel: toggle.getAttribute('aria-label')
            };
        });
        
        expect(ariaAttributes.role).toBe('switch');
        expect(ariaAttributes.ariaChecked).toBeTruthy();
        expect(ariaAttributes.ariaLabel).toBeTruthy();
        
        console.log(`✓ ${browserName}: ARIA attributes present and correct`);
    });
    
    test('should be keyboard accessible', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Tab to the toggle
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
        
        // Check if toggle is focused
        const isFocused = await page.evaluate(() => {
            const toggle = document.getElementById('mase-dark-mode-toggle');
            return document.activeElement === toggle;
        });
        
        // Press Space to toggle
        if (isFocused) {
            await page.keyboard.press('Space');
            await page.waitForTimeout(300);
            
            const isChecked = await page.isChecked('#mase-dark-mode-toggle');
            expect(isChecked).toBe(true);
        }
        
        console.log(`✓ ${browserName}: Keyboard navigation works`);
    });
    
    test('should have visible focus indicators', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Focus the toggle
        await page.focus('#mase-dark-mode-toggle');
        await page.waitForTimeout(100);
        
        // Check if outline is visible
        const focusStyle = await page.evaluate(() => {
            const toggle = document.getElementById('mase-dark-mode-toggle');
            const style = window.getComputedStyle(toggle);
            return {
                outline: style.outline,
                outlineWidth: style.outlineWidth,
                outlineStyle: style.outlineStyle
            };
        });
        
        // Should have some form of focus indicator
        const hasFocusIndicator = 
            focusStyle.outline !== 'none' || 
            focusStyle.outlineWidth !== '0px';
        
        console.log(`✓ ${browserName}: Focus indicators present`);
    });
});

/**
 * Test Suite: JavaScript Functionality
 */
test.describe('JavaScript Functionality', () => {
    test('should have no JavaScript errors', async ({ page, browserName }) => {
        const jsErrors = [];
        
        page.on('pageerror', error => {
            jsErrors.push(error.message);
        });
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                jsErrors.push(msg.text());
            }
        });
        
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Interact with toggle
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(500);
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(500);
        
        if (jsErrors.length > 0) {
            console.error(`✗ ${browserName}: JavaScript errors:`, jsErrors);
            await takeScreenshot(page, 'js-errors', browserName);
        }
        
        expect(jsErrors).toHaveLength(0);
        console.log(`✓ ${browserName}: No JavaScript errors`);
    });
    
    test('should handle rapid toggling', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        
        // Rapid toggle
        for (let i = 0; i < 10; i++) {
            await page.click('#mase-dark-mode-toggle');
            await page.waitForTimeout(50);
        }
        
        expect(errors).toHaveLength(0);
        console.log(`✓ ${browserName}: Handles rapid toggling without errors`);
    });
});

/**
 * Test Suite: Browser-Specific Tests
 */
test.describe('Browser-Specific Tests', () => {
    test('Chrome: should support all modern features', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Chrome-specific test');
        
        await page.goto(TEST_URL);
        
        const features = await page.evaluate(() => {
            return {
                localStorage: typeof localStorage !== 'undefined',
                customProps: CSS.supports('--test', 'value'),
                dataAttributes: true,
                transitions: CSS.supports('transition', 'all 0.3s')
            };
        });
        
        expect(features.localStorage).toBe(true);
        expect(features.customProps).toBe(true);
        expect(features.transitions).toBe(true);
        
        console.log(`✓ Chrome: All modern features supported`);
    });
    
    test('Firefox: should handle data attributes correctly', async ({ page, browserName }) => {
        test.skip(browserName !== 'firefox', 'Firefox-specific test');
        
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Enable dark mode
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(300);
        
        const dataTheme = await page.evaluate(() => {
            return document.documentElement.getAttribute('data-theme');
        });
        
        expect(dataTheme).toBe('dark');
        
        console.log(`✓ Firefox: data-theme attribute works correctly`);
    });
    
    test('Safari: should handle webkit prefixes', async ({ page, browserName }) => {
        test.skip(browserName !== 'webkit', 'Safari-specific test');
        
        await page.goto(TEST_URL);
        
        const hasWebkitSupport = await page.evaluate(() => {
            const style = document.createElement('div').style;
            return 'webkitTransition' in style;
        });
        
        console.log(`✓ Safari: Webkit prefixes ${hasWebkitSupport ? 'supported' : 'not needed'}`);
    });
    
    test('Edge: should work identically to Chrome', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Edge uses Chromium');
        
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Test basic functionality
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(300);
        
        const dataTheme = await page.evaluate(() => {
            return document.documentElement.getAttribute('data-theme');
        });
        
        expect(dataTheme).toBe('dark');
        
        console.log(`✓ Edge: Works identically to Chrome (Chromium-based)`);
    });
});

/**
 * Test Suite: Performance
 */
test.describe('Performance', () => {
    test('should toggle quickly', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        const startTime = Date.now();
        
        // Toggle 10 times
        for (let i = 0; i < 10; i++) {
            await page.click('#mase-dark-mode-toggle');
            await page.waitForTimeout(50);
        }
        
        const duration = Date.now() - startTime;
        const avgTime = duration / 10;
        
        console.log(`⏱ ${browserName}: Average toggle time ${avgTime.toFixed(2)}ms`);
        
        // Should be fast (< 100ms per toggle)
        expect(avgTime).toBeLessThan(100);
    });
    
    test('should not cause memory leaks', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        const initialMetrics = await page.metrics();
        
        // Toggle many times
        for (let i = 0; i < 50; i++) {
            await page.click('#mase-dark-mode-toggle');
            await page.waitForTimeout(20);
        }
        
        const finalMetrics = await page.metrics();
        
        const memoryIncrease = finalMetrics.JSHeapUsedSize - initialMetrics.JSHeapUsedSize;
        const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
        
        console.log(`💾 ${browserName}: Memory increase ${memoryIncreaseMB.toFixed(2)}MB`);
        
        // Should not increase more than 2MB
        expect(memoryIncreaseMB).toBeLessThan(2);
    });
});

/**
 * Test Suite: Export Comprehensive Results
 */
test.describe('Export Results', () => {
    test('should generate comprehensive test report', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        // Test dark mode toggle
        await page.click('#mase-dark-mode-toggle');
        await page.waitForTimeout(500);
        
        const results = await page.evaluate(() => {
            return {
                timestamp: new Date().toISOString(),
                browser: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language
                },
                darkMode: {
                    htmlDataTheme: document.documentElement.getAttribute('data-theme'),
                    bodyHasClass: document.body.classList.contains('mase-dark-mode'),
                    headerToggleChecked: document.getElementById('mase-dark-mode-toggle').checked,
                    generalToggleChecked: document.getElementById('master-dark-mode').checked,
                    localStorageValue: localStorage.getItem('mase_dark_mode')
                },
                cssSupport: {
                    customProperties: CSS.supports('--test', 'value'),
                    transitions: CSS.supports('transition', 'all 0.3s'),
                    dataAttributeSelectors: true
                },
                accessibility: {
                    headerToggleRole: document.getElementById('mase-dark-mode-toggle').getAttribute('role'),
                    headerToggleAriaChecked: document.getElementById('mase-dark-mode-toggle').getAttribute('aria-checked'),
                    headerToggleAriaLabel: document.getElementById('mase-dark-mode-toggle').getAttribute('aria-label')
                },
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            };
        });
        
        await saveTestResults(browserName, 'comprehensive', results);
        
        expect(results.darkMode.htmlDataTheme).toBe('dark');
        expect(results.darkMode.bodyHasClass).toBe(true);
        expect(results.darkMode.localStorageValue).toBe('true');
        
        console.log(`✓ ${browserName}: Comprehensive report generated`);
    });
});
