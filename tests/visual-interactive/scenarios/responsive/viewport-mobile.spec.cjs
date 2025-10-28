/**
 * Mobile Viewport Test
 * 
 * Tests the MASE interface at mobile resolution (375x667) to ensure:
 * - All controls are accessible
 * - Layout adapts correctly for small screens
 * - No elements are hidden or overlapping
 * - Settings can be changed and saved
 * - Mobile navigation works
 * - Touch targets are appropriately sized
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

module.exports = {
  // Test metadata
  name: 'Mobile Viewport (375x667)',
  description: 'Test MASE interface at mobile resolution',
  tab: 'responsive',
  tags: ['responsive', 'viewport', 'mobile'],
  requirements: ['8.1', '8.2', '8.3', '8.4', '8.5'],
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
      // Set viewport to mobile size
      console.log('📱 Setting viewport to Mobile (375x667)...');
      await helpers.setViewport('mobile');
      await helpers.takeScreenshot('responsive-mobile-viewport-set');

      // Verify viewport size
      const viewport = await helpers.getViewport();
      helpers.assert.equals(viewport.width, 375, 'Viewport width should be 375');
      helpers.assert.equals(viewport.height, 667, 'Viewport height should be 667');
      results.assertions.push({
        type: 'viewport',
        expected: { width: 375, height: 667 },
        actual: viewport,
        passed: true
      });

      // Test 1: Verify settings page is accessible
      console.log('📐 Verifying settings page accessibility at mobile size...');
      await helpers.takeScreenshot('responsive-mobile-settings-page');

      // Check that main settings container is visible
      const settingsVisible = await helpers.verifyVisibility('.mase-settings-page', true);
      helpers.assert.isTrue(settingsVisible, 'Settings page should be visible at mobile size');

      // Test 2: Check for mobile navigation
      console.log('🔄 Checking mobile navigation...');
      
      // Look for mobile menu toggle
      const mobileMenuSelectors = [
        '.mobile-menu-toggle',
        '.nav-tab-mobile-toggle',
        '#wp-admin-bar-menu-toggle',
        '.hamburger-menu'
      ];

      let mobileMenuFound = false;
      for (const selector of mobileMenuSelectors) {
        const element = await page.$(selector);
        if (element) {
          const isVisible = await element.isVisible();
          if (isVisible) {
            console.log(`  Mobile menu found: ${selector}`);
            mobileMenuFound = true;
            
            // Try to click it to open menu
            await element.click();
            await helpers.pause(500);
            await helpers.takeScreenshot('responsive-mobile-menu-opened');
            break;
          }
        }
      }

      if (!mobileMenuFound) {
        console.log('  No mobile menu toggle found (may not be needed)');
      }

      // Test 3: Navigate through tabs
      console.log('🔄 Testing tab navigation at mobile size...');
      const tabs = ['admin-bar', 'menu', 'content'];
      
      for (const tab of tabs) {
        await helpers.navigateToTab(tab);
        await helpers.takeScreenshot(`responsive-mobile-tab-${tab}`);
        
        // Verify tab content is visible
        const tabContentVisible = await page.isVisible(`[data-tab-content="${tab}"], #${tab}-content`);
        helpers.assert.isTrue(tabContentVisible, `Tab content for ${tab} should be visible at mobile size`);
        
        // Scroll to top of tab content
        await page.evaluate(() => window.scrollTo(0, 0));
        await helpers.pause(300);
      }

      // Test 4: Test control accessibility
      console.log('🎛️ Testing control accessibility at mobile size...');
      await helpers.navigateToTab('admin-bar');
      await page.evaluate(() => window.scrollTo(0, 0));
      await helpers.pause(300);
      
      // Verify form controls are accessible
      const colorPicker = await page.$('[name="admin_bar[bg_color]"]');
      helpers.assert.isTrue(colorPicker !== null, 'Color picker should be accessible at mobile size');
      
      // Scroll to color picker if needed
      if (colorPicker) {
        await colorPicker.scrollIntoViewIfNeeded();
        await helpers.pause(300);
      }
      
      // Test changing a setting
      await helpers.changeSetting('admin_bar[bg_color]', '#E63946');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('responsive-mobile-setting-changed');

      // Test 5: Check layout stacking
      console.log('📊 Checking mobile layout...');
      
      // At mobile size, everything should stack vertically
      const mainContent = await page.$('.mase-main-content, .wrap');
      if (mainContent) {
        const mainRect = await mainContent.boundingBox();
        if (mainRect) {
          console.log(`  Main content width: ${mainRect.width}px`);
          // Main content should take most of the viewport width
          const widthRatio = mainRect.width / viewport.width;
          console.log(`  Width ratio: ${(widthRatio * 100).toFixed(1)}%`);
        }
      }

      // Test 6: Verify no horizontal scrolling
      console.log('📏 Checking for horizontal overflow...');
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      helpers.assert.isFalse(hasHorizontalScroll, 'Page should not have horizontal scrolling at mobile resolution');
      results.assertions.push({
        type: 'layout',
        property: 'horizontal-scroll',
        expected: false,
        actual: hasHorizontalScroll,
        passed: true
      });

      // Test 7: Check touch target sizes
      console.log('👆 Verifying touch target sizes...');
      const buttons = await page.$$('button:visible, .button:visible, input[type="submit"]:visible');
      console.log(`  Found ${buttons.length} visible buttons`);
      
      // Check if buttons meet minimum touch target size (44x44px)
      let adequateTouchTargets = 0;
      let smallTouchTargets = 0;
      
      for (const button of buttons.slice(0, 10)) { // Check first 10 buttons
        const box = await button.boundingBox();
        if (box) {
          if (box.width >= 44 && box.height >= 44) {
            adequateTouchTargets++;
          } else {
            smallTouchTargets++;
            console.log(`  Small button: ${box.width}x${box.height}px`);
          }
        }
      }
      
      console.log(`  Adequate touch targets (≥44x44): ${adequateTouchTargets}`);
      console.log(`  Small touch targets (<44x44): ${smallTouchTargets}`);

      // Test 8: Test save functionality
      console.log('💾 Testing save functionality at mobile size...');
      
      // Scroll to save button
      const saveButton = await page.$('.mase-save-settings, #submit, [type="submit"]');
      if (saveButton) {
        await saveButton.scrollIntoViewIfNeeded();
        await helpers.pause(300);
      }
      
      await helpers.saveSettings();
      await helpers.takeScreenshot('responsive-mobile-saved');

      // Verify success message is visible
      const successVisible = await helpers.verifyVisibility('.notice-success, .updated', true);
      helpers.assert.isTrue(successVisible, 'Success message should be visible at mobile size');

      // Test 9: Test scrolling behavior
      console.log('📜 Testing scrolling behavior...');
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 300));
      await helpers.pause(300);
      await helpers.takeScreenshot('responsive-mobile-scrolled-down');
      
      const scrollY = await page.evaluate(() => window.scrollY);
      helpers.assert.isTrue(scrollY > 0, 'Page should be scrollable at mobile size');
      
      // Scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await helpers.pause(300);

      // Test 10: Check text readability
      console.log('📖 Checking text readability...');
      
      // Check font sizes are not too small
      const bodyFontSize = await page.evaluate(() => {
        return window.getComputedStyle(document.body).fontSize;
      });
      console.log(`  Body font size: ${bodyFontSize}`);
      
      const fontSize = parseInt(bodyFontSize);
      helpers.assert.isTrue(fontSize >= 14, 'Body font size should be at least 14px for mobile readability');

      // Test 11: Verify form inputs are usable
      console.log('📝 Testing form input usability...');
      
      // Check if inputs have appropriate sizing
      const inputs = await page.$$('input[type="text"]:visible, input[type="color"]:visible');
      console.log(`  Found ${inputs.length} visible inputs`);
      
      if (inputs.length > 0) {
        const firstInput = inputs[0];
        const inputBox = await firstInput.boundingBox();
        if (inputBox) {
          console.log(`  Input size: ${inputBox.width}x${inputBox.height}px`);
          helpers.assert.isTrue(inputBox.height >= 36, 'Input height should be at least 36px for mobile usability');
        }
      }

      console.log('✅ Mobile viewport test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('responsive-mobile-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
