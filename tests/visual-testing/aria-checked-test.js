/**
 * MASE aria-checked Synchronization Test (MASE-ACC-001)
 * 
 * Tests that toggle controls properly synchronize their aria-checked attribute
 * with their checked state for screen reader accessibility.
 * This test verifies the fix for the accessibility bug where aria-checked
 * was not updated when toggles were clicked.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
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
    timeout: 30000
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
async function runAriaCheckedTest() {
    console.log('♿ Starting aria-checked Synchronization Test (MASE-ACC-001)...\n');
    
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
        testName: 'aria-checked Synchronization Test',
        bugId: 'MASE-ACC-001',
        status: 'unknown',
        toggleTests: [],
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
        
        // Step 3: Take baseline screenshot
        console.log('📸 Taking baseline screenshot...');
        const baselineScreenshot = await takeScreenshot(
            page, 
            'baseline', 
            'Initial Page State'
        );
        testResults.screenshots.push(baselineScreenshot);
        console.log('✓ Baseline screenshot captured\n');
        
        // Step 4: Test Live Preview Toggle
        console.log('🔄 Testing Live Preview Toggle...');
        const livePreviewResult = await testToggleAriaChecked(
            page,
            '#mase-live-preview-toggle',
            'Live Preview Toggle'
        );
        testResults.toggleTests.push(livePreviewResult);
        
        if (livePreviewResult.passed) {
            console.log('✅ Live Preview toggle aria-checked synchronization: PASSED\n');
        } else {
            console.log('❌ Live Preview toggle aria-checked synchronization: FAILED\n');
            console.log(`   Failures: ${livePreviewResult.failures.join(', ')}\n`);
        }
        
        // Step 5: Test Dark Mode Toggle (header)
        console.log('🌙 Testing Dark Mode Toggle (header)...');
        const darkModeHeaderResult = await testToggleAriaChecked(
            page,
            '#mase-dark-mode-toggle',
            'Dark Mode Toggle (Header)'
        );
        testResults.toggleTests.push(darkModeHeaderResult);
        
        if (darkModeHeaderResult.passed) {
            console.log('✅ Dark Mode header toggle aria-checked synchronization: PASSED\n');
        } else {
            console.log('❌ Dark Mode header toggle aria-checked synchronization: FAILED\n');
            console.log(`   Failures: ${darkModeHeaderResult.failures.join(', ')}\n`);
        }
        
        // Step 6: Test Dark Mode Toggle (General tab)
        console.log('🌙 Testing Dark Mode Toggle (General tab)...');
        await page.click('#tab-button-general');
        await page.waitForTimeout(500);
        
        const darkModeGeneralResult = await testToggleAriaChecked(
            page,
            '#master-dark-mode',
            'Dark Mode Toggle (General Tab)'
        );
        testResults.toggleTests.push(darkModeGeneralResult);
        
        if (darkModeGeneralResult.passed) {
            console.log('✅ Dark Mode General tab toggle aria-checked synchronization: PASSED\n');
        } else {
            console.log('❌ Dark Mode General tab toggle aria-checked synchronization: FAILED\n');
            console.log(`   Failures: ${darkModeGeneralResult.failures.join(', ')}\n`);
        }
        
        // Step 7: Take final screenshot
        console.log('📸 Taking final verification screenshot...');
        const finalScreenshot = await takeScreenshot(
            page, 
            'final', 
            'Final Verification'
        );
        testResults.screenshots.push(finalScreenshot);
        console.log('✓ Final screenshot captured\n');
        
        // Step 8: Determine overall test result
        const allPassed = testResults.toggleTests.every(test => test.passed);
        const totalTests = testResults.toggleTests.length;
        const passedTests = testResults.toggleTests.filter(test => test.passed).length;
        
        if (allPassed) {
            testResults.status = 'PASSED';
            console.log(`\n✅ TEST PASSED: All ${totalTests} toggle tests passed`);
        } else {
            testResults.status = 'FAILED';
            console.log(`\n❌ TEST FAILED: ${passedTests}/${totalTests} toggle tests passed`);
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
 * Test a toggle's aria-checked synchronization
 * 
 * This function tests that when a toggle is clicked:
 * 1. The checked property changes
 * 2. The aria-checked attribute synchronizes with the checked property
 * 3. Both values match (true/false as strings for aria-checked)
 * 
 * @param {Page} page - Playwright page object
 * @param {string} selector - Toggle selector
 * @param {string} name - Toggle name for reporting
 * @returns {Object} Test result object
 */
