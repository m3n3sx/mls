/**
 * Menu Colors Test
 * 
 * Tests all color settings in the Menu tab including:
 * - Menu background color
 * - Menu text color
 * - Menu hover color
 * - Active menu item color
 * - Submenu colors
 * - Live Preview updates
 * - Persistence after save
 * 
 * Requirements: 2.2
 */

module.exports = {
  // Test metadata
  name: 'Menu Colors',
  description: 'Test all color settings in Menu tab',
  tab: 'menu',
  tags: ['colors', 'visual', 'menu', 'live-preview'],
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
      // Navigate to Menu tab
      console.log('📍 Navigating to Menu tab...');
      await helpers.navigateToTab('menu');
      await helpers.takeScreenshot('menu-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Menu Background Color
      console.log('🎨 Testing menu background color...');
      await helpers.changeSetting('menu[bg_color]', '#2C3E50');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-bg-dark-blue');

      // Verify menu background color applied
      const menuBgColor = await helpers.getComputedStyle('#adminmenu', 'background-color');
      const menuBgColorMatch = helpers.normalizeColor(menuBgColor);
      helpers.assert.contains(menuBgColorMatch, '44,62,80', 'Menu background color should be dark blue (44,62,80)');
      results.assertions.push({
        type: 'color',
        property: 'background-color',
        element: '#adminmenu',
        expected: '44,62,80',
        actual: menuBgColorMatch,
        passed: true
      });

      // Test 2: Menu Text Color
      console.log('✏️ Testing menu text color...');
      await helpers.changeSetting('menu[text_color]', '#ECF0F1');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-text-light-gray');

      // Verify menu text color applied
      const menuTextColor = await helpers.getComputedStyle('#adminmenu a', 'color');
      const menuTextColorMatch = helpers.normalizeColor(menuTextColor);
      helpers.assert.contains(menuTextColorMatch, '236,240,241', 'Menu text color should be light gray (236,240,241)');
      results.assertions.push({
        type: 'color',
        property: 'color',
        element: '#adminmenu a',
        expected: '236,240,241',
        actual: menuTextColorMatch,
        passed: true
      });

      // Test 3: Menu Hover Color
      console.log('🖱️ Testing menu hover color...');
      await helpers.changeSetting('menu[hover_color]', '#3498DB');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-hover-blue');

      // Hover over a menu item to trigger hover state
      await page.hover('#adminmenu .wp-menu-name:first-child');
      await helpers.pause(500);
      await helpers.takeScreenshot('menu-hover-active');

      // Test 4: Active Menu Item Color
      console.log('🎯 Testing active menu item color...');
      await helpers.changeSetting('menu[active_color]', '#E74C3C');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-active-red');

      // Verify active menu item has correct color
      const activeMenuItem = await page.$('#adminmenu .wp-has-current-submenu, #adminmenu .current');
      if (activeMenuItem) {
        const activeColor = await page.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        }, activeMenuItem);
        const activeColorMatch = helpers.normalizeColor(activeColor);
        helpers.assert.contains(activeColorMatch, '231,76,60', 'Active menu item color should be red (231,76,60)');
        results.assertions.push({
          type: 'color',
          property: 'background-color',
          element: 'active menu item',
          expected: '231,76,60',
          actual: activeColorMatch,
          passed: true
        });
      }

      // Test 5: Submenu Background Color
      console.log('📂 Testing submenu background color...');
      await helpers.changeSetting('menu[submenu_bg_color]', '#34495E');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-submenu-bg-dark');

      // Expand a submenu if available
      const submenuParent = await page.$('#adminmenu .wp-has-submenu');
      if (submenuParent) {
        await submenuParent.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('menu-submenu-expanded');

        // Verify submenu background color
        const submenuBgColor = await helpers.getComputedStyle('#adminmenu .wp-submenu', 'background-color');
        const submenuBgColorMatch = helpers.normalizeColor(submenuBgColor);
        helpers.assert.contains(submenuBgColorMatch, '52,73,94', 'Submenu background color should be dark (52,73,94)');
        results.assertions.push({
          type: 'color',
          property: 'background-color',
          element: '#adminmenu .wp-submenu',
          expected: '52,73,94',
          actual: submenuBgColorMatch,
          passed: true
        });
      }

      // Test 6: Submenu Text Color
      console.log('📝 Testing submenu text color...');
      await helpers.changeSetting('menu[submenu_text_color]', '#BDC3C7');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-submenu-text-gray');

      // Verify submenu text color
      const submenuTextColor = await helpers.getComputedStyle('#adminmenu .wp-submenu a', 'color');
      const submenuTextColorMatch = helpers.normalizeColor(submenuTextColor);
      helpers.assert.contains(submenuTextColorMatch, '189,195,199', 'Submenu text color should be gray (189,195,199)');
      results.assertions.push({
        type: 'color',
        property: 'color',
        element: '#adminmenu .wp-submenu a',
        expected: '189,195,199',
        actual: submenuTextColorMatch,
        passed: true
      });

      // Test 7: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('menu-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('menu');
      await helpers.takeScreenshot('menu-after-reload');

      // Verify menu background color persisted
      const persistedMenuBg = await page.inputValue('[name="menu[bg_color]"]');
      helpers.assert.equals(persistedMenuBg.toUpperCase(), '#2C3E50', 'Menu background color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_bg_color',
        expected: '#2C3E50',
        actual: persistedMenuBg.toUpperCase(),
        passed: true
      });

      // Verify menu text color persisted
      const persistedMenuText = await page.inputValue('[name="menu[text_color]"]');
      helpers.assert.equals(persistedMenuText.toUpperCase(), '#ECF0F1', 'Menu text color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_text_color',
        expected: '#ECF0F1',
        actual: persistedMenuText.toUpperCase(),
        passed: true
      });

      // Verify menu hover color persisted
      const persistedMenuHover = await page.inputValue('[name="menu[hover_color]"]');
      helpers.assert.equals(persistedMenuHover.toUpperCase(), '#3498DB', 'Menu hover color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_hover_color',
        expected: '#3498DB',
        actual: persistedMenuHover.toUpperCase(),
        passed: true
      });

      // Verify active menu color persisted
      const persistedMenuActive = await page.inputValue('[name="menu[active_color]"]');
      helpers.assert.equals(persistedMenuActive.toUpperCase(), '#E74C3C', 'Active menu color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_active_color',
        expected: '#E74C3C',
        actual: persistedMenuActive.toUpperCase(),
        passed: true
      });

      // Verify submenu background color persisted
      const persistedSubmenuBg = await page.inputValue('[name="menu[submenu_bg_color]"]');
      helpers.assert.equals(persistedSubmenuBg.toUpperCase(), '#34495E', 'Submenu background color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'submenu_bg_color',
        expected: '#34495E',
        actual: persistedSubmenuBg.toUpperCase(),
        passed: true
      });

      // Verify submenu text color persisted
      const persistedSubmenuText = await page.inputValue('[name="menu[submenu_text_color]"]');
      helpers.assert.equals(persistedSubmenuText.toUpperCase(), '#BDC3C7', 'Submenu text color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'submenu_text_color',
        expected: '#BDC3C7',
        actual: persistedSubmenuText.toUpperCase(),
        passed: true
      });

      // Test 8: Verify colors still applied in DOM after reload
      console.log('✅ Verifying colors still applied in DOM...');
      const reloadedMenuBg = await helpers.getComputedStyle('#adminmenu', 'background-color');
      const reloadedMenuBgMatch = helpers.normalizeColor(reloadedMenuBg);
      helpers.assert.contains(reloadedMenuBgMatch, '44,62,80', 'Menu background color should still be applied after reload');

      console.log('✅ Menu colors test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('menu-colors-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
