/**
 * MD3 Dark Mode Contrast Verification
 * 
 * Verifies that all MD3 color tokens meet WCAG 2.1 AA contrast requirements
 * in both light and dark modes across all 5 palettes.
 * 
 * Requirements: 20.5
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

/**
 * Calculate relative luminance of an RGB color
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
 */
function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse hex color to RGB array
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

/**
 * MD3 Color Palettes - Light Mode
 */
const LIGHT_MODE_PALETTES = {
  purple: {
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
    inverseSurface: '#313033',
    inverseOnSurface: '#f4eff4'
  },
  blue: {
    primary: '#0061a4',
    onPrimary: '#ffffff',
    primaryContainer: '#d1e4ff',
    onPrimaryContainer: '#001d35',
    secondary: '#535f70',
    onSecondary: '#ffffff',
    secondaryContainer: '#d7e3f7',
    onSecondaryContainer: '#101c2b',
    tertiary: '#6b5778',
    onTertiary: '#ffffff',
    tertiaryContainer: '#f2daff',
    onTertiaryContainer: '#251431',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#410002',
    surface: '#fdfcff',
    onSurface: '#1a1c1e',
    surfaceVariant: '#dfe2eb',
    onSurfaceVariant: '#43474e'
  },
  green: {
    primary: '#006e1c',
    onPrimary: '#ffffff',
    primaryContainer: '#96f990',
    onPrimaryContainer: '#002204',
    secondary: '#526350',
    onSecondary: '#ffffff',
    secondaryContainer: '#d4e8d0',
    onSecondaryContainer: '#101f10',
    tertiary: '#39656b',
    onTertiary: '#ffffff',
    tertiaryContainer: '#bcebf2',
    onTertiaryContainer: '#001f23',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#410002',
    surface: '#fcfdf7',
    onSurface: '#1a1c19',
    surfaceVariant: '#dfe4dd',
    onSurfaceVariant: '#43483f'
  },
  orange: {
    primary: '#8b5000',
    onPrimary: '#ffffff',
    primaryContainer: '#ffddb3',
    onPrimaryContainer: '#2c1600',
    secondary: '#6f5b40',
    onSecondary: '#ffffff',
    secondaryContainer: '#f9debc',
    onSecondaryContainer: '#271904',
    tertiary: '#51643f',
    onTertiary: '#ffffff',
    tertiaryContainer: '#d3eaba',
    onTertiaryContainer: '#102004',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#410002',
    surface: '#fffbff',
    onSurface: '#1f1b16',
    surfaceVariant: '#ede1d1',
    onSurfaceVariant: '#4d4639'
  },
  pink: {
    primary: '#a9004f',
    onPrimary: '#ffffff',
    primaryContainer: '#ffd9e2',
    onPrimaryContainer: '#3e0016',
    secondary: '#75565d',
    onSecondary: '#ffffff',
    secondaryContainer: '#ffd9e0',
    onSecondaryContainer: '#2b151b',
    tertiary: '#7d5635',
    onTertiary: '#ffffff',
    tertiaryContainer: '#ffdcc1',
    onTertiaryContainer: '#2f1500',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#410002',
    surface: '#fffbff',
    onSurface: '#201a1b',
    surfaceVariant: '#f2dde1',
    onSurfaceVariant: '#514347'
  }
};

/**
 * MD3 Color Palettes - Dark Mode
 */
const DARK_MODE_PALETTES = {
  purple: {
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
    inverseSurface: '#e6e1e5',
    inverseOnSurface: '#313033'
  },
  blue: {
    primary: '#9ecaff',
    onPrimary: '#003258',
    primaryContainer: '#00497d',
    onPrimaryContainer: '#d1e4ff',
    secondary: '#bbc7db',
    onSecondary: '#253140',
    secondaryContainer: '#3c4758',
    onSecondaryContainer: '#d7e3f7',
    tertiary: '#d6bee4',
    onTertiary: '#3b2948',
    tertiaryContainer: '#523f5f',
    onTertiaryContainer: '#f2daff',
    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',
    surface: '#1a1c1e',
    onSurface: '#e2e2e5',
    surfaceVariant: '#43474e',
    onSurfaceVariant: '#c3c6cf'
  },
  green: {
    primary: '#7bdc76',
    onPrimary: '#00390a',
    primaryContainer: '#005313',
    onPrimaryContainer: '#96f990',
    secondary: '#b8ccb5',
    onSecondary: '#243424',
    secondaryContainer: '#3a4b39',
    onSecondaryContainer: '#d4e8d0',
    tertiary: '#a0cfd6',
    onTertiary: '#00363b',
    tertiaryContainer: '#1f4d53',
    onTertiaryContainer: '#bcebf2',
    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',
    surface: '#1a1c19',
    onSurface: '#e2e3dd',
    surfaceVariant: '#43483f',
    onSurfaceVariant: '#c3c8bd'
  },
  orange: {
    primary: '#ffb951',
    onPrimary: '#4a2800',
    primaryContainer: '#6a3c00',
    onPrimaryContainer: '#ffddb3',
    secondary: '#ddc2a1',
    onSecondary: '#3e2e16',
    secondaryContainer: '#56442a',
    onSecondaryContainer: '#f9debc',
    tertiary: '#b7ce9f',
    onTertiary: '#243516',
    tertiaryContainer: '#3a4c2a',
    onTertiaryContainer: '#d3eaba',
    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',
    surface: '#1f1b16',
    onSurface: '#e9e1d9',
    surfaceVariant: '#4d4639',
    onSurfaceVariant: '#d0c5b4'
  },
  pink: {
    primary: '#ffb1c8',
    onPrimary: '#650033',
    primaryContainer: '#8b0049',
    onPrimaryContainer: '#ffd9e2',
    secondary: '#e2bdc4',
    onSecondary: '#422930',
    secondaryContainer: '#5a3f46',
    onSecondaryContainer: '#ffd9e0',
    tertiary: '#e7c08d',
    onTertiary: '#45290c',
    tertiaryContainer: '#5e3f20',
    onTertiaryContainer: '#ffdcc1',
    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',
    surface: '#201a1b',
    onSurface: '#ece0e1',
    surfaceVariant: '#514347',
    onSurfaceVariant: '#d5c2c6'
  }
};

