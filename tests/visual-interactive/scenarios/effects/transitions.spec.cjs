/**
 * Effects Tab - Transitions Test
 * 
 * Tests transition and timing settings in the Effects tab including:
 * - Shadow blur transitions
 * - Border radius transitions
 * - Shadow color transitions
 * - Multiple element transitions
 * - Preset transitions
 * - Performance optimization settings
 * 
 * Requirements: 2.6
 */

module.exports = {
  // Test metadata
  name: 'Effects Transitions',
  description: 'Test transition timing and duration settings in Effects tab',
  tab: 'effects',
  tags: ['effects', 'visual', 'transitions'],
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
      await helpers.takeScreenshot('transitions-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Set to custom preset to enable individual controls
      await helpers.changeSetting('visual_effects[preset]', 'custom');
      await helpers.waitForLivePreview();

      // Test 1: Smooth Preset Transitions
      console.log('🎬 Testing smooth preset transitions...');
      
      // Transition through all presets to test smooth changes
      const presets = ['flat', 'subtle', 'elevated', 'floating', 'custom'];
      
      for (const preset of presets) {
        console.log(`  Transitioning to ${preset} preset...`);
        await helpers.changeSetting('visual_effects[preset]', preset);
        await helpers.waitForLivePreview();
        await helpers.pause(300); // Allow transition to complete
        await helpers.takeScreenshot(`transitions-preset-${preset}`);
        
        // Verify preset is selected
        const currentPreset = await page.inputValue('[name="visual_effects[preset]"]');
        helpers.assert.equals(currentPreset, preset, `Preset should be ${preset}`);
        results.assertions.push({
          type: 'preset_transition',
          preset: preset,
          expected: preset,
          actual: currentPreset,
          passed: true
        });
      }

      // Test 2: Border Radius Transition
      console.log('🔄 Testing border radius smooth transitions...');
      
      // Set back to custom for individual control
      await helpers.changeSetting('visual_effects[preset]', 'custom');
      await helpers.waitForLivePreview();
      
      // Test smooth border radius transitions for admin bar
      const radiusValues = ['0', '5', '10', '15', '20', '25', '30'];
      const radiusSelector = '[name="visual_effects[admin_bar][border_radius]"]';
      
      for (const radius of radiusValues) {
        await page.fill(radiusSelector, radius);
        await page.dispatchEvent(radiusSelector, 'input');
        await helpers.waitForLivePreview();
        await helpers.pause(200); // Allow transition
        
        if (radius === '0' || radius === '15' || radius === '30') {
          await helpers.takeScreenshot(`transitions-radius-${radius}`);
        }
      }
      
      // Verify final radius value
      const finalRadius = await page.inputValue(radiusSelector);
      helpers.assert.equals(finalRadius, '30', 'Border radius should be 30');
      results.assertions.push({
        type: 'border_radius_transition',
        expected: '30',
        actual: finalRadius,
        passed: true
      });

      // Test 3: Shadow Blur Transition
      console.log('✨ Testing shadow blur smooth transitions...');
      
      // Enable shadows first
      await helpers.changeSetting('visual_effects[admin_bar][shadow_intensity]', 'medium');
      await helpers.waitForLivePreview();
      
      // Test smooth shadow blur transitions
      const blurValues = ['0', '5', '10', '15', '20', '25', '30'];
      const blurSelector = '[name="visual_effects[admin_bar][shadow_blur]"]';
      
      for (const blur of blurValues) {
        await page.fill(blurSelector, blur);
        await page.dispatchEvent(blurSelector, 'input');
        await helpers.waitForLivePreview();
        await helpers.pause(200); // Allow transition
        
        if (blur === '0' || blur === '15' || blur === '30') {
          await helpers.takeScreenshot(`transitions-blur-${blur}`);
        }
      }
      
      // Verify final blur value
      const finalBlur = await page.inputValue(blurSelector);
      helpers.assert.equals(finalBlur, '30', 'Shadow blur should be 30');
      results.assertions.push({
        type: 'shadow_blur_transition',
        expected: '30',
        actual: finalBlur,
        passed: true
      });

      // Test 4: Shadow Color Transition
      console.log('🎨 Testing shadow color transitions...');
      
      // Test color transitions
      const colors = [
        'rgba(0, 0, 0, 0.1)',
        'rgba(255, 0, 0, 0.3)',
        'rgba(0, 255, 0, 0.3)',
        'rgba(0, 0, 255, 0.3)',
        'rgba(0, 0, 0, 0.5)'
      ];
      
      for (let i = 0; i < colors.length; i++) {
        await helpers.changeSetting('visual_effects[admin_bar][shadow_color]', colors[i]);
        await helpers.waitForLivePreview();
        await helpers.pause(300); // Allow color transition
        
        if (i === 0 || i === colors.length - 1) {
          await helpers.takeScreenshot(`transitions-color-${i}`);
        }
      }
      
      // Verify final color
      const finalColor = await page.inputValue('[name="visual_effects[admin_bar][shadow_color]"]');
      helpers.assert.contains(finalColor.toLowerCase(), 'rgba', 'Shadow color should be in RGBA format');
      results.assertions.push({
        type: 'shadow_color_transition',
        expected: 'rgba format',
        actual: finalColor,
        passed: true
      });

      // Test 5: Multiple Element Transitions
      console.log('🔀 Testing multiple element transitions simultaneously...');
      
      // Change multiple elements at once to test transition coordination
      await helpers.changeSetting('visual_effects[buttons][shadow_intensity]', 'strong');
      await helpers.changeSetting('visual_effects[admin_menu][shadow_intensity]', 'medium');
      await helpers.changeSetting('visual_effects[form_fields][shadow_intensity]', 'subtle');
      await helpers.waitForLivePreview();
      await helpers.pause(500); // Allow all transitions to complete
      await helpers.takeScreenshot('transitions-multiple-elements');
      
      // Verify all elements updated
      const buttonShadow = await page.inputValue('[name="visual_effects[buttons][shadow_intensity]"]');
      const menuShadow = await page.inputValue('[name="visual_effects[admin_menu][shadow_intensity]"]');
      const formShadow = await page.inputValue('[name="visual_effects[form_fields][shadow_intensity]"]');
      
      helpers.assert.equals(buttonShadow, 'strong', 'Button shadow should be strong');
      helpers.assert.equals(menuShadow, 'medium', 'Menu shadow should be medium');
      helpers.assert.equals(formShadow, 'subtle', 'Form shadow should be subtle');
      
      results.assertions.push({
        type: 'multiple_transitions',
        elements: ['buttons', 'menu', 'form_fields'],
        expected: ['strong', 'medium', 'subtle'],
        actual: [buttonShadow, menuShadow, formShadow],
        passed: true
      });

      // Test 6: Performance Optimization Settings
      console.log('⚡ Testing performance optimization settings...');
      
      // Test low-power device detection if available
      const lowPowerSelector = '[name="visual_effects[auto_detect_low_power]"]';
      const lowPowerExists = await page.locator(lowPowerSelector).count() > 0;
      
      if (lowPowerExists) {
        // Toggle low-power detection
        const isChecked = await page.isChecked(lowPowerSelector);
        
        if (isChecked) {
          await page.uncheck(lowPowerSelector);
        } else {
          await page.check(lowPowerSelector);
        }
        
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('transitions-low-power-toggled');
        
        // Verify toggle worked
        const newState = await page.isChecked(lowPowerSelector);
        helpers.assert.equals(newState, !isChecked, 'Low-power detection should toggle');
        results.assertions.push({
          type: 'performance_optimization',
          expected: !isChecked,
          actual: newState,
          passed: true
        });
      }

      // Test 7: Rapid Transitions (Stress Test)
      console.log('⚡ Testing rapid transitions...');
      
      // Rapidly change values to test transition performance
      const rapidRadiusSelector = '[name="visual_effects[buttons][border_radius]"]';
      const rapidValues = ['5', '15', '25', '10', '20', '30'];
      
      for (const value of rapidValues) {
        await page.fill(rapidRadiusSelector, value);
        await page.dispatchEvent(rapidRadiusSelector, 'input');
        await helpers.pause(100); // Minimal pause for rapid transitions
      }
      
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('transitions-rapid-complete');
      
      // Verify final value after rapid changes
      const rapidFinalValue = await page.inputValue(rapidRadiusSelector);
      helpers.assert.equals(rapidFinalValue, '30', 'Final value should be 30 after rapid transitions');
      results.assertions.push({
        type: 'rapid_transitions',
        expected: '30',
        actual: rapidFinalValue,
        passed: true
      });

      // Test 8: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('transitions-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('effects');
      await helpers.takeScreenshot('transitions-after-reload');

      // Verify settings persisted
      const persistedRadius = await page.inputValue('[name="visual_effects[admin_bar][border_radius]"]');
      helpers.assert.equals(persistedRadius, '30', 'Border radius should persist after reload');
      
      const persistedBlur = await page.inputValue('[name="visual_effects[admin_bar][shadow_blur]"]');
      helpers.assert.equals(persistedBlur, '30', 'Shadow blur should persist after reload');
      
      const persistedButtonShadow = await page.inputValue('[name="visual_effects[buttons][shadow_intensity]"]');
      helpers.assert.equals(persistedButtonShadow, 'strong', 'Button shadow should persist after reload');
      
      results.assertions.push({
        type: 'persistence',
        fields: ['border_radius', 'shadow_blur', 'button_shadow'],
        expected: ['30', '30', 'strong'],
        actual: [persistedRadius, persistedBlur, persistedButtonShadow],
        passed: true
      });

      console.log('✅ Effects transitions test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('transitions-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
