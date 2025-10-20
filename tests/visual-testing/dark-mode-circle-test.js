/**
 * MASE Dark Mode Circle Bug Test (MASE-DARK-001)
 * 
 * Tests that Dark Mode does not display large circular obstructions.
 * This test verifies the fix for the critical bug where a large gray circle
 * covered the entire screen when Dark Mode was enabled.
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    baseUrl: 'http://localhost/wp-admin/admin.php?page=mase-settings',
    screenshotsDir: path.join(__dirname, 'screenshots'),
    reportsDir: path.join(__dirname, 'reports'),
    viewport: { width: 1920, height: 1080 },
    timeout: 30000,
    maxCircleSize: 100 // Maximum allowed size for circular elements (in pixels)
};

// Ensure directories exist
[CONFIG.screenshotsDir, CONFIG.reportsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

/**
 * Main test function
 */
async function runDarkModeCircleTest() {
    console.log('🌙 Starting Dark Mode Circle Bug Test (MASE-DARK-001)...\n');
    
    const browser = await chromium.launch({ 
        headless: false, 
        slowMo: 50 
    });
    
    const context = await browser.newContext({
        viewport: CONFIG.viewport,
        ignoreHTTPSErrors: true
    });
    
    const page = await context.newPage();
    
    const testResults = {
        timestamp: new Date().toISOString(),
        testName: 'Dark Mode Circle Bug Test',
        bugId: 'MASE-DARK-001',
        status: 'unknown',
        details: [],
        screenshots: []
    };
    
    try {
        // Step 1: Login to WordPress
        console.log('🔐 Logging in to WordPress...');
        await loginToWordPress(page);
        console.log('✓ Logged in successfully\n');
        
        // Step 2: Navigate to MASE settings page
        console.log('📍 Navigating to MASE settings page...');
        await page.goto(CONFIG.baseUrl, { 
            waitUntil: 'domcontentloaded', 
            timeout: CONFIG.timeout 
        });
        await page.waitForTimeout(2000);
        console.log('✓ MASE settings page loaded\n');
        
        // Step 3: Take screenshot in Light Mode (baseline)
        console.log('📸 Taking baseline screenshot (Light Mode)...');
        const lightModeScreenshot = await takeScreenshot(
            page, 
            'light-mode-baseline', 
            'Light Mode - Before Dark Mode Toggle'
        );
        testResults.screenshots.push(lightModeScreenshot);
        console.log('✓ Baseline screenshot captured\n');
        
        // Step 4: Check for circular elements in Light Mode (should be none > 100px)
        console.log('🔍 Checking for large circular elements in Light Mode...');
        const lightModeCircles = await findLargeCircularElements(page);
        console.log(`  Found ${lightModeCircles.length} large circular elements in Light Mode`);
        testResults.details.push({
            phase: 'Light Mode',
            circlesFound: lightModeCircles.length,
            circles: lightModeCircles
        });
        
        // Step 5: Enable Dark Mode
        console.log('\n🌙 Enabling Dark Mode...');
        await enableDarkMode(page);
        await page.waitForTimeout(1000); // Wait for Dark Mode to apply
        console.log('✓ Dark Mode enabled\n');
        
        // Step 6: Take screenshot in Dark Mode
        console.log('📸 Taking Dark Mode screenshot...');
        const darkModeScreenshot = await takeScreenshot(
            page, 
            'dark-mode-active', 
            'Dark Mode - After Toggle'
        );
        testResults.screenshots.push(darkModeScreenshot);
        console.log('✓ Dark Mode screenshot captured\n');
        
        // Step 7: Search for large circular elements in Dark Mode
        console.log('🔍 Searching for large circular elements in Dark Mode...');
        const darkModeCircles = await findLargeCircularElements(page);
        console.log(`  Found ${darkModeCircles.length} large circular elements in Dark Mode`);
        
        if (darkModeCircles.length > 0) {
            console.log('\n⚠️  Large circular elements detected:');
            darkModeCircles.forEach((circle, index) => {
                console.log(`  ${index + 1}. ${circle.width}x${circle.height}px - ${circle.selector}`);
                console.log(`     Position: ${circle.position}, Z-Index: ${circle.zIndex}`);
                console.log(`     Color: ${circle.backgroundColor}`);
            });
        }
        
        testResults.details.push({
            phase: 'Dark Mode',
            circlesFound: darkModeCircles.length,
            circles: darkModeCircles
        });
        
        // Step 8: Test all tabs in Dark Mode
        console.log('\n📋 Testing Dark Mode across all tabs...');
        const tabs = ['general', 'admin-bar', 'menu', 'content', 'typography', 'effects', 'templates', 'advanced'];
        
        for (const tab of tabs) {
            console.log(`  Testing tab: ${tab}...`);
            await page.click(`#tab-button-${tab}`);
            await page.waitForTimeout(500);
            
            const tabCircles = await findLargeCircularElements(page);
            if (tabCircles.length > 0) {
                console.log(`    ⚠️  Found ${tabCircles.length} large circles in ${tab} tab`);
            } else {
                console.log(`    ✓ No large circles in ${tab} tab`);
            }
            
            testResults.details.push({
                phase: `Dark Mode - ${tab} tab`,
                circlesFound: tabCircles.length,
                circles: tabCircles
            });
        }
        
        // Step 9: Take final screenshot
        console.log('\n📸 Taking final verification screenshot...');
        const finalScreenshot = await takeScreenshot(
            page, 
            'dark-mode-final', 
            'Dark Mode - Final Verification'
        );
        testResults.screenshots.push(finalScreenshot);
        console.log('✓ Final screenshot captured\n');
        
        // Step 10: Determine test result
        const totalCirclesInDarkMode = testResults.details
            .filter(d => d.phase.includes('Dark Mode'))
            .reduce((sum, d) => sum + d.circlesFound, 0);
        
        if (totalCirclesInDarkMode === 0) {
            testResults.status = 'PASSED';
            console.log('\n✅ TEST PASSED: No large circular obstructions found in Dark Mode');
        } else {
            testResults.status = 'FAILED';
            console.log(`\n❌ TEST FAILED: Found ${totalCirclesInDarkMode} large circular elements in Dark Mode`);
        }
        
        // Generate report
        await generateReport(testResults);
        
    } catch (error) {
        console.error('\n❌ Test error:', error);
        testResults.status = 'ERROR';
        testResults.error = error.message;
        await generateReport(testResults);
    } finally {
        await context.close();
        await browser.close();
    }
    
    return testResults;
}

