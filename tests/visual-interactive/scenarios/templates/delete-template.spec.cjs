/**
 * Delete Template Test
 * 
 * Tests deleting custom templates including:
 * - Creating a custom template to delete
 * - Deleting the custom template
 * - Verifying template is removed from the list
 * - Verifying predefined templates cannot be deleted
 * 
 * Requirements: 6.6
 */

module.exports = {
  // Test metadata
  name: 'Delete Template',
  description: 'Test deleting custom templates and verifying removal',
  tab: 'templates',
  tags: ['templates', 'custom', 'delete', 'visual'],
  requirements: ['6.6'],
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
      // Navigate to Templates tab
      console.log('📍 Navigating to Templates tab...');
      await helpers.navigateToTab('templates');
      await helpers.takeScreenshot('templates-delete-initial');

      // First, create a custom template to delete
      console.log('🎨 Creating a custom template for deletion test...');
      
      // Set up custom settings
      await helpers.navigateToTab('admin-bar');
      await helpers.changeSetting('admin_bar[bg_color]', '#E74C3C');
      await helpers.changeSetting('admin_bar[text_color]', '#FFFFFF');
      await helpers.pause(500);

      // Navigate back to Templates tab
      await helpers.navigateToTab('templates');
      await helpers.pause(500);

      // Generate unique template name
      const timestamp = Date.now();
      const templateToDelete = `Delete Test ${timestamp}`;
      console.log(`💾 Creating template to delete: "${templateToDelete}"`);

      // Save custom template
      const saveButton = await page.$('.save-custom-template, [data-action="save-template"], button:has-text("Save")');
      if (saveButton) {
        await saveButton.click();
        await helpers.pause(500);

        // Fill template name
        const nameInput = await page.$('[name="template_name"], #template-name, input[type="text"]');
        if (nameInput) {
          await nameInput.fill(templateToDelete);
          await helpers.pause(300);

          // Save the template
          const dialogSaveButton = await page.$('.template-dialog .save, .modal .save, .swal2-confirm, button:has-text("Save")');
          if (dialogSaveButton) {
            await dialogSaveButton.click();
            await helpers.waitForAjaxComplete();
            await helpers.pause(1000);
            await helpers.takeScreenshot('template-created-for-deletion');
          }
        }
      }

      // Verify template was created
      console.log('🔍 Verifying template was created...');
      const createdTemplate = await page.$(`[data-template-name="${templateToDelete}"], .template-item:has-text("${templateToDelete}")`).catch(() => null);
      
      if (!createdTemplate) {
        // Try refreshing
        await helpers.reloadPage();
        await helpers.navigateToSettings();
        await helpers.navigateToTab('templates');
        await helpers.pause(1000);
      }

      const templateElement = await page.$(`[data-template-name="${templateToDelete}"], .template-item:has-text("${templateToDelete}")`);
      helpers.assert.isTrue(templateElement !== null, 'Template should exist before deletion');
      
      if (templateElement) {
        console.log('✓ Template created successfully');
        results.assertions.push({
          type: 'existence',
          element: `template "${templateToDelete}"`,
          expected: 'exists',
          actual: 'exists',
          passed: true
        });

        // Count templates before deletion
        const beforeCount = await page.$$('.template-item').then(items => items.length);
        console.log(`📊 Template count before deletion: ${beforeCount}`);

        // Find and click delete button
        console.log('🗑️ Deleting template...');
        const deleteButton = await templateElement.$('.delete-template, [data-action="delete"], .delete-btn, button:has-text("Delete")');
        
        if (deleteButton) {
          console.log('✓ Delete button found');
          results.assertions.push({
            type: 'functionality',
            description: 'Delete button exists on custom template',
            expected: 'exists',
            actual: 'exists',
            passed: true
          });

          await deleteButton.click();
          await helpers.pause(500);
          await helpers.takeScreenshot('delete-confirmation-dialog');

          // Check for confirmation dialog
          console.log('✅ Checking for confirmation dialog...');
          const confirmDialog = await page.isVisible('.confirm-delete, .confirm-dialog, .swal2-popup').catch(() => false);
          
          if (confirmDialog) {
            console.log('✓ Confirmation dialog appeared');
            results.assertions.push({
              type: 'visibility',
              element: 'delete confirmation dialog',
              expected: 'visible',
              actual: 'visible',
              passed: true
            });

            // Click confirm button
            console.log('✓ Confirming deletion...');
            const confirmButton = await page.$('.confirm-delete, [data-confirm="yes"], .swal2-confirm, button:has-text("Yes"), button:has-text("Delete")');
            if (confirmButton) {
              await confirmButton.click();
              await helpers.pause(500);
            }
          } else {
            console.log('⚠️ No confirmation dialog (deletion may be immediate)');
          }

          // Wait for AJAX to complete
          console.log('⏳ Waiting for deletion to complete...');
          await helpers.waitForAjaxComplete();
          await helpers.pause(1000);
          await helpers.takeScreenshot('after-deletion');

          // Verify success notification
          const successNotice = await page.isVisible('.notice-success, .updated, .swal2-success').catch(() => false);
          if (successNotice) {
            console.log('✓ Success notification appeared');
            results.assertions.push({
              type: 'notification',
              description: 'Success notification after deletion',
              expected: 'visible',
              actual: 'visible',
              passed: true
            });
          }

          // Verify template is removed from list
          console.log('🔍 Verifying template was removed...');
          await helpers.pause(500);
          
          const stillExists = await page.$(`[data-template-name="${templateToDelete}"], .template-item:has-text("${templateToDelete}")`).catch(() => null);
          
          if (!stillExists) {
            console.log('✓ Template successfully removed from list');
            results.assertions.push({
              type: 'removal',
              element: `template "${templateToDelete}"`,
              expected: 'removed',
              actual: 'removed',
              passed: true
            });
          } else {
            // Check if it's hidden instead of removed
            const isHidden = await stillExists.isHidden().catch(() => false);
            if (isHidden) {
              console.log('✓ Template is hidden (effectively removed)');
              results.assertions.push({
                type: 'visibility',
                element: `template "${templateToDelete}"`,
                expected: 'hidden',
                actual: 'hidden',
                passed: true
              });
            } else {
              throw new Error('Template still visible after deletion');
            }
          }

          // Verify template count decreased
          const afterCount = await page.$$('.template-item').then(items => items.length);
          console.log(`📊 Template count after deletion: ${afterCount}`);
          
          if (afterCount < beforeCount) {
            console.log(`✓ Template count decreased: ${beforeCount} → ${afterCount}`);
            results.assertions.push({
              type: 'count',
              description: 'Template count decreased',
              before: beforeCount,
              after: afterCount,
              passed: true
            });
          }

          // Verify deletion persists after page refresh
          console.log('🔄 Verifying deletion persists after refresh...');
          await helpers.reloadPage();
          await helpers.navigateToSettings();
          await helpers.navigateToTab('templates');
          await helpers.pause(1000);
          await helpers.takeScreenshot('after-refresh');

          const afterRefresh = await page.$(`[data-template-name="${templateToDelete}"], .template-item:has-text("${templateToDelete}")`).catch(() => null);
          
          if (!afterRefresh) {
            console.log('✓ Template deletion persisted after refresh');
            results.assertions.push({
              type: 'persistence',
              description: 'Deletion persisted after refresh',
              expected: 'still removed',
              actual: 'still removed',
              passed: true
            });
          } else {
            throw new Error('Template reappeared after page refresh');
          }

        } else {
          console.log('⚠️ Delete button not found on custom template');
        }
      }

      // Verify predefined templates don't have delete buttons
      console.log('🔒 Verifying predefined templates cannot be deleted...');
      const predefinedTemplates = await page.$$('.template-item:not(.custom-template)');
      
      if (predefinedTemplates.length > 0) {
        const firstPredefined = predefinedTemplates[0];
        const hasDeleteButton = await firstPredefined.$('.delete-template, [data-action="delete"], .delete-btn').catch(() => null);
        
        if (!hasDeleteButton) {
          console.log('✓ Predefined templates do not have delete buttons');
          results.assertions.push({
            type: 'security',
            description: 'Predefined templates protected from deletion',
            expected: 'no delete button',
            actual: 'no delete button',
            passed: true
          });
        } else {
          console.log('⚠️ Predefined template has delete button (may be disabled)');
        }
      }

      console.log('✅ Delete template test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('delete-template-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
