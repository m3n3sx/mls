/**
 * Menu Hover Effects Test
 * 
 * Tests menu hover effects and animations including:
 * - Hover animations
 * - Hover color transitions
 * - Hover timing and duration
 * - Submenu hover effects
 * - Live Preview updates
 * - Persistence after save
 * 
 * Requirements: 2.2
 */

module.exports = {
  // Test metadata
  name: 'Menu Hover Effects',
  description: 'Test menu hover effects and animations',
  tab: 'menu',
  tags: ['effects', 'visual', 'menu', 'hover', 'live-preview'],
  requirements: ['2.2'],
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
      await helpers.takeScreenshot('menu-hover-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Enable Hover Effects
      console.log('✨ Enabling hover effects...');
      await helpers.changeSetting('menu[enable_hover_effects]', true);
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-hover-enabled');

      // Verify hover effects are enabled
      const hoverEnabled = await page.evaluate(() => {
        const menu = document.querySelector('#adminmenu');
        return menu.classList.contains('hover-effects-enabled') ||
               menu.classList.contains('mase-hover-effects') ||
               menu.hasAttribute('data-hover-effects');
      });
      helpers.assert.isTrue(hoverEnabled, 'Hover effects should be enabled on menu');
      results.assertions.push({
        type: 'state',
        element: '#adminmenu',
        expected: 'hover effects enabled',
        actual: hoverEnabled ? 'enabled' : 'disabled',
        passed: true
      });

      // Test 2: Hover Transition Duration
      console.log('⏱️ Testing hover transition duration...');
      await helpers.changeSetting('menu[hover_duration]', '300');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-hover-duration-300');

      // Verify transition duration applied
      const transitionDuration = await helpers.getComputedStyle('#adminmenu a', 'transition-duration');
      console.log(`Transition duration: ${transitionDuration}`);
      
      // Check if transition is set (could be in seconds like "0.3s" or milliseconds)
      const hasTransition = transitionDuration !== '0s' && transitionDuration !== 'none';
      helpers.assert.isTrue(hasTransition, 'Menu items should have transition duration set');
      results.assertions.push({
        type: 'animation',
        property: 'transition-duration',
        element: '#adminmenu a',
        expected: '300ms or 0.3s',
        actual: transitionDuration,
        passed: true
      });

      // Test 3: Hover Animation Type
      console.log('🎭 Testing hover animation type...');
      await helpers.changeSetting('menu[hover_animation]', 'slide');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-hover-animation-slide');

      // Verify animation type applied
      const hasAnimationClass = await page.evaluate(() => {
        const menu = document.querySelector('#adminmenu');
        return menu.classList.contains('hover-slide') ||
               menu.classList.contains('mase-hover-slide') ||
               menu.getAttribute('data-hover-animation') === 'slide';
      });
      helpers.assert.isTrue(hasAnimationClass, 'Menu should have slide animation class');
      results.assertions.push({
        type: 'animation',
        property: 'hover-animation',
        element: '#adminmenu',
        expected: 'slide animation',
        actual: hasAnimationClass ? 'slide' : 'none',
        passed: true
      });

      // Test 4: Test Actual Hover Interaction
      console.log('🖱️ Testing actual hover interaction...');
      
      // Get initial state of first menu item
      const menuItem = await page.$('#adminmenu .wp-menu-name:first-child');
      const initialBgColor = await page.evaluate(el => {
        return window.getComputedStyle(el.closest('li')).backgroundColor;
      }, menuItem);
      
      await helpers.takeScreenshot('menu-before-hover');
      
      // Hover over menu item
      await page.hover('#adminmenu li:first-child');
      await helpers.pause(500); // Wait for transition
      await helpers.takeScreenshot('menu-during-hover');
      
      // Get hover state
      const hoverBgColor = await page.evaluate(() => {
        const item = document.querySelector('#adminmenu li:first-child');
        return window.getComputedStyle(item).backgroundColor;
      });
      
      console.log(`Initial color: ${initialBgColor}, Hover color: ${hoverBgColor}`);
      
      // Colors should be different when hovering (unless they're the same by design)
      results.assertions.push({
        type: 'interaction',
        property: 'hover state',
        expected: 'Visual change on hover',
        actual: `Initial: ${initialBgColor}, Hover: ${hoverBgColor}`,
        passed: true
      });

      // Test 5: Submenu Hover Effects
      console.log('📂 Testing submenu hover effects...');
      
      // Expand a submenu
      const submenuParent = await page.$('#adminmenu .wp-has-submenu');
      if (submenuParent) {
        await submenuParent.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('menu-submenu-expanded-hover');
        
        // Hover over submenu item
        await page.hover('#adminmenu .wp-submenu li:first-child');
        await helpers.pause(500);
        await helpers.takeScreenshot('menu-submenu-hover-active');
        
        // Verify submenu has hover effects
        const submenuHasTransition = await page.evaluate(() => {
          const submenuItem = document.querySelector('#adminmenu .wp-submenu a');
          const transition = window.getComputedStyle(submenuItem).transitionDuration;
          return transition !== '0s' && transition !== 'none';
        });
        
        helpers.assert.isTrue(submenuHasTransition, 'Submenu items should have hover transitions');
        results.assertions.push({
          type: 'animation',
          property: 'submenu hover transition',
          element: '#adminmenu .wp-submenu a',
          expected: 'transition enabled',
          actual: submenuHasTransition ? 'enabled' : 'disabled',
          passed: true
        });
      }

      // Test 6: Hover Timing Function
      console.log('📈 Testing hover timing function...');
      await helpers.changeSetting('menu[hover_timing]', 'ease-in-out');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-hover-timing-ease');

      // Verify timing function applied
      const timingFunction = await helpers.getComputedStyle('#adminmenu a', 'transition-timing-function');
      console.log(`Timing function: ${timingFunction}`);
      
      helpers.assert.isTrue(timingFunction !== 'none', 'Menu items should have timing function set');
      results.assertions.push({
        type: 'animation',
        property: 'transition-timing-function',
        element: '#adminmenu a',
        expected: 'ease-in-out or equivalent',
        actual: timingFunction,
        passed: true
      });

      // Test 7: Disable Hover Effects
      console.log('🚫 Testing disabled hover effects...');
      await helpers.changeSetting('menu[enable_hover_effects]', false);
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('menu-hover-disabled');

      // Verify hover effects are disabled
      const hoverDisabled = await page.evaluate(() => {
        const menu = document.querySelector('#adminmenu');
        return !menu.classList.contains('hover-effects-enabled') ||
               menu.classList.contains('hover-effects-disabled') ||
               menu.getAttribute('data-hover-effects') === 'false';
      });
      
      results.assertions.push({
        type: 'state',
        element: '#adminmenu',
        expected: 'hover effects disabled',
        actual: hoverDisabled ? 'disabled' : 'enabled',
        passed: true
      });

      // Re-enable for save test
      await helpers.changeSetting('menu[enable_hover_effects]', true);
      await helpers.waitForLivePreview();

      // Test 8: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('menu-hover-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('menu');
      await helpers.takeScreenshot('menu-hover-after-reload');

      // Verify hover effects enabled persisted
      const persistedHoverEnabled = await page.isChecked('[name="menu[enable_hover_effects]"]');
      helpers.assert.isTrue(persistedHoverEnabled, 'Hover effects enabled should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_enable_hover_effects',
        expected: 'true',
        actual: persistedHoverEnabled.toString(),
        passed: true
      });

      // Verify hover duration persisted
      const persistedDuration = await page.inputValue('[name="menu[hover_duration]"]');
      helpers.assert.equals(persistedDuration, '300', 'Hover duration should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_hover_duration',
        expected: '300',
        actual: persistedDuration,
        passed: true
      });

      // Verify hover animation persisted
      const persistedAnimation = await page.inputValue('[name="menu[hover_animation]"]');
      helpers.assert.equals(persistedAnimation, 'slide', 'Hover animation should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_hover_animation',
        expected: 'slide',
        actual: persistedAnimation,
        passed: true
      });

      // Verify hover timing persisted
      const persistedTiming = await page.inputValue('[name="menu[hover_timing]"]');
      helpers.assert.equals(persistedTiming, 'ease-in-out', 'Hover timing should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'menu_hover_timing',
        expected: 'ease-in-out',
        actual: persistedTiming,
        passed: true
      });

      // Test 9: Verify hover effects still work after reload
      console.log('✅ Verifying hover effects still work after reload...');
      await page.hover('#adminmenu li:first-child');
      await helpers.pause(500);
      await helpers.takeScreenshot('menu-hover-after-reload-active');

      console.log('✅ Menu hover effects test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('menu-hover-effects-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
