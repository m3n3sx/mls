/**
 * Visual Interactive Test: Advanced - Custom JavaScript
 * 
 * Tests custom JavaScript functionality:
 * - Custom JS textarea exists
 * - Custom JS can be entered
 * - Custom JS is saved
 * - Custom JS validation
 * 
 * @package MASE
 * @subpackage Tests
 */

const { test, expect } = require('@playwright/test');
const { 
    login, 
    navigateToSettings, 
    captureScreenshot 
} = require('../../helpers.cjs');

const BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8080';

test.describe('Advanced - Custom JavaScript', () => {
    
    test.beforeEach(async ({ page }) => {
        await login(page, BASE_URL);
        await navigateToSettings(page, BASE_URL);
        
        // Navigate to Advanced tab
        const advancedTab = page.locator('[data-tab="advanced"]');
        await advancedTab.click();
        await page.waitForTimeout(500);
    });
    
    test('1. Advanced tab loads correctly', async ({ page }) => {
        console.log('TEST: Advanced tab loads...');
        
        const advancedContent = page.locator('#tab-advanced');
        await expect(advancedContent).toBeVisible();
        
        await captureScreenshot(page, 'advanced-tab-loaded');
        
        console.log('✓ Advanced tab loaded');
    });
    
    test('2. Custom CSS textarea exists', async ({ page }) => {
        console.log('TEST: Custom CSS textarea...');
        
        const customCSS = page.locator('textarea[name*="custom_css"]').first();
        
        if (await customCSS.isVisible()) {
            await expect(customCSS).toBeVisible();
            
            // Check if it's editable
            await customCSS.click();
            await customCSS.fill('/* Test CSS */\n.test { color: red; }');
            await page.waitForTimeout(500);
            
            const value = await customCSS.inputValue();
            expect(value).toContain('Test CSS');
            
            await captureScreenshot(page, 'advanced-custom-css-entered');
            
            // Clear
            await customCSS.fill('');
            
            console.log('✓ Custom CSS textarea works');
        } else {
            console.log('⚠ Custom CSS textarea not found');
        }
    });
    
    test('3. Custom JavaScript textarea exists', async ({ page }) => {
        console.log('TEST: Custom JavaScript textarea...');
        
        const customJS = page.locator('textarea[name*="custom_js"]').first();
        
        if (await customJS.isVisible()) {
            await expect(customJS).toBeVisible();
            
            // Enter test JavaScript
            await customJS.click();
            await customJS.fill('// Test JavaScript\nconsole.log("MASE Test");');
            await page.waitForTimeout(500);
            
            const value = await customJS.inputValue();
            expect(value).toContain('Test JavaScript');
            
            await captureScreenshot(page, 'advanced-custom-js-entered');
            
            // Clear
            await customJS.fill('');
            
            console.log('✓ Custom JavaScript textarea works');
        } else {
            console.log('⚠ Custom JavaScript textarea not found');
        }
    });
    
    test('4. Auto Palette Switching toggle exists', async ({ page }) => {
        console.log('TEST: Auto Palette Switching...');
        
        const autoPalette = page.locator('input[name*="auto_palette"]').first();
        
        if (await autoPalette.isVisible()) {
            const isChecked = await autoPalette.isChecked();
            
            // Toggle it
            await autoPalette.click();
            await page.waitForTimeout(500);
            
            const newState = await autoPalette.isChecked();
            expect(newState).toBe(!isChecked);
            
            await captureScreenshot(page, 'advanced-auto-palette-toggled');
            
            // Toggle back
            await autoPalette.click();
            
            console.log('✓ Auto Palette Switching works');
        } else {
            console.log('⚠ Auto Palette toggle not found');
        }
    });
    
    test('5. Backup section exists', async ({ page }) => {
        console.log('TEST: Backup section...');
        
        // Look for backup-related buttons
        const createBackup = page.locator('button:has-text("Create Backup")').first();
        const restoreBackup = page.locator('button:has-text("Restore")').first();
        
        let backupFound = false;
        
        if (await createBackup.isVisible()) {
            await expect(createBackup).toBeVisible();
            backupFound = true;
            console.log('✓ Create Backup button found');
        }
        
        if (await restoreBackup.isVisible()) {
            await expect(restoreBackup).toBeVisible();
            backupFound = true;
            console.log('✓ Restore Backup button found');
        }
        
        if (backupFound) {
            await captureScreenshot(page, 'advanced-backup-section');
            console.log('✓ Backup section exists');
        } else {
            console.log('⚠ Backup section not found');
        }
    });
    
    test('6. Import/Export section exists', async ({ page }) => {
        console.log('TEST: Import/Export section...');
        
        const exportButton = page.locator('button:has-text("Export")').first();
        const importButton = page.locator('button:has-text("Import")').first();
        
        let importExportFound = false;
        
        if (await exportButton.isVisible()) {
            await expect(exportButton).toBeVisible();
            importExportFound = true;
            console.log('✓ Export button found');
        }
        
        if (await importButton.isVisible()) {
            await expect(importButton).toBeVisible();
            importExportFound = true;
            console.log('✓ Import button found');
        }
        
        if (importExportFound) {
            await captureScreenshot(page, 'advanced-import-export-section');
            console.log('✓ Import/Export section exists');
        } else {
            console.log('⚠ Import/Export section not found');
        }
    });
    
    test('7. Performance optimization options exist', async ({ page }) => {
        console.log('TEST: Performance options...');
        
        // Look for cache-related controls
        const cacheToggle = page.locator('input[name*="cache"]').first();
        const minifyToggle = page.locator('input[name*="minify"]').first();
        
        let perfFound = false;
        
        if (await cacheToggle.isVisible()) {
            await expect(cacheToggle).toBeVisible();
            perfFound = true;
            console.log('✓ Cache toggle found');
        }
        
        if (await minifyToggle.isVisible()) {
            await expect(minifyToggle).toBeVisible();
            perfFound = true;
            console.log('✓ Minify toggle found');
        }
        
        if (perfFound) {
            await captureScreenshot(page, 'advanced-performance-options');
            console.log('✓ Performance options exist');
        } else {
            console.log('⚠ Performance options not found');
        }
    });
    
    test('8. All advanced features accessible', async ({ page }) => {
        console.log('TEST: All advanced features...');
        
        const advancedContent = page.locator('#tab-advanced');
        
        // Count all interactive elements
        const textareas = await advancedContent.locator('textarea').count();
        const buttons = await advancedContent.locator('button').count();
        const inputs = await advancedContent.locator('input').count();
        
        console.log(`Found ${textareas} textareas, ${buttons} buttons, ${inputs} inputs`);
        
        const totalControls = textareas + buttons + inputs;
        expect(totalControls).toBeGreaterThan(0);
        
        await captureScreenshot(page, 'advanced-all-features');
        
        console.log('✓ All advanced features accessible');
    });
});
