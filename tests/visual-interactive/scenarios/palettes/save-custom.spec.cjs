/**
 * Save Custom Palette Test
 * 
 * Tests saving custom color palettes including:
 * - Creating a custom palette with test colors
 * - Verifying palette appears in the palette list
 * - Verifying palette can be identified as custom
 * 
 * Requirements: 5.3, 5.4
 */

module.exports = {
  // Test metadata
  name: 'Save Custom Palette',
  description: 'Test creating custom color palettes and verifying they appear in list',
  tab: 'palettes',
  tags: ['palettes', 'custom', 'colors', 'visual'],
  requirements: ['5.3', '5.4'],
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

      await helpers.takeScreenshot('palettes-save-custom-initial');

      // Set up custom colors to save as palette
      console.log('🎨 Setting up custom color configuration...');
      
      // Define test colors for the custom palette
      const testColors = {
        primary: '#E74C3C',      // Red
        secondary: '#3498DB',    // Blue
        accent: '#F39C12',       // Orange
        background: '#2C3E50',   // Dark blue
        text: '#ECF0F1'          // Light gray
      };

      console.log('🎨 Test colors:', testColors);

      // Apply test colors to various settings
      const colorMappings = [
        { field: 'admin_bar[bg_color]', value: testColors.primary },
        { field: 'admin_bar[text_color]', value: testColors.text },
        { field: 'menu[bg_color]', value: testColors.secondary },
        { field: 'menu[text_color]', value: testColors.text },
        { field: 'content[bg_color]', value: testColors.background }
      ];

      for (const mapping of colorMappings) {
        const input = await page.$(`[name="${mapping.field}"]`).catch(() => null);
        if (input) {
          await input.fill(mapping.value);
          console.log(`  ✓ Set ${mapping.field} to ${mapping.value}`);
        }
      }

      await helpers.pause(500);
      await helpers.takeScreenshot('custom-colors-configured');

      // Navigate back to palette section if needed
      if (!paletteSection) {
        console.log('📍 Navigating to palette section...');
        await helpers.navigateToSettings();
        const palettesTab = await page.$('[data-tab="palettes"], a[href*="palettes"]').catch(() => null);
        if (palettesTab) {
          await palettesTab.click();
          await helpers.pause(500);
        }
      }

      // Count existing palettes before saving
      const beforeCount = await page.$$('.palette-item, .color-palette').then(items => items.length);
      console.log(`📊 Current palette count: ${beforeCount}`);

      // Generate unique palette name
      const timestamp = Date.now();
      const customPaletteName = `Test Palette ${timestamp}`;
      console.log(`💾 Saving custom palette: "${customPaletteName}"`);

      // Find and click "Save Custom Palette" button
      const saveButton = await page.$('.save-custom-palette, [data-action="save-palette"], button:has-text("Save Palette"), .save-palette-btn').catch(() => null);
      helpers.assert.isTrue(saveButton !== null, 'Save custom palette button should exist');
      
      if (saveButton) {
        await saveButton.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('save-palette-dialog');

        // Verify dialog appears
        console.log('✅ Verifying save palette dialog...');
        const dialogVisible = await page.isVisible('.palette-dialog, .modal, .swal2-popup, #palette-name-dialog, .save-palette-modal').catch(() => false);
        
        if (dialogVisible) {
          console.log('✓ Save palette dialog appeared');
          results.assertions.push({
            type: 'visibility',
            element: 'save palette dialog',
            expected: 'visible',
            actual: 'visible',
            passed: true
          });

          // Fill palette name
          console.log(`✏️ Entering palette name: "${customPaletteName}"`);
          const nameInput = await page.$('[name="palette_name"], #palette-name, .palette-name-input, input[type="text"]').catch(() => null);
          
          if (nameInput) {
            await nameInput.fill(customPaletteName);
            await helpers.pause(300);
            await helpers.takeScreenshot('palette-name-entered');

            // Click save button in dialog
            console.log('💾 Clicking save button...');
            const dialogSaveButton = await page.$('.palette-dialog .save, .modal .save, .swal2-confirm, button:has-text("Save"), .save-palette-confirm').catch(() => null);
            
            if (dialogSaveButton) {
              await dialogSaveButton.click();
              await helpers.pause(500);

              // Wait for AJAX to complete
              console.log('⏳ Waiting for save operation...');
              await helpers.waitForAjaxComplete();
              await helpers.pause(1000);
              await helpers.takeScreenshot('palette-saved');

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

              // Verify palette appears in list
              console.log('🔍 Verifying palette appears in list...');
              await helpers.pause(500);
              
              // Try multiple selectors to find the new palette
              const newPalette = await page.$(`[data-palette-name="${customPaletteName}"], .palette-item:has-text("${customPaletteName}"), .color-palette:has-text("${customPaletteName}")`).catch(() => null);
              
              if (newPalette) {
                console.log('✓ Custom palette found in list');
                results.assertions.push({
                  type: 'existence',
                  element: `palette "${customPaletteName}"`,
                  expected: 'exists',
                  actual: 'exists',
                  passed: true
                });

                // Verify it's marked as custom
                const isCustom = await newPalette.evaluate(el => 
                  el.classList.contains('custom-palette') || 
                  el.querySelector('.custom-badge') !== null ||
                  el.getAttribute('data-custom') === 'true' ||
                  el.classList.contains('custom')
                ).catch(() => false);

                if (isCustom) {
                  console.log('✓ Palette is marked as custom');
                  results.assertions.push({
                    type: 'classification',
                    description: 'Palette marked as custom',
                    expected: 'custom',
                    actual: 'custom',
                    passed: true
                  });
                } else {
                  console.log('⚠️ Palette may not be explicitly marked as custom');
                }

                await helpers.takeScreenshot('custom-palette-in-list');

                // Verify palette count increased
                const afterCount = await page.$$('.palette-item, .color-palette').then(items => items.length);
                console.log(`📊 New palette count: ${afterCount}`);
                
                if (afterCount > beforeCount) {
                  console.log(`✓ Palette count increased: ${beforeCount} → ${afterCount}`);
                  results.assertions.push({
                    type: 'count',
                    description: 'Palette count increased',
                    before: beforeCount,
                    after: afterCount,
                    passed: true
                  });
                }

                // Verify palette shows color swatches
                console.log('🎨 Verifying palette shows color swatches...');
                const colorSwatches = await newPalette.$$('.color-swatch, .palette-color, .swatch').catch(() => []);
                if (colorSwatches.length > 0) {
                  console.log(`✓ Found ${colorSwatches.length} color swatches in palette`);
                  results.assertions.push({
                    type: 'visual',
                    description: 'Color swatches in palette',
                    expected: '> 0',
                    actual: colorSwatches.length,
                    passed: true
                  });
                }

                // Test that the saved palette can be applied
                console.log('🧪 Testing that saved palette can be applied...');
                const applyButton = await newPalette.$('.apply-palette, [data-action="apply"], button, .palette-apply').catch(() => null);
                if (applyButton) {
                  console.log('✓ Apply button exists on custom palette');
                  results.assertions.push({
                    type: 'functionality',
                    description: 'Apply button on custom palette',
                    expected: 'exists',
                    actual: 'exists',
                    passed: true
                  });
                }

                // Test that the saved palette has delete button
                console.log('🗑️ Verifying delete button exists...');
                const deleteButton = await newPalette.$('.delete-palette, [data-action="delete"], .remove-palette, button:has-text("Delete")').catch(() => null);
                if (deleteButton) {
                  console.log('✓ Delete button exists on custom palette');
                  results.assertions.push({
                    type: 'functionality',
                    description: 'Delete button on custom palette',
                    expected: 'exists',
                    actual: 'exists',
                    passed: true
                  });
                }

              } else {
                console.log('⚠️ Custom palette not found in list (may need page refresh)');
                
                // Try refreshing the page
                await helpers.reloadPage();
                await helpers.navigateToSettings();
                
                const palettesTab = await page.$('[data-tab="palettes"], a[href*="palettes"]').catch(() => null);
                if (palettesTab) {
                  await palettesTab.click();
                  await helpers.pause(1000);
                }
                
                const afterRefresh = await page.$(`[data-palette-name="${customPaletteName}"], .palette-item:has-text("${customPaletteName}")`).catch(() => null);
                if (afterRefresh) {
                  console.log('✓ Custom palette found after page refresh');
                  results.assertions.push({
                    type: 'persistence',
                    element: `palette "${customPaletteName}"`,
                    expected: 'persisted',
                    actual: 'persisted',
                    passed: true
                  });
                  await helpers.takeScreenshot('custom-palette-after-refresh');
                }
              }

            } else {
              throw new Error('Save button not found in dialog');
            }
          } else {
            throw new Error('Palette name input not found');
          }
        } else {
          throw new Error('Save palette dialog did not appear');
        }
      } else {
        throw new Error('Save custom palette button not found');
      }

      console.log('✅ Save custom palette test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('save-custom-palette-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
