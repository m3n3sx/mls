#!/usr/bin/env node

/**
 * Test Minified Assets
 * 
 * Validates that minified CSS and JS files are valid and functional
 * Task 24.1: Test minified versions
 * Requirements: All
 */

const fs = require('fs');
const path = require('path');

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

/**
 * Validate CSS syntax
 */
function validateCSS(content, filename) {
  const errors = [];
  
  // Check for unclosed braces
  const openBraces = (content.match(/{/g) || []).length;
  const closeBraces = (content.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Mismatched braces: ${openBraces} open, ${closeBraces} close`);
  }
  
  // Check for basic CSS structure
  if (!content.includes('{') || !content.includes('}')) {
    errors.push('No CSS rules found');
  }
  
  // Check file is not empty
  if (content.trim().length === 0) {
    errors.push('File is empty');
  }
  
  // Check for common minification issues
  if (content.includes('undefined')) {
    errors.push('Contains "undefined" - possible minification error');
  }
  
  return errors;
}

/**
 * Validate JavaScript syntax (basic checks)
 */
function validateJS(content, filename) {
  const errors = [];
  
  // Check for unclosed parentheses
  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(`Mismatched parentheses: ${openParens} open, ${closeParens} close`);
  }
  
  // Check for unclosed braces
  const openBraces = (content.match(/{/g) || []).length;
  const closeBraces = (content.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Mismatched braces: ${openBraces} open, ${closeBraces} close`);
  }
  
  // Check for unclosed brackets
  const openBrackets = (content.match(/\[/g) || []).length;
  const closeBrackets = (content.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    errors.push(`Mismatched brackets: ${openBrackets} open, ${closeBrackets} close`);
  }
  
  // Check file is not empty
  if (content.trim().length === 0) {
    errors.push('File is empty');
  }
  
  // Check for common minification issues
  if (content.includes('undefined undefined')) {
    errors.push('Contains "undefined undefined" - possible minification error');
  }
  
  return errors;
}

/**
 * Test a minified file
 */
function testMinifiedFile(filePath, type) {
  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      errors: ['File not found']
    };
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  
  const errors = type === 'css' 
    ? validateCSS(content, filename)
    : validateJS(content, filename);
  
  return {
    success: errors.length === 0,
    errors,
    size: content.length
  };
}

/**
 * Format bytes
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.blue}╔════════════════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║                                                                            ║${colors.reset}`);
  console.log(`${colors.blue}║                    Test Minified Assets                                    ║${colors.reset}`);
  console.log(`${colors.blue}║                                                                            ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  // Test CSS files
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}  Testing Minified CSS Files${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log('');
  
  const cssFiles = [
    'assets/css/md3/md3-tokens.min.css',
    'assets/css/md3/md3-elevation.min.css',
    'assets/css/md3/md3-motion.min.css',
    'assets/css/md3/md3-typography.min.css',
    'assets/css/md3/md3-shape-spacing.min.css',
    'assets/css/mase-md3-admin.min.css',
    'assets/css/mase-md3-buttons.min.css',
    'assets/css/mase-md3-forms.min.css',
    'assets/css/mase-md3-templates.min.css'
  ];
  
  for (const file of cssFiles) {
    totalTests++;
    const result = testMinifiedFile(path.join(process.cwd(), file), 'css');
    
    if (result.success) {
      passedTests++;
      console.log(`${colors.green}✓${colors.reset} ${file} (${formatBytes(result.size)})`);
    } else {
      failedTests++;
      console.log(`${colors.red}✗${colors.reset} ${file}`);
      result.errors.forEach(error => {
        console.log(`  ${colors.red}Error: ${error}${colors.reset}`);
      });
    }
  }
  
  console.log('');
  
  // Test JS files
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}  Testing Minified JavaScript Files${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log('');
  
  const jsFiles = [
    'assets/js/mase-md3-color-harmony.min.js',
    'assets/js/mase-md3-fab.min.js',
    'assets/js/mase-md3-loading.min.js',
    'assets/js/mase-md3-motion.min.js',
    'assets/js/mase-md3-palette.min.js',
    'assets/js/mase-md3-ripple.min.js',
    'assets/js/mase-md3-settings.min.js',
    'assets/js/mase-md3-snackbar.min.js',
    'assets/js/mase-md3-state-layers.min.js',
    'assets/js/mase-md3-tabs.min.js',
    'assets/js/mase-md3-template-cards.min.js'
  ];
  
  for (const file of jsFiles) {
    totalTests++;
    const result = testMinifiedFile(path.join(process.cwd(), file), 'js');
    
    if (result.success) {
      passedTests++;
      console.log(`${colors.green}✓${colors.reset} ${file} (${formatBytes(result.size)})`);
    } else {
      failedTests++;
      console.log(`${colors.red}✗${colors.reset} ${file}`);
      result.errors.forEach(error => {
        console.log(`  ${colors.red}Error: ${error}${colors.reset}`);
      });
    }
  }
  
  // Summary
  console.log('');
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}  Summary${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log('');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log('');
  
  if (failedTests === 0) {
    console.log(`${colors.green}✓ All minified assets are valid!${colors.reset}`);
    console.log('');
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ Some minified assets have errors${colors.reset}`);
    console.log('');
    process.exit(1);
  }
}

// Run main function
main();
