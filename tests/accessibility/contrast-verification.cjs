/**
 * Color Contrast Verification Test
 * 
 * Verifies that all text and interactive elements meet WCAG 2.1 AA
 * contrast ratio requirements:
 * - Normal text: 4.5:1 minimum
 * - Large text (18px+ or 14px+ bold): 3:1 minimum
 * - Interactive elements: 3:1 minimum
 * 
 * Requirements: 11.1
 */

const { chromium } = require('playwright');

/**
 * Calculate relative luminance of an RGB color
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {number} Relative luminance (0-1)
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First color (hex or rgb)
 * @param {string} color2 - Second color (hex or rgb)
 * @returns {number} Contrast ratio (1-21)
 */
function getContrastRatio(color1, color2) {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse color string to RGB object
 * @param {string} color - Color string (hex, rgb, rgba)
 * @returns {object} RGB object {r, g, b}
 */
function parseColor(color) {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16)
    };
  }
  
  // Handle rgb/rgba colors
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    };
  }
  
  // Default to black if parsing fails
  return { r: 0, g: 0, b: 0 };
}

/**
 * Check if element meets contrast requirements
 * @param {object} element - Element data {selector, color, background, fontSize, fontWeight}
 * @returns {object} Result {passes, ratio, required, element}
 */
function checkContrast(element) {
  const ratio = getContrastRatio(element.color, element.background);
  
  // Determine required ratio based on text size
  const isLargeText = 
    element.fontSize >= 18 || 
    (element.fontSize >= 14 && element.fontWeight >= 700);
  
  const required = isLargeText ? 3.0 : 4.5;
  const passes = ratio >= required;
  
  return {
    passes,
    ratio: ratio.toFixed(2),
    required: required.toFixed(1),
    element: element.selector,
    color: element.color,
    background: element.background,
    fontSize: element.fontSize,
    fontWeight: element.fontWeight
  };
}

/**
 * Main test function
 */
async function runContrastTests() {
  console.log('='.repeat(80));
  console.log('MASE Accessibility: Color Contrast Verification');
  console.log('='.repeat(80));
  console.log('');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to MASE settings page
  const baseUrl = process.env.WP_BASE_URL || 'http://localhost:8080';
  await page.goto(`${baseUrl}/wp-admin/admin.php?page=modern-admin-styler`);
  
  // Wait for page to load
  await page.waitForSelector('.mase-header', { timeout: 10000 });
  
  console.log('Testing Light Mode Contrast Ratios...');
  console.log('-'.repeat(80));
  
  // Test elements in light mode
  const lightModeResults = await testElements(page, 'light');
  
  // Switch to dark mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  
  // Wait for dark mode to apply
  await page.waitForTimeout(500);
  
  console.log('');
  console.log('Testing Dark Mode Contrast Ratios...');
  console.log('-'.repeat(80));
  
  // Test elements in dark mode
  const darkModeResults = await testElements(page, 'dark');
  
  // Generate summary
  console.log('');
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  
  const lightPassed = lightModeResults.filter(r => r.passes).length;
  const lightFailed = lightModeResults.filter(r => !r.passes).length;
  const darkPassed = darkModeResults.filter(r => r.passes).length;
  const darkFailed = darkModeResults.filter(r => !r.passes).length;
  
  console.log(`Light Mode: ${lightPassed} passed, ${lightFailed} failed`);
  console.log(`Dark Mode: ${darkPassed} passed, ${darkFailed} failed`);
  console.log('');
  
  if (lightFailed > 0 || darkFailed > 0) {
    console.log('FAILED: Some elements do not meet WCAG AA contrast requirements');
    console.log('');
    console.log('Failed Elements:');
    console.log('-'.repeat(80));
    
    if (lightFailed > 0) {
      console.log('Light Mode:');
      lightModeResults.filter(r => !r.passes).forEach(r => {
        console.log(`  ${r.element}`);
        console.log(`    Ratio: ${r.ratio}:1 (required: ${r.required}:1)`);
        console.log(`    Color: ${r.color} on ${r.background}`);
      });
    }
    
    if (darkFailed > 0) {
      console.log('Dark Mode:');
      darkModeResults.filter(r => !r.passes).forEach(r => {
        console.log(`  ${r.element}`);
        console.log(`    Ratio: ${r.ratio}:1 (required: ${r.required}:1)`);
        console.log(`    Color: ${r.color} on ${r.background}`);
      });
    }
  } else {
    console.log('✓ PASSED: All elements meet WCAG AA contrast requirements');
  }
  
  await browser.close();
  
  return lightFailed === 0 && darkFailed === 0;
}

/**
 * Test all elements on the page
 * @param {object} page - Playwright page object
 * @param {string} mode - 'light' or 'dark'
 * @returns {array} Array of test results
 */
async function testElements(page, mode) {
  const selectors = [
    // Header elements
    '.mase-header h1',
    '.mase-version-badge',
    '.mase-subtitle',
    '.mase-header-toggle',
    '.button-primary',
    '.button-secondary',
    
    // Tab navigation
    '.mase-tab',
    '.mase-tab.active',
    '.mase-tab-label',
    
    // Section cards
    '.mase-section-card h2',
    '.mase-section-card .description',
    '.mase-setting-label',
    '.mase-setting-description',
    
    // Form controls
    'input[type="text"]',
    'select',
    '.mase-toggle-label',
    
    // Palette cards
    '.mase-palette-name',
    '.mase-active-badge',
    
    // Buttons
    '.mase-button-preview',
    '.mase-button-apply',
    
    // Links
    'a',
    
    // Helper text
    'small',
    '.mase-helper-text'
  ];
  
  const results = [];
  
  for (const selector of selectors) {
    try {
      const elements = await page.$$(selector);
      
      if (elements.length === 0) continue;
      
      // Test first element of each type
      const element = elements[0];
      
      const data = await page.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          selector: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ')[0] : ''),
          color: styles.color,
          background: styles.backgroundColor,
          fontSize: parseFloat(styles.fontSize),
          fontWeight: parseInt(styles.fontWeight)
        };
      }, element);
      
      // Get parent background if element background is transparent
      if (data.background === 'rgba(0, 0, 0, 0)' || data.background === 'transparent') {
        data.background = await page.evaluate((el) => {
          let parent = el.parentElement;
          while (parent) {
            const bg = window.getComputedStyle(parent).backgroundColor;
            if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
              return bg;
            }
            parent = parent.parentElement;
          }
          return 'rgb(255, 255, 255)'; // Default to white
        }, element);
      }
      
      const result = checkContrast(data);
      results.push(result);
      
      const status = result.passes ? '✓' : '✗';
      console.log(`${status} ${result.element}: ${result.ratio}:1 (required: ${result.required}:1)`);
      
    } catch (error) {
      console.log(`⚠ ${selector}: Could not test (${error.message})`);
    }
  }
  
  return results;
}

// Run tests if called directly
if (require.main === module) {
  runContrastTests()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Error running contrast tests:', error);
      process.exit(1);
    });
}

module.exports = { runContrastTests, getContrastRatio, checkContrast };
