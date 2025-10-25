#!/usr/bin/env node

/**
 * Bundle Size Checker
 * 
 * Task 18.3: Optimize bundle sizes
 * Requirement 12.5: Minimize bundle sizes to meet <100KB target
 * 
 * Checks that bundle sizes meet the specified targets:
 * - Core bundle: < 30KB
 * - Preview bundle: < 40KB
 * - Feature bundles: < 30KB each
 * - Total: < 100KB
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Bundle size targets (in bytes)
const TARGETS = {
  'main-admin': 30 * 1024, // 30KB - Main entry point
  'core': 30 * 1024, // 30KB - State Manager, Event Bus, API Client
  'preview': 40 * 1024, // 40KB - Preview Engine
  'color': 30 * 1024, // 30KB - Color System
  'typography': 30 * 1024, // 30KB - Typography
  'animations': 20 * 1024, // 20KB - Animations
  'managers': 25 * 1024, // 25KB - Palette & Template Managers
  'utils': 15 * 1024, // 15KB - Feature flags, Event Adapter
  'vendor-zustand': 20 * 1024, // 20KB - Zustand
  'vendor': 20 * 1024, // 20KB - Other vendors
};

const TOTAL_TARGET = 100 * 1024; // 100KB total

/**
 * Get file size in bytes
 */
function getFileSize(filePath) {
  try {
    const stats = statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check bundle sizes
 */
function checkBundleSizes() {
  const distDir = join(__dirname, '..', 'dist');
  
  console.log('\n📦 Bundle Size Analysis\n');
  console.log('Target: Total < 100KB\n');
  
  let totalSize = 0;
  let hasErrors = false;
  const results = [];
  
  try {
    // Read all files in dist directory and chunks subdirectory
    const files = readdirSync(distDir);
    const chunksDir = join(distDir, 'chunks');
    const chunkFiles = readdirSync(chunksDir);
    
    // Find all JS files (including chunks)
    const jsFiles = [
      ...files.filter(f => f.endsWith('.js') && !f.includes('.map')),
      ...chunkFiles.filter(f => f.endsWith('.js') && !f.includes('.map')).map(f => `chunks/${f}`)
    ];
    
    // Check each bundle
    for (const file of jsFiles) {
      const filePath = join(distDir, file);
      const size = getFileSize(filePath);
      totalSize += size;
      
      // Find matching target
      let target = null;
      let targetName = null;
      
      for (const [name, targetSize] of Object.entries(TARGETS)) {
        if (file.includes(name)) {
          target = targetSize;
          targetName = name;
          break;
        }
      }
      
      // Check if size exceeds target
      const exceeds = target && size > target;
      const percentage = target ? ((size / target) * 100).toFixed(1) : 0;
      
      results.push({
        file,
        size,
        target,
        targetName,
        exceeds,
        percentage,
      });
      
      if (exceeds) {
        hasErrors = true;
      }
    }
    
    // Sort by size descending
    results.sort((a, b) => b.size - a.size);
    
    // Print results
    console.log('Individual Bundles:');
    console.log('─'.repeat(80));
    
    for (const result of results) {
      const status = result.exceeds ? '❌' : '✅';
      const sizeStr = formatBytes(result.size).padEnd(10);
      const targetStr = result.target ? formatBytes(result.target).padEnd(10) : 'N/A'.padEnd(10);
      const percentStr = result.target ? `${result.percentage}%`.padEnd(8) : '';
      
      console.log(`${status} ${sizeStr} / ${targetStr} ${percentStr} ${result.file}`);
      
      if (result.exceeds) {
        const excess = result.size - result.target;
        console.log(`   ⚠️  Exceeds target by ${formatBytes(excess)}`);
      }
    }
    
    console.log('─'.repeat(80));
    
    // Check total size
    const totalExceeds = totalSize > TOTAL_TARGET;
    const totalStatus = totalExceeds ? '❌' : '✅';
    const totalPercentage = ((totalSize / TOTAL_TARGET) * 100).toFixed(1);
    
    console.log(`\nTotal Bundle Size:`);
    console.log(`${totalStatus} ${formatBytes(totalSize)} / ${formatBytes(TOTAL_TARGET)} (${totalPercentage}%)`);
    
    if (totalExceeds) {
      hasErrors = true;
      const excess = totalSize - TOTAL_TARGET;
      console.log(`⚠️  Exceeds total target by ${formatBytes(excess)}`);
    }
    
    // Print recommendations if there are errors
    if (hasErrors) {
      console.log('\n💡 Optimization Recommendations:');
      console.log('1. Run "npm run analyze" to visualize bundle composition');
      console.log('2. Check for duplicate dependencies across chunks');
      console.log('3. Consider lazy loading more modules');
      console.log('4. Review and remove unused code');
      console.log('5. Ensure tree shaking is working correctly');
    }
    
    console.log('');
    
    // Exit with error if targets exceeded
    if (hasErrors) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error checking bundle sizes:', error.message);
    console.log('\n⚠️  Could not find dist directory. Run "npm run build" first.\n');
    process.exit(1);
  }
}

// Run check
checkBundleSizes();
