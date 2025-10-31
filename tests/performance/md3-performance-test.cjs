/**
 * Material Design 3 Performance Testing
 * 
 * Tests animation FPS, runs Lighthouse audits, and profiles memory usage.
 * 
 * Requirements: 22.1
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const { URL } = require('url');

/**
 * Performance Test Configuration
 */
const config = {
    // WordPress admin URL (update with your local environment)
    adminUrl: process.env.WP_ADMIN_URL || 'http://localhost:8080/wp-admin/admin.php?page=modern-admin-styler',
    
    // Performance thresholds
    thresholds: {
        targetFps: 60,
        minFps: 55,
        maxMemoryMB: 100,
        lighthousePerformance: 90
    },
    
    // Test scenarios
    scenarios: [
        {
            name: 'Template Card Hover',
            selector: '.mase-template-card',
            action: 'hover',
            duration: 2000
        },
        {
            name: 'Tab Switching',
            selector: '.mase-md3-tab',
            action: 'click',
            duration: 1000
        },
        {
            name: 'Toggle Switch',
            selector: '.mase-toggle',
            action: 'click',
            duration: 500
        },
        {
            name: 'Color Picker Interaction',
            selector: '.mase-color-picker',
            action: 'click',
            duration: 1000
        },
        {
            name: 'Button Ripple',
            selector: '.mase-button-filled',
            action: 'click',
            duration: 600
        }
    ]
};

/**
 * FPS Monitor Class
 */
class FPSMonitor {
    constructor() {
        this.frames = [];
        this.startTime = null;
    }

    start() {
        this.frames = [];
        this.startTime = performance.now();
    }

    recordFrame() {
        const now = performance.now();
        this.frames.push(now);
    }

    getResults() {
        if (this.frames.length < 2) {
            return { avgFps: 0, minFps: 0, maxFps: 0, frameCount: 0 };
        }

        const frameTimes = [];
        for (let i = 1; i < this.frames.length; i++) {
            frameTimes.push(this.frames[i] - this.frames[i - 1]);
        }

        const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const minFrameTime = Math.min(...frameTimes);
        const maxFrameTime = Math.max(...frameTimes);

        return {
            avgFps: 1000 / avgFrameTime,
            minFps: 1000 / maxFrameTime,
            maxFps: 1000 / minFrameTime,
            frameCount: this.frames.length,
            duration: this.frames[this.frames.length - 1] - this.frames[0]
        };
    }
}

/**
 * Test FPS for animation scenario
 */
async function testAnimationFPS(page, scenario) {
    console.log(`\n📊 Testing: ${scenario.name}`);

    // Inject FPS monitor
    await page.evaluateOnNewDocument(() => {
        window.fpsMonitor = {
            frames: [],
            startTime: null,
            start() {
                this.frames = [];
                this.startTime = performance.now();
            },
            recordFrame() {
                this.frames.push(performance.now());
            },
            getResults() {
                if (this.frames.length < 2) {
                    return { avgFps: 0, minFps: 0, maxFps: 0, frameCount: 0 };
                }

                const frameTimes = [];
                for (let i = 1; i < this.frames.length; i++) {
                    frameTimes.push(this.frames[i] - this.frames[i - 1]);
                }

                const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
                const minFrameTime = Math.min(...frameTimes);
                const maxFrameTime = Math.max(...frameTimes);

                return {
                    avgFps: 1000 / avgFrameTime,
                    minFps: 1000 / maxFrameTime,
                    maxFps: 1000 / minFrameTime,
                    frameCount: this.frames.length,
                    duration: this.frames[this.frames.length - 1] - this.frames[0]
                };
            }
        };
    });

    // Wait for element
    try {
        await page.waitForSelector(scenario.selector, { timeout: 5000 });
    } catch (error) {
        console.error(`❌ Element not found: ${scenario.selector}`);
        return null;
    }

    // Start FPS monitoring
    const results = await page.evaluate(async (scenario) => {
        return new Promise((resolve) => {
            window.fpsMonitor.start();

            // Start RAF loop to measure FPS
            let rafId;
            const measureFPS = () => {
                window.fpsMonitor.recordFrame();
                rafId = requestAnimationFrame(measureFPS);
            };
            rafId = requestAnimationFrame(measureFPS);

            // Perform action
            const element = document.querySelector(scenario.selector);
            if (!element) {
                cancelAnimationFrame(rafId);
                resolve(null);
                return;
            }

            if (scenario.action === 'hover') {
                element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            } else if (scenario.action === 'click') {
                element.click();
            }

            // Stop after duration
            setTimeout(() => {
                cancelAnimationFrame(rafId);
                const results = window.fpsMonitor.getResults();
                resolve(results);
            }, scenario.duration);
        });
    }, scenario);

    if (results) {
        const passed = results.avgFps >= config.thresholds.minFps;
        const icon = passed ? '✅' : '❌';
        
        console.log(`${icon} Average FPS: ${results.avgFps.toFixed(2)} (target: ${config.thresholds.targetFps})`);
        console.log(`   Min FPS: ${results.minFps.toFixed(2)}`);
        console.log(`   Max FPS: ${results.maxFps.toFixed(2)}`);
        console.log(`   Frames: ${results.frameCount} in ${results.duration.toFixed(2)}ms`);

        return {
            scenario: scenario.name,
            passed,
            ...results
        };
    }

    return null;
}

