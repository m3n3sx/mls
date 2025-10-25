/**
 * Example E2E Test for MASE Plugin
 * 
 * Demonstrates how to use WordPress authentication fixtures
 * and test MASE functionality
 */

import { test, expect } from './fixtures/wordpress-auth.js';

test.describe('MASE Settings Page', () => {
  test('should load MASE settings page successfully', async ({ maseSettingsPage }) => {
    // Verify page title
    await expect(maseSettingsPage).toHaveTitle(/Modern Admin Styler/);
    
    // Verify main wrapper is visible
    const wrapper = maseSettingsPage.locator('.mase-admin-wrapper');
    await expect(wrapper).toBeVisible();
    
    // Verify header is present
    const header = maseSettingsPage.locator('.mase-header');
    await expect(header).toBeVisible();
    
    // Verify tabs are present
    const tabs = maseSettingsPage.locator('.mase-tabs');
    await expect(tabs).toBeVisible();
  });
  
  test('should display all main tabs', async ({ maseSettingsPage }) => {
    // Check for main tabs
    const adminBarTab = maseSettingsPage.locator('[data-tab="admin-bar"]');
    const adminMenuTab = maseSettingsPage.locator('[data-tab="admin-menu"]');
    const contentTab = maseSettingsPage.locator('[data-tab="content"]');
    const typographyTab = maseSettingsPage.locator('[data-tab="typography"]');
    const effectsTab = maseSettingsPage.locator('[data-tab="effects"]');
    const templatesTab = maseSettingsPage.locator('[data-tab="templates"]');
    const advancedTab = maseSettingsPage.locator('[data-tab="advanced"]');
    
    await expect(adminBarTab).toBeVisible();
    await expect(adminMenuTab).toBeVisible();
    await expect(contentTab).toBeVisible();
    await expect(typographyTab).toBeVisible();
    await expect(effectsTab).toBeVisible();
    await expect(templatesTab).toBeVisible();
    await expect(advancedTab).toBeVisible();
  });
  
  test('should switch between tabs', async ({ maseSettingsPage }) => {
    // Click on Typography tab
    await maseSettingsPage.click('[data-tab="typography"]');
    
    // Verify Typography tab content is visible
    const typographyContent = maseSettingsPage.locator('#typography-tab');
    await expect(typographyContent).toBeVisible();
    
    // Verify active tab class
    const typographyTab = maseSettingsPage.locator('[data-tab="typography"]');
    await expect(typographyTab).toHaveClass(/active/);
  });
});

test.describe('WordPress Admin Authentication', () => {
  test('should authenticate and access admin dashboard', async ({ authenticatedPage }) => {
    // Navigate to admin dashboard
    await authenticatedPage.goto('/wp-admin/');
    
    // Verify admin bar is present
    const adminBar = authenticatedPage.locator('#wpadminbar');
    await expect(adminBar).toBeVisible();
    
    // Verify user is logged in
    const userInfo = authenticatedPage.locator('#wp-admin-bar-my-account');
    await expect(userInfo).toBeVisible();
  });
});
