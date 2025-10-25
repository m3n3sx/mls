#!/usr/bin/env node

/**
 * Bundle Analysis and Optimization Report
 * 
 * Task 24.1: Analyze bundle sizes and optimize further
 * Requirement 12.5: Minimize bundle sizes to meet <100KB target
 * 
 * Provides detailed analysis of bundle composition and optimization opportunities
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Bundle size targets (in bytes)
const TARGETS = {
  'main-admin': 30 * 1024, // 30KB
  'core': 30 * 1024, // 30KB
  'preview': 40 * 1024, // 40KB
  'color': 30 * 1024, // 30KB
  'typography': 30 * 1024, // 30KB
  'animations': 20 * 1024, // 20KB
  'managers': 25 * 1024, // 25KB
  'utils': 15 * 1024, // 15KB
  'vendor-zustand': 20 * 1024, // 20KB
  'vendor': 20 * 1024, // 20KB
};

const TOTAL_TARGET = 100 * 1024; // 100KB

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
 * Get all JS files from dist directory
 */
function getAllJSFiles(distDir) {
  const files = [];
  
  // Get main files
  const mainFiles = readdirSync(distDir);
  for (const file of mainFiles) {
    if (file.endsWith('.js') && !file.includes('.map')) {
      files.push({ file, path: join(distDir, file) });
    }
  }
  
  // Get chunk files
  const chunksDir = join(distDir, 'chunks');
  if (existsSync(chunksDir)) {
    const chunkFiles = readdirSync(chunksDir);
    for (const file of chunkFiles) {
      if (file.endsWith('.js') && !file.includes('.map')) {
        files.push({ file, path: join(chunksDir, file) });
      }
    }
  }
  
  return files;
}

/**
 * Categorize bundle by name
 */
function categorizeBundle(filename) {
  for (const [name] of Object.entries(TARGETS)) {
    if (filename.includes(name)) {
      return name;
    }
  }
  return 'other';
}

/**
 * Analyze bundle content
 */
function analyzeBundle(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    return {
      lines: content.split('\n').length,
      chars: content.length,
      hasSourceMap: content.includes('//# sourceMappingURL'),
      hasComments: content.includes('/*') || content.includes('//'),
      estimatedGzipSize: Math.floor(content.length * 0.3), // Rough estimate
    };
  } catch (error) {
    return null;
  }
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(results, totalSize) {
  const recommendations = [];
  
  // Check if total exceeds target
  if (totalSize > TOTAL_TARGET) {
    const excess = totalSize - TOTAL_TARGET;
    recommendations.push({
      priority: 'HIGH',
      issue: `Total bundle size exceeds target by ${formatBytes(excess)}`,
      actions: [
        'Review largest bundles for optimization opportunities',
        'Consider additional code splitting',
        'Check for duplicate dependencies across chunks',
      ],
    });
  }
  
  // Check individual bundles
  for (const result of results) {
    if (result.exceeds) {
      const excess = result.size - result.target;
      recommendations.push({
        priority: 'MEDIUM',
        issue: `${result.category} bundle exceeds target by ${formatBytes(excess)}`,
        actions: [
          `Review ${result.file} for unused code`,
          'Consider lazy loading this module',
          'Check for large dependencies that could be externalized',
        ],
      });
    }
  }
  
  // Check for optimization opportunities
  const largestBundles = results.filter(r => r.size > 10 * 1024).sort((a, b) => b.size - a.size);
  if (largestBundles.length > 0) {
    recommendations.push({
      priority: 'LOW',
      issue: 'Large bundles detected',
      actions: [
        'Run "npm run analyze" to visualize bundle composition',
        'Review tree shaking configuration',
        'Consider dynamic imports for rarely used features',
      ],
    });
  }
  
  return recommendations;
}

/**
 * Main analysis function
 */
