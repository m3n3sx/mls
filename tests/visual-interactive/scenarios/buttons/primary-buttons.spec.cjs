/**
 * Primary Buttons Test
 * 
 * Tests primary button styling in the Universal Buttons tab including:
 * - Primary button normal state
 * - Primary button hover state
 * - Primary button active state
 * - Button preview updates
 * 
 * Requirements: 2.5, 4.3
 */

module.exports = {
  // Test metadata
  name: 'Primary Buttons',
  description: 'Test primary button states and styling',
  tab: 'buttons',
  tags: ['buttons', 'visual', 'live-preview'],
  requirements: ['2.5', '4.3'],
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
      // Navigate to Buttons tab
      console.log('📍 Navigating to Universal Buttons tab...');
      await helpers.navigateToTab('buttons');
      await helpers.takeScreenshot('buttons-initial');

      // Ensure Primary button type is selected
      console.log('🔘 Selecting Primary button type...');
      await page.click('.mase-button-type-tab[data-button-type="primary"]');
      await helpers.pause(500);

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Normal State - Background Color
      console.log('🎨 Testing normal state background color...');
      await page.click('.mase-button-state-tab[data-button-state="normal"]');
      await helpers.pause(300);
      
      await helpers.changeSetting('universal_buttons[primary][normal][bg_color]', '#FF5733');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('primary-normal-bg-orange');

      // Verify button preview exists
      const previewButton = await page.$('.mase-button-preview .button-primary');
      helpers.assert.isTrue(previewButton !== null, 'Primary button preview should exist');
      
      // Verify background color in preview
      const normalBgColor = await helpers.getComputedStyle('.mase-button-preview .button-primary', 'background-color');
      const normalBgMatch = helpers.normalizeColor(normalBgColor);
      helpers.assert.contains(normalBgMatch, '255,87,51', 'Normal state background should be orange (255,87,51)');
      results.assertions.push({
        type: 'color',
        state: 'normal',
        property: 'background-color',
        expected: '255,87,51',
        actual: normalBgMatch,
        passed: true
      });

      // Test 2: Normal State - Text Color
      console.log('✏️ Testing normal state text color...');
      await helpers.changeSetting('universal_buttons[primary][normal][text_color]', '#FFFFFF');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('primary-normal-text-white');

      const normalTextColor = await helpers.getComputedStyle('.mase-button-preview .button-primary', 'color');
      const normalTextMatch = helpers.normalizeColor(normalTextColor);
      helpers.assert.contains(normalTextMatch, '255,255,255', 'Normal state text should be white (255,255,255)');
      results.assertions.push({
        type: 'color',
        state: 'normal',
        property: 'color',
        expected: '255,255,255',
        actual: normalTextMatch,
        passed: true
      });

      // Test 3: Hover State - Background Color
      console.log('🖱️ Testing hover state background color...');
      await page.click('.mase-button-state-tab[data-button-state="hover"]');
      await helpers.pause(300);
      
      await helpers.changeSetting('universal_buttons[primary][hover][bg_color]', '#C70039');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('primary-hover-bg-red');

      // Hover over preview button to trigger hover state
      await page.hover('.mase-button-preview .button-primary');
      await helpers.pause(500);
      await helpers.takeScreenshot('primary-hover-active');

      const hoverBgColor = await helpers.getComputedStyle('.mase-button-preview .button-primary:hover', 'background-color');
      const hoverBgMatch = helpers.normalizeColor(hoverBgColor);
      helpers.assert.contains(hoverBgMatch, '199,0,57', 'Hover state background should be red (199,0,57)');
      results.assertions.push({
        type: 'color',
        state: 'hover',
        property: 'background-color',
        expected: '199,0,57',
        actual: hoverBgMatch,
        passed: true
      });

      // Test 4: Hover State - Text Color
      console.log('✏️ Testing hover state text color...');
      await helpers.changeSetting('universal_buttons[primary][hover][text_color]', '#F0F0F0');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('primary-hover-text-light');

      // Test 5: Active State - Background Color
      console.log('👆 Testing active state background color...');
      await page.click('.mase-button-state-tab[data-button-state="active"]');
      await helpers.pause(300);
      
      await helpers.changeSetting('universal_buttons[primary][active][bg_color]', '#900C3F');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('primary-active-bg-dark');

      // Click preview button to trigger active state
      await page.click('.mase-button-preview .button-primary');
      await helpers.pause(300);
      await helpers.takeScreenshot('primary-active-clicked');

      const activeBgColor = await helpers.getComputedStyle('.mase-button-preview .button-primary:active', 'background-color');
      const activeBgMatch = helpers.normalizeColor(activeBgColor);
      helpers.assert.contains(activeBgMatch, '144,12,63', 'Active state background should be dark red (144,12,63)');
      results.assertions.push({
        type: 'color',
        state: 'active',
        property: 'background-color',
        expected: '144,12,63',
        actual: activeBgMatch,
        passed: true
      });

      // Test 6: Active State - Text Color
      console.log('✏️ Testing active state text color...');
      await helpers.changeSetting('universal_buttons[primary][active][text_color]', '#E0E0E0');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('primary-active-text-gray');

      // Test 7: Border Radius
      console.log('📐 Testing border radius...');
      await page.click('.mase-button-state-tab[data-button-state="normal"]');
      await helpers.pause(300);
      
      // Find and change border radius slider
      const borderRadiusInput = await page.$('input[name="universal_buttons[primary][normal][border_radius]"]');
      if (borderRadiusInput) {
        await page.fill('input[name="universal_buttons[primary][normal][border_radius]"]', '10');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('primary-border-radius-10');

        const borderRadius = await helpers.getComputedStyle('.mase-button-preview .button-primary', 'border-radius');
        helpers.assert.contains(borderRadius, '10px', 'Border radius should be 10px');
        results.assertions.push({
          type: 'dimension',
          property: 'border-radius',
          expected: '10px',
          actual: borderRadius,
          passed: true
        });
      }

      // Test 8: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('primary-buttons-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('buttons');
      await page.click('.mase-button-type-tab[data-button-type="primary"]');
      await page.click('.mase-button-state-tab[data-button-state="normal"]');
      await helpers.pause(500);
      await helpers.takeScreenshot('primary-after-reload');

      // Verify normal state background color persisted
      const persistedNormalBg = await page.inputValue('input[name="universal_buttons[primary][normal][bg_color]"]');
      helpers.assert.equals(persistedNormalBg.toUpperCase(), '#FF5733', 'Normal background color should persist');
      results.assertions.push({
        type: 'persistence',
        field: 'normal_bg_color',
        expected: '#FF5733',
        actual: persistedNormalBg.toUpperCase(),
        passed: true
      });

      // Verify hover state background color persisted
      await page.click('.mase-button-state-tab[data-button-state="hover"]');
      await helpers.pause(300);
      const persistedHoverBg = await page.inputValue('input[name="universal_buttons[primary][hover][bg_color]"]');
      helpers.assert.equals(persistedHoverBg.toUpperCase(), '#C70039', 'Hover background color should persist');
      results.assertions.push({
        type: 'persistence',
        field: 'hover_bg_color',
        expected: '#C70039',
        actual: persistedHoverBg.toUpperCase(),
        passed: true
      });

      // Verify active state background color persisted
      await page.click('.mase-button-state-tab[data-button-state="active"]');
      await helpers.pause(300);
      const persistedActiveBg = await page.inputValue('input[name="universal_buttons[primary][active][bg_color]"]');
      helpers.assert.equals(persistedActiveBg.toUpperCase(), '#900C3F', 'Active background color should persist');
      results.assertions.push({
        type: 'persistence',
        field: 'active_bg_color',
        expected: '#900C3F',
        actual: persistedActiveBg.toUpperCase(),
        passed: true
      });

      console.log('✅ Primary buttons test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('primary-buttons-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
