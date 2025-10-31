#!/usr/bin/env node

/**
 * MD3 Asset Minification Script
 * 
 * Minifies all Material Design 3 CSS and JavaScript files
 * Task 24.1: Minify assets
 * Requirements: All
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

// MD3 CSS files to minify
const md3CssFiles = [
  'assets/css/md3/md3-tokens.css',
  'assets/css/md3/md3-elevation.css',
  'assets/css/md3/md3-motion.css',
  'assets/css/md3/md3-typography.css',
  'assets/css/md3/md3-shape-spacing.css',
  'assets/css/mase-md3-admin.css',
  'assets/css/mase-md3-buttons.css',
  'assets/css/mase-md3-color-harmony.css',
  'assets/css/mase-md3-dark-mode.css',
  'assets/css/mase-md3-forms.css',
  'assets/css/mase-md3-loading.css',
  'assets/css/mase-md3-performance.css',
  'assets/css/mase-md3-settings.css',
  'assets/css/mase-md3-snackbar.css',
  'assets/css/mase-md3-state-layers.css',
  'assets/css/mase-md3-tabs.css',
  'assets/css/mase-md3-templates.css'
];

// MD3 JS files to minify
const md3JsFiles = [
  'assets/js/mase-md3-color-harmony.js',
  'assets/js/mase-md3-fab.js',
  'assets/js/mase-md3-loading.js',
  'assets/js/mase-md3-motion.js',
  'assets/js/mase-md3-palette.js',
  'assets/js/mase-md3-ripple.js',
  'assets/js/mase-md3-settings.js',
  'assets/js/mase-md3-snackbar.js',
  'assets/js/mase-md3-state-layers.js',
  'assets/js/mase-md3-tabs.js',
  'assets/js/mase-md3-template-cards.js'
];

/**
 * Minify CSS content
 */
