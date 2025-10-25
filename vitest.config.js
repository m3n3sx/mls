import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Global test setup
    globals: true,
    
    // Test file patterns
    include: [
      'tests/unit/**/*.test.js',
      'tests/integration/**/*.test.js',
    ],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['assets/js/modules/**/*.js'],
      exclude: [
        'assets/js/modules/index.js',
        '**/*.test.js',
        '**/*.spec.js',
        '**/node_modules/**',
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    
    // Test timeout
    testTimeout: 10000,
    
    // Setup files
    setupFiles: ['./tests/setup.js'],
    
    // Mock WordPress globals
    globals: {
      wp: {},
      jQuery: {},
      maseData: {},
    },
  },
  
  // Resolve configuration (same as vite.config.js)
  resolve: {
    alias: {
      '@': resolve(__dirname, 'assets/js'),
      '@modules': resolve(__dirname, 'assets/js/modules'),
      '@test-utils': resolve(__dirname, 'tests/utils'),
    },
  },
});
