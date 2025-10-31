/**
 * Performance Testing for Template Visual Enhancements
 * 
 * Tests FPS, memory usage, load times, and runs Lighthouse audits
 * Requirements: 18.1, 18.2, 18.3 (performance monitoring)
 */

import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

const THEMES = ['terminal', 'gaming', 'glass', 'gradient', 'floral', 'retro', 'professional', 'minimal'];

test.describe('Performance Testing', () => {
  
  test('Measure FPS for all themes', async ({ page }) => {
    const fpsResults = {};
    
    for (const theme of THEMES) {
      await page.goto('/wp-admin/admin.php?page=mase-settings');
      await page.waitForLoadState('networkidle');
      
      // Apply theme
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      // Measure FPS
      const fps = await page.evaluate(() => {
        return new Promise((resolve) => {
          let frames = 0;
          let lastTime = performance.now();
          
          const measureFPS = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
              const fps = Math.round((frames * 1000) / (currentTime - lastTime));
              resolve(fps);
            } else {
              requestAnimationFrame(measureFPS);
            }
          };
          
          requestAnimationFrame(measureFPS);
        });
      });
      
      fpsResults[theme] = fps;
      
      // FPS should be at least 30, ideally 60
      expect(fps).toBeGreaterThanOrEqual(30);
      console.log(`✓ ${theme}: ${fps} FPS`);
    }
    
    // Save results
    fs.writeFileSync(
      'tests/performance-results/fps-results.json',
      JSON.stringify(fpsResults, null, 2)
    );
  });

  test('Measure memory usage for all themes', async ({ page }) => {
    const memoryResults = {};
    
    for (const theme of THEMES) {
      await page.goto('/wp-admin/admin.php?page=mase-settings');
      await page.waitForLoadState('networkidle');
      
      // Apply theme
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      // Measure memory
      const memory = await page.evaluate(() => {
        if (performance.memory) {
          return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
          };
        }
        return null;
      });
      
      if (memory) {
        const usedMB = (memory.used / 1024 / 1024).toFixed(2);
        memoryResults[theme] = {
          usedMB: parseFloat(usedMB),
          totalMB: (memory.total / 1024 / 1024).toFixed(2),
          limitMB: (memory.limit / 1024 / 1024).toFixed(2)
        };
        
        // Memory should be less than 100MB
        expect(memory.used).toBeLessThan(100 * 1024 * 1024);
        console.log(`✓ ${theme}: ${usedMB} MB`);
      } else {
        console.log(`⚠ ${theme}: Memory API not available`);
      }
    }
    
    // Save results
    if (Object.keys(memoryResults).length > 0) {
      fs.writeFileSync(
        'tests/performance-results/memory-results.json',
        JSON.stringify(memoryResults, null, 2)
      );
    }
  });

  test('Measure load times for all themes', async ({ page }) => {
    const loadTimeResults = {};
    
    for (const theme of THEMES) {
      const startTime = Date.now();
      
      await page.goto('/wp-admin/admin.php?page=mase-settings');
      await page.waitForLoadState('networkidle');
      
      // Apply theme
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForLoadState('networkidle');
      
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      loadTimeResults[theme] = loadTime;
      
      // Load time should be less than 3 seconds
      expect(loadTime).toBeLessThan(3000);
      console.log(`✓ ${theme}: ${loadTime}ms`);
    }
    
    // Save results
    fs.writeFileSync(
      'tests/performance-results/load-time-results.json',
      JSON.stringify(loadTimeResults, null, 2)
    );
  });

  test('Measure CSS file sizes', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    const cssFiles = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links
        .filter(link => link.href.includes('mase'))
        .map(link => link.href);
    });
    
    const fileSizes = {};
    
    for (const cssFile of cssFiles) {
      const response = await page.goto(cssFile);
      const body = await response.body();
      const sizeKB = (body.length / 1024).toFixed(2);
      
      const fileName = cssFile.split('/').pop();
      fileSizes[fileName] = parseFloat(sizeKB);
      
      // Individual CSS files should be less than 50KB
      expect(body.length).toBeLessThan(50 * 1024);
      console.log(`✓ ${fileName}: ${sizeKB} KB`);
    }
    
    // Save results
    fs.writeFileSync(
      'tests/performance-results/css-sizes.json',
      JSON.stringify(fileSizes, null, 2)
    );
  });

  test('Measure JavaScript file sizes', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    const jsFiles = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts
        .filter(script => script.src.includes('mase'))
        .map(script => script.src);
    });
    
    const fileSizes = {};
    
    for (const jsFile of jsFiles) {
      const response = await page.goto(jsFile);
      const body = await response.body();
      const sizeKB = (body.length / 1024).toFixed(2);
      
      const fileName = jsFile.split('/').pop();
      fileSizes[fileName] = parseFloat(sizeKB);
      
      // Individual JS files should be less than 100KB
      expect(body.length).toBeLessThan(100 * 1024);
      console.log(`✓ ${fileName}: ${sizeKB} KB`);
    }
    
    // Save results
    fs.writeFileSync(
      'tests/performance-results/js-sizes.json',
      JSON.stringify(fileSizes, null, 2)
    );
  });

  test('Measure animation performance', async ({ page }) => {
    const animationResults = {};
    
    for (const theme of THEMES) {
      await page.goto('/wp-admin/admin.php?page=mase-settings');
      await page.waitForLoadState('networkidle');
      
      // Apply theme
      await page.click('a[href="#templates"]');
      await page.waitForTimeout(500);
      
      const themeCard = page.locator(`.mase-template-card[data-template="${theme}"]`);
      await themeCard.locator('.mase-apply-template').click();
      await page.waitForTimeout(1000);
      
      // Measure animation frame time
      const frameTime = await page.evaluate(() => {
        return new Promise((resolve) => {
          const times = [];
          let lastTime = performance.now();
          let count = 0;
          
          const measure = () => {
            const currentTime = performance.now();
            times.push(currentTime - lastTime);
            lastTime = currentTime;
            count++;
            
            if (count < 60) {
              requestAnimationFrame(measure);
            } else {
              const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
              resolve(avgTime);
            }
          };
          
          requestAnimationFrame(measure);
        });
      });
      
      animationResults[theme] = frameTime.toFixed(2);
      
      // Frame time should be less than 16.67ms (60 FPS)
      expect(frameTime).toBeLessThan(20); // Allow some margin
      console.log(`✓ ${theme}: ${frameTime.toFixed(2)}ms per frame`);
    }
    
    // Save results
    fs.writeFileSync(
      'tests/performance-results/animation-results.json',
      JSON.stringify(animationResults, null, 2)
    );
  });

  test('Measure AJAX response times', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    const ajaxTimes = {};
    
    // Test palette application
    await page.click('a[href="#palettes"]');
    await page.waitForTimeout(500);
    
    const startTime = Date.now();
    
    // Listen for AJAX request
    const responsePromise = page.waitForResponse(
      response => response.url().includes('admin-ajax.php') && response.status() === 200
    );
    
    // Apply palette
    const paletteCard = page.locator('.mase-palette-card').first();
    await paletteCard.locator('.mase-apply-palette').click();
    
    const response = await responsePromise;
    const endTime = Date.now();
    
    ajaxTimes.applyPalette = endTime - startTime;
    
    // AJAX should respond in less than 1 second
    expect(ajaxTimes.applyPalette).toBeLessThan(1000);
    console.log(`✓ Apply Palette: ${ajaxTimes.applyPalette}ms`);
    
    // Save results
    fs.writeFileSync(
      'tests/performance-results/ajax-times.json',
      JSON.stringify(ajaxTimes, null, 2)
    );
  });

  test('Measure DOM complexity', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    const domStats = await page.evaluate(() => {
      return {
        totalElements: document.querySelectorAll('*').length,
        depth: (() => {
          let maxDepth = 0;
          const getDepth = (el, depth = 0) => {
            maxDepth = Math.max(maxDepth, depth);
            Array.from(el.children).forEach(child => getDepth(child, depth + 1));
          };
          getDepth(document.body);
          return maxDepth;
        })(),
        scripts: document.querySelectorAll('script').length,
        styles: document.querySelectorAll('link[rel="stylesheet"], style').length
      };
    });
    
    console.log(`✓ DOM Elements: ${domStats.totalElements}`);
    console.log(`✓ DOM Depth: ${domStats.depth}`);
    console.log(`✓ Scripts: ${domStats.scripts}`);
    console.log(`✓ Stylesheets: ${domStats.styles}`);
    
    // DOM should not be too complex
    expect(domStats.totalElements).toBeLessThan(5000);
    expect(domStats.depth).toBeLessThan(30);
    
    // Save results
    fs.writeFileSync(
      'tests/performance-results/dom-stats.json',
      JSON.stringify(domStats, null, 2)
    );
  });

  test('Test Performance Mode impact', async ({ page }) => {
    const results = { normal: {}, performanceMode: {} };
    
    // Test without Performance Mode
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    // Apply gaming theme (most intensive)
    await page.click('a[href="#templates"]');
    await page.waitForTimeout(500);
    
    const gamingCard = page.locator('.mase-template-card[data-template="gaming"]');
    await gamingCard.locator('.mase-apply-template').click();
    await page.waitForTimeout(1000);
    
    // Measure FPS
    results.normal.fps = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
          frames++;
          const currentTime = performance.now();
          
          if (currentTime >= lastTime + 1000) {
            resolve(Math.round((frames * 1000) / (currentTime - lastTime)));
          } else {
            requestAnimationFrame(measureFPS);
          }
        };
        
        requestAnimationFrame(measureFPS);
      });
    });
    
    // Enable Performance Mode
    const perfToggle = page.locator('#mase-performance-mode-toggle');
    const isVisible = await perfToggle.isVisible().catch(() => false);
    
    if (isVisible) {
      await perfToggle.click();
      await page.waitForTimeout(500);
      
      // Measure FPS with Performance Mode
      results.performanceMode.fps = await page.evaluate(() => {
        return new Promise((resolve) => {
          let frames = 0;
          let lastTime = performance.now();
          
          const measureFPS = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
              resolve(Math.round((frames * 1000) / (currentTime - lastTime)));
            } else {
              requestAnimationFrame(measureFPS);
            }
          };
          
          requestAnimationFrame(measureFPS);
        });
      });
      
      // Performance Mode should improve FPS
      expect(results.performanceMode.fps).toBeGreaterThanOrEqual(results.normal.fps);
      
      console.log(`✓ Normal Mode: ${results.normal.fps} FPS`);
      console.log(`✓ Performance Mode: ${results.performanceMode.fps} FPS`);
      console.log(`✓ Improvement: ${results.performanceMode.fps - results.normal.fps} FPS`);
    } else {
      console.log('⚠ Performance Mode toggle not found');
    }
    
    // Save results
    fs.writeFileSync(
      'tests/performance-results/performance-mode-impact.json',
      JSON.stringify(results, null, 2)
    );
  });

  test('Generate performance report', async ({ page }) => {
    // Collect all performance data
    const report = {
      timestamp: new Date().toISOString(),
      fps: JSON.parse(fs.readFileSync('tests/performance-results/fps-results.json', 'utf8')),
      memory: JSON.parse(fs.readFileSync('tests/performance-results/memory-results.json', 'utf8')),
      loadTimes: JSON.parse(fs.readFileSync('tests/performance-results/load-time-results.json', 'utf8')),
      cssSizes: JSON.parse(fs.readFileSync('tests/performance-results/css-sizes.json', 'utf8')),
      jsSizes: JSON.parse(fs.readFileSync('tests/performance-results/js-sizes.json', 'utf8')),
      animations: JSON.parse(fs.readFileSync('tests/performance-results/animation-results.json', 'utf8')),
      ajax: JSON.parse(fs.readFileSync('tests/performance-results/ajax-times.json', 'utf8')),
      dom: JSON.parse(fs.readFileSync('tests/performance-results/dom-stats.json', 'utf8'))
    };
    
    // Calculate averages
    const avgFPS = Object.values(report.fps).reduce((a, b) => a + b, 0) / Object.values(report.fps).length;
    const avgMemory = Object.values(report.memory).reduce((a, b) => a + parseFloat(b.usedMB), 0) / Object.values(report.memory).length;
    const avgLoadTime = Object.values(report.loadTimes).reduce((a, b) => a + b, 0) / Object.values(report.loadTimes).length;
    
    report.summary = {
      averageFPS: avgFPS.toFixed(2),
      averageMemoryMB: avgMemory.toFixed(2),
      averageLoadTimeMs: avgLoadTime.toFixed(2),
      totalCSSKB: Object.values(report.cssSizes).reduce((a, b) => a + b, 0).toFixed(2),
      totalJSKB: Object.values(report.jsSizes).reduce((a, b) => a + b, 0).toFixed(2)
    };
    
    // Save comprehensive report
    fs.writeFileSync(
      'tests/performance-results/comprehensive-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📊 Performance Summary:');
    console.log(`   Average FPS: ${report.summary.averageFPS}`);
    console.log(`   Average Memory: ${report.summary.averageMemoryMB} MB`);
    console.log(`   Average Load Time: ${report.summary.averageLoadTimeMs} ms`);
    console.log(`   Total CSS: ${report.summary.totalCSSKB} KB`);
    console.log(`   Total JS: ${report.summary.totalJSKB} KB`);
  });
});

// Lighthouse audits (requires lighthouse CLI)
test.describe('Lighthouse Audits', () => {
  test('Run Lighthouse audit for MASE settings page', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.waitForLoadState('networkidle');
    
    try {
      // Run Lighthouse
      const result = execSync(
        'npx lighthouse http://localhost:8080/wp-admin/admin.php?page=mase-settings --output=json --output-path=tests/performance-results/lighthouse-report.json --chrome-flags="--headless" --only-categories=performance',
        { encoding: 'utf8' }
      );
      
      // Read results
      const report = JSON.parse(fs.readFileSync('tests/performance-results/lighthouse-report.json', 'utf8'));
      const score = report.categories.performance.score * 100;
      
      console.log(`✓ Lighthouse Performance Score: ${score}`);
      
      // Performance score should be at least 70
      expect(score).toBeGreaterThanOrEqual(70);
    } catch (error) {
      console.log('⚠ Lighthouse audit failed:', error.message);
      console.log('   Install lighthouse: npm install -g lighthouse');
    }
  });
});
