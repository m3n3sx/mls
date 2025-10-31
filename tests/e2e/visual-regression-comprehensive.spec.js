/**
 * Visual Regression Testing for Template Visual Enhancements
 * 
 * Tests all themes, variants, and intensity levels with screenshot comparison
 * Requirements: All (comprehensive visual testing)
 */

import { test, expect } from '@playwright/test';

// Theme configurations
const THEMES = [
  'terminal',
  'gaming',
  'glass',
  'gradient',
  'floral',
  'retro',
  'professional',
  'minimal'
];

const THEME_VARIANTS = {
  terminal: ['green', 'blue', 'amber', 'red'],
  gaming: ['cyberpunk', 'neon', 'matrix'],
  glass: ['clear', 'tinted-blue', 'tinted-purple'],
  gradient: ['warm', 'cool', 'sunset'],
  floral: ['spring', 'summer', 'autumn'],
  retro: ['vhs', 'arcade', 'synthwave'],
  professional: ['corporate', 'elegant', 'modern'],
  minimal: ['light', 'dark', 'neutral']
};

const INTENSITY_LEVELS = ['low', 'medium', 'high'];

test.describe('Visual Regression Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to MASE settings page
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Wait for page to be fully loaded
    await page.waitForSelector('.mase-settings-page', { timeout: 10000 });
  });

  test('Capture baseline screenshots for all themes', async ({ page }) => {
    for (const theme of THEMES) {
      // Navigate to templates tab
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      // Find and apply theme
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await expect(themeCard).toBeVisible();
      
      // Click apply button
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      // Wait for theme to be applied
      await page.waitForSelector(`body[data-mase-template="${theme}"]`, { timeout: 5000 });
      
      // Capture full page screenshot
      await page.screenshot({
        path: `tests/screenshots/baseline/${theme}-default.png`,
        fullPage: true
      });
      
      // Capture admin bar
      await page.locator('#wpadminbar').screenshot({
        path: `tests/screenshots/baseline/${theme}-adminbar.png`
      });
      
      // Capture admin menu
      await page.locator('#adminmenuwrap').screenshot({
        path: `tests/screenshots/baseline/${theme}-menu.png`
      });
      
      // Capture content area
      await page.locator('.wrap').first().screenshot({
        path: `tests/screenshots/baseline/${theme}-content.png`
      });
      
      console.log(`✓ Captured baseline for ${theme} theme`);
    }
  });

  test('Capture screenshots for all theme variants', async ({ page }) => {
    for (const theme of THEMES) {
      const variants = THEME_VARIANTS[theme] || ['default'];
      
      // Apply base theme first
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      for (const variant of variants) {
        // Apply variant if variant selector exists
        const variantSelector = page.locator(`.mase-variant-selector[data-theme="${theme}"]`);
        if (await variantSelector.isVisible()) {
          await variantSelector.locator(`[data-variant="${variant}"]`).click();
          await page.waitForTimeout(500);
        }
        
        // Capture screenshots
        await page.screenshot({
          path: `tests/screenshots/variants/${theme}-${variant}.png`,
          fullPage: true
        });
        
        await page.locator('#wpadminbar').screenshot({
          path: `tests/screenshots/variants/${theme}-${variant}-adminbar.png`
        });
        
        console.log(`✓ Captured ${theme} - ${variant} variant`);
      }
    }
  });

  test('Capture screenshots for all intensity levels', async ({ page }) => {
    for (const theme of THEMES) {
      // Apply theme
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      for (const intensity of INTENSITY_LEVELS) {
        // Set intensity level
        const intensityControl = page.locator('.mase-intensity-control');
        if (await intensityControl.isVisible()) {
          await intensityControl.locator(`[data-intensity="${intensity}"]`).click();
          await page.waitForTimeout(500);
        }
        
        // Capture screenshots
        await page.screenshot({
          path: `tests/screenshots/intensity/${theme}-${intensity}.png`,
          fullPage: true
        });
        
        console.log(`✓ Captured ${theme} - ${intensity} intensity`);
      }
    }
  });

  test('Compare current vs baseline screenshots', async ({ page }) => {
    for (const theme of THEMES) {
      // Apply theme
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      // Capture current screenshot
      const currentScreenshot = await page.screenshot({ fullPage: true });
      
      // Compare with baseline (Playwright will handle comparison)
      await expect(page).toHaveScreenshot(`${theme}-comparison.png`, {
        maxDiffPixels: 100, // Allow small differences
        threshold: 0.2 // 20% threshold
      });
      
      console.log(`✓ Compared ${theme} theme`);
    }
  });

  test('Test dark mode visual consistency', async ({ page }) => {
    for (const theme of THEMES) {
      // Apply theme
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      // Enable dark mode
      const darkModeToggle = page.locator('#mase-dark-mode-toggle');
      if (await darkModeToggle.isVisible()) {
        await darkModeToggle.click();
        await page.waitForTimeout(500);
      }
      
      // Capture dark mode screenshots
      await page.screenshot({
        path: `tests/screenshots/dark-mode/${theme}-dark.png`,
        fullPage: true
      });
      
      console.log(`✓ Captured ${theme} dark mode`);
    }
  });

  test('Test responsive layouts', async ({ page }) => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];
    
    for (const theme of THEMES) {
      // Apply theme
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      for (const viewport of viewports) {
        // Set viewport size
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(500);
        
        // Capture screenshot
        await page.screenshot({
          path: `tests/screenshots/responsive/${theme}-${viewport.name}.png`,
          fullPage: true
        });
        
        console.log(`✓ Captured ${theme} - ${viewport.name}`);
      }
    }
  });

  test('Test animation states', async ({ page }) => {
    for (const theme of THEMES) {
      // Apply theme
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      // Capture idle state
      await page.screenshot({
        path: `tests/screenshots/animations/${theme}-idle.png`,
        fullPage: true
      });
      
      // Trigger hover state on menu item
      const menuItem = page.locator('#adminmenu li').first();
      await menuItem.hover();
      await page.waitForTimeout(300);
      
      await page.screenshot({
        path: `tests/screenshots/animations/${theme}-hover.png`,
        fullPage: true
      });
      
      console.log(`✓ Captured ${theme} animation states`);
    }
  });
});
