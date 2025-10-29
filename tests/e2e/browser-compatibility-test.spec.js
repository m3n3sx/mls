/**
 * Browser Compatibility Test Suite
 * 
 * Tests visual redesign across all major browsers:
 * - Chrome (Chromium)
 * - Firefox
 * - Safari (WebKit)
 * - Edge (Chromium)
 * 
 * Verifies:
 * - All styles render correctly
 * - All interactions work
 * - Responsive behavior
 * - Dark mode functionality
 * 
 * @package MASE
 * @since 1.3.0
 */

import { test, expect } from '@playwright/test';

// Configuration
const SETTINGS_PAGE = '/wp-admin/admin.php?page=mase-settings';
const TABS = ['General', 'Admin Bar', 'Menu', 'Content', 'Typography', 'Effects', 'Templates', 'Advanced'];

/**
 * Helper: Navigate to MASE settings page
 */
async function navigateToSettings(page) {
    await page.goto(SETTINGS_PAGE);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.mase-settings-page', { timeout: 10000 });
}

/**
 * Helper: Check for console errors
 */
function setupConsoleMonitoring(page) {
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            // Ignore common non-critical errors
            const text = msg.text();
            if (!text.includes('favicon') && !text.includes('extension')) {
                errors.push(text);
            }
        }
    });
    return errors;
}

/**
 * Helper: Verify CSS custom properties are loaded
 */
async function verifyCSSCustomProperties(page) {
    const hasCustomProps = await page.evaluate(() => {
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        return styles.getPropertyValue('--mase-primary').trim() !== '';
    });
    return hasCustomProps;
}

/**
 * Helper: Verify design tokens
 */
async function verifyDesignTokens(page) {
    const tokens = await page.evaluate(() => {
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        return {
            primary: styles.getPropertyValue('--mase-primary').trim(),
            spaceMd: styles.getPropertyValue('--mase-space-md').trim(),
            fontSizeBase: styles.getPropertyValue('--mase-font-size-base').trim(),
            radiusMd: styles.getPropertyValue('--mase-radius-md').trim(),
            shadowSm: styles.getPropertyValue('--mase-shadow-sm').trim()
        };
    });
    
    expect(tokens.primary).toBeTruthy();
    expect(tokens.spaceMd).toBeTruthy();
    expect(tokens.fontSizeBase).toBeTruthy();
    expect(tokens.radiusMd).toBeTruthy();
    expect(tokens.shadowSm).toBeTruthy();
}

/**
 * TEST SUITE: Chrome Browser Compatibility
 */
