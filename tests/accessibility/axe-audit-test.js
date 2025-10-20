/**
 * MASE Accessibility Audit Test using axe-core
 * 
 * Tests MASE settings page for WCAG 2.1 Level AA compliance using axe-core.
 * Verifies 0 accessibility violations in both Light and Dark modes.
 * 
 * Requirements: 10.3, 10.4
 * 
 * Bug Fixes Verified:
 * - MASE-ACC-001: Live Preview Toggle aria-checked synchronization
 * - MASE-DARK-001: Dark Mode visual accessibility
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    baseUrl: 'http://localhost/wp-admin/admin.php?page=mase-settings',
    reportsDir: path.join(__dirname, 'reports'),
    viewport: { width: 1920, height: 1080 },
    timeout: 30000,
    axeCoreVersion: '4.8.2' // Latest stable version
};

// Ensure directories exist
if (!fs.existsSync(CONFIG.reportsDir)) {
    fs.mkdirSync(CONFIG.reportsDir, { recursive: true });
}

/**
 * Inject axe-core into the page
 */
async function injectAxeCore(page) {
    // Inject axe-core from CDN
    await page.addScriptTag({
        url: `https://cdnjs.cloudflare.com/ajax/libs/axe-core/${CONFIG.axeCoreVersion}/axe.min.js`
    });
    
    // Wait for axe to be available
    await page.waitForFunction(() => typeof window.axe !== 'undefined');
}

/**
 * Run axe-core accessibility audit
 */
async function runAxeAudit(page, context = 'page') {
    const results = await page.evaluate(() => {
        return window.axe.run({
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
            }
        });
    });
    
    return {
        context,
        violations: results.violations,
        passes: results.passes,
        incomplete: results.incomplete,
        inapplicable: results.inapplicable,
        timestamp: results.timestamp,
        url: results.url
    };
}

/**
 * Main test function
 */
