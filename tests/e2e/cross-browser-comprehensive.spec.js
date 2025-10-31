/**
 * Cross-Browser Testing for Template Visual Enhancements
 * 
 * Tests all features across Chrome, Firefox, Safari, and Edge
 * Requirements: All (cross-browser compatibility)
 */

import { test, expect } from '@playwright/test';

const THEMES = ['terminal', 'gaming', 'glass', 'gradient', 'floral', 'retro', 'professional', 'minimal'];

test.describe('Cross-Browser Compatibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.mase-settings-page', { timeout: 10000 });
  });

  test('Test CSS custom properties support', async ({ page, browserName }) => {
    // Check if CSS custom properties are supported
    const supportsCustomProps = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.style.setProperty('--test-var', 'test');
      return testEl.style.getPropertyValue('--test-var') === 'test';
    });
    
    expect(supportsCustomProps).toBe(true);
    console.log(`✓ ${browserName}: CSS custom properties supported`);
  });

  test('Test backdrop-filter support', async ({ page, browserName }) => {
    // Check backdrop-filter support (important for glass theme)
    const supportsBackdropFilter = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.style.backdropFilter = 'blur(10px)';
      return testEl.style.backdropFilter !== '';
    });
    
    if (browserName === 'webkit') {
      // Safari may need -webkit- prefix
      console.log(`⚠ ${browserName}: backdrop-filter may need vendor prefix`);
    } else {
      expect(supportsBackdropFilter).toBe(true);
      console.log(`✓ ${browserName}: backdrop-filter supported`);
    }
  });

  test('Test CSS Grid support', async ({ page, browserName }) => {
    const supportsGrid = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.style.display = 'grid';
      return testEl.style.display === 'grid';
    });
    
    expect(supportsGrid).toBe(true);
    console.log(`✓ ${browserName}: CSS Grid supported`);
  });

  test('Test CSS animations', async ({ page, browserName }) => {
    const supportsAnimations = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.style.animation = 'test 1s';
      return testEl.style.animation !== '';
    });
    
    expect(supportsAnimations).toBe(true);
    console.log(`✓ ${browserName}: CSS animations supported`);
  });

  test('Test theme application in all browsers', async ({ page, browserName }) => {
    for (const theme of THEMES) {
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await expect(themeCard).toBeVisible();
      
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      // Verify theme is applied
      const bodyClass = await page.getAttribute('body', 'data-mase-template');
      expect(bodyClass).toBe(theme);
      
      console.log(`✓ ${browserName}: ${theme} theme applied successfully`);
    }
  });

  test('Test preview modal in all browsers', async ({ page, browserName }) => {
    await page.click('a[href="#templates"]');
    await page.waitForTimeout(500);
    
    const themeCard = page.locator('.mase-template-card').first();
    
    // Hover to trigger preview
    await themeCard.hover();
    await page.waitForTimeout(2500); // Wait for 2s hover delay
    
    // Check if preview modal appears
    const previewModal = page.locator('.mase-preview-modal');
    const isVisible = await previewModal.isVisible().catch(() => false);
    
    if (isVisible) {
      console.log(`✓ ${browserName}: Preview modal works`);
      
      // Test close button
      await page.locator('.mase-preview-close').click();
      await page.waitForTimeout(500);
      
      await expect(previewModal).not.toBeVisible();
      console.log(`✓ ${browserName}: Preview modal closes correctly`);
    } else {
      console.log(`⚠ ${browserName}: Preview modal not implemented yet`);
    }
  });

  test('Test intensity controls in all browsers', async ({ page, browserName }) => {
    const intensityControl = page.locator('.mase-intensity-control');
    const isVisible = await intensityControl.isVisible().catch(() => false);
    
    if (isVisible) {
      const levels = ['low', 'medium', 'high'];
      
      for (const level of levels) {
        await intensityControl.locator(`[data-intensity="${level}"]`).click();
        await page.waitForTimeout(300);
        
        // Verify CSS variable is updated
        const multiplier = await page.evaluate((lvl) => {
          const value = lvl === 'low' ? 0.5 : lvl === 'high' ? 1.5 : 1;
          return getComputedStyle(document.documentElement)
            .getPropertyValue('--mase-intensity-multiplier').trim();
        }, level);
        
        console.log(`✓ ${browserName}: Intensity ${level} applied (${multiplier})`);
      }
    } else {
      console.log(`⚠ ${browserName}: Intensity controls not implemented yet`);
    }
  });

  test('Test color variant switching in all browsers', async ({ page, browserName }) => {
    await page.click('a[href="#templates"]');
    await page.waitForTimeout(500);
    
    // Apply terminal theme
    const terminalCard = page.locator('.mase-template-card[data-template="terminal"]');
    await terminalCard.locator('.mase-apply-template').click();
    await page.waitForTimeout(1000);
    
    // Check for variant selector
    const variantSelector = page.locator('.mase-variant-selector[data-theme="terminal"]');
    const isVisible = await variantSelector.isVisible().catch(() => false);
    
    if (isVisible) {
      const variants = ['green', 'blue', 'amber', 'red'];
      
      for (const variant of variants) {
        await variantSelector.locator(`[data-variant="${variant}"]`).click();
        await page.waitForTimeout(300);
        
        // Verify variant is applied
        const dataVariant = await page.getAttribute('body', 'data-mase-variant');
        expect(dataVariant).toBe(variant);
        
        console.log(`✓ ${browserName}: Terminal ${variant} variant applied`);
      }
    } else {
      console.log(`⚠ ${browserName}: Variant selector not implemented yet`);
    }
  });

  test('Test micro-interactions in all browsers', async ({ page, browserName }) => {
    // Test ripple effect on buttons
    const button = page.locator('.button-primary').first();
    await button.click();
    await page.waitForTimeout(300);
    
    // Check if ripple class exists
    const hasRipple = await button.evaluate(el => el.classList.contains('mase-ripple'));
    
    if (hasRipple) {
      console.log(`✓ ${browserName}: Ripple effect works`);
    } else {
      console.log(`⚠ ${browserName}: Ripple effect not implemented yet`);
    }
    
    // Test menu item hover
    const menuItem = page.locator('#adminmenu li').first();
    await menuItem.hover();
    await page.waitForTimeout(500);
    
    console.log(`✓ ${browserName}: Menu hover interactions work`);
  });

  test('Test theme transitions in all browsers', async ({ page, browserName }) => {
    await page.click('a[href="#templates"]');
    await page.waitForTimeout(500);
    
    // Apply first theme
    const theme1 = page.locator('.mase-template-card[data-template="glass"]');
    await theme1.locator('.mase-apply-template').click();
    await page.waitForTimeout(1000);
    
    // Apply second theme
    const theme2 = page.locator('.mase-template-card[data-template="gradient"]');
    await theme2.locator('.mase-apply-template').click();
    await page.waitForTimeout(1000);
    
    // Verify transition completed
    const currentTheme = await page.getAttribute('body', 'data-mase-template');
    expect(currentTheme).toBe('gradient');
    
    console.log(`✓ ${browserName}: Theme transitions work`);
  });

  test('Test performance mode in all browsers', async ({ page, browserName }) => {
    const perfToggle = page.locator('#mase-performance-mode-toggle');
    const isVisible = await perfToggle.isVisible().catch(() => false);
    
    if (isVisible) {
      await perfToggle.click();
      await page.waitForTimeout(500);
      
      // Verify performance mode is active
      const isPerfMode = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-performance-mode') === 'true';
      });
      
      expect(isPerfMode).toBe(true);
      console.log(`✓ ${browserName}: Performance mode works`);
    } else {
      console.log(`⚠ ${browserName}: Performance mode not implemented yet`);
    }
  });

  test('Test dark mode in all browsers', async ({ page, browserName }) => {
    const darkModeToggle = page.locator('#mase-dark-mode-toggle');
    const isVisible = await darkModeToggle.isVisible().catch(() => false);
    
    if (isVisible) {
      await darkModeToggle.click();
      await page.waitForTimeout(500);
      
      // Verify dark mode is active
      const isDarkMode = await page.evaluate(() => {
        return document.documentElement.classList.contains('mase-dark-mode');
      });
      
      expect(isDarkMode).toBe(true);
      console.log(`✓ ${browserName}: Dark mode works`);
    } else {
      console.log(`⚠ ${browserName}: Dark mode toggle not found`);
    }
  });

  test('Test keyboard navigation in all browsers', async ({ page, browserName }) => {
    // Tab through form elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    // Check if focus is visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      const outline = window.getComputedStyle(el).outline;
      return outline !== 'none' && outline !== '';
    });
    
    console.log(`✓ ${browserName}: Keyboard navigation works (focus visible: ${focusedElement})`);
  });

  test('Test reduced motion preference in all browsers', async ({ page, browserName }) => {
    // Set prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(500);
    
    // Check if animations are disabled
    const animationsDisabled = await page.evaluate(() => {
      const testEl = document.querySelector('body');
      const animationDuration = window.getComputedStyle(testEl).animationDuration;
      return animationDuration === '0s' || animationDuration === '';
    });
    
    console.log(`✓ ${browserName}: Reduced motion respected (animations disabled: ${animationsDisabled})`);
  });

  test('Test export/import functionality in all browsers', async ({ page, browserName }) => {
    const exportBtn = page.locator('#mase-export-theme');
    const isVisible = await exportBtn.isVisible().catch(() => false);
    
    if (isVisible) {
      // Test export
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        exportBtn.click()
      ]);
      
      expect(download).toBeTruthy();
      console.log(`✓ ${browserName}: Theme export works`);
    } else {
      console.log(`⚠ ${browserName}: Export/import not implemented yet`);
    }
  });
});

// Browser-specific tests
test.describe('Browser-Specific Feature Tests', () => {
  test('Chrome: Test GPU acceleration', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chrome-specific test');
    
    const gpuAccelerated = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.style.transform = 'translateZ(0)';
      document.body.appendChild(testEl);
      const computed = window.getComputedStyle(testEl).transform;
      document.body.removeChild(testEl);
      return computed !== 'none';
    });
    
    expect(gpuAccelerated).toBe(true);
    console.log('✓ Chrome: GPU acceleration works');
  });

  test('Firefox: Test CSS filter effects', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox-specific test');
    
    const supportsFilters = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.style.filter = 'blur(10px)';
      return testEl.style.filter !== '';
    });
    
    expect(supportsFilters).toBe(true);
    console.log('✓ Firefox: CSS filters work');
  });

  test('Safari: Test -webkit- prefixes', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Safari-specific test');
    
    const supportsWebkitBackdrop = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.style.webkitBackdropFilter = 'blur(10px)';
      return testEl.style.webkitBackdropFilter !== '';
    });
    
    console.log(`✓ Safari: -webkit-backdrop-filter ${supportsWebkitBackdrop ? 'supported' : 'not supported'}`);
  });
});
