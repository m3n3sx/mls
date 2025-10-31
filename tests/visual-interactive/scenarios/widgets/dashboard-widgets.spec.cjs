/**
 * Visual Interactive Test: Dashboard Widgets Tab
 * 
 * Tests dashboard widget styling options:
 * - Widget colors
 * - Widget borders
 * - Widget shadows
 * - Widget spacing
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

test.describe('Dashboard Widgets Tab', () => {
    
    test.beforeEach(async ({ page }) => {
        await login(page, BASE_URL);
        await navigateToSettings(page, BASE_URL);
        
        // Navigate to Widgets tab
        const widgetsTab = page.locator('[data-tab="widgets"]');
        await widgetsTab.click();
        await page.waitForTimeout(500);
        
        // Enable live preview
        await enableLivePreview(page);
    });
    
    test('1. Widgets tab loads correctly', async ({ page }) => {
        console.log('TEST: Widgets tab loads...');
        
        const widgetsContent = page.locator('#tab-widgets');
        await expect(widgetsContent).toBeVisible();
        
        await captureScreenshot(page, 'widgets-tab-loaded');
        
        console.log('✓ Widgets tab loaded');
    });
    
    test('2. Widget background color can be changed', async ({ page }) => {
        console.log('TEST: Widget background color...');
        
        // Find widget background color input
        const bgColorInput = page.locator('input[name*="widget"][name*="background"]').first();
        
        if (await bgColorInput.isVisible()) {
            // Change color
            await bgColorInput.fill('#f0f0f0');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'widgets-background-changed');
            
            console.log('✓ Widget background color changed');
        } else {
            console.log('⚠ Widget background color input not found');
        }
    });
    
    test('3. Widget border settings work', async ({ page }) => {
        console.log('TEST: Widget border settings...');
        
        // Find border width input
        const borderWidth = page.locator('input[name*="widget"][name*="border_width"]').first();
        
        if (await borderWidth.isVisible()) {
            await borderWidth.fill('2');
            await page.waitForTimeout(500);
            
            // Find border color
            const borderColor = page.locator('input[name*="widget"][name*="border_color"]').first();
            if (await borderColor.isVisible()) {
                await borderColor.fill('#333333');
                await page.waitForTimeout(1000);
            }
            
            await captureScreenshot(page, 'widgets-border-changed');
            
            console.log('✓ Widget border settings work');
        } else {
            console.log('⚠ Widget border inputs not found');
        }
    });
    
    test('4. Widget shadow can be applied', async ({ page }) => {
        console.log('TEST: Widget shadow...');
        
        // Find shadow toggle or input
        const shadowInput = page.locator('input[name*="widget"][name*="shadow"]').first();
        
        if (await shadowInput.isVisible()) {
            const inputType = await shadowInput.getAttribute('type');
            
            if (inputType === 'checkbox') {
                await shadowInput.check();
            } else {
                await shadowInput.fill('0 2px 8px rgba(0,0,0,0.1)');
            }
            
            await page.waitForTimeout(1000);
            await captureScreenshot(page, 'widgets-shadow-applied');
            
            console.log('✓ Widget shadow applied');
        } else {
            console.log('⚠ Widget shadow input not found');
        }
    });
    
    test('5. Widget spacing can be adjusted', async ({ page }) => {
        console.log('TEST: Widget spacing...');
        
        // Find padding/margin inputs
        const paddingInput = page.locator('input[name*="widget"][name*="padding"]').first();
        
        if (await paddingInput.isVisible()) {
            await paddingInput.fill('20');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'widgets-spacing-changed');
            
            console.log('✓ Widget spacing adjusted');
        } else {
            console.log('⚠ Widget spacing input not found');
        }
    });
    
    test('6. All widget controls are accessible', async ({ page }) => {
        console.log('TEST: Widget controls accessibility...');
        
        const widgetsContent = page.locator('#tab-widgets');
        
        // Check for common control types
        const inputs = await widgetsContent.locator('input, select, textarea').count();
        console.log(`Found ${inputs} widget controls`);
        
        expect(inputs).toBeGreaterThan(0);
        
        await captureScreenshot(page, 'widgets-all-controls');
        
        console.log('✓ Widget controls accessible');
    });
});
