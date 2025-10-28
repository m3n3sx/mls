const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('1. Navigating to login page...');
    await page.goto('http://localhost:8080/wp-login.php');
    await page.waitForTimeout(2000);
    
    console.log('2. Taking screenshot of login page...');
    await page.screenshot({ path: 'login-page.png' });
    
    console.log('3. Filling credentials...');
    await page.fill('#user_login', 'admin');
    await page.fill('#user_pass', 'admin');
    await page.waitForTimeout(1000);
    
    console.log('4. Taking screenshot before submit...');
    await page.screenshot({ path: 'before-submit.png' });
    
    console.log('5. Clicking submit...');
    await page.click('#wp-submit');
    
    console.log('6. Waiting 10 seconds...');
    await page.waitForTimeout(10000);
    
    console.log('7. Current URL:', page.url());
    
    console.log('8. Taking screenshot after submit...');
    await page.screenshot({ path: 'after-submit.png' });
    
    const adminBar = await page.$('#wpadminbar');
    console.log('9. Admin bar found:', !!adminBar);
    
    const errorDiv = await page.$('#login_error');
    if (errorDiv) {
      const errorText = await errorDiv.textContent();
      console.log('10. Login error:', errorText);
    }
    
    const bodyText = await page.textContent('body');
    if (bodyText.includes('ERROR') || bodyText.includes('Error')) {
      console.log('11. Page contains error text');
    }
    
    console.log('\n✅ Diagnostic complete. Check screenshots:');
    console.log('   - login-page.png');
    console.log('   - before-submit.png');
    console.log('   - after-submit.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\nPress Ctrl+C to close browser...');
  await page.waitForTimeout(30000);
  await browser.close();
})();
