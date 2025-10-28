/**
 * Content Colors Test
 * 
 * Tests all color settings in the Content tab including:
 * - Text color changes
 * - Link color changes
 * - Heading color changes
 * - Live Preview updates
 * - Persistence after save
 * 
 * Requirements: 2.3
 */

module.exports = {
  // Test metadata
  name: 'Content Colors',
  description: 'Test all color settings in Content tab',
  tab: 'content',
  tags: ['colors', 'visual', 'content', 'live-preview'],
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
      await helpers.takeScreenshot('content-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Text Color
      console.log('🎨 Testing text color...');
      await helpers.changeSetting('content_text_color', '#FF0000');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('content-text-red');

      // Verify text color applied in preview
      const textColor = await helpers.getComputedStyle('.mase-content-preview p', 'color');
      const textColorMatch = helpers.normalizeColor(textColor);
      helpers.assert.contains(textColorMatch, '255,0,0', 'Text color should be red (255,0,0)');
      results.assertions.push({
        type: 'color',
        property: 'color',
        expected: '255,0,0',
        actual: textColorMatch,
        passed: true
      });

      // Test 2: Link Color
      console.log('🔗 Testing link color...');
      await helpers.changeSetting('content_link_color', '#00FF00');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('content-link-green');

      // Verify link color applied in preview
      const linkColor = await helpers.getComputedStyle('.mase-content-preview a', 'color');
      const linkColorMatch = helpers.normalizeColor(linkColor);
      helpers.assert.contains(linkColorMatch, '0,255,0', 'Link color should be green (0,255,0)');
      results.assertions.push({
        type: 'color',
        property: 'color',
        expected: '0,255,0',
        actual: linkColorMatch,
        passed: true
      });

      // Test 3: Heading Color
      console.log('📝 Testing heading color...');
      await helpers.changeSetting('content_heading_color', '#0000FF');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('content-heading-blue');

      // Verify heading color applied in preview
      const headingColor = await helpers.getComputedStyle('.mase-content-preview h2', 'color');
      const headingColorMatch = helpers.normalizeColor(headingColor);
      helpers.assert.contains(headingColorMatch, '0,0,255', 'Heading color should be blue (0,0,255)');
      results.assertions.push({
        type: 'color',
        property: 'color',
        expected: '0,0,255',
        actual: headingColorMatch,
        passed: true
      });

      // Test 4: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('content-colors-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('content');
      await helpers.takeScreenshot('content-after-reload');

      // Verify text color persisted
      const persistedTextColor = await page.inputValue('[name="content_text_color"]');
      helpers.assert.equals(persistedTextColor.toUpperCase(), '#FF0000', 'Text color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'text_color',
        expected: '#FF0000',
        actual: persistedTextColor.toUpperCase(),
        passed: true
      });

      // Verify link color persisted
      const persistedLinkColor = await page.inputValue('[name="content_link_color"]');
      helpers.assert.equals(persistedLinkColor.toUpperCase(), '#00FF00', 'Link color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'link_color',
        expected: '#00FF00',
        actual: persistedLinkColor.toUpperCase(),
        passed: true
      });

      // Verify heading color persisted
      const persistedHeadingColor = await page.inputValue('[name="content_heading_color"]');
      helpers.assert.equals(persistedHeadingColor.toUpperCase(), '#0000FF', 'Heading color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'heading_color',
        expected: '#0000FF',
        actual: persistedHeadingColor.toUpperCase(),
        passed: true
      });

      console.log('✅ Content colors test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('content-colors-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
