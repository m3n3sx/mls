/**
 * WordPress API Mocks for Unit Tests
 * 
 * Provides mock implementations of WordPress REST API responses
 * for testing MASE modules without a real WordPress backend
 */

import { vi } from 'vitest';

/**
 * Mock settings data matching WordPress options structure
 */
export const mockSettings = {
  version: '1.2.1',
  colors: {
    primary: '#0073aa',
    secondary: '#23282d',
    accent: '#00a0d2',
    background: '#f1f1f1',
    text: '#32373c',
    adminBar: {
      background: '#23282d',
      text: '#ffffff',
      hover: '#00b9eb',
      active: '#00a0d2',
    },
    menu: {
      background: '#23282d',
      text: '#ffffff',
      hover: '#00b9eb',
      active: '#00a0d2',
    },
    content: {
      background: '#ffffff',
      text: '#32373c',
      hover: '#f1f1f1',
      active: '#e5e5e5',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 14,
    lineHeight: 1.5,
    headingFont: 'system-ui, -apple-system, sans-serif',
    headingWeight: 600,
  },
  effects: {
    borderRadius: 4,
    shadows: true,
    animations: true,
    transitions: true,
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

/**
 * Mock template data
 */
export const mockTemplates = [
  {
    id: 'professional-blue',
    name: 'Professional Blue',
    description: 'Clean and professional blue theme',
    thumbnail: '/assets/thumbnails/professional-blue.png',
    settings: {
      colors: {
        primary: '#0073aa',
        secondary: '#005177',
      },
    },
    category: 'light',
    tags: ['professional', 'blue', 'clean'],
    author: 'MASE Team',
    version: '1.0.0',
  },
  {
    id: 'dark-elegance',
    name: 'Dark Elegance',
    description: 'Elegant dark theme for night work',
    thumbnail: '/assets/thumbnails/dark-elegance.png',
    settings: {
      colors: {
        primary: '#1e1e1e',
        secondary: '#2d2d2d',
      },
    },
    category: 'dark',
    tags: ['dark', 'elegant', 'night'],
    author: 'MASE Team',
    version: '1.0.0',
  },
];

/**
 * Mock palette data
 */
export const mockPalettes = [
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    colors: {
      primary: '#0077be',
      secondary: '#005a8c',
      accent: '#00a8e8',
      background: '#f0f8ff',
      text: '#1a1a1a',
    },
    accessibility: {
      wcagLevel: 'AA',
      contrastRatios: {
        'primary-background': 4.8,
        'text-background': 12.5,
      },
    },
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    colors: {
      primary: '#2d5016',
      secondary: '#1f3a0f',
      accent: '#4a7c2c',
      background: '#f5f9f3',
      text: '#1a1a1a',
    },
    accessibility: {
      wcagLevel: 'AAA',
      contrastRatios: {
        'primary-background': 7.2,
        'text-background': 14.1,
      },
    },
  },
];

/**
 * Create mock API client
 */
export function createMockAPIClient() {
  return {
    getSettings: vi.fn(() => Promise.resolve(mockSettings)),
    saveSettings: vi.fn((settings) =>
      Promise.resolve({
        success: true,
        message: 'Settings saved successfully',
        data: settings,
      })
    ),
    resetSettings: vi.fn(() => Promise.resolve(mockSettings)),
    getTemplates: vi.fn(() => Promise.resolve(mockTemplates)),
    applyTemplate: vi.fn((templateId) => {
      const template = mockTemplates.find((t) => t.id === templateId);
      return Promise.resolve(template ? template.settings : mockSettings);
    }),
    getPalettes: vi.fn(() => Promise.resolve(mockPalettes)),
    applyPalette: vi.fn((paletteId) => {
      const palette = mockPalettes.find((p) => p.id === paletteId);
      return Promise.resolve(palette ? palette.colors : mockSettings.colors);
    }),
  };
}

/**
 * Create mock API client with errors
 */
export function createMockAPIClientWithErrors() {
  return {
    getSettings: vi.fn(() => Promise.reject(new Error('Network error'))),
    saveSettings: vi.fn(() =>
      Promise.reject(new Error('Failed to save settings'))
    ),
    resetSettings: vi.fn(() => Promise.reject(new Error('Reset failed'))),
    getTemplates: vi.fn(() => Promise.reject(new Error('Failed to load templates'))),
    applyTemplate: vi.fn(() =>
      Promise.reject(new Error('Failed to apply template'))
    ),
    getPalettes: vi.fn(() => Promise.reject(new Error('Failed to load palettes'))),
    applyPalette: vi.fn(() =>
      Promise.reject(new Error('Failed to apply palette'))
    ),
  };
}

/**
 * Mock fetch responses for WordPress REST API
 */
export function mockWordPressRestAPI() {
  global.fetch = vi.fn((url, options) => {
    const method = options?.method || 'GET';
    
    // Settings endpoints
    if (url.includes('/mase/v1/settings')) {
      if (method === 'GET') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockSettings),
        });
      }
      if (method === 'POST') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              success: true,
              message: 'Settings saved',
              data: mockSettings,
            }),
        });
      }
      if (method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockSettings),
        });
      }
    }
    
    // Templates endpoints
    if (url.includes('/mase/v1/templates')) {
      if (method === 'GET') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockTemplates),
        });
      }
      if (method === 'POST' && url.includes('/apply')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockSettings),
        });
      }
    }
    
    // Palettes endpoints
    if (url.includes('/mase/v1/palettes')) {
      if (method === 'GET') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockPalettes),
        });
      }
      if (method === 'POST' && url.includes('/apply')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockSettings.colors),
        });
      }
    }
    
    // Default 404 response
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not found' }),
    });
  });
}

/**
 * Reset all mocks
 */
export function resetAPIMocks() {
  vi.clearAllMocks();
}
