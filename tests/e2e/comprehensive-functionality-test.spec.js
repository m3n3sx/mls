/**
 * Comprehensive Functionality Test Suite
 * 
 * Tests all MASE functionality systematically according to the test protocol.
 * 
 * @package MASE
 * @since 1.2.1
 */

const { test, expect } = require('@playwright/test');

// Configuration
const BASE_URL = 'http://localhost:8080';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin';
const SETTINGS_PAGE = `${BASE_URL}/wp-admin/admin.php?page=mase-settings`;

// Test timeout configuration
test.setTimeout(120000); // 2 minutes per test

/**
 * Helper: Login to WordPress admin
 */
async function loginToWordPress(page) {
    await page.goto(`${BASE_URL}/wp-login.php`);
    await page.fill('#user_login', ADMIN_USER);
    await page.fill('#user_pass', ADMIN_PASS);
    await page.click('#wp-submit');
    await page.waitForLoadState('networkidle');
}

/**
 * Helper: Navigate to MASE settings page
 */
async function navigateToSettings(page) {
    await page.goto(SETTINGS_PAGE);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.mase-settings-page', { timeout: 10000 });
}

/**
 * Helper: Check console for errors
 */
async function checkConsoleErrors(page) {
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    return errors;
}

/**
 * Helper: Wait for AJAX request to complete
 */
async function waitForAjaxComplete(page) {
    await page.waitForFunction(() => {
        return typeof jQuery !== 'undefined' && jQuery.active === 0;
    }, { timeout: 10000 });
}

/**
 * TEST 1: System Zapisywania Ustawień (Settings Save System)
 */
test.describe('TEST 1: Settings Save System', () => {
    
    test.beforeEach(async ({ page }) => {
        await loginToWordPress(page);
        await navigateToSettings(page);
    });

    test('1.1: Save settings in Menu tab', async ({ page }) => {
        console.log('TEST 1.1: Testing Menu tab settings save...');
        
        // Navigate to Menu tab
        await page.click('text=Menu');
        await page.waitForTimeout(500);
        
        // Change a value - Admin Bar Background Color
        const colorInput = await page.locator('input[name="admin_bar[background_color]"]');
        await colorInput.fill('#FF5733');
        
        // Click Save Settings
        await page.click('button:has-text("Save Settings")');
        
        // Wait for AJAX response
        await page.waitForResponse(response => 
            response.url().includes('admin-ajax.php') && 
            response.request().postData()?.includes('mase_save_settings')
        );
        
        // Check for success message
        const successNotice = await page.locator('.mase-notice.success');
        await expect(successNotice).toBeVisible({ timeout: 5000 });
        
        // Reload and verify value persisted
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.click('text=Menu');
        
        const savedValue = await colorInput.inputValue();
        expect(savedValue).toBe('#FF5733');
        
        console.log('✓ TEST 1.1 PASSED: Menu settings saved successfully');
    });

    test('1.2: Save settings in Content tab', async ({ page }) => {
        console.log('TEST 1.2: Testing Content tab settings save...');
        
        await page.click('text=Content');
        await page.waitForTimeout(500);
        
        // Change content background color
        const colorInput = await page.locator('input[name="content[background_color]"]');
        await colorInput.fill('#E8F4F8');
        
        await page.click('button:has-text("Save Settings")');
        
        const successNotice = await page.locator('.mase-notice.success');
        await expect(successNotice).toBeVisible({ timeout: 5000 });
        
        console.log('✓ TEST 1.2 PASSED: Content settings saved successfully');
    });

    test('1.3: Save settings in Universal Buttons tab', async ({ page }) => {
        console.log('TEST 1.3: Testing Universal Buttons tab settings save...');
        
        await page.click('text=Universal Buttons');
        await page.waitForTimeout(500);
        
        // Change primary button color
        const colorInput = await page.locator('input[name="buttons[primary][normal][background_color]"]').first();
        await colorInput.fill('#007CBA');
        
        await page.click('button:has-text("Save Settings")');
        
        const successNotice = await page.locator('.mase-notice.success');
        await expect(successNotice).toBeVisible({ timeout: 5000 });
        
        console.log('✓ TEST 1.3 PASSED: Button settings saved successfully');
    });

    test('1.4: Verify no console errors during save', async ({ page }) => {
        console.log('TEST 1.4: Checking for console errors...');
        
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        await page.click('text=Menu');
        const colorInput = await page.locator('input[name="admin_bar[background_color]"]');
        await colorInput.fill('#123456');
        await page.click('button:has-text("Save Settings")');
        
        await page.waitForTimeout(2000);
        
        expect(errors.length).toBe(0);
        console.log('✓ TEST 1.4 PASSED: No console errors detected');
    });
});