async function testToggleAriaChecked(page, selector, name) {
    const result = {
        name,
        selector,
        passed: true,
        failures: [],
        states: []
    };
    
    try {
        // Check if toggle exists
        const toggleExists = await page.$(selector);
        if (!toggleExists) {
            result.passed = false;
            result.failures.push('Toggle element not found');
            console.log(`  ⚠️  Toggle ${selector} not found`);
            return result;
        }
        
        console.log(`  Testing toggle: ${selector}`);
        
        // Get initial state
        const initialState = await getToggleState(page, selector);
        result.states.push({
            phase: 'Initial',
            ...initialState
        });
        
        console.log(`  Initial state: checked=${initialState.checked}, aria-checked="${initialState.ariaChecked}"`);
        
        // Verify initial state synchronization
        if (!verifyStateSynchronization(initialState)) {
            result.passed = false;
            result.failures.push('Initial state not synchronized');
            console.log(`  ❌ Initial state mismatch`);
        } else {
            console.log(`  ✓ Initial state synchronized`);
        }
        
        // Click to toggle OFF (if currently ON)
        if (initialState.checked) {
            console.log(`  Clicking to toggle OFF...`);
            await page.click(selector, { force: true });
            await page.waitForTimeout(500);
            
            const offState = await getToggleState(page, selector);
            result.states.push({
                phase: 'After Toggle OFF',
                ...offState
            });
            
            console.log(`  After toggle OFF: checked=${offState.checked}, aria-checked="${offState.ariaChecked}"`);
            
            // Verify OFF state
            if (offState.checked !== false) {
                result.passed = false;
                result.failures.push('Toggle did not turn OFF');
                console.log(`  ❌ Toggle did not turn OFF`);
            } else if (offState.ariaChecked !== 'false') {
                result.passed = false;
                result.failures.push('aria-checked not "false" when unchecked');
                console.log(`  ❌ aria-checked should be "false", got "${offState.ariaChecked}"`);
            } else {
                console.log(`  ✓ Toggle OFF state synchronized`);
            }
        }
        
        // Click to toggle ON
        console.log(`  Clicking to toggle ON...`);
        await page.click(selector, { force: true });
        await page.waitForTimeout(500);
        
        const onState = await getToggleState(page, selector);
        result.states.push({
            phase: 'After Toggle ON',
            ...onState
        });
        
        console.log(`  After toggle ON: checked=${onState.checked}, aria-checked="${onState.ariaChecked}"`);
        
        // Verify ON state
        if (onState.checked !== true) {
            result.passed = false;
            result.failures.push('Toggle did not turn ON');
            console.log(`  ❌ Toggle did not turn ON`);
        } else if (onState.ariaChecked !== 'true') {
            result.passed = false;
            result.failures.push('aria-checked not "true" when checked');
            console.log(`  ❌ aria-checked should be "true", got "${onState.ariaChecked}"`);
        } else {
            console.log(`  ✓ Toggle ON state synchronized`);
        }
        
        // Click to toggle OFF again
        console.log(`  Clicking to toggle OFF again...`);
        await page.click(selector, { force: true });
        await page.waitForTimeout(500);
        
        const offAgainState = await getToggleState(page, selector);
        result.states.push({
            phase: 'After Toggle OFF Again',
            ...offAgainState
        });
        
        console.log(`  After toggle OFF again: checked=${offAgainState.checked}, aria-checked="${offAgainState.ariaChecked}"`);
        
        // Verify OFF state again
        if (offAgainState.checked !== false) {
            result.passed = false;
            result.failures.push('Toggle did not turn OFF on second click');
            console.log(`  ❌ Toggle did not turn OFF on second click`);
        } else if (offAgainState.ariaChecked !== 'false') {
            result.passed = false;
            result.failures.push('aria-checked not "false" on second OFF');
            console.log(`  ❌ aria-checked should be "false", got "${offAgainState.ariaChecked}"`);
        } else {
            console.log(`  ✓ Toggle OFF state synchronized on second click`);
        }
        
        // Take screenshot of this toggle's final state
        const screenshotName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await takeScreenshot(page, screenshotName, `${name} - Final State`);
        
    } catch (error) {
        result.passed = false;
        result.failures.push(`Error: ${error.message}`);
        console.log(`  ❌ Error testing toggle: ${error.message}`);
    }
    
    return result;
}

/**
 * Get the current state of a toggle
 * 
 * @param {Page} page - Playwright page object
 * @param {string} selector - Toggle selector
 * @returns {Object} State object with checked and ariaChecked properties
 */
async function getToggleState(page, selector) {
    return await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        if (!element) {
            return { checked: null, ariaChecked: null };
        }
        
        return {
            checked: element.checked,
            ariaChecked: element.getAttribute('aria-checked')
        };
    }, selector);
}

/**
 * Verify that checked and aria-checked are synchronized
 * 
 * @param {Object} state - State object from getToggleState
 * @returns {boolean} True if synchronized, false otherwise
 */
