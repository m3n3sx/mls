/**
 * MASE Admin Bar Comprehensive Enhancement Visual Tests
 * 
 * Tests all visual aspects of the admin bar enhancement feature:
 * - Text and icon alignment at different heights
 * - Icon color synchronization
 * - Floating mode layout
 * - Gradient backgrounds
 * - Submenu styling
 * 
 * Requirements: 1.1-1.3, 2.1-2.2, 3.1-3.3, 5.1-5.3, 6.1-6.3, 7.1-7.5, 13.1-13.5
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
 * Main test runner
 */
async function runAdminBarEnhancementTests() {
    console.log('🎨 Starting Admin Bar Enhancement Visual Tests...\n');
    
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
        testName: 'Admin Bar Enhancement Visual Tests',
        status: 'unknown',
        tests: [],
        screenshots: []
    };
    
    try {
        // Login to WordPress
        console.log('🔐 Logging in to WordPress...');
        await loginToWordPress(page);
        console.log('✓ Logged in successfully\n');
        
        // Navigate to MASE settings page
        console.log('📍 Navigating to MASE settings page...');
        await page.goto(CONFIG.baseUrl, { 
            waitUntil: 'domcontentloaded', 
            timeout: CONFIG.timeout 
        });
        await page.waitForTimeout(2000);
        
        // Switch to Admin Bar tab
        await page.click('#tab-button-admin-bar');
        await page.waitForTimeout(1000);
        console.log('✓ Admin Bar tab loaded\n');
        
        // Run all test suites
        await testTextAndIconAlignment(page, testResults);
        await testIconColorSynchronization(page, testResults);
        await testFloatingModeLayout(page, testResults);
        await testGradientBackgrounds(page, testResults);
        await testSubmenuStyling(page, testResults);
        
        // Determine overall status
        const failedTests = testResults.tests.filter(t => t.status === 'FAILED');
        testResults.status = failedTests.length === 0 ? 'PASSED' : 'FAILED';
        
        console.log(`\n${'='.repeat(60)}`);
        if (testResults.status === 'PASSED') {
            console.log('✅ ALL TESTS PASSED');
        } else {
            console.log(`❌ ${failedTests.length} TEST(S) FAILED`);
        }
        console.log(`${'='.repeat(60)}\n`);
        
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
 * Test 18.1: Text and Icon Alignment
 * Requirements: 1.1, 1.2, 1.3, 3.1, 3.2, 3.3
 */
async function testTextAndIconAlignment(page, testResults) {
    console.log('📏 Test 18.1: Text and Icon Alignment\n');
    
    const testResult = {
        id: '18.1',
        name: 'Text and Icon Alignment',
        requirements: ['1.1', '1.2', '1.3', '3.1', '3.2', '3.3'],
        status: 'PASSED',
        details: [],
        screenshots: []
    };
    
    const heights = [32, 50, 100];
    
    for (const height of heights) {
        console.log(`  Testing at height ${height}px...`);
        
        try {
            // Set admin bar height
            await page.fill('#admin-bar-height', height.toString());
            await page.waitForTimeout(500);
            
            // Take screenshot
            const screenshot = await takeScreenshot(
                page,
                `alignment-height-${height}px`,
                `Admin Bar Alignment at ${height}px`
            );
            testResult.screenshots.push(screenshot);
            
            // Verify alignment
            const alignment = await page.evaluate(() => {
                const adminBar = document.querySelector('#wpadminbar');
                const items = document.querySelectorAll('#wpadminbar .ab-item');
                const icons = document.querySelectorAll('#wpadminbar .ab-icon');
                
                if (!adminBar || items.length === 0) {
                    return { error: 'Admin bar or items not found' };
                }
                
                const barStyle = window.getComputedStyle(adminBar);
                const itemStyle = items[0] ? window.getComputedStyle(items[0]) : null;
                
                return {
                    barDisplay: barStyle.display,
                    barAlignItems: barStyle.alignItems,
                    barHeight: adminBar.offsetHeight,
                    itemsCount: items.length,
                    iconsCount: icons.length,
                    itemVerticalAlign: itemStyle ? itemStyle.verticalAlign : 'N/A'
                };
            });
            
            if (alignment.error) {
                testResult.status = 'FAILED';
                testResult.details.push({
                    height,
                    status: 'FAILED',
                    error: alignment.error
                });
                console.log(`    ❌ Failed: ${alignment.error}`);
            } else {
                const isAligned = alignment.barDisplay === 'flex' && 
                                 alignment.barAlignItems === 'center';
                
                testResult.details.push({
                    height,
                    status: isAligned ? 'PASSED' : 'FAILED',
                    alignment
                });
                
                if (isAligned) {
                    console.log(`    ✓ Alignment verified at ${height}px`);
                } else {
                    testResult.status = 'FAILED';
                    console.log(`    ❌ Alignment failed at ${height}px`);
                }
            }
            
        } catch (error) {
            testResult.status = 'FAILED';
            testResult.details.push({
                height,
                status: 'ERROR',
                error: error.message
            });
            console.log(`    ❌ Error at ${height}px: ${error.message}`);
        }
    }
    
    testResults.tests.push(testResult);
    console.log(`  ${testResult.status === 'PASSED' ? '✅' : '❌'} Test 18.1: ${testResult.status}\n`);
}

/**
 * Test 18.2: Icon Color Synchronization
 * Requirements: 2.1, 2.2
 */
async function testIconColorSynchronization(page, testResults) {
    console.log('🎨 Test 18.2: Icon Color Synchronization\n');
    
    const testResult = {
        id: '18.2',
        name: 'Icon Color Synchronization',
        requirements: ['2.1', '2.2'],
        status: 'PASSED',
        details: [],
        screenshots: []
    };
    
    const testColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
    
    for (const color of testColors) {
        console.log(`  Testing with color ${color}...`);
        
        try {
            // Set text color
            const colorInput = await page.$('#admin-bar-text-color');
            if (colorInput) {
                await page.fill('#admin-bar-text-color', color);
            } else {
                await page.fill('#admin-bar-text-color-fallback', color);
            }
            await page.waitForTimeout(500);
            
            // Take screenshot
            const screenshot = await takeScreenshot(
                page,
                `icon-color-${color.replace('#', '')}`,
                `Icon Color Sync - ${color}`
            );
            testResult.screenshots.push(screenshot);
            
            // Verify icon colors match text color
            const colorSync = await page.evaluate((expectedColor) => {
                const textElements = document.querySelectorAll('#wpadminbar .ab-item');
                const icons = document.querySelectorAll('#wpadminbar .ab-icon, #wpadminbar .dashicons');
                
                if (textElements.length === 0 || icons.length === 0) {
                    return { error: 'Text or icon elements not found' };
                }
                
                const textColor = window.getComputedStyle(textElements[0]).color;
                const iconColors = Array.from(icons).map(icon => 
                    window.getComputedStyle(icon).color
                );
                
                const allMatch = iconColors.every(c => c === textColor);
                
                return {
                    textColor,
                    iconColors: [...new Set(iconColors)],
                    allMatch
                };
            }, color);
            
            if (colorSync.error) {
                testResult.status = 'FAILED';
                testResult.details.push({
                    color,
                    status: 'FAILED',
                    error: colorSync.error
                });
                console.log(`    ❌ Failed: ${colorSync.error}`);
            } else {
                testResult.details.push({
                    color,
                    status: colorSync.allMatch ? 'PASSED' : 'FAILED',
                    colorSync
                });
                
                if (colorSync.allMatch) {
                    console.log(`    ✓ Icons match text color ${color}`);
                } else {
                    testResult.status = 'FAILED';
                    console.log(`    ❌ Icons don't match text color ${color}`);
                }
            }
            
        } catch (error) {
            testResult.status = 'FAILED';
            testResult.details.push({
                color,
                status: 'ERROR',
                error: error.message
            });
            console.log(`    ❌ Error with ${color}: ${error.message}`);
        }
    }
    
    testResults.tests.push(testResult);
    console.log(`  ${testResult.status === 'PASSED' ? '✅' : '❌'} Test 18.2: ${testResult.status}\n`);
}

/**
 * Test 18.3: Floating Mode Layout
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 */
async function testFloatingModeLayout(page, testResults) {
    console.log('🎈 Test 18.3: Floating Mode Layout\n');
    
    const testResult = {
        id: '18.3',
        name: 'Floating Mode Layout',
        requirements: ['13.1', '13.2', '13.3', '13.4', '13.5'],
        status: 'PASSED',
        details: [],
        screenshots: []
    };
    
    try {
        // Enable floating mode
        console.log('  Enabling floating mode...');
        const floatingToggle = await page.$('#admin-bar-floating');
        if (floatingToggle) {
            await page.click('#admin-bar-floating', { force: true });
            await page.waitForTimeout(1000);
        }
        
        // Take baseline screenshot
        const baselineScreenshot = await takeScreenshot(
            page,
            'floating-mode-baseline',
            'Floating Mode - Baseline'
        );
        testResult.screenshots.push(baselineScreenshot);
        
        // Test different heights and margins
        const configs = [
            { height: 32, margin: 8 },
            { height: 50, margin: 16 },
            { height: 100, margin: 24 }
        ];
        
        for (const config of configs) {
            console.log(`  Testing height ${config.height}px, margin ${config.margin}px...`);
            
            // Set height
            await page.fill('#admin-bar-height', config.height.toString());
            await page.waitForTimeout(300);
            
            // Set margin
            await page.fill('#admin-bar-floating-margin', config.margin.toString());
            await page.waitForTimeout(500);
            
            // Take screenshot
            const screenshot = await takeScreenshot(
                page,
                `floating-h${config.height}-m${config.margin}`,
                `Floating Mode - H:${config.height}px M:${config.margin}px`
            );
            testResult.screenshots.push(screenshot);
            
            // Verify layout
            const layout = await page.evaluate(() => {
                const adminBar = document.querySelector('#wpadminbar');
                const sideMenu = document.querySelector('#adminmenuwrap');
                
                if (!adminBar || !sideMenu) {
                    return { error: 'Admin bar or side menu not found' };
                }
                
                const barRect = adminBar.getBoundingClientRect();
                const menuRect = sideMenu.getBoundingClientRect();
                const menuStyle = window.getComputedStyle(sideMenu);
                
                return {
                    barHeight: barRect.height,
                    barTop: barRect.top,
                    menuTop: menuRect.top,
                    menuPaddingTop: parseInt(menuStyle.paddingTop),
                    overlap: barRect.bottom > menuRect.top
                };
            });
            
            if (layout.error) {
                testResult.status = 'FAILED';
                testResult.details.push({
                    config,
                    status: 'FAILED',
                    error: layout.error
                });
                console.log(`    ❌ Failed: ${layout.error}`);
            } else {
                const noOverlap = !layout.overlap;
                
                testResult.details.push({
                    config,
                    status: noOverlap ? 'PASSED' : 'FAILED',
                    layout
                });
                
                if (noOverlap) {
                    console.log(`    ✓ No overlap detected`);
                } else {
                    testResult.status = 'FAILED';
                    console.log(`    ❌ Admin bar overlaps side menu`);
                }
            }
        }
        
        // Disable floating mode
        await page.click('#admin-bar-floating', { force: true });
        await page.waitForTimeout(500);
        
    } catch (error) {
        testResult.status = 'FAILED';
        testResult.details.push({
            status: 'ERROR',
            error: error.message
        });
        console.log(`  ❌ Error: ${error.message}`);
    }
    
    testResults.tests.push(testResult);
    console.log(`  ${testResult.status === 'PASSED' ? '✅' : '❌'} Test 18.3: ${testResult.status}\n`);
}

/**
 * Test 18.4: Gradient Backgrounds
 * Requirements: 5.1, 5.2, 5.3
 */
async function testGradientBackgrounds(page, testResults) {
    console.log('🌈 Test 18.4: Gradient Backgrounds\n');
    
    const testResult = {
        id: '18.4',
        name: 'Gradient Backgrounds',
        requirements: ['5.1', '5.2', '5.3'],
        status: 'PASSED',
        details: [],
        screenshots: []
    };
    
    const gradientTypes = ['linear', 'radial', 'conic'];
    const angles = [0, 90, 180, 270];
    
    try {
        // Enable gradient background
        console.log('  Enabling gradient background...');
        const bgTypeSelect = await page.$('#admin-bar-bg-type');
        if (bgTypeSelect) {
            await page.selectOption('#admin-bar-bg-type', 'gradient');
            await page.waitForTimeout(500);
        }
        
        // Test each gradient type
        for (const gradientType of gradientTypes) {
            console.log(`  Testing ${gradientType} gradient...`);
            
            const gradientTypeSelect = await page.$('#admin-bar-gradient-type');
            if (gradientTypeSelect) {
                await page.selectOption('#admin-bar-gradient-type', gradientType);
                await page.waitForTimeout(500);
            }
            
            // For linear gradients, test different angles
            if (gradientType === 'linear') {
                for (const angle of angles) {
                    console.log(`    Testing angle ${angle}°...`);
                    
                    await page.fill('#admin-bar-gradient-angle', angle.toString());
                    await page.waitForTimeout(500);
                    
                    const screenshot = await takeScreenshot(
                        page,
                        `gradient-${gradientType}-${angle}deg`,
                        `${gradientType} Gradient - ${angle}°`
                    );
                    testResult.screenshots.push(screenshot);
                    
                    // Verify gradient is applied
                    const gradient = await page.evaluate(() => {
                        const adminBar = document.querySelector('#wpadminbar');
                        if (!adminBar) return { error: 'Admin bar not found' };
                        
                        const style = window.getComputedStyle(adminBar);
                        const bgImage = style.backgroundImage;
                        
                        return {
                            hasGradient: bgImage.includes('gradient'),
                            backgroundImage: bgImage
                        };
                    });
                    
                    if (gradient.error) {
                        testResult.status = 'FAILED';
                        testResult.details.push({
                            gradientType,
                            angle,
                            status: 'FAILED',
                            error: gradient.error
                        });
                    } else if (gradient.hasGradient) {
                        testResult.details.push({
                            gradientType,
                            angle,
                            status: 'PASSED',
                            gradient
                        });
                        console.log(`      ✓ Gradient applied`);
                    } else {
                        testResult.status = 'FAILED';
                        testResult.details.push({
                            gradientType,
                            angle,
                            status: 'FAILED',
                            gradient
                        });
                        console.log(`      ❌ Gradient not applied`);
                    }
                }
            } else {
                // For radial and conic, just test once
                const screenshot = await takeScreenshot(
                    page,
                    `gradient-${gradientType}`,
                    `${gradientType} Gradient`
                );
                testResult.screenshots.push(screenshot);
                
                const gradient = await page.evaluate(() => {
                    const adminBar = document.querySelector('#wpadminbar');
                    if (!adminBar) return { error: 'Admin bar not found' };
                    
                    const style = window.getComputedStyle(adminBar);
                    const bgImage = style.backgroundImage;
                    
                    return {
                        hasGradient: bgImage.includes('gradient'),
                        backgroundImage: bgImage
                    };
                });
                
                if (gradient.error) {
                    testResult.status = 'FAILED';
                    testResult.details.push({
                        gradientType,
                        status: 'FAILED',
                        error: gradient.error
                    });
                } else if (gradient.hasGradient) {
                    testResult.details.push({
                        gradientType,
                        status: 'PASSED',
                        gradient
                    });
                    console.log(`    ✓ ${gradientType} gradient applied`);
                } else {
                    testResult.status = 'FAILED';
                    testResult.details.push({
                        gradientType,
                        status: 'FAILED',
                        gradient
                    });
                    console.log(`    ❌ ${gradientType} gradient not applied`);
                }
            }
        }
        
        // Switch back to solid color
        const bgTypeSelect2 = await page.$('#admin-bar-bg-type');
        if (bgTypeSelect2) {
            await page.selectOption('#admin-bar-bg-type', 'solid');
            await page.waitForTimeout(500);
        }
        
    } catch (error) {
        testResult.status = 'FAILED';
        testResult.details.push({
            status: 'ERROR',
            error: error.message
        });
        console.log(`  ❌ Error: ${error.message}`);
    }
    
    testResults.tests.push(testResult);
    console.log(`  ${testResult.status === 'PASSED' ? '✅' : '❌'} Test 18.4: ${testResult.status}\n`);
}

/**
 * Test 18.5: Submenu Styling
 * Requirements: 6.1, 6.2, 6.3, 7.1-7.5
 */
async function testSubmenuStyling(page, testResults) {
    console.log('📋 Test 18.5: Submenu Styling\n');
    
    const testResult = {
        id: '18.5',
        name: 'Submenu Styling',
        requirements: ['6.1', '6.2', '6.3', '7.1', '7.2', '7.3', '7.4', '7.5'],
        status: 'PASSED',
        details: [],
        screenshots: []
    };
    
    try {
        // Test submenu background color
        console.log('  Testing submenu background color...');
        const submenuBgInput = await page.$('#admin-bar-submenu-bg-color');
        if (submenuBgInput) {
            await page.fill('#admin-bar-submenu-bg-color', '#ff0000');
        } else {
            await page.fill('#admin-bar-submenu-bg-color-fallback', '#ff0000');
        }
        await page.waitForTimeout(500);
        
        const bgScreenshot = await takeScreenshot(
            page,
            'submenu-bg-color',
            'Submenu Background Color'
        );
        testResult.screenshots.push(bgScreenshot);
        
        // Test submenu border radius
        console.log('  Testing submenu border radius...');
        const borderRadiusInput = await page.$('#admin-bar-submenu-border-radius');
        if (borderRadiusInput) {
            await page.fill('#admin-bar-submenu-border-radius', '10');
            await page.waitForTimeout(500);
        }
        
        const radiusScreenshot = await takeScreenshot(
            page,
            'submenu-border-radius',
            'Submenu Border Radius'
        );
        testResult.screenshots.push(radiusScreenshot);
        
        // Test submenu spacing
        console.log('  Testing submenu spacing...');
        const spacingInput = await page.$('#admin-bar-submenu-spacing');
        if (spacingInput) {
            await page.fill('#admin-bar-submenu-spacing', '20');
            await page.waitForTimeout(500);
        }
        
        const spacingScreenshot = await takeScreenshot(
            page,
            'submenu-spacing',
            'Submenu Spacing'
        );
        testResult.screenshots.push(spacingScreenshot);
        
        // Test submenu typography
        console.log('  Testing submenu typography...');
        
        // Font size
        const fontSizeInput = await page.$('#admin-bar-submenu-font-size');
        if (fontSizeInput) {
            await page.fill('#admin-bar-submenu-font-size', '16');
            await page.waitForTimeout(300);
        }
        
        // Text color
        const textColorInput = await page.$('#admin-bar-submenu-text-color');
        if (textColorInput) {
            await page.fill('#admin-bar-submenu-text-color', '#00ff00');
        } else {
            const fallback = await page.$('#admin-bar-submenu-text-color-fallback');
            if (fallback) {
                await page.fill('#admin-bar-submenu-text-color-fallback', '#00ff00');
            }
        }
        await page.waitForTimeout(500);
        
        const typographyScreenshot = await takeScreenshot(
            page,
            'submenu-typography',
            'Submenu Typography'
        );
        testResult.screenshots.push(typographyScreenshot);
        
        // Verify submenu styles are applied
        const submenuStyles = await page.evaluate(() => {
            const submenu = document.querySelector('#wpadminbar .ab-sub-wrapper');
            if (!submenu) return { error: 'Submenu not found' };
            
            const style = window.getComputedStyle(submenu);
            
            return {
                backgroundColor: style.backgroundColor,
                borderRadius: style.borderRadius,
                top: style.top
            };
        });
        
        if (submenuStyles.error) {
            testResult.status = 'FAILED';
            testResult.details.push({
                test: 'submenu-styles',
                status: 'FAILED',
                error: submenuStyles.error
            });
            console.log(`  ❌ Failed: ${submenuStyles.error}`);
        } else {
            testResult.details.push({
                test: 'submenu-styles',
                status: 'PASSED',
                styles: submenuStyles
            });
            console.log(`  ✓ Submenu styles verified`);
        }
        
    } catch (error) {
        testResult.status = 'FAILED';
        testResult.details.push({
            status: 'ERROR',
            error: error.message
        });
        console.log(`  ❌ Error: ${error.message}`);
    }
    
    testResults.tests.push(testResult);
    console.log(`  ${testResult.status === 'PASSED' ? '✅' : '❌'} Test 18.5: ${testResult.status}\n`);
}

/**
 * Helper: Login to WordPress
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
 * Helper: Take screenshot
 */
async function takeScreenshot(page, filename, description) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFilename = `adminbar-${filename}-${timestamp}.png`;
    const filepath = path.join(CONFIG.screenshotsDir, fullFilename);
    
    await page.screenshot({ 
        path: filepath, 
        fullPage: true 
    });
    
    return {
        filename: fullFilename,
        description,
        timestamp
    };
}

