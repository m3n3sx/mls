# Dark Mode Integration Tests

**Task 24:** Create integration tests for dark mode feature  
**Requirements:** 7.1-7.7 (Live Preview), 10.1-10.7 (Settings), 4.1-4.5 (Persistence), 12.5-12.7 (Cache)

## Overview

This directory contains comprehensive integration tests for the dark mode feature. These tests verify that all components work together correctly across the entire system.

## Test Files

### 1. Comprehensive Integration Test
**File:** `test-dark-mode-comprehensive-integration.html`  
**Type:** HTML/JavaScript  
**Coverage:**
- Dark mode with live preview (Requirements 7.1-7.7)
- Settings save/load cycle (Requirements 10.1-10.7)
- Preference sync across tabs (Requirements 4.1-4.5)
- AJAX communication (Requirements 2.4, 2.5, 2.7)
- Cache integration (Requirements 12.5-12.7)
- Migration logic (Requirement 10.5)

**How to Run:**
1. Open in browser: `file:///path/to/tests/integration/test-dark-mode-comprehensive-integration.html`
2. Click "Run All Tests" button
3. Review test results and event log

**Test Scenarios:**
- ✓ Preview saves dark mode state
- ✓ Dark mode changes are temporary during preview
- ✓ Preview updates trigger events
- ✓ Preview restores saved mode on exit
- ✓ Mode changes saved outside preview
- ✓ Dark mode included in settings structure
- ✓ Settings save triggers events
- ✓ Settings load restores dark mode
- ✓ Preference saved to localStorage
- ✓ Preference loaded on init
- ✓ Storage event mechanism available
- ✓ AJAX request includes required fields
- ✓ mase:modeChanged event fires
- ✓ Separate cache keys for light and dark
- ✓ Mode toggle invalidates only active cache
- ✓ Settings save invalidates both caches
- ✓ Caches warmed after settings save
- ✓ Light and dark palettes defined
- ✓ Palette associations configured
- ✓ User meta save mechanism available



### 2. AJAX & Settings Integration Test
**File:** `test-dark-mode-ajax-settings-integration.php`  
**Type:** PHP  
**Coverage:**
- AJAX dark mode toggle handler (Requirements 2.4, 2.5, 4.1, 4.2)
- Settings save includes dark mode (Requirements 10.2, 10.3)
- Settings load restores dark mode (Requirement 10.7)
- User meta persistence (Requirements 4.2, 4.7)
- Cache invalidation on toggle (Requirement 12.5)
- Both caches invalidated on save (Requirement 12.6)
- Settings export includes dark mode (Requirement 10.3)
- Settings import restores dark mode (Requirement 10.4)

**How to Run:**
```bash
cd tests/integration
php test-dark-mode-ajax-settings-integration.php
```

**Prerequisites:**
- WordPress environment loaded
- User logged in with admin capabilities
- MASE plugin classes available

**Test Scenarios:**
- ✓ AJAX toggle saves to user meta
- ✓ AJAX toggle updates settings
- ✓ Settings save includes dark_light_toggle
- ✓ Settings load restores current_mode
- ✓ User meta persists across sessions
- ✓ Cache invalidation on mode toggle
- ✓ Both caches cleared on settings save
- ✓ Export includes dark mode settings
- ✓ Import restores dark mode settings

### 3. Live Preview Integration Test
**File:** `test-dark-mode-live-preview-integration.html`  
**Type:** HTML/JavaScript  
**Coverage:**
- Dark mode toggle with live preview active (Requirement 7.1)
- Temporary mode changes during preview (Requirement 7.2)
- Preview saves and restores mode (Requirement 7.3)
- Preview updates immediately (Requirement 7.4)
- Preview triggers events (Requirement 7.5)
- Settings not saved during preview (Requirement 7.6)
- Preview works independently (Requirement 7.7)

**How to Run:**
1. Open in browser
2. Use "Toggle Live Preview" and "Toggle Dark Mode" buttons
3. Click "Run All Tests" to verify behavior
4. Monitor event log for detailed activity



### 4. Cache Management Integration Test
**File:** `test-dark-mode-cache-integration.html`  
**Type:** HTML/JavaScript  
**Coverage:**
- Separate cache keys for light and dark (Requirement 12.5)
- Mode-specific cache invalidation (Requirement 12.5)
- Both caches invalidated on palette change (Requirement 12.6)
- Cache warming on settings save (Requirement 12.7)
- Cache versioning (Requirement 12.7)

