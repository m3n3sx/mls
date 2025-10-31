/**
 * CSS Browser Compatibility Verification
 * 
 * Verifies CSS files contain proper browser compatibility features:
 * - Vendor prefixes for backdrop-filter
 * - Fallback mechanisms with @supports
 * - CSS Grid fallbacks
 * - Custom property fallbacks
 * 
 * @package MASE
 * @since 1.3.0
 */

const fs = require('fs');
const path = require('path');

// CSS files to check
const CSS_FILES = [
    'assets/css/themes/glass-theme.css',
    'assets/css/themes/gradient-theme.css',
    'assets/css/themes/minimal-theme.css',
    'assets/css/themes/professional-theme.css',
    'assets/css/themes/terminal-theme.css',
    'assets/css/themes/retro-theme.css',
    'assets/css/themes/gaming-theme.css',
    'assets/css/themes/floral-theme.css',
    'assets/css/mase-templates.css',
    'assets/css/mase-palettes.css',
    'assets/css/mase-admin.css'
];

// Test results
const results = {
    passed: [],
    failed: [],
    warnings: []
};

/**
 * Check if file contains backdrop-filter with vendor prefix
 */
function checkBackdropFilterPrefix(content, filename) {
    const hasBackdropFilter = content.includes('backdrop-filter:');
    const hasWebkitPrefix = content.includes('-webkit-backdrop-filter:');
    
    if (hasBackdropFilter && !hasWebkitPrefix) {
        results.failed.push({
            file: filename,
            issue: 'backdrop-filter without -webkit- prefix',
            severity: 'high',
            fix: 'Add -webkit-backdrop-filter for Safari compatibility'
        });
        return false;
    }
    
    if (hasBackdropFilter && hasWebkitPrefix) {
        results.passed.push({
            file: filename,
            check: 'backdrop-filter with vendor prefix'
        });
        return true;
    }
    
    return true; // No backdrop-filter used, that's fine
}

/**
 * Check if file contains @supports fallback for backdrop-filter
 */
function checkBackdropFilterFallback(content, filename) {
    const hasBackdropFilter = content.includes('backdrop-filter:');
    const hasSupportsFallback = content.includes('@supports not (backdrop-filter:') ||
                                content.includes('@supports not (-webkit-backdrop-filter:');
    
    if (hasBackdropFilter && !hasSupportsFallback) {
        results.warnings.push({
            file: filename,
            issue: 'backdrop-filter without @supports fallback',
            severity: 'medium',
            fix: 'Add @supports not (backdrop-filter) fallback for older browsers'
        });
        return false;
    }
    
    if (hasBackdropFilter && hasSupportsFallback) {
        results.passed.push({
            file: filename,
            check: 'backdrop-filter with @supports fallback'
        });
        return true;
    }
    
    return true;
}

/**
 * Check if file contains CSS Grid with fallback
 */
function checkCSSGridFallback(content, filename) {
    const hasGrid = content.includes('display: grid') || content.includes('display:grid');
    const hasFlexboxFallback = content.includes('display: flex') || content.includes('display:flex');
    const hasSupportsGrid = content.includes('@supports (display: grid)') ||
                           content.includes('@supports not (display: grid)');
    
    if (hasGrid && !hasFlexboxFallback && !hasSupportsGrid) {
        results.warnings.push({
            file: filename,
            issue: 'CSS Grid without fallback',
            severity: 'low',
            fix: 'Consider adding flexbox fallback or @supports check'
        });
        return false;
    }
    
    if (hasGrid && (hasFlexboxFallback || hasSupportsGrid)) {
        results.passed.push({
            file: filename,
            check: 'CSS Grid with fallback mechanism'
        });
        return true;
    }
    
    return true;
}

/**
 * Check if custom properties have fallback values
 */
function checkCustomPropertyFallbacks(content, filename) {
    // Find all var() usages
    const varRegex = /var\(--[a-z-]+\)/gi;
    const varUsages = content.match(varRegex) || [];
    
    // Check if there are fallback values
    const varWithFallbackRegex = /var\(--[a-z-]+,\s*[^)]+\)/gi;
    const varWithFallbacks = content.match(varWithFallbackRegex) || [];
    
    // Count properties that should have fallbacks (colors, sizes)
    const colorVars = content.match(/var\(--mase-(primary|secondary|text|background|surface)[^)]*\)/gi) || [];
    const colorVarsWithFallback = content.match(/var\(--mase-(primary|secondary|text|background|surface)[^,)]+,\s*[^)]+\)/gi) || [];
    
    if (colorVars.length > 0 && colorVarsWithFallback.length === 0) {
        results.warnings.push({
            file: filename,
            issue: `${colorVars.length} custom properties without fallback values`,
            severity: 'low',
            fix: 'Consider adding fallback values: var(--mase-primary, #2271b1)'
        });
        return false;
    }
    
    if (varUsages.length > 0) {
        results.passed.push({
            file: filename,
            check: `Custom properties used (${varUsages.length} instances)`
        });
    }
    
    return true;
}

/**
 * Check for animation performance best practices
 */