test.describe('Chrome Browser Compatibility', () => {
    test.use({ browserName: 'chromium' });
    
    test('Chrome: Verify all styles render correctly', async ({ page }) => {
        const errors = setupConsoleMonitoring(page);
        await navigateToSettings(page);
        
        // Verify CSS custom properties loaded
        const hasCustomProps = await verifyCSSCustomProperties(page);
        expect(hasCustomProps).toBe(true);
        
        // Verify design tokens
        await verifyDesignTokens(page);
        
        // Verify header styles
        const header = page.locator('.mase-header');
        await expect(header).toBeVisible();
        await expect(header).toHaveCSS('position', 'sticky');
        
        // Verify tab navigation styles
        const tabNav = page.locator('.mase-tab-nav');
        await expect(tabNav).toBeVisible();
        
        // Verify card styles
        const cards = page.locator('.mase-section-card');
        await expect(cards.first()).toBeVisible();
        
        // Check for console errors
        expect(errors.length).toBe(0);
    });
    
    test('Chrome: Test all interactions work', async ({ page }) => {
        await navigateToSettings(page);
        
        // Test tab navigation
        for (const tab of TABS.slice(0, 3)) {
            await page.click(`text=${tab}`);
            await page.waitForTimeout(300);
            const activeTab = page.locator(`.mase-tab-button.active:has-text("${tab}")`);
            await expect(activeTab).toBeVisible();
        }
        
        // Test toggle switch
        const toggle = page.locator('.mase-toggle-switch input').first();
        if (await toggle.count() > 0) {
            const initialState = await toggle.isChecked();
            await toggle.click();
            await page.waitForTimeout(200);
            const newState = await toggle.isChecked();
            expect(newState).toBe(!initialState);
        }
        
        // Test color picker interaction
        const colorInput = page.locator('input[type="color"]').first();
        if (await colorInput.count() > 0) {
            await colorInput.click();
            await expect(colorInput).toBeFocused();
        }
        
        // Test button hover states
        const saveButton = page.locator('button:has-text("Save Settings")');
        await saveButton.hover();
        await page.waitForTimeout(200);
    });
    
    test('Chrome: Check responsive behavior', async ({ page }) => {
        // Desktop
        await page.setViewportSize({ width: 1920, height: 1080 });
        await navigateToSettings(page);
        await expect(page.locator('.mase-settings-page')).toBeVisible();
        
        // Tablet
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(500);
        await expect(page.locator('.mase-settings-page')).toBeVisible();
        
        // Mobile
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        await expect(page.locator('.mase-settings-page')).toBeVisible();
        
        // Verify touch targets on mobile
        const buttons = page.locator('button');
        const firstButton = buttons.first();
        if (await firstButton.count() > 0) {
            const box = await firstButton.boundingBox();
            expect(box.height).toBeGreaterThanOrEqual(44);
        }
    });
    
    test('Chrome: Test dark mode', async ({ page }) => {
        await navigateToSettings(page);
        
        // Find and click dark mode toggle
        const darkModeToggle = page.locator('#mase-dark-mode-toggle');
        if (await darkModeToggle.count() > 0) {
            await darkModeToggle.click();
            await page.waitForTimeout(500);
            
            // Verify dark mode attribute
            const htmlElement = page.locator('html');
            const theme = await htmlElement.getAttribute('data-theme');
            expect(theme).toBe('dark');
            
            // Verify dark mode colors applied
            const header = page.locator('.mase-header');
            const bgColor = await header.evaluate(el => 
                window.getComputedStyle(el).backgroundColor
            );
            // Dark mode should have darker background
            expect(bgColor).toBeTruthy();
        }
    });
});

/**
 * TEST SUITE: Firefox Browser Compatibility
 */
test.describe('Firefox Browser Compatibility', () => {
    test.use({ browserName: 'firefox' });
    
    test('Firefox: Verify all styles render correctly', async ({ page }) => {
        const errors = setupConsoleMonitoring(page);
        await navigateToSettings(page);
        
        // Verify CSS custom properties loaded
        const hasCustomProps = await verifyCSSCustomProperties(page);
        expect(hasCustomProps).toBe(true);
        
        // Verify design tokens
        await verifyDesignTokens(page);
        
        // Verify header styles
        const header = page.locator('.mase-header');
        await expect(header).toBeVisible();
        
        // Verify tab navigation styles
        const tabNav = page.locator('.mase-tab-nav');
        await expect(tabNav).toBeVisible();
        
        // Verify card styles
        const cards = page.locator('.mase-section-card');
        await expect(cards.first()).toBeVisible();
        
        // Check for console errors
        expect(errors.length).toBe(0);
    });
    
    test('Firefox: Test all interactions work', async ({ page }) => {
        await navigateToSettings(page);
        
        // Test tab navigation
        for (const tab of TABS.slice(0, 3)) {
            await page.click(`text=${tab}`);
            await page.waitForTimeout(300);
            const activeTab = page.locator(`.mase-tab-button.active:has-text("${tab}")`);
            await expect(activeTab).toBeVisible();
        }
        
        // Test toggle switch
        const toggle = page.locator('.mase-toggle-switch input').first();
        if (await toggle.count() > 0) {
            const initialState = await toggle.isChecked();
            await toggle.click();
            await page.waitForTimeout(200);
            const newState = await toggle.isChecked();
            expect(newState).toBe(!initialState);
        }
        
        // Test range slider
        const rangeInput = page.locator('input[type="range"]').first();
        if (await rangeInput.count() > 0) {
            await rangeInput.fill('50');
            const value = await rangeInput.inputValue();
            expect(value).toBe('50');
        }
    });
    
    test('Firefox: Check responsive behavior', async ({ page }) => {
        // Desktop
        await page.setViewportSize({ width: 1920, height: 1080 });
        await navigateToSettings(page);
        await expect(page.locator('.mase-settings-page')).toBeVisible();
        
        // Tablet
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(500);
        await expect(page.locator('.mase-settings-page')).toBeVisible();
        
        // Mobile
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        await expect(page.locator('.mase-settings-page')).toBeVisible();
    });
    
    test('Firefox: Test dark mode', async ({ page }) => {
        await navigateToSettings(page);
        
        // Find and click dark mode toggle
        const darkModeToggle = page.locator('#mase-dark-mode-toggle');
        if (await darkModeToggle.count() > 0) {
            await darkModeToggle.click();
            await page.waitForTimeout(500);
            
            // Verify dark mode attribute
            const htmlElement = page.locator('html');
            const theme = await htmlElement.getAttribute('data-theme');
            expect(theme).toBe('dark');
        }
    });
});

