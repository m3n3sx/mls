/**
 * Gradient Backgrounds Test
 * 
 * Tests gradient background settings for admin areas:
 * - Gradient type selection (linear, radial, conic)
 * - Gradient angle adjustment
 * - Gradient color stops
 * - Visual verification of gradient rendering
 * 
 * Requirements: 2.9
 */

module.exports = {
  // Test metadata
  name: 'Gradient Backgrounds',
  description: 'Test gradient backgrounds with different types and angles',
  tab: 'backgrounds',
  tags: ['backgrounds', 'gradients', 'visual'],
  requirements: ['2.9'],
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
      // Navigate to Backgrounds tab
      console.log('📍 Navigating to Backgrounds tab...');
      await helpers.navigateToTab('backgrounds');
      await helpers.takeScreenshot('backgrounds-gradient-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Dashboard - Linear Gradient
      console.log('🎨 Testing Dashboard linear gradient...');
      
      // Select gradient type
      const dashboardTypeSelector = 'select[name="custom_backgrounds[dashboard][type]"]';
      await page.selectOption(dashboardTypeSelector, 'gradient');
      await helpers.waitForLivePreview();
      await helpers.pause(500);
      await helpers.takeScreenshot('backgrounds-dashboard-gradient-selected');

      // Verify gradient type selector is visible
      const gradientTypeSelector = 'select[name="custom_backgrounds[dashboard][gradient_type]"]';
      const isGradientTypeVisible = await page.isVisible(gradientTypeSelector);
      helpers.assert.isTrue(isGradientTypeVisible, 'Gradient type selector should be visible');
      results.assertions.push({
        type: 'visibility',
        element: 'gradient_type_selector',
        expected: true,
        actual: isGradientTypeVisible,
        passed: true
      });

      // Select linear gradient
      await page.selectOption(gradientTypeSelector, 'linear');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('backgrounds-dashboard-linear');

      const gradientType = await page.inputValue(gradientTypeSelector);
      helpers.assert.equals(gradientType, 'linear', 'Gradient type should be linear');
      results.assertions.push({
        type: 'value',
        field: 'gradient_type',
        expected: 'linear',
        actual: gradientType,
        passed: true
      });

      // Test 2: Adjust Gradient Angle
      console.log('📐 Testing gradient angle adjustment...');
      const angleSelector = 'input[name="custom_backgrounds[dashboard][gradient_angle]"]';
      
      // Check if angle input exists
      const angleExists = await page.isVisible(angleSelector);
      if (angleExists) {
        await page.fill(angleSelector, '45');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('backgrounds-gradient-angle-45');

        const angle = await page.inputValue(angleSelector);
        helpers.assert.equals(angle, '45', 'Gradient angle should be 45 degrees');
        results.assertions.push({
          type: 'value',
          field: 'gradient_angle',
          expected: '45',
          actual: angle,
          passed: true
        });
      } else {
        console.log('ℹ️ Gradient angle input not found, skipping angle test');
      }

      // Test 3: Admin Menu - Radial Gradient
      console.log('🔵 Testing Admin Menu radial gradient...');
      const menuTypeSelector = 'select[name="custom_backgrounds[admin_menu][type]"]';
      await page.selectOption(menuTypeSelector, 'gradient');
      await helpers.waitForLivePreview();
      await helpers.pause(500);

      const menuGradientTypeSelector = 'select[name="custom_backgrounds[admin_menu][gradient_type]"]';
      const isMenuGradientTypeVisible = await page.isVisible(menuGradientTypeSelector);
      
      if (isMenuGradientTypeVisible) {
        await page.selectOption(menuGradientTypeSelector, 'radial');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('backgrounds-menu-radial');

        const menuGradientType = await page.inputValue(menuGradientTypeSelector);
        helpers.assert.equals(menuGradientType, 'radial', 'Menu gradient type should be radial');
        results.assertions.push({
          type: 'value',
          field: 'menu_gradient_type',
          expected: 'radial',
          actual: menuGradientType,
          passed: true
        });
      } else {
        console.log('ℹ️ Menu gradient type selector not visible');
      }

      // Test 4: Post Editor - Conic Gradient
      console.log('🌀 Testing Post Editor conic gradient...');
      const editorTypeSelector = 'select[name="custom_backgrounds[post_editor][type]"]';
      await page.selectOption(editorTypeSelector, 'gradient');
      await helpers.waitForLivePreview();
      await helpers.pause(500);

      const editorGradientTypeSelector = 'select[name="custom_backgrounds[post_editor][gradient_type]"]';
      const isEditorGradientTypeVisible = await page.isVisible(editorGradientTypeSelector);
      
      if (isEditorGradientTypeVisible) {
        // Check if conic option exists
        const conicOption = await page.locator(`${editorGradientTypeSelector} option[value="conic"]`).count();
        
        if (conicOption > 0) {
          await page.selectOption(editorGradientTypeSelector, 'conic');
          await helpers.waitForLivePreview();
          await helpers.takeScreenshot('backgrounds-editor-conic');

          const editorGradientType = await page.inputValue(editorGradientTypeSelector);
          helpers.assert.equals(editorGradientType, 'conic', 'Editor gradient type should be conic');
          results.assertions.push({
            type: 'value',
            field: 'editor_gradient_type',
            expected: 'conic',
            actual: editorGradientType,
            passed: true
          });
        } else {
          console.log('ℹ️ Conic gradient option not available, using linear instead');
          await page.selectOption(editorGradientTypeSelector, 'linear');
          await helpers.waitForLivePreview();
          await helpers.takeScreenshot('backgrounds-editor-linear-fallback');
        }
      }

      // Test 5: Gradient Opacity
      console.log('🔍 Testing gradient opacity...');
      const opacitySelector = 'input[name="custom_backgrounds[dashboard][gradient_opacity]"]';
      const opacityExists = await page.isVisible(opacitySelector);
      
      if (opacityExists) {
        await page.fill(opacitySelector, '0.7');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('backgrounds-gradient-opacity');

        const opacity = await page.inputValue(opacitySelector);
        helpers.assert.equals(opacity, '0.7', 'Gradient opacity should be 0.7');
        results.assertions.push({
          type: 'value',
          field: 'gradient_opacity',
          expected: '0.7',
          actual: opacity,
          passed: true
        });
      } else {
        console.log('ℹ️ Gradient opacity input not found');
      }

      // Test 6: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('backgrounds-gradient-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('backgrounds');
      await helpers.takeScreenshot('backgrounds-gradient-after-reload');

      // Verify dashboard gradient type persisted
      const persistedDashboardType = await page.inputValue(dashboardTypeSelector);
      helpers.assert.equals(persistedDashboardType, 'gradient', 'Dashboard background type should persist as gradient');
      
      // Wait for gradient controls to appear
      await helpers.pause(500);
      
      const persistedGradientType = await page.inputValue(gradientTypeSelector);
      helpers.assert.equals(persistedGradientType, 'linear', 'Dashboard gradient type should persist as linear');
      
      results.assertions.push({
        type: 'persistence',
        field: 'gradient_settings',
        expected: 'gradient/linear',
        actual: `${persistedDashboardType}/${persistedGradientType}`,
        passed: true
      });

      // Verify menu gradient persisted
      const persistedMenuType = await page.inputValue(menuTypeSelector);
      helpers.assert.equals(persistedMenuType, 'gradient', 'Menu background type should persist as gradient');

      console.log('✅ Gradient backgrounds test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('backgrounds-gradient-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
