/**
 * Global setup for Playwright tests
 * Performs one-time authentication before all tests
 */

import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8080';
const ADMIN_USER = process.env.WP_ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.WP_ADMIN_PASS || 'admin123';
const AUTH_FILE = 'tests/e2e/.auth/user.json';

async function globalSetup() {
    console.log('=== Global Setup: Authenticating ===');
    
    // Ensure .auth directory exists
    mkdirSync(dirname(AUTH_FILE), { recursive: true });
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
        // Login to WordPress
        console.log(`Logging in to ${BASE_URL}...`);
        await page.goto(`${BASE_URL}/wp-login.php`);
        await page.fill('#user_login', ADMIN_USER);
        await page.fill('#user_pass', ADMIN_PASS);
        await page.click('#wp-submit');
        
        // Wait for successful login
        await page.waitForURL('**/wp-admin/**', { timeout: 10000 });
        console.log('✓ Login successful');
        
        // Verify admin bar is present
        const adminBar = await page.locator('#wpadminbar');
        await adminBar.waitFor({ state: 'visible', timeout: 5000 });
        console.log('✓ Admin bar visible');
        
        // Save authentication state
        await page.context().storageState({ path: AUTH_FILE });
        console.log(`✓ Authentication state saved to ${AUTH_FILE}`);
        
    } catch (error) {
        console.error('❌ Global setup failed:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
    
    console.log('=== Global Setup Complete ===\n');
}

export default globalSetup;