/**
 * Login to WordPress admin
 */
async function loginToWordPress(page) {
    try {
        await page.goto('http://localhost/wp-login.php', { 
            waitUntil: 'domcontentloaded',
            timeout: CONFIG.timeout 
        });
        
        await page.waitForSelector('#user_login', { timeout: 10000 });
        await page.fill('#user_login', 'admin');
        await page.fill('#user_pass', 'admin123');
        
        await Promise.all([
            page.waitForNavigation({ 
                waitUntil: 'domcontentloaded', 
                timeout: CONFIG.timeout 
            }),
            page.click('#wp-submit')
        ]);
        
        await page.waitForTimeout(2000);
    } catch (error) {
        console.warn('⚠️  Login may have failed:', error.message);
    }
}

/**
 * Enable Dark Mode via toggle
 */
async function enableDarkMode(page) {
    try {
        // Try header toggle first
        const headerToggle = await page.$('#mase-dark-mode-toggle');
        if (headerToggle) {
            const isChecked = await page.isChecked('#mase-dark-mode-toggle');
            if (!isChecked) {
                await page.click('#mase-dark-mode-toggle', { force: true });
                await page.waitForTimeout(500);
            }
            return;
        }
        
        // Fallback to General tab toggle
        await page.click('#tab-button-general');
        await page.waitForTimeout(500);
        
        const generalToggle = await page.$('#master-dark-mode');
        if (generalToggle) {
            const isChecked = await page.isChecked('#master-dark-mode');
            if (!isChecked) {
                await page.click('#master-dark-mode', { force: true });
                await page.waitForTimeout(500);
            }
        }
    } catch (error) {
        console.error('Failed to enable Dark Mode:', error.message);
        throw error;
    }
}

