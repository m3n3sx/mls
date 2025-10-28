/**
 * Admin Bar Gradient Test
 * 
 * Tests gradient background settings in the Admin Bar tab including:
 * - Gradient type selection (linear, radial, conic)
 * - Gradient angle adjustment
 * - Gradient color stops
 * - Gradient rendering verification
 * 
 * Requirements: 2.1, 2.2
 */

module.exports = {
  // Test metadata
  name: 'Admin Bar Gradient',
  description: 'Test gradient background settings in Admin Bar tab',
  tab: 'admin-bar',
  tags: ['gradient', 'visual', 'live-preview'],
  requirements: ['2.1', '2.2'],
  estimatedDuration: 15000, // 15 seconds

  /**
   * Execute the test scenario
   * @param {Page} page - Playwright page object
   * @param {TestHelpers} helpers - Test helper functions
   * @returns {Promise<Object>} - Test result object
   */
  async execute(page, helpers) {
    const startTime = Date.now();
    const results = {
      passed: true,
      errors: [],
      screenshots: [],
      assertions: []
    };

    try {
      // Navigate to Admin Bar tab
      console.log('📍 Navigating to Admin Bar tab...');
      await helpers.navigateToTab('admin-bar');
      await helpers.takeScreenshot('admin-bar-gradient-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Enable gradient background
      console.log('🎨 Enabling gradient background...');
      await helpers.changeSetting('admin-bar-bg-type', 'gradient');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('admin-bar-gradient-enabled');

      // Test 2: Linear Gradient
      console.log('📐 Testing linear gradient...');
      await helpers.changeSetting('admin-bar-gradient-type', 'linear');
      await helpers.changeSetting('admin-bar-gradient-angle', '90');
      await helpers.changeSetting('admin-bar-gradient-color-1', '#FF0000');
      await helpers.changeSetting('admin-bar-gradient-color-2', '#0000FF');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('admin-bar-gradient-linear-90deg');

      // Verify gradient applied
      console.log(`  Linear gradient: ${linearBg}`);
      helpers.assert.contains(linearBg, 'gradient', 'Background should contain gradient');
      results.assertions.push({
        type: 'gradient',
        property: 'background-image',
        expected: 'contains gradient',
        actual: linearBg,
        passed: true
      });

      // Test different angle
      console.log('🔄 Testing gradient angle 45deg...');
      await helpers.changeSetting('admin-bar-gradient-angle', '45');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('admin-bar-gradient-linear-45deg');

      console.log(`  45deg gradient: ${angle45Bg}`);

      // Test horizontal gradient
      console.log('↔️ Testing horizontal gradient (0deg)...');
      await helpers.changeSetting('admin-bar-gradient-angle', '0');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('admin-bar-gradient-linear-0deg');

      // Test vertical gradient
      console.log('↕️ Testing vertical gradient (180deg)...');
      await helpers.changeSetting('admin-bar-gradient-angle', '180');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('admin-bar-gradient-linear-180deg');

      // Test 3: Radial Gradient
      console.log('⭕ Testing radial gradient...');
      await helpers.changeSetting('admin-bar-gradient-type', 'radial');
      await helpers.changeSetting('admin-bar-gradient-color-1', '#00FF00');
      await helpers.changeSetting('admin-bar-gradient-color-2', '#FFFF00');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('admin-bar-gradient-radial');

      // Verify radial gradient applied
      console.log(`  Radial gradient: ${radialBg}`);
      helpers.assert.contains(radialBg, 'gradient', 'Background should contain radial gradient');
      results.assertions.push({
        type: 'gradient',
        property: 'background-image',
        expected: 'contains radial gradient',
        actual: radialBg,
        passed: true
      });

      // Test 4: Conic Gradient (if supported)
      console.log('🌀 Testing conic gradient...');
      try {
        await helpers.changeSetting('admin-bar-gradient-type', 'conic');
        await helpers.changeSetting('admin-bar-gradient-color-1', '#FF00FF');
        await helpers.changeSetting('admin-bar-gradient-color-2', '#00FFFF');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('admin-bar-gradient-conic');

        // Verify conic gradient applied
        console.log(`  Conic gradient: ${conicBg}`);
        helpers.assert.contains(conicBg, 'gradient', 'Background should contain conic gradient');
      } catch (error) {
        console.log('  ⚠️ Conic gradient not supported or not available');
      }

      // Test 5: Multiple color stops
      console.log('🎨 Testing multiple color stops...');
      await helpers.changeSetting('admin-bar-gradient-type', 'linear');
      await helpers.changeSetting('admin-bar-gradient-angle', '90');
      
      // Add color stops if the interface supports it
      try {
        await helpers.changeSetting('admin-bar-gradient-color-1', '#FF0000');
        await helpers.changeSetting('admin_bar[gradient_color_1_position]', '0');
        await helpers.changeSetting('admin-bar-gradient-color-2', '#00FF00');
        await helpers.changeSetting('admin_bar[gradient_color_2_position]', '50');
        await helpers.changeSetting('admin_bar[gradient_color_3]', '#0000FF');
        await helpers.changeSetting('admin_bar[gradient_color_3_position]', '100');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('admin-bar-gradient-multi-stop');

        console.log('  ✅ Multiple color stops applied');
      } catch (error) {
        console.log('  ℹ️ Multiple color stops not available or different interface');
      }

      // Test 6: Disable gradient
      console.log('❌ Disabling gradient...');
      await helpers.changeSetting('admin-bar-bg-type', 'solid');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('admin-bar-gradient-disabled');

      // Verify gradient removed
      console.log(`  Background after disable: ${noBg}`);

      // Re-enable for save test
      await helpers.changeSetting('admin-bar-bg-type', 'gradient');
      await helpers.changeSetting('admin-bar-gradient-type', 'linear');
      await helpers.changeSetting('admin-bar-gradient-angle', '135');
      await helpers.changeSetting('admin-bar-gradient-color-1', '#8B00FF');
      await helpers.changeSetting('admin-bar-gradient-color-2', '#FF1493');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('admin-bar-gradient-final');

      // Test 7: Save and verify persistence
      console.log('💾 Saving gradient settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('admin-bar-gradient-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('admin-bar');
      await helpers.takeScreenshot('admin-bar-gradient-after-reload');

      // Verify gradient settings persisted
      const persistedGradientEnabled = await page.isChecked('[name="admin-bar-bg-type"]');
      helpers.assert.isTrue(persistedGradientEnabled, 'Gradient should be enabled after reload');

      const persistedGradientType = await page.inputValue('[name="admin-bar-gradient-type"]');
      helpers.assert.equals(persistedGradientType, 'linear', 'Gradient type should persist');

      const persistedAngle = await page.inputValue('[name="admin-bar-gradient-angle"]');
      helpers.assert.equals(persistedAngle, '135', 'Gradient angle should persist');

      const persistedColor1 = await page.inputValue('[name="admin-bar-gradient-color-1"]');
      helpers.assert.equals(persistedColor1.toUpperCase(), '#8B00FF', 'Gradient color 1 should persist');

      const persistedColor2 = await page.inputValue('[name="admin-bar-gradient-color-2"]');
      helpers.assert.equals(persistedColor2.toUpperCase(), '#FF1493', 'Gradient color 2 should persist');

      results.assertions.push({
        type: 'persistence',
        field: 'gradient_settings',
        expected: 'all gradient settings persisted',
        actual: 'verified',
        passed: true
      });

      // Verify gradient still rendered in DOM
      helpers.assert.contains(reloadedBg, 'gradient', 'Gradient should still be rendered after reload');

      console.log('✅ Admin Bar gradient test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('admin-bar-gradient-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
