const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8080/wp-login.php');
    await page.fill('#user_login', 'admin');
    await page.fill('#user_pass', 'admin');
    await page.click('#wp-submit');
    await page.waitForSelector('#wpadminbar', { timeout: 10000 });
    
    await page.goto('http://localhost:8080/wp-admin/admin.php?page=mase-settings');
    await page.waitForTimeout(2000);
    
    await page.click('[data-tab="admin-bar"]');
    await page.waitForTimeout(1000);
    
    const bgType = await page.$('#admin-bar-bg-type');
    console.log('BG Type found:', !!bgType);
    
    if (bgType) {
      const isVisible = await bgType.isVisible();
      console.log('BG Type visible:', isVisible);
      
      const value = await bgType.inputValue();
      console.log('Current value:', value);
      
      await bgType.selectOption('gradient');
      await page.waitForTimeout(1000);
      
      const newValue = await bgType.inputValue();
      console.log('New value:', newValue);
    }
    
    await page.screenshot({ path: 'bg-type-test.png' });
    console.log('Screenshot saved');
    
    await page.waitForTimeout(10000);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