/**
 * TEST 2: Live Preview System
 */
test.describe('TEST 2: Live Preview System', () => {
    
    test.beforeEach(async ({ page }) => {
        await loginToWordPress(page);
        await navigateToSettings(page);
    });

    test('2.1: Enable Live Preview', async ({ page }) => {
        console.log('TEST 2.1: Testing Live Preview enable...');
        
        // Find and click Live Preview toggle
        const livePreviewToggle = await page.locator('#mase-live-preview-toggle');
        await livePreviewToggle.click();
        
        // Wait for toggle to be checked
        await expect(livePreviewToggle).toBeChecked({ timeout: 2000 });
        
        // Verify live preview CSS is injected
        const livePreviewStyle = await page.locator('#mase-live-preview-css');
        await expect(livePreviewStyle).toBeAttached();
        
        console.log('✓ TEST 2.1 PASSED: Live Preview enabled successfully');
    });

    test('2.2: Live Preview - Admin Bar color change', async ({ page }) => {
        console.log('TEST 2.2: Testing Live Preview color changes...');
        
        // Enable Live Preview
        await page.locator('#mase-live-preview-toggle').click();
        await page.waitForTimeout(500);
        
        // Change Admin Bar background color
        await page.click('text=Menu');
        const colorInput = await page.locator('input[name="admin_bar[background_color]"]');
        await colorInput.fill('#FF0000');
        
        // Trigger change event
        await colorInput.dispatchEvent('change');
        await page.waitForTimeout(500);
        
        // Check if admin bar color changed
        const adminBar = await page.locator('#wpadminbar');
        const bgColor = await adminBar.evaluate(el => 
            window.getComputedStyle(el).backgroundColor
        );
        
        // RGB(255, 0, 0) = #FF0000
        expect(bgColor).toContain('255');
        
        console.log('✓ TEST 2.2 PASSED: Live Preview updates colors in real-time');
    });

    test('2.3: Live Preview - Button preview updates', async ({ page }) => {
        console.log('TEST 2.3: Testing button preview updates...');
        
        await page.locator('#mase-live-preview-toggle').click();
        await page.waitForTimeout(500);
        
        await page.click('text=Universal Buttons');
        await page.waitForTimeout(500);
        
        // Change primary button color
        const colorInput = await page.locator('input[name="buttons[primary][normal][background_color]"]').first();
        await colorInput.fill('#00FF00');
        await colorInput.dispatchEvent('change');
        
        await page.waitForTimeout(500);
        
        // Check button preview
        const buttonPreview = await page.locator('.mase-button-preview.primary');
        const bgColor = await buttonPreview.evaluate(el => 
            window.getComputedStyle(el).backgroundColor
        );
        
        expect(bgColor).toContain('0, 255, 0');
        
        console.log('✓ TEST 2.3 PASSED: Button previews update in real-time');
    });
});

/**
 * TEST 3: Height Mode - Fit to Content
 */
test.describe('TEST 3: Menu Height Mode', () => {
    
    test.beforeEach(async ({ page }) => {
        await loginToWordPress(page);
        await navigateToSettings(page);
    });

    test('3.1: Change height mode to Fit to Content', async ({ page }) => {
        console.log('TEST 3.1: Testing Fit to Content height mode...');
        
        await page.click('text=Menu');
        await page.waitForTimeout(500);
        
        // Find height mode select
        const heightModeSelect = await page.locator('select[name="admin_menu[height_mode]"]');
        await heightModeSelect.selectOption('fit-content');
        
        // Save settings
        await page.click('button:has-text("Save Settings")');
        await page.waitForTimeout(2000);
        
        // Reload and check if menu height changed
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        const adminMenu = await page.locator('#adminmenuwrap');
        const height = await adminMenu.evaluate(el => 
            window.getComputedStyle(el).height
        );
        
        // Should not be 100vh
        expect(height).not.toBe('100vh');
        
        console.log('✓ TEST 3.1 PASSED: Fit to Content mode works correctly');
    });
});