function checkAnimationPerformance(content, filename) {
    // Check for animations using expensive properties
    const expensiveProps = ['width', 'height', 'top', 'left', 'right', 'bottom', 'margin', 'padding'];
    const animationRegex = /@keyframes\s+[\w-]+\s*{([^}]+)}/gi;
    const animations = content.match(animationRegex) || [];
    
    let hasExpensiveAnimation = false;
    
    animations.forEach(animation => {
        expensiveProps.forEach(prop => {
            if (animation.includes(`${prop}:`)) {
                hasExpensiveAnimation = true;
            }
        });
    });
    
    if (hasExpensiveAnimation) {
        results.warnings.push({
            file: filename,
            issue: 'Animation using expensive properties',
            severity: 'medium',
            fix: 'Use transform and opacity for better performance'
        });
        return false;
    }
    
    if (animations.length > 0) {
        results.passed.push({
            file: filename,
            check: `Animations use performant properties (${animations.length} animations)`
        });
    }
    
    return true;
}

/**
 * Check for prefers-reduced-motion support
 */
function checkReducedMotionSupport(content, filename) {
    const hasAnimations = content.includes('@keyframes') || 
                         content.includes('animation:') ||
                         content.includes('transition:');
    const hasReducedMotion = content.includes('@media (prefers-reduced-motion:') ||
                            content.includes('@media (prefers-reduced-motion :');
    
    if (hasAnimations && !hasReducedMotion) {
        results.warnings.push({
            file: filename,
            issue: 'Animations without prefers-reduced-motion support',
            severity: 'medium',
            fix: 'Add @media (prefers-reduced-motion: reduce) to disable/reduce animations'
        });
        return false;
    }
    
    if (hasAnimations && hasReducedMotion) {
        results.passed.push({
            file: filename,
            check: 'Animations respect prefers-reduced-motion'
        });
        return true;
    }
    
    return true;
}

/**
 * Check for responsive design breakpoints
 */
function checkResponsiveBreakpoints(content, filename) {
    const hasMediaQueries = content.includes('@media');
    const hasMobileBreakpoint = content.includes('max-width: 768px') || 
                               content.includes('max-width:768px');
    const hasTabletBreakpoint = content.includes('max-width: 1024px') || 
                               content.includes('max-width:1024px');
    
    if (hasMediaQueries) {
        results.passed.push({
            file: filename,
            check: 'Responsive design with media queries'
        });
        
        if (hasMobileBreakpoint) {
            results.passed.push({
                file: filename,
                check: 'Mobile breakpoint defined'
            });
        }
        
        if (hasTabletBreakpoint) {
            results.passed.push({
                file: filename,
                check: 'Tablet breakpoint defined'
            });
        }
    }
    
    return true;
}

/**
 * Run all checks on a CSS file
 */
function checkFile(filepath) {
    const filename = path.basename(filepath);
    
    if (!fs.existsSync(filepath)) {
        results.failed.push({
            file: filename,
            issue: 'File not found',
            severity: 'high'
        });
        return;
    }
    
    const content = fs.readFileSync(filepath, 'utf8');
    
    console.log(`\nChecking ${filename}...`);
    
    checkBackdropFilterPrefix(content, filename);
    checkBackdropFilterFallback(content, filename);
    checkCSSGridFallback(content, filename);
    checkCustomPropertyFallbacks(content, filename);
    checkAnimationPerformance(content, filename);
    checkReducedMotionSupport(content, filename);
    checkResponsiveBreakpoints(content, filename);
}

/**
 * Print results
 */
function printResults() {
    console.log('\n' + '='.repeat(80));
    console.log('CSS BROWSER COMPATIBILITY VERIFICATION RESULTS');
    console.log('='.repeat(80));
    
    console.log(`\n✅ PASSED: ${results.passed.length} checks`);
    if (results.passed.length > 0) {
        const fileChecks = {};
        results.passed.forEach(item => {
            if (!fileChecks[item.file]) {
                fileChecks[item.file] = [];
            }
            fileChecks[item.file].push(item.check);
        });
        
        Object.keys(fileChecks).forEach(file => {
            console.log(`\n  ${file}:`);
            fileChecks[file].forEach(check => {
                console.log(`    ✓ ${check}`);
            });
        });
    }
    
    if (results.warnings.length > 0) {
        console.log(`\n⚠️  WARNINGS: ${results.warnings.length} issues`);
        results.warnings.forEach(item => {
            console.log(`\n  ${item.file}:`);
            console.log(`    Issue: ${item.issue}`);
            console.log(`    Severity: ${item.severity}`);
            console.log(`    Fix: ${item.fix}`);
        });
    }
    
    if (results.failed.length > 0) {
        console.log(`\n❌ FAILED: ${results.failed.length} critical issues`);
        results.failed.forEach(item => {
            console.log(`\n  ${item.file}:`);
            console.log(`    Issue: ${item.issue}`);
            console.log(`    Severity: ${item.severity}`);
            if (item.fix) {
                console.log(`    Fix: ${item.fix}`);
            }
        });
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total checks: ${results.passed.length + results.warnings.length + results.failed.length}`);
    console.log(`Passed: ${results.passed.length}`);
    console.log(`Warnings: ${results.warnings.length}`);
    console.log(`Failed: ${results.failed.length}`);
    
    if (results.failed.length === 0) {
        console.log('\n✅ All critical browser compatibility checks passed!');
        if (results.warnings.length > 0) {
            console.log(`⚠️  ${results.warnings.length} warnings to review`);
        }
    } else {
        console.log('\n❌ Critical issues found. Please fix before deployment.');
    }
    
    console.log('='.repeat(80) + '\n');
}

/**
 * Main execution
 */
function main() {
    console.log('Starting CSS Browser Compatibility Verification...\n');
    
    CSS_FILES.forEach(file => {
        checkFile(file);
    });
    
    printResults();
    
    // Exit with error code if there are failures
    if (results.failed.length > 0) {
        process.exit(1);
    }
}

// Run the verification
main();
