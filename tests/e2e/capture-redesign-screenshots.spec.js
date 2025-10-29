/**
 * Screenshot Capture Script for Visual Redesign Documentation
 * 
 * This script captures comprehensive before/after screenshots of the MASE
 * settings page redesign across different viewports and states.
 * 
 * Usage:
 * npx playwright test tests/e2e/capture-redesign-screenshots.spec.js
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

// Configuration
const SCREENSHOT_DIR = 'docs/screenshots/redesign';
const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 }
};

const TABS = [
  { id: 'general', name: 'General' },
  { id: 'admin-bar', name: 'Admin Bar' },
  { id: 'menu', name: 'Menu' },
  { id: 'content', name: 'Content' },
  { id: 'typography', name: 'Typography' },
  { id: 'effects', name: 'Effects' },
  { id: 'templates', name: 'Templates' },
  { id: 'advanced', name: 'Advanced' }
];

test.describe('Visual Redesign Screenshot Capture', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login to WordPress admin
    await page.goto('http://localhost:8080/wp-login.php');
    await page.fill('#user_login', 'admin');
    await page.fill('#user_pass', 'password');
    await page.click('#wp-submit');
    await page.waitForLoadState('networkidle');
    
    // Navigate to MASE settings page
    await page.goto('http://localhost:8080/wp-admin/admin.php?page=modern-admin-styler');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for any animations
  });

  // Desktop Screenshots
  test('Capture desktop screenshots - light mode', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    
    // Ensure light mode
    const darkModeToggle = page.locator('.mase-dark-mode-fab');
    if (await darkModeToggle.isVisible()) {
      const isDarkMode = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') === 'dark';
      });
      if (isDarkMode) {
        await darkModeToggle.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Capture each tab
    for (const tab of TABS) {
      // Click tab
      const tabButton = page.locator(`.mase-tab-button:has-text("${tab.name}")`);
      if (await tabButton.isVisible()) {
        await tabButton.click();
        await page.waitForTimeout(500);
        
        // Capture screenshot
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `after-desktop-${tab.id}.png`),
          fullPage: true
        });
      }
    }
    
    // Capture header detail
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'after-desktop-header-detail.png'),
      clip: { x: 0, y: 0, width: 1920, height: 200 }
    });
  });

  test('Capture desktop screenshots - dark mode', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    
    // Enable dark mode
    const darkModeToggle = page.locator('.mase-dark-mode-fab');
    if (await darkModeToggle.isVisible()) {
      const isDarkMode = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') === 'dark';
      });
      if (!isDarkMode) {
        await darkModeToggle.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Capture each tab in dark mode
    for (const tab of TABS) {
      const tabButton = page.locator(`.mase-tab-button:has-text("${tab.name}")`);
      if (await tabButton.isVisible()) {
        await tabButton.click();
        await page.waitForTimeout(500);
        
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `after-dark-${tab.id}.png`),
          fullPage: true
        });
      }
    }
  });

  // Tablet Screenshots
  test('Capture tablet screenshots', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    
    // Ensure light mode
    const darkModeToggle = page.locator('.mase-dark-mode-fab');
    if (await darkModeToggle.isVisible()) {
      const isDarkMode = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') === 'dark';
      });
      if (isDarkMode) {
        await darkModeToggle.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Capture main page
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'after-tablet-main-page.png'),
      fullPage: true
    });
    
    // Capture tab navigation
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'after-tablet-tab-navigation.png'),
      clip: { x: 0, y: 0, width: 768, height: 150 }
    });
    
    // Capture palette grid (Admin Bar tab)
    const adminBarTab = page.locator('.mase-tab-button:has-text("Admin Bar")');
    if (await adminBarTab.isVisible()) {
      await adminBarTab.click();
      await page.waitForTimeout(500);
      
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'after-tablet-admin-bar.png'),
        fullPage: true
      });
    }
  });

  // Mobile Screenshots
  test('Capture mobile screenshots', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    
    // Ensure light mode
    const darkModeToggle = page.locator('.mase-dark-mode-fab');
    if (await darkModeToggle.isVisible()) {
      const isDarkMode = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') === 'dark';
      });
      if (isDarkMode) {
        await darkModeToggle.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Capture main page
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'after-mobile-main-page.png'),
      fullPage: true
    });
    
    // Capture stacked header
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'after-mobile-header-stacked.png'),
      clip: { x: 0, y: 0, width: 375, height: 250 }
    });
    
    // Capture wrapped tabs
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'after-mobile-tabs-wrapped.png'),
      clip: { x: 0, y: 200, width: 375, height: 200 }
    });
    
    // Capture single column grid
    const adminBarTab = page.locator('.mase-tab-button:has-text("Admin Bar")');
    if (await adminBarTab.isVisible()) {
      await adminBarTab.click();
      await page.waitForTimeout(500);
      
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'after-mobile-single-column-grid.png'),
        fullPage: true
      });
    }
  });

  // Component Detail Screenshots
  test('Capture component details', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    
    // Toggle switch detail
    const generalTab = page.locator('.mase-tab-button:has-text("General")');
    if (await generalTab.isVisible()) {
      await generalTab.click();
      await page.waitForTimeout(500);
      
      const toggleSwitch = page.locator('.mase-toggle-switch').first();
      if (await toggleSwitch.isVisible()) {
        await toggleSwitch.screenshot({
          path: path.join(SCREENSHOT_DIR, 'after-component-toggle-switch.png')
        });
      }
    }
    
    // Color picker detail
    const adminBarTab = page.locator('.mase-tab-button:has-text("Admin Bar")');
    if (await adminBarTab.isVisible()) {
      await adminBarTab.click();
      await page.waitForTimeout(500);
      
      const colorPicker = page.locator('.mase-color-picker-wrapper').first();
      if (await colorPicker.isVisible()) {
        await colorPicker.screenshot({
          path: path.join(SCREENSHOT_DIR, 'after-component-color-picker.png')
        });
      }
    }
    
    // Range slider detail
    const rangeSlider = page.locator('.mase-range-wrapper').first();
    if (await rangeSlider.isVisible()) {
      await rangeSlider.screenshot({
        path: path.join(SCREENSHOT_DIR, 'after-component-range-slider.png')
      });
    }
    
    // Palette card detail
    const paletteCard = page.locator('.mase-palette-card').first();
    if (await paletteCard.isVisible()) {
      await paletteCard.screenshot({
        path: path.join(SCREENSHOT_DIR, 'after-component-palette-card.png')
      });
    }
    
    // Button group detail
    const headerButtons = page.locator('.mase-header-right');
    if (await headerButtons.isVisible()) {
      await headerButtons.screenshot({
        path: path.join(SCREENSHOT_DIR, 'after-component-button-group.png')
      });
    }
  });

  // Interactive State Screenshots
  test('Capture interactive states', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    
    // Hover state on palette card
    const paletteCard = page.locator('.mase-palette-card').first();
    if (await paletteCard.isVisible()) {
      await paletteCard.hover();
      await page.waitForTimeout(300);
      await paletteCard.screenshot({
        path: path.join(SCREENSHOT_DIR, 'after-state-palette-card-hover.png')
      });
    }
    
    // Active tab state
    const activeTab = page.locator('.mase-tab-button.active');
    if (await activeTab.isVisible()) {
      await activeTab.screenshot({
        path: path.join(SCREENSHOT_DIR, 'after-state-tab-active.png')
      });
    }
    
    // Focus state on button
    const saveButton = page.locator('.button-primary:has-text("Save")');
    if (await saveButton.isVisible()) {
      await saveButton.focus();
      await page.waitForTimeout(200);
      await saveButton.screenshot({
        path: path.join(SCREENSHOT_DIR, 'after-state-button-focus.png')
      });
    }
  });

  // Comparison Screenshots
  test('Capture side-by-side comparisons', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    
    // Full page overview
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'after-full-page-overview.png'),
      fullPage: true
    });
    
    // Header comparison
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'after-header-comparison.png'),
      clip: { x: 0, y: 0, width: 1920, height: 150 }
    });
    
    // Tab navigation comparison
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'after-tabs-comparison.png'),
      clip: { x: 0, y: 150, width: 1920, height: 100 }
    });
    
    // Card comparison
    const sectionCard = page.locator('.mase-section-card').first();
    if (await sectionCard.isVisible()) {
      await sectionCard.screenshot({
        path: path.join(SCREENSHOT_DIR, 'after-card-comparison.png')
      });
    }
  });
});

// Helper function to create screenshot directory
test.beforeAll(async () => {
  const fs = require('fs');
  const screenshotPath = path.join(process.cwd(), SCREENSHOT_DIR);
  
  if (!fs.existsSync(screenshotPath)) {
    fs.mkdirSync(screenshotPath, { recursive: true });
  }
});