/**
 * Test color pairs
 */
const COLOR_PAIRS = [
  { bg: 'primary', fg: 'onPrimary', name: 'Primary' },
  { bg: 'primaryContainer', fg: 'onPrimaryContainer', name: 'Primary Container' },
  { bg: 'secondary', fg: 'onSecondary', name: 'Secondary' },
  { bg: 'secondaryContainer', fg: 'onSecondaryContainer', name: 'Secondary Container' },
  { bg: 'tertiary', fg: 'onTertiary', name: 'Tertiary' },
  { bg: 'tertiaryContainer', fg: 'onTertiaryContainer', name: 'Tertiary Container' },
  { bg: 'error', fg: 'onError', name: 'Error' },
  { bg: 'errorContainer', fg: 'onErrorContainer', name: 'Error Container' },
  { bg: 'surface', fg: 'onSurface', name: 'Surface' },
  { bg: 'surfaceVariant', fg: 'onSurfaceVariant', name: 'Surface Variant' }
];

/**
 * Run contrast tests
 */
function runContrastTests() {
  console.log('='.repeat(80));
  console.log('MD3 Dark Mode Contrast Verification');
  console.log('='.repeat(80));
  console.log('');
  console.log('Testing all 5 palettes in light and dark modes');
  console.log('WCAG 2.1 AA Requirement: 4.5:1 for normal text, 3:1 for large text');
  console.log('');
  
  const results = {
    light: {},
    dark: {}
  };
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failures = [];
  
  // Test light mode
  console.log('LIGHT MODE');
  console.log('='.repeat(80));
  
  for (const [paletteName, palette] of Object.entries(LIGHT_MODE_PALETTES)) {
    console.log(`\n${paletteName.toUpperCase()} Palette:`);
    console.log('-'.repeat(40));
    
    results.light[paletteName] = [];
    
    for (const pair of COLOR_PAIRS) {
      const bgColor = palette[pair.bg];
      const fgColor = palette[pair.fg];
      
      if (!bgColor || !fgColor) continue;
      
      const bgRgb = hexToRgb(bgColor);
      const fgRgb = hexToRgb(fgColor);
      const ratio = getContrastRatio(bgRgb, fgRgb);
      
      totalTests++;
      const passes = ratio >= 4.5;
      
      if (passes) {
        passedTests++;
        console.log(`  ✓ ${pair.name}: ${ratio.toFixed(2)}:1`);
      } else {
        failedTests++;
        console.log(`  ✗ ${pair.name}: ${ratio.toFixed(2)}:1 (FAIL)`);
        failures.push({
          mode: 'light',
          palette: paletteName,
          pair: pair.name,
          ratio: ratio.toFixed(2),
          bg: bgColor,
          fg: fgColor
        });
      }
      
      results.light[paletteName].push({
        pair: pair.name,
        ratio: ratio.toFixed(2),
        passes
      });
    }
  }
  
  // Test dark mode
  console.log('\n\nDARK MODE');
  console.log('='.repeat(80));
  
  for (const [paletteName, palette] of Object.entries(DARK_MODE_PALETTES)) {
    console.log(`\n${paletteName.toUpperCase()} Palette:`);
    console.log('-'.repeat(40));
    
    results.dark[paletteName] = [];
    
    for (const pair of COLOR_PAIRS) {
      const bgColor = palette[pair.bg];
      const fgColor = palette[pair.fg];
      
      if (!bgColor || !fgColor) continue;
      
      const bgRgb = hexToRgb(bgColor);
      const fgRgb = hexToRgb(fgColor);
      const ratio = getContrastRatio(bgRgb, fgRgb);
      
      totalTests++;
      const passes = ratio >= 4.5;
      
      if (passes) {
        passedTests++;
        console.log(`  ✓ ${pair.name}: ${ratio.toFixed(2)}:1`);
      } else {
        failedTests++;
        console.log(`  ✗ ${pair.name}: ${ratio.toFixed(2)}:1 (FAIL)`);
        failures.push({
          mode: 'dark',
          palette: paletteName,
          pair: pair.name,
          ratio: ratio.toFixed(2),
          bg: bgColor,
          fg: fgColor
        });
      }
      
      results.dark[paletteName].push({
        pair: pair.name,
        ratio: ratio.toFixed(2),
        passes
      });
    }
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${failedTests} (${((failedTests / totalTests) * 100).toFixed(1)}%)`);
  console.log('');
  
  if (failures.length > 0) {
    console.log('FAILURES:');
    console.log('-'.repeat(80));
    failures.forEach(f => {
      console.log(`${f.mode.toUpperCase()} - ${f.palette} - ${f.pair}`);
      console.log(`  Ratio: ${f.ratio}:1 (required: 4.5:1)`);
      console.log(`  Colors: ${f.fg} on ${f.bg}`);
      console.log('');
    });
    
    console.log('✗ FAILED: Some color combinations do not meet WCAG 2.1 AA requirements');
    return false;
  } else {
    console.log('✓ PASSED: All color combinations meet WCAG 2.1 AA requirements');
    return true;
  }
}

// Run tests
const passed = runContrastTests();
process.exit(passed ? 0 : 1);
