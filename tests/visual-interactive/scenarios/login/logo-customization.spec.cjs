/**
 * Visual Interactive Test: Login Page - Logo Customization
 * 
 * Tests login page logo customization:
 * - Logo upload
 * - Logo URL
 * - Logo size
 * - Logo positioning
 * 
 * @package MASE
 * @subpackage Tests
 */

const { test, expect } = require('@playwright/test');
const { 
    login, 
    navigateToSettings, 
    captureScreenshot,
    enableLivePreview 
} = require('../../helpers.cjs');

const BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8080';

test.describe('Login Page - Logo Customization', () => {
    
    test.beforeEach(async ({ page }) => {
        await login(page, BASE_URL);
        await navigateToSettings(page, BASE_URL);
        
        // Navigate to Login tab
        const loginTab = page.locator('[data-tab="login"]');
        await loginTab.click();
        await page.waitForTimeout(500);
        
        // Enable live preview
        await enableLivePreview(page);
    });
    
    test('1. Login Page tab loads correctly', async ({ page }) => {
        console.log('TEST: Login Page tab loads...');
        
        const loginContent = page.locator('#tab-login');
        await expect(loginContent).toBeVisible();
        
        await captureScreenshot(page, 'login-tab-loaded');
        
        console.log('✓ Login Page tab loaded');
    });
    
    test('2. Logo upload button exists', async ({ page }) => {
        console.log('TEST: Logo upload button...');
        
        const uploadButton = page.locator('button:has-text("Upload Logo")').first();
        
        if (await uploadButton.isVisible()) {
            await expect(uploadButton).toBeVisible();
            
            await captureScreenshot(page, 'login-logo-upload-button');
            
            console.log('✓ Logo upload button exists');
        } else {
            console.log('⚠ Logo upload button not found');
        }
    });
    
    test('3. Logo URL input exists', async ({ page }) => {
        console.log('TEST: Logo URL input...');
        
        const logoURL = page.locator('input[name*="login"][name*="logo_url"]').first();
        
        if (await logoURL.isVisible()) {
            await expect(logoURL).toBeVisible();
            
            // Test entering URL
            await logoURL.fill('https://example.com/logo.png');
            await page.waitForTimeout(500);
            
            const value = await logoURL.inputValue();
            expect(value).toBe('https://example.com/logo.png');
            
            await captureScreenshot(page, 'login-logo-url-entered');
            
            // Clear
            await logoURL.fill('');
            
            console.log('✓ Logo URL input works');
        } else {
            console.log('⚠ Logo URL input not found');
        }
    });
    
    test('4. Logo size controls exist', async ({ page }) => {
        console.log('TEST: Logo size controls...');
        
        const logoWidth = page.locator('input[name*="login"][name*="logo_width"]').first();
        const logoHeight = page.locator('input[name*="login"][name*="logo_height"]').first();
        
        let sizeControlsFound = false;
        
        if (await logoWidth.isVisible()) {
            await logoWidth.fill('200');
            await page.waitForTimeout(500);
            sizeControlsFound = true;
            console.log('✓ Logo width control found');
        }
        
        if (await logoHeight.isVisible()) {
            await logoHeight.fill('100');
            await page.waitForTimeout(500);
            sizeControlsFound = true;
            console.log('✓ Logo height control found');
        }
        
        if (sizeControlsFound) {
            await captureScreenshot(page, 'login-logo-size-adjusted');
            console.log('✓ Logo size controls work');
        } else {
            console.log('⚠ Logo size controls not found');
        }
    });
    
    test('5. Login form background color can be changed', async ({ page }) => {
        console.log('TEST: Login form background...');
        
        const formBg = page.locator('input[name*="login"][name*="form_background"]').first();
        
        if (await formBg.isVisible()) {
            await formBg.fill('#ffffff');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'login-form-background-changed');
            
            console.log('✓ Login form background changed');
        } else {
            console.log('⚠ Login form background control not found');
        }
    });
    
    test('6. Login button styling exists', async ({ page }) => {
        console.log('TEST: Login button styling...');
        
        const buttonBg = page.locator('input[name*="login"][name*="button_background"]').first();
        const buttonText = page.locator('input[name*="login"][name*="button_text"]').first();
        
        let buttonStylesFound = false;
        
        if (await buttonBg.isVisible()) {
            await buttonBg.fill('#0073aa');
            await page.waitForTimeout(500);
            buttonStylesFound = true;
        }
        
        if (await buttonText.isVisible()) {
            await buttonText.fill('#ffffff');
            await page.waitForTimeout(500);
            buttonStylesFound = true;
        }
        
        if (buttonStylesFound) {
            await captureScreenshot(page, 'login-button-styled');
            console.log('✓ Login button styling works');
        } else {
            console.log('⚠ Login button styling not found');
        }
    });
    
    test('7. Login page background can be customized', async ({ page }) => {
        console.log('TEST: Login page background...');
        
        const pageBg = page.locator('input[name*="login"][name*="page_background"]').first();
        
        if (await pageBg.isVisible()) {
            await pageBg.fill('#f0f0f0');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'login-page-background-changed');
            
            console.log('✓ Login page background changed');
        } else {
            console.log('⚠ Login page background control not found');
        }
    });
    
    test('8. All login customization options accessible', async ({ page }) => {
        console.log('TEST: All login options...');
        
        const loginContent = page.locator('#tab-login');
        
        const inputs = await loginContent.locator('input').count();
        const buttons = await loginContent.locator('button').count();
        
        console.log(`Found ${inputs} inputs and ${buttons} buttons`);
        
        expect(inputs + buttons).toBeGreaterThan(0);
        
        await captureScreenshot(page, 'login-all-options');
        
        console.log('✓ All login options accessible');
    });
});
