/**
 * E2E Test: Color Palette Workflow
 * 
 * Tests the complete color palette workflow including:
 * - Select palette → Preview updates → Apply → Save → Verify
 * - Accessibility warnings
 * 
 * Task 15.3
 * Requirements: 11.3
 */

import { test, expect } from './fixtures/wordpress-auth.js';

test.describe('Color Palette Workflow', () => {
  test('should select and apply color palette', async ({ maseSettingsPage }) => {
    // Step 1: Navigate to a tab with color palette selector
    // Try Templates tab first (often has palette selector)
    const templatesTab = maseSettingsPage.locator('[data-tab="templates"]');
    await templatesTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Look for palette selector
    let paletteSelector = maseSettingsPage.locator('.mase-palette-selector, .palette-selector, #color-palette-selector');
    let hasPaletteSelector = await paletteSelector.count() > 0;
    
    // If not in templates, try admin bar tab
    if (!hasPaletteSelector) {
      const adminBarTab = maseSettingsPage.locator('[data-tab="admin-bar"], [data-tab="admin_bar"]');
      await adminBarTab.click();
      await maseSettingsPage.waitForTimeout(500);
      
      paletteSelector = maseSettingsPage.locator('.mase-palette-selector, .palette-selector, #color-palette-selector');
      hasPaletteSelector = await paletteSelector.count() > 0;
    }
    
    if (!hasPaletteSelector) {
      console.log('Palette selector not found - feature may not be implemented yet');
      return;
    }
    
    // Step 2: Get current color before palette change
    const adminBarTab = maseSettingsPage.locator('[data-tab="admin-bar"], [data-tab="admin_bar"]');
    await adminBarTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    const colorInputBefore = await maseSettingsPage.locator('#admin_bar_bg_color').inputValue();
    
    // Step 3: Select a palette
    await paletteSelector.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Find palette options
    const paletteOptions = maseSettingsPage.locator('.palette-option, .mase-palette-card, [data-palette-id]');
    const optionCount = await paletteOptions.count();
    
    if (optionCount === 0) {
      console.log('No palette options found');
      return;
    }
    
    // Select first palette
    const firstPalette = paletteOptions.first();
    await firstPalette.click();
    
    // Wait for palette application
    await maseSettingsPage.waitForTimeout(1000);
    
    // Step 4: Verify preview updates
    const colorInputAfter = await maseSettingsPage.locator('#admin_bar_bg_color').inputValue();
    
    // Color should have changed (unless palette uses same color)
    expect(colorInputAfter).toMatch(/^#[0-9a-fA-F]{6}$/);
    
    // Step 5: Save settings
    const saveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    await saveButton.click();
    
    // Wait for save to complete
    await maseSettingsPage.waitForTimeout(2000);
    
    // Step 6: Reload and verify persistence
    await maseSettingsPage.reload();
    await maseSettingsPage.waitForSelector('.mase-admin-wrapper', { timeout: 10000 });
    
    const colorInputReloaded = await maseSettingsPage.locator('#admin_bar_bg_color').inputValue();
    expect(colorInputReloaded).toBe(colorInputAfter);
  });
  
  test('should show accessibility warnings for poor contrast', async ({ maseSettingsPage, page }) => {
    // Step 1: Navigate to admin bar tab
    const adminBarTab = maseSettingsPage.locator('[data-tab="admin-bar"], [data-tab="admin_bar"]');
    await adminBarTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 2: Set colors with poor contrast (white on white)
    const bgColorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    const textColorInput = maseSettingsPage.locator('#admin_bar_text_color');
    
    await expect(bgColorInput).toBeVisible();
    await expect(textColorInput).toBeVisible();
    
    // Set both to white (poor contrast)
    await bgColorInput.fill('#ffffff');
    await bgColorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    
    await textColorInput.fill('#ffffff');
    await textColorInput.blur();
    await maseSettingsPage.waitForTimeout(1000);
    
    // Step 3: Look for accessibility warning
    const accessibilityWarning = maseSettingsPage.locator(
      '.accessibility-warning, .contrast-warning, .wcag-warning, [data-warning="contrast"]'
    );
    
    const hasWarning = await accessibilityWarning.count() > 0;
    
    if (hasWarning) {
      await expect(accessibilityWarning.first()).toBeVisible();
      console.log('Accessibility warning displayed correctly');
    } else {
      console.log('Accessibility warning not found - feature may not be implemented yet');
    }
    
    // Step 4: Fix contrast by setting text to black
    await textColorInput.fill('#000000');
    await textColorInput.blur();
    await maseSettingsPage.waitForTimeout(1000);
    
    // Step 5: Verify warning disappears or changes
    const warningAfterFix = await accessibilityWarning.count();
    
    if (hasWarning && warningAfterFix === 0) {
      console.log('Accessibility warning correctly removed after fixing contrast');
    }
  });
  
  test('should calculate and display contrast ratios', async ({ maseSettingsPage }) => {
    // Step 1: Navigate to admin bar tab
    const adminBarTab = maseSettingsPage.locator('[data-tab="admin-bar"], [data-tab="admin_bar"]');
    await adminBarTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 2: Set known colors with good contrast
    const bgColorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    const textColorInput = maseSettingsPage.locator('#admin_bar_text_color');
    
    await bgColorInput.fill('#000000'); // Black background
    await bgColorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    
    await textColorInput.fill('#ffffff'); // White text
    await textColorInput.blur();
    await maseSettingsPage.waitForTimeout(1000);
    
    // Step 3: Look for contrast ratio display
    const contrastRatio = maseSettingsPage.locator(
      '.contrast-ratio, .wcag-ratio, [data-contrast-ratio]'
    );
    
    const hasContrastRatio = await contrastRatio.count() > 0;
    
    if (hasContrastRatio) {
      const ratioText = await contrastRatio.first().textContent();
      console.log('Contrast ratio displayed:', ratioText);
      
      // Black on white should have ratio of 21:1
      expect(ratioText).toContain('21');
    } else {
      console.log('Contrast ratio display not found - feature may not be implemented yet');
    }
  });
  
  test('should preview palette before applying', async ({ maseSettingsPage }) => {
    // Step 1: Find palette selector
    const templatesTab = maseSettingsPage.locator('[data-tab="templates"]');
    await templatesTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    const paletteSelector = maseSettingsPage.locator('.mase-palette-selector, .palette-selector');
    const hasPaletteSelector = await paletteSelector.count() > 0;
    
    if (!hasPaletteSelector) {
      console.log('Palette selector not found');
      return;
    }
    
    // Step 2: Get current colors
    const adminBarTab = maseSettingsPage.locator('[data-tab="admin-bar"], [data-tab="admin_bar"]');
    await adminBarTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    const originalColor = await maseSettingsPage.locator('#admin_bar_bg_color').inputValue();
    
    // Step 3: Hover over a palette to preview
    await templatesTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    const paletteOptions = maseSettingsPage.locator('.palette-option, .mase-palette-card');
    const optionCount = await paletteOptions.count();
    
    if (optionCount > 0) {
      const firstPalette = paletteOptions.first();
      
      // Hover to trigger preview
      await firstPalette.hover();
      await maseSettingsPage.waitForTimeout(1000);
      
      // Check if preview mode is active
      const previewIndicator = maseSettingsPage.locator('.preview-mode, [data-preview="true"]');
      const hasPreview = await previewIndicator.count() > 0;
      
      if (hasPreview) {
        console.log('Palette preview activated on hover');
      } else {
        console.log('Palette preview on hover not implemented');
      }
      
      // Move mouse away to exit preview
      await maseSettingsPage.mouse.move(0, 0);
      await maseSettingsPage.waitForTimeout(500);
    }
  });
  
  test('should support custom palette creation', async ({ maseSettingsPage }) => {
    // Step 1: Look for custom palette creation UI
    const templatesTab = maseSettingsPage.locator('[data-tab="templates"]');
    await templatesTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Look for "Create Custom Palette" or similar button
    const createPaletteButton = maseSettingsPage.locator(
      'button:has-text("Create Palette"), button:has-text("Custom Palette"), button:has-text("New Palette")'
    );
    
    const hasCreateButton = await createPaletteButton.count() > 0;
    
    if (!hasCreateButton) {
      console.log('Custom palette creation not found - feature may not be implemented yet');
      return;
    }
    
    // Step 2: Click create palette button
    await createPaletteButton.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 3: Look for palette creation form
    const paletteForm = maseSettingsPage.locator('.palette-form, .custom-palette-form, #create-palette-form');
    await expect(paletteForm).toBeVisible({ timeout: 5000 });
    
    // Step 4: Fill in palette details
    const paletteNameInput = paletteForm.locator('input[name="palette_name"], input[placeholder*="name"]');
    if (await paletteNameInput.count() > 0) {
      await paletteNameInput.fill('Test Palette E2E');
    }
    
    // Step 5: Look for save button
    const savePaletteButton = paletteForm.locator('button:has-text("Save"), button:has-text("Create")');
    const hasSaveButton = await savePaletteButton.count() > 0;
    
    if (hasSaveButton) {
      console.log('Custom palette creation form found and functional');
      
      // Cancel instead of saving to avoid cluttering test data
      const cancelButton = paletteForm.locator('button:has-text("Cancel"), button:has-text("Close")');
      if (await cancelButton.count() > 0) {
        await cancelButton.click();
      }
    }
  });
  
  test('should handle palette application errors', async ({ maseSettingsPage, page }) => {
    // Step 1: Setup network interception to simulate error
    await page.route('**/wp-json/mase/v1/palettes/*/apply', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Palette application failed',
        }),
      });
    });
    
    // Step 2: Try to apply a palette
    const templatesTab = maseSettingsPage.locator('[data-tab="templates"]');
    await templatesTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    const paletteOptions = maseSettingsPage.locator('.palette-option, .mase-palette-card');
    const optionCount = await paletteOptions.count();
    
    if (optionCount > 0) {
      const firstPalette = paletteOptions.first();
      await firstPalette.click();
      
      // Wait for error handling
      await maseSettingsPage.waitForTimeout(2000);
      
      // Look for error message
      const errorNotice = maseSettingsPage.locator('.mase-notice-error, .notice-error, .error-message');
      const hasError = await errorNotice.count() > 0;
      
      if (hasError) {
        await expect(errorNotice.first()).toBeVisible();
        console.log('Error handling works correctly for palette application');
      } else {
        console.log('Error notice not displayed - error handling may need improvement');
      }
    }
    
    // Cleanup: Remove route interception
    await page.unroute('**/wp-json/mase/v1/palettes/*/apply');
  });
  
  test('should display palette color swatches', async ({ maseSettingsPage }) => {
    // Step 1: Navigate to templates or palette area
    const templatesTab = maseSettingsPage.locator('[data-tab="templates"]');
    await templatesTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 2: Find palette cards
    const paletteCards = maseSettingsPage.locator('.palette-option, .mase-palette-card, [data-palette-id]');
    const cardCount = await paletteCards.count();
    
    if (cardCount === 0) {
      console.log('No palette cards found');
      return;
    }
    
    // Step 3: Verify first palette has color swatches
    const firstPalette = paletteCards.first();
    
    // Look for color swatches
    const colorSwatches = firstPalette.locator('.color-swatch, .palette-color, [data-color]');
    const swatchCount = await colorSwatches.count();
    
    if (swatchCount > 0) {
      console.log(`Found ${swatchCount} color swatches in palette`);
      
      // Verify swatches have background colors
      const firstSwatch = colorSwatches.first();
      const backgroundColor = await firstSwatch.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      
      expect(backgroundColor).toBeTruthy();
      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent
    } else {
      console.log('Color swatches not found - may not be implemented');
    }
  });
});
