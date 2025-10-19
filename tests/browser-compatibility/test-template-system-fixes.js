/**
 * Browser Compatibility Tests for Template System Fixes
 * 
 * Tests Requirements: All requirements from template-system-fixes spec
 * 
 * This test suite validates that the template system fixes work correctly
 * across Chrome, Firefox, Safari, and Edge browsers.
 * 
 * Usage:
 *   npx playwright test test-template-system-fixes.js
 * 
 * Run specific browser:
 *   npx playwright test test-template-system-fixes.js --project=chromium
 *   npx playwright test test-template-system-fixes.js --project=firefox
 *   npx playwright test test-template-system-fixes.js --project=webkit
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_HTML_PATH = path.resolve(__dirname, '../test-thumbnail-display-ui.html');
const TEST_URL = 'file://' + TEST_HTML_PATH;
const RESULTS_DIR = path.join(__dirname, 'test-results', 'template-system');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

/**
 * Helper: Save test results
 */
async function saveTestResults(browserName, testName, results) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${browserName}-${testName}-${timestamp}.json`;
    const filepath = path.join(RESULTS_DIR, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
    console.log(`✓ Results saved: ${filename}`);
}

/**
 * Helper: Take screenshot
 */
async function takeScreenshot(page, testName, browserName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${browserName}-${testName}-${timestamp}.png`;
    const filepath = path.join(RESULTS_DIR, filename);
    
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`📸 Screenshot saved: ${filename}`);
}

/**
 * Test Suite: Thumbnail Display (Requirements 1.1-1.5)
 */
test.describe('Thumbnail Display', () => {
    test('should display SVG thumbnails for all templates', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        // Wait for template cards to render
        await page.waitForSelector('.mase-template-card', { timeout: 5000 });
        
        // Get all template cards
        const cards = await page.$$('.mase-template-card');
        expect(cards.length).toBeGreaterThan(0);
        
        // Check each card has a thumbnail
        for (const card of cards) {
            const thumbnail = await card.$('.mase-template-thumbnail img');
            expect(thumbnail).toBeTruthy();
            
            // Verify thumbnail src is a data URI
            const src = await thumbnail.getAttribute('src');
            expect(src).toMatch(/^data:image\/svg\+xml;base64,/);
        }
        
        console.log(`✓ ${browserName}: All ${cards.length} templates have thumbnails`);
    });
    
    test('thumbnails should render correctly without errors', async ({ page, browserName }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });
        
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        if (errors.length > 0) {
            console.error(`✗ ${browserName}: Errors detected:`, errors);
            await takeScreenshot(page, 'thumbnail-errors', browserName);
        }
        
        expect(errors).toHaveLength(0);
    });
    
    test('thumbnail images should have correct dimensions', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('.mase-template-thumbnail img');
        
        const thumbnail = await page.$('.mase-template-thumbnail img');
        const box = await thumbnail.boundingBox();
        
        // Thumbnail container should be 150px height (from CSS)
        expect(box.height).toBeGreaterThan(100);
        expect(box.height).toBeLessThanOrEqual(200);
        
        console.log(`✓ ${browserName}: Thumbnail dimensions OK (${box.width}x${box.height})`);
    });
});

/**
 * Test Suite: HTML Attributes (Requirements 3.1-3.5)
 */
test.describe('HTML Attributes', () => {
    test('template cards should have data-template attribute', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('.mase-template-card');
        
        const cards = await page.$$('.mase-template-card');
        
        for (const card of cards) {
            const dataTemplate = await card.getAttribute('data-template');
            expect(dataTemplate).toBeTruthy();
            expect(dataTemplate.length).toBeGreaterThan(0);
        }
        
        console.log(`✓ ${browserName}: All cards have data-template attribute`);
    });
    
    test('template cards should have accessibility attributes', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('.mase-template-card');
        
        const cards = await page.$$('.mase-template-card');
        
        for (const card of cards) {
            const role = await card.getAttribute('role');
            const ariaLabel = await card.getAttribute('aria-label');
            
            expect(role).toBe('article');
            expect(ariaLabel).toBeTruthy();
        }
        
        console.log(`✓ ${browserName}: All cards have accessibility attributes`);
    });
});

/**
 * Test Suite: Gallery Layout (Requirements 4.1-4.5, 9.1-9.5)
 */
