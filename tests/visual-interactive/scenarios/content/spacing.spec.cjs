/**
 * Content Spacing Test
 * 
 * Tests all spacing settings in the Content tab including:
 * - Paragraph margin adjustments
 * - Heading margin adjustments
 * - Live Preview updates
 * - Persistence after save
 * 
 * Requirements: 2.3
 */

module.exports = {
  // Test metadata
  name: 'Content Spacing',
  description: 'Test spacing settings in Content tab',
  tab: 'content',
  tags: ['spacing', 'visual', 'content', 'live-preview'],
  requirements: ['2.3'],
  estimatedDuration: 12000, // 12 seconds

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
      await helpers.takeScreenshot('content-spacing-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Paragraph Margin
      console.log('📏 Testing paragraph margin...');
      const paragraphMarginSlider = await page.$('#content_paragraph_margin');
      if (!paragraphMarginSlider) {
        throw new Error('Paragraph margin slider not found');
      }

      // Set paragraph margin to 25px
      await page.fill('#content_paragraph_margin', '25');
      await page.dispatchEvent('#content_paragraph_margin', 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('content-paragraph-margin-25');

      // Verify paragraph margin applied in preview
      const paragraphMargin = await helpers.getComputedStyle('.mase-content-preview p', 'margin-bottom');
      helpers.assert.contains(paragraphMargin, '25px', 'Paragraph margin should be 25px');
      results.assertions.push({
        type: 'spacing',
        property: 'margin-bottom',
        expected: '25px',
        actual: paragraphMargin,
        passed: true
      });

      // Verify slider value display updated
      const paragraphValueDisplay = await page.textContent('#content_paragraph_margin + .mase-range-value');
      helpers.assert.contains(paragraphValueDisplay, '25', 'Paragraph margin value display should show 25px');

      // Test 2: Heading Margin
      console.log('📐 Testing heading margin...');
      const headingMarginSlider = await page.$('#content_heading_margin');
      if (!headingMarginSlider) {
        throw new Error('Heading margin slider not found');
      }

      // Set heading margin to 35px
      await page.fill('#content_heading_margin', '35');
      await page.dispatchEvent('#content_heading_margin', 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('content-heading-margin-35');

      // Verify heading margin applied in preview
      const headingMargin = await helpers.getComputedStyle('.mase-content-preview h2', 'margin-bottom');
      helpers.assert.contains(headingMargin, '35px', 'Heading margin should be 35px');
      results.assertions.push({
        type: 'spacing',
        property: 'margin-bottom',
        expected: '35px',
        actual: headingMargin,
        passed: true
      });

      // Verify slider value display updated
      const headingValueDisplay = await page.textContent('#content_heading_margin + .mase-range-value');
      helpers.assert.contains(headingValueDisplay, '35', 'Heading margin value display should show 35px');

      // Test 3: Test minimum values
      console.log('🔽 Testing minimum spacing values...');
      await page.fill('#content_paragraph_margin', '0');
      await page.dispatchEvent('#content_paragraph_margin', 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('content-paragraph-margin-min');

      const minParagraphMargin = await helpers.getComputedStyle('.mase-content-preview p', 'margin-bottom');
      helpers.assert.contains(minParagraphMargin, '0px', 'Paragraph margin should be 0px at minimum');

      // Test 4: Test maximum values
      console.log('🔼 Testing maximum spacing values...');
      await page.fill('#content_heading_margin', '50');
      await page.dispatchEvent('#content_heading_margin', 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('content-heading-margin-max');

      const maxHeadingMargin = await helpers.getComputedStyle('.mase-content-preview h2', 'margin-bottom');
      helpers.assert.contains(maxHeadingMargin, '50px', 'Heading margin should be 50px at maximum');

      // Test 5: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('content-spacing-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('content');
      await helpers.takeScreenshot('content-spacing-after-reload');

      // Verify paragraph margin persisted
      const persistedParagraphMargin = await page.inputValue('#content_paragraph_margin');
      helpers.assert.equals(persistedParagraphMargin, '0', 'Paragraph margin should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'paragraph_margin',
        expected: '0',
        actual: persistedParagraphMargin,
        passed: true
      });

      // Verify heading margin persisted
      const persistedHeadingMargin = await page.inputValue('#content_heading_margin');
      helpers.assert.equals(persistedHeadingMargin, '50', 'Heading margin should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'heading_margin',
        expected: '50',
        actual: persistedHeadingMargin,
        passed: true
      });

      console.log('✅ Content spacing test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('content-spacing-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
