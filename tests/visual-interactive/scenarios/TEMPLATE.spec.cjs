/**
 * Test Scenario Template
 * 
 * This is a template for creating new visual interactive test scenarios.
 * Copy this file and modify it to create your own test scenarios.
 * 
 * File naming convention: [feature-name].spec.cjs
 * Example: admin-bar-colors.spec.cjs, menu-typography.spec.cjs
 */

module.exports = {
  /**
   * Metadata
   * 
   * This section defines the test scenario's identity and classification.
   * All fields are required for proper test discovery and reporting.
   */
  
  // Unique name for this test scenario (shown in reports)
  name: 'Template Test Scenario',
  
  // Brief description of what this test validates
  description: 'Template for creating new test scenarios',
  
  // Tab/category this test belongs to (used for filtering and organization)
  // Common values: 'admin-bar', 'menu', 'content', 'typography', 'buttons', 
  //                'effects', 'templates', 'palettes', 'backgrounds', 'widgets',
  //                'form-controls', 'login', 'advanced', 'responsive', 'live-preview'
  tab: 'template',
  
  // Tags for selective test execution (array of strings)
  // Common tags: 'smoke', 'visual', 'persistence', 'live-preview', 'ajax', 'responsive'
  // Example: ['smoke', 'visual'] for critical visual tests
  tags: ['template', 'example'],
  
  /**
   * Test Execution Function
   * 
   * This is the main test logic. It receives the Playwright page object
   * and the TestHelpers instance with all helper functions.
   * 
   * @param {Page} page - Playwright page object for browser automation
   * @param {TestHelpers} helpers - Helper functions for common test operations
   * @returns {Promise<Object>} Test result object with status and details
   */
  async execute(page, helpers) {
    try {
      // Start timing the test
      const startTime = Date.now();
      
      // ============================================================
      // STEP 1: NAVIGATION
      // ============================================================
      // Navigate to the appropriate tab in the MASE settings page
      // Available tabs: 'admin-bar', 'menu', 'content', 'typography', 
      //                 'buttons', 'effects', 'templates', 'palettes', etc.
      await helpers.navigateToTab('admin-bar'); // Change to your target tab
      
      // Take initial screenshot for visual verification
      await helpers.takeScreenshot('template-initial');
      
      // ============================================================
      // STEP 2: ENABLE LIVE PREVIEW (if testing visual changes)
      // ============================================================
      // Enable Live Preview to see changes in real-time without saving
      await helpers.enableLivePreview();
      
      // ============================================================
      // STEP 3: CHANGE SETTINGS
      // ============================================================
      // Use changeSetting() to modify plugin settings
      // Syntax: await helpers.changeSetting(fieldName, value)
      
      // Example: Change a color setting
      await helpers.changeSetting('admin_bar[bg_color]', '#FF0000');
      
      // Wait for Live Preview to apply the change
      await helpers.waitForLivePreview();
      
      // Take screenshot after change
      await helpers.takeScreenshot('template-after-change');
      
      // ============================================================
      // STEP 4: VISUAL VERIFICATION
      // ============================================================
      // Verify that the change was applied visually
      
      // Example: Check computed CSS style
      const bgColor = // Skipped: admin bar not visible on settings page
      
      // Use assertions to verify expected values
      helpers.assert.contains(
        bgColor,
        '255, 0, 0', // RGB values for red
        'Admin bar background should be red'
      );
      
      // ============================================================
      // STEP 5: SAVE AND VERIFY PERSISTENCE (if testing data persistence)
      // ============================================================
      // Save the settings
      await helpers.saveSettings();
      
      // Reload the page to verify persistence
      await page.reload({ waitUntil: 'networkidle' });
      
      // Navigate back to the tab
      await helpers.navigateToTab('admin-bar');
      
      // Verify the setting persisted
      await helpers.verifySetting('admin_bar[bg_color]', '#FF0000');
      
      // Take final screenshot
      await helpers.takeScreenshot('template-after-reload');
      
      // ============================================================
      // STEP 6: CLEANUP (optional)
      // ============================================================
      // Reset settings if needed to avoid affecting other tests
      // await helpers.resetSettings();
      
      // ============================================================
      // STEP 7: RETURN SUCCESS
      // ============================================================
      return {
        passed: true,
        duration: Date.now() - startTime,
        screenshots: ['template-initial', 'template-after-change', 'template-after-reload']
      };
      
    } catch (error) {
      // ============================================================
      // ERROR HANDLING
      // ============================================================
      // Capture failure screenshot
      await helpers.takeScreenshot('template-failure');
      
      // Return failure result with error details
      return {
        passed: false,
        error: error.message,
        stack: error.stack,
        duration: Date.now() - startTime,
        screenshots: ['template-failure']
      };
    }
  }
};