/**
 * Find all large circular elements (> maxCircleSize)
 * 
 * This function searches for elements with border-radius: 50% that exceed
 * the maximum allowed size. It checks both regular elements and pseudo-elements.
 */
async function findLargeCircularElements(page) {
    return await page.evaluate((maxSize) => {
        const circles = [];
        
        // Check all elements
        document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            const borderRadius = style.borderRadius;
            
            // Check if element has circular border-radius
            if (borderRadius === '50%' || borderRadius.includes('50%')) {
                const width = el.offsetWidth;
                const height = el.offsetHeight;
                
                // Check if size exceeds threshold
                if (width > maxSize || height > maxSize) {
                    circles.push({
                        width,
                        height,
                        selector: el.className ? `.${el.className.split(' ')[0]}` : el.tagName,
                        id: el.id || 'no-id',
                        zIndex: style.zIndex,
                        position: style.position,
                        backgroundColor: style.backgroundColor,
                        display: style.display,
                        visibility: style.visibility
                    });
                }
            }
            
            // Check pseudo-elements (::before and ::after)
            ['::before', '::after'].forEach(pseudo => {
                try {
                    const pseudoStyle = window.getComputedStyle(el, pseudo);
                    const pseudoBorderRadius = pseudoStyle.borderRadius;
                    
                    if (pseudoBorderRadius === '50%' || pseudoBorderRadius.includes('50%')) {
                        const content = pseudoStyle.content;
                        if (content && content !== 'none') {
                            // Pseudo-elements don't have offsetWidth/Height
                            // Use computed width/height instead
                            const width = parseInt(pseudoStyle.width) || 0;
                            const height = parseInt(pseudoStyle.height) || 0;
                            
                            if (width > maxSize || height > maxSize) {
                                circles.push({
                                    width,
                                    height,
                                    selector: `${el.className ? `.${el.className.split(' ')[0]}` : el.tagName}${pseudo}`,
                                    id: `${el.id || 'no-id'}${pseudo}`,
                                    zIndex: pseudoStyle.zIndex,
                                    position: pseudoStyle.position,
                                    backgroundColor: pseudoStyle.backgroundColor,
                                    display: pseudoStyle.display,
                                    visibility: pseudoStyle.visibility
                                });
                            }
                        }
                    }
                } catch (e) {
                    // Pseudo-element doesn't exist or can't be accessed
                }
            });
        });
        
        return circles;
    }, CONFIG.maxCircleSize);
}

/**
 * Take a screenshot
 */
async function takeScreenshot(page, filename, description) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFilename = `dark-mode-test-${filename}-${timestamp}.png`;
    const filepath = path.join(CONFIG.screenshotsDir, fullFilename);
    
    await page.screenshot({ 
        path: filepath, 
        fullPage: true 
    });
    
    console.log(`  ✓ Screenshot saved: ${fullFilename}`);
    
    return {
        filename: fullFilename,
        description,
        timestamp
    };
}

/**
 * Generate HTML report
 */
