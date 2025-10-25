# Testing Quick Start Guide

Quick reference for writing and running tests in MASE.

## Run Tests

```bash
# Unit tests (fast)
npm test

# Unit tests with coverage
npm run test:coverage

# E2E tests (requires WordPress running)
npm run test:e2e

# Watch mode (auto-rerun on changes)
npm run test:watch
```

## Write a Unit Test

```javascript
// tests/unit/my-module.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { MyModule } from '@modules/my-module.js';
import { createMockAPIClient } from '@test-utils';

describe('MyModule', () => {
  let myModule;
  let mockAPI;

  beforeEach(() => {
    mockAPI = createMockAPIClient();
    myModule = new MyModule(mockAPI);
  });

  it('should do something', () => {
    const result = myModule.doSomething();
    expect(result).toBe('expected value');
  });
});
```

## Write an E2E Test

```javascript
// tests/e2e/my-feature.spec.js
import { test, expect } from './fixtures/wordpress-auth.js';

test('should perform user action', async ({ maseSettingsPage }) => {
  // Interact with page
  await maseSettingsPage.click('.my-button');
  
  // Assert result
  await expect(maseSettingsPage.locator('.result')).toBeVisible();
});
```

## Common Test Utilities

```javascript
import {
  // Mocks
  mockSettings,
  createMockAPIClient,
  
  // DOM Fixtures
  setupMASEAdminPage,
  createPaletteCard,
  cleanupDOM,
  
  // Data Generators
  generateRandomSettings,
  generateTemplate,
  generatePalette,
} from '@test-utils';
```

## Test Structure

```javascript
describe('Feature Name', () => {
  // Setup before each test
  beforeEach(() => {
    // Initialize test state
  });

  // Cleanup after each test
  afterEach(() => {
    cleanupDOM();
  });

  // Group related tests
  describe('Specific Behavior', () => {
    it('should do X when Y happens', () => {
      // Arrange: Setup test data
      const input = 'test';
      
      // Act: Execute the code
      const result = functionUnderTest(input);
      
      // Assert: Verify the result
      expect(result).toBe('expected');
    });
  });
});
```

## Assertions

```javascript
// Equality
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeNull();

// Numbers
expect(value).toBeGreaterThan(5);
expect(value).toBeLessThan(10);
expect(value).toBeCloseTo(3.14, 2);

// Strings
expect(string).toContain('substring');
expect(string).toMatch(/regex/);

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ key: 'value' });

// Functions
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveBeenCalledTimes(2);

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow(error);
```

## Mocking

```javascript
import { vi } from 'vitest';

// Mock function
const mockFn = vi.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async value');

// Mock module
vi.mock('@modules/my-module.js', () => ({
  MyModule: vi.fn(() => ({
    method: vi.fn(),
  })),
}));

// Spy on method
const spy = vi.spyOn(object, 'method');
```

## E2E Selectors

```javascript
// By CSS selector
page.locator('.class-name')
page.locator('#id')
page.locator('[data-test="value"]')

// By text
page.locator('text=Button Text')
page.locator('button:has-text("Click")')

// By role
page.locator('role=button[name="Submit"]')

// Chaining
page.locator('.parent').locator('.child')
```

## E2E Actions

```javascript
// Click
await page.click('.button');

// Fill input
await page.fill('#input', 'value');

// Select option
await page.selectOption('#select', 'option-value');

// Check checkbox
await page.check('#checkbox');

// Wait for element
await page.waitForSelector('.element');

// Wait for navigation
await page.waitForURL(/pattern/);

// Take screenshot
await page.screenshot({ path: 'screenshot.png' });
```

## Coverage Threshold

Tests must maintain 80% coverage:
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

Check coverage: `npm run test:coverage`

## Tips

1. **Keep tests simple**: One assertion per test when possible
2. **Use descriptive names**: Test names should explain what they test
3. **Test behavior, not implementation**: Focus on what, not how
4. **Mock external dependencies**: Keep tests fast and isolated
5. **Clean up after tests**: Use `afterEach` to reset state
6. **Test edge cases**: Empty inputs, null values, errors
7. **Use fixtures**: Reuse common test data and setup

## Need Help?

- Read full documentation: `tests/README.md`
- Check existing tests: `tests/unit/event-bus.test.js`
- Vitest docs: https://vitest.dev/
- Playwright docs: https://playwright.dev/
