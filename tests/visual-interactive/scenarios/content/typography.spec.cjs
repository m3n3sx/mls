/**
 * Content Typography Test
 * 
 * Tests all typography settings in the Content tab including:
 * - Font family changes
 * - Font size adjustments
 * - Line height adjustments
 * - Live Preview updates
 * - Persistence after save
 * 
 * Requirements: 2.3
 */

module.exports = {
  // Test metadata
  name: 'Content Typography',
  description: 'Test typography settings in Content tab',
  tab: 'content',
  tags: ['typography', 'visual', 'content', 'live-preview'],
  requirements: ['2.3'],
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
      // Navigate to Content tab
      console.log('📍 Navigating to Content tab...');
      await helpers.navigateToTab('content');
      await helpers.takeScreenshot('content-typography-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Font Family
      console.log('🔤 Testing font family...');
      await helpers.changeSetting('content_font_family', 'Georgia');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('content-font-georgia');

      // Verify font family applied in preview
      const fontFamily = await helpers.getComputedStyle('.mase-content-preview p', 'font-family');
      helpers.assert.contains(fontFamily.toLowerCase(), 'georgia', 'Font family should be Georgia');
      results.assertions.push({
        type: 'typography',
        property: 'font-family',
        expected: 'Georgia',
        actual: fontFamily,
        passed: true
      });

      // Test 2: Font Size
      console.log('📏 Testing font size...');
      const fontSizeSlider = await page.$('#content_font_size');
      if (!fontSizeSlider) {
        throw new Error('Font size slider not found');
      }

      // Set font size to 18px
      await page.fill('#content_font_size', '18');
      await page.dispatchEvent('#content_font_size', 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('content-font-size-18');

      // Verify font size applied in preview
      const fontSize = await helpers.getComputedStyle('.mase-content-preview p', 'font-size');
      helpers.assert.contains(fontSize, '18px', 'Font size should be 18px');
      results.assertions.push({
        type: 'typography',
        property: 'font-size',
        expected: '18px',
        actual: fontSize,
        passed: true
      });

      // Verify slider value display updated
      const fontSizeDisplay = await page.textContent('#content_font_size + .mase-range-value');
      helpers.assert.contains(fontSizeDisplay, '18', 'Font size value display should show 18px');

      // Test 3: Line Height
      console.log('📐 Testing line height...');
      const lineHeightSlider = await page.$('#content_line_height');
      if (!lineHeightSlider) {
        throw new Error('Line height slider not found');
      }

      // Set line height to 2.0
      await page.fill('#content_line_height', '2.0');
      await page.dispatchEvent('#content_line_height', 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('content-line-height-2');

      // Verify line height applied in preview
      const lineHeight = await helpers.getComputedStyle('.mase-content-preview p', 'line-height');
      // Line height might be computed as pixels, so we check if it's approximately 2x the font size
      const lineHeightValue = parseFloat(lineHeight);
      const fontSizeValue = parseFloat(fontSize);
      const ratio = lineHeightValue / fontSizeValue;
      helpers.assert.isTrue(
        ratio >= 1.9 && ratio <= 2.1,
        `Line height ratio should be approximately 2.0 (actual: ${ratio.toFixed(2)})`
      );
      results.assertions.push({
        type: 'typography',
        property: 'line-height',
        expected: '~2.0',
        actual: ratio.toFixed(2),
        passed: true
      });

      // Verify slider value display updated
      const lineHeightDisplay = await page.textContent('#content_line_height + .mase-range-value');
      helpers.assert.contains(lineHeightDisplay, '2', 'Line height value display should show 2.0');

      // Test 4: Test different font families
      console.log('🔠 Testing different font families...');
      const fontFamilies = ['Arial', 'Verdana', 'Helvetica'];
      
      for (const font of fontFamilies) {
        await helpers.changeSetting('content_font_family', font);
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot(`content-font-${font.toLowerCase()}`);
        
        const currentFont = await helpers.getComputedStyle('.mase-content-preview p', 'font-family');
        helpers.assert.contains(
          currentFont.toLowerCase(),
          font.toLowerCase(),
          `Font family should be ${font}`
        );
      }

      // Test 5: Test font size range
      console.log('📊 Testing font size range...');
      
      // Test minimum
      await page.fill('#content_font_size', '12');
      await page.dispatchEvent('#content_font_size', 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('content-font-size-min');
      
      const minFontSize = await helpers.getComputedStyle('.mase-content-preview p', 'font-size');
      helpers.assert.contains(minFontSize, '12px', 'Minimum font size should be 12px');

      // Test maximum
      await page.fill('#content_font_size', '24');
      await page.dispatchEvent('#content_font_size', 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('content-font-size-max');
      
      const maxFontSize = await helpers.getComputedStyle('.mase-content-preview p', 'font-size');
      helpers.assert.contains(maxFontSize, '24px', 'Maximum font size should be 24px');

      // Test 6: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('content-typography-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('content');
      await helpers.takeScreenshot('content-typography-after-reload');

      // Verify font family persisted
      const persistedFontFamily = await page.inputValue('#content_font_family');
      helpers.assert.equals(persistedFontFamily, 'Helvetica', 'Font family should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'font_family',
        expected: 'Helvetica',
        actual: persistedFontFamily,
        passed: true
      });

      // Verify font size persisted
      const persistedFontSize = await page.inputValue('#content_font_size');
      helpers.assert.equals(persistedFontSize, '24', 'Font size should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'font_size',
        expected: '24',
        actual: persistedFontSize,
        passed: true
      });

      // Verify line height persisted
      const persistedLineHeight = await page.inputValue('#content_line_height');
      helpers.assert.equals(persistedLineHeight, '2', 'Line height should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'line_height',
        expected: '2',
        actual: persistedLineHeight,
        passed: true
      });

      console.log('✅ Content typography test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('content-typography-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