async function generateReport(testResults) {
    console.log('\n📊 Generating test report...');
    
    const statusColor = testResults.status === 'PASSED' ? '#00a32a' : 
                       testResults.status === 'FAILED' ? '#d63638' : '#dba617';
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MASE Dark Mode Circle Test Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #f5f5f5; 
            padding: 40px; 
        }
        .container { 
            max-width: 1400px; 
            margin: 0 auto; 
            background: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        }
        h1 { color: #2271b1; margin-bottom: 10px; }
        .meta { color: #646970; margin-bottom: 30px; font-size: 14px; }
        .status { 
            display: inline-block;
            padding: 10px 20px; 
            border-radius: 4px; 
            font-weight: bold; 
            font-size: 18px;
            margin: 20px 0;
            background: ${statusColor};
            color: white;
        }
        .section { margin: 30px 0; }
        .section h2 { color: #1d2327; margin-bottom: 15px; }
        .detail-card { 
            background: #f6f7f7; 
            padding: 20px; 
            border-radius: 4px; 
            margin: 10px 0; 
        }
        .detail-card.has-circles { 
            background: #fcf0f1; 
            border-left: 4px solid #d63638; 
        }
        .circle-list { 
            margin: 10px 0; 
            padding-left: 20px; 
        }
        .circle-item { 
            margin: 5px 0; 
            font-family: monospace; 
            font-size: 13px; 
        }
        .screenshots { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); 
            gap: 20px; 
            margin-top: 20px; 
        }
        .screenshot-card { 
            border: 1px solid #dcdcde; 
            border-radius: 8px; 
            overflow: hidden; 
        }
        .screenshot-card img { 
            width: 100%; 
            height: auto; 
            cursor: pointer; 
            transition: transform 0.2s; 
        }
        .screenshot-card img:hover { transform: scale(1.02); }
        .screenshot-title { 
            padding: 15px; 
            background: #f6f7f7; 
            font-size: 14px; 
            font-weight: 600; 
        }
        .modal { 
            display: none; 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0,0,0,0.9); 
            z-index: 1000; 
            align-items: center; 
            justify-content: center; 
        }
        .modal.active { display: flex; }
        .modal img { max-width: 95%; max-height: 95%; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌙 MASE Dark Mode Circle Bug Test</h1>
        <div class="meta">
            <strong>Bug ID:</strong> ${testResults.bugId}<br>
            <strong>Test Name:</strong> ${testResults.testName}<br>
            <strong>Timestamp:</strong> ${new Date(testResults.timestamp).toLocaleString()}<br>
            <strong>Requirements:</strong> 9.1, 9.2, 9.3, 9.4, 9.5
        </div>
        
        <div class="status">${testResults.status}</div>
        
        ${testResults.error ? `
        <div class="section">
            <h2>❌ Error</h2>
            <div class="detail-card has-circles">
                <pre>${testResults.error}</pre>
            </div>
        </div>
        ` : ''}
        
        <div class="section">
            <h2>📋 Test Details</h2>
            ${testResults.details.map(detail => `
                <div class="detail-card ${detail.circlesFound > 0 ? 'has-circles' : ''}">
                    <strong>${detail.phase}</strong><br>
                    Large circular elements found: <strong>${detail.circlesFound}</strong>
                    ${detail.circlesFound > 0 ? `
                        <div class="circle-list">
                            ${detail.circles.map((circle, i) => `
                                <div class="circle-item">
                                    ${i + 1}. ${circle.width}x${circle.height}px - ${circle.selector}
                                    (z-index: ${circle.zIndex}, position: ${circle.position})
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="section">
            <h2>📸 Screenshots</h2>
            <div class="screenshots">
                ${testResults.screenshots.map(screenshot => `
                    <div class="screenshot-card">
                        <img src="../screenshots/${screenshot.filename}" 
                             alt="${screenshot.description}"
                             onclick="showModal(this.src)">
                        <div class="screenshot-title">${screenshot.description}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
    
    <div class="modal" id="modal" onclick="hideModal()">
        <img id="modalImage" src="" alt="Screenshot">
    </div>
    
    <script>
        function showModal(src) {
            document.getElementById('modalImage').src = src;
            document.getElementById('modal').classList.add('active');
        }
        function hideModal() {
            document.getElementById('modal').classList.remove('active');
        }
    </script>
</body>
</html>
    `;
    
    const reportPath = path.join(
        CONFIG.reportsDir, 
        `dark-mode-circle-test-${Date.now()}.html`
    );
    fs.writeFileSync(reportPath, html);
    
    const jsonPath = path.join(
        CONFIG.reportsDir, 
        `dark-mode-circle-test-${Date.now()}.json`
    );
    fs.writeFileSync(jsonPath, JSON.stringify(testResults, null, 2));
    
    console.log(`✓ HTML Report: ${reportPath}`);
    console.log(`✓ JSON Results: ${jsonPath}`);
}

// Run the test
if (require.main === module) {
    runDarkModeCircleTest()
        .then(results => {
            process.exit(results.status === 'PASSED' ? 0 : 1);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { runDarkModeCircleTest };
