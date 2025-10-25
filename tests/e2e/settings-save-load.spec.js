/**
 * E2E Test: Settings Save/Load Workflow
 * 
 * Tests the complete settings save and load workflow including:
 * - Load page → Change settings → Save → Reload → Verify persistence
 * - Network failure and retry
 * - Concurrent save prevention
 * 
 * Task 15.1
 * Requirements: 11.3
 */

import { test, expect } from './fixtures/wordpress-auth.js';

test.describe('Settings Save/Load Workflow', () => {
  test('should save settings and persist after page reload', async ({ maseSettingsPage }) => {
    // Step 1: Load page and verify initial state
    await expect(maseSettingsPage.locator('.mase-admin-wrapper')).toBeVisible();
    
    // Step 2: Change a setting (admin bar background color)
    const colorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    await expect(colorInput).toBeVisible();
    
    // Get original value
    const originalColor = await colorInput.inputValue();
    const newColor = '#ff5733'; // Test color
    
    // Change the color
    await colorInput.fill(newColor);
    await colorInput.blur(); // Trigger change event
    
    // Wait a moment for state update
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 3: Save settings
    const saveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    
    // Wait for save to complete (look for success message or button state change)
    await maseSettingsPage.waitForSelector('.mase-notice-success, .notice-success', {
      timeout: 10000,
      state: 'visible',
    }).catch(() => {
      // If no success notice, wait for save button to be enabled again
      return maseSettingsPage.waitForSelector('button:has-text("Save Settings"):not([disabled])', {
        timeout: 10000,
      });
    });
    
    // Step 4: Reload the page
    await maseSettingsPage.reload();
    await maseSettingsPage.waitForSelector('.mase-admin-wrapper', { timeout: 10000 });
    
    // Step 5: Verify the setting persisted
    const reloadedColorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    await expect(reloadedColorInput).toBeVisible();
    
    const persistedColor = await reloadedColorInput.inputValue();
    expect(persistedColor).toBe(newColor);
    
    // Cleanup: Restore original value
    await reloadedColorInput.fill(originalColor);
    await reloadedColorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    
    const cleanupSaveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    await cleanupSaveButton.click();
    await maseSettingsPage.waitForTimeout(2000);
  });
  
  test('should handle network failure with retry', async ({ maseSettingsPage, page }) => {
    // Step 1: Setup network interception to simulate failure
    let requestCount = 0;
    
    await page.route('**/wp-json/mase/v1/settings', async (route) => {
      requestCount++;
      
      // Fail first 2 attempts, succeed on 3rd
      if (requestCount <= 2) {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });
    
    // Step 2: Change a setting
    const colorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    await expect(colorInput).toBeVisible();
    
    const originalColor = await colorInput.inputValue();
    const newColor = '#33ff57';
    
    await colorInput.fill(newColor);
    await colorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 3: Attempt to save (should retry and eventually succeed)
    const saveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    await saveButton.click();
    
    // Wait for retries to complete and save to succeed
    await maseSettingsPage.waitForTimeout(5000);
    
    // Verify at least 3 requests were made (initial + 2 retries)
    expect(requestCount).toBeGreaterThanOrEqual(3);
    
    // Cleanup: Remove route interception
    await page.unroute('**/wp-json/mase/v1/settings');
    
    // Restore original value
    await colorInput.fill(originalColor);
    await colorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    await saveButton.click();
    await maseSettingsPage.waitForTimeout(2000);
  });
  
  test('should prevent concurrent save operations', async ({ maseSettingsPage, page }) => {
    // Step 1: Track save requests
    const saveRequests = [];
    
    await page.on('request', (request) => {
      if (request.url().includes('/wp-json/mase/v1/settings') && request.method() === 'POST') {
        saveRequests.push({
          timestamp: Date.now(),
          url: request.url(),
        });
      }
    });
    
    // Step 2: Change a setting
    const colorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    await expect(colorInput).toBeVisible();
    
    const originalColor = await colorInput.inputValue();
    const newColor = '#5733ff';
    
    await colorInput.fill(newColor);
    await colorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 3: Click save button multiple times rapidly
    const saveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    
    // Click 3 times rapidly
    await saveButton.click();
    await saveButton.click();
    await saveButton.click();
    
    // Wait for all operations to complete
    await maseSettingsPage.waitForTimeout(5000);
    
    // Step 4: Verify only one save request was made (concurrent prevention)
    // Note: Due to request queuing, we should see only 1 request
    expect(saveRequests.length).toBeLessThanOrEqual(1);
    
    // Cleanup: Restore original value
    await colorInput.fill(originalColor);
    await colorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    await saveButton.click();
    await maseSettingsPage.waitForTimeout(2000);
  });
  
  test('should show loading state during save', async ({ maseSettingsPage }) => {
    // Step 1: Change a setting
    const colorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    await expect(colorInput).toBeVisible();
    
    const originalColor = await colorInput.inputValue();
    const newColor = '#ff33a1';
    
    await colorInput.fill(newColor);
    await colorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 2: Click save and immediately check for loading state
    const saveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    await saveButton.click();
    
    // Verify button is disabled or shows loading state
    await expect(saveButton).toBeDisabled().catch(() => {
      // Alternative: check for loading class or text
      return expect(saveButton).toHaveClass(/loading|saving/);
    });
    
    // Wait for save to complete
    await maseSettingsPage.waitForTimeout(3000);
    
    // Verify button is enabled again
    await expect(saveButton).toBeEnabled();
    
    // Cleanup: Restore original value
    await colorInput.fill(originalColor);
    await colorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    await saveButton.click();
    await maseSettingsPage.waitForTimeout(2000);
  });
  
  test('should load settings from server on page load', async ({ maseSettingsPage, page }) => {
    // Step 1: Intercept settings load request
    let settingsLoaded = false;
    
    await page.on('response', async (response) => {
      if (response.url().includes('/wp-json/mase/v1/settings') && response.request().method() === 'GET') {
        settingsLoaded = true;
        
        // Verify response is valid
        const data = await response.json().catch(() => null);
        expect(data).toBeTruthy();
        expect(data).toHaveProperty('settings');
      }
    });
    
    // Step 2: Reload page to trigger settings load
    await maseSettingsPage.reload();
    await maseSettingsPage.waitForSelector('.mase-admin-wrapper', { timeout: 10000 });
    
    // Step 3: Verify settings were loaded
    expect(settingsLoaded).toBe(true);
    
    // Step 4: Verify UI is populated with loaded settings
    const colorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    await expect(colorInput).toBeVisible();
    
    const colorValue = await colorInput.inputValue();
    expect(colorValue).toMatch(/^#[0-9a-fA-F]{6}$/); // Valid hex color
  });
});
