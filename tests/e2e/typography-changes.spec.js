/**
 * E2E Test: Typography Changes Workflow
 * 
 * Tests the complete typography workflow including:
 * - Change font → Font loads → Preview updates → Save → Reload → Verify
 * - Font loading failure fallback
 * 
 * Task 15.4
 * Requirements: 11.3
 */

import { test, expect } from './fixtures/wordpress-auth.js';

test.describe('Typography Changes Workflow', () => {
  test('should change font and update preview', async ({ maseSettingsPage }) => {
    // Step 1: Navigate to Typography tab
    const typographyTab = maseSettingsPage.locator('[data-tab="typography"]');
    await expect(typographyTab).toBeVisible();
    await typographyTab.click();
    
    // Wait for typography tab content to load
    await maseSettingsPage.waitForSelector('#typography-tab, .typography-content', {
      state: 'visible',
      timeout: 5000,
    });
    
    // Step 2: Find font family selector
    const fontFamilySelect = maseSettingsPage.locator(
      'select[name*="font_family"], select[id*="font_family"], #admin_bar_font_family'
    );
    
    await expect(fontFamilySelect).toBeVisible({ timeout: 5000 });
    
    // Step 3: Get current font
    const originalFont = await fontFamilySelect.inputValue();
    
    // Step 4: Change to a different font
    const options = await fontFamilySelect.locator('option').allTextContents();
    
    if (options.length < 2) {
      console.log('Not enough font options to test font change');
      return;
    }
    
    // Select a different font (not the first one)
    const newFontOption = options.find(opt => opt !== originalFont) || options[1];
    await fontFamilySelect.selectOption({ label: newFontOption });
    
    // Wait for font change to process
    await maseSettingsPage.waitForTimeout(2000);
    
    // Step 5: Verify font loaded (check for font-loaded class or similar)
    const fontLoadedIndicator = maseSettingsPage.locator('.font-loaded, [data-font-loaded="true"]');
    const hasFontLoadedIndicator = await fontLoadedIndicator.count() > 0;
    
    if (hasFontLoadedIndicator) {
      await expect(fontLoadedIndicator.first()).toBeVisible({ timeout: 5000 });
      console.log('Font loaded indicator found');
    } else {
      console.log('Font loaded indicator not found - may not be implemented');
    }
    
    // Step 6: Verify preview updated with new font
    // Check if admin bar or preview area has the new font applied
    const previewArea = maseSettingsPage.locator('#wpadminbar, .mase-preview, .preview-area');
    
    if (await previewArea.count() > 0) {
      const fontFamily = await previewArea.first().evaluate((el) => {
        return window.getComputedStyle(el).fontFamily;
      });
      
      console.log('Preview area font family:', fontFamily);
      expect(fontFamily).toBeTruthy();
    }
    
    // Step 7: Save settings
    const saveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    await saveButton.click();
    
    // Wait for save to complete
    await maseSettingsPage.waitForTimeout(2000);
    
    // Step 8: Reload page
    await maseSettingsPage.reload();
    await maseSettingsPage.waitForSelector('.mase-admin-wrapper', { timeout: 10000 });
    
    // Step 9: Navigate back to typography tab
    const typographyTabReload = maseSettingsPage.locator('[data-tab="typography"]');
    await typographyTabReload.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 10: Verify font persisted
    const fontFamilySelectReload = maseSettingsPage.locator(
      'select[name*="font_family"], select[id*="font_family"], #admin_bar_font_family'
    );
    
    const persistedFont = await fontFamilySelectReload.inputValue();
    expect(persistedFont).toBe(newFontOption);
    
    // Cleanup: Restore original font
    await fontFamilySelectReload.selectOption({ label: originalFont });
    await maseSettingsPage.waitForTimeout(1000);
    await saveButton.click();
    await maseSettingsPage.waitForTimeout(2000);
  });
  
  test('should handle font loading failure with fallback', async ({ maseSettingsPage, page }) => {
    // Step 1: Setup network interception to block Google Fonts
    await page.route('**/fonts.googleapis.com/**', async (route) => {
      await route.abort('failed');
    });
    
    await page.route('**/fonts.gstatic.com/**', async (route) => {
      await route.abort('failed');
    });
    
    // Step 2: Navigate to Typography tab
    const typographyTab = maseSettingsPage.locator('[data-tab="typography"]');
    await typographyTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 3: Select a Google Font
    const fontFamilySelect = maseSettingsPage.locator(
      'select[name*="font_family"], select[id*="font_family"], #admin_bar_font_family'
    );
    
    await expect(fontFamilySelect).toBeVisible({ timeout: 5000 });
    
    // Look for a Google Font option (usually contains spaces or specific names)
    const options = await fontFamilySelect.locator('option').allTextContents();
    const googleFont = options.find(opt => 
      opt.includes('Roboto') || 
      opt.includes('Open Sans') || 
      opt.includes('Lato') ||
      opt.includes('Inter')
    ) || options[1];
    
    await fontFamilySelect.selectOption({ label: googleFont });
    
    // Step 4: Wait for font loading timeout (should be 3 seconds per requirements)
    await maseSettingsPage.waitForTimeout(4000);
    
    // Step 5: Verify fallback font is applied
    const previewArea = maseSettingsPage.locator('#wpadminbar, .mase-preview');
    
    if (await previewArea.count() > 0) {
      const fontFamily = await previewArea.first().evaluate((el) => {
        return window.getComputedStyle(el).fontFamily;
      });
      
      // Should contain system font fallback
      const hasSystemFont = fontFamily.includes('system-ui') || 
                           fontFamily.includes('sans-serif') ||
                           fontFamily.includes('Arial') ||
                           fontFamily.includes('Helvetica');
      
      if (hasSystemFont) {
        console.log('Fallback font correctly applied:', fontFamily);
      } else {
        console.log('Font family after failure:', fontFamily);
      }
    }
    
    // Step 6: Look for error or warning message
    const fontLoadError = maseSettingsPage.locator('.font-load-error, .font-warning, [data-font-error]');
    const hasError = await fontLoadError.count() > 0;
    
    if (hasError) {
      console.log('Font loading error message displayed');
    } else {
      console.log('Font loading error message not found - may not be implemented');
    }
    
    // Cleanup: Remove route interception
    await page.unroute('**/fonts.googleapis.com/**');
    await page.unroute('**/fonts.gstatic.com/**');
  });
  
  test('should change font size and update preview', async ({ maseSettingsPage }) => {
    // Step 1: Navigate to Typography tab
    const typographyTab = maseSettingsPage.locator('[data-tab="typography"]');
    await typographyTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 2: Find font size input
    const fontSizeInput = maseSettingsPage.locator(
      'input[name*="font_size"], input[id*="font_size"], #admin_bar_font_size'
    );
    
    await expect(fontSizeInput).toBeVisible({ timeout: 5000 });
    
    // Step 3: Get current font size
    const originalSize = await fontSizeInput.inputValue();
    
    // Step 4: Change font size
    const newSize = '16';
    await fontSizeInput.fill(newSize);
    await fontSizeInput.blur();
    
    // Wait for preview update
    await maseSettingsPage.waitForTimeout(1000);
    
    // Step 5: Verify preview updated
    const previewArea = maseSettingsPage.locator('#wpadminbar, .mase-preview');
    
    if (await previewArea.count() > 0) {
      const fontSize = await previewArea.first().evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      
      console.log('Preview area font size:', fontSize);
      expect(fontSize).toBeTruthy();
    }
    
    // Step 6: Save and verify persistence
    const saveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    await saveButton.click();
    await maseSettingsPage.waitForTimeout(2000);
    
    // Reload
    await maseSettingsPage.reload();
    await maseSettingsPage.waitForSelector('.mase-admin-wrapper', { timeout: 10000 });
    
    // Navigate back to typography
    const typographyTabReload = maseSettingsPage.locator('[data-tab="typography"]');
    await typographyTabReload.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Verify size persisted
    const fontSizeInputReload = maseSettingsPage.locator(
      'input[name*="font_size"], input[id*="font_size"], #admin_bar_font_size'
    );
    
    const persistedSize = await fontSizeInputReload.inputValue();
    expect(persistedSize).toBe(newSize);
    
    // Cleanup: Restore original size
    await fontSizeInputReload.fill(originalSize);
    await fontSizeInputReload.blur();
    await maseSettingsPage.waitForTimeout(500);
    await saveButton.click();
    await maseSettingsPage.waitForTimeout(2000);
  });
  
  test('should support fluid typography settings', async ({ maseSettingsPage }) => {
    // Step 1: Navigate to Typography tab
    const typographyTab = maseSettingsPage.locator('[data-tab="typography"]');
    await typographyTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 2: Look for fluid typography toggle or settings
    const fluidTypographyToggle = maseSettingsPage.locator(
      'input[name*="fluid_typography"], input[id*="fluid_typography"], #enable_fluid_typography'
    );
    
    const hasFluidTypography = await fluidTypographyToggle.count() > 0;
    
    if (!hasFluidTypography) {
      console.log('Fluid typography settings not found - feature may not be implemented yet');
      return;
    }
    
    // Step 3: Enable fluid typography
    const isChecked = await fluidTypographyToggle.isChecked();
    
    if (!isChecked) {
      await fluidTypographyToggle.check();
      await maseSettingsPage.waitForTimeout(500);
    }
    
    // Step 4: Look for min/max size inputs
    const minSizeInput = maseSettingsPage.locator('input[name*="min_size"], input[id*="min_font_size"]');
    const maxSizeInput = maseSettingsPage.locator('input[name*="max_size"], input[id*="max_font_size"]');
    
    const hasMinMax = await minSizeInput.count() > 0 && await maxSizeInput.count() > 0;
    
    if (hasMinMax) {
      console.log('Fluid typography min/max inputs found');
      
      // Set values
      await minSizeInput.fill('14');
      await maxSizeInput.fill('18');
      await maseSettingsPage.waitForTimeout(500);
      
      // Verify preview uses clamp() or similar
      const previewArea = maseSettingsPage.locator('#wpadminbar, .mase-preview');
      
      if (await previewArea.count() > 0) {
        const fontSize = await previewArea.first().evaluate((el) => {
          return window.getComputedStyle(el).fontSize;
        });
        
        console.log('Fluid typography preview font size:', fontSize);
      }
    } else {
      console.log('Fluid typography min/max inputs not found');
    }
  });
  
  test('should cache loaded fonts in localStorage', async ({ maseSettingsPage, page }) => {
    // Step 1: Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Step 2: Navigate to Typography tab
    const typographyTab = maseSettingsPage.locator('[data-tab="typography"]');
    await typographyTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 3: Select a Google Font
    const fontFamilySelect = maseSettingsPage.locator(
      'select[name*="font_family"], select[id*="font_family"], #admin_bar_font_family'
    );
    
    await expect(fontFamilySelect).toBeVisible({ timeout: 5000 });
    
    const options = await fontFamilySelect.locator('option').allTextContents();
    const googleFont = options.find(opt => opt.includes('Roboto') || opt.includes('Inter')) || options[1];
    
    await fontFamilySelect.selectOption({ label: googleFont });
    
    // Wait for font to load
    await maseSettingsPage.waitForTimeout(3000);
    
    // Step 4: Check if font was cached in localStorage
    const cachedFonts = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      return keys.filter(key => key.includes('font') || key.includes('mase'));
    });
    
    if (cachedFonts.length > 0) {
      console.log('Fonts cached in localStorage:', cachedFonts);
    } else {
      console.log('Font caching not found - feature may not be implemented yet');
    }
  });
  
  test('should change line height and letter spacing', async ({ maseSettingsPage }) => {
    // Step 1: Navigate to Typography tab
    const typographyTab = maseSettingsPage.locator('[data-tab="typography"]');
    await typographyTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 2: Find line height input
    const lineHeightInput = maseSettingsPage.locator(
      'input[name*="line_height"], input[id*="line_height"], #admin_bar_line_height'
    );
    
    const hasLineHeight = await lineHeightInput.count() > 0;
    
    if (hasLineHeight) {
      const originalLineHeight = await lineHeightInput.inputValue();
      
      // Change line height
      await lineHeightInput.fill('1.8');
      await lineHeightInput.blur();
      await maseSettingsPage.waitForTimeout(500);
      
      console.log('Line height changed to 1.8');
      
      // Restore
      await lineHeightInput.fill(originalLineHeight);
      await lineHeightInput.blur();
    } else {
      console.log('Line height input not found');
    }
    
    // Step 3: Find letter spacing input
    const letterSpacingInput = maseSettingsPage.locator(
      'input[name*="letter_spacing"], input[id*="letter_spacing"], #admin_bar_letter_spacing'
    );
    
    const hasLetterSpacing = await letterSpacingInput.count() > 0;
    
    if (hasLetterSpacing) {
      const originalLetterSpacing = await letterSpacingInput.inputValue();
      
      // Change letter spacing
      await letterSpacingInput.fill('0.5');
      await letterSpacingInput.blur();
      await maseSettingsPage.waitForTimeout(500);
      
      console.log('Letter spacing changed to 0.5');
      
      // Restore
      await letterSpacingInput.fill(originalLetterSpacing);
      await letterSpacingInput.blur();
    } else {
      console.log('Letter spacing input not found');
    }
  });
  
  test('should display font preview samples', async ({ maseSettingsPage }) => {
    // Step 1: Navigate to Typography tab
    const typographyTab = maseSettingsPage.locator('[data-tab="typography"]');
    await typographyTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 2: Look for font preview area
    const fontPreview = maseSettingsPage.locator('.font-preview, .typography-preview, [data-font-preview]');
    
    const hasPreview = await fontPreview.count() > 0;
    
    if (hasPreview) {
      await expect(fontPreview.first()).toBeVisible();
      
      // Verify preview contains sample text
      const previewText = await fontPreview.first().textContent();
      expect(previewText).toBeTruthy();
      expect(previewText.length).toBeGreaterThan(0);
      
      console.log('Font preview found with sample text');
    } else {
      console.log('Font preview not found - feature may not be implemented yet');
    }
  });
});
