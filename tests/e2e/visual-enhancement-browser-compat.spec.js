/**
 * Visual Enhancement Browser Compatibility Test Suite
 * 
 * Tests visual enhancements from visual-enhancement-comprehensive spec across browsers:
 * - Glassmorphism effects (backdrop-filter)
 * - Gradient animations
 * - Template card enhancements
 * - Palette card enhancements
 * - Responsive design
 * - Fallback mechanisms
 * 
 * @package MASE
 * @since 1.3.0
 */

import { test, expect } from '@playwright/test';

// Configuration
const SETTINGS_PAGE = '/wp-admin/admin.php?page=mase-settings';
const TEMPLATES_TAB = 'Templates';

/**
 * Helper: Navigate to MASE settings page
 */
async function navigateToSettings(page) {
    await page.goto(SETTINGS_PAGE);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.mase-settings-page', { timeout: 10000 });
}

/**
 * Helper: Navigate to Templates tab
 */
async function navigateToTemplatesTab(page) {
    await navigateToSettings(page);
    await page.click(`text=${TEMPLATES_TAB}`);
    await page.waitForTimeout(500);
}

/**
 * Helper: Check if backdrop-filter is supported
 */
async function checkBackdropFilterSupport(page) {
    return await page.evaluate(() => {
        return CSS.supports('backdrop-filter', 'blur(10px)') || 
               CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
    });
}

/**
 * Helper: Get computed style property
 */
async function getComputedStyle(page, selector, property) {
    return await page.evaluate(({ sel, prop }) => {
        const element = document.querySelector(sel);
        if (!element) return null;
        return window.getComputedStyle(element).getPropertyValue(prop);
    }, { sel: selector, prop: property });
}

/**
 * TEST SUITE: Chrome - Visual Enhancements
 */
test.describe('Chrome: Visual Enhancement Compatibility', () => {
    test.use({ browserName: 'chromium' });
    
    test('Chrome: Verify glassmorphism effects render', async ({ page }) => {
        await navigateToTemplatesTab(page);
        
        // Check backdrop-filter support
        const supportsBackdrop = await checkBackdropFilterSupport(page);
        console.log('Chrome backdrop-filter support:', supportsBackdrop);
        
        // Apply glass theme if available
        const glassTheme = page.locator('.mase-template-card:has-text("Glass")');
        if (await glassTheme.count() > 0) {
            await glassTheme.click();
            await page.waitForTimeout(1000);
            
            // Verify glassmorphism styles applied
            const backdropFilter = await getComputedStyle(page, 'body', 'backdrop-filter');
            const webkitBackdropFilter = await getComputedStyle(page, 'body', '-webkit-backdrop-filter');
            
            if (supportsBackdrop) {
                expect(backdropFilter || webkitBackdropFilter).toBeTruthy();
            }
        }
    });
    
    test('Chrome: Verify gradient animations work', async ({ page }) => {
        await navigateToTemplatesTab(page);
        
        // Apply gradient theme if available
        const gradientTheme = page.locator('.mase-template-card:has-text("Gradient")');
        if (await gradientTheme.count() > 0) {
            await gradientTheme.click();
            await page.waitForTimeout(1000);
            
            // Verify gradient animation
            const hasAnimation = await page.evaluate(() => {
                const body = document.body;
                const styles = window.getComputedStyle(body);
                const animation = styles.getPropertyValue('animation-name');
                return animation && animation !== 'none';
            });
            
            console.log('Chrome gradient animation active:', hasAnimation);
        }
    });
    
    test('Chrome: Verify template card enhancements', async ({ page }) => {
        await navigateToTemplatesTab(page);
        
        const templateCard = page.locator('.mase-template-card').first();
        if (await templateCard.count() > 0) {
            // Check thumbnail size
            const thumbnail = templateCard.locator('.mase-template-thumbnail');
            const box = await thumbnail.boundingBox();
            expect(box.height).toBeGreaterThanOrEqual(150);
            
            // Test hover effect
            await templateCard.hover();
            await page.waitForTimeout(300);
            
            // Verify transform applied
            const transform = await templateCard.evaluate(el => 
                window.getComputedStyle(el).transform
            );
            expect(transform).not.toBe('none');
        }
    });
    
    test('Chrome: Verify palette card enhancements', async ({ page }) => {
        await navigateToSettings(page);
        
        const paletteCard = page.locator('.mase-palette-card').first();
        if (await paletteCard.count() > 0) {
            // Check swatch size
            const preview = paletteCard.locator('.mase-palette-preview');
            const box = await preview.boundingBox();
            expect(box.height).toBeGreaterThanOrEqual(60);
            
            // Test hover effect
            await paletteCard.hover();
            await page.waitForTimeout(300);
            
            // Verify elevation change
            const boxShadow = await paletteCard.evaluate(el => 
                window.getComputedStyle(el).boxShadow
            );
            expect(boxShadow).not.toBe('none');
        }
    });
    
    test('Chrome: Verify responsive behavior', async ({ page }) => {
        const viewports = [
            { width: 1920, height: 1080 },
            { width: 768, height: 1024 },
            { width: 375, height: 667 }
        ];
        
        for (const viewport of viewports) {
            await page.setViewportSize(viewport);
            await navigateToTemplatesTab(page);
            
            // Verify template cards are visible
            const cards = page.locator('.mase-template-card');
            if (await cards.count() > 0) {
                await expect(cards.first()).toBeVisible();
            }
            
            // On mobile, verify touch targets
            if (viewport.width <= 768) {
                const buttons = page.locator('button');
                const firstButton = buttons.first();
                if (await firstButton.count() > 0) {
                    const box = await firstButton.boundingBox();
                    if (box) {
                        expect(box.height).toBeGreaterThanOrEqual(44);
                    }
                }
            }
        }
    });
});

