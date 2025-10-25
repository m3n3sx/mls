# MASE Testing Infrastructure

This directory contains the comprehensive testing infrastructure for the Modern Admin Styler (MASE) plugin.

## Overview

The testing infrastructure includes:

- **Unit Tests**: Test individual modules and functions in isolation
- **Integration Tests**: Test interactions between multiple modules
- **E2E Tests**: Test complete user workflows in a real browser
- **Test Utilities**: Reusable mocks, fixtures, and data generators

## Directory Structure

```
tests/
├── unit/                    # Unit tests for individual modules
├── integration/             # Integration tests for module interactions
├── e2e/                     # End-to-end tests with Playwright
│   └── fixtures/           # E2E test fixtures (auth, etc.)
├── utils/                   # Test utilities and helpers
│   ├── wordpress-api-mocks.js    # WordPress REST API mocks
│   ├── dom-fixtures.js           # DOM element fixtures
│   ├── test-data-generators.js   # Test data generators
│   └── index.js                  # Central export point
├── setup.js                 # Global test setup
└── README.md               # This file
```

## Running Tests

### Unit and Integration Tests (Vitest)

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Set WordPress URL for E2E tests
WP_BASE_URL=http://localhost:8080 npm run test:e2e
```

## Configuration

### Vitest Configuration

Located in `vitest.config.js`:

- **Environment**: jsdom (browser-like environment)
- **Coverage**: 80% minimum threshold for branches, functions, lines, statements
- **Test Files**: `tests/unit/**/*.test.js`, `tests/integration/**/*.test.js`
- **Setup File**: `tests/setup.js`

### Playwright Configuration

Located in `playwright.config.js`:

- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Screenshots**: Captured on test failure
- **Videos**: Retained on test failure
- **Base URL**: Configurable via `WP_BASE_URL` environment variable

## Test Utilities

### WordPress API Mocks

```javascript
import { 
  mockSettings, 
  createMockAPIClient,
  mockWordPressRestAPI 
} from '@test-utils';

// Use mock settings
const settings = mockSettings;

// Create mock API client
const apiClient = createMockAPIClient();
await apiClient.getSettings(); // Returns mockSettings

// Mock fetch API
mockWordPressRestAPI();
```

### DOM Fixtures

```javascript
import { 
  setupMASEAdminPage,
  createPaletteCard,
  cleanupDOM 
} from '@test-utils';

// Setup complete MASE admin page
setupMASEAdminPage();

// Create individual components
const paletteCard = createPaletteCard('ocean-breeze', 'Ocean Breeze', true);
document.body.appendChild(paletteCard);

// Cleanup after test
cleanupDOM();
```

### Test Data Generators

```javascript
import { 
  generateRandomSettings,
  generateTemplate,
  generatePalette 
} from '@test-utils';

// Generate random settings
const settings = generateRandomSettings();

// Generate template with overrides
const template = generateTemplate('my-template', {
  name: 'My Custom Template',
  category: 'dark'
});

// Generate palette
const palette = generatePalette('my-palette', {
  name: 'My Custom Palette'
});
```

## Writing Tests

### Unit Test Example

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { EventBus } from '@modules/event-bus.js';

describe('EventBus', () => {
  let eventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it('should emit and receive events', () => {
    const handler = vi.fn();
    eventBus.on('test:event', handler);
    
    eventBus.emit('test:event', { data: 'test' });
    
    expect(handler).toHaveBeenCalledWith({ data: 'test' }, 'test:event');
  });
});
```

### E2E Test Example

```javascript
import { test, expect } from './fixtures/wordpress-auth.js';

test('should save settings', async ({ maseSettingsPage }) => {
  // Change a setting
  await maseSettingsPage.fill('#admin-bar-bg-color', '#ff0000');
  
  // Save settings
  await maseSettingsPage.click('.mase-save-btn');
  
  // Wait for success notice
  await maseSettingsPage.waitForSelector('.mase-notice-success');
  
  // Verify notice message
  const notice = await maseSettingsPage.textContent('.mase-notice-success');
  expect(notice).toContain('Settings saved successfully');
});
```

## WordPress Authentication

E2E tests use WordPress authentication fixtures:

```javascript
import { test } from './fixtures/wordpress-auth.js';

// Use authenticated page fixture
test('my test', async ({ authenticatedPage }) => {
  // Already logged in to WordPress admin
  await authenticatedPage.goto('/wp-admin/');
});

// Use MASE settings page fixture
test('my test', async ({ maseSettingsPage }) => {
  // Already on MASE settings page
  // Ready to interact with MASE UI
});
```

### Environment Variables

Set these environment variables for E2E tests:

```bash
WP_BASE_URL=http://localhost:8080      # WordPress installation URL
WP_ADMIN_USER=admin                     # WordPress admin username
WP_ADMIN_PASSWORD=password              # WordPress admin password
```

## Coverage Reports

After running `npm run test:coverage`, coverage reports are generated in:

- `coverage/index.html` - HTML coverage report (open in browser)
- `coverage/lcov.info` - LCOV format for CI/CD integration
- `coverage/coverage-final.json` - JSON format

## Best Practices

### Unit Tests

1. Test one thing per test
2. Use descriptive test names
3. Follow AAA pattern: Arrange, Act, Assert
4. Mock external dependencies
5. Clean up after tests (use `afterEach`)

### Integration Tests

1. Test realistic scenarios
2. Use actual module implementations
3. Mock only external services (API, database)
4. Test error handling and edge cases

### E2E Tests

1. Test critical user workflows
2. Use page object pattern for complex pages
3. Wait for elements before interacting
4. Take screenshots on failure
5. Keep tests independent and isolated

## Troubleshooting

### Tests Fail with "Module not found"

Make sure you're using the correct import alias:
- `@modules` for module imports
- `@test-utils` for test utility imports

### E2E Tests Fail to Connect

1. Verify WordPress is running at `WP_BASE_URL`
2. Check WordPress admin credentials
3. Ensure MASE plugin is activated

### Coverage Below Threshold

Run `npm run test:coverage` to see which files need more tests.
Focus on:
- Untested functions
- Uncovered branches (if/else statements)
- Edge cases and error handling

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Unit Tests
  run: npm test

- name: Run E2E Tests
  run: |
    docker-compose up -d
    npm run test:e2e
  env:
    WP_BASE_URL: http://localhost:8080
    WP_ADMIN_USER: admin
    WP_ADMIN_PASSWORD: password
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
