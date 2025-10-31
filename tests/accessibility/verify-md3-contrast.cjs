/**
 * MD3 Color Contrast Verification
 * 
 * Verifies WCAG 2.1 AA contrast requirements for Material Design 3 colors
 * Requirements: 21.1 - Maintain WCAG 2.1 AA contrast ratios for all text
 * 
 * WCAG 2.1 AA Requirements:
 * - Normal text (< 18pt): 4.5:1 minimum
 * - Large text (≥ 18pt or ≥ 14pt bold): 3:1 minimum
 * - UI components and graphics: 3:1 minimum
 */

const fs = require('fs');
const path = require('path');

/**
 * Calculate relative luminance of a color
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {number} Relative luminance (0-1)
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
 * @param {string} color1 - Hex color (e.g., '#6750a4')
 * @param {string} color2 - Hex color (e.g., '#ffffff')
 * @returns {number} Contrast ratio (1-21)
 */
function getContrastRatio(color1, color2) {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const lum1 = getLuminance(r1, g1, b1);
    const lum2 = getLuminance(r2, g2, b2);
    
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG requirements
 * @param {number} ratio - Contrast ratio
 * @param {string} level - 'AA' or 'AAA'
 * @param {boolean} isLargeText - Whether text is large (≥18pt or ≥14pt bold)
 * @returns {boolean} Whether requirement is met
 */
function meetsWCAG(ratio, level = 'AA', isLargeText = false) {
    if (level === 'AAA') {
        return isLargeText ? ratio >= 4.5 : ratio >= 7;
    }
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * MD3 Color Palette - Light Mode
 */
const lightModeColors = {
    primary: '#6750a4',
    onPrimary: '#ffffff',
    primaryContainer: '#e9ddff',
    onPrimaryContainer: '#22005d',
    
    secondary: '#625b71',
    onSecondary: '#ffffff',
    secondaryContainer: '#e8def8',
    onSecondaryContainer: '#1e192b',
    
    tertiary: '#7d5260',
    onTertiary: '#ffffff',
    tertiaryContainer: '#ffd8e4',
    onTertiaryContainer: '#370b1e',
    
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#410002',
    
    surface: '#fffbfe',
    onSurface: '#1c1b1f',
    surfaceVariant: '#e7e0ec',
    onSurfaceVariant: '#49454f',
    
    outline: '#79747e',
    outlineVariant: '#cac4d0',
    
    background: '#fffbfe',
    onBackground: '#1c1b1f'
};

/**
 * MD3 Color Palette - Dark Mode
 */
const darkModeColors = {
    primary: '#cfbcff',
    onPrimary: '#381e72',
    primaryContainer: '#4f378a',
    onPrimaryContainer: '#e9ddff',
    
    secondary: '#cbc2db',
    onSecondary: '#332d41',
    secondaryContainer: '#4a4458',
    onSecondaryContainer: '#e8def8',
    
    tertiary: '#efb8c8',
    onTertiary: '#4a2532',
    tertiaryContainer: '#633b48',
    onTertiaryContainer: '#ffd8e4',
    
    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',
    
    surface: '#1c1b1f',
    onSurface: '#e6e1e5',
    surfaceVariant: '#49454f',
    onSurfaceVariant: '#cac4d0',
    
    outline: '#948f99',
    outlineVariant: '#49454f',
    
    background: '#1c1b1f',
    onBackground: '#e6e1e5'
};

/**
 * Color pairs to test (background, foreground)
 */
const colorPairs = [
    // Primary colors
    { bg: 'primary', fg: 'onPrimary', context: 'Primary button text' },
    { bg: 'primaryContainer', fg: 'onPrimaryContainer', context: 'Primary container text' },
    
    // Secondary colors
    { bg: 'secondary', fg: 'onSecondary', context: 'Secondary button text' },
    { bg: 'secondaryContainer', fg: 'onSecondaryContainer', context: 'Secondary container text' },
    
    // Tertiary colors
    { bg: 'tertiary', fg: 'onTertiary', context: 'Tertiary button text' },
    { bg: 'tertiaryContainer', fg: 'onTertiaryContainer', context: 'Tertiary container text' },
    
    // Error colors
    { bg: 'error', fg: 'onError', context: 'Error button text' },
    { bg: 'errorContainer', fg: 'onErrorContainer', context: 'Error container text' },
    
    // Surface colors
    { bg: 'surface', fg: 'onSurface', context: 'Body text on surface' },
    { bg: 'surfaceVariant', fg: 'onSurfaceVariant', context: 'Text on surface variant' },
    
    // Background colors
    { bg: 'background', fg: 'onBackground', context: 'Body text on background' },
    
    // Outline on surface (for borders)
    { bg: 'surface', fg: 'outline', context: 'Outline on surface' },
    { bg: 'surface', fg: 'outlineVariant', context: 'Outline variant on surface' }
];

/**
 * Run contrast verification
 */
function verifyContrast() {
    console.log('='.repeat(80));
    console.log('MD3 COLOR CONTRAST VERIFICATION');
    console.log('WCAG 2.1 AA Requirements: 4.5:1 (normal text), 3:1 (large text/UI)');
    console.log('='.repeat(80));
    console.log();
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    const failures = [];
    
    // Test Light Mode
    console.log('LIGHT MODE');
    console.log('-'.repeat(80));
    
    colorPairs.forEach(pair => {
        const bgColor = lightModeColors[pair.bg];
        const fgColor = lightModeColors[pair.fg];
        const ratio = getContrastRatio(bgColor, fgColor);
        const passesNormal = meetsWCAG(ratio, 'AA', false);
        const passesLarge = meetsWCAG(ratio, 'AA', true);
        
        totalTests++;
        
        const status = passesNormal ? '✓ PASS' : (passesLarge ? '⚠ LARGE' : '✗ FAIL');
        const statusColor = passesNormal ? '\x1b[32m' : (passesLarge ? '\x1b[33m' : '\x1b[31m');
        const resetColor = '\x1b[0m';
        
        console.log(`${statusColor}${status}${resetColor} ${ratio.toFixed(2)}:1 - ${pair.context}`);
        console.log(`      ${pair.bg}: ${bgColor} / ${pair.fg}: ${fgColor}`);
        
        if (passesNormal) {
            passedTests++;
        } else if (passesLarge) {
            console.log(`      ⚠ Only passes for large text (≥18pt or ≥14pt bold)`);
            passedTests++;
        } else {
            failedTests++;
            failures.push({
                mode: 'Light',
                context: pair.context,
                bg: pair.bg,
                bgColor,
                fg: pair.fg,
                fgColor,
                ratio: ratio.toFixed(2)
            });
        }
        console.log();
    });
    
    // Test Dark Mode
    console.log('DARK MODE');
    console.log('-'.repeat(80));
    
    colorPairs.forEach(pair => {
        const bgColor = darkModeColors[pair.bg];
        const fgColor = darkModeColors[pair.fg];
        const ratio = getContrastRatio(bgColor, fgColor);
        const passesNormal = meetsWCAG(ratio, 'AA', false);
        const passesLarge = meetsWCAG(ratio, 'AA', true);
        
        totalTests++;
        
        const status = passesNormal ? '✓ PASS' : (passesLarge ? '⚠ LARGE' : '✗ FAIL');
        const statusColor = passesNormal ? '\x1b[32m' : (passesLarge ? '\x1b[33m' : '\x1b[31m');
        const resetColor = '\x1b[0m';
        
        console.log(`${statusColor}${status}${resetColor} ${ratio.toFixed(2)}:1 - ${pair.context}`);
        console.log(`      ${pair.bg}: ${bgColor} / ${pair.fg}: ${fgColor}`);
        
        if (passesNormal) {
            passedTests++;
        } else if (passesLarge) {
            console.log(`      ⚠ Only passes for large text (≥18pt or ≥14pt bold)`);
            passedTests++;
        } else {
            failedTests++;
            failures.push({
                mode: 'Dark',
                context: pair.context,
                bg: pair.bg,
                bgColor,
                fg: pair.fg,
                fgColor,
                ratio: ratio.toFixed(2)
            });
        }
        console.log();
    });
    
    // Summary
    console.log('='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total tests: ${totalTests}`);
    console.log(`\x1b[32mPassed: ${passedTests}\x1b[0m`);
    console.log(`\x1b[31mFailed: ${failedTests}\x1b[0m`);
    console.log();
    
    if (failures.length > 0) {
        console.log('\x1b[31mFAILURES:\x1b[0m');
        console.log('-'.repeat(80));
        failures.forEach(failure => {
            console.log(`${failure.mode} Mode - ${failure.context}`);
            console.log(`  Background: ${failure.bg} (${failure.bgColor})`);
            console.log(`  Foreground: ${failure.fg} (${failure.fgColor})`);
            console.log(`  Ratio: ${failure.ratio}:1 (needs 4.5:1 for normal text)`);
            console.log();
        });
        
        // Write failures to file
        const reportPath = path.join(__dirname, 'contrast-failures.json');
        fs.writeFileSync(reportPath, JSON.stringify(failures, null, 2));
        console.log(`Failures written to: ${reportPath}`);
        console.log();
        
        process.exit(1);
    } else {
        console.log('\x1b[32m✓ All color combinations meet WCAG 2.1 AA requirements!\x1b[0m');
        console.log();
        process.exit(0);
    }
}

// Run verification
verifyContrast();
