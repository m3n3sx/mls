/**
 * Theme Variants Contrast Verification
 * 
 * Verifies that all theme variants meet WCAG 2.1 AA contrast requirements:
 * - Normal text: 4.5:1 minimum
 * - Large text (18px+ or 14px+ bold): 3:1 minimum
 * - Interactive elements: 3:1 minimum
 * 
 * Tests all theme variants across all templates
 * Requirements: 17.1
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Calculate relative luminance of an RGB color
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
 */
function parseColor(color) {
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16)
    };
  }
  
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    };
  }
  
  return { r: 0, g: 0, b: 0 };
}

/**
 * Theme variants configuration
 */
const THEME_VARIANTS = {
  terminal: ['green', 'blue', 'amber', 'red'],
  gaming: ['cyberpunk', 'neon', 'matrix'],
  glass: ['clear', 'blue', 'purple'],
  gradient: ['warm', 'cool', 'sunset'],
  floral: ['rose', 'lavender', 'sakura'],
  retro: ['classic', 'synthwave', 'vaporwave'],
  professional: ['corporate', 'executive', 'modern'],
  minimal: ['light', 'dark', 'monochrome']
};

/**
 * Test elements to check
 */
const TEST_SELECTORS = [
  { selector: '.mase-header h1', type: 'heading' },
  { selector: '.mase-subtitle', type: 'text' },
  { selector: '.button-primary', type: 'button' },
  { selector: '.button-secondary', type: 'button' },
  { selector: '.mase-tab', type: 'interactive' },
  { selector: '.mase-tab.active', type: 'interactive' },
  { selector: '.mase-section-card h2', type: 'heading' },
  { selector: '.mase-setting-label', type: 'text' },
  { selector: '.mase-setting-description', type: 'text' },
  { selector: 'input[type="text"]', type: 'input' },
  { selector: '.mase-palette-name', type: 'text' },
  { selector: 'a', type: 'link' }
];

/**
 * Check contrast for a single element
 */
async function checkElementContrast(page, selector) {
  try {
    const element = await page.$(selector);
    if (!element) return null;
    
    const data = await page.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      let background = styles.backgroundColor;
      
      // Get parent background if transparent
      if (background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
        let parent = el.parentElement;
        while (parent) {
          const bg = window.getComputedStyle(parent).backgroundColor;
          if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            background = bg;
            break;
          }
          parent = parent.parentElement;
        }
        if (background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
          background = 'rgb(255, 255, 255)';
        }
      }
      
      return {
        color: styles.color,
        background: background,
        fontSize: parseFloat(styles.fontSize),
        fontWeight: parseInt(styles.fontWeight)
      };
    }, element);
    
    const ratio = getContrastRatio(data.color, data.background);
    const isLargeText = data.fontSize >= 18 || (data.fontSize >= 14 && data.fontWeight >= 700);
    const required = isLargeText ? 3.0 : 4.5;
    const passes = ratio >= required;
    
    return {
      selector,
      passes,
      ratio: ratio.toFixed(2),
      required: required.toFixed(1),
      color: data.color,
      background: data.background,
      fontSize: data.fontSize,
      fontWeight: data.fontWeight
    };
  } catch (error) {
    return null;
  }
}

/**
 * Test a single theme variant
 */
async function testThemeVariant(page, theme, variant) {
  // Apply theme variant
  await page.evaluate(({ theme, variant }) => {
    document.documentElement.setAttribute('data-template', theme);
    document.documentElement.setAttribute('data-variant', variant);
  }, { theme, variant });
  
  // Wait for styles to apply
  await page.waitForTimeout(500);
  
  const results = [];
  
  for (const { selector, type } of TEST_SELECTORS) {
    const result = await checkElementContrast(page, selector);
    if (result) {
      result.type = type;
      results.push(result);
    }
  }
  
  return results;
}

/**
 * Main test function
 */
async function runThemeVariantContrastTests() {
  console.log('='.repeat(80));
  console.log('MASE Accessibility: Theme Variants Contrast Verification');
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
  
  const allResults = {};
  const issues = [];
  
  // Test each theme and its variants
  for (const [theme, variants] of Object.entries(THEME_VARIANTS)) {
    console.log(`\nTesting ${theme.toUpperCase()} theme variants...`);
    console.log('-'.repeat(80));
    
    allResults[theme] = {};
    
    for (const variant of variants) {
      console.log(`  Variant: ${variant}`);
      
      const results = await testThemeVariant(page, theme, variant);
      allResults[theme][variant] = results;
      
      const passed = results.filter(r => r.passes).length;
      const failed = results.filter(r => !r.passes).length;
      
      console.log(`    ✓ Passed: ${passed}`);
      
      if (failed > 0) {
        console.log(`    ✗ Failed: ${failed}`);
        
        results.filter(r => !r.passes).forEach(r => {
          console.log(`      - ${r.selector}: ${r.ratio}:1 (required: ${r.required}:1)`);
          issues.push({
            theme,
            variant,
            ...r
          });
        });
      }
    }
  }
  
  // Generate summary
  console.log('');
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  
  const totalThemes = Object.keys(THEME_VARIANTS).length;
  const totalVariants = Object.values(THEME_VARIANTS).reduce((sum, v) => sum + v.length, 0);
  
  console.log(`Total themes tested: ${totalThemes}`);
  console.log(`Total variants tested: ${totalVariants}`);
  console.log(`Total issues found: ${issues.length}`);
  console.log('');
  
  if (issues.length > 0) {
    console.log('FAILED: Some theme variants do not meet WCAG AA contrast requirements');
    console.log('');
    console.log('Issues by theme:');
    console.log('-'.repeat(80));
    
    const issuesByTheme = {};
    issues.forEach(issue => {
      if (!issuesByTheme[issue.theme]) {
        issuesByTheme[issue.theme] = {};
      }
      if (!issuesByTheme[issue.theme][issue.variant]) {
        issuesByTheme[issue.theme][issue.variant] = [];
      }
      issuesByTheme[issue.theme][issue.variant].push(issue);
    });
    
    for (const [theme, variants] of Object.entries(issuesByTheme)) {
      console.log(`\n${theme.toUpperCase()}:`);
      for (const [variant, variantIssues] of Object.entries(variants)) {
        console.log(`  ${variant}:`);
        variantIssues.forEach(issue => {
          console.log(`    ${issue.selector}`);
          console.log(`      Ratio: ${issue.ratio}:1 (required: ${issue.required}:1)`);
          console.log(`      Color: ${issue.color} on ${issue.background}`);
        });
      }
    }
    
    // Save detailed report
    const reportPath = path.join(__dirname, 'contrast-issues-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      issues: issues,
      allResults: allResults
    }, null, 2));
    
    console.log('');
    console.log(`Detailed report saved to: ${reportPath}`);
  } else {
    console.log('✓ PASSED: All theme variants meet WCAG AA contrast requirements');
  }
  
  await browser.close();
  
  return issues.length === 0;
}

// Run tests if called directly
if (require.main === module) {
  runThemeVariantContrastTests()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Error running theme variant contrast tests:', error);
      process.exit(1);
    });
}

module.exports = { runThemeVariantContrastTests };
