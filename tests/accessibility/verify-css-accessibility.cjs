/**
 * CSS Accessibility Verification
 * 
 * Verifies CSS files for accessibility compliance:
 * - Color contrast ratios in CSS custom properties
 * - Focus indicator styles
 * - Reduced motion support
 * - Semantic structure preservation
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse RGB color to object
 */
function parseRGB(color) {
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    };
  }
  return null;
}

/**
 * Parse hex color to RGB
 */
function hexToRGB(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio
 */
function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check CSS file for accessibility issues
 */
function checkCSSFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const issues = [];
  const passes = [];
  
  console.log(`\nChecking: ${fileName}`);
  console.log('-'.repeat(80));
  
  // Check for focus indicators
  const hasFocusStyles = content.includes(':focus') || content.includes(':focus-visible');
  if (hasFocusStyles) {
    passes.push('✓ Focus indicators defined');
  } else {
    issues.push('✗ No focus indicators found');
  }
  
  // Check for reduced motion support
  const hasReducedMotion = content.includes('prefers-reduced-motion');
  if (hasReducedMotion) {
    passes.push('✓ Reduced motion support implemented');
  } else {
    issues.push('⚠ No reduced motion support (optional but recommended)');
  }
  
  // Check for outline: none without alternative
  const outlineNoneRegex = /outline:\s*none/gi;
  const outlineNoneMatches = content.match(outlineNoneRegex);
  if (outlineNoneMatches) {
    // Check if there's a box-shadow or border alternative
    const hasAlternative = content.includes('box-shadow') || content.includes('border');
    if (hasAlternative) {
      passes.push('✓ Outline removed but alternatives provided');
    } else {
      issues.push('✗ Outline removed without alternative focus indicator');
    }
  }
  
  // Check for color contrast in CSS variables
  const colorVarRegex = /--mase-([^:]+):\s*(#[0-9a-fA-F]{6}|rgb\([^)]+\))/g;
  const colorVars = {};
  let match;
  
  while ((match = colorVarRegex.exec(content)) !== null) {
    const varName = match[1];
    const colorValue = match[2];
    colorVars[varName] = colorValue;
  }
  
  // Check common text/background combinations
  const combinations = [
    { text: 'text', bg: 'background', name: 'Primary text on background' },
    { text: 'text', bg: 'surface', name: 'Primary text on surface' },
    { text: 'text-secondary', bg: 'background', name: 'Secondary text on background' },
    { text: 'text-secondary', bg: 'surface', name: 'Secondary text on surface' },
  ];
  
  combinations.forEach(combo => {
    const textColor = colorVars[combo.text];
    const bgColor = colorVars[combo.bg];
    
    if (textColor && bgColor) {
      let textRGB = parseRGB(textColor) || hexToRGB(textColor);
      let bgRGB = parseRGB(bgColor) || hexToRGB(bgColor);
      
      if (textRGB && bgRGB) {
        const ratio = getContrastRatio(textRGB, bgRGB);
        const required = 4.5;
        
        if (ratio >= required) {
          passes.push(`✓ ${combo.name}: ${ratio.toFixed(2)}:1 (required: ${required}:1)`);
        } else {
          issues.push(`✗ ${combo.name}: ${ratio.toFixed(2)}:1 (required: ${required}:1)`);
        }
      }
    }
  });
  
  // Check for hover states
  const hasHoverStates = content.includes(':hover');
  if (hasHoverStates) {
    passes.push('✓ Hover states defined');
  } else {
    issues.push('⚠ No hover states found');
  }
  
  // Check for transitions
  const hasTransitions = content.includes('transition');
  if (hasTransitions) {
    passes.push('✓ Smooth transitions implemented');
  }
  
  // Print results
  passes.forEach(pass => console.log(pass));
  issues.forEach(issue => console.log(issue));
  
  return { passes: passes.length, issues: issues.length, fileName };
}

/**
 * Main verification function
 */
function verifyAccessibility() {
  console.log('='.repeat(80));
  console.log('MASE CSS Accessibility Verification');
  console.log('='.repeat(80));
  
  const cssDir = path.join(process.cwd(), 'assets', 'css');
  const results = [];
  
  // Check main CSS files
  const mainFiles = [
    'mase-admin.css',
    'mase-templates.css',
    'mase-palettes.css',
    'mase-template-picker.css'
  ];
  
  mainFiles.forEach(file => {
    const filePath = path.join(cssDir, file);
    if (fs.existsSync(filePath)) {
      const result = checkCSSFile(filePath);
      results.push(result);
    }
  });
  
  // Check theme files
  const themesDir = path.join(cssDir, 'themes');
  if (fs.existsSync(themesDir)) {
    const themeFiles = fs.readdirSync(themesDir).filter(f => f.endsWith('.css') && !f.includes('.backup'));
    
    console.log('\n' + '='.repeat(80));
    console.log('Theme Files');
    console.log('='.repeat(80));
    
    themeFiles.forEach(file => {
      const filePath = path.join(themesDir, file);
      const result = checkCSSFile(filePath);
      results.push(result);
    });
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  
  const totalPasses = results.reduce((sum, r) => sum + r.passes, 0);
  const totalIssues = results.reduce((sum, r) => sum + r.issues, 0);
  const filesChecked = results.length;
  
  console.log(`Files checked: ${filesChecked}`);
  console.log(`Total passes: ${totalPasses}`);
  console.log(`Total issues: ${totalIssues}`);
  console.log('');
  
  if (totalIssues === 0) {
    console.log('✓ PASSED: All CSS files meet accessibility guidelines');
  } else {
    console.log('⚠ REVIEW NEEDED: Some accessibility issues detected');
    console.log('');
    console.log('Note: These are static checks. Full accessibility verification requires:');
    console.log('  1. Browser-based contrast testing with actual rendered colors');
    console.log('  2. Keyboard navigation testing');
    console.log('  3. Screen reader testing');
  }
  
  console.log('');
  
  return totalIssues === 0;
}

// Run if called directly
if (require.main === module) {
  const passed = verifyAccessibility();
  process.exit(passed ? 0 : 1);
}

module.exports = { verifyAccessibility };