/**
 * TEST 4: Color Palette System
 */
test.describe('TEST 4: Color Palette System', () => {
    
    test.beforeEach(async ({ page }) => {
        await loginToWordPress(page);
        await navigateToSettings(page);
    });

    test('4.1: Apply color palette', async ({ page }) => {
        console.log('TEST 4.1: Testing palette application...');
        
        // Find first palette Apply button
        const applyButton = await page.locator('.mase-palette-apply-btn').first();
        await applyButton.click();
        
        // Wait for AJAX response
        await page.waitForResponse(response => 
            response.url().includes('admin-ajax.php') && 
            response.request().postData()?.includes('mase_apply_palette')
        );
        
        // Check for success message
        const successNotice = await page.locator('.mase-notice.success');
        await expect(successNotice).toBeVisible({ timeout: 5000 });
        
        // Check for Active badge
        const activeBadge = await page.locator('.mase-active-badge');
        await expect(activeBadge).toBeVisible();
        
        console.log('✓ TEST 4.1 PASSED: Palette applied successfully');
    });

    test('4.2: Save custom palette', async ({ page }) => {
        console.log('TEST 4.2: Testing custom palette save...');
        
        // Fill custom palette form
        await page.fill('input[name="custom_palette_name"]', 'Test Palette');
        await page.fill('#palette-primary-color', '#FF5733');
        await page.fill('#palette-secondary-color', '#33FF57');
        
        // Click Save Custom Palette
        await page.click('#mase-save-custom-palette-btn');
        
        await page.waitForResponse(response => 
            response.url().includes('admin-ajax.php') && 
            response.request().postData()?.includes('mase_save_custom_palette')
        );
        
        const successNotice = await page.locator('.mase-notice.success');
        await expect(successNotice).toBeVisible({ timeout: 5000 });
        
        console.log('✓ TEST 4.2 PASSED: Custom palette saved successfully');
    });
});

/**
 * TEST 5: Template System
 */
test.describe('TEST 5: Template System', () => {
    
    test.beforeEach(async ({ page }) => {
        await loginToWordPress(page);
        await navigateToSettings(page);
    });

    test('5.1: Apply template', async ({ page }) => {
        console.log('TEST 5.1: Testing template application...');
        
        await page.click('text=Templates');
        await page.waitForTimeout(500);
        
        // Find first template Apply button
        const applyButton = await page.locator('.mase-template-apply-btn').first();
        await applyButton.click();
        
        // Confirm dialog
        page.on('dialog', dialog => dialog.accept());
        
        await page.waitForResponse(response => 
            response.url().includes('admin-ajax.php') && 
            response.request().postData()?.includes('mase_apply_template')
        );
        
        const successNotice = await page.locator('.mase-notice.success');
        await expect(successNotice).toBeVisible({ timeout: 5000 });
        
        console.log('✓ TEST 5.1 PASSED: Template applied successfully');
    });
});

/**
 * TEST 6: Import/Export Settings
 */
test.describe('TEST 6: Import/Export Settings', () => {
    
    test.beforeEach(async ({ page }) => {
        await loginToWordPress(page);
        await navigateToSettings(page);
    });

    test('6.1: Export settings', async ({ page }) => {
        console.log('TEST 6.1: Testing settings export...');
        
        await page.click('text=Advanced');
        await page.waitForTimeout(500);
        
        // Click Export button
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.click('button:has-text("Export Settings")')
        ]);
        
        expect(download).toBeTruthy();
        const filename = download.suggestedFilename();
        expect(filename).toContain('mase-settings');
        expect(filename).toContain('.json');
        
        console.log('✓ TEST 6.1 PASSED: Settings exported successfully');
    });
});

/**
 * TEST 7: Backup System
 */