**How to Run:**
1. Open in browser
2. Tests run automatically on page load
3. Review cache key structure and invalidation logic

### 5. Migration Integration Test
**File:** `test-dark-mode-migration-integration.php`  
**Type:** PHP  
**Coverage:**
- Migration with light palette (Requirement 10.5)
- Migration with dark palette (Requirement 10.5)
- Migration idempotency (Requirement 10.5)

**How to Run:**
```bash
cd tests/integration
php test-dark-mode-migration-integration.php
```

**Test Scenarios:**
- ✓ Light palette sets mode to 'light'
- ✓ Dark palette sets mode to 'dark'
- ✓ User preference saved to user meta
- ✓ Migration flag prevents duplicate runs
- ✓ Manual changes not overwritten

### 6. Custom Events Integration Test
**File:** `test-dark-mode-custom-events.html`  
**Type:** HTML/JavaScript  
**Coverage:**
- mase:modeChanged event (Requirement 2.7)
- mase:transitionComplete event (Requirement 9.6)
- mase:previewUpdated event (Requirement 7.5)
- Event payload structure
- Event listener registration

### 7. FOUC Prevention Integration Test
**File:** `test-dark-mode-fouc-prevention-integration.html`  
**Type:** HTML/JavaScript  
**Coverage:**
- Inline script execution before page render (Requirement 12.1)
- localStorage check synchronously (Requirement 12.3)
- Body class applied immediately (Requirement 12.2)
- Execution time < 50ms (Requirement 12.4)



## Running All Tests

### Automated Test Runner
```bash
cd tests/integration
./run-dark-mode-integration-tests.sh
```

This script will:
1. Run all PHP integration tests
2. List all HTML tests with instructions
3. Display summary of results

### Manual Testing
For HTML tests, open each file in a browser and:
1. Click "Run All Tests" or "Run Tests" button
2. Review test results (green = pass, red = fail)
3. Check event log for detailed activity
4. Use manual controls to verify interactive behavior

## Test Coverage Summary

### Requirements Coverage

**Live Preview Integration (7.1-7.7):**
- ✓ 7.1: Preview updates immediately
- ✓ 7.2: Temporary mode changes during preview
- ✓ 7.3: Preview saves and restores mode
- ✓ 7.4: Preview uses same CSS generation
- ✓ 7.5: Preview triggers events
- ✓ 7.6: Settings not saved during preview
- ✓ 7.7: Preview works independently

**Settings Integration (10.1-10.7):**
- ✓ 10.1: Settings structure includes dark_light_toggle
- ✓ 10.2: Dark mode preference in settings
- ✓ 10.3: Export includes dark mode
- ✓ 10.4: Import restores dark mode
- ✓ 10.5: Migration logic for existing users
- ✓ 10.6: Settings validation
- ✓ 10.7: Settings page displays current state

**Persistence (4.1-4.5):**
- ✓ 4.1: localStorage for immediate persistence
- ✓ 4.2: WordPress user meta for cross-device
- ✓ 4.3: localStorage checked first
- ✓ 4.4: User meta fallback
- ✓ 4.5: OS preference fallback

**Cache Management (12.5-12.7):**
- ✓ 12.5: Separate cache keys
- ✓ 12.6: Both caches invalidated on palette change
- ✓ 12.7: Cache warming on settings save

**AJAX Communication (2.4, 2.5, 2.7):**
- ✓ 2.4: AJAX save to user meta
- ✓ 2.5: localStorage save
- ✓ 2.7: Custom events triggered



## Test Scenarios by Category

### 1. Live Preview Integration
- Preview saves current dark mode before entering
- Dark mode changes are visual only during preview
- localStorage not updated during preview
- Preview triggers mase:previewUpdated event
- Exiting preview restores saved mode
- Mode changes outside preview are saved normally

### 2. Settings Persistence
- Dark mode preference included in settings structure
- Settings save includes current_mode
- Settings load restores dark mode
- Export includes dark_light_toggle section
- Import restores dark mode settings
- Settings validation sanitizes mode value

### 3. Cross-Tab Synchronization
- Preference saved to localStorage immediately
- localStorage checked on page load
- Storage events can sync across tabs
- User meta provides cross-device sync
- Fallback chain: localStorage → User Meta → OS Preference

### 4. AJAX Communication
- AJAX request includes action, nonce, mode
- Nonce verification prevents CSRF
- Capability check ensures authorization
- User meta updated on successful save
- Settings array updated with current mode
- Cache invalidated after mode change
- Success/error responses handled correctly

