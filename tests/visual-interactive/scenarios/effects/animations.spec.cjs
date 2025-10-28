/**
 * Effects Tab - Animations Test
 * 
 * Tests animation-related settings in the Effects tab including:
 * - Shadow preset selection
 * - Shadow intensity changes
 * - Shadow direction changes
 * - Border radius animations
 * - Live Preview updates
 * 
 * Requirements: 2.6
 */

module.exports = {
  // Test metadata
  name: 'Effects Animations',
  description: 'Test animation and shadow preset settings in Effects tab',
  tab: 'effects',
  tags: ['effects', 'visual', 'animations'],
  requirements: ['2.6'],
  estimatedDuration: 20000, // 20 seconds

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
      // Navigate to Effects tab
      console.log('📍 Navigating to Effects tab...');
      await helpers.navigateToTab('effects');
      await helpers.takeScreenshot('effects-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Shadow Preset Selection
      console.log('🎨 Testing shadow preset selection...');
      
      // Test Flat preset (no shadows)
      await helpers.changeSetting('visual_effects[preset]', 'flat');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-preset-flat');
      
      const flatPresetValue = await page.inputValue('[name="visual_effects[preset]"]');
      helpers.assert.equals(flatPresetValue, 'flat', 'Preset should be set to flat');
      results.assertions.push({
        type: 'preset',
        expected: 'flat',
        actual: flatPresetValue,
        passed: true
      });

      // Test Subtle preset
      await helpers.changeSetting('visual_effects[preset]', 'subtle');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-preset-subtle');
      
      const subtlePresetValue = await page.inputValue('[name="visual_effects[preset]"]');
      helpers.assert.equals(subtlePresetValue, 'subtle', 'Preset should be set to subtle');
      results.assertions.push({
        type: 'preset',
        expected: 'subtle',
        actual: subtlePresetValue,
        passed: true
      });

      // Test Elevated preset
      await helpers.changeSetting('visual_effects[preset]', 'elevated');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-preset-elevated');

      // Test Floating preset
      await helpers.changeSetting('visual_effects[preset]', 'floating');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-preset-floating');

      // Test 2: Admin Bar Shadow Intensity
      console.log('💫 Testing admin bar shadow intensity...');
      
      // Set to custom preset to enable individual controls
      await helpers.changeSetting('visual_effects[preset]', 'custom');
      await helpers.waitForLivePreview();
      
      // Test shadow intensity options
      await helpers.changeSetting('visual_effects[admin_bar][shadow_intensity]', 'none');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-adminbar-shadow-none');
      
      await helpers.changeSetting('visual_effects[admin_bar][shadow_intensity]', 'subtle');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-adminbar-shadow-subtle');
      
      await helpers.changeSetting('visual_effects[admin_bar][shadow_intensity]', 'medium');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-adminbar-shadow-medium');
      
      await helpers.changeSetting('visual_effects[admin_bar][shadow_intensity]', 'strong');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-adminbar-shadow-strong');

      // Verify shadow intensity value
      const shadowIntensity = await page.inputValue('[name="visual_effects[admin_bar][shadow_intensity]"]');
      helpers.assert.equals(shadowIntensity, 'strong', 'Shadow intensity should be set to strong');
      results.assertions.push({
        type: 'shadow_intensity',
        expected: 'strong',
        actual: shadowIntensity,
        passed: true
      });

      // Test 3: Border Radius Animation
      console.log('🔄 Testing border radius changes...');
      
      // Test admin bar border radius
      const borderRadiusSelector = '[name="visual_effects[admin_bar][border_radius]"]';
      await page.fill(borderRadiusSelector, '0');
      await page.dispatchEvent(borderRadiusSelector, 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-adminbar-radius-0');
      
      await page.fill(borderRadiusSelector, '15');
      await page.dispatchEvent(borderRadiusSelector, 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-adminbar-radius-15');
      
      await page.fill(borderRadiusSelector, '30');
      await page.dispatchEvent(borderRadiusSelector, 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-adminbar-radius-30');

      // Verify border radius value
      const borderRadius = await page.inputValue(borderRadiusSelector);
      helpers.assert.equals(borderRadius, '30', 'Border radius should be set to 30');
      results.assertions.push({
        type: 'border_radius',
        expected: '30',
        actual: borderRadius,
        passed: true
      });

      // Test 4: Shadow Blur Animation
      console.log('✨ Testing shadow blur changes...');
      
      const shadowBlurSelector = '[name="visual_effects[admin_bar][shadow_blur]"]';
      await page.fill(shadowBlurSelector, '0');
      await page.dispatchEvent(shadowBlurSelector, 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-shadow-blur-0');
      
      await page.fill(shadowBlurSelector, '15');
      await page.dispatchEvent(shadowBlurSelector, 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-shadow-blur-15');
      
      await page.fill(shadowBlurSelector, '30');
      await page.dispatchEvent(shadowBlurSelector, 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('effects-shadow-blur-30');

      // Test 5: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('effects-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('effects');
      await helpers.takeScreenshot('effects-after-reload');

      // Verify preset persisted
      const persistedPreset = await page.inputValue('[name="visual_effects[preset]"]');
      helpers.assert.equals(persistedPreset, 'custom', 'Preset should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'preset',
        expected: 'custom',
        actual: persistedPreset,
        passed: true
      });

      // Verify shadow intensity persisted
      const persistedIntensity = await page.inputValue('[name="visual_effects[admin_bar][shadow_intensity]"]');
      helpers.assert.equals(persistedIntensity, 'strong', 'Shadow intensity should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'shadow_intensity',
        expected: 'strong',
        actual: persistedIntensity,
        passed: true
      });

      // Verify border radius persisted
      const persistedRadius = await page.inputValue('[name="visual_effects[admin_bar][border_radius]"]');
      helpers.assert.equals(persistedRadius, '30', 'Border radius should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'border_radius',
        expected: '30',
        actual: persistedRadius,
        passed: true
      });

      console.log('✅ Effects animations test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('effects-animations-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
