/**
 * Login Page Customization Test
 * 
 * Tests login page customization including:
 * - Custom logo upload and display
 * - Login page background (color, image, gradient)
 * - Login form styling (colors, borders)
 * - Typography customization
 * - Live Preview updates
 * - Persistence after save
 * 
 * Requirements: 2.2
 */

module.exports = {
  // Test metadata
  name: 'Login Page Customization',
  description: 'Test login page color application, logo, and background',
  tab: 'login',
  tags: ['login', 'visual', 'colors', 'branding'],
  requirements: ['2.2'],
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
      // Navigate to Login Page tab
      console.log('📍 Navigating to Login Page tab...');
      await helpers.navigateToTab('login');
      await helpers.takeScreenshot('login-initial');

      // Enable Live Preview
      console.log('🔄 Enabling Live Preview...');
      await helpers.enableLivePreview();
      await helpers.pause(500);

      // Test 1: Login Logo Settings
      console.log('🖼️ Testing login logo settings...');
      
      // Test logo width
      await helpers.changeSetting('login_customization[logo][width]', '200');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('login-logo-width');

      // Verify logo width setting
      const logoWidth = await page.inputValue('[name="login_customization[logo][width]"]');
      helpers.assert.equals(logoWidth, '200', 'Logo width should be set to 200px');
      results.assertions.push({
        type: 'setting',
        field: 'logo_width',
        expected: '200',
        actual: logoWidth,
        passed: true
      });

      // Test logo height
      await helpers.changeSetting('login_customization[logo][height]', '100');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('login-logo-height');

      // Test 2: Login Background Color
      console.log('🎨 Testing login background color...');
      
      // Ensure background type is set to color
      const bgTypeSelector = await page.$('select[name="login_customization[background][type]"]');
      if (bgTypeSelector) {
        await page.selectOption('select[name="login_customization[background][type]"]', 'color');
        await helpers.waitForLivePreview();
      }

      await helpers.changeSetting('login_customization[background][color]', '#1E3A8A');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('login-bg-dark-blue');

      // Verify background color setting
      const bgColor = await page.inputValue('[name="login_customization[background][color]"]');
      helpers.assert.equals(bgColor.toUpperCase(), '#1E3A8A', 'Background color should be dark blue');
      results.assertions.push({
        type: 'color',
        field: 'background_color',
        expected: '#1E3A8A',
        actual: bgColor.toUpperCase(),
        passed: true
      });

      // Test 3: Login Background Gradient
      console.log('🌈 Testing login background gradient...');
      
      // Change to gradient type
      if (bgTypeSelector) {
        await page.selectOption('select[name="login_customization[background][type]"]', 'gradient');
        await helpers.waitForLivePreview();
        await helpers.pause(500);
      }

      // Set gradient colors
      await helpers.changeSetting('login_customization[background][gradient_color1]', '#667EEA');
      await helpers.changeSetting('login_customization[background][gradient_color2]', '#764BA2');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('login-bg-gradient');

      // Verify gradient colors
      const gradientColor1 = await page.inputValue('[name="login_customization[background][gradient_color1]"]');
      helpers.assert.equals(gradientColor1.toUpperCase(), '#667EEA', 'Gradient color 1 should be purple-blue');
      results.assertions.push({
        type: 'color',
        field: 'gradient_color1',
        expected: '#667EEA',
        actual: gradientColor1.toUpperCase(),
        passed: true
      });

      // Test gradient angle
      await helpers.changeSetting('login_customization[background][gradient_angle]', '135');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('login-bg-gradient-angle');

      // Test 4: Login Form Background
      console.log('📋 Testing login form background...');
      await helpers.changeSetting('login_customization[form][bg_color]', '#FFFFFF');
      await helpers.changeSetting('login_customization[form][bg_opacity]', '95');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('login-form-bg');

      // Verify form background color
      const formBgColor = await page.inputValue('[name="login_customization[form][bg_color]"]');
      helpers.assert.equals(formBgColor.toUpperCase(), '#FFFFFF', 'Form background should be white');
      results.assertions.push({
        type: 'color',
        field: 'form_bg_color',
        expected: '#FFFFFF',
        actual: formBgColor.toUpperCase(),
        passed: true
      });

      // Test 5: Login Form Border
      console.log('🔲 Testing login form border...');
      await helpers.changeSetting('login_customization[form][border_color]', '#E5E7EB');
      await helpers.changeSetting('login_customization[form][border_width]', '2');
      await helpers.changeSetting('login_customization[form][border_radius]', '12');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('login-form-border');

      // Verify border settings
      const borderColor = await page.inputValue('[name="login_customization[form][border_color]"]');
      helpers.assert.equals(borderColor.toUpperCase(), '#E5E7EB', 'Form border should be light gray');
      results.assertions.push({
        type: 'color',
        field: 'form_border_color',
        expected: '#E5E7EB',
        actual: borderColor.toUpperCase(),
        passed: true
      });

      // Test 6: Login Form Shadow
      console.log('✨ Testing login form shadow...');
      const shadowSelector = await page.$('select[name="login_customization[form][shadow]"]');
      if (shadowSelector) {
        await page.selectOption('select[name="login_customization[form][shadow]"]', 'large');
        await helpers.waitForLivePreview();
        await helpers.takeScreenshot('login-form-shadow');
      }

      // Test 7: Login Button Styling
      console.log('🔘 Testing login button styling...');
      await helpers.changeSetting('login_customization[button][bg_color]', '#10B981');
      await helpers.changeSetting('login_customization[button][text_color]', '#FFFFFF');
      await helpers.changeSetting('login_customization[button][hover_bg_color]', '#059669');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('login-button-styled');

      // Verify button colors
      const buttonBgColor = await page.inputValue('[name="login_customization[button][bg_color]"]');
      helpers.assert.equals(buttonBgColor.toUpperCase(), '#10B981', 'Button background should be green');
      results.assertions.push({
        type: 'color',
        field: 'button_bg_color',
        expected: '#10B981',
        actual: buttonBgColor.toUpperCase(),
        passed: true
      });

      // Test 8: Login Typography
      console.log('✏️ Testing login typography...');
      await helpers.changeSetting('login_customization[typography][font_family]', 'Inter, sans-serif');
      await helpers.changeSetting('login_customization[typography][label_color]', '#374151');
      await helpers.changeSetting('login_customization[typography][link_color]', '#3B82F6');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('login-typography');

      // Verify typography settings
      const labelColor = await page.inputValue('[name="login_customization[typography][label_color]"]');
      helpers.assert.equals(labelColor.toUpperCase(), '#374151', 'Label color should be dark gray');
      results.assertions.push({
        type: 'color',
        field: 'label_color',
        expected: '#374151',
        actual: labelColor.toUpperCase(),
        passed: true
      });

      // Test 9: Login Link URL
      console.log('🔗 Testing login logo link URL...');
      await helpers.changeSetting('login_customization[logo][link_url]', 'https://example.com');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('login-logo-link');

      // Verify link URL
      const linkUrl = await page.inputValue('[name="login_customization[logo][link_url]"]');
      helpers.assert.equals(linkUrl, 'https://example.com', 'Logo link URL should be set');
      results.assertions.push({
        type: 'setting',
        field: 'logo_link_url',
        expected: 'https://example.com',
        actual: linkUrl,
        passed: true
      });

      // Test 10: Save and verify persistence
      console.log('💾 Saving settings...');
      await helpers.saveSettings();
      await helpers.takeScreenshot('login-saved');

      // Reload page to verify persistence
      console.log('🔄 Reloading page to verify persistence...');
      await helpers.reloadPage();
      await helpers.navigateToSettings();
      await helpers.navigateToTab('login');
      await helpers.takeScreenshot('login-after-reload');

      // Verify background gradient color 1 persisted
      const persistedGradient1 = await page.inputValue('[name="login_customization[background][gradient_color1]"]');
      helpers.assert.equals(persistedGradient1.toUpperCase(), '#667EEA', 'Gradient color 1 should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'gradient_color1',
        expected: '#667EEA',
        actual: persistedGradient1.toUpperCase(),
        passed: true
      });

      // Verify form background color persisted
      const persistedFormBg = await page.inputValue('[name="login_customization[form][bg_color]"]');
      helpers.assert.equals(persistedFormBg.toUpperCase(), '#FFFFFF', 'Form background color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'form_bg_color',
        expected: '#FFFFFF',
        actual: persistedFormBg.toUpperCase(),
        passed: true
      });

      // Verify button background color persisted
      const persistedButtonBg = await page.inputValue('[name="login_customization[button][bg_color]"]');
      helpers.assert.equals(persistedButtonBg.toUpperCase(), '#10B981', 'Button background color should persist after reload');
      results.assertions.push({
        type: 'persistence',
        field: 'button_bg_color',
        expected: '#10B981',
        actual: persistedButtonBg.toUpperCase(),
        passed: true
      });

      console.log('✅ Login Page customization test completed successfully');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      
      // Take failure screenshot
      await helpers.takeScreenshot('login-page-failure');
    }

    // Collect results
    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
