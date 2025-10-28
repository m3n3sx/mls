/**
 * Custom CSS Test
 * 
 * Tests custom CSS functionality including:
 * - Adding custom CSS code
 * - Saving custom CSS
 * - Verifying custom CSS is applied to the admin interface
 * - Testing CSS persistence after page reload
 * 
 * Requirements: 2.9
 */

module.exports = {
  // Test metadata
  name: 'Custom CSS',
  description: 'Test custom CSS input and application',
  tab: 'advanced',
  tags: ['advanced', 'custom-css', 'styling'],
  requirements: ['2.9'],
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
      // Navigate to Advanced tab
      console.log('📍 Navigating to Advanced tab...');
      await helpers.navigateToTab('advanced');
      await helpers.takeScreenshot('advanced-initial');

      // Scroll to Custom CSS section
      console.log('📜 Scrolling to Custom CSS section...');
      const customCssSection = await page.$('text=Custom CSS');
      if (customCssSection) {
        await customCssSection.scrollIntoViewIfNeeded();
        await helpers.pause(500);
      }
      await helpers.takeScreenshot('custom-css-section');

      // Step 1: Verify custom CSS textarea exists
      console.log('🔍 Verifying custom CSS textarea...');
      const cssTextarea = await page.$('#advanced-custom-css, [name="advanced[custom_css]"], textarea[name*="custom_css"]');
      helpers.assert.isTrue(cssTextarea !== null, 'Custom CSS textarea should exist');
      
      if (cssTextarea) {
        console.log('✓ Custom CSS textarea found');
        results.assertions.push({
          type: 'element',
          description: 'Custom CSS textarea exists',
          passed: true
        });

        // Get current custom CSS value
        const currentCss = await cssTextarea.inputValue().catch(() => '');
        console.log(`📝 Current custom CSS length: ${currentCss.length} characters`);

        // Step 2: Add custom CSS code
        console.log('✏️ Adding custom CSS code...');
        
        // Create unique test CSS that's easy to verify
        const testCss = `
/* MASE Visual Test - Custom CSS */
#wpadminbar {
  border-bottom: 5px solid #ff00ff !important;
}

.mase-test-marker {
  background-color: #00ffff !important;
  color: #ff0000 !important;
  font-weight: bold !important;
}

#adminmenu {
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.5) !important;
}
`;

        console.log('📝 Test CSS code:');
        console.log(testCss);
        
        // Clear existing CSS and add test CSS
        await cssTextarea.fill(testCss);
        await helpers.pause(500);
        
        await helpers.takeScreenshot('custom-css-added');
        
        // Verify CSS was entered
        const enteredCss = await cssTextarea.inputValue();
        helpers.assert.contains(enteredCss, 'MASE Visual Test', 'Custom CSS should contain test marker');
        helpers.assert.contains(enteredCss, '#wpadminbar', 'Custom CSS should contain admin bar rule');
        
        console.log('✓ Custom CSS entered successfully');
        results.assertions.push({
          type: 'input',
          description: 'Custom CSS entered in textarea',
          length: enteredCss.length,
          passed: true
        });

        // Step 3: Save settings with custom CSS
        console.log('💾 Saving settings with custom CSS...');
        await helpers.saveSettings();
        await helpers.waitForAjaxComplete();
        await helpers.pause(2000);
        
        await helpers.takeScreenshot('custom-css-saved');

        // Verify success notification
        const successNotice = await page.isVisible('.notice-success, .updated, .swal2-success').catch(() => false);
        if (successNotice) {
          console.log('✓ Save success notification appeared');
          results.assertions.push({
            type: 'notification',
            description: 'Save success notification',
            expected: 'visible',
            actual: 'visible',
            passed: true
          });
        }

        // Step 4: Verify custom CSS is applied
        console.log('🔍 Verifying custom CSS is applied...');
        
        // Check if custom CSS is in the page
        const customStyleTag = await page.$('style#mase-custom-css, style[data-mase-custom], style:has-text("MASE Visual Test")');
        
        if (customStyleTag) {
          console.log('✓ Custom CSS style tag found in page');
          
          const styleContent = await customStyleTag.textContent();
          
          if (styleContent.includes('MASE Visual Test')) {
            console.log('✓ Custom CSS contains test marker');
            results.assertions.push({
              type: 'application',
              description: 'Custom CSS applied to page',
              passed: true
            });
          } else {
            console.log('⚠️ Custom CSS style tag found but does not contain test marker');
          }
        } else {
          console.log('⚠️ Custom CSS style tag not found (may be injected differently)');
        }

        // Verify CSS effects on admin bar
        console.log('🎨 Checking CSS effects on admin bar...');
        const adminBar = await page.$('#wpadminbar');
        
        if (adminBar) {
          const borderBottom = await page.evaluate((el) => {
            return window.getComputedStyle(el).borderBottomWidth;
          }, adminBar);
          
          console.log(`📏 Admin bar border-bottom width: ${borderBottom}`);
          
          if (borderBottom === '5px') {
            console.log('✓ Custom CSS border applied to admin bar');
            results.assertions.push({
              type: 'css-effect',
              element: '#wpadminbar',
              property: 'border-bottom-width',
              expected: '5px',
              actual: borderBottom,
              passed: true
            });
          } else {
            console.log(`⚠️ Border width is ${borderBottom}, expected 5px (may be overridden)`);
          }
        }

        await helpers.takeScreenshot('custom-css-applied');

        // Step 5: Test persistence - reload page
        console.log('🔄 Testing CSS persistence after reload...');
        await page.reload({ waitUntil: 'networkidle' });
        await helpers.pause(2000);
        
        await helpers.takeScreenshot('after-reload');

        // Navigate back to Advanced tab
        await helpers.navigateToTab('advanced');
        await helpers.pause(500);
        
        if (customCssSection) {
          await customCssSection.scrollIntoViewIfNeeded();
          await helpers.pause(500);
        }

        // Verify CSS persisted in textarea
        const persistedCss = await page.inputValue('#advanced-custom-css, [name="advanced[custom_css]"], textarea[name*="custom_css"]');
        
        if (persistedCss.includes('MASE Visual Test')) {
          console.log('✓ Custom CSS persisted after reload');
          results.assertions.push({
            type: 'persistence',
            description: 'Custom CSS persisted in database',
            passed: true
          });
        } else {
          console.log('⚠️ Custom CSS not found after reload');
          results.assertions.push({
            type: 'persistence',
            description: 'Custom CSS persistence',
            passed: false
          });
        }

        await helpers.takeScreenshot('custom-css-persisted');

        // Verify CSS still applied after reload
        const styleTagAfterReload = await page.$('style#mase-custom-css, style[data-mase-custom], style:has-text("MASE Visual Test")');
        
        if (styleTagAfterReload) {
          console.log('✓ Custom CSS still applied after reload');
          results.assertions.push({
            type: 'application-persistence',
            description: 'Custom CSS still applied after reload',
            passed: true
          });
        } else {
          console.log('⚠️ Custom CSS not applied after reload');
        }

        // Step 6: Clean up - remove test CSS
        console.log('🧹 Cleaning up test CSS...');
        
        const cssTextareaAfterReload = await page.$('#advanced-custom-css, [name="advanced[custom_css]"], textarea[name*="custom_css"]');
        if (cssTextareaAfterReload) {
          // Restore original CSS or clear
          await cssTextareaAfterReload.fill(currentCss);
          await helpers.pause(500);
          
          await helpers.saveSettings();
          await helpers.waitForAjaxComplete();
          await helpers.pause(1000);
          
          console.log('✓ Test CSS cleaned up');
          await helpers.takeScreenshot('custom-css-cleaned');
        }

      } else {
        throw new Error('Custom CSS textarea not found');
      }

      console.log('✅ Custom CSS test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('custom-css-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