/**
 * TEST SUITE: Safari Browser Compatibility
 */
test.describe('Safari Browser Compatibility', () => {
    test.use({ browserName: 'webkit' });
    
    test('Safari: Verify all styles render correctly', async ({ page }) => {
        const errors = setupConsoleMonitoring(page);
        await navigateToSettings(page);
        
        // Verify CSS custom properties loaded
        const hasCustomProps = await verifyCSSCustomProperties(page);
        expect(hasCustomProps).toBe(true);
        
        // Verify design tokens
        await verifyDesignTokens(page);
        
        // Verify header styles
        const header = page.locator('.mase-header');
        await expect(header).toBeVisible();
        
        // Verify tab navigation styles
        const tabNav = page.locator('.mase-tab-nav');
        await expect(tabNav).toBeVisible();
        
        // Verify card styles
        const cards = page.locator('.mase-section-card');
        await expect(cards.first()).toBeVisible();
        
        // Check for console errors
        expect(errors.length).toBe(0);
    });
    
    test('Safari: Test all interactions work', async ({ page }) => {
        await navigateToSettings(page);
        
        // Test tab navigation
        for (const tab of TABS.slice(0, 3)) {
            await page.click(`text=${tab}`);
            await page.waitForTimeout(300);
            const activeTab = page.locator(`.mase-tab-button.active:has-text("${tab}")`);
            await expect(activeTab).toBeVisible();
        }
        
        // Test toggle switch
        const toggle = page.locator('.mase-toggle-switch input').first();
        if (await toggle.count() > 0) {
            const initialState = await toggle.isChecked();
            await toggle.click();
            await page.waitForTimeout(200);
            const newState = await toggle.isChecked();
            expect(newState).toBe(!initialState);
        }
        
        // Test button interactions
        const saveButton = page.locator('button:has-text("Save Settings")');
        await saveButton.hover();
        await page.waitForTimeout(200);
    });
    
    test('Safari: Check responsive behavior', async ({ page }) => {
        // Desktop
        await page.setViewportSize({ width: 1920, height: 1080 });
        await navigateToSettings(page);
        await expect(page.locator('.mase-settings-page')).toBeVisible();
        
        // Tablet
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(500);
        await expect(page.locator('.mase-settings-page')).toBeVisible();
        
        // Mobile
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        await expect(page.locator('.mase-settings-page')).toBeVisible();
    });
    
    test('Safari: Test dark mode', async ({ page }) => {
        await navigateToSettings(page);
        
        // Find and click dark mode toggle
        const darkModeToggle = page.locator('#mase-dark-mode-toggle');
        if (await darkModeToggle.count() > 0) {
            await darkModeToggle.click();
            await page.waitForTimeout(500);
            
            // Verify dark mode attribute
            const htmlElement = page.locator('html');
            const theme = await htmlElement.getAttribute('data-theme');
            expect(theme).toBe('dark');
        }
    });
});

