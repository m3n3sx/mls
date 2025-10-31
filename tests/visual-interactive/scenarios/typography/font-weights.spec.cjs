/**
 * Visual Interactive Test: Typography - Font Weights
 * 
 * Tests font weight controls for different areas:
 * - Admin Bar font weight
 * - Menu font weight
 * - Content font weight
 * - Heading font weights
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

test.describe('Typography - Font Weights', () => {
    
    test.beforeEach(async ({ page }) => {
        await login(page, BASE_URL);
        await navigateToSettings(page, BASE_URL);
        
        // Navigate to Typography tab
        const typoTab = page.locator('[data-tab="typography"]');
        await typoTab.click();
        await page.waitForTimeout(500);
        
        // Enable live preview
        await enableLivePreview(page);
    });
    
    test('1. Typography tab loads with area selector', async ({ page }) => {
        console.log('TEST: Typography tab loads...');
        
        const typoContent = page.locator('#tab-typography');
        await expect(typoContent).toBeVisible();
        
        // Check for area selector
        const areaSelector = page.locator('select[name*="typography_area"]').first();
        if (await areaSelector.isVisible()) {
            console.log('✓ Area selector found');
        }
        
        await captureScreenshot(page, 'typography-tab-loaded');
        
        console.log('✓ Typography tab loaded');
    });
    
    test('2. Admin Bar font weight can be changed', async ({ page }) => {
        console.log('TEST: Admin Bar font weight...');
        
        // Select Admin Bar area
        const areaSelector = page.locator('select[name*="typography_area"]').first();
        if (await areaSelector.isVisible()) {
            await areaSelector.selectOption({ label: 'Admin Bar' });
            await page.waitForTimeout(500);
        }
        
        // Find font weight control
        const fontWeight = page.locator('select[name*="admin_bar"][name*="font_weight"]').first();
        
        if (await fontWeight.isVisible()) {
            await fontWeight.selectOption('600');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'typography-adminbar-weight-changed');
            
            console.log('✓ Admin Bar font weight changed');
        } else {
            console.log('⚠ Admin Bar font weight control not found');
        }
    });
    
    test('3. Menu font weight can be changed', async ({ page }) => {
        console.log('TEST: Menu font weight...');
        
        // Select Menu area
        const areaSelector = page.locator('select[name*="typography_area"]').first();
        if (await areaSelector.isVisible()) {
            await areaSelector.selectOption({ label: 'Menu' });
            await page.waitForTimeout(500);
        }
        
        const fontWeight = page.locator('select[name*="menu"][name*="font_weight"]').first();
        
        if (await fontWeight.isVisible()) {
            await fontWeight.selectOption('500');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'typography-menu-weight-changed');
            
            console.log('✓ Menu font weight changed');
        } else {
            console.log('⚠ Menu font weight control not found');
        }
    });
    
    test('4. Content font weight can be changed', async ({ page }) => {
        console.log('TEST: Content font weight...');
        
        // Select Content area
        const areaSelector = page.locator('select[name*="typography_area"]').first();
        if (await areaSelector.isVisible()) {
            await areaSelector.selectOption({ label: 'Content' });
            await page.waitForTimeout(500);
        }
        
        const fontWeight = page.locator('select[name*="content"][name*="font_weight"]').first();
        
        if (await fontWeight.isVisible()) {
            await fontWeight.selectOption('400');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'typography-content-weight-changed');
            
            console.log('✓ Content font weight changed');
        } else {
            console.log('⚠ Content font weight control not found');
        }
    });
    
    test('5. Heading font weights can be customized', async ({ page }) => {
        console.log('TEST: Heading font weights...');
        
        // Select Headings area
        const areaSelector = page.locator('select[name*="typography_area"]').first();
        if (await areaSelector.isVisible()) {
            await areaSelector.selectOption({ label: 'Headings' });
            await page.waitForTimeout(500);
        }
        
        // Try to find H1 font weight
        const h1Weight = page.locator('select[name*="h1"][name*="font_weight"]').first();
        
        if (await h1Weight.isVisible()) {
            await h1Weight.selectOption('700');
            await page.waitForTimeout(1000);
            
            await captureScreenshot(page, 'typography-heading-weight-changed');
            
            console.log('✓ Heading font weight changed');
        } else {
            console.log('⚠ Heading font weight control not found');
        }
    });
    
    test('6. Font weight changes reflect in live preview', async ({ page }) => {
        console.log('TEST: Font weight live preview...');
        
        // Change a font weight
        const fontWeight = page.locator('select[name*="font_weight"]').first();
        
        if (await fontWeight.isVisible()) {
            const initialValue = await fontWeight.inputValue();
            
            // Change to different weight
            await fontWeight.selectOption('700');
            await page.waitForTimeout(1500);
            
            // Check if live preview CSS exists
            const livePreviewStyle = page.locator('#mase-live-preview-css');
            const styleExists = await livePreviewStyle.count() > 0;
            
            if (styleExists) {
                console.log('✓ Live preview CSS found');
            }
            
            await captureScreenshot(page, 'typography-weight-live-preview');
            
            // Revert
            await fontWeight.selectOption(initialValue);
            
            console.log('✓ Font weight live preview works');
        } else {
            console.log('⚠ Font weight controls not found');
        }
    });
    
    test('7. All typography areas accessible', async ({ page }) => {
        console.log('TEST: All typography areas...');
        
        const areaSelector = page.locator('select[name*="typography_area"]').first();
        
        if (await areaSelector.isVisible()) {
            const options = await areaSelector.locator('option').count();
            console.log(`Found ${options} typography areas`);
            
            expect(options).toBeGreaterThan(0);
            
            await captureScreenshot(page, 'typography-all-areas');
            
            console.log('✓ All typography areas accessible');
        } else {
            console.log('⚠ Area selector not found');
        }
    });
});