/**
 * COMMON HELPER FUNCTIONS REFERENCE
 * 
 * Navigation:
 * - await helpers.loginToWordPress(username, password)
 * - await helpers.navigateToSettings()
 * - await helpers.navigateToTab(tabName)
 * 
 * Settings Manipulation:
 * - await helpers.changeSetting(fieldName, value)
 * - await helpers.saveSettings()
 * - await helpers.verifySetting(fieldName, expectedValue)
 * - await helpers.resetSettings()
 * 
 * Live Preview:
 * - await helpers.enableLivePreview()
 * - await helpers.disableLivePreview()
 * - await helpers.waitForLivePreview(timeout)
 * 
 * Visual Verification:
 * - await helpers.takeScreenshot(name, options)
 * - await helpers.getComputedStyle(selector, property)
 * - await helpers.verifyColor(selector, expectedColor)
 * - await helpers.verifyVisibility(selector, shouldBeVisible)
 * 
 * Palettes:
 * - await helpers.applyPalette(paletteId)
 * - await helpers.saveCustomPalette(name, colors)
 * - await helpers.deleteCustomPalette(paletteId)
 * 
 * Templates:
 * - await helpers.applyTemplate(templateId)
 * - await helpers.saveCustomTemplate(name, settings)
 * - await helpers.deleteCustomTemplate(templateId)
 * 
 * Import/Export:
 * - await helpers.exportSettings()
 * - await helpers.importSettings(filePath)
 * - await helpers.createBackup()
 * - await helpers.restoreBackup(backupId)
 * 
 * Console Monitoring:
 * - helpers.startConsoleMonitoring()
 * - helpers.getConsoleErrors()
 * - helpers.clearConsoleErrors()
 * 
 * AJAX:
 * - await helpers.waitForAjaxComplete(timeout)
 * - await helpers.waitForResponse(urlPattern, timeout)
 * 
 * Assertions:
 * - helpers.assert.equals(actual, expected, message)
 * - helpers.assert.contains(actual, substring, message)
 * - helpers.assert.isTrue(value, message)
 * - helpers.assert.isFalse(value, message)
 * 
 * Pauses (Interactive Mode):
 * - await helpers.pause(duration)
 * - await helpers.pauseForInspection(message)
 * 
 * Viewport (Responsive Testing):
 * - await helpers.setViewport(width, height)
 */

/**
 * BEST PRACTICES
 * 
 * 1. Test Independence: Each test should be independent and not rely on other tests
 * 2. Clean State: Start with a known state, clean up after yourself
 * 3. Screenshots: Take screenshots at key points for visual verification
 * 4. Assertions: Use descriptive assertion messages
 * 5. Error Handling: Always wrap test logic in try-catch
 * 6. Timing: Use appropriate waits (waitForLivePreview, waitForAjaxComplete)
 * 7. Selectors: Use stable selectors (IDs, data attributes) over classes
 * 8. Documentation: Add comments explaining what each section tests
 * 
 * COMMON PATTERNS
 * 
 * Pattern 1: Test a single setting with Live Preview
 * - Navigate to tab
 * - Enable Live Preview
 * - Change setting
 * - Wait for Live Preview
 * - Verify visual change
 * - Take screenshot
 * 
 * Pattern 2: Test setting persistence
 * - Change setting
 * - Save settings
 * - Reload page
 * - Verify setting persisted
 * 
 * Pattern 3: Test multiple related settings
 * - Change multiple settings
 * - Verify each change
 * - Save once at the end
 * - Verify all persisted
 * 
 * Pattern 4: Test palette/template application
 * - Apply palette/template
 * - Verify multiple settings changed
 * - Check "Active" badge appears
 * 
 * Pattern 5: Test import/export
 * - Export current settings
 * - Change settings
 * - Import saved settings
 * - Verify original settings restored
 */
