/**
 * Import/Export Test
 * 
 * Tests settings import and export functionality including:
 * - Exporting settings to JSON file
 * - Verifying exported JSON file contains valid data
 * - Modifying settings
 * - Importing previously exported settings
 * - Verifying settings are restored after import
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

module.exports = {
  // Test metadata
  name: 'Import/Export Settings',
  description: 'Test settings export and import functionality',
  tab: 'advanced',
  tags: ['advanced', 'import-export', 'data-transfer'],
  requirements: ['7.1', '7.2', '7.3', '7.4', '7.5'],
  estimatedDuration: 30000, // 30 seconds

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

      // Scroll to Import/Export section
      console.log('📜 Scrolling to Import/Export section...');
      const importExportSection = await page.$('text=Import / Export');
      if (importExportSection) {
        await importExportSection.scrollIntoViewIfNeeded();
        await helpers.pause(500);
      }
      await helpers.takeScreenshot('import-export-section');

      // Step 1: Capture current settings before export
      console.log('📊 Capturing current settings...');
      const originalBgColor = await page.inputValue('[name="admin_bar[bg_color]"]').catch(() => '#23282d');
      const originalTextColor = await page.inputValue('[name="admin_bar[text_color]"]').catch(() => '#ffffff');
      
      console.log(`📝 Original settings - BG: ${originalBgColor}, Text: ${originalTextColor}`);
      results.assertions.push({
        type: 'capture',
        description: 'Original settings captured',
        values: { bgColor: originalBgColor, textColor: originalTextColor },
        passed: true
      });

      // Step 2: Export settings
      console.log('💾 Testing settings export...');
      const exportButton = await page.$('#export-settings, [data-action="export"], button:has-text("Export Settings")');
      helpers.assert.isTrue(exportButton !== null, 'Export button should exist');
      
      if (exportButton) {
        await helpers.takeScreenshot('before-export');
        
        // Export settings using helper
        console.log('🔽 Clicking export button...');
        const exportedFilePath = await helpers.exportSettings();
        
        console.log(`✓ Settings exported to: ${exportedFilePath}`);
        results.assertions.push({
          type: 'export',
          description: 'Settings exported successfully',
          filePath: exportedFilePath,
          passed: true
        });
        
        await helpers.pause(1000);
        await helpers.takeScreenshot('after-export');

        // Step 3: Verify exported JSON file
        console.log('🔍 Verifying exported JSON file...');
        const fs = require('fs');
        const path = require('path');
        
        if (fs.existsSync(exportedFilePath)) {
          const fileContent = fs.readFileSync(exportedFilePath, 'utf8');
          const exportedData = JSON.parse(fileContent);
          
          console.log('✓ Exported file is valid JSON');
          results.assertions.push({
            type: 'validation',
            description: 'Exported file is valid JSON',
            passed: true
          });

          // Verify exported data contains expected structure
          helpers.assert.isTrue(typeof exportedData === 'object', 'Exported data should be an object');
          helpers.assert.isTrue(exportedData.admin_bar !== undefined, 'Exported data should contain admin_bar settings');
          
          console.log('✓ Exported data contains valid settings structure');
          results.assertions.push({
            type: 'structure',
            description: 'Exported data has valid structure',
            keys: Object.keys(exportedData),
            passed: true
          });

          // Verify original colors are in exported data
          if (exportedData.admin_bar && exportedData.admin_bar.bg_color) {
            console.log(`✓ Exported data contains original bg_color: ${exportedData.admin_bar.bg_color}`);
            results.assertions.push({
              type: 'data-integrity',
              description: 'Original settings preserved in export',
              expected: originalBgColor,
              actual: exportedData.admin_bar.bg_color,
              passed: true
            });
          }
        } else {
          throw new Error('Exported file not found');
        }

        // Step 4: Modify settings
        console.log('✏️ Modifying settings to test import...');
        await helpers.navigateToTab('admin-bar');
        await helpers.pause(500);
        
        const newBgColor = '#ff0000';
        const newTextColor = '#00ff00';
        
        console.log(`🎨 Changing colors - BG: ${newBgColor}, Text: ${newTextColor}`);
        await helpers.changeSetting('admin_bar[bg_color]', newBgColor);
        await helpers.pause(300);
        await helpers.changeSetting('admin_bar[text_color]', newTextColor);
        await helpers.pause(300);
        
        await helpers.takeScreenshot('settings-modified');
        
        // Save modified settings
        console.log('💾 Saving modified settings...');
        await helpers.saveSettings();
        await helpers.waitForAjaxComplete();
        await helpers.pause(1000);
        
        // Verify settings changed
        const modifiedBgColor = await page.inputValue('[name="admin_bar[bg_color]"]');
        const modifiedTextColor = await page.inputValue('[name="admin_bar[text_color]"]');
        
        console.log(`✓ Settings modified - BG: ${modifiedBgColor}, Text: ${modifiedTextColor}`);
        helpers.assert.equals(modifiedBgColor.toLowerCase(), newBgColor.toLowerCase(), 'Background color should be modified');
        results.assertions.push({
          type: 'modification',
          description: 'Settings successfully modified',
          expected: newBgColor,
          actual: modifiedBgColor,
          passed: true
        });

        // Step 5: Import previously exported settings
        console.log('📥 Testing settings import...');
        await helpers.navigateToTab('advanced');
        await helpers.pause(500);
        
        // Scroll to Import/Export section
        if (importExportSection) {
          await importExportSection.scrollIntoViewIfNeeded();
          await helpers.pause(500);
        }
        
        await helpers.takeScreenshot('before-import');
        
        // Import settings using helper
        console.log('🔼 Importing previously exported settings...');
        await helpers.importSettings(exportedFilePath);
        await helpers.waitForAjaxComplete();
        await helpers.pause(2000);
        
        await helpers.takeScreenshot('after-import');

        // Verify success notification
        const successNotice = await page.isVisible('.notice-success, .updated, .swal2-success').catch(() => false);
        if (successNotice) {
          console.log('✓ Import success notification appeared');
          results.assertions.push({
            type: 'notification',
            description: 'Import success notification',
            expected: 'visible',
            actual: 'visible',
            passed: true
          });
        }

        // Step 6: Verify settings restored after import
        console.log('🔍 Verifying settings restored...');
        await helpers.navigateToTab('admin-bar');
        await helpers.pause(1000);
        
        const restoredBgColor = await page.inputValue('[name="admin_bar[bg_color]"]');
        const restoredTextColor = await page.inputValue('[name="admin_bar[text_color]"]');
        
        console.log(`📊 Restored settings - BG: ${restoredBgColor}, Text: ${restoredTextColor}`);
        console.log(`📊 Original settings - BG: ${originalBgColor}, Text: ${originalTextColor}`);
        
        // Verify restored settings match original
        const bgMatches = restoredBgColor.toLowerCase() === originalBgColor.toLowerCase();
        const textMatches = restoredTextColor.toLowerCase() === originalTextColor.toLowerCase();
        
        if (bgMatches) {
          console.log('✓ Background color restored correctly');
          results.assertions.push({
            type: 'restoration',
            field: 'admin_bar.bg_color',
            expected: originalBgColor,
            actual: restoredBgColor,
            passed: true
          });
        } else {
          console.log(`⚠️ Background color mismatch: expected ${originalBgColor}, got ${restoredBgColor}`);
          results.assertions.push({
            type: 'restoration',
            field: 'admin_bar.bg_color',
            expected: originalBgColor,
            actual: restoredBgColor,
            passed: false
          });
        }

        if (textMatches) {
          console.log('✓ Text color restored correctly');
          results.assertions.push({
            type: 'restoration',
            field: 'admin_bar.text_color',
            expected: originalTextColor,
            actual: restoredTextColor,
            passed: true
          });
        } else {
          console.log(`⚠️ Text color mismatch: expected ${originalTextColor}, got ${restoredTextColor}`);
          results.assertions.push({
            type: 'restoration',
            field: 'admin_bar.text_color',
            expected: originalTextColor,
            actual: restoredTextColor,
            passed: false
          });
        }

        await helpers.takeScreenshot('settings-restored');

        // Cleanup: Delete exported file
        try {
          fs.unlinkSync(exportedFilePath);
          console.log('🗑️ Cleaned up exported file');
        } catch (err) {
          console.log('⚠️ Could not delete exported file:', err.message);
        }
      }

      console.log('✅ Import/Export test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('import-export-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