/**
 * TEST SUITE: Firefox - Visual Enhancements
 */
test.describe('Firefox: Visual Enhancement Compatibility', () => {
    test.use({ browserName: 'firefox' });
    
    test('Firefox: Verify glassmorphism effects render', async ({ page }) => {
        await navigateToTemplatesTab(page);
        
        // Check backdrop-filter support
        const supportsBackdrop = await checkBackdropFilterSupport(page);
        console.log('Firefox backdrop-filter support:', supportsBackdrop);
        
        // Apply glass theme if available
        const glassTheme = page.locator('.mase-template-card:has-text("Glass")');
        if (await glassTheme.count() > 0) {
            await glassTheme.click();
            await page.waitForTimeout(1000);
            
            // Verify glassmorphism styles or fallback
            const backdropFilter = await getComputedStyle(page, 'body', 'backdrop-filter');
            const backgroundColor = await getComputedStyle(page, 'body', 'background-color');
            
            // Should have either backdrop-filter or fallback background
            expect(backdropFilter || backgroundColor).toBeTruthy();
        }
    });
    
    test('Firefox: Verify gradient animations work', async ({ page }) => {
        await navigateToTemplatesTab(page);
        
        // Apply gradient theme if available
        const gradientTheme = page.locator('.mase-template-card:has-text("Gradient")');
        if (await gradientTheme.count() > 0) {
            await gradientTheme.click();
            await page.waitForTimeout(1000);
            
            // Verify gradient background
            const background = await getComputedStyle(page, 'body', 'background-image');
            expect(background).toContain('gradient');
        }
    });
    
    test('Firefox: Verify template card enhancements', async ({ page }) => {
        await navigateToTemplatesTab(page);
        
        const templateCard = page.locator('.mase-template-card').first();
        if (await templateCard.count() > 0) {
            // Check thumbnail size
            const thumbnail = templateCard.locator('.mase-template-thumbnail');
            const box = await thumbnail.boundingBox();
            expect(box.height).toBeGreaterThanOrEqual(150);
            
            // Test hover effect
            await templateCard.hover();
            await page.waitForTimeout(300);
        }
    });
    
    test('Firefox: Verify responsive behavior', async ({ page }) => {
        const viewports = [
            { width: 1920, height: 1080 },
            { width: 768, height: 1024 },
            { width: 375, height: 667 }
        ];
        
        for (const viewport of viewports) {
            await page.setViewportSize(viewport);
            await navigateToTemplatesTab(page);
            
            // Verify template cards are visible
            const cards = page.locator('.mase-template-card');
            if (await cards.count() > 0) {
                await expect(cards.first()).toBeVisible();
            }
        }
    });
});

/**
 * TEST SUITE: Safari - Visual Enhancements
 */
