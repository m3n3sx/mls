# E2E Tests for MASE Modern Architecture

This directory contains end-to-end tests for critical workflows in the Modern Admin Styler (MASE) plugin.

## Test Files

### 1. settings-save-load.spec.js
Tests the complete settings save and load workflow:
- ✅ Save settings and persist after page reload
- ✅ Handle network failure with retry
- ✅ Prevent concurrent save operations
- ✅ Show loading state during save
- ✅ Load settings from server on page load

**Requirements:** 11.3  
**Task:** 15.1

### 2. template-application.spec.js
Tests the template application workflow:
- ✅ Apply template and update all settings
- ✅ Support undo after template application
- ✅ Show preview before applying template
- ✅ Handle template application errors gracefully
- ✅ Display template thumbnails and metadata
- ✅ Allow switching between templates

**Requirements:** 11.3  
**Task:** 15.2

### 3. color-palette.spec.js
Tests the color palette workflow:
- ✅ Select and apply color palette
- ✅ Show accessibility warnings for poor contrast
- ✅ Calculate and display contrast ratios
- ✅ Preview palette before applying
- ✅ Support custom palette creation
- ✅ Handle palette application errors
- ✅ Display palette color swatches

**Requirements:** 11.3  
**Task:** 15.3

### 4. typography-changes.spec.js
Tests the typography changes workflow:
- ✅ Change font and update preview
- ✅ Handle font loading failure with fallback
- ✅ Change font size and update preview
- ✅ Support fluid typography settings
- ✅ Cache loaded fonts in localStorage
- ✅ Change line height and letter spacing
- ✅ Display font preview samples

**Requirements:** 11.3  
**Task:** 15.4

### 5. rapid-changes.spec.js
Tests handling of rapid changes:
- ✅ Debounce rapid setting changes
- ✅ Handle rapid changes across multiple fields
- ✅ Support undo/redo with rapid changes
- ✅ Maintain correct state after rapid tab switching
- ✅ Handle rapid save attempts gracefully
- ✅ Debounce preview updates during slider dragging
- ✅ Handle rapid changes with validation errors
- ✅ Maintain performance with 50+ rapid changes

**Requirements:** 11.3  
**Task:** 15.5

## Running Tests

### Run all E2E tests
```bash
npm run test:e2e
```

### Run specific test file
```bash
npx playwright test tests/e2e/settings-save-load.spec.js
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Prerequisites

1. **WordPress Installation**: Tests require a running WordPress installation
2. **MASE Plugin**: The Modern Admin Styler plugin must be installed and activated
3. **Environment Variables**: Set the following environment variables:
   - `WP_BASE_URL` - WordPress installation URL (default: http://localhost:8080)
   - `WP_ADMIN_USER` - WordPress admin username (default: admin)
   - `WP_ADMIN_PASSWORD` - WordPress admin password (default: password)

Example:
```bash
WP_BASE_URL=http://localhost:8080 WP_ADMIN_USER=admin WP_ADMIN_PASSWORD=password npm run test:e2e
```

## Test Structure

All tests use the WordPress authentication fixtures from `tests/e2e/fixtures/wordpress-auth.js`:

- `authenticatedPage` - Automatically logs in to WordPress admin
- `maseSettingsPage` - Navigates to MASE settings page after login

## Test Coverage

These E2E tests cover the critical user workflows identified in the requirements:

1. **Settings Persistence** - Ensuring settings save and load correctly
2. **Template System** - Applying and managing templates
3. **Color Management** - Palette selection with accessibility checks
4. **Typography** - Font loading and typography settings
5. **Performance** - Handling rapid changes and debouncing

## CI/CD Integration

Tests are configured to run in CI/CD pipelines with:
- Automatic retries on failure (2 retries)
- Screenshot capture on failure
- Video recording on failure
- HTML report generation

## Notes

- Tests are designed to be resilient and handle features that may not be fully implemented yet
- Tests include cleanup steps to restore original settings
- Tests log informative messages when features are not found (may not be implemented)
- Tests verify both success and error scenarios

## Future Enhancements

- Add visual regression testing
- Add performance benchmarking
- Add accessibility testing with axe-core
- Add mobile viewport testing
- Add cross-browser compatibility matrix
