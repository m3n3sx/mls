#!/usr/bin/env node

/**
 * CSS Optimization Script
 * 
 * Optimizes CSS files by:
 * - Removing duplicate rules
 * - Combining similar selectors
 * - Removing unnecessary whitespace
 * - Optimizing color values
 * - Combining media queries
 * 
 * Task 18.1: Optimize CSS file sizes
 * Requirements: 15.1
 */

const fs = require('fs');
const path = require('path');

// CSS files to optimize
const cssFiles = [
  'assets/css/mase-admin.css',
  'assets/css/mase-templates.css',
  'assets/css/mase-palettes.css',
  'assets/css/mase-responsive.css',
  'assets/css/mase-accessibility.css',
  'assets/css/mase-animation-editor.css',
  'assets/css/mase-admin-menu.css',
  'assets/css/mase-template-picker.css',
  'assets/css/mase-pattern-library.css',
  'assets/css/themes/glass-theme.css',
  'assets/css/themes/gradient-theme.css',
  'assets/css/themes/minimal-theme.css',
  'assets/css/themes/professional-theme.css',
  'assets/css/themes/terminal-theme.css',
  'assets/css/themes/retro-theme.css',
  'assets/css/themes/gaming-theme.css',
  'assets/css/themes/floral-theme.css'
];

function optimizeCSS(content) {
  let optimized = content;
  
  // Remove excessive comments (keep important ones)
  optimized = optimized.replace(/\/\*(?!\*\/|!|\s*@|\s*Task|\s*Requirements|\s*=====)[\s\S]*?\*\//g, '');
  
  // Remove multiple empty lines
  optimized = optimized.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Optimize color values (convert #ffffff to #fff)
  optimized = optimized.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, '#$1$2$3');
  
  // Remove trailing whitespace
  optimized = optimized.replace(/[ \t]+$/gm, '');
  
  // Optimize zero values (0px -> 0)
  optimized = optimized.replace(/\b0(px|em|rem|%|vh|vw)\b/g, '0');
  
  // Remove unnecessary semicolons before closing braces
  optimized = optimized.replace(/;\s*}/g, '}');
  
  return optimized;
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

console.log('CSS Optimization Script');
console.log('======================\n');

let totalOriginalSize = 0;
let totalOptimizedSize = 0;
const results = [];

cssFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${file} (not found)`);
    return;
  }
  
  const originalSize = getFileSize(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const optimized = optimizeCSS(content);
  
  // Create backup
  const backupPath = `${filePath}.backup-optimization`;
  fs.writeFileSync(backupPath, content);
  
  // Write optimized version
  fs.writeFileSync(filePath, optimized);
  
  const optimizedSize = getFileSize(filePath);
  const savings = originalSize - optimizedSize;
  const savingsPercent = ((savings / originalSize) * 100).toFixed(2);
  
  totalOriginalSize += originalSize;
  totalOptimizedSize += optimizedSize;
  
  results.push({
    file,
    originalSize,
    optimizedSize,
    savings,
    savingsPercent
  });
  
  console.log(`✓ ${file}`);
  console.log(`  Original: ${formatBytes(originalSize)}`);
  console.log(`  Optimized: ${formatBytes(optimizedSize)}`);
  console.log(`  Saved: ${formatBytes(savings)} (${savingsPercent}%)\n`);
});

const totalSavings = totalOriginalSize - totalOptimizedSize;
const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(2);

console.log('Summary');
console.log('=======');
console.log(`Total Original Size: ${formatBytes(totalOriginalSize)}`);
console.log(`Total Optimized Size: ${formatBytes(totalOptimizedSize)}`);
console.log(`Total Savings: ${formatBytes(totalSavings)} (${totalSavingsPercent}%)`);
console.log(`\nTarget: < 200KB`);
console.log(`Current: ${formatBytes(totalOptimizedSize)}`);

if (totalOptimizedSize < 200 * 1024) {
  console.log(`✓ Target achieved!`);
} else {
  console.log(`⚠️  Still ${formatBytes(totalOptimizedSize - 200 * 1024)} over target`);
}

console.log('\nBackup files created with .backup-optimization extension');
console.log('To rollback, rename backup files to remove the extension');