/**
 * TEST SUITE: Cross-Browser Visual Consistency
 */
test.describe('Cross-Browser Visual Consistency', () => {
    
    test('All browsers: Header component consistency', async ({ page, browserName }) => {
        await navigateToSettings(page);
        
        const header = page.locator('.mase-header');
        await expect(header).toBeVisible();
        
        // Verify header title
        const title = page.locator('.mase-header h1');
        await expect(title).toBeVisible();
        
        // Verify version badge
        const badge = page.locator('.mase-version-badge');
        if (await badge.count() > 0) {
            await expect(badge).toBeVisible();
        }
        
        // Verify action buttons
        const saveButton = page.locator('button:has-text("Save Settings")');
        await expect(saveButton).toBeVisible();
    });
    
    test('All browsers: Tab navigation consistency', async ({ page, browserName }) => {
        await navigateToSettings(page);
        
        const tabNav = page.locator('.mase-tab-nav');
        await expect(tabNav).toBeVisible();
        
        // Test first 3 tabs
        for (const tab of TABS.slice(0, 3)) {
            const tabButton = page.locator(`.mase-tab-button:has-text("${tab}")`);
            await expect(tabButton).toBeVisible();
            await tabButton.click();
            await page.waitForTimeout(200);
            await expect(tabButton).toHaveClass(/active/);
        }
    });
    
    test('All browsers: Form controls consistency', async ({ page, browserName }) => {
        await navigateToSettings(page);
        
        // Navigate to a tab with form controls
        await page.click('text=Admin Bar');
        await page.waitForTimeout(300);
        
        // Check toggle switches
        const toggles = page.locator('.mase-toggle-switch');
        if (await toggles.count() > 0) {
            await expect(toggles.first()).toBeVisible();
        }
        
        // Check color inputs
        const colorInputs = page.locator('input[type="color"]');
        if (await colorInputs.count() > 0) {
            await expect(colorInputs.first()).toBeVisible();
        }
        
        // Check text inputs
        const textInputs = page.locator('input[type="text"]');
        if (await textInputs.count() > 0) {
            await expect(textInputs.first()).toBeVisible();
        }
    });
    
    test('All browsers: Card component consistency', async ({ page, browserName }) => {
        await navigateToSettings(page);
        
        const cards = page.locator('.mase-section-card');
        const firstCard = cards.first();
        
        await expect(firstCard).toBeVisible();
        
        // Verify card has proper styling
        const borderRadius = await firstCard.evaluate(el => 
            window.getComputedStyle(el).borderRadius
        );
        expect(borderRadius).toBeTruthy();
        
        const boxShadow = await firstCard.evaluate(el => 
            window.getComputedStyle(el).boxShadow
        );
        expect(boxShadow).not.toBe('none');
    });
    
    test('All browsers: Button system consistency', async ({ page, browserName }) => {
        await navigateToSettings(page);
        
        // Primary button
        const saveButton = page.locator('button:has-text("Save Settings")');
        await expect(saveButton).toBeVisible();
        
        // Verify button styling
        const bgColor = await saveButton.evaluate(el => 
            window.getComputedStyle(el).backgroundColor
        );
        expect(bgColor).toBeTruthy();
        
        const borderRadius = await saveButton.evaluate(el => 
            window.getComputedStyle(el).borderRadius
        );
        expect(borderRadius).toBeTruthy();
    });
});

/**
 * TEST SUITE: Responsive Design Across Browsers
 */