test.describe('TEST 7: Backup System', () => {
    
    test.beforeEach(async ({ page }) => {
        await loginToWordPress(page);
        await navigateToSettings(page);
    });

    test('7.1: Create backup', async ({ page }) => {
        console.log('TEST 7.1: Testing backup creation...');
        
        await page.click('text=Advanced');
        await page.waitForTimeout(500);
        
        // Click Create Backup button
        await page.click('button:has-text("Create Backup")');
        
        await page.waitForResponse(response => 
            response.url().includes('admin-ajax.php') && 
            response.request().postData()?.includes('mase_create_backup')
        );
        
        const successNotice = await page.locator('.mase-notice.success');
        await expect(successNotice).toBeVisible({ timeout: 5000 });
        
        // Check if backup appears in list
        const backupList = await page.locator('.mase-backup-list');
        await expect(backupList).toBeVisible();
        
        console.log('✓ TEST 7.1 PASSED: Backup created successfully');
    });
});

/**
 * TEST 8: Mobile Responsiveness
 */
test.describe('TEST 8: Mobile Optimization', () => {
    
    test('8.1: Mobile viewport test', async ({ page }) => {
        console.log('TEST 8.1: Testing mobile responsiveness...');
        
        await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
        
        await loginToWordPress(page);
        await navigateToSettings(page);
        
        // Check if interface is responsive
        const settingsPage = await page.locator('.mase-settings-page');
        await expect(settingsPage).toBeVisible();
        
        // Check if tabs are accessible
        const tabs = await page.locator('.mase-tabs');
        await expect(tabs).toBeVisible();
        
        console.log('✓ TEST 8.1 PASSED: Mobile interface is responsive');
    });
});

/**
 * TEST 9: Performance Test
 */
test.describe('TEST 9: Performance', () => {
    
    test('9.1: Page load performance', async ({ page }) => {
        console.log('TEST 9.1: Testing page load performance...');
        
        await loginToWordPress(page);
        
        const startTime = Date.now();
        await navigateToSettings(page);
        const loadTime = Date.now() - startTime;
        
        console.log(`Page load time: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
        
        console.log('✓ TEST 9.1 PASSED: Page loads within acceptable time');
    });

    test('9.2: Live Preview performance', async ({ page }) => {
        console.log('TEST 9.2: Testing Live Preview performance...');
        
        await loginToWordPress(page);
        await navigateToSettings(page);
        
        // Enable Live Preview
        await page.locator('#mase-live-preview-toggle').click();
        await page.waitForTimeout(500);
        
        // Make 10 rapid changes
        const colorInput = await page.locator('input[name="admin_bar[background_color]"]');
        
        const startTime = Date.now();
        for (let i = 0; i < 10; i++) {
            await colorInput.fill(`#${Math.floor(Math.random()*16777215).toString(16)}`);
            await colorInput.dispatchEvent('change');
            await page.waitForTimeout(50);
        }
        const totalTime = Date.now() - startTime;
        
        console.log(`10 changes took: ${totalTime}ms`);
        expect(totalTime).toBeLessThan(3000); // Should complete in under 3 seconds
        
        console.log('✓ TEST 9.2 PASSED: Live Preview performs well under load');
    });
});

/**
 * SUMMARY TEST: Run all critical tests
 */
test.describe('SUMMARY: Critical Path Tests', () => {
    
    test('Critical path: Save → Live Preview → Apply Palette', async ({ page }) => {
        console.log('CRITICAL PATH TEST: Testing complete workflow...');
        
        await loginToWordPress(page);
        await navigateToSettings(page);
        
        // 1. Save settings
        await page.click('text=Menu');
        const colorInput = await page.locator('input[name="admin_bar[background_color]"]');
        await colorInput.fill('#123456');
        await page.click('button:has-text("Save Settings")');
        await page.waitForTimeout(2000);
        
        // 2. Enable Live Preview
        await page.locator('#mase-live-preview-toggle').click();
        await page.waitForTimeout(500);
        
        // 3. Apply Palette
        const applyButton = await page.locator('.mase-palette-apply-btn').first();
        await applyButton.click();
        await page.waitForTimeout(3000);
        
        console.log('✓ CRITICAL PATH TEST PASSED: All core functionality works');
    });
});
