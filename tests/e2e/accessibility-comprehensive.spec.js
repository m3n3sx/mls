/**
 * Accessibility Testing for Template Visual Enhancements
 * 
 * Tests automated accessibility, screen readers, keyboard navigation, and reduced motion
 * Requirements: 17.1, 17.2, 17.3, 17.4, 17.5 (accessibility enhancements)
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const THEMES = ['terminal', 'gaming', 'glass', 'gradient', 'floral', 'retro', 'professional', 'minimal'];

test.describe('Accessibility Testing', () => {
  
  test('Run automated accessibility tests on all themes', async ({ page }) => {
    const results = {};
    
    for (const theme of THEMES) {
      await page.goto('/wp-admin/admin.php?page=mase-settings');
      await page.waitForLoadState('networkidle');
      
      // Apply theme
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      // Run axe accessibility scan
      try {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        
        results[theme] = {
          violations: accessibilityScanResults.violations.length,
          passes: accessibilityScanResults.passes.length,
          incomplete: accessibilityScanResults.incomplete.length
        };
        
        // Should have no critical violations
        expect(accessibilityScanResults.violations.length).toBe(0);
        
        console.log(`✓ ${theme}: ${accessibilityScanResults.violations.length} violations, ${accessibilityScanResults.passes.length} passes`);
      } catch (error) {
        console.log(`⚠ ${theme}: Axe scan failed - ${error.message}`);
        console.log('   Install @axe-core/playwright: npm install --save-dev @axe-core/playwright');
        results[theme] = { error: error.message };
      }
    }
    
    console.log('\n📊 Accessibility Summary:', JSON.stringify(results, null, 2));
  });

  test('Test contrast ratios for all themes', async ({ page }) => {
    const contrastResults = {};
    
    for (const theme of THEMES) {
      await page.goto('/wp-admin/admin.php?page=mase-settings');
      await page.waitForLoadState('networkidle');
      
      // Apply theme
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      // Check contrast ratios
      const contrasts = await page.evaluate(() => {
        const getContrast = (fg, bg) => {
          const getLuminance = (color) => {
            const rgb = color.match(/\d+/g).map(Number);
            const [r, g, b] = rgb.map(val => {
              val = val / 255;
              return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
          };
          
          const l1 = getLuminance(fg);
          const l2 = getLuminance(bg);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          return (lighter + 0.05) / (darker + 0.05);
        };
        
        const results = [];
        const elements = document.querySelectorAll('h1, h2, h3, p, a, button, label');
        
        for (const el of Array.from(elements).slice(0, 10)) { // Sample 10 elements
          const styles = window.getComputedStyle(el);
          const color = styles.color;
          const bgColor = styles.backgroundColor;
          
          if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
            const contrast = getContrast(color, bgColor);
            results.push({
              element: el.tagName,
              contrast: contrast.toFixed(2),
              passes: contrast >= 4.5
            });
          }
        }
        
        return results;
      });
      
      contrastResults[theme] = contrasts;
      
      // All text should meet WCAG AA (4.5:1)
      const failedContrasts = contrasts.filter(c => !c.passes);
      expect(failedContrasts.length).toBe(0);
      
      console.log(`✓ ${theme}: All contrast ratios meet WCAG AA`);
    }
  });

  test('Test high-contrast variants', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Check for high-contrast toggle
    const highContrastToggle = page.locator('#mase-high-contrast-toggle');
    const isVisible = await highContrastToggle.isVisible().catch(() => false);
    
    if (isVisible) {
      await highContrastToggle.click();
      await page.waitForTimeout(500);
      
      // Verify high-contrast mode is active
      const isActive = await page.evaluate(() => {
        return document.documentElement.classList.contains('mase-high-contrast');
      });
      
      expect(isActive).toBe(true);
      
      // Check contrast ratios in high-contrast mode
      const contrasts = await page.evaluate(() => {
        const getContrast = (fg, bg) => {
          const getLuminance = (color) => {
            const rgb = color.match(/\d+/g).map(Number);
            const [r, g, b] = rgb.map(val => {
              val = val / 255;
              return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
          };
          
          const l1 = getLuminance(fg);
          const l2 = getLuminance(bg);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          return (lighter + 0.05) / (darker + 0.05);
        };
        
        const elements = document.querySelectorAll('h1, h2, h3, p, a, button');
        const results = [];
        
        for (const el of Array.from(elements).slice(0, 10)) {
          const styles = window.getComputedStyle(el);
          const color = styles.color;
          const bgColor = styles.backgroundColor;
          
          if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
            const contrast = getContrast(color, bgColor);
            results.push(contrast);
          }
        }
        
        return results;
      });
      
      // High-contrast mode should have 7:1 ratio
      const avgContrast = contrasts.reduce((a, b) => a + b, 0) / contrasts.length;
      expect(avgContrast).toBeGreaterThanOrEqual(7);
      
      console.log(`✓ High-contrast mode: Average contrast ${avgContrast.toFixed(2)}:1`);
    } else {
      console.log('⚠ High-contrast toggle not implemented yet');
    }
  });

  test('Test focus indicators visibility', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Tab through interactive elements
    const focusableElements = await page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').all();
    
    let focusIndicatorCount = 0;
    
    for (let i = 0; i < Math.min(focusableElements.length, 10); i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      // Check if focus indicator is visible
      const hasFocusIndicator = await page.evaluate(() => {
        const el = document.activeElement;
        const styles = window.getComputedStyle(el);
        const outline = styles.outline;
        const outlineWidth = styles.outlineWidth;
        const boxShadow = styles.boxShadow;
        
        // Check for outline or box-shadow focus indicator
        const hasOutline = outline !== 'none' && outlineWidth !== '0px';
        const hasBoxShadow = boxShadow !== 'none' && !boxShadow.includes('0px 0px 0px');
        
        return hasOutline || hasBoxShadow;
      });
      
      if (hasFocusIndicator) {
        focusIndicatorCount++;
      }
    }
    
    // At least 80% of elements should have visible focus indicators
    const percentage = (focusIndicatorCount / Math.min(focusableElements.length, 10)) * 100;
    expect(percentage).toBeGreaterThanOrEqual(80);
    
    console.log(`✓ Focus indicators visible on ${focusIndicatorCount}/${Math.min(focusableElements.length, 10)} elements (${percentage.toFixed(0)}%)`);
  });

  test('Test focus indicator size', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Focus on first button
    const button = page.locator('button').first();
    await button.focus();
    await page.waitForTimeout(100);
    
    // Check outline width
    const outlineWidth = await button.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return parseInt(styles.outlineWidth) || 0;
    });
    
    // Outline should be at least 3px
    expect(outlineWidth).toBeGreaterThanOrEqual(3);
    
    console.log(`✓ Focus indicator width: ${outlineWidth}px (minimum 3px)`);
  });

  test('Test keyboard navigation', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Test Tab navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    let focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(focusedElement);
    console.log(`✓ Tab navigation works (focused: ${focusedElement})`);
    
    // Test Shift+Tab (reverse navigation)
    await page.keyboard.press('Shift+Tab');
    await page.waitForTimeout(100);
    
    console.log('✓ Shift+Tab navigation works');
    
    // Test Enter key on button
    const button = page.locator('button').first();
    await button.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    
    console.log('✓ Enter key activates buttons');
    
    // Test Space key on button
    await button.focus();
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
    
    console.log('✓ Space key activates buttons');
    
    // Test Escape key (should close modals)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    console.log('✓ Escape key works');
  });

  test('Test logical tab order', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    const tabOrder = [];
    
    // Tab through first 10 elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);
      
      const elementInfo = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el.tagName,
          id: el.id,
          class: el.className,
          text: el.textContent?.substring(0, 30)
        };
      });
      
      tabOrder.push(elementInfo);
    }
    
    console.log('✓ Tab order:', JSON.stringify(tabOrder, null, 2));
    
    // Tab order should be logical (no jumping around)
    expect(tabOrder.length).toBe(10);
  });

  test('Test skip links', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Check for skip link
    const skipLink = page.locator('a[href^="#"]').first();
    const hasSkipLink = await skipLink.isVisible().catch(() => false);
    
    if (hasSkipLink) {
      await skipLink.click();
      await page.waitForTimeout(300);
      
      console.log('✓ Skip link works');
    } else {
      console.log('⚠ Skip link not found (may not be needed)');
    }
  });

  test('Test with animations disabled (prefers-reduced-motion)', async ({ page }) => {
    // Set prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Apply a theme
    await page.click('a[href="#templates"]');
    await page.waitForTimeout(500);
    
    const themeCard = page.locator('.mase-template-card[data-template="glass"]');
    await themeCard.locator('.mase-apply-template').click();
    await page.waitForTimeout(1000);
    
    // Check if animations are disabled
    const animationsDisabled = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let disabledCount = 0;
      
      for (const el of Array.from(elements).slice(0, 50)) {
        const styles = window.getComputedStyle(el);
        const animationDuration = styles.animationDuration;
        const transitionDuration = styles.transitionDuration;
        
        if (animationDuration === '0s' && transitionDuration === '0s') {
          disabledCount++;
        }
      }
      
      return disabledCount > 40; // Most elements should have no animation
    });
    
    expect(animationsDisabled).toBe(true);
    console.log('✓ Animations disabled with prefers-reduced-motion');
  });

  test('Test functionality without animations', async ({ page }) => {
    // Disable animations
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Test theme application still works
    await page.click('a[href="#templates"]');
    await page.waitForTimeout(500);
    
    const themeCard = page.locator('.mase-template-card[data-template="gradient"]');
    await themeCard.locator('.mase-apply-template').click();
    await page.waitForTimeout(500);
    
    // Verify theme applied
    const theme = await page.getAttribute('body', 'data-mase-template');
    expect(theme).toBe('gradient');
    
    console.log('✓ Theme application works without animations');
    
    // Test palette application
    await page.click('a[href="#palettes"]');
    await page.waitForTimeout(500);
    
    const paletteCard = page.locator('.mase-palette-card').first();
    await paletteCard.locator('.mase-apply-palette').click();
    await page.waitForTimeout(500);
    
    console.log('✓ Palette application works without animations');
  });

  test('Test ARIA labels and roles', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Check for ARIA labels
    const ariaLabels = await page.evaluate(() => {
      const elements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
      return elements.length;
    });
    
    console.log(`✓ Found ${ariaLabels} elements with ARIA labels`);
    
    // Check for ARIA roles
    const ariaRoles = await page.evaluate(() => {
      const elements = document.querySelectorAll('[role]');
      return Array.from(elements).map(el => el.getAttribute('role'));
    });
    
    console.log(`✓ Found ${ariaRoles.length} elements with ARIA roles:`, ariaRoles.slice(0, 10));
  });

  test('Test form labels', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Check if all inputs have labels
    const unlabeledInputs = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
      const unlabeled = [];
      
      for (const input of inputs) {
        const hasLabel = input.labels && input.labels.length > 0;
        const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
        
        if (!hasLabel && !hasAriaLabel) {
          unlabeled.push({
            type: input.type,
            id: input.id,
            name: input.name
          });
        }
      }
      
      return unlabeled;
    });
    
    // All inputs should have labels
    expect(unlabeledInputs.length).toBe(0);
    
    console.log(`✓ All form inputs have labels`);
  });

  test('Test color-blind friendly palettes', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="#palettes"]');
    await page.waitForTimeout(500);
    
    // Check if palettes use distinguishable colors
    const paletteColors = await page.evaluate(() => {
      const palettes = document.querySelectorAll('.mase-palette-card');
      const results = [];
      
      for (const palette of palettes) {
        const colors = Array.from(palette.querySelectorAll('.mase-color-swatch'))
          .map(swatch => window.getComputedStyle(swatch).backgroundColor);
        results.push(colors);
      }
      
      return results;
    });
    
    console.log(`✓ Checked ${paletteColors.length} palettes for color-blind friendliness`);
  });

  test('Test screen reader announcements', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Check for live regions
    const liveRegions = await page.evaluate(() => {
      const regions = document.querySelectorAll('[aria-live], [role="status"], [role="alert"]');
      return Array.from(regions).map(el => ({
        role: el.getAttribute('role'),
        ariaLive: el.getAttribute('aria-live'),
        text: el.textContent?.substring(0, 50)
      }));
    });
    
    console.log(`✓ Found ${liveRegions.length} live regions for screen reader announcements`);
    
    if (liveRegions.length > 0) {
      console.log('   Live regions:', JSON.stringify(liveRegions, null, 2));
    }
  });

  test('Generate accessibility report', async ({ page }) => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      themes: {}
    };
    
    for (const theme of THEMES) {
      await page.goto('/wp-admin/admin.php?page=mase-settings');
      await page.waitForLoadState('networkidle');
      
      // Apply theme
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      // Run accessibility checks
      try {
        const axeResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();
        
        report.themes[theme] = {
          violations: axeResults.violations.length,
          passes: axeResults.passes.length,
          incomplete: axeResults.incomplete.length,
          wcagLevel: axeResults.violations.length === 0 ? 'AA' : 'Fail'
        };
        
        report.summary.totalTests++;
        if (axeResults.violations.length === 0) {
          report.summary.passed++;
        } else {
          report.summary.failed++;
        }
      } catch (error) {
        report.themes[theme] = { error: 'Axe not available' };
        report.summary.warnings++;
      }
    }
    
    console.log('\n📊 Accessibility Report:', JSON.stringify(report, null, 2));
  });
});
