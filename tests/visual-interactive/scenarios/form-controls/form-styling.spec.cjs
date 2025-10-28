/**
 * Form Controls Styling Test
 * 
 * Tests form control customization including:
 * - Text input field styling (colors, borders, typography)
 * - Select dropdown styling
 * - Checkbox and radio button styling
 * - Focus states and interactive effects
 * - Live Preview updates
 * - Persistence after save
 * 
 * Requirements: 2.2
 */

module.exports = {
  // Test metadata
  name: 'Form Controls Styling',
  description: 'Test input field, select dropdown, and checkbox/radio styling',
  tab: 'form-controls',
  tags: ['form-controls', 'visual', 'colors', 'interactive'],
  requirements: ['2.2'],
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
      // Navigate to Form Controls tab
      console.log('📍 Navigating to Form Controls tab...');
      await helpers.navigateToTab('form-controls');
      await helpers.takeScreenshot('form-controls-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Text Input Background Color
      console.log('🎨 Testing text input background color...');
      
      // Ensure text inputs section is active (should be default)
      const textInputsButton = await page.$('button[data-control-target="text_inputs"]');
      if (textInputsButton) {
        await textInputsButton.click();
        await helpers.pause(300);
        await helpers.takeScreenshot('form-controls-text-inputs-section');
      }

      // Change text input background color
      await helpers.changeSetting('form_controls[text_inputs][bg_color]', '#FFFACD');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('form-controls-input-bg-lemon');

      // Verify background color applied to text inputs
      const inputExists = await page.$('input[type="text"]');
      if (inputExists) {
        const inputBg = await helpers.getComputedStyle('input[type="text"]', 'background-color');
        const inputBgMatch = helpers.normalizeColor(inputBg);
        helpers.assert.contains(inputBgMatch, '255,250,205', 'Input background should be lemon chiffon (255,250,205)');
        results.assertions.push({
          type: 'color',
          property: 'input-background-color',
          expected: '255,250,205',
          actual: inputBgMatch,
          passed: true
        });
      }

      // Test 2: Text Input Border Styling
      console.log('🔲 Testing text input border styling...');
      await helpers.changeSetting('form_controls[text_inputs][border_color]', '#FF6347');
      await helpers.changeSetting('form_controls[text_inputs][border_width]', '2');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('form-controls-input-border');

      if (inputExists) {
        const borderColor = await helpers.getComputedStyle('input[type="text"]', 'border-color');
        const borderColorMatch = helpers.normalizeColor(borderColor);
        helpers.assert.contains(borderColorMatch, '255,99,71', 'Border color should be tomato (255,99,71)');
        results.assertions.push({
          type: 'color',
          property: 'input-border-color',
          expected: '255,99,71',
          actual: borderColorMatch,
          passed: true
        });
      }

      // Test 3: Text Input Typography
      console.log('✏️ Testing text input typography...');
      await helpers.changeSetting('form_controls[text_inputs][font_size]', '14');
      await helpers.changeSetting('form_controls[text_inputs][text_color]', '#2C3E50');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('form-controls-input-typography');

      if (inputExists) {
        const fontSize = await helpers.getComputedStyle('input[type="text"]', 'font-size');
        helpers.assert.contains(fontSize, '14px', 'Input font size should be 14px');
        results.assertions.push({
          type: 'typography',
          property: 'font-size',
          expected: '14px',
          actual: fontSize,
          passed: true
        });
      }

      // Test 4: Text Input Focus State
      console.log('🎯 Testing text input focus state...');
      await helpers.changeSetting('form_controls[text_inputs][focus_border_color]', '#3498DB');
      await helpers.changeSetting('form_controls[text_inputs][focus_shadow]', 'medium');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('form-controls-input-focus-settings');

      // Focus on an input to trigger focus state
      if (inputExists) {
        await page.focus('input[type="text"]');
        await helpers.pause(500);
        await helpers.takeScreenshot('form-controls-input-focused');
        
        const focusBorderColor = await helpers.getComputedStyle('input[type="text"]:focus', 'border-color');
        const focusBorderMatch = helpers.normalizeColor(focusBorderColor);
        helpers.assert.contains(focusBorderMatch, '52,152,219', 'Focus border should be blue (52,152,219)');
        results.assertions.push({
          type: 'color',
          property: 'focus-border-color',
          expected: '52,152,219',
          actual: focusBorderMatch,
          passed: true
        });
      }

      // Test 5: Select Dropdown Styling
      console.log('📋 Testing select dropdown styling...');
      
      // Click on Selects section
      const selectsButton = await page.$('button[data-control-target="selects"]');
      if (selectsButton) {
        await selectsButton.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('form-controls-selects-section');
      }

      await helpers.changeSetting('form_controls[selects][bg_color]', '#E8F5E9');
      await helpers.changeSetting('form_controls[selects][border_color]', '#4CAF50');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('form-controls-select-styled');

      // Verify select styling
      const selectExists = await page.$('select');
      if (selectExists) {
        const selectBg = await helpers.getComputedStyle('select', 'background-color');
        const selectBgMatch = helpers.normalizeColor(selectBg);
        helpers.assert.contains(selectBgMatch, '232,245,233', 'Select background should be light green (232,245,233)');
        results.assertions.push({
          type: 'color',
          property: 'select-background-color',
          expected: '232,245,233',
          actual: selectBgMatch,
          passed: true
        });
      }

      // Test 6: Checkbox Styling
      console.log('☑️ Testing checkbox styling...');
      
      // Click on Checkboxes section
      const checkboxesButton = await page.$('button[data-control-target="checkboxes"]');
      if (checkboxesButton) {
        await checkboxesButton.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('form-controls-checkboxes-section');
      }

      await helpers.changeSetting('form_controls[checkboxes][checked_bg_color]', '#9C27B0');
      await helpers.changeSetting('form_controls[checkboxes][border_color]', '#7B1FA2');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('form-controls-checkbox-styled');

      // Verify checkbox styling (if checkboxes exist on page)
      const checkboxExists = await page.$('input[type="checkbox"]');
      if (checkboxExists) {
        const checkboxBorder = await helpers.getComputedStyle('input[type="checkbox"]', 'border-color');
        const checkboxBorderMatch = helpers.normalizeColor(checkboxBorder);
        helpers.assert.contains(checkboxBorderMatch, '123,31,162', 'Checkbox border should be purple (123,31,162)');
        results.assertions.push({
          type: 'color',
          property: 'checkbox-border-color',
          expected: '123,31,162',
          actual: checkboxBorderMatch,
          passed: true
        });
      }

      // Test 7: Radio Button Styling
      console.log('🔘 Testing radio button styling...');
      
      // Click on Radios section
      const radiosButton = await page.$('button[data-control-target="radios"]');
      if (radiosButton) {
        await radiosButton.click();
        await helpers.pause(500);
        await helpers.takeScreenshot('form-controls-radios-section');
      }

      await helpers.changeSetting('form_controls[radios][checked_bg_color]', '#FF9800');
      await helpers.changeSetting('form_controls[radios][border_color]', '#F57C00');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('form-controls-radio-styled');

      // Verify radio button styling (if radio buttons exist on page)
      const radioExists = await page.$('input[type="radio"]');
      if (radioExists) {
        const radioBorder = await helpers.getComputedStyle('input[type="radio"]', 'border-color');
        const radioBorderMatch = helpers.normalizeColor(radioBorder);
        helpers.assert.contains(radioBorderMatch, '245,124,0', 'Radio border should be orange (245,124,0)');
        results.assertions.push({
          type: 'color',
          property: 'radio-border-color',
          expected: '245,124,0',
          actual: radioBorderMatch,
          passed: true
        });
      }

      // Test 8: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('form-controls-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('form-controls');
      await helpers.takeScreenshot('form-controls-after-reload');

      // Verify text input background color persisted
      const persistedInputBg = await page.inputValue('[name="form_controls[text_inputs][bg_color]"]');
      helpers.assert.equals(persistedInputBg.toUpperCase(), '#FFFACD', 'Input background color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'text_inputs_bg_color',
        expected: '#FFFACD',
        actual: persistedInputBg.toUpperCase(),
        passed: true
      });

      // Verify select background color persisted
      const selectsButton2 = await page.$('button[data-control-target="selects"]');
      if (selectsButton2) {
        await selectsButton2.click();
        await helpers.pause(300);
      }
      
      const persistedSelectBg = await page.inputValue('[name="form_controls[selects][bg_color]"]');
      helpers.assert.equals(persistedSelectBg.toUpperCase(), '#E8F5E9', 'Select background color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'selects_bg_color',
        expected: '#E8F5E9',
        actual: persistedSelectBg.toUpperCase(),
        passed: true
      });

      console.log('✅ Form Controls styling test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('form-controls-styling-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
