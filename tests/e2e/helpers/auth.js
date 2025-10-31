/**
 * Authentication helpers for E2E tests
 * Handles WordPress login and session persistence
 */

const ADMIN_USER = process.env.WP_ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.WP_ADMIN_PASS || 'admin';

/**
 * Login to WordPress and save authentication state
 * @param {Page} page - Playwright page object
 * @param {string} baseUrl - WordPress base URL
 */
export async function loginAndSaveState(page, baseUrl) {
    console.log('Logging in to WordPress...');
    
    await page.goto(`${baseUrl}/wp-login.php`);
    await page.fill('#user_login', ADMIN_USER);
    await page.fill('#user_pass', ADMIN_PASS);
    await page.click('#wp-submit');
    
    // Wait for redirect to admin dashboard
    await page.waitForURL('**/wp-admin/**', { timeout: 10000 });
    
    // Save authentication state
    await page.context().storageState({ path: 'tests/e2e/.auth/user.json' });
    
    console.log('✓ Authentication state saved');
}

/**
 * Navigate to MASE settings page with authentication
 * @param {Page} page - Playwright page object
 * @param {string} baseUrl - WordPress base URL
 * @returns {Locator} Settings page wrapper element
 */
export async function navigateToMASESettings(page, baseUrl) {
    console.log('Navigating to MASE settings...');
    
    await page.goto(`${baseUrl}/wp-admin/admin.php?page=mase-settings`, {
        waitUntil: 'networkidle',
        timeout: 10000
    });
    
    // Verify we're on settings page (not redirected to login)
    const settingsPage = page.locator('.mase-settings-wrap');
    await settingsPage.waitFor({ state: 'visible', timeout: 5000 });
    
    console.log('✓ MASE settings page loaded');
    
    return settingsPage;
}

/**
 * Verify user is authenticated
 * @param {Page} page - Playwright page object
 * @returns {boolean} True if authenticated
 */
export async function isAuthenticated(page) {
    // Check for admin bar (only visible when logged in)
    const adminBar = page.locator('#wpadminbar');
    const count = await adminBar.count();
    return count > 0;
}
