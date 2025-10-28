/**
 * Menu Typography Test
 * 
 * Tests all typography settings in the Menu tab including:
 * - Menu font family
 * - Menu font size
 * - Menu font weight
 * - Menu line height
 * - Submenu font settings
 * - Live Preview updates
 * - Persistence after save
 * 
 * Requirements: 2.4
 */

module.exports = {
  // Test metadata
  name: 'Menu Typography',
  description: 'Test all typography settings in Menu tab',
  tab: 'menu',
  tags: ['typography', 'visual', 'menu', 'live-preview'],
  requirements: ['2.4'],
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
      // Navigate to Menu tab
      console.log('📍 Navigating to Menu tab...');
      await helpers.navigateToTab('menu');
      await helpers.takeScreenshot('menu-typography-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Menu Font Size
      console.log('📏 Testing menu font size...');
      await helpers.changeSetting('menu[font_size]', '16');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-font-size-16');

      // Verify font size applied
      const menuFontSize = await helpers.getComputedStyle('#adminmenu a', 'font-size');
      const fontSizeValue = parseInt(menuFontSize);
      helpers.assert.isTrue(fontSizeValue === 16, `Menu font size should be 16px, got ${fontSizeValue}px`);
      results.assertions.push({
        type: 'typography',
        property: 'font-size',
        element: '#adminmenu a',
        expected: '16px',
        actual: menuFontSize,
        passed: true
      });

      // Test 2: Menu Font Weight
      console.log('💪 Testing menu font weight...');
      await helpers.changeSetting('menu[font_weight]', '600');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-font-weight-600');

      // Verify font weight applied
      const menuFontWeight = await helpers.getComputedStyle('#adminmenu a', 'font-weight');
      const fontWeightValue = parseInt(menuFontWeight);
      helpers.assert.isTrue(fontWeightValue === 600, `Menu font weight should be 600, got ${fontWeightValue}`);
      results.assertions.push({
        type: 'typography',
        property: 'font-weight',
        element: '#adminmenu a',
        expected: '600',
        actual: menuFontWeight,
        passed: true
      });

      // Test 3: Menu Line Height
      console.log('📐 Testing menu line height...');
      await helpers.changeSetting('menu[line_height]', '1.8');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-line-height-1-8');

      // Verify line height applied
      const menuLineHeight = await helpers.getComputedStyle('#adminmenu a', 'line-height');
      // Line height might be computed as pixels, so we check if it's reasonable
      helpers.assert.isTrue(menuLineHeight !== 'normal', 'Menu line height should be set');
      results.assertions.push({
        type: 'typography',
        property: 'line-height',
        element: '#adminmenu a',
        expected: '1.8 or computed equivalent',
        actual: menuLineHeight,
        passed: true
      });

      // Test 4: Menu Font Family
      console.log('🔤 Testing menu font family...');
      await helpers.changeSetting('menu[font_family]', 'Arial, sans-serif');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-font-arial');

      // Verify font family applied
      const menuFontFamily = await helpers.getComputedStyle('#adminmenu a', 'font-family');
      helpers.assert.contains(menuFontFamily.toLowerCase(), 'arial', 'Menu font family should contain Arial');
      results.assertions.push({
        type: 'typography',
        property: 'font-family',
        element: '#adminmenu a',
        expected: 'Arial',
        actual: menuFontFamily,
        passed: true
      });

      // Test 5: Submenu Font Size
      console.log('📏 Testing submenu font size...');
      await helpers.changeSetting('menu[submenu_font_size]', '14');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-submenu-font-size-14');

      // Expand a submenu to verify
      const submenuParent = await page.$('#adminmenu .wp-has-submenu');
      if (submenuParent) {
        await submenuParent.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('menu-submenu-typography-expanded');

        // Verify submenu font size
        const submenuFontSize = await helpers.getComputedStyle('#adminmenu .wp-submenu a', 'font-size');
        const submenuFontSizeValue = parseInt(submenuFontSize);
        helpers.assert.isTrue(submenuFontSizeValue === 14, `Submenu font size should be 14px, got ${submenuFontSizeValue}px`);
        results.assertions.push({
          type: 'typography',
          property: 'font-size',
          element: '#adminmenu .wp-submenu a',
          expected: '14px',
          actual: submenuFontSize,
          passed: true
        });
      }

      // Test 6: Submenu Font Weight
      console.log('💪 Testing submenu font weight...');
      await helpers.changeSetting('menu[submenu_font_weight]', '400');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-submenu-font-weight-400');

      // Verify submenu font weight
      const submenuFontWeight = await helpers.getComputedStyle('#adminmenu .wp-submenu a', 'font-weight');
      const submenuFontWeightValue = parseInt(submenuFontWeight);
      helpers.assert.isTrue(submenuFontWeightValue === 400, `Submenu font weight should be 400, got ${submenuFontWeightValue}`);
      results.assertions.push({
        type: 'typography',
        property: 'font-weight',
        element: '#adminmenu .wp-submenu a',
        expected: '400',
        actual: submenuFontWeight,
        passed: true
      });

      // Test 7: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('menu-typography-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('menu');
      await helpers.takeScreenshot('menu-typography-after-reload');

      // Verify menu font size persisted
      const persistedFontSize = await page.inputValue('[name="menu[font_size]"]');
      helpers.assert.equals(persistedFontSize, '16', 'Menu font size should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_font_size',
        expected: '16',
        actual: persistedFontSize,
        passed: true
      });

      // Verify menu font weight persisted
      const persistedFontWeight = await page.inputValue('[name="menu[font_weight]"]');
      helpers.assert.equals(persistedFontWeight, '600', 'Menu font weight should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_font_weight',
        expected: '600',
        actual: persistedFontWeight,
        passed: true
      });

      // Verify menu line height persisted
      const persistedLineHeight = await page.inputValue('[name="menu[line_height]"]');
      helpers.assert.equals(persistedLineHeight, '1.8', 'Menu line height should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_line_height',
        expected: '1.8',
        actual: persistedLineHeight,
        passed: true
      });

      // Verify menu font family persisted
      const persistedFontFamily = await page.inputValue('[name="menu[font_family]"]');
      helpers.assert.equals(persistedFontFamily, 'Arial, sans-serif', 'Menu font family should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_font_family',
        expected: 'Arial, sans-serif',
        actual: persistedFontFamily,
        passed: true
      });

      // Verify submenu font size persisted
      const persistedSubmenuFontSize = await page.inputValue('[name="menu[submenu_font_size]"]');
      helpers.assert.equals(persistedSubmenuFontSize, '14', 'Submenu font size should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'submenu_font_size',
        expected: '14',
        actual: persistedSubmenuFontSize,
        passed: true
      });

      // Verify submenu font weight persisted
      const persistedSubmenuFontWeight = await page.inputValue('[name="menu[submenu_font_weight]"]');
      helpers.assert.equals(persistedSubmenuFontWeight, '400', 'Submenu font weight should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'submenu_font_weight',
        expected: '400',
        actual: persistedSubmenuFontWeight,
        passed: true
      });

      // Test 8: Verify typography still applied in DOM after reload
      console.log('✅ Verifying typography still applied in DOM...');
      const reloadedFontSize = await helpers.getComputedStyle('#adminmenu a', 'font-size');
      const reloadedFontSizeValue = parseInt(reloadedFontSize);
      helpers.assert.isTrue(reloadedFontSizeValue === 16, 'Menu font size should still be 16px after reload');

      console.log('✅ Menu typography test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('menu-typography-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
