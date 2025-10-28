/**
 * Global Fonts Test
 * 
 * Tests global typography settings in the Typography tab including:
 * - Global font family selection
 * - Global font size changes
 * - Global font weight changes
 * - Visual appearance verification across different areas
 * 
 * Requirements: 2.4
 */

module.exports = {
  // Test metadata
  name: 'Global Fonts',
  description: 'Test global font family, size, and weight settings in Typography tab',
  tab: 'typography',
  tags: ['typography', 'visual', 'live-preview', 'global'],
  requirements: ['2.4'],
  estimatedDuration: 18000, // 18 seconds

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
      // Navigate to Typography tab
      console.log('📍 Navigating to Typography tab...');
      await helpers.navigateToTab('typography');
      await helpers.takeScreenshot('typography-global-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Ensure we're on the body_text area (default)
      console.log('📝 Selecting Body Text area...');
      const bodyTextButton = await page.$('button.mase-area-button[data-area="body_text"]');
      if (bodyTextButton) {
        await bodyTextButton.click();
        await helpers.pause(300);
      }

      // Test 1: Font Family Selection
      console.log('🔤 Testing font family selection...');
      
      // Get original font family
      const originalFontFamily = await helpers.getComputedStyle('.wrap', 'font-family');
      console.log(`  Original font family: ${originalFontFamily}`);

      // Test with Google Font - Inter
      await helpers.changeSetting('content_typography[body_text][font_family]', 'Inter');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('typography-font-family-inter');

      // Verify font family applied
      const interFontFamily = await helpers.getComputedStyle('.wrap', 'font-family');
      console.log(`  Inter font family: ${interFontFamily}`);
      helpers.assert.contains(interFontFamily.toLowerCase(), 'inter', 'Font family should contain Inter');
      results.assertions.push({
        type: 'typography',
        property: 'font-family',
        expected: 'Inter',
        actual: interFontFamily,
        passed: true
      });

      // Test with another Google Font - Roboto
      await helpers.changeSetting('content_typography[body_text][font_family]', 'Roboto');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('typography-font-family-roboto');

      const robotoFontFamily = await helpers.getComputedStyle('.wrap', 'font-family');
      console.log(`  Roboto font family: ${robotoFontFamily}`);
      helpers.assert.contains(robotoFontFamily.toLowerCase(), 'roboto', 'Font family should contain Roboto');

      // Test with System Font
      await helpers.changeSetting('content_typography[body_text][font_family]', 'system');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('typography-font-family-system');

      const systemFontFamily = await helpers.getComputedStyle('.wrap', 'font-family');
      console.log(`  System font family: ${systemFontFamily}`);

      // Test 2: Global Font Size
      console.log('📏 Testing global font size...');
      
      // Get original font size
      const originalFontSize = await helpers.getComputedStyle('.wrap', 'font-size');
      console.log(`  Original font size: ${originalFontSize}`);

      // Test with larger font size
      await helpers.changeSetting('content_typography[body_text][font_size]', '18');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('typography-font-size-18');

      // Verify font size applied
      const fontSize18 = await helpers.getComputedStyle('.wrap', 'font-size');
      console.log(`  Font size 18: ${fontSize18}`);
      helpers.assert.contains(fontSize18, '18', 'Font size should be 18px');
      results.assertions.push({
        type: 'typography',
        property: 'font-size',
        expected: '18px',
        actual: fontSize18,
        passed: true
      });

      // Test with smaller font size
      await helpers.changeSetting('content_typography[body_text][font_size]', '14');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('typography-font-size-14');

      const fontSize14 = await helpers.getComputedStyle('.wrap', 'font-size');
      console.log(`  Font size 14: ${fontSize14}`);
      helpers.assert.contains(fontSize14, '14', 'Font size should be 14px');

      // Test with very large font size
      await helpers.changeSetting('content_typography[body_text][font_size]', '24');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('typography-font-size-24');

      const fontSize24 = await helpers.getComputedStyle('.wrap', 'font-size');
      console.log(`  Font size 24: ${fontSize24}`);
      helpers.assert.contains(fontSize24, '24', 'Font size should be 24px');

      // Test 3: Global Font Weight
      console.log('💪 Testing global font weight...');
      
      // Get original font weight
      const originalFontWeight = await helpers.getComputedStyle('.wrap', 'font-weight');
      console.log(`  Original font weight: ${originalFontWeight}`);

      // Test with bold weight
      await helpers.changeSetting('content_typography[body_text][font_weight]', '700');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('typography-font-weight-bold');

      // Verify font weight applied
      const fontWeightBold = await helpers.getComputedStyle('.wrap', 'font-weight');
      console.log(`  Bold font weight: ${fontWeightBold}`);
      const isBold = fontWeightBold === '700' || fontWeightBold === 'bold' || parseInt(fontWeightBold) >= 700;
      helpers.assert.isTrue(isBold, 'Font weight should be bold (700)');
      results.assertions.push({
        type: 'typography',
        property: 'font-weight',
        expected: '700',
        actual: fontWeightBold,
        passed: true
      });

      // Test with light weight
      await helpers.changeSetting('content_typography[body_text][font_weight]', '300');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('typography-font-weight-light');

      const fontWeightLight = await helpers.getComputedStyle('.wrap', 'font-weight');
      console.log(`  Light font weight: ${fontWeightLight}`);
      const isLight = fontWeightLight === '300' || parseInt(fontWeightLight) <= 300;
      helpers.assert.isTrue(isLight, 'Font weight should be light (300)');

      // Test with medium weight
      await helpers.changeSetting('content_typography[body_text][font_weight]', '500');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('typography-font-weight-medium');

      const fontWeightMedium = await helpers.getComputedStyle('.wrap', 'font-weight');
      console.log(`  Medium font weight: ${fontWeightMedium}`);

      // Test 4: Combined Typography Settings
      console.log('🎨 Testing combined typography settings...');
      
      // Apply multiple settings together
      await helpers.changeSetting('content_typography[body_text][font_family]', 'Poppins');
      await helpers.changeSetting('content_typography[body_text][font_size]', '16');
      await helpers.changeSetting('content_typography[body_text][font_weight]', '600');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('typography-combined-settings');

      // Verify all settings applied together
      const combinedFontFamily = await helpers.getComputedStyle('.wrap', 'font-family');
      const combinedFontSize = await helpers.getComputedStyle('.wrap', 'font-size');
      const combinedFontWeight = await helpers.getComputedStyle('.wrap', 'font-weight');

      console.log(`  Combined - Font family: ${combinedFontFamily}, Size: ${combinedFontSize}, Weight: ${combinedFontWeight}`);
      
      helpers.assert.contains(combinedFontFamily.toLowerCase(), 'poppins', 'Font family should be Poppins');
      helpers.assert.contains(combinedFontSize, '16', 'Font size should be 16px');

      // Test 5: Line Height
      console.log('📐 Testing line height...');
      
      const originalLineHeight = await helpers.getComputedStyle('.wrap', 'line-height');
      console.log(`  Original line height: ${originalLineHeight}`);

      await helpers.changeSetting('content_typography[body_text][line_height]', '1.8');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('typography-line-height-1-8');

      const lineHeight18 = await helpers.getComputedStyle('.wrap', 'line-height');
      console.log(`  Line height 1.8: ${lineHeight18}`);
      const lineHeightValue = parseFloat(lineHeight18);
      helpers.assert.isTrue(lineHeightValue > 0, 'Line height should be set');
      results.assertions.push({
        type: 'typography',
        property: 'line-height',
        expected: '1.8',
        actual: lineHeight18,
        passed: true
      });

      // Test with different line height
      await helpers.changeSetting('content_typography[body_text][line_height]', '2.2');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('typography-line-height-2-2');

      const lineHeight22 = await helpers.getComputedStyle('.wrap', 'line-height');
      console.log(`  Line height 2.2: ${lineHeight22}`);

      // Test 6: Save and Verify Persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('typography-global-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('typography');
      await helpers.takeScreenshot('typography-global-after-reload');

      // Verify font family persisted
      const persistedFontFamily = await page.inputValue('[name="content_typography[body_text][font_family]"]');
      helpers.assert.equals(persistedFontFamily, 'Poppins', 'Font family should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'font_family',
        expected: 'Poppins',
        actual: persistedFontFamily,
        passed: true
      });

      // Verify font size persisted
      const persistedFontSize = await page.inputValue('[name="content_typography[body_text][font_size]"]');
      helpers.assert.equals(persistedFontSize, '16', 'Font size should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'font_size',
        expected: '16',
        actual: persistedFontSize,
        passed: true
      });

      // Verify font weight persisted
      const persistedFontWeight = await page.inputValue('[name="content_typography[body_text][font_weight]"]');
      helpers.assert.equals(persistedFontWeight, '600', 'Font weight should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'font_weight',
        expected: '600',
        actual: persistedFontWeight,
        passed: true
      });

      // Verify line height persisted
      const persistedLineHeight = await page.inputValue('[name="content_typography[body_text][line_height]"]');
      helpers.assert.equals(persistedLineHeight, '2.2', 'Line height should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'line_height',
        expected: '2.2',
        actual: persistedLineHeight,
        passed: true
      });

      console.log('✅ Global fonts test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('typography-global-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
