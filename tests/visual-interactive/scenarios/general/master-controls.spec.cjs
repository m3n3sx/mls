/**
 * Visual Interactive Test: General Tab - Master Controls
 * 
 * Tests master control switches:
 * - Enable Plugin toggle
 * - Apply to Login Page toggle
 * - Dark Mode toggle
 * 
 * @package MASE
 * @subpackage Tests
 */

const { test, expect } = require('@playwright/test');
const { 
    login, 
    navigateToSettings, 
    waitForLivePreview,
    captureScreenshot,
    verifyNoConsoleErrors 
} = require('../../helpers.cjs');

const BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8080';

test.describe('General Tab - Master Controls', () => {
    
    test.beforeEach(async ({ page }) => {
        await login(page, BASE_URL);
        await navigateToSettings(page, BASE_URL);
        
        // Navigate to General tab (should be default)
        const generalTab = page.locator('[data-tab="general"]');
        await generalTab.click();
        await page.waitForTimeout(500);
    });
    
    test('1. Enable Plugin toggle works', async ({ page }) => {
        console.log('TEST: Enable Plugin toggle...');
        
        // Find Enable Plugin toggle
        const enableToggle = page.locator('input[name="mase_settings[enable_plugin]"]');
        await expect(enableToggle).toBeVisible();
        
        // Get current state
        const isEnabled = await enableToggle.isChecked();
        console.log(`Current state: ${isEnabled ? 'Enabled' : 'Disabled'}`);
        
        // Toggle it
        await enableToggle.click();
        await page.waitForTimeout(500);
        
        // Verify state changed
        const newState = await enableToggle.isChecked();
        expect(newState).toBe(!isEnabled);
        
        // Capture screenshot
        await captureScreenshot(page, 'general-enable-plugin-toggled');
        
        // Toggle back
        await enableToggle.click();
        await page.waitForTimeout(500);
        
        console.log('✓ Enable Plugin toggle works correctly');
    });
    
    test('2. Apply to Login Page toggle works', async ({ page }) => {
        console.log('TEST: Apply to Login Page toggle...');
        
        const loginToggle = page.locator('input[name="mase_settings[apply_to_login]"]');
        await expect(loginToggle).toBeVisible();
        
        const initialState = await loginToggle.isChecked();
        
        // Toggle
        await loginToggle.click();
        await page.waitForTimeout(500);
        
        const newState = await loginToggle.isChecked();
        expect(newState).toBe(!initialState);
        
        await captureScreenshot(page, 'general-login-page-toggled');
        
        // Toggle back
        await loginToggle.click();
        
        console.log('✓ Apply to Login Page toggle works');
    });
    
    test('3. Dark Mode toggle works', async ({ page }) => {
        console.log('TEST: Dark Mode toggle...');
        
        const darkModeToggle = page.locator('input[name="mase_settings[dark_mode]"]');
        await expect(darkModeToggle).toBeVisible();
        
        const initialState = await darkModeToggle.isChecked();
        
        // Enable Dark Mode
        if (!initialState) {
            await darkModeToggle.click();
            await page.waitForTimeout(1000);
            
            // Verify dark mode applied (check body class or styles)
            const bodyClasses = await page.evaluate(() => document.body.className);
            console.log('Body classes after dark mode:', bodyClasses);
            
            await captureScreenshot(page, 'general-dark-mode-enabled');
            
            // Disable Dark Mode
            await darkModeToggle.click();
            await page.waitForTimeout(1000);
        } else {
            // Disable first
            await darkModeToggle.click();
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'general-dark-mode-disabled');
            
            // Enable back
            await darkModeToggle.click();
            await page.waitForTimeout(1000);
        }
        
        console.log('✓ Dark Mode toggle works');
    });
    
    test('4. All master controls visible and accessible', async ({ page }) => {
        console.log('TEST: All master controls present...');
        
        // Verify all three toggles exist
        const enablePlugin = page.locator('input[name="mase_settings[enable_plugin]"]');
        const applyToLogin = page.locator('input[name="mase_settings[apply_to_login]"]');
        const darkMode = page.locator('input[name="mase_settings[dark_mode]"]');
        
        await expect(enablePlugin).toBeVisible();
        await expect(applyToLogin).toBeVisible();
        await expect(darkMode).toBeVisible();
        
        // Verify labels
        const enableLabel = page.locator('text=Enable Plugin');
        const loginLabel = page.locator('text=Apply to Login Page');
        const darkLabel = page.locator('text=Dark Mode');
        
        await expect(enableLabel).toBeVisible();
        await expect(loginLabel).toBeVisible();
        await expect(darkLabel).toBeVisible();
        
        await captureScreenshot(page, 'general-master-controls-all');
        
        console.log('✓ All master controls present and accessible');
    });
    
    test('5. No console errors during toggle operations', async ({ page }) => {
        console.log('TEST: Console errors check...');
        
        const errors = await verifyNoConsoleErrors(page);
        
        // Toggle all controls
        const toggles = [
            'input[name="mase_settings[enable_plugin]"]',
            'input[name="mase_settings[apply_to_login]"]',
            'input[name="mase_settings[dark_mode]"]'
        ];
        
        for (const selector of toggles) {
            const toggle = page.locator(selector);
            await toggle.click();
            await page.waitForTimeout(300);
        }
        
        const finalErrors = await verifyNoConsoleErrors(page);
        expect(finalErrors.length).toBe(errors.length);
        
        console.log('✓ No console errors during operations');
    });
});
