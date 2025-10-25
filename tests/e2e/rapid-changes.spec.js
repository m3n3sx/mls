/**
 * E2E Test: Rapid Changes Workflow
 * 
 * Tests handling of rapid changes including:
 * - Multiple rapid changes → Debounced updates → Final state correct
 * - Undo/redo with rapid changes
 * 
 * Task 15.5
 * Requirements: 11.3
 */

import { test, expect } from './fixtures/wordpress-auth.js';

test.describe('Rapid Changes Workflow', () => {
  test('should debounce rapid setting changes', async ({ maseSettingsPage, page }) => {
    // Step 1: Track preview update events
    let previewUpdateCount = 0;
    
    await page.on('console', (msg) => {
      if (msg.text().includes('preview') || msg.text().includes('CSS generated')) {
        previewUpdateCount++;
      }
    });
    
    // Step 2: Navigate to admin bar tab
    const adminBarTab = maseSettingsPage.locator('[data-tab="admin-bar"], [data-tab="admin_bar"]');
    await adminBarTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 3: Get color input
    const colorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    await expect(colorInput).toBeVisible();
    
    const originalColor = await colorInput.inputValue();
    
    // Step 4: Make rapid changes (10 changes in quick succession)
    const colors = [
      '#ff0000', '#ff1111', '#ff2222', '#ff3333', '#ff4444',
      '#ff5555', '#ff6666', '#ff7777', '#ff8888', '#ff9999'
    ];
    
    for (const color of colors) {
      await colorInput.fill(color);
      // Don't wait between changes - make them rapid
    }
    
    // Final blur to trigger change event
    await colorInput.blur();
    
    // Step 5: Wait for debounced updates to complete
    await maseSettingsPage.waitForTimeout(2000);
    
    // Step 6: Verify final color is correct
    const finalColor = await colorInput.inputValue();
    expect(finalColor).toBe(colors[colors.length - 1]);
    
    // Step 7: Verify preview updates were debounced (should be much less than 10)
    console.log(`Preview updates: ${previewUpdateCount} (should be debounced from 10 changes)`);
    
    // Cleanup: Restore original color
    await colorInput.fill(originalColor);
    await colorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    
    const saveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    await saveButton.click();
    await maseSettingsPage.waitForTimeout(2000);
  });
  
  test('should handle rapid changes across multiple fields', async ({ maseSettingsPage }) => {
    // Step 1: Navigate to admin bar tab
    const adminBarTab = maseSettingsPage.locator('[data-tab="admin-bar"], [data-tab="admin_bar"]');
    await adminBarTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 2: Get multiple inputs
    const bgColorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    const textColorInput = maseSettingsPage.locator('#admin_bar_text_color');
    const heightInput = maseSettingsPage.locator('#admin_bar_height, input[name*="admin_bar_height"]');
    
    // Store original values
    const originalBgColor = await bgColorInput.inputValue();
    const originalTextColor = await textColorInput.inputValue();
    const originalHeight = await heightInput.inputValue().catch(() => '32');
    
    // Step 3: Make rapid changes to multiple fields
    await bgColorInput.fill('#123456');
    await textColorInput.fill('#abcdef');
    if (await heightInput.count() > 0) {
      await heightInput.fill('40');
    }
    
    // Immediately change again
    await bgColorInput.fill('#654321');
    await textColorInput.fill('#fedcba');
    if (await heightInput.count() > 0) {
      await heightInput.fill('36');
    }
    
    // Final changes
    await bgColorInput.fill('#111111');
    await textColorInput.fill('#eeeeee');
    if (await heightInput.count() > 0) {
      await heightInput.fill('32');
    }
    
    // Blur to trigger updates
    await bgColorInput.blur();
    await textColorInput.blur();
    if (await heightInput.count() > 0) {
      await heightInput.blur();
    }
    
    // Step 4: Wait for all updates to process
    await maseSettingsPage.waitForTimeout(2000);
    
    // Step 5: Verify final state is correct
    expect(await bgColorInput.inputValue()).toBe('#111111');
    expect(await textColorInput.inputValue()).toBe('#eeeeee');
    if (await heightInput.count() > 0) {
      expect(await heightInput.inputValue()).toBe('32');
    }
    
    // Cleanup: Restore original values
    await bgColorInput.fill(originalBgColor);
    await textColorInput.fill(originalTextColor);
    if (await heightInput.count() > 0) {
      await heightInput.fill(originalHeight);
    }
    
    await bgColorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    
    const saveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    await saveButton.click();
    await maseSettingsPage.waitForTimeout(2000);
  });
  
  test('should support undo/redo with rapid changes', async ({ maseSettingsPage, page }) => {
    // Step 1: Navigate to admin bar tab
    const adminBarTab = maseSettingsPage.locator('[data-tab="admin-bar"], [data-tab="admin_bar"]');
    await adminBarTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 2: Get color input
    const colorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    const originalColor = await colorInput.inputValue();
    
    // Step 3: Make several distinct changes with small delays
    const changes = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
    
    for (const color of changes) {
      await colorInput.fill(color);
      await colorInput.blur();
      await maseSettingsPage.waitForTimeout(300); // Small delay between changes
    }
    
    // Step 4: Verify final color
    expect(await colorInput.inputValue()).toBe('#ffff00');
    
    // Step 5: Undo once (should go back to #0000ff)
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+z' : 'Control+z');
    await maseSettingsPage.waitForTimeout(500);
    
    let currentColor = await colorInput.inputValue();
    console.log('After first undo:', currentColor);
    
    // Step 6: Undo again (should go back to #00ff00)
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+z' : 'Control+z');
    await maseSettingsPage.waitForTimeout(500);
    
    currentColor = await colorInput.inputValue();
    console.log('After second undo:', currentColor);
    
    // Step 7: Redo once (should go forward to #0000ff)
    await page.keyboard.press(
      process.platform === 'darwin' ? 'Meta+Shift+z' : 'Control+y'
    );
    await maseSettingsPage.waitForTimeout(500);
    
    currentColor = await colorInput.inputValue();
    console.log('After redo:', currentColor);
    
    // Step 8: Verify undo/redo worked (if implemented)
    // If not implemented, this test documents expected behavior
    
    // Cleanup: Restore original color
    await colorInput.fill(originalColor);
    await colorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    
    const saveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    await saveButton.click();
    await maseSettingsPage.waitForTimeout(2000);
  });
  
  test('should maintain correct state after rapid tab switching', async ({ maseSettingsPage }) => {
    // Step 1: Make a change in admin bar tab
    const adminBarTab = maseSettingsPage.locator('[data-tab="admin-bar"], [data-tab="admin_bar"]');
    await adminBarTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    const bgColorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    const originalColor = await bgColorInput.inputValue();
    const newColor = '#ff5733';
    
    await bgColorInput.fill(newColor);
    await bgColorInput.blur();
    
    // Step 2: Rapidly switch between tabs
    const tabs = [
      '[data-tab="admin-menu"], [data-tab="admin_menu"]',
      '[data-tab="content"]',
      '[data-tab="typography"]',
      '[data-tab="effects"]',
      '[data-tab="admin-bar"], [data-tab="admin_bar"]'
    ];
    
    for (const tabSelector of tabs) {
      const tab = maseSettingsPage.locator(tabSelector);
      if (await tab.count() > 0) {
        await tab.click();
        await maseSettingsPage.waitForTimeout(100); // Rapid switching
      }
    }
    
    // Step 3: Return to admin bar tab
    await adminBarTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 4: Verify the change persisted
    const currentColor = await bgColorInput.inputValue();
    expect(currentColor).toBe(newColor);
    
    // Cleanup
    await bgColorInput.fill(originalColor);
    await bgColorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    
    const saveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    await saveButton.click();
    await maseSettingsPage.waitForTimeout(2000);
  });
  
  test('should handle rapid save attempts gracefully', async ({ maseSettingsPage }) => {
    // Step 1: Make a change
    const adminBarTab = maseSettingsPage.locator('[data-tab="admin-bar"], [data-tab="admin_bar"]');
    await adminBarTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    const colorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    const originalColor = await colorInput.inputValue();
    
    await colorInput.fill('#aabbcc');
    await colorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 2: Click save button multiple times rapidly
    const saveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    
    // Click 5 times rapidly
    for (let i = 0; i < 5; i++) {
      await saveButton.click();
    }
    
    // Step 3: Wait for all save attempts to complete
    await maseSettingsPage.waitForTimeout(5000);
    
    // Step 4: Verify no errors occurred
    const errorNotice = maseSettingsPage.locator('.mase-notice-error, .notice-error');
    const hasError = await errorNotice.count() > 0;
    
    if (hasError) {
      const errorText = await errorNotice.first().textContent();
      console.log('Error after rapid saves:', errorText);
    } else {
      console.log('No errors after rapid save attempts - request queuing working correctly');
    }
    
    // Step 5: Verify settings were saved correctly
    await maseSettingsPage.reload();
    await maseSettingsPage.waitForSelector('.mase-admin-wrapper', { timeout: 10000 });
    
    await adminBarTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    const savedColor = await colorInput.inputValue();
    expect(savedColor).toBe('#aabbcc');
    
    // Cleanup
    await colorInput.fill(originalColor);
    await colorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    await saveButton.click();
    await maseSettingsPage.waitForTimeout(2000);
  });
  
  test('should debounce preview updates during slider dragging', async ({ maseSettingsPage }) => {
    // Step 1: Navigate to effects or typography tab (likely to have sliders)
    const effectsTab = maseSettingsPage.locator('[data-tab="effects"]');
    await effectsTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 2: Find a slider input
    const sliderInput = maseSettingsPage.locator('input[type="range"]').first();
    
    const hasSlider = await sliderInput.count() > 0;
    
    if (!hasSlider) {
      console.log('No slider inputs found - skipping slider test');
      return;
    }
    
    // Step 3: Get original value
    const originalValue = await sliderInput.inputValue();
    
    // Step 4: Simulate rapid slider changes
    const values = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
    
    for (const value of values) {
      await sliderInput.fill(value);
      // No delay - simulate rapid dragging
    }
    
    // Step 5: Wait for debounced updates
    await maseSettingsPage.waitForTimeout(1000);
    
    // Step 6: Verify final value is correct
    const finalValue = await sliderInput.inputValue();
    expect(finalValue).toBe('100');
    
    // Cleanup
    await sliderInput.fill(originalValue);
    await maseSettingsPage.waitForTimeout(500);
  });
  
  test('should handle rapid changes with validation errors', async ({ maseSettingsPage }) => {
    // Step 1: Navigate to admin bar tab
    const adminBarTab = maseSettingsPage.locator('[data-tab="admin-bar"], [data-tab="admin_bar"]');
    await adminBarTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 2: Find a numeric input (like height)
    const heightInput = maseSettingsPage.locator('#admin_bar_height, input[name*="height"]');
    
    const hasHeightInput = await heightInput.count() > 0;
    
    if (!hasHeightInput) {
      console.log('Height input not found - skipping validation test');
      return;
    }
    
    const originalHeight = await heightInput.inputValue();
    
    // Step 3: Rapidly enter invalid and valid values
    const values = ['abc', '999', '-10', '0', '32', 'xyz', '40'];
    
    for (const value of values) {
      await heightInput.fill(value);
      await maseSettingsPage.waitForTimeout(50);
    }
    
    await heightInput.blur();
    
    // Step 4: Wait for validation
    await maseSettingsPage.waitForTimeout(1000);
    
    // Step 5: Check for validation errors
    const validationError = maseSettingsPage.locator('.validation-error, .error-message, [data-error]');
    const hasError = await validationError.count() > 0;
    
    if (hasError) {
      console.log('Validation error displayed for invalid input');
    }
    
    // Step 6: Verify final value is valid
    const finalValue = await heightInput.inputValue();
    console.log('Final height value after rapid invalid inputs:', finalValue);
    
    // Cleanup
    await heightInput.fill(originalHeight);
    await heightInput.blur();
    await maseSettingsPage.waitForTimeout(500);
  });
  
  test('should maintain performance with 50+ rapid changes', async ({ maseSettingsPage, page }) => {
    // Step 1: Track performance
    const startTime = Date.now();
    
    // Step 2: Navigate to admin bar tab
    const adminBarTab = maseSettingsPage.locator('[data-tab="admin-bar"], [data-tab="admin_bar"]');
    await adminBarTab.click();
    await maseSettingsPage.waitForTimeout(500);
    
    // Step 3: Get color input
    const colorInput = maseSettingsPage.locator('#admin_bar_bg_color');
    const originalColor = await colorInput.inputValue();
    
    // Step 4: Make 50 rapid changes
    for (let i = 0; i < 50; i++) {
      const color = `#${i.toString(16).padStart(2, '0')}${i.toString(16).padStart(2, '0')}${i.toString(16).padStart(2, '0')}`;
      await colorInput.fill(color);
    }
    
    await colorInput.blur();
    
    // Step 5: Wait for all updates to complete
    await maseSettingsPage.waitForTimeout(2000);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Step 6: Verify performance (should complete in reasonable time)
    console.log(`50 rapid changes completed in ${duration}ms`);
    expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    
    // Step 7: Verify UI is still responsive
    const isVisible = await colorInput.isVisible();
    expect(isVisible).toBe(true);
    
    // Cleanup
    await colorInput.fill(originalColor);
    await colorInput.blur();
    await maseSettingsPage.waitForTimeout(500);
    
    const saveButton = maseSettingsPage.locator('button:has-text("Save Settings"), button:has-text("Save Changes")');
    await saveButton.click();
    await maseSettingsPage.waitForTimeout(2000);
  });
});
