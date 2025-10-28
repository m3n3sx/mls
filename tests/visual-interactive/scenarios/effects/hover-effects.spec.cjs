/**
 * Effects Tab - Hover Effects Test
 * 
 * Tests hover effect settings in the Effects tab including:
 * - Shadow direction changes
 * - Shadow color changes
 * - Button shadow effects
 * - Menu shadow effects
 * - Form field shadow effects
 * - Visual verification of hover states
 * 
 * Requirements: 2.6
 */

module.exports = {
  // Test metadata
  name: 'Effects Hover Effects',
  description: 'Test hover effect and shadow direction settings in Effects tab',
  tab: 'effects',
  tags: ['effects', 'visual', 'hover'],
  requirements: ['2.6'],
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
      // Navigate to Effects tab
      console.log('📍 Navigating to Effects tab...');
      await helpers.navigateToTab('effects');
      await helpers.takeScreenshot('hover-effects-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Set to custom preset to enable individual controls
      await helpers.changeSetting('visual_effects[preset]', 'custom');
      await helpers.waitForLivePreview();

      // Test 1: Admin Bar Shadow Direction
      console.log('🧭 Testing admin bar shadow direction...');
      
      // Test each shadow direction
      const directions = ['top', 'right', 'bottom', 'left', 'center'];
      
      for (const direction of directions) {
        console.log(`  Testing ${direction} direction...`);
        const directionSelector = `[name="visual_effects[admin_bar][shadow_direction]"][value="${direction}"]`;
        await page.click(directionSelector);
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot(`hover-effects-adminbar-shadow-${direction}`);
        
        // Verify direction is selected
        const isChecked = await page.isChecked(directionSelector);
        helpers.assert.isTrue(isChecked, `Shadow direction ${direction} should be selected`);
        results.assertions.push({
          type: 'shadow_direction',
          direction: direction,
          expected: true,
          actual: isChecked,
          passed: true
        });
      }

      // Test 2: Admin Bar Shadow Color
      console.log('🎨 Testing admin bar shadow color...');
      
      // Test with different shadow colors
      await helpers.changeSetting('visual_effects[admin_bar][shadow_color]', 'rgba(255, 0, 0, 0.3)');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('hover-effects-adminbar-shadow-red');
      
      await helpers.changeSetting('visual_effects[admin_bar][shadow_color]', 'rgba(0, 0, 255, 0.5)');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('hover-effects-adminbar-shadow-blue');
      
      await helpers.changeSetting('visual_effects[admin_bar][shadow_color]', 'rgba(0, 0, 0, 0.2)');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('hover-effects-adminbar-shadow-black');

      // Verify shadow color value
      const shadowColor = await page.inputValue('[name="visual_effects[admin_bar][shadow_color]"]');
      helpers.assert.contains(shadowColor.toLowerCase(), 'rgba', 'Shadow color should be in RGBA format');
      results.assertions.push({
        type: 'shadow_color',
        expected: 'rgba format',
        actual: shadowColor,
        passed: true
      });

      // Test 3: Button Shadow Effects
      console.log('🔘 Testing button shadow effects...');
      
      // Enable button shadows
      await helpers.changeSetting('visual_effects[buttons][shadow_intensity]', 'medium');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('hover-effects-buttons-shadow-medium');
      
      // Test button border radius
      const buttonRadiusSelector = '[name="visual_effects[buttons][border_radius]"]';
      await page.fill(buttonRadiusSelector, '20');
      await page.dispatchEvent(buttonRadiusSelector, 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('hover-effects-buttons-radius-20');
      
      // Verify button shadow intensity
      const buttonShadowIntensity = await page.inputValue('[name="visual_effects[buttons][shadow_intensity]"]');
      helpers.assert.equals(buttonShadowIntensity, 'medium', 'Button shadow intensity should be medium');
      results.assertions.push({
        type: 'button_shadow',
        expected: 'medium',
        actual: buttonShadowIntensity,
        passed: true
      });

      // Test 4: Menu Shadow Effects
      console.log('📋 Testing menu shadow effects...');
      
      // Enable menu shadows
      await helpers.changeSetting('visual_effects[admin_menu][shadow_intensity]', 'subtle');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('hover-effects-menu-shadow-subtle');
      
      // Test menu shadow direction
      const menuShadowDirectionSelector = '[name="visual_effects[admin_menu][shadow_direction]"][value="right"]';
      await page.click(menuShadowDirectionSelector);
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('hover-effects-menu-shadow-right');
      
      // Test menu border radius
      const menuRadiusSelector = '[name="visual_effects[admin_menu][border_radius]"]';
      await page.fill(menuRadiusSelector, '10');
      await page.dispatchEvent(menuRadiusSelector, 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('hover-effects-menu-radius-10');

      // Verify menu shadow intensity
      const menuShadowIntensity = await page.inputValue('[name="visual_effects[admin_menu][shadow_intensity]"]');
      helpers.assert.equals(menuShadowIntensity, 'subtle', 'Menu shadow intensity should be subtle');
      results.assertions.push({
        type: 'menu_shadow',
        expected: 'subtle',
        actual: menuShadowIntensity,
        passed: true
      });

      // Test 5: Form Field Shadow Effects
      console.log('📝 Testing form field shadow effects...');
      
      // Enable form field shadows
      await helpers.changeSetting('visual_effects[form_fields][shadow_intensity]', 'subtle');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('hover-effects-form-shadow-subtle');
      
      // Test form field border radius
      const formRadiusSelector = '[name="visual_effects[form_fields][border_radius]"]';
      await page.fill(formRadiusSelector, '8');
      await page.dispatchEvent(formRadiusSelector, 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('hover-effects-form-radius-8');
      
      // Test form field shadow blur
      const formBlurSelector = '[name="visual_effects[form_fields][shadow_blur]"]';
      await page.fill(formBlurSelector, '12');
      await page.dispatchEvent(formBlurSelector, 'input');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('hover-effects-form-blur-12');

      // Verify form field shadow intensity
      const formShadowIntensity = await page.inputValue('[name="visual_effects[form_fields][shadow_intensity]"]');
      helpers.assert.equals(formShadowIntensity, 'subtle', 'Form field shadow intensity should be subtle');
      results.assertions.push({
        type: 'form_shadow',
        expected: 'subtle',
        actual: formShadowIntensity,
        passed: true
      });

      // Test 6: Mobile Shadow Optimization
      console.log('📱 Testing mobile shadow optimization...');
      
      // Check if mobile shadows checkbox exists
      const mobileShadowsSelector = '[name="visual_effects[disable_mobile_shadows]"]';
      const mobileShadowsExists = await page.locator(mobileShadowsSelector).count() > 0;
      
      if (mobileShadowsExists) {
        // Toggle mobile shadows off
        await page.check(mobileShadowsSelector);
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('hover-effects-mobile-shadows-disabled');
        
        // Verify checkbox is checked
        const isChecked = await page.isChecked(mobileShadowsSelector);
        helpers.assert.isTrue(isChecked, 'Mobile shadows should be disabled');
        results.assertions.push({
          type: 'mobile_optimization',
          expected: true,
          actual: isChecked,
          passed: true
        });
        
        // Toggle back on
        await page.uncheck(mobileShadowsSelector);
        await helpers.waitForLivePreview();
      }

      // Test 7: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('hover-effects-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('effects');
      await helpers.takeScreenshot('hover-effects-after-reload');

      // Verify shadow direction persisted
      const persistedDirection = await page.isChecked('[name="visual_effects[admin_bar][shadow_direction]"][value="center"]');
      helpers.assert.isTrue(persistedDirection, 'Shadow direction should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'shadow_direction',
        expected: true,
        actual: persistedDirection,
        passed: true
      });

      // Verify button shadow intensity persisted
      const persistedButtonShadow = await page.inputValue('[name="visual_effects[buttons][shadow_intensity]"]');
      helpers.assert.equals(persistedButtonShadow, 'medium', 'Button shadow intensity should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'button_shadow_intensity',
        expected: 'medium',
        actual: persistedButtonShadow,
        passed: true
      });

      // Verify menu shadow intensity persisted
      const persistedMenuShadow = await page.inputValue('[name="visual_effects[admin_menu][shadow_intensity]"]');
      helpers.assert.equals(persistedMenuShadow, 'subtle', 'Menu shadow intensity should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_shadow_intensity',
        expected: 'subtle',
        actual: persistedMenuShadow,
        passed: true
      });

      console.log('✅ Effects hover effects test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('hover-effects-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