function verifyStateSynchronization(state) {
    if (state.checked === null || state.ariaChecked === null) {
        return false;
    }
    
    // aria-checked should be string "true" or "false"
    const expectedAriaChecked = state.checked ? 'true' : 'false';
    return state.ariaChecked === expectedAriaChecked;
}

/**
 * Take a screenshot
 */
async function takeScreenshot(page, filename, description) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFilename = `aria-checked-test-${filename}-${timestamp}.png`;
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
    <title>MASE aria-checked Synchronization Test Report</title>
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
        .toggle-card { 
            background: #f6f7f7; 
            padding: 20px; 
            border-radius: 4px; 
            margin: 15px 0; 
        }
        .toggle-card.failed { 
            background: #fcf0f1; 
            border-left: 4px solid #d63638; 
        }
        .toggle-card.passed { 
            background: #edfaef; 
            border-left: 4px solid #00a32a; 
        }
        .toggle-header { 
            font-size: 16px; 
            font-weight: 600; 
            margin-bottom: 10px; 
        }
        .toggle-selector { 
            font-family: monospace; 
            font-size: 13px; 
            color: #646970; 
            margin-bottom: 15px; 
        }
        .state-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 10px 0; 
        }
        .state-table th, .state-table td { 
            padding: 8px; 
            text-align: left; 
            border-bottom: 1px solid #dcdcde; 
        }
        .state-table th { 
            background: #f0f0f1; 
            font-weight: 600; 
        }
        .state-table td { 
            font-family: monospace; 
            font-size: 13px; 
        }
        .failure-list { 
            margin: 10px 0; 
            padding-left: 20px; 
            color: #d63638; 
        }
        .failure-list li { 
            margin: 5px 0; 
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
        .badge { 
            display: inline-block; 
            padding: 4px 8px; 
            border-radius: 3px; 
            font-size: 12px; 
            font-weight: 600; 
            margin-left: 10px; 
        }
        .badge.passed { background: #00a32a; color: white; }
        .badge.failed { background: #d63638; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <h1>♿ MASE aria-checked Synchronization Test</h1>
        <div class="meta">
            <strong>Bug ID:</strong> ${testResults.bugId}<br>
            <strong>Test Name:</strong> ${testResults.testName}<br>
            <strong>Timestamp:</strong> ${new Date(testResults.timestamp).toLocaleString()}<br>
            <strong>Requirements:</strong> 10.1, 10.2, 10.3, 10.4, 10.5
        </div>
        
        <div class="status">${testResults.status}</div>
        
        ${testResults.error ? `
        <div class="section">
            <h2>❌ Error</h2>
            <div class="toggle-card failed">
                <pre>${testResults.error}</pre>
            </div>
        </div>
        ` : ''}
        
        <div class="section">
            <h2>🔄 Toggle Tests</h2>
            ${testResults.toggleTests.map(test => `
                <div class="toggle-card ${test.passed ? 'passed' : 'failed'}">
                    <div class="toggle-header">
                        ${test.name}
                        <span class="badge ${test.passed ? 'passed' : 'failed'}">
                            ${test.passed ? 'PASSED' : 'FAILED'}
                        </span>
                    </div>
                    <div class="toggle-selector">${test.selector}</div>
                    
                    ${test.failures.length > 0 ? `
                        <ul class="failure-list">
                            ${test.failures.map(failure => `<li>${failure}</li>`).join('')}
                        </ul>
                    ` : ''}
                    
                    ${test.states.length > 0 ? `
                        <table class="state-table">
                            <thead>
                                <tr>
                                    <th>Phase</th>
                                    <th>checked</th>
                                    <th>aria-checked</th>
                                    <th>Synchronized</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${test.states.map(state => {
                                    const isSynced = state.checked !== null && 
                                                   state.ariaChecked === (state.checked ? 'true' : 'false');
                                    return `
                                        <tr>
                                            <td>${state.phase}</td>
                                            <td>${state.checked}</td>
                                            <td>"${state.ariaChecked}"</td>
                                            <td>${isSynced ? '✓' : '✗'}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
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
        `aria-checked-test-${Date.now()}.html`
    );
    fs.writeFileSync(reportPath, html);
    
    const jsonPath = path.join(
        CONFIG.reportsDir, 
        `aria-checked-test-${Date.now()}.json`
    );
    fs.writeFileSync(jsonPath, JSON.stringify(testResults, null, 2));
    
    console.log(`✓ HTML Report: ${reportPath}`);
    console.log(`✓ JSON Results: ${jsonPath}`);
}

// Run the test
if (require.main === module) {
    runAriaCheckedTest()
        .then(results => {
            process.exit(results.status === 'PASSED' ? 0 : 1);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { runAriaCheckedTest };