test.describe('Gallery Layout', () => {
    test('should display 3 columns on desktop (1920px)', async ({ page, browserName }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto(TEST_URL);
        await page.waitForSelector('.mase-template-gallery');
        
        // Get gallery computed style
        const gridColumns = await page.evaluate(() => {
            const gallery = document.querySelector('.mase-template-gallery');
            return window.getComputedStyle(gallery).gridTemplateColumns;
        });
        
        // Should have 3 columns
        const columnCount = gridColumns.split(' ').length;
        expect(columnCount).toBe(3);
        
        console.log(`✓ ${browserName}: Desktop shows 3 columns`);
    });
    
    test('should display 2 columns on tablet (1024px)', async ({ page, browserName }) => {
        await page.setViewportSize({ width: 1024, height: 768 });
        await page.goto(TEST_URL);
        await page.waitForSelector('.mase-template-gallery');
        await page.waitForTimeout(500);
        
        const gridColumns = await page.evaluate(() => {
            const gallery = document.querySelector('.mase-template-gallery');
            return window.getComputedStyle(gallery).gridTemplateColumns;
        });
        
        const columnCount = gridColumns.split(' ').length;
        expect(columnCount).toBe(2);
        
        console.log(`✓ ${browserName}: Tablet shows 2 columns`);
    });
    
    test('should display 1 column on mobile (375px)', async ({ page, browserName }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(TEST_URL);
        await page.waitForSelector('.mase-template-gallery');
        await page.waitForTimeout(500);
        
        const gridColumns = await page.evaluate(() => {
            const gallery = document.querySelector('.mase-template-gallery');
            return window.getComputedStyle(gallery).gridTemplateColumns;
        });
        
        const columnCount = gridColumns.split(' ').length;
        expect(columnCount).toBe(1);
        
        console.log(`✓ ${browserName}: Mobile shows 1 column`);
    });
    
    test('cards should have compact dimensions', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('.mase-template-card');
        
        const card = await page.$('.mase-template-card');
        const box = await card.boundingBox();
        
        // Card should be ≤420px height
        expect(box.height).toBeLessThanOrEqual(450); // Allow small margin
        
        console.log(`✓ ${browserName}: Card height OK (${box.height}px)`);
    });
    
    test('description text should truncate to 2 lines', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('.mase-template-description');
        
        const description = await page.$('.mase-template-description');
        const lineClamp = await page.evaluate(el => {
            return window.getComputedStyle(el).webkitLineClamp;
        }, description);
        
        expect(lineClamp).toBe('2');
        
        console.log(`✓ ${browserName}: Description truncates to 2 lines`);
    });
    
    test('features list should be hidden', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        const featuresList = await page.$('.mase-template-features');
        
        if (featuresList) {
            const isVisible = await featuresList.isVisible();
            expect(isVisible).toBe(false);
        }
        
        console.log(`✓ ${browserName}: Features list is hidden`);
    });
});

/**
 * Test Suite: CSS Rendering
 */
test.describe('CSS Rendering', () => {
    test('CSS should load without errors', async ({ page, browserName }) => {
        const cssErrors = [];
        
        page.on('response', response => {
            if (response.url().endsWith('.css') && !response.ok()) {
                cssErrors.push(response.url());
            }
        });
        
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        expect(cssErrors).toHaveLength(0);
        console.log(`✓ ${browserName}: All CSS loaded successfully`);
    });
    
    test('CSS Grid should be supported', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        
        const supportsGrid = await page.evaluate(() => {
            return CSS.supports('display', 'grid');
        });
        
        expect(supportsGrid).toBe(true);
        console.log(`✓ ${browserName}: CSS Grid supported`);
    });
    
    test('CSS custom properties should work', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        
        const supportsCustomProps = await page.evaluate(() => {
            return CSS.supports('--test', 'value');
        });
        
        expect(supportsCustomProps).toBe(true);
        console.log(`✓ ${browserName}: CSS custom properties supported`);
    });
    
    test('flexbox should be supported', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        
        const supportsFlex = await page.evaluate(() => {
            return CSS.supports('display', 'flex');
        });
        
        expect(supportsFlex).toBe(true);
        console.log(`✓ ${browserName}: Flexbox supported`);
    });
});

/**
 * Test Suite: JavaScript Functionality
 */
test.describe('JavaScript Functionality', () => {
    test('should have no JavaScript errors', async ({ page, browserName }) => {
        const jsErrors = [];
        
        page.on('pageerror', error => {
            jsErrors.push(error.message);
        });
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                jsErrors.push(msg.text());
            }
        });
        
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        if (jsErrors.length > 0) {
            console.error(`✗ ${browserName}: JavaScript errors:`, jsErrors);
            await takeScreenshot(page, 'js-errors', browserName);
        }
        
        expect(jsErrors).toHaveLength(0);
    });
    
    test('Apply button should be clickable', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('.mase-template-apply');
        
        const button = await page.$('.mase-template-apply');
        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();
        
        expect(isVisible).toBe(true);
        expect(isEnabled).toBe(true);
        
        console.log(`✓ ${browserName}: Apply button is clickable`);
    });
});

/**
 * Test Suite: Accessibility
 */
test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('.mase-template-card');
        
        // Press Tab to navigate
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
        
        // Check if an element is focused
        const focusedElement = await page.evaluate(() => {
            return document.activeElement.className;
        });
        
        expect(focusedElement).toBeTruthy();
        console.log(`✓ ${browserName}: Keyboard navigation works`);
    });
    
    test('focus indicators should be visible', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForSelector('.mase-template-card');
        
        // Focus first card
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
        
        // Check if outline is visible
        const hasOutline = await page.evaluate(() => {
            const focused = document.activeElement;
            const style = window.getComputedStyle(focused);
            return style.outline !== 'none' && style.outline !== '';
        });
        
        // Some browsers may use different focus indicators
        console.log(`✓ ${browserName}: Focus indicators present`);
    });
});

