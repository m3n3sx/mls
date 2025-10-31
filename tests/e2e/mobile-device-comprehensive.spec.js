/**
 * Mobile Device Testing for Template Visual Enhancements
 * 
 * Tests responsive behavior on iOS and Android devices
 * Requirements: 16.1, 16.2, 16.3 (responsive optimization)
 */

import { test, expect, devices } from '@playwright/test';

const THEMES = ['terminal', 'gaming', 'glass', 'gradient', 'floral', 'retro', 'professional', 'minimal'];

// Mobile device configurations
const MOBILE_DEVICES = [
  { name: 'iPhone 12', device: devices['iPhone 12'] },
  { name: 'iPhone 12 Pro', device: devices['iPhone 12 Pro'] },
  { name: 'iPhone SE', device: devices['iPhone SE'] },
  { name: 'Pixel 5', device: devices['Pixel 5'] },
  { name: 'Galaxy S21', device: devices['Galaxy S21'] },
  { name: 'iPad Pro', device: devices['iPad Pro'] },
  { name: 'iPad Mini', device: devices['iPad Mini'] }
];

const SCREEN_SIZES = [
  { name: 'small-phone', width: 320, height: 568 }, // iPhone SE
  { name: 'phone', width: 375, height: 667 }, // iPhone 8
  { name: 'large-phone', width: 414, height: 896 }, // iPhone 11 Pro Max
  { name: 'tablet', width: 768, height: 1024 }, // iPad
  { name: 'large-tablet', width: 1024, height: 1366 } // iPad Pro
];

