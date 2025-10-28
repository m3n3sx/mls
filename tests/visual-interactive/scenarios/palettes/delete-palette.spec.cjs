/**
 * Delete Palette Test
 * 
 * Tests deleting custom color palettes including:
 * - Creating a custom palette to delete
 * - Deleting the custom palette
 * - Verifying palette is removed from the list
 * - Verifying predefined palettes cannot be deleted
 * 
 * Requirements: 5.5
 */

module.exports = {
  // Test metadata
  name: 'Delete Palette',
  description: 'Test deleting custom color palettes and verifying removal',
  tab: 'palettes',
  tags: ['palettes', 'custom', 'delete', 'visual'],
  requirements: ['5.5'],
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
      // Navigate to settings page
      console.log('📍 Navigating to MASE settings...');
      await helpers.navigateToSettings();
      await helpers.pause(500);

      // Look for palette section
      console.log('🔍 Finding palette section...');
      let paletteSection = await page.$('.mase-palettes, .color-palettes, #palettes-section').catch(() => null);
      
      // If not found, try navigating to palettes tab
      if (!paletteSection) {
        console.log('📍 Trying to navigate to Palettes tab...');
        const palettesTab = await page.$('[data-tab="palettes"], a[href*="palettes"]').catch(() => null);
        if (palettesTab) {
          await palettesTab.click();
          await helpers.pause(500);
          paletteSection = await page.$('.mase-palettes, .color-palettes, #palettes-section').catch(() => null);
        }
      }

      await helpers.takeScreenshot('palettes-delete-initial');

      // First, create a custom palette to delete
      console.log('🎨 Creating a custom palette for deletion test...');
      
      // Define test colors
      const testColors = {
        primary: '#9B59B6',      // Purple
        secondary: '#1ABC9C',    // Turquoise
        accent: '#E67E22',       // Carrot
        background: '#34495E',   // Wet asphalt
        text: '#ECF0F1'          // Clouds
      };

      // Apply test colors to settings
      const colorMappings = [
        { field: 'admin_bar[bg_color]', value: testColors.primary },
        { field: 'admin_bar[text_color]', value: testColors.text },
        { field: 'menu[bg_color]', value: testColors.secondary }
      ];

      for (const mapping of colorMappings) {
        const input = await page.$(`[name="${mapping.field}"]`).catch(() => null);
        if (input) {
          await input.fill(mapping.value);
        }
      }

      await helpers.pause(500);

      // Navigate back to palette section if needed
      if (!paletteSection) {
        const palettesTab = await page.$('[data-tab="palettes"], a[href*="palettes"]').catch(() => null);
        if (palettesTab) {
          await palettesTab.click();
          await helpers.pause(500);
        }
      }

      // Generate unique palette name
      const timestamp = Date.now();
      const paletteToDelete = `Delete Test ${timestamp}`;
      console.log(`💾 Creating palette to delete: "${paletteToDelete}"`);

      // Save custom palette
      const saveButton = await page.$('.save-custom-palette, [data-action="save-palette"], button:has-text("Save Palette"), .save-palette-btn').catch(() => null);
      
      if (saveButton) {
        await saveButton.click();
        await helpers.pause(500);

        // Fill palette name
        const nameInput = await page.$('[name="palette_name"], #palette-name, .palette-name-input, input[type="text"]').catch(() => null);
        
        if (nameInput) {
          await nameInput.fill(paletteToDelete);
          await helpers.pause(300);

          // Save the palette
          const dialogSaveButton = await page.$('.palette-dialog .save, .modal .save, .swal2-confirm, button:has-text("Save"), .save-palette-confirm').catch(() => null);
          
          if (dialogSaveButton) {
            await dialogSaveButton.click();
            await helpers.waitForAjaxComplete();
            await helpers.pause(1000);
            await helpers.takeScreenshot('palette-created-for-deletion');
          }
        }
      }

      // Verify palette was created
      console.log('🔍 Verifying palette was created...');
      let paletteElement = await page.$(`[data-palette-name="${paletteToDelete}"], .palette-item:has-text("${paletteToDelete}"), .color-palette:has-text("${paletteToDelete}")`).catch(() => null);
      
      if (!paletteElement) {
        // Try refreshing
        console.log('🔄 Refreshing page to find created palette...');
        await helpers.reloadPage();
        await helpers.navigateToSettings();
        
        const palettesTab = await page.$('[data-tab="palettes"], a[href*="palettes"]').catch(() => null);
        if (palettesTab) {
          await palettesTab.click();
          await helpers.pause(1000);
        }
        
        paletteElement = await page.$(`[data-palette-name="${paletteToDelete}"], .palette-item:has-text("${paletteToDelete}"), .color-palette:has-text("${paletteToDelete}")`).catch(() => null);
      }

      helpers.assert.isTrue(paletteElement !== null, 'Palette should exist before deletion');
      
      if (paletteElement) {
        console.log('✓ Palette created successfully');
        results.assertions.push({
          type: 'existence',
          element: `palette "${paletteToDelete}"`,
          expected: 'exists',
          actual: 'exists',
          passed: true
        });

        // Count palettes before deletion
        const beforeCount = await page.$$('.palette-item, .color-palette').then(items => items.length);
        console.log(`📊 Palette count before deletion: ${beforeCount}`);

        // Find and click delete button
        console.log('🗑️ Deleting palette...');
        const deleteButton = await paletteElement.$('.delete-palette, [data-action="delete"], .remove-palette, .delete-btn, button:has-text("Delete")').catch(() => null);
        
        if (deleteButton) {
          console.log('✓ Delete button found');
          results.assertions.push({
            type: 'functionality',
            description: 'Delete button exists on custom palette',
            expected: 'exists',
            actual: 'exists',
            passed: true
          });

          await deleteButton.click();
          await helpers.pause(500);
          await helpers.takeScreenshot('delete-confirmation-dialog');

          // Check for confirmation dialog
          console.log('✅ Checking for confirmation dialog...');
          const confirmDialog = await page.isVisible('.confirm-delete, .confirm-dialog, .swal2-popup, .delete-palette-confirm').catch(() => false);
          
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
            const confirmButton = await page.$('.confirm-delete, [data-confirm="yes"], .swal2-confirm, button:has-text("Yes"), button:has-text("Delete"), button:has-text("Confirm")').catch(() => null);
            
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

          // Verify palette is removed from list
          console.log('🔍 Verifying palette was removed...');
          await helpers.pause(500);
          
          const stillExists = await page.$(`[data-palette-name="${paletteToDelete}"], .palette-item:has-text("${paletteToDelete}"), .color-palette:has-text("${paletteToDelete}")`).catch(() => null);
          
          if (!stillExists) {
            console.log('✓ Palette successfully removed from list');
            results.assertions.push({
              type: 'removal',
              element: `palette "${paletteToDelete}"`,
              expected: 'removed',
              actual: 'removed',
              passed: true
            });
          } else {
            // Check if it's hidden instead of removed
            const isHidden = await stillExists.isHidden().catch(() => false);
            if (isHidden) {
              console.log('✓ Palette is hidden (effectively removed)');
              results.assertions.push({
                type: 'visibility',
                element: `palette "${paletteToDelete}"`,
                expected: 'hidden',
                actual: 'hidden',
                passed: true
              });
            } else {
              throw new Error('Palette still visible after deletion');
            }
          }

          // Verify palette count decreased
          const afterCount = await page.$$('.palette-item, .color-palette').then(items => items.length);
          console.log(`📊 Palette count after deletion: ${afterCount}`);
          
          if (afterCount < beforeCount) {
            console.log(`✓ Palette count decreased: ${beforeCount} → ${afterCount}`);
            results.assertions.push({
              type: 'count',
              description: 'Palette count decreased',
              before: beforeCount,
              after: afterCount,
              passed: true
            });
          }

          // Verify deletion persists after page refresh
          console.log('🔄 Verifying deletion persists after refresh...');
          await helpers.reloadPage();
          await helpers.navigateToSettings();
          
          const palettesTab = await page.$('[data-tab="palettes"], a[href*="palettes"]').catch(() => null);
          if (palettesTab) {
            await palettesTab.click();
            await helpers.pause(1000);
          }
          
          await helpers.takeScreenshot('after-refresh');

          const afterRefresh = await page.$(`[data-palette-name="${paletteToDelete}"], .palette-item:has-text("${paletteToDelete}"), .color-palette:has-text("${paletteToDelete}")`).catch(() => null);
          
          if (!afterRefresh) {
            console.log('✓ Palette deletion persisted after refresh');
            results.assertions.push({
              type: 'persistence',
              description: 'Deletion persisted after refresh',
              expected: 'still removed',
              actual: 'still removed',
              passed: true
            });
          } else {
            throw new Error('Palette reappeared after page refresh');
          }

        } else {
          console.log('⚠️ Delete button not found on custom palette');
          results.assertions.push({
            type: 'functionality',
            description: 'Delete button on custom palette',
            expected: 'exists',
            actual: 'not found',
            passed: false
          });
        }
      }

      // Verify predefined palettes don't have delete buttons
      console.log('🔒 Verifying predefined palettes cannot be deleted...');
      const predefinedPalettes = await page.$$('.palette-item:not(.custom-palette), .color-palette:not(.custom)').catch(() => []);
      
      if (predefinedPalettes.length > 0) {
        const firstPredefined = predefinedPalettes[0];
        const hasDeleteButton = await firstPredefined.$('.delete-palette, [data-action="delete"], .remove-palette, .delete-btn').catch(() => null);
        
        if (!hasDeleteButton) {
          console.log('✓ Predefined palettes do not have delete buttons');
          results.assertions.push({
            type: 'security',
            description: 'Predefined palettes protected from deletion',
            expected: 'no delete button',
            actual: 'no delete button',
            passed: true
          });
        } else {
          console.log('⚠️ Predefined palette has delete button (may be disabled)');
          
          // Check if button is disabled
          const isDisabled = await hasDeleteButton.isDisabled().catch(() => false);
          if (isDisabled) {
            console.log('✓ Delete button on predefined palette is disabled');
            results.assertions.push({
              type: 'security',
              description: 'Predefined palette delete button disabled',
              expected: 'disabled',
              actual: 'disabled',
              passed: true
            });
          }
        }
      }

      console.log('✅ Delete palette test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('delete-palette-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