/**
 * Profile memory usage
 */
async function profileMemory(page) {
    console.log('\n💾 Profiling Memory Usage');

    const metrics = await page.metrics();
    const memoryMB = metrics.JSHeapUsedSize / 1024 / 1024;
    const passed = memoryMB <= config.thresholds.maxMemoryMB;
    const icon = passed ? '✅' : '❌';

    console.log(`${icon} JS Heap Used: ${memoryMB.toFixed(2)} MB (max: ${config.thresholds.maxMemoryMB} MB)`);
    console.log(`   JS Heap Total: ${(metrics.JSHeapTotalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Documents: ${metrics.Documents}`);
    console.log(`   Frames: ${metrics.Frames}`);
    console.log(`   JS Event Listeners: ${metrics.JSEventListeners}`);

    return {
        passed,
        heapUsedMB: memoryMB,
        heapTotalMB: metrics.JSHeapTotalSize / 1024 / 1024,
        documents: metrics.Documents,
        frames: metrics.Frames,
        eventListeners: metrics.JSEventListeners
    };
}

/**
 * Run Lighthouse audit
 */
async function runLighthouseAudit(url) {
    console.log('\n🔦 Running Lighthouse Audit');

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const { lhr } = await lighthouse(url, {
            port: new URL(browser.wsEndpoint()).port,
            output: 'json',
            onlyCategories: ['performance'],
            disableStorageReset: true
        });

        await browser.close();

        const score = lhr.categories.performance.score * 100;
        const passed = score >= config.thresholds.lighthousePerformance;
        const icon = passed ? '✅' : '❌';

        console.log(`${icon} Performance Score: ${score.toFixed(0)} (target: ${config.thresholds.lighthousePerformance})`);
        
        // Key metrics
        const metrics = lhr.audits;
        console.log(`   First Contentful Paint: ${metrics['first-contentful-paint'].displayValue}`);
        console.log(`   Speed Index: ${metrics['speed-index'].displayValue}`);
        console.log(`   Time to Interactive: ${metrics['interactive'].displayValue}`);
        console.log(`   Total Blocking Time: ${metrics['total-blocking-time'].displayValue}`);
        console.log(`   Cumulative Layout Shift: ${metrics['cumulative-layout-shift'].displayValue}`);

        return {
            passed,
            score,
            fcp: metrics['first-contentful-paint'].numericValue,
            speedIndex: metrics['speed-index'].numericValue,
            tti: metrics['interactive'].numericValue,
            tbt: metrics['total-blocking-time'].numericValue,
            cls: metrics['cumulative-layout-shift'].numericValue
        };
    } catch (error) {
        console.error('❌ Lighthouse audit failed:', error.message);
        return null;
    }
}

/**
 * Check for layout thrashing
 */