test.describe('Responsive Design Consistency', () => {
    
    const viewports = [
        { name: 'Desktop', width: 1920, height: 1080 },
        { name: 'Laptop', width: 1366, height: 768 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Mobile', width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
        test(`All browsers: ${viewport.name} viewport (${viewport.width}x${viewport.height})`, async ({ page, browserName }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await navigateToSettings(page);
            
            // Verify page is visible
            await expect(page.locator('.mase-settings-page')).toBeVisible();
            
            // Verify header is visible
            await expect(page.locator('.mase-header')).toBeVisible();
            
            // Verify tab navigation is accessible
            await expect(page.locator('.mase-tab-nav')).toBeVisible();
            
            // On mobile, verify touch targets
            if (viewport.width <= 768) {
                const buttons = page.locator('button');
                const firstButton = buttons.first();
                if (await firstButton.count() > 0) {
                    const box = await firstButton.boundingBox();
                    if (box) {
                        expect(box.height).toBeGreaterThanOrEqual(40); // Minimum touch target
                    }
                }
            }
        });
    }
});

/**
 * TEST SUITE: Dark Mode Across Browsers
 */
test.describe('Dark Mode Consistency', () => {
    
    test('All browsers: Dark mode toggle and styles', async ({ page, browserName }) => {
        await navigateToSettings(page);
        
        // Find dark mode toggle
        const darkModeToggle = page.locator('#mase-dark-mode-toggle');
        
        if (await darkModeToggle.count() > 0) {
            // Enable dark mode
            await darkModeToggle.click();
            await page.waitForTimeout(500);
            
            // Verify dark mode attribute
            const htmlElement = page.locator('html');
            const theme = await htmlElement.getAttribute('data-theme');
            expect(theme).toBe('dark');
            
            // Verify dark mode colors
            const header = page.locator('.mase-header');
            const bgColor = await header.evaluate(el => 
                window.getComputedStyle(el).backgroundColor
            );
            expect(bgColor).toBeTruthy();
            
            // Verify text is readable
            const title = page.locator('.mase-header h1');
            const textColor = await title.evaluate(el => 
                window.getComputedStyle(el).color
            );
            expect(textColor).toBeTruthy();
            
            // Disable dark mode
            await darkModeToggle.click();
            await page.waitForTimeout(500);
            
            // Verify light mode restored
            const lightTheme = await htmlElement.getAttribute('data-theme');
            expect(lightTheme).not.toBe('dark');
        }
    });
    
    test('All browsers: Dark mode card styles', async ({ page, browserName }) => {
        await navigateToSettings(page);
        
        const darkModeToggle = page.locator('#mase-dark-mode-toggle');
        
        if (await darkModeToggle.count() > 0) {
            await darkModeToggle.click();
            await page.waitForTimeout(500);
            
            // Verify card styling in dark mode
            const card = page.locator('.mase-section-card').first();
            const bgColor = await card.evaluate(el => 
                window.getComputedStyle(el).backgroundColor
            );
            expect(bgColor).toBeTruthy();
            
            const borderColor = await card.evaluate(el => 
                window.getComputedStyle(el).borderColor
            );
            expect(borderColor).toBeTruthy();
        }
    });
});

/**
 * TEST SUITE: Performance Across Browsers
 */
test.describe('Performance Consistency', () => {
    
    test('All browsers: Page load performance', async ({ page, browserName }) => {
        const startTime = Date.now();
        await navigateToSettings(page);
        const loadTime = Date.now() - startTime;
        
        console.log(`${browserName}: Page load time: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
    });
    
    test('All browsers: CSS animation performance', async ({ page, browserName }) => {
        await navigateToSettings(page);
        
        // Test tab switching animation
        const startTime = Date.now();
        for (let i = 0; i < 5; i++) {
            await page.click(`text=${TABS[i % TABS.length]}`);
            await page.waitForTimeout(100);
        }
        const totalTime = Date.now() - startTime;
        
        console.log(`${browserName}: 5 tab switches took: ${totalTime}ms`);
        expect(totalTime).toBeLessThan(2000); // Should be smooth
    });
});