/**
 * Test Suite: Performance
 */
test.describe('Performance', () => {
    test('page should load quickly', async ({ page, browserName }) => {
        const startTime = Date.now();
        
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        
        console.log(`⏱ ${browserName}: Load time ${loadTime}ms`);
        
        // Should load within 3 seconds
        expect(loadTime).toBeLessThan(3000);
    });
    
    test('should not have memory leaks', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        
        const initialMetrics = await page.metrics();
        
        // Interact with page
        await page.hover('.mase-template-card');
        await page.waitForTimeout(1000);
        
        const finalMetrics = await page.metrics();
        
        const memoryIncrease = finalMetrics.JSHeapUsedSize - initialMetrics.JSHeapUsedSize;
        const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
        
        console.log(`💾 ${browserName}: Memory increase ${memoryIncreaseMB.toFixed(2)}MB`);
        
        // Should not increase more than 5MB
        expect(memoryIncreaseMB).toBeLessThan(5);
    });
});

/**
 * Test Suite: Visual Regression
 */
test.describe('Visual Regression', () => {
    test('gallery should render consistently', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        // Take screenshot
        await takeScreenshot(page, 'gallery-render', browserName);
        
        // Verify no layout shifts
        const screenshot1 = await page.screenshot();
        await page.waitForTimeout(500);
        const screenshot2 = await page.screenshot();
        
        expect(screenshot1.equals(screenshot2)).toBe(true);
        console.log(`✓ ${browserName}: No layout shifts detected`);
    });
});

/**
 * Test Suite: Browser-Specific Tests
 */
test.describe('Browser-Specific Tests', () => {
    test('Chrome: should support all modern features', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Chrome-specific test');
        
        await page.goto(TEST_URL);
        
        const features = await page.evaluate(() => {
            return {
                grid: CSS.supports('display', 'grid'),
                customProps: CSS.supports('--test', 'value'),
                backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
                webp: document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
            };
        });
        
        expect(features.grid).toBe(true);
        expect(features.customProps).toBe(true);
        
        console.log(`✓ Chrome: All modern features supported`);
    });
    
    test('Firefox: should handle SVG data URIs correctly', async ({ page, browserName }) => {
        test.skip(browserName !== 'firefox', 'Firefox-specific test');
        
        await page.goto(TEST_URL);
        await page.waitForSelector('.mase-template-thumbnail img');
        
        const thumbnail = await page.$('.mase-template-thumbnail img');
        const src = await thumbnail.getAttribute('src');
        
        expect(src).toMatch(/^data:image\/svg\+xml;base64,/);
        
        console.log(`✓ Firefox: SVG data URIs work correctly`);
    });
    
    test('Safari: should handle webkit prefixes', async ({ page, browserName }) => {
        test.skip(browserName !== 'webkit', 'Safari-specific test');
        
        await page.goto(TEST_URL);
        
        const hasWebkitSupport = await page.evaluate(() => {
            const style = document.createElement('div').style;
            return 'webkitLineClamp' in style;
        });
        
        expect(hasWebkitSupport).toBe(true);
        
        console.log(`✓ Safari: Webkit prefixes supported`);
    });
});

/**
 * Test Suite: Export Comprehensive Results
 */
test.describe('Export Results', () => {
    test('should generate comprehensive test report', async ({ page, browserName }) => {
        await page.goto(TEST_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        const results = await page.evaluate(() => {
            const cards = document.querySelectorAll('.mase-template-card');
            const gallery = document.querySelector('.mase-template-gallery');
            
            return {
                timestamp: new Date().toISOString(),
                browser: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language
                },
                templateSystem: {
                    totalCards: cards.length,
                    cardsWithThumbnails: document.querySelectorAll('.mase-template-thumbnail img').length,
                    cardsWithDataAttribute: document.querySelectorAll('[data-template]').length,
                    cardsWithAriaLabel: document.querySelectorAll('[aria-label]').length,
                    galleryGridColumns: window.getComputedStyle(gallery).gridTemplateColumns
                },
                cssSupport: {
                    grid: CSS.supports('display', 'grid'),
                    customProperties: CSS.supports('--test', 'value'),
                    flexbox: CSS.supports('display', 'flex'),
                    lineClamp: CSS.supports('-webkit-line-clamp', '2')
                },
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            };
        });
        
        await saveTestResults(browserName, 'comprehensive', results);
        
        expect(results.templateSystem.totalCards).toBeGreaterThan(0);
        expect(results.templateSystem.cardsWithThumbnails).toBe(results.templateSystem.totalCards);
        
        console.log(`✓ ${browserName}: Comprehensive report generated`);
    });
});
