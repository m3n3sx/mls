/**
 * Admin Bar Colors Test (Simplified)
 */

module.exports = {
  name: 'Admin Bar Colors',
  description: 'Test color settings in Admin Bar tab',
  tab: 'admin-bar',
  tags: ['colors', 'visual', 'smoke', 'live-preview'],
  requirements: ['2.1', '2.2', '2.3', '4.2'],
  estimatedDuration: 15000,

  async execute(page, helpers) {
    const startTime = Date.now();
    const results = {
      passed: true,
      errors: [],
      screenshots: [],
      assertions: []
    };

    try {
      await helpers.navigateToTab('admin-bar');
      await helpers.takeScreenshot('admin-bar-initial');
      await helpers.enableLivePreview();

      // Test colors
      console.log('🎨 Testing background color...');
      await helpers.changeSetting('admin-bar-bg-color', '#FF0000');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('admin-bar-bg-red');

      console.log('✏️ Testing text color...');
      await helpers.changeSetting('admin-bar-text-color', '#FFFFFF');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('admin-bar-text-white');

      console.log('🖱️ Setting hover color...');
      await helpers.changeSetting('admin-bar-hover-color', '#00FF00');
      await helpers.waitForLivePreview();
      await helpers.takeScreenshot('admin-bar-hover-green');

      console.log('✅ Admin Bar colors test completed');

    } catch (error) {
      results.passed = false;
      results.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Test failed:', error.message);
      await helpers.takeScreenshot('admin-bar-colors-failure');
    }

    results.duration = Date.now() - startTime;
    results.screenshots = helpers.getScreenshots();
    results.consoleErrors = helpers.getConsoleErrors();

    return results;
  }
};
