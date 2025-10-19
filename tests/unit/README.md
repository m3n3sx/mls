# MASE JavaScript Unit Tests

## Overview

This directory contains comprehensive unit tests for the Modern Admin Styler Enterprise (MASE) JavaScript functionality. The tests are written using Jest and cover all critical utility functions and methods.

## Test Coverage

### 1. MASE.debounce() - Utility Function
**File:** `test-mase-admin.test.js`

Tests the debounce utility function that delays function execution:
- Delays execution by specified wait time
- Cancels previous calls when invoked multiple times
- Passes arguments correctly
- Preserves context (this)
- Handles zero wait time

### 2. MASE.paletteManager.apply() - Palette Application
**File:** `test-mase-admin.test.js`

Tests palette application functionality:
- Shows loading notice
- Disables buttons during operation
- Makes correct AJAX requests
- Handles edge cases (empty/null IDs)

### 3. MASE.livePreview.generateCSS() - CSS Generation
**File:** `test-mase-admin.test.js`

Tests live preview CSS generation:
- Generates CSS from settings object
- Handles empty/partial settings
- Creates valid CSS selectors
- Handles null values gracefully

### 4. MASE.importExport.validateJSON() - JSON Validation
**File:** `test-mase-admin.test.js`

Tests JSON validation for import/export:
- Validates correct JSON structure
- Rejects invalid data types
- Validates plugin identifier
- Validates settings object
- Handles version validation

### 5. MASE.keyboardShortcuts.handleShortcut() - Keyboard Shortcuts
**File:** `test-mase-admin.test.js`

Tests keyboard shortcut handling:
- Palette switching (Ctrl+Shift+1-0)
- Theme toggle (Ctrl+Shift+T)
- Focus mode toggle (Ctrl+Shift+F)
- Performance mode toggle (Ctrl+Shift+P)
- Enable/disable functionality
- Key combination validation

## Running Tests

### Prerequisites

1. **Node.js** (v14 or higher)
2. **npm** (comes with Node.js)

### Installation

From the plugin root directory:

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage Report

```bash
npm run test:coverage
```

### Using the Test Runner Script

```bash
./tests/run-unit-tests.sh
```

## Test Structure

Each test suite follows this structure:

```javascript
describe('Function/Method Name', () => {
    beforeEach(() => {
        // Setup: Reset mocks, create test data
    });
    
    test('should do something specific', () => {
        // Arrange: Set up test conditions
        // Act: Execute the function
        // Assert: Verify the results
    });
});
```

## Mocking

The tests use the following mocks:

- **jQuery ($)**: Mocked for DOM manipulation and AJAX
- **WordPress Color Picker**: Mocked wpColorPicker plugin
- **AJAX Requests**: Mocked $.ajax() calls
- **Timers**: Jest fake timers for debounce testing
- **DOM Elements**: Created using jsdom

## Coverage Thresholds

Minimum coverage requirements:
- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%
- **Statements:** 80%

## Test Files

```
tests/unit/
├── README.md                    # This file
└── test-mase-admin.test.js     # Main test file (750+ lines)
```

## Adding New Tests

When adding new tests:

1. Follow the existing test structure
2. Use descriptive test names
3. Mock external dependencies
4. Test both success and failure cases
5. Include edge case testing
6. Maintain 80%+ coverage

### Example Test Template

```javascript
describe('MASE.newFunction()', () => {
    let MASE;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Setup MASE object
        MASE = {
            newFunction: function(param) {
                // Implementation
            }
        };
    });
    
    test('should handle valid input', () => {
        const result = MASE.newFunction('valid');
        expect(result).toBe('expected');
    });
    
    test('should handle invalid input', () => {
        const result = MASE.newFunction(null);
        expect(result).toBeNull();
    });
});
```

## Debugging Tests

### Run a Single Test File

```bash
npm test test-mase-admin.test.js
```

### Run a Single Test Suite

```bash
npm test -- --testNamePattern="MASE.debounce"
```

### Run with Verbose Output

```bash
npm test -- --verbose
```

### Debug in VS Code

Add this configuration to `.vscode/launch.json`:

```json
{
    "type": "node",
    "request": "launch",
    "name": "Jest Debug",
    "program": "${workspaceFolder}/node_modules/.bin/jest",
    "args": ["--runInBand", "--no-cache"],
    "console": "integratedTerminal",
    "internalConsoleOptions": "neverOpen"
}
```

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run JavaScript Tests
  run: |
    npm install
    npm test
```

## Troubleshooting

### Tests Not Running

1. Ensure Node.js and npm are installed
2. Run `npm install` to install dependencies
3. Check for syntax errors in test files

### Mock Issues

1. Verify jQuery is properly mocked
2. Check that DOM elements are created in beforeEach
3. Ensure $.ajax is mocked before tests run

### Coverage Issues

1. Run `npm run test:coverage` to see coverage report
2. Add tests for uncovered branches
3. Ensure all edge cases are tested

## Requirements Mapping

| Task Requirement | Test Suite | Status |
|-----------------|------------|--------|
| Test MASE.debounce() | debounce() suite | ✅ Complete |
| Test MASE.paletteManager.apply() | paletteManager.apply() suite | ✅ Complete |
| Test MASE.livePreview.generateCSS() | livePreview.generateCSS() suite | ✅ Complete |
| Test MASE.importExport.validateJSON() | importExport.validateJSON() suite | ✅ Complete |
| Test MASE.keyboardShortcuts.handleShortcut() | keyboardShortcuts.handleShortcut() suite | ✅ Complete |

## Related Documentation

- [Task 24 Implementation Summary](../TASK-24-IMPLEMENTATION-SUMMARY.md)
- [Main Plugin Documentation](../../README.md)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## Support

For issues or questions about the tests:
1. Check this README
2. Review test implementation in `test-mase-admin.test.js`
3. Consult Jest documentation
4. Review implementation summary document

---

**Last Updated:** Task 24 Implementation
**Test Count:** 37 tests across 5 suites
**Coverage Target:** 80% minimum
