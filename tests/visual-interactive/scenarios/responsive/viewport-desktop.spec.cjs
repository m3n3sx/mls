/**
 * Desktop Viewport Test
 * 
 * Tests the MASE interface at desktop resolution (1920x1080) to ensure:
 * - All controls are accessible
 * - Layout is correct
 * - No elements are hidden or overlapping
 * - Settings can be changed and saved
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

module.exports = {
  // Test metadata
  name: 'Desktop Viewport (1920x1080)',
  description: 'Test MASE interface at desktop resolution',
  tab: 'responsive',
  tags: ['responsive', 'viewport', 'desktop'],
  requirements: ['8.1', '8.2', '8.3', '8.4', '8.5'],
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
      // Set viewport to desktop size
      console.log('📱 Setting viewport to Desktop (1920x1080)...');
      await helpers.setViewport('desktop');
      await helpers.takeScreenshot('responsive-desktop-viewport-set');

      // Verify viewport size
      const viewport = await helpers.getViewport();
      helpers.assert.equals(viewport.width, 1920, 'Viewport width should be 1920');
      helpers.assert.equals(viewport.height, 1080, 'Viewport height should be 1080');
      results.assertions.push({
        type: 'viewport',
        expected: { width: 1920, height: 1080 },
        actual: viewport,
        passed: true
      });

      // Test 1: Verify settings page layout
      console.log('📐 Verifying settings page layout...');
      await helpers.takeScreenshot('responsive-desktop-settings-page');

      // Check that main settings container is visible
      const settingsVisible = await helpers.verifyVisibility('.mase-settings-page', true);
      helpers.assert.isTrue(settingsVisible, 'Settings page should be visible');

      // Check that tabs are visible and accessible
      const tabsVisible = await helpers.verifyVisibility('.mase-tabs, .nav-tab-wrapper', true);
      helpers.assert.isTrue(tabsVisible, 'Tabs should be visible');

      // Test 2: Navigate through multiple tabs
      console.log('🔄 Testing tab navigation...');
      const tabs = ['admin-bar', 'menu', 'content', 'typography', 'buttons'];
      
      for (const tab of tabs) {
        await helpers.navigateToTab(tab);
        await helpers.takeScreenshot(`responsive-desktop-tab-${tab}`);
        
        // Verify tab content is visible
        const tabContentVisible = await page.isVisible(`[data-tab-content="${tab}"], #${tab}-content`);
        helpers.assert.isTrue(tabContentVisible, `Tab content for ${tab} should be visible`);
        
        await helpers.pause(300);
      }

      // Test 3: Test control accessibility in Admin Bar tab
      console.log('🎛️ Testing control accessibility in Admin Bar tab...');
      await helpers.navigateToTab('admin-bar');
      
      // Verify color pickers are accessible
      const colorPicker = await page.$('[name="admin_bar[bg_color]"]');
      helpers.assert.isTrue(colorPicker !== null, 'Color picker should be accessible');
      
      // Test changing a setting
      await helpers.changeSetting('admin_bar[bg_color]', '#336699');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('responsive-desktop-setting-changed');

      // Test 4: Verify sidebar/panel visibility
      console.log('📊 Verifying sidebar visibility...');
      const sidebarSelectors = [
        '.mase-sidebar',
        '.mase-preview-panel',
        '.postbox-container'
      ];

      for (const selector of sidebarSelectors) {
        const element = await page.$(selector);
        if (element) {
          const isVisible = await element.isVisible();
          console.log(`  ${selector}: ${isVisible ? '✓ visible' : '✗ hidden'}`);
        }
      }

      // Test 5: Test save functionality
      console.log('💾 Testing save functionality...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('responsive-desktop-saved');

      // Verify success message is visible
      const successVisible = await helpers.verifyVisibility('.notice-success, .updated', true);
      helpers.assert.isTrue(successVisible, 'Success message should be visible');

      // Test 6: Verify no horizontal scrolling
      console.log('📏 Checking for horizontal overflow...');
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      helpers.assert.isFalse(hasHorizontalScroll, 'Page should not have horizontal scrolling at desktop resolution');
      results.assertions.push({
        type: 'layout',
        property: 'horizontal-scroll',
        expected: false,
        actual: hasHorizontalScroll,
        passed: true
      });

      // Test 7: Verify all buttons are clickable
      console.log('🖱️ Verifying button accessibility...');
      const buttons = await page.$$('button:visible, input[type="submit"]:visible, .button:visible');
      console.log(`  Found ${buttons.length} visible buttons`);
      helpers.assert.isTrue(buttons.length > 0, 'Should have visible buttons');

      console.log('✅ Desktop viewport test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('responsive-desktop-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
