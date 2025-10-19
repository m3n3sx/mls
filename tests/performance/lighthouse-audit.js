#!/usr/bin/env node

/**
 * Lighthouse Audit Script
 * 
 * Runs Lighthouse audit and checks against >95/100 target (Requirement 17.4)
 * 
 * Prerequisites:
 * - npm install -g lighthouse
 * - WordPress site running with MASE plugin active
 * 
 * Usage: node lighthouse-audit.js [url]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    url: process.argv[2] || 'http://localhost/wp-admin',
    targetScore: 95,
    outputDir: path.join(__dirname, 'performance-results'),
    categories: ['performance', 'accessibility', 'best-practices', 'seo']
};

console.log('=== Lighthouse Audit ===\n');
console.log(`URL: ${config.url}`);
console.log(`Target Score: >${config.targetScore}/100\n`);

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
}

// Generate output filename
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0];
const outputFile = path.join(config.outputDir, `lighthouse-${timestamp}.json`);
const htmlFile = path.join(config.outputDir, `lighthouse-${timestamp}.html`);

console.log('Running Lighthouse audit...\n');

try {
    // Run Lighthouse
    const command = `lighthouse ${config.url} \
        --output=json \
        --output=html \
        --output-path=${outputFile.replace('.json', '')} \
        --chrome-flags="--headless --no-sandbox" \
        --only-categories=${config.categories.join(',')} \
        --quiet`;
    
    execSync(command, { stdio: 'inherit' });
    
    console.log('\n✅ Lighthouse audit completed\n');
    
    // Read and parse results
    const results = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    
    // Extract scores
    const scores = {
        performance: Math.round(results.categories.performance.score * 100),
        accessibility: Math.round(results.categories.accessibility.score * 100),
        bestPractices: Math.round(results.categories['best-practices'].score * 100),
        seo: Math.round(results.categories.seo.score * 100)
    };
    
    // Calculate average
    const average = Math.round(
        Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    );
    
    // Display results
    console.log('=== Scores ===\n');
    console.log(`Performance:     ${scores.performance}/100 ${getStatusIcon(scores.performance)}`);
    console.log(`Accessibility:   ${scores.accessibility}/100 ${getStatusIcon(scores.accessibility)}`);
    console.log(`Best Practices:  ${scores.bestPractices}/100 ${getStatusIcon(scores.bestPractices)}`);
    console.log(`SEO:             ${scores.seo}/100 ${getStatusIcon(scores.seo)}`);
    console.log(`\nAverage:         ${average}/100 ${getStatusIcon(average)}`);
    console.log(`Target:          >${config.targetScore}/100`);
    
    // Overall status
    const passed = average > config.targetScore;
    console.log(`\nStatus: ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
    
    // Key metrics
    console.log('=== Key Metrics ===\n');
    const metrics = results.audits.metrics.details.items[0];
    
    console.log(`First Contentful Paint:  ${Math.round(metrics.firstContentfulPaint)}ms`);
    console.log(`Speed Index:             ${Math.round(metrics.speedIndex)}ms`);
    console.log(`Largest Contentful Paint: ${Math.round(metrics.largestContentfulPaint)}ms`);
    console.log(`Time to Interactive:     ${Math.round(metrics.interactive)}ms`);
    console.log(`Total Blocking Time:     ${Math.round(metrics.totalBlockingTime)}ms`);
    console.log(`Cumulative Layout Shift: ${metrics.cumulativeLayoutShift.toFixed(3)}`);
    
    // Opportunities
    console.log('\n=== Opportunities ===\n');
    const opportunities = Object.values(results.audits)
        .filter(audit => audit.details && audit.details.type === 'opportunity')
        .filter(audit => audit.score !== null && audit.score < 1)
        .sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs)
        .slice(0, 5);
    
    if (opportunities.length > 0) {
        opportunities.forEach(opp => {
            const savings = Math.round(opp.details.overallSavingsMs);
            console.log(`- ${opp.title}: ${savings}ms potential savings`);
        });
    } else {
        console.log('No significant opportunities found ✅');
    }
    
    // Diagnostics
    console.log('\n=== Diagnostics ===\n');
    const diagnostics = Object.values(results.audits)
        .filter(audit => audit.details && audit.details.type === 'diagnostic')
        .filter(audit => audit.score !== null && audit.score < 1)
        .slice(0, 5);
    
    if (diagnostics.length > 0) {
        diagnostics.forEach(diag => {
            console.log(`- ${diag.title}`);
        });
    } else {
        console.log('No significant issues found ✅');
    }
    
    // Save summary
    const summary = {
        timestamp: new Date().toISOString(),
        url: config.url,
        scores,
        average,
        target: config.targetScore,
        passed,
        metrics: {
            firstContentfulPaint: Math.round(metrics.firstContentfulPaint),
            speedIndex: Math.round(metrics.speedIndex),
            largestContentfulPaint: Math.round(metrics.largestContentfulPaint),
            timeToInteractive: Math.round(metrics.interactive),
            totalBlockingTime: Math.round(metrics.totalBlockingTime),
            cumulativeLayoutShift: metrics.cumulativeLayoutShift
        },
        opportunities: opportunities.map(opp => ({
            title: opp.title,
            savingsMs: Math.round(opp.details.overallSavingsMs)
        })),
        diagnostics: diagnostics.map(diag => diag.title)
    };
    
    const summaryFile = path.join(config.outputDir, `lighthouse-summary-${timestamp}.json`);
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    
    console.log(`\n📄 Full report: ${htmlFile}`);
    console.log(`📊 Summary: ${summaryFile}\n`);
    
    process.exit(passed ? 0 : 1);
    
} catch (error) {
    console.error('❌ Error running Lighthouse:', error.message);
    console.error('\nMake sure:');
    console.error('1. Lighthouse is installed: npm install -g lighthouse');
    console.error('2. WordPress site is running and accessible');
    console.error('3. MASE plugin is active\n');
    process.exit(1);
}

function getStatusIcon(score) {
    if (score >= 90) return '✅';
    if (score >= 50) return '⚠️';
    return '❌';
}