function minifyCSS(content) {
  let minified = content;
  
  // Remove all comments except important ones (/*! ... */)
  minified = minified.replace(/\/\*(?!\!)[\s\S]*?\*\//g, '');
  
  // Remove whitespace around selectors and properties
  minified = minified.replace(/\s*([{}:;,>+~])\s*/g, '$1');
  
  // Remove leading/trailing whitespace
  minified = minified.replace(/^\s+|\s+$/gm, '');
  
  // Remove empty lines
  minified = minified.replace(/\n+/g, '');
  
  // Optimize color values (#ffffff -> #fff)
  minified = minified.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, '#$1$2$3');
  
  // Optimize zero values (0px -> 0)
  minified = minified.replace(/\b0(px|em|rem|%|vh|vw|ms|s)\b/g, '0');
  
  // Remove unnecessary semicolons before closing braces
  minified = minified.replace(/;}/g, '}');
  
  // Remove quotes from URLs when not needed
  minified = minified.replace(/url\((['"])([^'"()]+)\1\)/g, 'url($2)');
  
  return minified;
}

/**
 * Minify JavaScript file using Terser
 */
async function minifyJS(content, filename) {
  try {
    const result = await minify(content, {
      compress: {
        dead_code: true,
        drop_console: false, // Keep console for debugging
        drop_debugger: true,
        pure_funcs: ['console.debug'],
        passes: 2
      },
      mangle: {
        reserved: ['jQuery', '$', 'wp', 'mase']
      },
      format: {
        comments: /^!/,
        preamble: `/* ${filename} - Minified for production */`
      }
    });
    
    return result.code;
  } catch (error) {
    console.error(`${colors.red}Error minifying ${filename}:${colors.reset}`, error.message);
    return null;
  }
}

/**
 * Get file size in bytes
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Process CSS file
 */
function processCSSFile(file) {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`${colors.yellow}⚠️  Skipping ${file} (not found)${colors.reset}`);
    return null;
  }
  
  const originalSize = getFileSize(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const minified = minifyCSS(content);
  
  // Generate minified filename
  const minFilePath = filePath.replace('.css', '.min.css');
  
  // Write minified version
  fs.writeFileSync(minFilePath, minified);
  
  const minifiedSize = getFileSize(minFilePath);
  const savings = originalSize - minifiedSize;
  const savingsPercent = originalSize > 0 ? ((savings / originalSize) * 100).toFixed(2) : 0;
  
  return {
    file,
    originalSize,
    minifiedSize,
    savings,
    savingsPercent
  };
}

/**
 * Process JS file
 */
async function processJSFile(file) {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`${colors.yellow}⚠️  Skipping ${file} (not found)${colors.reset}`);
    return null;
  }
  
  const originalSize = getFileSize(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(file);
  const minified = await minifyJS(content, filename);
  
  if (!minified) {
    return null;
  }
  
  // Generate minified filename
  const minFilePath = filePath.replace('.js', '.min.js');
  
  // Write minified version
  fs.writeFileSync(minFilePath, minified);
  
  const minifiedSize = getFileSize(minFilePath);
  const savings = originalSize - minifiedSize;
  const savingsPercent = originalSize > 0 ? ((savings / originalSize) * 100).toFixed(2) : 0;
  
  return {
    file,
    originalSize,
    minifiedSize,
    savings,
    savingsPercent
  };
}

/**
 * Main execution
 */
async function main() {
  console.log(`${colors.blue}╔════════════════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║                                                                            ║${colors.reset}`);
  console.log(`${colors.blue}║                    MD3 Asset Minification Script                           ║${colors.reset}`);
  console.log(`${colors.blue}║                                                                            ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');
  
  // Process CSS files
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}  Minifying CSS Files${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log('');
  
  let totalCssOriginal = 0;
  let totalCssMinified = 0;
  const cssResults = [];
  
  for (const file of md3CssFiles) {
    const result = processCSSFile(file);
    if (result) {
      cssResults.push(result);
      totalCssOriginal += result.originalSize;
      totalCssMinified += result.minifiedSize;
      
      console.log(`${colors.green}✓${colors.reset} ${file}`);
      console.log(`  Original: ${formatBytes(result.originalSize)}`);
      console.log(`  Minified: ${formatBytes(result.minifiedSize)}`);
      console.log(`  Saved: ${formatBytes(result.savings)} (${result.savingsPercent}%)`);
      console.log('');
    }
  }
  
  // Process JS files
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}  Minifying JavaScript Files${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log('');
  
  let totalJsOriginal = 0;
  let totalJsMinified = 0;
  const jsResults = [];
  
  for (const file of md3JsFiles) {
    const result = await processJSFile(file);
    if (result) {
      jsResults.push(result);
      totalJsOriginal += result.originalSize;
      totalJsMinified += result.minifiedSize;
      
      console.log(`${colors.green}✓${colors.reset} ${file}`);
      console.log(`  Original: ${formatBytes(result.originalSize)}`);
      console.log(`  Minified: ${formatBytes(result.minifiedSize)}`);
      console.log(`  Saved: ${formatBytes(result.savings)} (${result.savingsPercent}%)`);
      console.log('');
    }
  }
  
  // Summary
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}  Summary${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log('');
  
  const totalOriginal = totalCssOriginal + totalJsOriginal;
  const totalMinified = totalCssMinified + totalJsMinified;
  const totalSavings = totalOriginal - totalMinified;
  const totalSavingsPercent = totalOriginal > 0 ? ((totalSavings / totalOriginal) * 100).toFixed(2) : 0;
  
  console.log(`CSS Files:`);
  console.log(`  Original:  ${formatBytes(totalCssOriginal)}`);
  console.log(`  Minified:  ${formatBytes(totalCssMinified)}`);
  console.log(`  Saved:     ${formatBytes(totalCssOriginal - totalCssMinified)} (${totalCssOriginal > 0 ? ((totalCssOriginal - totalCssMinified) / totalCssOriginal * 100).toFixed(2) : 0}%)`);
  console.log('');
  
  console.log(`JavaScript Files:`);
  console.log(`  Original:  ${formatBytes(totalJsOriginal)}`);
  console.log(`  Minified:  ${formatBytes(totalJsMinified)}`);
  console.log(`  Saved:     ${formatBytes(totalJsOriginal - totalJsMinified)} (${totalJsOriginal > 0 ? ((totalJsOriginal - totalJsMinified) / totalJsOriginal * 100).toFixed(2) : 0}%)`);
  console.log('');
  
  console.log(`Total:`);
  console.log(`  Original:  ${formatBytes(totalOriginal)}`);
  console.log(`  Minified:  ${formatBytes(totalMinified)}`);
  console.log(`  Saved:     ${formatBytes(totalSavings)} (${totalSavingsPercent}%)`);
  console.log('');
  
  // Check against target
  const targetSize = 100 * 1024; // 100KB
  if (totalMinified < targetSize) {
    console.log(`${colors.green}✓ Target achieved! (< 100KB)${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  ${formatBytes(totalMinified - targetSize)} over 100KB target${colors.reset}`);
  }
  
  console.log('');
  console.log(`${colors.green}✓ Minification complete!${colors.reset}`);
  console.log(`${colors.blue}  Minified files created with .min.css and .min.js extensions${colors.reset}`);
  console.log('');
}

// Run main function
main().catch(error => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