### 5. Cache Management
- Light mode cache: mase_generated_css_light_v1.3.0
- Dark mode cache: mase_generated_css_dark_v1.3.0
- Mode toggle invalidates only active cache
- Settings save invalidates both caches
- Cache warming pre-generates both modes
- Versioned keys prevent stale cache issues

### 6. Migration
- Detects current palette luminance
- Sets initial mode based on palette type
- Saves preference to user meta
- Marks migration as complete
- Runs only once per user
- Doesn't overwrite manual changes



## Expected Test Results

### All Tests Passing
When all integration tests pass, you should see:
- ✓ 21+ test scenarios passed in comprehensive test
- ✓ 8 PHP tests passed in AJAX/settings test
- ✓ 3 PHP tests passed in migration test
- ✓ All event logs show correct sequence
- ✓ No console errors in browser tests
- ✓ Cache status updates correctly
- ✓ localStorage values match expected modes

### Common Issues

**Issue:** localStorage not available
- **Cause:** Private browsing mode or storage quota exceeded
- **Expected:** Tests should fall back to user meta only
- **Verify:** Check console for "localStorage unavailable" warning

**Issue:** AJAX tests fail with "No user logged in"
- **Cause:** WordPress environment not loaded or no active session
- **Solution:** Run tests in WordPress admin context or mock user session

**Issue:** Cache tests show "Unknown" status
- **Cause:** Cache not initialized
- **Solution:** Verify MASE_CacheManager is loaded and initialized

**Issue:** Preview tests fail
- **Cause:** Live preview module not initialized
- **Solution:** Ensure MASE.livePreview object exists before running tests

## Debugging Integration Tests

### Enable Verbose Logging
In browser console:
```javascript
// Enable detailed event logging
MASE.config.debug = true;

// Monitor all custom events
$(document).on('mase:modeChanged mase:previewUpdated mase:settingsSaved', function(e, data) {
    console.log('Event:', e.type, 'Data:', data);
});
```

### Check localStorage
```javascript
// View current dark mode preference
localStorage.getItem('mase_dark_mode');

// Clear for fresh test
localStorage.removeItem('mase_dark_mode');
```

### Verify Cache State
```javascript
// Check cache status
console.log('Light cache:', MASE.cache.lightMode);
console.log('Dark cache:', MASE.cache.darkMode);
```

### Monitor AJAX Requests
In browser DevTools:
1. Open Network tab
2. Filter by "XHR"
3. Look for "admin-ajax.php" requests
4. Check request payload and response



## Integration Test Checklist

Before marking Task 24 as complete, verify:

- [ ] All HTML tests open without errors
- [ ] Comprehensive integration test passes all 21+ scenarios
- [ ] AJAX/settings PHP test passes all 8 tests
- [ ] Migration PHP test passes all 3 tests
- [ ] Live preview integration works correctly
- [ ] Cache management behaves as expected
- [ ] Custom events fire with correct payloads
- [ ] FOUC prevention executes < 50ms
- [ ] No console errors in any browser test
- [ ] localStorage operations work correctly
- [ ] User meta persistence verified
- [ ] Settings save/load cycle complete
- [ ] Export/import includes dark mode
- [ ] Migration runs only once
- [ ] Cross-tab sync mechanism available
- [ ] All requirements 7.1-7.7, 10.1-10.7 covered

## Next Steps

After integration tests pass:
1. Run visual regression tests (Task 25)
2. Run accessibility tests (Task 26)
3. Run browser compatibility tests (Task 27)
4. Update documentation (Task 28)

## Related Documentation

- [Requirements](../../.kiro/specs/global-dark-light-mode-toggle/requirements.md)
- [Design](../../.kiro/specs/global-dark-light-mode-toggle/design.md)
- [Tasks](../../.kiro/specs/global-dark-light-mode-toggle/tasks.md)
- [Unit Tests](../unit/README-dark-mode-backend-tests.md)
- [Cache Management](../CACHE-MANAGEMENT-VERIFICATION.md)

## Maintenance

These integration tests should be run:
- After any changes to dark mode functionality
- Before releasing new versions
- When modifying live preview system
- When updating settings structure
- When changing cache management
- As part of CI/CD pipeline

## Support

For issues with integration tests:
1. Check console for JavaScript errors
2. Verify WordPress environment is loaded (PHP tests)
3. Ensure all dependencies are available
4. Review event log for detailed activity
5. Check browser compatibility (Chrome, Firefox, Safari, Edge)
