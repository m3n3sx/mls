/**
 * Test Data Generators
 * 
 * Provides functions to generate test data for MASE tests
 */

/**
 * Generate random hex color
 */
export function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * Generate random settings object
 */
export function generateRandomSettings() {
  return {
    version: '1.2.1',
    colors: {
      primary: generateRandomColor(),
      secondary: generateRandomColor(),
      accent: generateRandomColor(),
      background: generateRandomColor(),
      text: generateRandomColor(),
      adminBar: {
        background: generateRandomColor(),
        text: generateRandomColor(),
        hover: generateRandomColor(),
        active: generateRandomColor(),
      },
      menu: {
        background: generateRandomColor(),
        text: generateRandomColor(),
        hover: generateRandomColor(),
        active: generateRandomColor(),
      },
      content: {
        background: generateRandomColor(),
        text: generateRandomColor(),
        hover: generateRandomColor(),
        active: generateRandomColor(),
      },
    },
    typography: {
      fontFamily: 'Arial, sans-serif',
      fontSize: Math.floor(Math.random() * 10) + 12,
      lineHeight: Math.random() * 0.5 + 1.2,
      headingFont: 'Georgia, serif',
      headingWeight: [400, 500, 600, 700][Math.floor(Math.random() * 4)],
    },
    effects: {
      borderRadius: Math.floor(Math.random() * 20),
      shadows: Math.random() > 0.5,
      animations: Math.random() > 0.5,
      transitions: Math.random() > 0.5,
    },
    templates: {
      active: null,
      custom: [],
    },
    advanced: {
      customCSS: '',
      performance: {
        cacheEnabled: true,
        minifyCSS: true,
      },
    },
  };
}

/**
 * Generate template data
 */
export function generateTemplate(id, overrides = {}) {
  return {
    id: id || `template-${Date.now()}`,
    name: overrides.name || 'Test Template',
    description: overrides.description || 'A test template',
    thumbnail: overrides.thumbnail || `/assets/thumbnails/${id}.png`,
    settings: overrides.settings || generateRandomSettings(),
    category: overrides.category || 'light',
    tags: overrides.tags || ['test'],
    author: overrides.author || 'Test Author',
    version: overrides.version || '1.0.0',
  };
}

/**
 * Generate palette data
 */
export function generatePalette(id, overrides = {}) {
  const colors = {
    primary: generateRandomColor(),
    secondary: generateRandomColor(),
    accent: generateRandomColor(),
    background: generateRandomColor(),
    text: generateRandomColor(),
  };
  
  return {
    id: id || `palette-${Date.now()}`,
    name: overrides.name || 'Test Palette',
    colors: overrides.colors || colors,
    accessibility: overrides.accessibility || {
      wcagLevel: 'AA',
      contrastRatios: {
        'primary-background': 4.5,
        'text-background': 7.0,
      },
    },
  };
}

/**
 * Generate array of templates
 */
export function generateTemplates(count = 5) {
  return Array.from({ length: count }, (_, i) =>
    generateTemplate(`template-${i}`, { name: `Template ${i + 1}` })
  );
}

/**
 * Generate array of palettes
 */
export function generatePalettes(count = 5) {
  return Array.from({ length: count }, (_, i) =>
    generatePalette(`palette-${i}`, { name: `Palette ${i + 1}` })
  );
}

/**
 * Generate color scheme
 */
export function generateColorScheme() {
  return {
    background: generateRandomColor(),
    text: generateRandomColor(),
    hover: generateRandomColor(),
    active: generateRandomColor(),
  };
}

/**
 * Generate typography settings
 */
export function generateTypographySettings() {
  const fonts = [
    'Arial, sans-serif',
    'Georgia, serif',
    'Courier New, monospace',
    'system-ui, -apple-system, sans-serif',
    'Times New Roman, serif',
  ];
  
  return {
    fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
    fontSize: Math.floor(Math.random() * 10) + 12,
    lineHeight: Math.random() * 0.5 + 1.2,
    headingFont: fonts[Math.floor(Math.random() * fonts.length)],
    headingWeight: [400, 500, 600, 700][Math.floor(Math.random() * 4)],
  };
}

/**
 * Generate effects settings
 */
export function generateEffectsSettings() {
  return {
    borderRadius: Math.floor(Math.random() * 20),
    shadows: Math.random() > 0.5,
    animations: Math.random() > 0.5,
    transitions: Math.random() > 0.5,
  };
}

/**
 * Generate API response
 */
export function generateAPIResponse(success = true, data = null, message = '') {
  return {
    success,
    message: message || (success ? 'Operation successful' : 'Operation failed'),
    data: data || {},
    timestamp: Date.now(),
  };
}

/**
 * Generate API error response
 */
export function generateAPIError(code = 'UNKNOWN_ERROR', message = 'An error occurred') {
  return {
    success: false,
    error: {
      code,
      message,
      timestamp: Date.now(),
    },
  };
}

/**
 * Generate state history for undo/redo testing
 */
export function generateStateHistory(count = 10) {
  return Array.from({ length: count }, () => generateRandomSettings());
}

/**
 * Generate CSS string
 */
export function generateCSS(selector, properties) {
  const props = Object.entries(properties)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${props}\n}`;
}

/**
 * Generate random CSS properties
 */
export function generateCSSProperties() {
  return {
    'background-color': generateRandomColor(),
    'color': generateRandomColor(),
    'font-size': `${Math.floor(Math.random() * 10) + 12}px`,
    'padding': `${Math.floor(Math.random() * 20)}px`,
    'margin': `${Math.floor(Math.random() * 20)}px`,
    'border-radius': `${Math.floor(Math.random() * 10)}px`,
  };
}

/**
 * Generate event data
 */
export function generateEventData(eventType, data = {}) {
  return {
    type: eventType,
    timestamp: Date.now(),
    data,
  };
}

/**
 * Generate user action
 */
export function generateUserAction(action, target, value = null) {
  return {
    action,
    target,
    value,
    timestamp: Date.now(),
  };
}

/**
 * Generate performance metrics
 */
export function generatePerformanceMetrics() {
  return {
    loadTime: Math.random() * 1000,
    renderTime: Math.random() * 100,
    cssGenerationTime: Math.random() * 50,
    apiResponseTime: Math.random() * 500,
    memoryUsage: Math.random() * 100,
  };
}

/**
 * Generate accessibility report
 */
export function generateAccessibilityReport(passed = true) {
  return {
    passed,
    violations: passed ? [] : [
      {
        id: 'color-contrast',
        impact: 'serious',
        description: 'Elements must have sufficient color contrast',
        nodes: [
          {
            target: ['#element-1'],
            html: '<div>Low contrast text</div>',
          },
        ],
      },
    ],
    passes: passed ? [
      {
        id: 'color-contrast',
        impact: 'serious',
        description: 'Elements must have sufficient color contrast',
      },
    ] : [],
    timestamp: Date.now(),
  };
}

/**
 * Generate mock WordPress user
 */
export function generateWordPressUser(role = 'administrator') {
  return {
    id: Math.floor(Math.random() * 1000),
    username: `user${Math.floor(Math.random() * 1000)}`,
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
    role,
    capabilities: {
      manage_options: role === 'administrator',
      edit_posts: true,
      read: true,
    },
  };
}

/**
 * Generate mock nonce
 */
export function generateNonce() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
