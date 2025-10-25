/**
 * Vitest Setup File
 * 
 * Global test setup and WordPress mocks
 */

import { vi } from 'vitest';

// Mock WordPress globals
global.wp = {
  ajax: {
    post: vi.fn(),
    send: vi.fn(),
  },
  hooks: {
    addAction: vi.fn(),
    addFilter: vi.fn(),
    doAction: vi.fn(),
    applyFilters: vi.fn(),
  },
  i18n: {
    __: (text) => text,
    _x: (text) => text,
    _n: (single, plural, number) => (number === 1 ? single : plural),
  },
};

// Mock jQuery
global.jQuery = vi.fn(() => ({
  on: vi.fn(),
  off: vi.fn(),
  trigger: vi.fn(),
  find: vi.fn(),
  addClass: vi.fn(),
  removeClass: vi.fn(),
  toggleClass: vi.fn(),
  css: vi.fn(),
  attr: vi.fn(),
  val: vi.fn(),
  text: vi.fn(),
  html: vi.fn(),
  append: vi.fn(),
  remove: vi.fn(),
  each: vi.fn(),
  length: 0,
}));

global.$ = global.jQuery;

// Mock maseData (localized script data)
global.maseData = {
  restUrl: 'http://localhost/wp-json/mase/v1',
  nonce: 'test-nonce-12345',
  ajaxUrl: 'http://localhost/wp-admin/admin-ajax.php',
  features: {
    MASE_MODERN_PREVIEW: false,
    MASE_USE_LEGACY: true,
  },
  settings: {
    colors: {
      primary: '#0073aa',
      secondary: '#23282d',
    },
    typography: {
      fontFamily: 'system-ui',
      fontSize: 14,
    },
  },
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock performance API
global.performance = {
  now: () => Date.now(),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn(() => []),
  getEntriesByType: vi.fn(() => []),
};

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => {
  return setTimeout(callback, 16);
});

global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id);
});

// Mock fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);
