/**
 * Quick Smoke Test - MASE Core Functionality
 * 
 * Szybki test sprawdzający podstawową funkcjonalność
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8080';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin';

test.describe('MASE Quick Smoke Test', () => {
    
    test('1. WordPress admin is accessible', async ({ page }) => {
        console.log('TEST 1: Sprawdzanie dostępności WordPress admin...');
        
        await page.goto(`${BASE_URL}/wp-admin/`);
        
        // Should redirect to login or show admin
        const url = page.url();
        expect(url).toContain('wp-admin');
        
        console.log('✓ WordPress admin jest dostępny');
    });
    
    test('2. Can login to WordPress', async ({ page }) => {
        console.log('TEST 2: Logowanie do WordPress...');
        
        await page.goto(`${BASE_URL}/wp-login.php`);
        
        // Fill login form
        await page.fill('#user_login', ADMIN_USER);
        await page.fill('#user_pass', ADMIN_PASS);
        await page.click('#wp-submit');
        
        // Wait for redirect
        await page.waitForURL('**/wp-admin/**', { timeout: 10000 });
        
        // Should be on admin page
        expect(page.url()).toContain('wp-admin');
        
        console.log('✓ Logowanie zakończone sukcesem');
    });
    
    test('3. MASE settings page exists', async ({ page }) => {
        console.log('TEST 3: Sprawdzanie strony ustawień MASE...');
        
        // Login first
        await page.goto(`${BASE_URL}/wp-login.php`);
        await page.fill('#user_login', ADMIN_USER);
        await page.fill('#user_pass', ADMIN_PASS);
        await page.click('#wp-submit');
        await page.waitForURL('**/wp-admin/**', { timeout: 10000 });
        
        // Navigate to MASE settings
        await page.goto(`${BASE_URL}/wp-admin/admin.php?page=mase-settings`);
        await page.waitForLoadState('networkidle');
        
        // Check if settings page loaded
        const settingsPage = await page.locator('.mase-settings-page');
        await expect(settingsPage).toBeVisible({ timeout: 10000 });
        
        console.log('✓ Strona ustawień MASE istnieje');
    });
    
    test('4. Live Preview toggle exists', async ({ page }) => {
        console.log('TEST 4: Sprawdzanie przycisku Live Preview...');
        
        // Login and navigate
        await page.goto(`${BASE_URL}/wp-login.php`);
        await page.fill('#user_login', ADMIN_USER);
        await page.fill('#user_pass', ADMIN_PASS);
        await page.click('#wp-submit');
        await page.waitForURL('**/wp-admin/**', { timeout: 10000 });
        
        await page.goto(`${BASE_URL}/wp-admin/admin.php?page=mase-settings`);
        await page.waitForLoadState('networkidle');
        
        // Check for Live Preview toggle
        const toggle = await page.locator('#mase-live-preview-toggle');
        await expect(toggle).toBeVisible({ timeout: 5000 });
        
        console.log('✓ Przycisk Live Preview istnieje');
    });
    
    test('5. Can enable Live Preview', async ({ page }) => {
        console.log('TEST 5: Włączanie Live Preview...');
        
        // Login and navigate
        await page.goto(`${BASE_URL}/wp-login.php`);
        await page.fill('#user_login', ADMIN_USER);
        await page.fill('#user_pass', ADMIN_PASS);
        await page.click('#wp-submit');
        await page.waitForURL('**/wp-admin/**', { timeout: 10000 });
        
        await page.goto(`${BASE_URL}/wp-admin/admin.php?page=mase-settings`);
        await page.waitForLoadState('networkidle');
        
        // Click Live Preview toggle
        const toggle = await page.locator('#mase-live-preview-toggle');
        await toggle.click();
        await page.waitForTimeout(1000);
        
        // Check if enabled
        const isChecked = await toggle.isChecked();
        expect(isChecked).toBe(true);
        
        // Check if live preview CSS is injected
        const livePreviewStyle = await page.locator('#mase-live-preview-css');
        await expect(livePreviewStyle).toBeAttached();
        
        console.log('✓ Live Preview włączony pomyślnie');
    });
    
    test('6. Save Settings button exists', async ({ page }) => {
        console.log('TEST 6: Sprawdzanie przycisku Save Settings...');
        
        // Login and navigate
        await page.goto(`${BASE_URL}/wp-login.php`);
        await page.fill('#user_login', ADMIN_USER);
        await page.fill('#user_pass', ADMIN_PASS);
        await page.click('#wp-submit');
        await page.waitForURL('**/wp-admin/**', { timeout: 10000 });
        
        await page.goto(`${BASE_URL}/wp-admin/admin.php?page=mase-settings`);
        await page.waitForLoadState('networkidle');
        
        // Check for Save button
        const saveButton = await page.locator('button:has-text("Save Settings")').first();
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        
        console.log('✓ Przycisk Save Settings istnieje');
    });
    
    test('7. Palette cards exist', async ({ page }) => {
        console.log('TEST 7: Sprawdzanie kart palet kolorów...');
        
        // Login and navigate
        await page.goto(`${BASE_URL}/wp-login.php`);
        await page.fill('#user_login', ADMIN_USER);
        await page.fill('#user_pass', ADMIN_PASS);
        await page.click('#wp-submit');
        await page.waitForURL('**/wp-admin/**', { timeout: 10000 });
        
        await page.goto(`${BASE_URL}/wp-admin/admin.php?page=mase-settings`);
        await page.waitForLoadState('networkidle');
        
        // Check for palette cards
        const paletteCards = await page.locator('.mase-palette-card');
        const count = await paletteCards.count();
        
        expect(count).toBeGreaterThan(0);
        console.log(`✓ Znaleziono ${count} kart palet kolorów`);
    });
    
    test('8. No JavaScript errors on page load', async ({ page }) => {
        console.log('TEST 8: Sprawdzanie błędów JavaScript...');
        
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        // Login and navigate
        await page.goto(`${BASE_URL}/wp-login.php`);
        await page.fill('#user_login', ADMIN_USER);
        await page.fill('#user_pass', ADMIN_PASS);
        await page.click('#wp-submit');
        await page.waitForURL('**/wp-admin/**', { timeout: 10000 });
        
        await page.goto(`${BASE_URL}/wp-admin/admin.php?page=mase-settings`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Filter out known non-critical errors
        const criticalErrors = errors.filter(err => 
            !err.includes('favicon') && 
            !err.includes('chrome-extension')
        );
        
        if (criticalErrors.length > 0) {
            console.log('⚠️  Znalezione błędy:', criticalErrors);
        }
        
        expect(criticalErrors.length).toBe(0);
        console.log('✓ Brak błędów JavaScript');
    });
});