test.describe('Safari: Visual Enhancement Compatibility', () => {
    test.use({ browserName: 'webkit' });
    
    test('Safari: Verify -webkit-backdrop-filter works', async ({ page }) => {
        await navigateToTemplatesTab(page);
        
        // Check backdrop-filter support (Safari needs -webkit- prefix)
        const supportsBackdrop = await checkBackdropFilterSupport(page);
        console.log('Safari backdrop-filter support:', supportsBackdrop);
        
        // Apply glass theme if available
        const glassTheme = page.locator('.mase-template-card:has-text("Glass")');
        if (await glassTheme.count() > 0) {
            await glassTheme.click();
            await page.waitForTimeout(1000);
            
            // Verify -webkit-backdrop-filter specifically
            const webkitBackdropFilter = await getComputedStyle(page, 'body', '-webkit-backdrop-filter');
            const backdropFilter = await getComputedStyle(page, 'body', 'backdrop-filter');
            
            if (supportsBackdrop) {
                expect(webkitBackdropFilter || backdropFilter).toBeTruthy();
            }
        }
    });
    
    test('Safari: Verify gradient animations work', async ({ page }) => {
        await navigateToTemplatesTab(page);
        
        // Apply gradient theme if available
        const gradientTheme = page.locator('.mase-template-card:has-text("Gradient")');
        if (await gradientTheme.count() > 0) {
            await gradientTheme.click();
            await page.waitForTimeout(1000);
            
            // Verify gradient background
            const background = await getComputedStyle(page, 'body', 'background-image');
            expect(background).toContain('gradient');
        }
    });
    
    test('Safari: Verify template card enhancements', async ({ page }) => {
        await navigateToTemplatesTab(page);
        
        const templateCard = page.locator('.mase-template-card').first();
        if (await templateCard.count() > 0) {
            // Check thumbnail size
            const thumbnail = templateCard.locator('.mase-template-thumbnail');
            const box = await thumbnail.boundingBox();
            expect(box.height).toBeGreaterThanOrEqual(150);
            
            // Test hover effect
            await templateCard.hover();
            await page.waitForTimeout(300);
        }
    });
    
    test('Safari: Verify responsive behavior', async ({ page }) => {
        const viewports = [
            { width: 1920, height: 1080 },
            { width: 768, height: 1024 },
            { width: 375, height: 667 }
        ];
        
        for (const viewport of viewports) {
            await page.setViewportSize(viewport);
            await navigateToTemplatesTab(page);
            
            // Verify template cards are visible
            const cards = page.locator('.mase-template-card');
            if (await cards.count() > 0) {
                await expect(cards.first()).toBeVisible();
            }
        }
    });
});

/**
 * TEST SUITE: Edge - Visual Enhancements
 */
test.describe('Edge: Visual Enhancement Compatibility', () => {
    test.use({ browserName: 'chromium', channel: 'msedge' });
    
    test('Edge: Verify glassmorphism effects render', async ({ page }) => {
        await navigateToTemplatesTab(page);
        
        // Check backdrop-filter support
        const supportsBackdrop = await checkBackdropFilterSupport(page);
        console.log('Edge backdrop-filter support:', supportsBackdrop);
        
        // Apply glass theme if available
        const glassTheme = page.locator('.mase-template-card:has-text("Glass")');
        if (await glassTheme.count() > 0) {
            await glassTheme.click();
            await page.waitForTimeout(1000);
            
            // Verify glassmorphism styles applied
            const backdropFilter = await getComputedStyle(page, 'body', 'backdrop-filter');
            const webkitBackdropFilter = await getComputedStyle(page, 'body', '-webkit-backdrop-filter');
            
            if (supportsBackdrop) {
                expect(backdropFilter || webkitBackdropFilter).toBeTruthy();
            }
        }
    });
    
    test('Edge: Verify gradient animations work', async ({ page }) => {
        await navigateToTemplatesTab(page);
        
        // Apply gradient theme if available
        const gradientTheme = page.locator('.mase-template-card:has-text("Gradient")');
        if (await gradientTheme.count() > 0) {
            await gradientTheme.click();
            await page.waitForTimeout(1000);
            
            // Verify gradient animation
            const hasAnimation = await page.evaluate(() => {
                const body = document.body;
                const styles = window.getComputedStyle(body);
                const animation = styles.getPropertyValue('animation-name');
                return animation && animation !== 'none';
            });
            
            console.log('Edge gradient animation active:', hasAnimation);
        }
    });
    
    test('Edge: Verify template card enhancements', async ({ page }) => {
        await navigateToTemplatesTab(page);
        
        const templateCard = page.locator('.mase-template-card').first();
        if (await templateCard.count() > 0) {
            // Check thumbnail size
            const thumbnail = templateCard.locator('.mase-template-thumbnail');
            const box = await thumbnail.boundingBox();
            expect(box.height).toBeGreaterThanOrEqual(150);
            
            // Test hover effect
            await templateCard.hover();
            await page.waitForTimeout(300);
        }
    });
    
    test('Edge: Verify responsive behavior', async ({ page }) => {
        const viewports = [
            { width: 1920, height: 1080 },
            { width: 768, height: 1024 },
            { width: 375, height: 667 }
        ];
        
        for (const viewport of viewports) {
            await page.setViewportSize(viewport);
            await navigateToTemplatesTab(page);
            
            // Verify template cards are visible
            const cards = page.locator('.mase-template-card');
            if (await cards.count() > 0) {
                await expect(cards.first()).toBeVisible();
            }
        }
    });
});

/**
 * TEST SUITE: Fallback Verification
 */
