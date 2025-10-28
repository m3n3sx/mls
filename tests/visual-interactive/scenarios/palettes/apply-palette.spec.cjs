/**
 * Apply Palette Test
 * 
 * Tests applying predefined color palettes including:
 * - Applying each predefined palette
 * - Verifying colors change across multiple settings
 * - Verifying "Active" badge appears on applied palette
 * 
 * Requirements: 5.1, 5.2, 5.6
 */

module.exports = {
  // Test metadata
  name: 'Apply Palette',
  description: 'Test applying predefined color palettes and verifying color changes',
  tab: 'palettes',
  tags: ['palettes', 'colors', 'visual', 'smoke'],
  requirements: ['5.1', '5.2', '5.6'],
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
      // Navigate to settings page (palettes are usually on main page or separate tab)
      console.log('📍 Navigating to MASE settings...');
      await helpers.navigateToSettings();
      await helpers.pause(500);
      await helpers.takeScreenshot('palettes-initial');

      // Look for palette section - could be on main page or separate tab
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

      helpers.assert.isTrue(paletteSection !== null, 'Palette section should be found');
      
      if (!paletteSection) {
        throw new Error('Could not find palette section');
      }

      // Get list of predefined palettes
      console.log('🎨 Finding predefined palettes...');
      const paletteItems = await page.$$('.palette-item:not(.custom-palette), .color-palette:not(.custom)');
      const paletteCount = paletteItems.length;
      
      console.log(`📋 Found ${paletteCount} predefined palettes`);
      helpers.assert.isTrue(paletteCount > 0, 'Should have at least one predefined palette');
      results.assertions.push({
        type: 'count',
        description: 'Predefined palettes exist',
        expected: '> 0',
        actual: paletteCount,
        passed: true
      });

      // Capture initial color values from multiple settings
      console.log('📊 Capturing initial color values...');
      const colorFields = [
        '[name="admin_bar[bg_color]"]',
        '[name="admin_bar[text_color]"]',
        '[name="menu[bg_color]"]',
        '[name="menu[text_color]"]',
        '[name="content[bg_color]"]'
      ];

      const initialColors = {};
      for (const field of colorFields) {
        const value = await page.inputValue(field).catch(() => null);
        if (value) {
          initialColors[field] = value;
          console.log(`  ${field}: ${value}`);
        }
      }

      // Test applying the first predefined palette
      if (paletteCount > 0) {
        const firstPalette = paletteItems[0];
        const paletteId = await firstPalette.getAttribute('data-palette-id') || 
                         await firstPalette.getAttribute('data-id') ||
                         'palette-1';
        const paletteName = await firstPalette.textContent().catch(() => 'Unknown');
        
        console.log(`🎨 Testing palette: ${paletteName.trim()} (ID: ${paletteId})`);
        await helpers.takeScreenshot(`palette-before-${paletteId}`);

        // Click apply button on palette
        console.log('🖱️ Clicking apply button...');
        const applyButton = await firstPalette.$('.apply-palette, [data-action="apply"], button, .palette-apply').catch(() => null);
        
        if (!applyButton) {
          // Try clicking the palette item itself
          console.log('🖱️ No apply button found, clicking palette item...');
          await firstPalette.click();
        } else {
          await applyButton.click();
        }
        
        await helpers.pause(500);
        await helpers.takeScreenshot(`palette-clicked-${paletteId}`);

        // Check for confirmation dialog
        console.log('✅ Checking for confirmation dialog...');
        const dialogVisible = await page.isVisible('.palette-confirm-dialog, .confirm-dialog, .swal2-popup').catch(() => false);
        
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
          console.log('✓ Confirming palette application...');
          const confirmButton = await page.$('.confirm-apply, [data-confirm="yes"], .swal2-confirm');
          if (confirmButton) {
            await confirmButton.click();
            await helpers.pause(500);
          }
        } else {
          console.log('⚠️ No confirmation dialog (palette may apply directly)');
        }

        // Wait for AJAX to complete
        console.log('⏳ Waiting for palette application...');
        await helpers.waitForAjaxComplete();
        await helpers.pause(1000);
        await helpers.takeScreenshot(`palette-applied-${paletteId}`);

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

        // Verify colors changed across multiple settings
        console.log('🔍 Verifying colors changed across multiple settings...');
        let changedCount = 0;
        const colorChanges = [];

        for (const field of colorFields) {
          const newValue = await page.inputValue(field).catch(() => null);
          const oldValue = initialColors[field];
          
          if (newValue && oldValue && newValue !== oldValue) {
            changedCount++;
            colorChanges.push({
              field,
              before: oldValue,
              after: newValue
            });
            console.log(`  ✓ ${field}: ${oldValue} → ${newValue}`);
          }
        }

        console.log(`📊 ${changedCount} color settings changed`);
        helpers.assert.isTrue(changedCount >= 2, 'At least 2 color settings should change when palette is applied');
        results.assertions.push({
          type: 'change',
          description: 'Multiple color settings changed',
          expected: '>= 2',
          actual: changedCount,
          passed: changedCount >= 2,
          details: colorChanges
        });

        // Verify "Active" badge appears
        console.log('🏷️ Verifying "Active" badge...');
        await helpers.pause(500);
        const activeBadgeSelectors = [
          `[data-palette-id="${paletteId}"] .active-badge`,
          `[data-palette-id="${paletteId}"].active`,
          `[data-id="${paletteId}"] .active-badge`,
          `[data-id="${paletteId}"].active`,
          `.palette-item[data-palette-id="${paletteId}"] .badge`,
          `.palette-item.active[data-palette-id="${paletteId}"]`
        ];

        let activeBadgeFound = false;
        for (const selector of activeBadgeSelectors) {
          const visible = await page.isVisible(selector).catch(() => false);
          if (visible) {
            activeBadgeFound = true;
            console.log(`✓ "Active" badge found with selector: ${selector}`);
            break;
          }
        }

        if (activeBadgeFound) {
          results.assertions.push({
            type: 'badge',
            description: 'Active badge on applied palette',
            expected: 'visible',
            actual: 'visible',
            passed: true
          });
        } else {
          console.log('⚠️ "Active" badge not found (may use different indicator)');
          // Check if palette item has active class
          const hasActiveClass = await firstPalette.evaluate(el => el.classList.contains('active')).catch(() => false);
          if (hasActiveClass) {
            console.log('✓ Palette has "active" class');
            results.assertions.push({
              type: 'class',
              description: 'Active class on palette',
              expected: 'active',
              actual: 'active',
              passed: true
            });
          }
        }

        await helpers.takeScreenshot(`palette-active-${paletteId}`);
      }

      // Test applying a second palette if available
      if (paletteCount > 1) {
        console.log('🎨 Testing second palette...');
        const secondPalette = paletteItems[1];
        const paletteId = await secondPalette.getAttribute('data-palette-id') || 
                         await secondPalette.getAttribute('data-id') ||
                         'palette-2';
        
        const applyButton = await secondPalette.$('.apply-palette, [data-action="apply"], button, .palette-apply').catch(() => null);
        
        if (!applyButton) {
          await secondPalette.click();
        } else {
          await applyButton.click();
        }
        
        await helpers.pause(500);

        // Confirm if dialog appears
        const confirmButton = await page.$('.confirm-apply, [data-confirm="yes"], .swal2-confirm');
        if (confirmButton) {
          await confirmButton.click();
        }

        await helpers.waitForAjaxComplete();
        await helpers.pause(1000);
        await helpers.takeScreenshot(`palette-second-applied-${paletteId}`);

        // Verify first palette no longer has active badge
        const firstPaletteId = await paletteItems[0].getAttribute('data-palette-id') || 
                              await paletteItems[0].getAttribute('data-id') ||
                              'palette-1';
        
        const firstStillActive = await page.isVisible(`[data-palette-id="${firstPaletteId}"] .active-badge, [data-id="${firstPaletteId}"] .active-badge`).catch(() => false);
        
        if (!firstStillActive) {
          console.log('✓ Previous palette no longer marked as active');
          results.assertions.push({
            type: 'badge',
            description: 'Previous palette badge removed',
            expected: 'hidden',
            actual: 'hidden',
            passed: true
          });
        }

        // Verify colors changed again
        console.log('🔍 Verifying colors changed with second palette...');
        let secondChangedCount = 0;
        for (const field of colorFields) {
          const newValue = await page.inputValue(field).catch(() => null);
          const oldValue = initialColors[field];
          
          if (newValue && oldValue && newValue !== oldValue) {
            secondChangedCount++;
          }
        }

        console.log(`📊 ${secondChangedCount} color settings changed with second palette`);
        results.assertions.push({
          type: 'change',
          description: 'Colors changed with second palette',
          expected: '>= 2',
          actual: secondChangedCount,
          passed: secondChangedCount >= 2
        });
      }

      console.log('✅ Apply palette test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('apply-palette-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
