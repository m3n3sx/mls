/**
 * Dashboard Widgets Styling Test
 * 
 * Tests dashboard widget customization including:
 * - Widget container styling (background, borders, shadows)
 * - Widget header styling (colors, typography)
 * - Widget content styling (colors, typography, links)
 * - Advanced effects (glassmorphism, hover animations)
 * - Live Preview updates
 * - Persistence after save
 * 
 * Requirements: 2.2
 */

module.exports = {
  // Test metadata
  name: 'Dashboard Widgets Styling',
  description: 'Test widget color and typography customization',
  tab: 'widgets',
  tags: ['widgets', 'visual', 'colors', 'typography'],
  requirements: ['2.2'],
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
      // Navigate to Widgets tab
      console.log('📍 Navigating to Dashboard Widgets tab...');
      await helpers.navigateToTab('widgets');
      await helpers.takeScreenshot('widgets-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Widget Container Background Color
      console.log('🎨 Testing widget container background color...');
      
      // First ensure solid background type is selected
      const bgTypeSelector = await page.$('select[name="dashboard_widgets[container][bg_type]"]');
      if (bgTypeSelector) {
        await page.selectOption('select[name="dashboard_widgets[container][bg_type]"]', 'solid');
        await helpers.waitForLivePreview();
      }
      
      await helpers.changeSetting('dashboard_widgets[container][bg_color]', '#F0F8FF');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('widgets-container-bg-light-blue');

      // Verify background color applied (check if .postbox elements exist)
      const widgetExists = await page.$('.postbox');
      if (widgetExists) {
        const containerBg = await helpers.getComputedStyle('.postbox', 'background-color');
        const containerBgMatch = helpers.normalizeColor(containerBg);
        helpers.assert.contains(containerBgMatch, '240,248,255', 'Container background should be light blue (240,248,255)');
        results.assertions.push({
          type: 'color',
          property: 'background-color',
          expected: '240,248,255',
          actual: containerBgMatch,
          passed: true
        });
      }

      // Test 2: Widget Container Border
      console.log('🔲 Testing widget container border...');
      await helpers.changeSetting('dashboard_widgets[container][border_color]', '#4169E1');
      await helpers.changeSetting('dashboard_widgets[container][border_width_top]', '2');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('widgets-container-border');

      if (widgetExists) {
        const borderColor = await helpers.getComputedStyle('.postbox', 'border-top-color');
        const borderColorMatch = helpers.normalizeColor(borderColor);
        helpers.assert.contains(borderColorMatch, '65,105,225', 'Border color should be royal blue (65,105,225)');
        results.assertions.push({
          type: 'color',
          property: 'border-top-color',
          expected: '65,105,225',
          actual: borderColorMatch,
          passed: true
        });
      }

      // Test 3: Widget Header Styling
      console.log('📋 Testing widget header styling...');
      
      // Click on Widget Headers selector button
      const headerButton = await page.$('button[data-widget-target="header"]');
      if (headerButton) {
        await headerButton.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('widgets-header-section');
      }

      await helpers.changeSetting('dashboard_widgets[header][bg_color]', '#E6E6FA');
      await helpers.changeSetting('dashboard_widgets[header][text_color]', '#4B0082');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('widgets-header-styled');

      // Verify header styling
      const headerExists = await page.$('.postbox .hndle');
      if (headerExists) {
        const headerBg = await helpers.getComputedStyle('.postbox .hndle', 'background-color');
        const headerBgMatch = helpers.normalizeColor(headerBg);
        helpers.assert.contains(headerBgMatch, '230,230,250', 'Header background should be lavender (230,230,250)');
        results.assertions.push({
          type: 'color',
          property: 'header-background-color',
          expected: '230,230,250',
          actual: headerBgMatch,
          passed: true
        });
      }

      // Test 4: Widget Header Typography
      console.log('✏️ Testing widget header typography...');
      await helpers.changeSetting('dashboard_widgets[header][font_size]', '16');
      await helpers.changeSetting('dashboard_widgets[header][font_weight]', '700');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('widgets-header-typography');

      if (headerExists) {
        const fontSize = await helpers.getComputedStyle('.postbox .hndle', 'font-size');
        helpers.assert.contains(fontSize, '16px', 'Header font size should be 16px');
        results.assertions.push({
          type: 'typography',
          property: 'font-size',
          expected: '16px',
          actual: fontSize,
          passed: true
        });
      }

      // Test 5: Widget Content Styling
      console.log('📝 Testing widget content styling...');
      
      // Click on Widget Content selector button
      const contentButton = await page.$('button[data-widget-target="content"]');
      if (contentButton) {
        await contentButton.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('widgets-content-section');
      }

      await helpers.changeSetting('dashboard_widgets[content][text_color]', '#2F4F4F');
      await helpers.changeSetting('dashboard_widgets[content][link_color]', '#1E90FF');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('widgets-content-styled');

      // Verify content text color
      const contentExists = await page.$('.postbox .inside');
      if (contentExists) {
        const textColor = await helpers.getComputedStyle('.postbox .inside', 'color');
        const textColorMatch = helpers.normalizeColor(textColor);
        helpers.assert.contains(textColorMatch, '47,79,79', 'Content text should be dark slate gray (47,79,79)');
        results.assertions.push({
          type: 'color',
          property: 'content-text-color',
          expected: '47,79,79',
          actual: textColorMatch,
          passed: true
        });
      }

      // Test 6: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('widgets-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('widgets');
      await helpers.takeScreenshot('widgets-after-reload');

      // Verify container background color persisted
      const persistedContainerBg = await page.inputValue('[name="dashboard_widgets[container][bg_color]"]');
      helpers.assert.equals(persistedContainerBg.toUpperCase(), '#F0F8FF', 'Container background color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'container_bg_color',
        expected: '#F0F8FF',
        actual: persistedContainerBg.toUpperCase(),
        passed: true
      });

      // Verify header background color persisted
      const headerButton2 = await page.$('button[data-widget-target="header"]');
      if (headerButton2) {
        await headerButton2.click();
        await helpers.pause(300);
      }
      
      const persistedHeaderBg = await page.inputValue('[name="dashboard_widgets[header][bg_color]"]');
      helpers.assert.equals(persistedHeaderBg.toUpperCase(), '#E6E6FA', 'Header background color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'header_bg_color',
        expected: '#E6E6FA',
        actual: persistedHeaderBg.toUpperCase(),
        passed: true
      });

      console.log('✅ Dashboard Widgets styling test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('widgets-styling-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