async function runAccessibilityAudit() {
    console.log('♿ Starting MASE Accessibility Audit Test...\n');
    
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
        testName: 'MASE Accessibility Audit',
        requirements: ['10.3', '10.4'],
        bugsFixes: ['MASE-ACC-001', 'MASE-DARK-001'],
        status: 'unknown',
        audits: [],
        summary: {
            totalViolations: 0,
            criticalViolations: 0,
            seriousViolations: 0,
            moderateViolations: 0,
            minorViolations: 0
        }
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
        
        // Step 3: Inject axe-core
        console.log('💉 Injecting axe-core library...');
        await injectAxeCore(page);
        console.log('✓ axe-core injected successfully\n');
        
        // Step 4: Run audit in Light Mode
        console.log('🔍 Running accessibility audit in Light Mode...');
        const lightModeAudit = await runAxeAudit(page, 'Light Mode');
        testResults.audits.push(lightModeAudit);
        
        console.log(`  Violations: ${lightModeAudit.violations.length}`);
        console.log(`  Passes: ${lightModeAudit.passes.length}`);
        console.log(`  Incomplete: ${lightModeAudit.incomplete.length}`);
        
        if (lightModeAudit.violations.length > 0) {
            console.log('\n  ⚠️  Violations found in Light Mode:');
            lightModeAudit.violations.forEach((violation, index) => {
                console.log(`    ${index + 1}. [${violation.impact.toUpperCase()}] ${violation.id}`);
                console.log(`       ${violation.description}`);
                console.log(`       Affected elements: ${violation.nodes.length}`);
            });
        } else {
            console.log('  ✓ No violations in Light Mode');
        }
        
        // Step 5: Enable Dark Mode
        console.log('\n🌙 Enabling Dark Mode...');
        await enableDarkMode(page);
        await page.waitForTimeout(1000);
        console.log('✓ Dark Mode enabled\n');
        
        // Step 6: Run audit in Dark Mode
        console.log('🔍 Running accessibility audit in Dark Mode...');
        const darkModeAudit = await runAxeAudit(page, 'Dark Mode');
        testResults.audits.push(darkModeAudit);
        
        console.log(`  Violations: ${darkModeAudit.violations.length}`);
        console.log(`  Passes: ${darkModeAudit.passes.length}`);
        console.log(`  Incomplete: ${darkModeAudit.incomplete.length}`);
        
        if (darkModeAudit.violations.length > 0) {
            console.log('\n  ⚠️  Violations found in Dark Mode:');
            darkModeAudit.violations.forEach((violation, index) => {
                console.log(`    ${index + 1}. [${violation.impact.toUpperCase()}] ${violation.id}`);
                console.log(`       ${violation.description}`);
                console.log(`       Affected elements: ${violation.nodes.length}`);
            });
        } else {
            console.log('  ✓ No violations in Dark Mode');
        }
        
        // Step 7: Test specific bug fixes
        console.log('\n🐛 Verifying specific bug fixes...');
        
        // Test MASE-ACC-001: Live Preview Toggle aria-checked
        console.log('  Testing MASE-ACC-001: Live Preview Toggle aria-checked...');
        const ariaCheckedTest = await testLivePreviewAriaChecked(page);
        testResults.bugFixVerification = testResults.bugFixVerification || {};
        testResults.bugFixVerification['MASE-ACC-001'] = ariaCheckedTest;
        
        if (ariaCheckedTest.passed) {
            console.log('    ✓ Live Preview toggle aria-checked synchronizes correctly');
        } else {
            console.log('    ✗ Live Preview toggle aria-checked NOT synchronized');
            console.log(`      ${ariaCheckedTest.details}`);
        }
        
        // Step 8: Calculate summary
        testResults.audits.forEach(audit => {
            testResults.summary.totalViolations += audit.violations.length;
            
            audit.violations.forEach(violation => {
                switch (violation.impact) {
                    case 'critical':
                        testResults.summary.criticalViolations++;
                        break;
                    case 'serious':
                        testResults.summary.seriousViolations++;
                        break;
                    case 'moderate':
                        testResults.summary.moderateViolations++;
                        break;
                    case 'minor':
                        testResults.summary.minorViolations++;
                        break;
                }
            });
        });
        
        // Step 9: Determine test result
        if (testResults.summary.totalViolations === 0) {
            testResults.status = 'PASSED';
            console.log('\n✅ TEST PASSED: 0 accessibility violations found');
        } else {
            testResults.status = 'FAILED';
            console.log(`\n❌ TEST FAILED: ${testResults.summary.totalViolations} accessibility violations found`);
            console.log(`   Critical: ${testResults.summary.criticalViolations}`);
            console.log(`   Serious: ${testResults.summary.seriousViolations}`);
            console.log(`   Moderate: ${testResults.summary.moderateViolations}`);
            console.log(`   Minor: ${testResults.summary.minorViolations}`);
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
 * Test Live Preview Toggle aria-checked synchronization (MASE-ACC-001)
 */
async function testLivePreviewAriaChecked(page) {
    try {
        const toggle = await page.$('#mase-live-preview-toggle');
        if (!toggle) {
            return {
                passed: false,
                details: 'Live Preview toggle not found'
            };
        }
        
        // Get initial state
        const initialChecked = await page.isChecked('#mase-live-preview-toggle');
        const initialAriaChecked = await page.getAttribute('#mase-live-preview-toggle', 'aria-checked');
        
        // Click to toggle
        await page.click('#mase-live-preview-toggle');
        await page.waitForTimeout(200);
        
        // Get new state
        const newChecked = await page.isChecked('#mase-live-preview-toggle');
        const newAriaChecked = await page.getAttribute('#mase-live-preview-toggle', 'aria-checked');
        
        // Verify synchronization
        const expectedAriaChecked = newChecked ? 'true' : 'false';
        const synchronized = newAriaChecked === expectedAriaChecked;
        
        return {
            passed: synchronized,
            details: synchronized 
                ? `aria-checked correctly set to "${newAriaChecked}"` 
                : `aria-checked is "${newAriaChecked}" but should be "${expectedAriaChecked}"`
        };
    } catch (error) {
        return {
            passed: false,
            details: `Error testing aria-checked: ${error.message}`
        };
    }
}

/**
 * Generate HTML report
 */
async function generateReport(testResults) {
    console.log('\n📊 Generating accessibility report...');
    
    const statusColor = testResults.status === 'PASSED' ? '#00a32a' : 
                       testResults.status === 'FAILED' ? '#d63638' : '#dba617';
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MASE Accessibility Audit Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #f5f5f5; 
            padding: 40px; 
            line-height: 1.6;
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
        h2 { color: #1d2327; margin: 30px 0 15px 0; }
        h3 { color: #3c434a; margin: 20px 0 10px 0; }
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
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .summary-card {
            background: #f6f7f7;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .summary-card.critical { border-left: 4px solid #d63638; }
        .summary-card.serious { border-left: 4px solid #f86368; }
        .summary-card.moderate { border-left: 4px solid #dba617; }
        .summary-card.minor { border-left: 4px solid #72aee6; }
        .summary-card .value {
            font-size: 36px;
            font-weight: bold;
            margin: 10px 0;
        }
        .summary-card .label {
            color: #646970;
            font-size: 14px;
            text-transform: uppercase;
        }
        .audit-section {
            background: #f6f7f7;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .violation {
            background: white;
            padding: 15px;
            border-radius: 4px;
            margin: 10px 0;
            border-left: 4px solid #d63638;
        }
        .violation.serious { border-left-color: #f86368; }
        .violation.moderate { border-left-color: #dba617; }
        .violation.minor { border-left-color: #72aee6; }
        .violation-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .violation-id {
            font-family: monospace;
            font-weight: bold;
            color: #1d2327;
        }
        .impact-badge {
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            color: white;
        }
        .impact-badge.critical { background: #d63638; }
        .impact-badge.serious { background: #f86368; }
        .impact-badge.moderate { background: #dba617; }
        .impact-badge.minor { background: #72aee6; }
        .violation-description {
            color: #3c434a;
            margin: 10px 0;
        }
        .violation-help {
            color: #646970;
            font-size: 14px;
            margin: 10px 0;
        }
        .violation-nodes {
            margin-top: 10px;
            padding: 10px;
            background: #f6f7f7;
            border-radius: 4px;
        }
        .node-item {
            font-family: monospace;
            font-size: 13px;
            margin: 5px 0;
            padding: 5px;
            background: white;
            border-radius: 2px;
        }
        .bug-fix-section {
            background: #e7f5fe;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2271b1;
        }
        .bug-fix-item {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 4px;
        }
        .bug-fix-item.passed {
            border-left: 4px solid #00a32a;
        }
        .bug-fix-item.failed {
            border-left: 4px solid #d63638;
        }
        .no-violations {
            text-align: center;
            padding: 40px;
            color: #00a32a;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>♿ MASE Accessibility Audit Report</h1>
        <div class="meta">
            <strong>Test Name:</strong> ${testResults.testName}<br>
            <strong>Timestamp:</strong> ${new Date(testResults.timestamp).toLocaleString()}<br>
            <strong>Requirements:</strong> ${testResults.requirements.join(', ')}<br>
            <strong>Bug Fixes Verified:</strong> ${testResults.bugsFixes.join(', ')}<br>
            <strong>axe-core Version:</strong> ${CONFIG.axeCoreVersion}
        </div>
        
        <div class="status">${testResults.status}</div>
        
        <h2>📊 Summary</h2>
        <div class="summary-grid">
            <div class="summary-card">
                <div class="label">Total Violations</div>
                <div class="value">${testResults.summary.totalViolations}</div>
            </div>
            <div class="summary-card critical">
                <div class="label">Critical</div>
                <div class="value">${testResults.summary.criticalViolations}</div>
            </div>
            <div class="summary-card serious">
                <div class="label">Serious</div>
                <div class="value">${testResults.summary.seriousViolations}</div>
            </div>
            <div class="summary-card moderate">
                <div class="label">Moderate</div>
                <div class="value">${testResults.summary.moderateViolations}</div>
            </div>
            <div class="summary-card minor">
                <div class="label">Minor</div>
                <div class="value">${testResults.summary.minorViolations}</div>
            </div>
        </div>
        
        ${testResults.bugFixVerification ? `
        <div class="bug-fix-section">
            <h2>🐛 Bug Fix Verification</h2>
            ${Object.entries(testResults.bugFixVerification).map(([bugId, result]) => `
                <div class="bug-fix-item ${result.passed ? 'passed' : 'failed'}">
                    <strong>${bugId}:</strong> ${result.passed ? '✓ PASSED' : '✗ FAILED'}<br>
                    <small>${result.details}</small>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${testResults.audits.map(audit => `
            <div class="audit-section">
                <h2>🔍 ${audit.context} Audit</h2>
                <p>
                    <strong>Violations:</strong> ${audit.violations.length} | 
                    <strong>Passes:</strong> ${audit.passes.length} | 
                    <strong>Incomplete:</strong> ${audit.incomplete.length}
                </p>
                
                ${audit.violations.length === 0 ? `
                    <div class="no-violations">
                        ✅ No accessibility violations found!
                    </div>
                ` : `
                    <h3>Violations</h3>
                    ${audit.violations.map(violation => `
                        <div class="violation ${violation.impact}">
                            <div class="violation-header">
                                <span class="violation-id">${violation.id}</span>
                                <span class="impact-badge ${violation.impact}">${violation.impact.toUpperCase()}</span>
                            </div>
                            <div class="violation-description">
                                ${violation.description}
                            </div>
                            <div class="violation-help">
                                <strong>Help:</strong> ${violation.help}<br>
                                <strong>WCAG:</strong> ${violation.tags.filter(tag => tag.startsWith('wcag')).join(', ')}
                            </div>
                            <div class="violation-nodes">
                                <strong>Affected Elements (${violation.nodes.length}):</strong>
                                ${violation.nodes.slice(0, 5).map(node => `
                                    <div class="node-item">
                                        ${node.html.substring(0, 100)}${node.html.length > 100 ? '...' : ''}
                                    </div>
                                `).join('')}
                                ${violation.nodes.length > 5 ? `<div class="node-item">... and ${violation.nodes.length - 5} more</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                `}
            </div>
        `).join('')}
        
        ${testResults.error ? `
        <div class="audit-section" style="border-left: 4px solid #d63638;">
            <h2>❌ Error</h2>
            <pre>${testResults.error}</pre>
        </div>
        ` : ''}
    </div>
</body>
</html>
    `;
    
    const timestamp = Date.now();
    const reportPath = path.join(CONFIG.reportsDir, `accessibility-audit-${timestamp}.html`);
    fs.writeFileSync(reportPath, html);
    
    const jsonPath = path.join(CONFIG.reportsDir, `accessibility-audit-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(testResults, null, 2));
    
    console.log(`✓ HTML Report: ${reportPath}`);
    console.log(`✓ JSON Results: ${jsonPath}`);
}

// Run the test
if (require.main === module) {
    runAccessibilityAudit()
        .then(results => {
            process.exit(results.status === 'PASSED' ? 0 : 1);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { runAccessibilityAudit };