async function checkLayoutThrashing(page) {
    console.log('\n🔍 Checking for Layout Thrashing');

    const layoutCount = await page.evaluate(() => {
        let layoutCount = 0;
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'measure' && entry.name.includes('layout')) {
                    layoutCount++;
                }
            }
        });
        observer.observe({ entryTypes: ['measure'] });

        // Trigger some interactions
        const cards = document.querySelectorAll('.mase-template-card');
        cards.forEach(card => {
            card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            card.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        });

        return layoutCount;
    });

    const passed = layoutCount < 10;
    const icon = passed ? '✅' : '⚠️';
    console.log(`${icon} Layout operations: ${layoutCount} (lower is better)`);

    return { passed, layoutCount };
}

/**
 * Main test runner
 */
async function runPerformanceTests() {
    console.log('🚀 MD3 Performance Testing Suite\n');
    console.log('Configuration:');
    console.log(`   Admin URL: ${config.adminUrl}`);
    console.log(`   Target FPS: ${config.thresholds.targetFps}`);
    console.log(`   Min FPS: ${config.thresholds.minFps}`);
    console.log(`   Max Memory: ${config.thresholds.maxMemoryMB} MB`);
    console.log(`   Lighthouse Target: ${config.thresholds.lighthousePerformance}`);

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    });

    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to admin page
    console.log('\n🌐 Navigating to admin page...');
    try {
        await page.goto(config.adminUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    } catch (error) {
        console.error('❌ Failed to load page:', error.message);
        console.log('\n⚠️  Make sure WordPress is running and the URL is correct.');
        console.log('   Set WP_ADMIN_URL environment variable if needed.');
        await browser.close();
        process.exit(1);
    }

    const results = {
        animations: [],
        memory: null,
        lighthouse: null,
        layoutThrashing: null,
        timestamp: new Date().toISOString()
    };

    // Test animation FPS for each scenario
    console.log('\n' + '='.repeat(60));
    console.log('ANIMATION FPS TESTS');
    console.log('='.repeat(60));

    for (const scenario of config.scenarios) {
        const result = await testAnimationFPS(page, scenario);
        if (result) {
            results.animations.push(result);
        }
        await page.waitForTimeout(500); // Pause between tests
    }

    // Profile memory
    console.log('\n' + '='.repeat(60));
    console.log('MEMORY PROFILING');
    console.log('='.repeat(60));
    results.memory = await profileMemory(page);

    // Check layout thrashing
    console.log('\n' + '='.repeat(60));
    console.log('LAYOUT THRASHING CHECK');
    console.log('='.repeat(60));
    results.layoutThrashing = await checkLayoutThrashing(page);

    await browser.close();

    // Run Lighthouse audit (separate browser instance)
    console.log('\n' + '='.repeat(60));
    console.log('LIGHTHOUSE AUDIT');
    console.log('='.repeat(60));
    results.lighthouse = await runLighthouseAudit(config.adminUrl);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));

    const animationsPassed = results.animations.filter(r => r.passed).length;
    const animationsTotal = results.animations.length;
    const memoryPassed = results.memory?.passed || false;
    const lighthousePassed = results.lighthouse?.passed || false;
    const layoutPassed = results.layoutThrashing?.passed || false;

    console.log(`\n✨ Animation Tests: ${animationsPassed}/${animationsTotal} passed`);
    console.log(`💾 Memory Test: ${memoryPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`🔦 Lighthouse Test: ${lighthousePassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`🔍 Layout Thrashing: ${layoutPassed ? '✅ PASSED' : '⚠️  WARNING'}`);

    const allPassed = animationsPassed === animationsTotal && memoryPassed && lighthousePassed && layoutPassed;
    
    if (allPassed) {
        console.log('\n🎉 All performance tests PASSED!');
    } else {
        console.log('\n⚠️  Some performance tests failed. Review results above.');
    }

    // Save results to file
    const fs = require('fs');
    const resultsPath = 'tests/performance-results/md3-performance-results.json';
    fs.mkdirSync('tests/performance-results', { recursive: true });
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Results saved to: ${resultsPath}`);

    process.exit(allPassed ? 0 : 1);
}

// Run tests
runPerformanceTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
});
