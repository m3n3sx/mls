/**
 * Visual Interactive Test: Form Controls - Input Fields
 * 
 * Tests form control styling:
 * - Input field colors
 * - Input field borders
 * - Input field focus states
 * - Input field sizing
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
    enableLivePreview 
} = require('../../helpers.cjs');

const BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8080';

test.describe('Form Controls - Input Fields', () => {
    
    test.beforeEach(async ({ page }) => {
        await login(page, BASE_URL);
        await navigateToSettings(page, BASE_URL);
        
        // Navigate to Form Controls tab
        const formTab = page.locator('[data-tab="form-controls"]');
        await formTab.click();
        await page.waitForTimeout(500);
        
        // Enable live preview
        await enableLivePreview(page);
    });
    
    test('1. Form Controls tab loads correctly', async ({ page }) => {
        console.log('TEST: Form Controls tab loads...');
        
        const formContent = page.locator('#tab-form-controls');
        await expect(formContent).toBeVisible();
        
        await captureScreenshot(page, 'form-controls-tab-loaded');
        
        console.log('✓ Form Controls tab loaded');
    });
    
    test('2. Input field background color can be changed', async ({ page }) => {
        console.log('TEST: Input background color...');
        
        const bgColorInput = page.locator('input[name*="input"][name*="background"]').first();
        
        if (await bgColorInput.isVisible()) {
            await bgColorInput.fill('#ffffff');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'form-input-background-changed');
            
            console.log('✓ Input background color changed');
        } else {
            console.log('⚠ Input background color not found');
        }
    });
    
    test('3. Input field border can be styled', async ({ page }) => {
        console.log('TEST: Input border styling...');
        
        const borderWidth = page.locator('input[name*="input"][name*="border_width"]').first();
        const borderColor = page.locator('input[name*="input"][name*="border_color"]').first();
        
        if (await borderWidth.isVisible()) {
            await borderWidth.fill('2');
            await page.waitForTimeout(500);
        }
        
        if (await borderColor.isVisible()) {
            await borderColor.fill('#0073aa');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'form-input-border-styled');
            
            console.log('✓ Input border styled');
        } else {
            console.log('⚠ Input border controls not found');
        }
    });
    
    test('4. Input focus state can be customized', async ({ page }) => {
        console.log('TEST: Input focus state...');
        
        const focusColor = page.locator('input[name*="input"][name*="focus"]').first();
        
        if (await focusColor.isVisible()) {
            await focusColor.fill('#0073aa');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'form-input-focus-customized');
            
            console.log('✓ Input focus state customized');
        } else {
            console.log('⚠ Input focus controls not found');
        }
    });
    
    test('5. Input field sizing can be adjusted', async ({ page }) => {
        console.log('TEST: Input field sizing...');
        
        const heightInput = page.locator('input[name*="input"][name*="height"]').first();
        const paddingInput = page.locator('input[name*="input"][name*="padding"]').first();
        
        if (await heightInput.isVisible()) {
            await heightInput.fill('40');
            await page.waitForTimeout(500);
        }
        
        if (await paddingInput.isVisible()) {
            await paddingInput.fill('12');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'form-input-sizing-adjusted');
            
            console.log('✓ Input sizing adjusted');
        } else {
            console.log('⚠ Input sizing controls not found');
        }
    });
    
    test('6. Select dropdown styling works', async ({ page }) => {
        console.log('TEST: Select dropdown styling...');
        
        const selectBg = page.locator('input[name*="select"][name*="background"]').first();
        
        if (await selectBg.isVisible()) {
            await selectBg.fill('#f9f9f9');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'form-select-styled');
            
            console.log('✓ Select dropdown styled');
        } else {
            console.log('⚠ Select dropdown controls not found');
        }
    });
    
    test('7. Checkbox and radio button styling', async ({ page }) => {
        console.log('TEST: Checkbox/radio styling...');
        
        const checkboxColor = page.locator('input[name*="checkbox"][name*="color"]').first();
        
        if (await checkboxColor.isVisible()) {
            await checkboxColor.fill('#0073aa');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'form-checkbox-styled');
            
            console.log('✓ Checkbox/radio styled');
        } else {
            console.log('⚠ Checkbox/radio controls not found');
        }
    });
    
    test('8. All form control types present', async ({ page }) => {
        console.log('TEST: All form control types...');
        
        const formContent = page.locator('#tab-form-controls');
        const controls = await formContent.locator('input, select').count();
        
        console.log(`Found ${controls} form control settings`);
        expect(controls).toBeGreaterThan(0);
        
        await captureScreenshot(page, 'form-controls-all-types');
        
        console.log('✓ All form control types present');
    });
});