function analyzeBundles() {
  const distDir = join(__dirname, '..', 'dist');
  
  console.log('\n📦 Bundle Analysis Report\n');
  console.log('═'.repeat(80));
  
  if (!existsSync(distDir)) {
    console.error('❌ Error: dist directory not found. Run "npm run build" first.\n');
    process.exit(1);
  }
  
  // Get all JS files
  const jsFiles = getAllJSFiles(distDir);
  
  if (jsFiles.length === 0) {
    console.error('❌ Error: No JS files found in dist directory.\n');
    process.exit(1);
  }
  
  // Analyze each bundle
  const results = [];
  let totalSize = 0;
  let totalGzipSize = 0;
  
  for (const { file, path } of jsFiles) {
    const size = getFileSize(path);
    const analysis = analyzeBundle(path);
    const category = categorizeBundle(file);
    const target = TARGETS[category];
    const exceeds = target && size > target;
    
    totalSize += size;
    if (analysis) {
      totalGzipSize += analysis.estimatedGzipSize;
    }
    
    results.push({
      file,
      size,
      category,
      target,
      exceeds,
      analysis,
    });
  }
  
  // Sort by size descending
  results.sort((a, b) => b.size - a.size);
  
  // Print summary
  console.log('\n📊 Bundle Summary\n');
  console.log(`Total Bundles: ${results.length}`);
  console.log(`Total Size: ${formatBytes(totalSize)} (Target: ${formatBytes(TOTAL_TARGET)})`);
  console.log(`Estimated Gzip: ${formatBytes(totalGzipSize)}`);
  console.log(`Status: ${totalSize <= TOTAL_TARGET ? '✅ Within target' : '❌ Exceeds target'}`);
  
  // Print detailed breakdown
  console.log('\n📋 Detailed Breakdown\n');
  console.log('─'.repeat(80));
  console.log('File'.padEnd(40) + 'Size'.padEnd(12) + 'Target'.padEnd(12) + 'Status');
  console.log('─'.repeat(80));
  
  for (const result of results) {
    const status = result.exceeds ? '❌ Over' : '✅ OK';
    const sizeStr = formatBytes(result.size);
    const targetStr = result.target ? formatBytes(result.target) : 'N/A';
    
    console.log(
      result.file.padEnd(40) +
      sizeStr.padEnd(12) +
      targetStr.padEnd(12) +
      status
    );
  }
  
  console.log('─'.repeat(80));
  
  // Print category breakdown
  console.log('\n📂 Category Breakdown\n');
  const categories = {};
  for (const result of results) {
    if (!categories[result.category]) {
      categories[result.category] = { size: 0, count: 0, target: result.target };
    }
    categories[result.category].size += result.size;
    categories[result.category].count += 1;
  }
  
  console.log('─'.repeat(80));
  console.log('Category'.padEnd(20) + 'Size'.padEnd(12) + 'Target'.padEnd(12) + 'Files'.padEnd(8) + 'Status');
  console.log('─'.repeat(80));
  
  for (const [category, data] of Object.entries(categories)) {
    const status = data.target && data.size > data.target ? '❌' : '✅';
    const sizeStr = formatBytes(data.size);
    const targetStr = data.target ? formatBytes(data.target) : 'N/A';
    
    console.log(
      category.padEnd(20) +
      sizeStr.padEnd(12) +
      targetStr.padEnd(12) +
      data.count.toString().padEnd(8) +
      status
    );
  }
  
  console.log('─'.repeat(80));
  
  // Generate and print recommendations
  const recommendations = generateRecommendations(results, totalSize);
  
  if (recommendations.length > 0) {
    console.log('\n💡 Optimization Recommendations\n');
    
    for (let i = 0; i < recommendations.length; i++) {
      const rec = recommendations[i];
      console.log(`${i + 1}. [${rec.priority}] ${rec.issue}`);
      for (const action of rec.actions) {
        console.log(`   • ${action}`);
      }
      console.log('');
    }
  } else {
    console.log('\n✅ All bundles are optimized and within targets!\n');
  }
  
  // Print next steps
  console.log('🔧 Next Steps\n');
  console.log('1. Run "npm run analyze" to visualize bundle composition');
  console.log('2. Review vite.config.js manualChunks configuration');
  console.log('3. Check for duplicate dependencies with bundle analyzer');
  console.log('4. Consider lazy loading for large feature modules');
  console.log('5. Review and remove unused imports\n');
  
  console.log('═'.repeat(80));
  console.log('');
  
  // Exit with error if over target
  if (totalSize > TOTAL_TARGET) {
    process.exit(1);
  }
}

// Run analysis
analyzeBundles();
