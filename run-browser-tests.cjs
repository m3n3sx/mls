/**
 * Automated Browser Test Runner
 * Runs tests using Puppeteer to simulate browser console execution
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function runBrowserTests() {
    console.log('🚀 Starting Browser Tests...\n');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Capture console output
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push({
            type: msg.type(),
            text: msg.text()
        });
    });
    
    try {
        // Login to WordPress
        console.log('📝 Logging in to WordPress...');
        await page.goto('http://localhost:8080/wp-login.php');
        await page.type('#user_login', 'admin');
        await page.type('#user_pass', 'admin');
        await page.click('#wp-submit');
        await page.waitForNavigation();
        
        // Navigate to MASE settings
        console.log('📍 Navigating to MASE settings...');
        await page.goto('http://localhost:8080/wp-admin/admin.php?page=mase-settings');
        await page.waitForSelector('.mase-settings-wrap', { timeout: 10000 });
        
        // Load test script
        console.log('🔧 Loading test script...');
        const testScript = fs.readFileSync('tests/simple-browser-tests.js', 'utf8');
        await page.evaluate(testScript);
        
        // Run tests
        console.log('▶️  Running tests...\n');
        const results = await page.evaluate(() => {
            return new Promise((resolve) => {
                window.MASETests.runAll().then(() => {
                    resolve(window.MASETests.results);
                });
            });
        });
        
        // Print results
        console.log('='.repeat(60));
        console.log('📊 BROWSER TEST RESULTS');
        console.log('='.repeat(60));
        console.log(`Total Tests: ${results.total}`);
        console.log(`✅ Passed: ${results.passed}`);
        console.log(`❌ Failed: ${results.failed}`);
        console.log(`Pass Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
        console.log('='.repeat(60));
        
        if (results.failed > 0) {
            console.log('\n❌ Failed Tests:');
            results.details
                .filter(t => t.status === 'FAIL')
                .forEach(t => console.log(`  - ${t.name}: ${t.error}`));
        }
        
        // Save results
        fs.writeFileSync(
            'test-results/browser-tests-results.json',
            JSON.stringify(results, null, 2)
        );
        
        console.log('\n✅ Results saved to test-results/browser-tests-results.json');
        
        return results;
        
    } catch (error) {
        console.error('❌ Error running tests:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run if called directly
if (require.main === module) {
    runBrowserTests()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = { runBrowserTests };