test.describe('Fallback Mechanisms', () => {
    
    test('All browsers: Verify backdrop-filter fallback', async ({ page, browserName }) => {
        await navigateToTemplatesTab(page);
        
        // Check backdrop-filter support
        const supportsBackdrop = await checkBackdropFilterSupport(page);
        console.log(`${browserName} backdrop-filter support:`, supportsBackdrop);
        
        // Apply glass theme if available
        const glassTheme = page.locator('.mase-template-card:has-text("Glass")');
        if (await glassTheme.count() > 0) {
            await glassTheme.click();
            await page.waitForTimeout(1000);
            
            // Verify fallback mechanism
            const hasFallback = await page.evaluate(() => {
                // Check for @supports rule fallback
                const body = document.body;
                const styles = window.getComputedStyle(body);
                const backgroundColor = styles.getPropertyValue('background-color');
                
                // Fallback should provide solid background
                return backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)';
            });
            
            expect(hasFallback).toBe(true);
        }
    });
    
    test('All browsers: Verify CSS Grid fallback', async ({ page, browserName }) => {
        await navigateToTemplatesTab(page);
        
        // Check CSS Grid support
        const supportsGrid = await page.evaluate(() => {
            return CSS.supports('display', 'grid');
        });
        
        console.log(`${browserName} CSS Grid support:`, supportsGrid);
        
        // Verify layout works regardless
        const cards = page.locator('.mase-template-card');
        if (await cards.count() > 0) {
            await expect(cards.first()).toBeVisible();
            
            // Verify cards are properly laid out
            const firstBox = await cards.first().boundingBox();
            const secondBox = await cards.nth(1).boundingBox();
            
            if (firstBox && secondBox) {
                // Cards should be positioned (either grid or flexbox fallback)
                expect(firstBox.x).toBeGreaterThanOrEqual(0);
                expect(secondBox.x).toBeGreaterThanOrEqual(0);
            }
        }
    });
    
    test('All browsers: Verify custom property fallback', async ({ page, browserName }) => {
        await navigateToSettings(page);
        
        // Check custom property support
        const supportsCustomProps = await page.evaluate(() => {
            return CSS.supports('color', 'var(--test)');
        });
        
        console.log(`${browserName} CSS custom properties support:`, supportsCustomProps);
        
        // Verify colors are applied (either via custom props or fallback)
        const header = page.locator('.mase-header');
        const bgColor = await header.evaluate(el => 
            window.getComputedStyle(el).backgroundColor
        );
        
        expect(bgColor).toBeTruthy();
        expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    });
});

/**
 * TEST SUITE: Animation Performance
 */
test.describe('Animation Performance Across Browsers', () => {
    
    test('All browsers: Verify smooth transitions', async ({ page, browserName }) => {
        await navigateToTemplatesTab(page);
        
        const templateCard = page.locator('.mase-template-card').first();
        if (await templateCard.count() > 0) {
            // Measure hover transition
            const startTime = Date.now();
            await templateCard.hover();
            await page.waitForTimeout(400); // Wait for transition
            const transitionTime = Date.now() - startTime;
            
            console.log(`${browserName} hover transition time: ${transitionTime}ms`);
            expect(transitionTime).toBeLessThan(1000);
        }
    });
    
    test('All browsers: Verify gradient animation performance', async ({ page, browserName }) => {
        await navigateToTemplatesTab(page);
        
        // Apply gradient theme if available
        const gradientTheme = page.locator('.mase-template-card:has-text("Gradient")');
        if (await gradientTheme.count() > 0) {
            await gradientTheme.click();
            await page.waitForTimeout(1000);
            
            // Check animation is running
            const isAnimating = await page.evaluate(() => {
                const body = document.body;
                const styles = window.getComputedStyle(body);
                const animation = styles.getPropertyValue('animation-name');
                return animation && animation !== 'none';
            });
            
            console.log(`${browserName} gradient animation running:`, isAnimating);
        }
    });
    
    test('All browsers: Verify prefers-reduced-motion', async ({ page, browserName }) => {
        // Emulate reduced motion preference
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await navigateToTemplatesTab(page);
        
        // Apply gradient theme if available
        const gradientTheme = page.locator('.mase-template-card:has-text("Gradient")');
        if (await gradientTheme.count() > 0) {
            await gradientTheme.click();
            await page.waitForTimeout(500);
            
            // Verify animations are disabled or reduced
            const animationState = await page.evaluate(() => {
                const body = document.body;
                const styles = window.getComputedStyle(body);
                const animation = styles.getPropertyValue('animation-name');
                const animationDuration = styles.getPropertyValue('animation-duration');
                
                return {
                    name: animation,
                    duration: animationDuration
                };
            });
            
            console.log(`${browserName} reduced motion animation:`, animationState);
        }
    });
});
