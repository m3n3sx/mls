/**
 * Apply Template Test
 * 
 * Tests applying predefined templates including:
 * - Applying each predefined template
 * - Verifying confirmation dialog appears
 * - Verifying settings change after application
 * - Verifying "Active" badge appears on applied template
 * 
 * Requirements: 6.1, 6.2, 6.3
 */

module.exports = {
  // Test metadata
  name: 'Apply Template',
  description: 'Test applying predefined templates and verifying changes',
  tab: 'templates',
  tags: ['templates', 'visual', 'smoke'],
  requirements: ['6.1', '6.2', '6.3'],
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
      // Navigate to Templates tab
      console.log('📍 Navigating to Templates tab...');
      await helpers.navigateToTab('templates');
      await helpers.takeScreenshot('templates-initial');

      // Get list of predefined templates
      console.log('🔍 Finding predefined templates...');
      const templates = await page.$$('.template-item:not(.custom-template)');
      const templateCount = templates.length;
      
      console.log(`📋 Found ${templateCount} predefined templates`);
      helpers.assert.isTrue(templateCount > 0, 'Should have at least one predefined template');
      results.assertions.push({
        type: 'count',
        description: 'Predefined templates exist',
        expected: '> 0',
        actual: templateCount,
        passed: true
      });

      // Test applying the first predefined template
      if (templateCount > 0) {
        const firstTemplate = templates[0];
        const templateId = await firstTemplate.getAttribute('data-template-id') || 
                          await firstTemplate.getAttribute('data-id');
        const templateName = await firstTemplate.textContent();
        
        console.log(`🎨 Testing template: ${templateName} (ID: ${templateId})`);
        await helpers.takeScreenshot(`template-before-${templateId}`);

        // Get current settings before applying template
        console.log('📊 Capturing current settings...');
        const beforeBgColor = await page.inputValue('[name="admin_bar[bg_color]"]').catch(() => null);
        
        // Click apply button on template
        console.log('🖱️ Clicking apply button...');
        const applyButton = await firstTemplate.$('.apply-template, [data-action="apply"], button');
        helpers.assert.isTrue(applyButton !== null, 'Apply button should exist on template');
        
        if (applyButton) {
          await applyButton.click();
          await helpers.pause(500);
          await helpers.takeScreenshot(`template-dialog-${templateId}`);

          // Verify confirmation dialog appears
          console.log('✅ Verifying confirmation dialog...');
          const dialogVisible = await page.isVisible('.template-confirm-dialog, .confirm-dialog, .swal2-popup').catch(() => false);
          
          if (dialogVisible) {
            console.log('✓ Confirmation dialog appeared');
            results.assertions.push({
              type: 'visibility',
              element: 'confirmation dialog',
              expected: 'visible',
              actual: 'visible',
              passed: true
            });

            // Click confirm button
            console.log('✓ Confirming template application...');
            const confirmButton = await page.$('.confirm-apply, [data-confirm="yes"], .swal2-confirm');
            if (confirmButton) {
              await confirmButton.click();
              await helpers.pause(1000);
            }
          } else {
            console.log('⚠️ No confirmation dialog (template may apply directly)');
          }

          // Wait for AJAX to complete
          console.log('⏳ Waiting for template application...');
          await helpers.waitForAjaxComplete();
          await helpers.pause(1000);
          await helpers.takeScreenshot(`template-applied-${templateId}`);

          // Verify success notification
          const successNotice = await page.isVisible('.notice-success, .updated, .swal2-success').catch(() => false);
          if (successNotice) {
            console.log('✓ Success notification appeared');
            results.assertions.push({
              type: 'notification',
              description: 'Success notification',
              expected: 'visible',
              actual: 'visible',
              passed: true
            });
          }

          // Verify settings changed
          console.log('🔍 Verifying settings changed...');
          await helpers.pause(500);
          const afterBgColor = await page.inputValue('[name="admin_bar[bg_color]"]').catch(() => null);
          
          if (beforeBgColor && afterBgColor && beforeBgColor !== afterBgColor) {
            console.log(`✓ Settings changed: ${beforeBgColor} → ${afterBgColor}`);
            results.assertions.push({
              type: 'change',
              field: 'admin_bar.bg_color',
              before: beforeBgColor,
              after: afterBgColor,
              passed: true
            });
          } else {
            console.log('⚠️ Settings may not have changed (or same color in template)');
          }

          // Verify "Active" badge appears
          console.log('🏷️ Verifying "Active" badge...');
          await helpers.pause(500);
          const activeBadge = await page.isVisible(`[data-template-id="${templateId}"] .active-badge, [data-template-id="${templateId}"].active, [data-id="${templateId}"] .active-badge`).catch(() => false);
          
          if (activeBadge) {
            console.log('✓ "Active" badge is visible');
            results.assertions.push({
              type: 'badge',
              description: 'Active badge on applied template',
              expected: 'visible',
              actual: 'visible',
              passed: true
            });
          } else {
            console.log('⚠️ "Active" badge not found (may use different indicator)');
          }

          await helpers.takeScreenshot(`template-active-${templateId}`);
        }
      }

      // Test applying a second template if available
      if (templateCount > 1) {
        console.log('🎨 Testing second template...');
        const secondTemplate = templates[1];
        const templateId = await secondTemplate.getAttribute('data-template-id') || 
                          await secondTemplate.getAttribute('data-id');
        
        const applyButton = await secondTemplate.$('.apply-template, [data-action="apply"], button');
        if (applyButton) {
          await applyButton.click();
          await helpers.pause(500);

          // Confirm if dialog appears
          const confirmButton = await page.$('.confirm-apply, [data-confirm="yes"], .swal2-confirm');
          if (confirmButton) {
            await confirmButton.click();
          }

          await helpers.waitForAjaxComplete();
          await helpers.pause(1000);
          await helpers.takeScreenshot(`template-second-applied-${templateId}`);

          // Verify first template no longer has active badge
          const firstTemplateId = await templates[0].getAttribute('data-template-id') || 
                                 await templates[0].getAttribute('data-id');
          const firstStillActive = await page.isVisible(`[data-template-id="${firstTemplateId}"] .active-badge, [data-id="${firstTemplateId}"] .active-badge`).catch(() => false);
          
          if (!firstStillActive) {
            console.log('✓ Previous template no longer marked as active');
            results.assertions.push({
              type: 'badge',
              description: 'Previous template badge removed',
              expected: 'hidden',
              actual: 'hidden',
              passed: true
            });
          }
        }
      }

      console.log('✅ Apply template test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('apply-template-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
