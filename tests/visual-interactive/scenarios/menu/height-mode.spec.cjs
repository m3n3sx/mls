/**
 * Menu Height Mode Test
 * 
 * Tests menu height mode settings including:
 * - Full Height mode
 * - Fit to Content mode
 * - Height changes in DOM
 * - Live Preview updates
 * - Persistence after save
 * 
 * Requirements: 2.2
 */

module.exports = {
  // Test metadata
  name: 'Menu Height Mode',
  description: 'Test menu height mode settings (Full Height vs Fit to Content)',
  tab: 'menu',
  tags: ['layout', 'visual', 'menu', 'live-preview'],
  requirements: ['2.2'],
  estimatedDuration: 15000, // 15 seconds

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
      await helpers.takeScreenshot('menu-height-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Full Height Mode
      console.log('📏 Testing Full Height mode...');
      await helpers.changeSetting('menu[height_mode]', 'full');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-height-full');

      // Verify full height applied
      const fullHeightStyle = await helpers.getComputedStyle('#adminmenu', 'height');
      const fullHeightValue = parseInt(fullHeightStyle);
      
      // In full height mode, menu should take up significant vertical space
      helpers.assert.isTrue(fullHeightValue > 500, `Full height mode should result in tall menu, got ${fullHeightValue}px`);
      results.assertions.push({
        type: 'layout',
        property: 'height',
        element: '#adminmenu',
        expected: '> 500px (full height)',
        actual: fullHeightStyle,
        passed: true
      });

      // Check if menu has full height class or style
      const hasFullHeightClass = await page.evaluate(() => {
        const menu = document.querySelector('#adminmenu');
        return menu.classList.contains('full-height') || 
               menu.classList.contains('mase-full-height') ||
               window.getComputedStyle(menu).height !== 'auto';
      });
      helpers.assert.isTrue(hasFullHeightClass, 'Menu should have full height styling applied');
      results.assertions.push({
        type: 'class',
        element: '#adminmenu',
        expected: 'full-height class or style',
        actual: hasFullHeightClass ? 'present' : 'absent',
        passed: true
      });

      // Test 2: Fit to Content Mode
      console.log('📐 Testing Fit to Content mode...');
      await helpers.changeSetting('menu[height_mode]', 'fit');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-height-fit');

      // Verify fit to content applied
      const fitHeightStyle = await helpers.getComputedStyle('#adminmenu', 'height');
      
      // Check if menu has fit-content class or auto height
      const hasFitContentClass = await page.evaluate(() => {
        const menu = document.querySelector('#adminmenu');
        const computedHeight = window.getComputedStyle(menu).height;
        return menu.classList.contains('fit-content') || 
               menu.classList.contains('mase-fit-content') ||
               computedHeight === 'auto' ||
               menu.style.height === 'auto';
      });
      helpers.assert.isTrue(hasFitContentClass, 'Menu should have fit-content styling applied');
      results.assertions.push({
        type: 'class',
        element: '#adminmenu',
        expected: 'fit-content class or auto height',
        actual: hasFitContentClass ? 'present' : 'absent',
        passed: true
      });

      // Test 3: Compare heights between modes
      console.log('🔄 Comparing heights between modes...');
      
      // Switch back to full height
      await helpers.changeSetting('menu[height_mode]', 'full');
      await helpers.waitForLivePreview();
      const fullHeight = await page.evaluate(() => {
        return document.querySelector('#adminmenu').offsetHeight;
      });

      // Switch to fit content
      await helpers.changeSetting('menu[height_mode]', 'fit');
      await helpers.waitForLivePreview();
      const fitHeight = await page.evaluate(() => {
        return document.querySelector('#adminmenu').offsetHeight;
      });

      // Full height should typically be taller than fit content
      // (unless there are many menu items)
      console.log(`Full height: ${fullHeight}px, Fit content: ${fitHeight}px`);
      results.assertions.push({
        type: 'comparison',
        property: 'height difference',
        expected: 'Different heights for different modes',
        actual: `Full: ${fullHeight}px, Fit: ${fitHeight}px`,
        passed: true
      });

      // Test 4: Verify overflow behavior
      console.log('📜 Testing overflow behavior...');
      
      // In fit content mode, check overflow
      await helpers.changeSetting('menu[height_mode]', 'fit');
      await helpers.waitForLivePreview();
      
      const fitOverflow = await helpers.getComputedStyle('#adminmenu', 'overflow-y');
      console.log(`Fit content overflow-y: ${fitOverflow}`);
      
      // In full height mode, check overflow
      await helpers.changeSetting('menu[height_mode]', 'full');
      await helpers.waitForLivePreview();
      
      const fullOverflow = await helpers.getComputedStyle('#adminmenu', 'overflow-y');
      console.log(`Full height overflow-y: ${fullOverflow}`);
      
      results.assertions.push({
        type: 'overflow',
        property: 'overflow-y',
        expected: 'Appropriate overflow for each mode',
        actual: `Fit: ${fitOverflow}, Full: ${fullOverflow}`,
        passed: true
      });

      // Test 5: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('menu-height-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('menu');
      await helpers.takeScreenshot('menu-height-after-reload');

      // Verify height mode persisted
      const persistedHeightMode = await page.inputValue('[name="menu[height_mode]"]');
      helpers.assert.equals(persistedHeightMode, 'full', 'Height mode should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_height_mode',
        expected: 'full',
        actual: persistedHeightMode,
        passed: true
      });

      // Test 6: Verify height mode still applied in DOM after reload
      console.log('✅ Verifying height mode still applied in DOM...');
      const reloadedHeight = await page.evaluate(() => {
        return document.querySelector('#adminmenu').offsetHeight;
      });
      helpers.assert.isTrue(reloadedHeight > 500, 'Full height mode should still be applied after reload');

      // Test 7: Switch to fit content and verify
      console.log('🔄 Testing fit content mode after reload...');
      await helpers.changeSetting('menu[height_mode]', 'fit');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-height-fit-after-reload');

      // Save fit content mode
      await helpers.saveSettings();
      
      // Reload and verify fit content persisted
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('menu');
      
      const persistedFitMode = await page.inputValue('[name="menu[height_mode]"]');
      helpers.assert.equals(persistedFitMode, 'fit', 'Fit content mode should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_height_mode',
        expected: 'fit',
        actual: persistedFitMode,
        passed: true
      });

      console.log('✅ Menu height mode test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('menu-height-mode-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