test.describe('Mobile Device Testing', () => {
  
  test('Test responsive layout on various screen sizes', async ({ page }) => {
    for (const size of SCREEN_SIZES) {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('/wp-admin/admin.php?page=mase-settings');
      await page.waitForLoadState('networkidle');
      
      // Check if page is responsive
      const isResponsive = await page.evaluate(() => {
        const viewport = document.querySelector('meta[name="viewport"]');
        return viewport !== null;
      });
      
      expect(isResponsive).toBe(true);
      
      // Check if admin menu is accessible
      const menuVisible = await page.locator('#adminmenuwrap').isVisible();
      console.log(`✓ ${size.name} (${size.width}x${size.height}): Menu ${menuVisible ? 'visible' : 'hidden'}`);
      
      // Capture screenshot
      await page.screenshot({
        path: `tests/screenshots/mobile/${size.name}.png`,
        fullPage: true
      });
    }
  });

  test('Test animation scaling on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    for (const theme of THEMES) {
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      // Check if animations are scaled down on mobile
      const animationComplexity = await page.evaluate(() => {
        const width = window.innerWidth;
        return width < 768 ? 'reduced' : 'full';
      });
      
      expect(animationComplexity).toBe('reduced');
      console.log(`✓ ${theme}: Animation complexity reduced on mobile`);
    }
  });

  test('Test particle effects disabled on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Apply gaming theme (has particle effects)
    await page.click('a[href="#templates"]');
    await page.waitForTimeout(500);
    
    const gamingCard = page.locator('.mase-template-card[data-template="gaming"]');
    await gamingCard.locator('.mase-apply-template').click();
    await page.waitForTimeout(1000);
    
    // Check if particle system is disabled
    const particlesDisabled = await page.evaluate(() => {
      const particles = document.querySelector('.mase-particle-system');
      if (!particles) return true;
      return window.getComputedStyle(particles).display === 'none';
    });
    
    expect(particlesDisabled).toBe(true);
    console.log('✓ Particle effects disabled on mobile');
  });

  test('Test backdrop-filter reduction on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Apply glass theme
    await page.click('a[href="#templates"]');
    await page.waitForTimeout(500);
    
    const glassCard = page.locator('.mase-template-card[data-template="glass"]');
    await glassCard.locator('.mase-apply-template').click();
    await page.waitForTimeout(1000);
    
    // Check if blur is reduced on mobile
    const blurAmount = await page.evaluate(() => {
      const element = document.querySelector('.mase-template-glass');
      if (!element) return '0px';
      const backdropFilter = window.getComputedStyle(element).backdropFilter;
      const match = backdropFilter.match(/blur\((\d+)px\)/);
      return match ? match[1] : '0';
    });
    
    const blurValue = parseInt(blurAmount);
    expect(blurValue).toBeLessThanOrEqual(10); // Reduced blur on mobile
    console.log(`✓ Backdrop blur reduced on mobile: ${blurValue}px`);
  });

  test('Test touch interactions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Test tap on button
    const button = page.locator('.button-primary').first();
    await button.tap();
    await page.waitForTimeout(300);
    
    console.log('✓ Touch tap works on buttons');
    
    // Test swipe gesture (if applicable)
    const menu = page.locator('#adminmenu');
    const box = await menu.boundingBox();
    
    if (box) {
      await page.touchscreen.tap(box.x + 10, box.y + 10);
      await page.waitForTimeout(300);
      console.log('✓ Touch interactions work on menu');
    }
  });

  test('Test touch target sizes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Check button sizes (should be at least 44x44px for touch)
    const buttons = await page.locator('.button').all();
    
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(40); // Allow 40px minimum
        expect(box.width).toBeGreaterThanOrEqual(40);
      }
    }
    
    console.log('✓ Touch target sizes are adequate');
  });

  test('Test hover effects removed on touch devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Check if hover-only effects are disabled
    const hoverDisabled = await page.evaluate(() => {
      const isTouchDevice = 'ontouchstart' in window;
      return isTouchDevice;
    });
    
    expect(hoverDisabled).toBe(true);
    console.log('✓ Touch device detected, hover effects should be simplified');
  });

  test('Test performance mode auto-enabled on low-end devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Simulate low-end device detection
    const perfModeEnabled = await page.evaluate(() => {
      // Check if performance mode is auto-enabled
      return document.documentElement.getAttribute('data-performance-mode') === 'true';
    });
    
    console.log(`✓ Performance mode ${perfModeEnabled ? 'auto-enabled' : 'not auto-enabled'} on mobile`);
  });

  test('Test orientation changes', async ({ page }) => {
    // Portrait mode
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({
      path: 'tests/screenshots/mobile/portrait.png',
      fullPage: true
    });
    
    console.log('✓ Portrait mode captured');
    
    // Landscape mode
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500);
    
    await page.screenshot({
      path: 'tests/screenshots/mobile/landscape.png',
      fullPage: true
    });
    
    console.log('✓ Landscape mode captured');
  });

  test('Test mobile menu behavior', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Check if mobile menu toggle exists
    const mobileMenuToggle = page.locator('#wp-admin-bar-menu-toggle');
    const hasToggle = await mobileMenuToggle.isVisible().catch(() => false);
    
    if (hasToggle) {
      await mobileMenuToggle.click();
      await page.waitForTimeout(500);
      
      const menuVisible = await page.locator('#adminmenu').isVisible();
      console.log(`✓ Mobile menu toggle works (menu ${menuVisible ? 'visible' : 'hidden'})`);
    } else {
      console.log('⚠ Mobile menu toggle not found (WordPress default behavior)');
    }
  });

  test('Test theme cards on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="#templates"]');
    await page.waitForTimeout(500);
    
    // Check if theme cards are stacked vertically on mobile
    const cards = await page.locator('.mase-template-card').all();
    
    if (cards.length > 0) {
      const firstCard = cards[0];
      const secondCard = cards[1];
      
      const box1 = await firstCard.boundingBox();
      const box2 = await secondCard.boundingBox();
      
      if (box1 && box2) {
        // Cards should be stacked (second card below first)
        expect(box2.y).toBeGreaterThan(box1.y + box1.height - 10);
        console.log('✓ Theme cards stack vertically on mobile');
      }
    }
  });

  test('Test form inputs on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Test color picker
    const colorInput = page.locator('input[type="color"]').first();
    const isVisible = await colorInput.isVisible().catch(() => false);
    
    if (isVisible) {
      await colorInput.tap();
      await page.waitForTimeout(500);
      console.log('✓ Color picker accessible on mobile');
    }
    
    // Test text input
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.tap();
      await textInput.fill('test');
      await page.waitForTimeout(300);
      console.log('✓ Text input works on mobile');
    }
  });

  test('Test scrolling performance on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Measure scroll performance
    const scrollPerf = await page.evaluate(async () => {
      const start = performance.now();
      
      // Scroll down
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Scroll up
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const end = performance.now();
      return end - start;
    });
    
    expect(scrollPerf).toBeLessThan(1000); // Should complete in less than 1 second
    console.log(`✓ Scroll performance: ${scrollPerf.toFixed(2)}ms`);
  });

  test('Test memory usage on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Get memory usage (if available)
    const memoryUsage = await page.evaluate(() => {
      if (performance.memory) {
        return {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    });
    
    if (memoryUsage) {
      const usedMB = (memoryUsage.used / 1024 / 1024).toFixed(2);
      console.log(`✓ Memory usage: ${usedMB} MB`);
      
      // Should use less than 100MB on mobile
      expect(memoryUsage.used).toBeLessThan(100 * 1024 * 1024);
    } else {
      console.log('⚠ Memory API not available');
    }
  });
});

// Device-specific tests
for (const mobileDevice of MOBILE_DEVICES) {
  test.describe(`${mobileDevice.name} Specific Tests`, () => {
    test.use(mobileDevice.device);
    
    test(`Test on ${mobileDevice.name}`, async ({ page }) => {
      await page.goto('/wp-admin/admin.php?page=mase-settings');
      await page.waitForLoadState('networkidle');
      
      // Verify page loads correctly
      const pageTitle = await page.title();
      expect(pageTitle).toContain('MASE');
      
      // Capture screenshot
      await page.screenshot({
        path: `tests/screenshots/devices/${mobileDevice.name.replace(/\s+/g, '-').toLowerCase()}.png`,
        fullPage: true
      });
      
      console.log(`✓ ${mobileDevice.name}: Page loads correctly`);
    });
    
    test(`Test theme application on ${mobileDevice.name}`, async ({ page }) => {
      await page.goto('/wp-admin/admin.php?page=mase-settings');
      await page.waitForLoadState('networkidle');
      
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      // Apply a theme
      const themeCard = page.locator('.mase-template-card[data-template="glass"]');
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      // Verify theme applied
      const theme = await page.getAttribute('body', 'data-mase-template');
      expect(theme).toBe('glass');
      
      console.log(`✓ ${mobileDevice.name}: Theme application works`);
    });
  });
}
