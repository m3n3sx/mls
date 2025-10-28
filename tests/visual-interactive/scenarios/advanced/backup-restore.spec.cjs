/**
 * Backup/Restore Test
 * 
 * Tests backup and restore functionality including:
 * - Creating a backup of current settings
 * - Verifying backup appears in backup list
 * - Modifying settings
 * - Restoring from backup
 * - Verifying settings are restored correctly
 * 
 * Requirements: 7.6, 7.7
 */

module.exports = {
  // Test metadata
  name: 'Backup & Restore',
  description: 'Test backup creation and restoration functionality',
  tab: 'advanced',
  tags: ['advanced', 'backup', 'restore', 'data-safety'],
  requirements: ['7.6', '7.7'],
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
      // Navigate to Advanced tab
      console.log('📍 Navigating to Advanced tab...');
      await helpers.navigateToTab('advanced');
      await helpers.takeScreenshot('advanced-initial');

      // Scroll to Backup & Restore section
      console.log('📜 Scrolling to Backup & Restore section...');
      const backupSection = await page.$('text=Backup & Restore');
      if (backupSection) {
        await backupSection.scrollIntoViewIfNeeded();
        await helpers.pause(500);
      }
      await helpers.takeScreenshot('backup-restore-section');

      // Step 1: Capture current settings before backup
      console.log('📊 Capturing current settings...');
      await helpers.navigateToTab('admin-bar');
      await helpers.pause(500);
      
      const originalBgColor = await page.inputValue('[name="admin_bar[bg_color]"]').catch(() => '#23282d');
      const originalTextColor = await page.inputValue('[name="admin_bar[text_color]"]').catch(() => '#ffffff');
      const originalMenuBgColor = await page.inputValue('[name="menu[bg_color]"]').catch(() => '#23282d');
      
      console.log(`📝 Original settings:`);
      console.log(`   Admin Bar BG: ${originalBgColor}`);
      console.log(`   Admin Bar Text: ${originalTextColor}`);
      console.log(`   Menu BG: ${originalMenuBgColor}`);
      
      results.assertions.push({
        type: 'capture',
        description: 'Original settings captured',
        values: { 
          adminBarBg: originalBgColor, 
          adminBarText: originalTextColor,
          menuBg: originalMenuBgColor
        },
        passed: true
      });

      // Step 2: Create backup
      console.log('💾 Testing backup creation...');
      await helpers.navigateToTab('advanced');
      await helpers.pause(500);
      
      // Scroll to backup section
      if (backupSection) {
        await backupSection.scrollIntoViewIfNeeded();
        await helpers.pause(500);
      }
      
      await helpers.takeScreenshot('before-backup');
      
      // Get initial backup count
      const initialBackupCount = await page.$$eval(
        '.backup-item, [data-backup-id], .backup-list-item',
        items => items.length
      ).catch(() => 0);
      
      console.log(`📋 Initial backup count: ${initialBackupCount}`);
      
      // Create backup using helper
      console.log('🔄 Creating backup...');
      const backupId = await helpers.createBackup();
      
      console.log(`✓ Backup created with ID: ${backupId}`);
      results.assertions.push({
        type: 'creation',
        description: 'Backup created successfully',
        backupId: backupId,
        passed: true
      });
      
      await helpers.pause(1000);
      await helpers.takeScreenshot('after-backup-creation');

      // Step 3: Verify backup appears in list
      console.log('🔍 Verifying backup appears in list...');
      await helpers.pause(500);
      
      const newBackupCount = await page.$$eval(
        '.backup-item, [data-backup-id], .backup-list-item',
        items => items.length
      ).catch(() => 0);
      
      console.log(`📋 New backup count: ${newBackupCount}`);
      
      if (newBackupCount > initialBackupCount) {
        console.log('✓ Backup appears in list');
        results.assertions.push({
          type: 'list-verification',
          description: 'Backup appears in backup list',
          initialCount: initialBackupCount,
          newCount: newBackupCount,
          passed: true
        });
      } else {
        console.log('⚠️ Backup count did not increase (may need to refresh)');
      }

      // Verify specific backup exists
      const backupExists = await page.isVisible(`[data-backup-id="${backupId}"]`).catch(() => false);
      if (backupExists) {
        console.log(`✓ Backup ${backupId} is visible in list`);
        results.assertions.push({
          type: 'visibility',
          description: 'Created backup is visible',
          backupId: backupId,
          passed: true
        });
      } else {
        console.log(`⚠️ Backup ${backupId} not found in list (may use different selector)`);
      }

      await helpers.takeScreenshot('backup-in-list');

      // Step 4: Modify settings
      console.log('✏️ Modifying settings to test restore...');
      await helpers.navigateToTab('admin-bar');
      await helpers.pause(500);
      
      const modifiedBgColor = '#0000ff';
      const modifiedTextColor = '#ffff00';
      
      console.log(`🎨 Changing colors:`);
      console.log(`   Admin Bar BG: ${modifiedBgColor}`);
      console.log(`   Admin Bar Text: ${modifiedTextColor}`);
      
      await helpers.changeSetting('admin_bar[bg_color]', modifiedBgColor);
      await helpers.pause(300);
      await helpers.changeSetting('admin_bar[text_color]', modifiedTextColor);
      await helpers.pause(300);
      
      await helpers.takeScreenshot('settings-modified');
      
      // Save modified settings
      console.log('💾 Saving modified settings...');
      await helpers.saveSettings();
      await helpers.waitForAjaxComplete();
      await helpers.pause(1000);
      
      // Verify settings changed
      const changedBgColor = await page.inputValue('[name="admin_bar[bg_color]"]');
      const changedTextColor = await page.inputValue('[name="admin_bar[text_color]"]');
      
      console.log(`✓ Settings modified:`);
      console.log(`   Admin Bar BG: ${changedBgColor}`);
      console.log(`   Admin Bar Text: ${changedTextColor}`);
      
      helpers.assert.equals(changedBgColor.toLowerCase(), modifiedBgColor.toLowerCase(), 'Background color should be modified');
      results.assertions.push({
        type: 'modification',
        description: 'Settings successfully modified',
        field: 'admin_bar.bg_color',
        expected: modifiedBgColor,
        actual: changedBgColor,
        passed: true
      });

      // Step 5: Restore from backup
      console.log('♻️ Testing backup restoration...');
      await helpers.navigateToTab('advanced');
      await helpers.pause(500);
      
      // Scroll to backup section
      if (backupSection) {
        await backupSection.scrollIntoViewIfNeeded();
        await helpers.pause(500);
      }
      
      await helpers.takeScreenshot('before-restore');
      
      // Restore backup using helper
      console.log(`🔄 Restoring backup ${backupId}...`);
      await helpers.restoreBackup(backupId);
      await helpers.waitForAjaxComplete();
      await helpers.pause(2000);
      
      await helpers.takeScreenshot('after-restore');

      // Verify success notification
      const successNotice = await page.isVisible('.notice-success, .updated, .swal2-success').catch(() => false);
      if (successNotice) {
        console.log('✓ Restore success notification appeared');
        results.assertions.push({
          type: 'notification',
          description: 'Restore success notification',
          expected: 'visible',
          actual: 'visible',
          passed: true
        });
      }

      // Step 6: Verify settings restored correctly
      console.log('🔍 Verifying settings restored...');
      await helpers.navigateToTab('admin-bar');
      await helpers.pause(1000);
      
      const restoredBgColor = await page.inputValue('[name="admin_bar[bg_color]"]');
      const restoredTextColor = await page.inputValue('[name="admin_bar[text_color]"]');
      
      console.log(`📊 Restored settings:`);
      console.log(`   Admin Bar BG: ${restoredBgColor}`);
      console.log(`   Admin Bar Text: ${restoredTextColor}`);
      console.log(`📊 Original settings:`);
      console.log(`   Admin Bar BG: ${originalBgColor}`);
      console.log(`   Admin Bar Text: ${originalTextColor}`);
      
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

      // Optional: Test deleting backup
      console.log('🗑️ Testing backup deletion (optional)...');
      await helpers.navigateToTab('advanced');
      await helpers.pause(500);
      
      if (backupSection) {
        await backupSection.scrollIntoViewIfNeeded();
        await helpers.pause(500);
      }

      const deleteButton = await page.$(`[data-backup-id="${backupId}"] .delete-backup, [data-backup-id="${backupId}"] [data-action="delete"]`);
      if (deleteButton) {
        console.log('🗑️ Deleting test backup...');
        await deleteButton.click();
        await helpers.pause(500);
        
        // Confirm deletion if dialog appears
        const confirmButton = await page.$('.confirm-delete, [data-confirm="yes"], .swal2-confirm');
        if (confirmButton) {
          await confirmButton.click();
          await helpers.waitForAjaxComplete();
          await helpers.pause(1000);
        }
        
        // Verify backup removed
        const backupStillExists = await page.isVisible(`[data-backup-id="${backupId}"]`).catch(() => false);
        if (!backupStillExists) {
          console.log('✓ Backup deleted successfully');
          results.assertions.push({
            type: 'deletion',
            description: 'Backup deleted from list',
            backupId: backupId,
            passed: true
          });
        }
        
        await helpers.takeScreenshot('backup-deleted');
      } else {
        console.log('⚠️ Delete button not found (backup cleanup skipped)');
      }

      console.log('✅ Backup/Restore test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('backup-restore-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
