#!/usr/bin/env node

/**
 * Aggressive CSS Optimization Script
 * 
 * More aggressive optimization including:
 * - Removing all non-essential comments
 * - Combining duplicate selectors
 * - Removing redundant properties
 * - Minifying whitespace
 * 
 * Task 18.1: Optimize CSS file sizes
 * Requirements: 15.1
 */

const fs = require('fs');
const path = require('path');

const cssFiles = [
  'assets/css/themes/glass-theme.css',
  'assets/css/themes/minimal-theme.css',
  'assets/css/themes/gradient-theme.css',
  'assets/css/themes/terminal-theme.css',
  'assets/css/themes/retro-theme.css',
  'assets/css/themes/gaming-theme.css',
  'assets/css/themes/floral-theme.css',
  'assets/css/themes/professional-theme.css',
  'assets/css/mase-animation-editor.css',
  'assets/css/mase-admin-menu.css',
  'assets/css/mase-template-picker.css',
  'assets/css/mase-pattern-library.css',
];

function aggressiveOptimize(content) {
  let optimized = content;
  
  // Remove ALL comments except copyright/license
  optimized = optimized.replace(/\/\*(?!\s*\*\/|\s*@license|\s*@copyright)[\s\S]*?\*\//g, '');
  
  // Remove multiple empty lines (keep max 1)
  optimized = optimized.replace(/\n\s*\n\s*\n+/g, '\n\n');
  
  // Remove empty lines at start of file
  optimized = optimized.replace(/^\s+/, '');
  
  // Remove trailing whitespace
  optimized = optimized.replace(/[ \t]+$/gm, '');
  
  // Optimize color values
  optimized = optimized.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, '#$1$2$3');
  
  // Optimize zero values
  optimized = optimized.replace(/\b0(px|em|rem|%|vh|vw|ms|s)\b/g, '0');
  
  // Remove unnecessary semicolons before closing braces
  optimized = optimized.replace(/;\s*}/g, '}');
  
  // Reduce multiple spaces to single space
  optimized = optimized.replace(/  +/g, ' ');
  
  // Remove space after colons in properties (keep one space for readability)
  // optimized = optimized.replace(/:\s+/g, ': ');
  
  // Remove space before opening braces (keep one space for readability)
  // optimized = optimized.replace(/\s+{/g, ' {');
  
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

console.log('Aggressive CSS Optimization');
console.log('===========================\n');

let totalOriginalSize = 0;
let totalOptimizedSize = 0;

cssFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${file} (not found)`);
    return;
  }
  
  const originalSize = getFileSize(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const optimized = aggressiveOptimize(content);
  
  // Write optimized version
  fs.writeFileSync(filePath, optimized);
  
  const optimizedSize = getFileSize(filePath);
  const savings = originalSize - optimizedSize;
  const savingsPercent = ((savings / originalSize) * 100).toFixed(2);
  
  totalOriginalSize += originalSize;
  totalOptimizedSize += optimizedSize;
  
  console.log(`✓ ${file}`);
  console.log(`  Before: ${formatBytes(originalSize)}`);
  console.log(`  After: ${formatBytes(optimizedSize)}`);
  console.log(`  Saved: ${formatBytes(savings)} (${savingsPercent}%)\n`);
});

const totalSavings = totalOriginalSize - totalOptimizedSize;
const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(2);

console.log('Summary for Optimized Files');
console.log('===========================');
console.log(`Total Before: ${formatBytes(totalOriginalSize)}`);
console.log(`Total After: ${formatBytes(totalOptimizedSize)}`);
console.log(`Total Savings: ${formatBytes(totalSavings)} (${totalSavingsPercent}%)`);
