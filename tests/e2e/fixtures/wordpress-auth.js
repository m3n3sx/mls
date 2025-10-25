/**
 * WordPress Authentication Fixtures for Playwright E2E Tests
 * 
 * Provides reusable authentication setup for WordPress admin tests
 */

import { test as base } from '@playwright/test';

/**
 * WordPress admin credentials
 * Override with environment variables for CI/CD
 */
const WP_ADMIN_USER = process.env.WP_ADMIN_USER || 'admin';
const WP_ADMIN_PASSWORD = process.env.WP_ADMIN_PASSWORD || 'password';
const WP_BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8080';

/**
 * Extended test fixture with WordPress authentication
 */
export const test = base.extend({
  /**
   * Authenticated page fixture
   * Automatically logs in to WordPress admin before each test
   */
  authenticatedPage: async ({ page }, use) => {
    // Navigate to WordPress login page
    await page.goto(`${WP_BASE_URL}/wp-login.php`);
    
    // Fill in login credentials
    await page.fill('#user_login', WP_ADMIN_USER);
    await page.fill('#user_pass', WP_ADMIN_PASSWORD);
    
    // Submit login form
    await page.click('#wp-submit');
    
    // Wait for successful login (redirect to admin dashboard)
    await page.waitForURL(/wp-admin/, { timeout: 10000 });
    
    // Verify we're logged in by checking for admin bar
    await page.waitForSelector('#wpadminbar', { timeout: 5000 });
    
    // Use the authenticated page in the test
    await use(page);
    
    // Cleanup: logout after test
    await page.goto(`${WP_BASE_URL}/wp-login.php?action=logout`);
    await page.click('a:has-text("log out")').catch(() => {
      // Ignore if logout link not found
    });
  },
  
  /**
   * MASE settings page fixture
   * Navigates to MASE settings page after authentication
   */
  maseSettingsPage: async ({ page }, use) => {
    // Navigate to WordPress login page
    await page.goto(`${WP_BASE_URL}/wp-login.php`);
    
    // Fill in login credentials
    await page.fill('#user_login', WP_ADMIN_USER);
    await page.fill('#user_pass', WP_ADMIN_PASSWORD);
    
    // Submit login form
    await page.click('#wp-submit');
    
    // Wait for successful login
    await page.waitForURL(/wp-admin/, { timeout: 10000 });
    
    // Navigate to MASE settings page
    await page.goto(`${WP_BASE_URL}/wp-admin/admin.php?page=modern-admin-styler`);
    
    // Wait for MASE page to load
    await page.waitForSelector('.mase-admin-wrapper', { timeout: 10000 });
    
    // Use the MASE settings page in the test
    await use(page);
    
    // Cleanup: logout after test
    await page.goto(`${WP_BASE_URL}/wp-login.php?action=logout`);
    await page.click('a:has-text("log out")').catch(() => {
      // Ignore if logout link not found
    });
  },
});

/**
 * Helper function to login to WordPress admin
 * Use this for manual login in tests that need custom setup
 */
export async function loginToWordPress(page, username = WP_ADMIN_USER, password = WP_ADMIN_PASSWORD) {
  await page.goto(`${WP_BASE_URL}/wp-login.php`);
  await page.fill('#user_login', username);
  await page.fill('#user_pass', password);
  await page.click('#wp-submit');
  await page.waitForURL(/wp-admin/, { timeout: 10000 });
  await page.waitForSelector('#wpadminbar', { timeout: 5000 });
}

/**
 * Helper function to logout from WordPress admin
 */
export async function logoutFromWordPress(page) {
  await page.goto(`${WP_BASE_URL}/wp-login.php?action=logout`);
  await page.click('a:has-text("log out")').catch(() => {
    // Ignore if logout link not found
  });
}

/**
 * Helper function to navigate to MASE settings page
 */
export async function navigateToMASESettings(page) {
  await page.goto(`${WP_BASE_URL}/wp-admin/admin.php?page=modern-admin-styler`);
  await page.waitForSelector('.mase-admin-wrapper', { timeout: 10000 });
}

/**
 * Helper function to wait for AJAX requests to complete
 */
export async function waitForAjaxComplete(page, timeout = 5000) {
  await page.waitForFunction(
    () => {
      // Check if jQuery is available and no active AJAX requests
      return typeof window.jQuery !== 'undefined' && window.jQuery.active === 0;
    },
    { timeout }
  );
}

/**
 * Helper function to get WordPress nonce from page
 */
export async function getWordPressNonce(page, nonceId = 'mase_nonce') {
  return await page.evaluate((id) => {
    const nonceInput = document.getElementById(id);
    return nonceInput ? nonceInput.value : null;
  }, nonceId);
}

export { expect } from '@playwright/test';