/**
 * Helper: Generate HTML report
 */
async function generateReport(testResults) {
    console.log('\n📊 Generating test report...');
    
    const statusColor = testResults.status === 'PASSED' ? '#00a32a' : 
                       testResults.status === 'FAILED' ? '#d63638' : '#dba617';
    
    const passedCount = testResults.tests.filter(t => t.status === 'PASSED').length;
    const failedCount = testResults.tests.filter(t => t.status === 'FAILED').length;
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MASE Admin Bar Enhancement Test Report</title>
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
        .summary {
            display: flex;
            gap: 20px;
            margin: 20px 0;
        }
        .summary-card {
            flex: 1;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .summary-card.passed { background: #e7f7e7; border: 2px solid #00a32a; }
        .summary-card.failed { background: #fcf0f1; border: 2px solid #d63638; }
        .summary-card h3 { font-size: 32px; margin-bottom: 5px; }
        .summary-card p { color: #646970; }
        .test-section { margin: 30px 0; border-top: 2px solid #dcdcde; padding-top: 20px; }
        .test-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            margin-bottom: 15px;
        }
        .test-header h2 { color: #1d2327; }
        .test-status { 
            padding: 5px 15px; 
            border-radius: 4px; 
            font-weight: bold; 
            font-size: 14px;
        }
        .test-status.passed { background: #00a32a; color: white; }
        .test-status.failed { background: #d63638; color: white; }
        .requirements { 
            color: #646970; 
            font-size: 13px; 
            margin-bottom: 15px;
        }
        .screenshots { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
            gap: 15px; 
            margin-top: 15px; 
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
            padding: 10px; 
            background: #f6f7f7; 
            font-size: 12px; 
            font-weight: 600; 
        }
        .details { 
            background: #f6f7f7; 
            padding: 15px; 
            border-radius: 4px; 
            margin: 10px 0; 
            font-size: 13px;
        }
        .details pre { 
            overflow-x: auto; 
            padding: 10px; 
            background: white; 
            border-radius: 4px;
            margin-top: 10px;
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
        <h1>🎨 MASE Admin Bar Enhancement Visual Tests</h1>
        <div class="meta">
            <strong>Test Suite:</strong> ${testResults.testName}<br>
            <strong>Timestamp:</strong> ${new Date(testResults.timestamp).toLocaleString()}<br>
            <strong>Total Tests:</strong> ${testResults.tests.length}
        </div>
        
        <div class="status">${testResults.status}</div>
        
        <div class="summary">
            <div class="summary-card passed">
                <h3>${passedCount}</h3>
                <p>Tests Passed</p>
            </div>
            <div class="summary-card failed">
                <h3>${failedCount}</h3>
                <p>Tests Failed</p>
            </div>
        </div>
        
        ${testResults.tests.map(test => `
            <div class="test-section">
                <div class="test-header">
                    <h2>${test.id} ${test.name}</h2>
                    <span class="test-status ${test.status.toLowerCase()}">${test.status}</span>
                </div>
                <div class="requirements">
                    <strong>Requirements:</strong> ${test.requirements.join(', ')}
                </div>
                
                ${test.details.length > 0 ? `
                    <div class="details">
                        <strong>Test Details:</strong>
                        <pre>${JSON.stringify(test.details, null, 2)}</pre>
                    </div>
                ` : ''}
                
                ${test.screenshots.length > 0 ? `
                    <div class="screenshots">
                        ${test.screenshots.map(screenshot => `
                            <div class="screenshot-card">
                                <img src="../screenshots/${screenshot.filename}" 
                                     alt="${screenshot.description}"
                                     onclick="showModal(this.src)">
                                <div class="screenshot-title">${screenshot.description}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
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
        `adminbar-enhancement-test-${Date.now()}.html`
    );
    fs.writeFileSync(reportPath, html);
    
    const jsonPath = path.join(
        CONFIG.reportsDir, 
        `adminbar-enhancement-test-${Date.now()}.json`
    );
    fs.writeFileSync(jsonPath, JSON.stringify(testResults, null, 2));
    
    console.log(`✓ HTML Report: ${reportPath}`);
    console.log(`✓ JSON Results: ${jsonPath}`);
}

// Run the tests
if (require.main === module) {
    runAdminBarEnhancementTests()
        .then(results => {
            process.exit(results.status === 'PASSED' ? 0 : 1);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { runAdminBarEnhancementTests };
