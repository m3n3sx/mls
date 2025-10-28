const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('1. Logging in...');
    await page.goto('http://localhost:8080/wp-login.php');
    await page.fill('#user_login', 'admin');
    await page.fill('#user_pass', 'admin');
    await page.click('#wp-submit');
    await page.waitForSelector('#wpadminbar', { timeout: 10000 });
    
    console.log('2. Navigating to MASE settings...');
    await page.goto('http://localhost:8080/wp-admin/admin.php?page=mase-settings');
    await page.waitForTimeout(2000);
    
    console.log('3. Clicking Content tab...');
    await page.click('[data-tab="content"]');
    await page.waitForTimeout(2000);
    
    console.log('4. Checking Content tab content...');
    const contentTabVisible = await page.isVisible('#tab-content');
    console.log('   Content tab visible:', contentTabVisible);
    
    const contentHTML = await page.$eval('#tab-content', el => el.innerHTML);
    console.log('   Content HTML length:', contentHTML.length);
    console.log('   Content preview:', contentHTML.substring(0, 500));
    
    // Check for specific elements
    const hasFontFamily = await page.$('#content_font_family');
    const hasFontSize = await page.$('#content_font_size');
    const hasTextColor = await page.$('#content_text_color');
    
    console.log('   Has font family select:', !!hasFontFamily);
    console.log('   Has font size input:', !!hasFontSize);
    console.log('   Has text color input:', !!hasTextColor);
    
    await page.screenshot({ path: 'content-tab-screenshot.png', fullPage: true });
    console.log('\n✅ Screenshot saved: content-tab-screenshot.png');
    
    console.log('\nPress Ctrl+C to close...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
