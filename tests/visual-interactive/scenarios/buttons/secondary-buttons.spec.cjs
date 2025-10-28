/**
 * Secondary Buttons Test
 * 
 * Tests secondary button styling in the Universal Buttons tab including:
 * - Secondary button states (normal, hover, active)
 * - Visual differences from primary buttons
 * - Button preview updates
 * 
 * Requirements: 2.5
 */

module.exports = {
  // Test metadata
  name: 'Secondary Buttons',
  description: 'Test secondary button states and verify visual differences from primary',
  tab: 'buttons',
  tags: ['buttons', 'visual', 'live-preview'],
  requirements: ['2.5'],
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
      // Navigate to Buttons tab
      console.log('📍 Navigating to Universal Buttons tab...');
      await helpers.navigateToTab('buttons');
      await helpers.takeScreenshot('buttons-secondary-initial');

      // Select Secondary button type
      console.log('🔘 Selecting Secondary button type...');
      await page.click('.mase-button-type-tab[data-button-type="secondary"]');
      await helpers.pause(500);
      await helpers.takeScreenshot('secondary-type-selected');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Normal State - Background Color
      console.log('🎨 Testing secondary normal state background color...');
      await page.click('.mase-button-state-tab[data-button-state="normal"]');
      await helpers.pause(300);
      
      await helpers.changeSetting('universal_buttons[secondary][normal][bg_color]', '#6C757D');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('secondary-normal-bg-gray');

      // Verify secondary button preview exists
      const previewButton = await page.$('.mase-button-preview .button-secondary, .mase-button-preview .button');
      helpers.assert.isTrue(previewButton !== null, 'Secondary button preview should exist');
      
      // Verify background color in preview
      const normalBgColor = await helpers.getComputedStyle('.mase-button-preview .button-secondary, .mase-button-preview .button', 'background-color');
      const normalBgMatch = helpers.normalizeColor(normalBgColor);
      helpers.assert.contains(normalBgMatch, '108,117,125', 'Secondary normal background should be gray (108,117,125)');
      results.assertions.push({
        type: 'color',
        state: 'normal',
        property: 'background-color',
        expected: '108,117,125',
        actual: normalBgMatch,
        passed: true
      });

      // Test 2: Normal State - Text Color
      console.log('✏️ Testing secondary normal state text color...');
      await helpers.changeSetting('universal_buttons[secondary][normal][text_color]', '#FFFFFF');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('secondary-normal-text-white');

      const normalTextColor = await helpers.getComputedStyle('.mase-button-preview .button-secondary, .mase-button-preview .button', 'color');
      const normalTextMatch = helpers.normalizeColor(normalTextColor);
      helpers.assert.contains(normalTextMatch, '255,255,255', 'Secondary normal text should be white (255,255,255)');
      results.assertions.push({
        type: 'color',
        state: 'normal',
        property: 'color',
        expected: '255,255,255',
        actual: normalTextMatch,
        passed: true
      });

      // Test 3: Hover State - Background Color
      console.log('🖱️ Testing secondary hover state background color...');
      await page.click('.mase-button-state-tab[data-button-state="hover"]');
      await helpers.pause(300);
      
      await helpers.changeSetting('universal_buttons[secondary][hover][bg_color]', '#5A6268');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('secondary-hover-bg-dark-gray');

      // Hover over preview button to trigger hover state
      await page.hover('.mase-button-preview .button-secondary, .mase-button-preview .button');
      await helpers.pause(500);
      await helpers.takeScreenshot('secondary-hover-active');

      const hoverBgColor = await helpers.getComputedStyle('.mase-button-preview .button-secondary:hover, .mase-button-preview .button:hover', 'background-color');
      const hoverBgMatch = helpers.normalizeColor(hoverBgColor);
      helpers.assert.contains(hoverBgMatch, '90,98,104', 'Secondary hover background should be dark gray (90,98,104)');
      results.assertions.push({
        type: 'color',
        state: 'hover',
        property: 'background-color',
        expected: '90,98,104',
        actual: hoverBgMatch,
        passed: true
      });

      // Test 4: Hover State - Text Color
      console.log('✏️ Testing secondary hover state text color...');
      await helpers.changeSetting('universal_buttons[secondary][hover][text_color]', '#F8F9FA');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('secondary-hover-text-light');

      // Test 5: Active State - Background Color
      console.log('👆 Testing secondary active state background color...');
      await page.click('.mase-button-state-tab[data-button-state="active"]');
      await helpers.pause(300);
      
      await helpers.changeSetting('universal_buttons[secondary][active][bg_color]', '#545B62');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('secondary-active-bg-darker');

      // Click preview button to trigger active state
      await page.click('.mase-button-preview .button-secondary, .mase-button-preview .button');
      await helpers.pause(300);
      await helpers.takeScreenshot('secondary-active-clicked');

      const activeBgColor = await helpers.getComputedStyle('.mase-button-preview .button-secondary:active, .mase-button-preview .button:active', 'background-color');
      const activeBgMatch = helpers.normalizeColor(activeBgColor);
      helpers.assert.contains(activeBgMatch, '84,91,98', 'Secondary active background should be darker gray (84,91,98)');
      results.assertions.push({
        type: 'color',
        state: 'active',
        property: 'background-color',
        expected: '84,91,98',
        actual: activeBgMatch,
        passed: true
      });

      // Test 6: Active State - Text Color
      console.log('✏️ Testing secondary active state text color...');
      await helpers.changeSetting('universal_buttons[secondary][active][text_color]', '#E9ECEF');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('secondary-active-text-light-gray');

      // Test 7: Border Width (to differentiate from primary)
      console.log('📏 Testing secondary border width...');
      await page.click('.mase-button-state-tab[data-button-state="normal"]');
      await helpers.pause(300);
      
      // Find and change border width
      const borderWidthInput = await page.$('input[name="universal_buttons[secondary][normal][border_width]"]');
      if (borderWidthInput) {
        await page.fill('input[name="universal_buttons[secondary][normal][border_width]"]', '2');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('secondary-border-width-2');

        const borderWidth = await helpers.getComputedStyle('.mase-button-preview .button-secondary, .mase-button-preview .button', 'border-width');
        helpers.assert.contains(borderWidth, '2px', 'Secondary border width should be 2px');
        results.assertions.push({
          type: 'dimension',
          property: 'border-width',
          expected: '2px',
          actual: borderWidth,
          passed: true
        });
      }

      // Test 8: Border Color (to differentiate from primary)
      console.log('🎨 Testing secondary border color...');
      const borderColorInput = await page.$('input[name="universal_buttons[secondary][normal][border_color]"]');
      if (borderColorInput) {
        await helpers.changeSetting('universal_buttons[secondary][normal][border_color]', '#495057');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('secondary-border-color-dark');

        const borderColor = await helpers.getComputedStyle('.mase-button-preview .button-secondary, .mase-button-preview .button', 'border-color');
        const borderColorMatch = helpers.normalizeColor(borderColor);
        helpers.assert.contains(borderColorMatch, '73,80,87', 'Secondary border color should be dark gray (73,80,87)');
        results.assertions.push({
          type: 'color',
          property: 'border-color',
          expected: '73,80,87',
          actual: borderColorMatch,
          passed: true
        });
      }

      // Test 9: Verify visual difference from primary
      console.log('🔍 Verifying visual differences from primary buttons...');
      
      // Switch to primary to compare
      await page.click('.mase-button-type-tab[data-button-type="primary"]');
      await helpers.pause(500);
      await helpers.takeScreenshot('primary-for-comparison');
      
      const primaryBgColor = await helpers.getComputedStyle('.mase-button-preview .button-primary', 'background-color');
      const primaryBgMatch = helpers.normalizeColor(primaryBgColor);
      
      // Switch back to secondary
      await page.click('.mase-button-type-tab[data-button-type="secondary"]');
      await helpers.pause(500);
      
      const secondaryBgColor = await helpers.getComputedStyle('.mase-button-preview .button-secondary, .mase-button-preview .button', 'background-color');
      const secondaryBgMatch = helpers.normalizeColor(secondaryBgColor);
      
      // Verify they are different
      helpers.assert.isTrue(
        primaryBgMatch !== secondaryBgMatch,
        'Secondary button should have different background color than primary'
      );
      results.assertions.push({
        type: 'comparison',
        description: 'Primary vs Secondary background colors',
        primary: primaryBgMatch,
        secondary: secondaryBgMatch,
        different: true,
        passed: true
      });

      // Test 10: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('secondary-buttons-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('buttons');
      await page.click('.mase-button-type-tab[data-button-type="secondary"]');
      await page.click('.mase-button-state-tab[data-button-state="normal"]');
      await helpers.pause(500);
      await helpers.takeScreenshot('secondary-after-reload');

      // Verify normal state background color persisted
      const persistedNormalBg = await page.inputValue('input[name="universal_buttons[secondary][normal][bg_color]"]');
      helpers.assert.equals(persistedNormalBg.toUpperCase(), '#6C757D', 'Secondary normal background color should persist');
      results.assertions.push({
        type: 'persistence',
        field: 'normal_bg_color',
        expected: '#6C757D',
        actual: persistedNormalBg.toUpperCase(),
        passed: true
      });

      console.log('✅ Secondary buttons test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('secondary-buttons-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
