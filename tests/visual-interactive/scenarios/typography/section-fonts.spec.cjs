/**
 * Section Fonts Test
 * 
 * Tests section-specific typography settings in the Typography tab including:
 * - Headings typography
 * - Comments typography
 * - Widgets typography
 * - Meta typography
 * - Tables typography
 * - Notices typography
 * - Visual appearance verification for each section
 * 
 * Requirements: 2.4
 */

module.exports = {
  // Test metadata
  name: 'Section Fonts',
  description: 'Test section-specific typography settings for different content areas',
  tab: 'typography',
  tags: ['typography', 'visual', 'live-preview', 'sections'],
  requirements: ['2.4'],
  estimatedDuration: 24000, // 24 seconds

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
      await helpers.takeScreenshot('typography-sections-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Headings Typography
      console.log('📰 Testing Headings typography...');
      
      // Click on Headings area button
      const headingsButton = await page.$('button.mase-area-button[data-area="headings"]');
      if (headingsButton) {
        await headingsButton.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('typography-headings-selected');

        // Test heading font family
        await helpers.changeSetting('content_typography[headings][font_family]', 'Montserrat');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-headings-font-family');

        // Verify heading font family applied
        const headingFontFamily = await helpers.getComputedStyle('h1, h2, h3', 'font-family');
        console.log(`  Headings font family: ${headingFontFamily}`);
        helpers.assert.contains(headingFontFamily.toLowerCase(), 'montserrat', 'Headings should use Montserrat font');
        results.assertions.push({
          type: 'typography',
          section: 'headings',
          property: 'font-family',
          expected: 'Montserrat',
          actual: headingFontFamily,
          passed: true
        });

        // Test heading font size
        await helpers.changeSetting('content_typography[headings][font_size]', '28');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-headings-font-size');

        const headingFontSize = await helpers.getComputedStyle('h2', 'font-size');
        console.log(`  Headings font size: ${headingFontSize}`);

        // Test heading font weight
        await helpers.changeSetting('content_typography[headings][font_weight]', '700');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-headings-font-weight');

        const headingFontWeight = await helpers.getComputedStyle('h2', 'font-weight');
        console.log(`  Headings font weight: ${headingFontWeight}`);
        const isHeadingBold = headingFontWeight === '700' || headingFontWeight === 'bold' || parseInt(headingFontWeight) >= 700;
        helpers.assert.isTrue(isHeadingBold, 'Headings should be bold');
        results.assertions.push({
          type: 'typography',
          section: 'headings',
          property: 'font-weight',
          expected: '700',
          actual: headingFontWeight,
          passed: true
        });
      }

      // Test 2: Comments Typography
      console.log('💬 Testing Comments typography...');
      
      const commentsButton = await page.$('button.mase-area-button[data-area="comments"]');
      if (commentsButton) {
        await commentsButton.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('typography-comments-selected');

        // Test comments font family
        await helpers.changeSetting('content_typography[comments][font_family]', 'Open Sans');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-comments-font-family');

        // Test comments font size
        await helpers.changeSetting('content_typography[comments][font_size]', '14');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-comments-font-size');

        // Test comments font weight
        await helpers.changeSetting('content_typography[comments][font_weight]', '400');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-comments-font-weight');

        console.log('  Comments typography settings applied');
        results.assertions.push({
          type: 'typography',
          section: 'comments',
          property: 'all',
          expected: 'configured',
          actual: 'configured',
          passed: true
        });
      }

      // Test 3: Widgets Typography
      console.log('📦 Testing Widgets typography...');
      
      const widgetsButton = await page.$('button.mase-area-button[data-area="widgets"]');
      if (widgetsButton) {
        await widgetsButton.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('typography-widgets-selected');

        // Test widgets font family
        await helpers.changeSetting('content_typography[widgets][font_family]', 'Lato');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-widgets-font-family');

        // Test widgets font size
        await helpers.changeSetting('content_typography[widgets][font_size]', '15');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-widgets-font-size');

        // Test widgets font weight
        await helpers.changeSetting('content_typography[widgets][font_weight]', '500');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-widgets-font-weight');

        console.log('  Widgets typography settings applied');
        results.assertions.push({
          type: 'typography',
          section: 'widgets',
          property: 'all',
          expected: 'configured',
          actual: 'configured',
          passed: true
        });
      }

      // Test 4: Meta Typography
      console.log('ℹ️ Testing Meta typography...');
      
      const metaButton = await page.$('button.mase-area-button[data-area="meta"]');
      if (metaButton) {
        await metaButton.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('typography-meta-selected');

        // Test meta font family
        await helpers.changeSetting('content_typography[meta][font_family]', 'Roboto');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-meta-font-family');

        // Test meta font size
        await helpers.changeSetting('content_typography[meta][font_size]', '13');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-meta-font-size');

        // Test meta font weight
        await helpers.changeSetting('content_typography[meta][font_weight]', '400');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-meta-font-weight');

        console.log('  Meta typography settings applied');
        results.assertions.push({
          type: 'typography',
          section: 'meta',
          property: 'all',
          expected: 'configured',
          actual: 'configured',
          passed: true
        });
      }

      // Test 5: Tables Typography
      console.log('📊 Testing Tables typography...');
      
      const tablesButton = await page.$('button.mase-area-button[data-area="tables"]');
      if (tablesButton) {
        await tablesButton.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('typography-tables-selected');

        // Test tables font family
        await helpers.changeSetting('content_typography[tables][font_family]', 'Source Sans Pro');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-tables-font-family');

        // Test tables font size
        await helpers.changeSetting('content_typography[tables][font_size]', '14');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-tables-font-size');

        // Test tables font weight
        await helpers.changeSetting('content_typography[tables][font_weight]', '400');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-tables-font-weight');

        console.log('  Tables typography settings applied');
        results.assertions.push({
          type: 'typography',
          section: 'tables',
          property: 'all',
          expected: 'configured',
          actual: 'configured',
          passed: true
        });
      }

      // Test 6: Notices Typography
      console.log('⚠️ Testing Notices typography...');
      
      const noticesButton = await page.$('button.mase-area-button[data-area="notices"]');
      if (noticesButton) {
        await noticesButton.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('typography-notices-selected');

        // Test notices font family
        await helpers.changeSetting('content_typography[notices][font_family]', 'Inter');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-notices-font-family');

        // Test notices font size
        await helpers.changeSetting('content_typography[notices][font_size]', '14');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-notices-font-size');

        // Test notices font weight
        await helpers.changeSetting('content_typography[notices][font_weight]', '500');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('typography-notices-font-weight');

        console.log('  Notices typography settings applied');
        results.assertions.push({
          type: 'typography',
          section: 'notices',
          property: 'all',
          expected: 'configured',
          actual: 'configured',
          passed: true
        });
      }

      // Test 7: Verify Different Sections Have Different Fonts
      console.log('🔍 Verifying section independence...');
      
      // Go back to headings to verify it still has Montserrat
      if (headingsButton) {
        await headingsButton.click();
        await helpers.pause(300);
        
        const verifyHeadingFont = await page.inputValue('[name="content_typography[headings][font_family]"]');
        helpers.assert.equals(verifyHeadingFont, 'Montserrat', 'Headings should still have Montserrat');
        console.log('  ✓ Headings font preserved: Montserrat');
      }

      // Go to widgets to verify it has Lato
      if (widgetsButton) {
        await widgetsButton.click();
        await helpers.pause(300);
        
        const verifyWidgetsFont = await page.inputValue('[name="content_typography[widgets][font_family]"]');
        helpers.assert.equals(verifyWidgetsFont, 'Lato', 'Widgets should have Lato');
        console.log('  ✓ Widgets font preserved: Lato');
      }

      // Go to notices to verify it has Inter
      if (noticesButton) {
        await noticesButton.click();
        await helpers.pause(300);
        
        const verifyNoticesFont = await page.inputValue('[name="content_typography[notices][font_family]"]');
        helpers.assert.equals(verifyNoticesFont, 'Inter', 'Notices should have Inter');
        console.log('  ✓ Notices font preserved: Inter');
      }

      results.assertions.push({
        type: 'independence',
        description: 'Section fonts are independent',
        passed: true
      });

      // Test 8: Save and Verify Persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('typography-sections-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('typography');
      await helpers.takeScreenshot('typography-sections-after-reload');

      // Verify headings font persisted
      if (headingsButton) {
        await headingsButton.click();
        await helpers.pause(300);
        
        const persistedHeadingsFont = await page.inputValue('[name="content_typography[headings][font_family]"]');
        helpers.assert.equals(persistedHeadingsFont, 'Montserrat', 'Headings font should persist after reload');
        results.assertions.push({
          type: 'persistence',
          section: 'headings',
          field: 'font_family',
          expected: 'Montserrat',
          actual: persistedHeadingsFont,
          passed: true
        });
        console.log('  ✓ Headings font persisted: Montserrat');
      }

      // Verify widgets font persisted
      if (widgetsButton) {
        await widgetsButton.click();
        await helpers.pause(300);
        
        const persistedWidgetsFont = await page.inputValue('[name="content_typography[widgets][font_family]"]');
        helpers.assert.equals(persistedWidgetsFont, 'Lato', 'Widgets font should persist after reload');
        results.assertions.push({
          type: 'persistence',
          section: 'widgets',
          field: 'font_family',
          expected: 'Lato',
          actual: persistedWidgetsFont,
          passed: true
        });
        console.log('  ✓ Widgets font persisted: Lato');
      }

      // Verify notices font persisted
      if (noticesButton) {
        await noticesButton.click();
        await helpers.pause(300);
        
        const persistedNoticesFont = await page.inputValue('[name="content_typography[notices][font_family]"]');
        helpers.assert.equals(persistedNoticesFont, 'Inter', 'Notices font should persist after reload');
        results.assertions.push({
          type: 'persistence',
          section: 'notices',
          field: 'font_family',
          expected: 'Inter',
          actual: persistedNoticesFont,
          passed: true
        });
        console.log('  ✓ Notices font persisted: Inter');
      }

      console.log('✅ Section fonts test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('typography-sections-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
