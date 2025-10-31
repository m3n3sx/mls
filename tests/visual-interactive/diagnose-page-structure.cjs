const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
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
    await page.waitForTimeout(3000);
    
    console.log('3. Checking page structure...');
    
    // Check for main form
    const form = await page.$('#mase-settings-form');
    console.log('   Form found:', !!form);
    
    // Check for tabs
    const tabs = await page.$$('.mase-tab');
    console.log('   Tabs found:', tabs.length);
    
    // Get all tab names
    const tabNames = await page.$$eval('.mase-tab', tabs => 
      tabs.map(tab => tab.getAttribute('data-tab'))
    );
    console.log('   Tab names:', tabNames);
    
    // Click on admin-bar tab
    console.log('\n4. Clicking admin-bar tab...');
    await page.click('[data-tab="admin-bar"]');
    await page.waitForTimeout(1000);
    
    // Get all input fields in admin-bar section
    console.log('\n5. Admin Bar fields:');
    const fields = await page.$$eval('#admin-bar-content input, #admin-bar-content select', inputs => 
      inputs.map(input => ({
        type: input.type,
        name: input.name,
        id: input.id,
        value: input.value
      }))
    );
    
    fields.forEach(field => {
      console.log(`   - ${field.name || field.id} (${field.type})`);
    });
    
    // Take screenshot
    await page.screenshot({ path: 'mase-admin-bar-page.png', fullPage: true });
    console.log('\n✅ Screenshot saved: mase-admin-bar-page.png');
    
    // Get HTML of admin-bar section
    const html = await page.$eval('#admin-bar-content', el => el.innerHTML);
    require('fs').writeFileSync('admin-bar-section.html', html);
    console.log('✅ HTML saved: admin-bar-section.html');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
