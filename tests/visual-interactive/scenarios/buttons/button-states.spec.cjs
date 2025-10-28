/**
 * Button States Test
 * 
 * Tests all button states in the Universal Buttons tab including:
 * - All button states (normal, hover, active, focus, disabled)
 * - Button sizing options
 * - Border radius settings
 * - Comprehensive state transitions
 * 
 * Requirements: 2.5
 */

module.exports = {
  // Test metadata
  name: 'Button States',
  description: 'Test all button states, sizing, and border radius',
  tab: 'buttons',
  tags: ['buttons', 'visual', 'states', 'live-preview'],
  requirements: ['2.5'],
  estimatedDuration: 25000, // 25 seconds

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
      await helpers.takeScreenshot('buttons-states-initial');

      // Select Primary button type for testing
      console.log('🔘 Selecting Primary button type...');
      await page.click('.mase-button-type-tab[data-button-type="primary"]');
      await helpers.pause(500);

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Normal State
      console.log('📋 Testing Normal state...');
      await page.click('.mase-button-state-tab[data-button-state="normal"]');
      await helpers.pause(300);
      await helpers.takeScreenshot('state-normal-selected');

      await helpers.changeSetting('universal_buttons[primary][normal][bg_color]', '#007BFF');
      await helpers.changeSetting('universal_buttons[primary][normal][text_color]', '#FFFFFF');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('state-normal-styled');

      // Verify normal state styling
      const normalBgColor = await helpers.getComputedStyle('.mase-button-preview .button-primary', 'background-color');
      const normalBgMatch = helpers.normalizeColor(normalBgColor);
      helpers.assert.contains(normalBgMatch, '0,123,255', 'Normal state background should be blue (0,123,255)');
      results.assertions.push({
        type: 'color',
        state: 'normal',
        property: 'background-color',
        expected: '0,123,255',
        actual: normalBgMatch,
        passed: true
      });

      // Test 2: Hover State
      console.log('🖱️ Testing Hover state...');
      await page.click('.mase-button-state-tab[data-button-state="hover"]');
      await helpers.pause(300);
      await helpers.takeScreenshot('state-hover-selected');

      await helpers.changeSetting('universal_buttons[primary][hover][bg_color]', '#0056B3');
      await helpers.changeSetting('universal_buttons[primary][hover][text_color]', '#F0F0F0');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('state-hover-styled');

      // Hover over button to verify hover state
      await page.hover('.mase-button-preview .button-primary');
      await helpers.pause(500);
      await helpers.takeScreenshot('state-hover-active');

      const hoverBgColor = await helpers.getComputedStyle('.mase-button-preview .button-primary:hover', 'background-color');
      const hoverBgMatch = helpers.normalizeColor(hoverBgColor);
      helpers.assert.contains(hoverBgMatch, '0,86,179', 'Hover state background should be dark blue (0,86,179)');
      results.assertions.push({
        type: 'color',
        state: 'hover',
        property: 'background-color',
        expected: '0,86,179',
        actual: hoverBgMatch,
        passed: true
      });

      // Test 3: Active State
      console.log('👆 Testing Active state...');
      await page.click('.mase-button-state-tab[data-button-state="active"]');
      await helpers.pause(300);
      await helpers.takeScreenshot('state-active-selected');

      await helpers.changeSetting('universal_buttons[primary][active][bg_color]', '#004085');
      await helpers.changeSetting('universal_buttons[primary][active][text_color]', '#E0E0E0');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('state-active-styled');

      // Click button to verify active state
      await page.click('.mase-button-preview .button-primary');
      await helpers.pause(300);
      await helpers.takeScreenshot('state-active-clicked');

      const activeBgColor = await helpers.getComputedStyle('.mase-button-preview .button-primary:active', 'background-color');
      const activeBgMatch = helpers.normalizeColor(activeBgColor);
      helpers.assert.contains(activeBgMatch, '0,64,133', 'Active state background should be darker blue (0,64,133)');
      results.assertions.push({
        type: 'color',
        state: 'active',
        property: 'background-color',
        expected: '0,64,133',
        actual: activeBgMatch,
        passed: true
      });

      // Test 4: Focus State
      console.log('🎯 Testing Focus state...');
      await page.click('.mase-button-state-tab[data-button-state="focus"]');
      await helpers.pause(300);
      await helpers.takeScreenshot('state-focus-selected');

      await helpers.changeSetting('universal_buttons[primary][focus][bg_color]', '#0062CC');
      await helpers.changeSetting('universal_buttons[primary][focus][text_color]', '#FFFFFF');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('state-focus-styled');

      // Focus on button to verify focus state
      await page.focus('.mase-button-preview .button-primary');
      await helpers.pause(500);
      await helpers.takeScreenshot('state-focus-active');

      // Verify focus outline or box-shadow
      const focusOutline = await helpers.getComputedStyle('.mase-button-preview .button-primary:focus', 'outline');
      const focusBoxShadow = await helpers.getComputedStyle('.mase-button-preview .button-primary:focus', 'box-shadow');
      helpers.assert.isTrue(
        focusOutline !== 'none' || focusBoxShadow !== 'none',
        'Focus state should have outline or box-shadow'
      );
      results.assertions.push({
        type: 'style',
        state: 'focus',
        property: 'outline/box-shadow',
        hasVisualIndicator: true,
        passed: true
      });

      // Test 5: Disabled State
      console.log('🚫 Testing Disabled state...');
      await page.click('.mase-button-state-tab[data-button-state="disabled"]');
      await helpers.pause(300);
      await helpers.takeScreenshot('state-disabled-selected');

      await helpers.changeSetting('universal_buttons[primary][disabled][bg_color]', '#6C757D');
      await helpers.changeSetting('universal_buttons[primary][disabled][text_color]', '#AAAAAA');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('state-disabled-styled');

      // Verify disabled state styling
      const disabledBgColor = await helpers.getComputedStyle('.mase-button-preview .button-primary:disabled, .mase-button-preview .button-primary.disabled', 'background-color');
      const disabledBgMatch = helpers.normalizeColor(disabledBgColor);
      helpers.assert.contains(disabledBgMatch, '108,117,125', 'Disabled state background should be gray (108,117,125)');
      results.assertions.push({
        type: 'color',
        state: 'disabled',
        property: 'background-color',
        expected: '108,117,125',
        actual: disabledBgMatch,
        passed: true
      });

      // Verify disabled state has reduced opacity or cursor
      const disabledOpacity = await helpers.getComputedStyle('.mase-button-preview .button-primary:disabled, .mase-button-preview .button-primary.disabled', 'opacity');
      const disabledCursor = await helpers.getComputedStyle('.mase-button-preview .button-primary:disabled, .mase-button-preview .button-primary.disabled', 'cursor');
      helpers.assert.isTrue(
        parseFloat(disabledOpacity) < 1 || disabledCursor === 'not-allowed' || disabledCursor === 'default',
        'Disabled state should have reduced opacity or not-allowed cursor'
      );
      results.assertions.push({
        type: 'style',
        state: 'disabled',
        property: 'opacity/cursor',
        hasDisabledIndicator: true,
        passed: true
      });

      // Test 6: Button Sizing Options
      console.log('📏 Testing button sizing options...');
      await page.click('.mase-button-state-tab[data-button-state="normal"]');
      await helpers.pause(300);

      // Test padding (affects button size)
      const paddingInput = await page.$('input[name="universal_buttons[primary][normal][padding_vertical]"]');
      if (paddingInput) {
        await page.fill('input[name="universal_buttons[primary][normal][padding_vertical]"]', '12');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('button-padding-vertical-12');

        const paddingTop = await helpers.getComputedStyle('.mase-button-preview .button-primary', 'padding-top');
        helpers.assert.contains(paddingTop, '12px', 'Vertical padding should be 12px');
        results.assertions.push({
          type: 'dimension',
          property: 'padding-top',
          expected: '12px',
          actual: paddingTop,
          passed: true
        });
      }

      // Test horizontal padding
      const paddingHorizontalInput = await page.$('input[name="universal_buttons[primary][normal][padding_horizontal]"]');
      if (paddingHorizontalInput) {
        await page.fill('input[name="universal_buttons[primary][normal][padding_horizontal]"]', '24');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('button-padding-horizontal-24');

        const paddingLeft = await helpers.getComputedStyle('.mase-button-preview .button-primary', 'padding-left');
        helpers.assert.contains(paddingLeft, '24px', 'Horizontal padding should be 24px');
        results.assertions.push({
          type: 'dimension',
          property: 'padding-left',
          expected: '24px',
          actual: paddingLeft,
          passed: true
        });
      }

      // Test font size (affects button size)
      const fontSizeInput = await page.$('input[name="universal_buttons[primary][normal][font_size]"]');
      if (fontSizeInput) {
        await page.fill('input[name="universal_buttons[primary][normal][font_size]"]', '16');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('button-font-size-16');

        const fontSize = await helpers.getComputedStyle('.mase-button-preview .button-primary', 'font-size');
        helpers.assert.contains(fontSize, '16px', 'Font size should be 16px');
        results.assertions.push({
          type: 'dimension',
          property: 'font-size',
          expected: '16px',
          actual: fontSize,
          passed: true
        });
      }

      // Test 7: Border Radius
      console.log('📐 Testing border radius options...');
      
      // Test small border radius
      await page.fill('input[name="universal_buttons[primary][normal][border_radius]"]', '4');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('button-border-radius-4');

      let borderRadius = await helpers.getComputedStyle('.mase-button-preview .button-primary', 'border-radius');
      helpers.assert.contains(borderRadius, '4px', 'Border radius should be 4px');
      results.assertions.push({
        type: 'dimension',
        property: 'border-radius',
        expected: '4px',
        actual: borderRadius,
        passed: true
      });

      // Test medium border radius
      await page.fill('input[name="universal_buttons[primary][normal][border_radius]"]', '8');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('button-border-radius-8');

      borderRadius = await helpers.getComputedStyle('.mase-button-preview .button-primary', 'border-radius');
      helpers.assert.contains(borderRadius, '8px', 'Border radius should be 8px');
      results.assertions.push({
        type: 'dimension',
        property: 'border-radius',
        expected: '8px',
        actual: borderRadius,
        passed: true
      });

      // Test large border radius (pill shape)
      await page.fill('input[name="universal_buttons[primary][normal][border_radius]"]', '50');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('button-border-radius-50-pill');

      borderRadius = await helpers.getComputedStyle('.mase-button-preview .button-primary', 'border-radius');
      helpers.assert.contains(borderRadius, '50px', 'Border radius should be 50px (pill shape)');
      results.assertions.push({
        type: 'dimension',
        property: 'border-radius',
        expected: '50px',
        actual: borderRadius,
        passed: true
      });

      // Test no border radius (square)
      await page.fill('input[name="universal_buttons[primary][normal][border_radius]"]', '0');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('button-border-radius-0-square');

      borderRadius = await helpers.getComputedStyle('.mase-button-preview .button-primary', 'border-radius');
      helpers.assert.contains(borderRadius, '0px', 'Border radius should be 0px (square)');
      results.assertions.push({
        type: 'dimension',
        property: 'border-radius',
        expected: '0px',
        actual: borderRadius,
        passed: true
      });

      // Test 8: State Transitions
      console.log('🔄 Testing state transitions...');
      
      // Verify transition property exists
      const transition = await helpers.getComputedStyle('.mase-button-preview .button-primary', 'transition');
      helpers.assert.isTrue(
        transition !== 'none' && transition !== '',
        'Button should have transition property for smooth state changes'
      );
      results.assertions.push({
        type: 'style',
        property: 'transition',
        hasTransition: true,
        passed: true
      });

      // Test 9: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('button-states-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('buttons');
      await page.click('.mase-button-type-tab[data-button-type="primary"]');
      await page.click('.mase-button-state-tab[data-button-state="normal"]');
      await helpers.pause(500);
      await helpers.takeScreenshot('button-states-after-reload');

      // Verify border radius persisted
      const persistedBorderRadius = await page.inputValue('input[name="universal_buttons[primary][normal][border_radius]"]');
      helpers.assert.equals(persistedBorderRadius, '0', 'Border radius should persist');
      results.assertions.push({
        type: 'persistence',
        field: 'border_radius',
        expected: '0',
        actual: persistedBorderRadius,
        passed: true
      });

      // Verify disabled state persisted
      await page.click('.mase-button-state-tab[data-button-state="disabled"]');
      await helpers.pause(300);
      const persistedDisabledBg = await page.inputValue('input[name="universal_buttons[primary][disabled][bg_color]"]');
      helpers.assert.equals(persistedDisabledBg.toUpperCase(), '#6C757D', 'Disabled background color should persist');
      results.assertions.push({
        type: 'persistence',
        field: 'disabled_bg_color',
        expected: '#6C757D',
        actual: persistedDisabledBg.toUpperCase(),
        passed: true
      });

      console.log('✅ Button states test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('button-states-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
