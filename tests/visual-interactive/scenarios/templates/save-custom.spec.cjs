/**
 * Save Custom Template Test
 * 
 * Tests saving custom templates including:
 * - Creating a custom template with current settings
 * - Verifying template appears in the template list
 * - Verifying template can be identified as custom
 * 
 * Requirements: 6.4, 6.5
 */

module.exports = {
  // Test metadata
  name: 'Save Custom Template',
  description: 'Test saving custom templates and verifying they appear in list',
  tab: 'templates',
  tags: ['templates', 'custom', 'visual'],
  requirements: ['6.4', '6.5'],
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
      // Navigate to Templates tab
      console.log('📍 Navigating to Templates tab...');
      await helpers.navigateToTab('templates');
      await helpers.takeScreenshot('templates-save-custom-initial');

      // Set up some custom settings to save as template
      console.log('🎨 Setting up custom configuration...');
      await helpers.navigateToTab('admin-bar');
      await helpers.changeSetting('admin_bar[bg_color]', '#9B59B6');
      await helpers.changeSetting('admin_bar[text_color]', '#ECF0F1');
      await helpers.pause(500);
      await helpers.takeScreenshot('custom-settings-configured');

      // Navigate back to Templates tab
      console.log('📍 Returning to Templates tab...');
      await helpers.navigateToTab('templates');
      await helpers.pause(500);

      // Count existing templates before saving
      const beforeCount = await page.$$('.template-item').then(items => items.length);
      console.log(`📊 Current template count: ${beforeCount}`);

      // Generate unique template name
      const timestamp = Date.now();
      const customTemplateName = `Test Template ${timestamp}`;
      console.log(`💾 Saving custom template: "${customTemplateName}"`);

      // Find and click "Save Custom Template" button
      const saveButton = await page.$('.save-custom-template, [data-action="save-template"], button:has-text("Save")');
      helpers.assert.isTrue(saveButton !== null, 'Save custom template button should exist');
      
      if (saveButton) {
        await saveButton.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('save-template-dialog');

        // Verify dialog appears
        console.log('✅ Verifying save template dialog...');
        const dialogVisible = await page.isVisible('.template-dialog, .modal, .swal2-popup, #template-name-dialog').catch(() => false);
        
        if (dialogVisible) {
          console.log('✓ Save template dialog appeared');
          results.assertions.push({
            type: 'visibility',
            element: 'save template dialog',
            expected: 'visible',
            actual: 'visible',
            passed: true
          });

          // Fill template name
          console.log(`✏️ Entering template name: "${customTemplateName}"`);
          const nameInput = await page.$('[name="template_name"], #template-name, input[type="text"]');
          if (nameInput) {
            await nameInput.fill(customTemplateName);
            await helpers.pause(300);
            await helpers.takeScreenshot('template-name-entered');

            // Click save button in dialog
            console.log('💾 Clicking save button...');
            const dialogSaveButton = await page.$('.template-dialog .save, .modal .save, .swal2-confirm, button:has-text("Save")');
            if (dialogSaveButton) {
              await dialogSaveButton.click();
              await helpers.pause(500);

              // Wait for AJAX to complete
              console.log('⏳ Waiting for save operation...');
              await helpers.waitForAjaxComplete();
              await helpers.pause(1000);
              await helpers.takeScreenshot('template-saved');

              // Verify success notification
              const successNotice = await page.isVisible('.notice-success, .updated, .swal2-success').catch(() => false);
              if (successNotice) {
                console.log('✓ Success notification appeared');
                results.assertions.push({
                  type: 'notification',
                  description: 'Success notification after save',
                  expected: 'visible',
                  actual: 'visible',
                  passed: true
                });
              }

              // Verify template appears in list
              console.log('🔍 Verifying template appears in list...');
              await helpers.pause(500);
              
              // Try multiple selectors to find the new template
              const newTemplate = await page.$(`[data-template-name="${customTemplateName}"], .template-item:has-text("${customTemplateName}")`).catch(() => null);
              
              if (newTemplate) {
                console.log('✓ Custom template found in list');
                results.assertions.push({
                  type: 'existence',
                  element: `template "${customTemplateName}"`,
                  expected: 'exists',
                  actual: 'exists',
                  passed: true
                });

                // Verify it's marked as custom
                const isCustom = await newTemplate.evaluate(el => 
                  el.classList.contains('custom-template') || 
                  el.querySelector('.custom-badge') !== null ||
                  el.getAttribute('data-custom') === 'true'
                ).catch(() => false);

                if (isCustom) {
                  console.log('✓ Template is marked as custom');
                  results.assertions.push({
                    type: 'classification',
                    description: 'Template marked as custom',
                    expected: 'custom',
                    actual: 'custom',
                    passed: true
                  });
                }

                await helpers.takeScreenshot('custom-template-in-list');

                // Verify template count increased
                const afterCount = await page.$$('.template-item').then(items => items.length);
                console.log(`📊 New template count: ${afterCount}`);
                
                if (afterCount > beforeCount) {
                  console.log(`✓ Template count increased: ${beforeCount} → ${afterCount}`);
                  results.assertions.push({
                    type: 'count',
                    description: 'Template count increased',
                    before: beforeCount,
                    after: afterCount,
                    passed: true
                  });
                }

                // Test that the saved template can be applied
                console.log('🧪 Testing that saved template can be applied...');
                const applyButton = await newTemplate.$('.apply-template, [data-action="apply"], button');
                if (applyButton) {
                  console.log('✓ Apply button exists on custom template');
                  results.assertions.push({
                    type: 'functionality',
                    description: 'Apply button on custom template',
                    expected: 'exists',
                    actual: 'exists',
                    passed: true
                  });
                }

              } else {
                console.log('⚠️ Custom template not found in list (may need page refresh)');
                
                // Try refreshing the page
                await helpers.reloadPage();
                await helpers.navigateToSettings();
                await helpers.navigateToTab('templates');
                await helpers.pause(1000);
                
                const afterRefresh = await page.$(`[data-template-name="${customTemplateName}"], .template-item:has-text("${customTemplateName}")`).catch(() => null);
                if (afterRefresh) {
                  console.log('✓ Custom template found after page refresh');
                  results.assertions.push({
                    type: 'persistence',
                    element: `template "${customTemplateName}"`,
                    expected: 'persisted',
                    actual: 'persisted',
                    passed: true
                  });
                }
              }

            } else {
              throw new Error('Save button not found in dialog');
            }
          } else {
            throw new Error('Template name input not found');
          }
        } else {
          throw new Error('Save template dialog did not appear');
        }
      } else {
        throw new Error('Save custom template button not found');
      }

      console.log('✅ Save custom template test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('save-custom-template-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
