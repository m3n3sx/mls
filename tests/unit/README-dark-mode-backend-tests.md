# Dark Mode Backend Unit Tests

## Overview

Comprehensive PHP unit tests for dark mode backend functionality (Task 22).

## Test File

`tests/unit/test-dark-mode-backend.php`

## Test Coverage

### 1. Settings Structure Validation

✅ **test_dark_light_toggle_settings_structure_exists**
- Verifies `dark_light_toggle` section exists in default settings
- Requirement: 10.1

✅ **test_dark_light_toggle_settings_have_required_fields**
- Verifies all required fields are present:
  - enabled
  - current_mode
  - respect_system_preference
  - light_palette
  - dark_palette
  - transition_duration
  - keyboard_shortcut_enabled
  - fab_position
- Requirement: 10.1

✅ **test_dark_light_toggle_settings_default_values**
- Verifies correct default values for all settings
- Requirement: 10.1

✅ **test_settings_validation_accepts_valid_dark_mode**
- Tests validation accepts valid mode values ('light', 'dark')
- Requirement: 10.6

✅ **test_settings_validation_rejects_invalid_mode**
- Tests validation rejects invalid mode values
- Requirement: 10.6

✅ **test_settings_validation_sanitizes_transition_duration**
- Tests numeric value sanitization
- Requirement: 10.6

### 2. AJAX Handler Security

✅ **test_ajax_handler_is_registered**
- Verifies AJAX handler is registered
- Requirement: 2.1

✅ **test_ajax_handler_requires_valid_nonce**
- Tests nonce verification (security)
- Requirement: 11.1

✅ **test_ajax_handler_requires_admin_capability**
- Tests capability check (manage_options)
- Requirement: 11.1

✅ **test_ajax_handler_validates_mode_input**
- Tests mode input validation against whitelist
- Requirement: 2.1

✅ **test_ajax_handler_accepts_valid_mode**
- Tests valid mode input is accepted
- Requirement: 2.1

### 3. User Meta Save/Retrieve

✅ **test_ajax_handler_saves_to_user_meta**
- Tests preference is saved to WordPress user meta
- Requirement: 4.2

✅ **test_user_meta_preference_can_be_retrieved**
- Tests user meta preference can be loaded
- Requirement: 4.4

✅ **test_user_meta_preference_persists**
- Tests preference persists across sessions
- Requirement: 4.7

✅ **test_ajax_handler_updates_settings_array**
- Tests settings array is updated with current mode
- Requirement: 2.4

### 4. Palette Type Detection

✅ **test_dark_palettes_have_dark_type**
- Tests dark palettes (dark-elegance, midnight-blue, charcoal) have type='dark'
- Requirement: 6.1

✅ **test_light_palettes_have_light_type**
- Tests light palettes have type='light'
- Requirement: 6.1

✅ **test_palette_type_detection_by_luminance**
- Tests palette type detection by luminance calculation
- Requirement: 6.5

### 5. CSS Generation for Dark Mode

✅ **test_css_generator_creates_dark_mode_css**
- Tests CSS generator creates dark mode CSS custom properties
- Requirement: 8.1

✅ **test_dark_mode_css_uses_correct_scope**
- Tests dark mode styles are scoped to .mase-dark-mode class
- Requirement: 8.2

✅ **test_dark_mode_css_includes_admin_bar**
- Tests dark mode CSS includes admin bar styles
- Requirement: 8.3

✅ **test_dark_mode_css_includes_admin_menu**
- Tests dark mode CSS includes admin menu styles
- Requirement: 8.3

✅ **test_css_generation_performance**
- Tests CSS generation completes in < 100ms
- Requirement: 12.2

### 6. Cache Invalidation Logic

✅ **test_ajax_handler_invalidates_cache**
- Tests CSS cache is invalidated after mode change
- Requirement: 2.5

✅ **test_separate_cache_keys_for_modes**
- Tests separate cache keys for light and dark CSS
- Requirement: 12.5

✅ **test_invalidate_only_active_mode_cache**
- Tests only active mode cache is invalidated on toggle
- Requirement: 12.5

✅ **test_invalidate_both_caches_on_palette_change**
- Tests both caches are invalidated on palette change
- Requirement: 12.6

✅ **test_cache_versioning**
- Tests cache versioning implementation
- Requirement: 12.7

### 7. Integration Tests

✅ **test_complete_dark_mode_toggle_workflow**
- End-to-end test of complete toggle workflow
- Tests multiple requirements together

✅ **test_settings_export_includes_dark_mode**
- Tests dark mode settings are included in export
- Requirement: 10.3

✅ **test_settings_import_restores_dark_mode**
- Tests dark mode settings are restored from import
- Requirement: 10.4

## Running the Tests

These tests require WordPress test framework (WP_UnitTestCase).

### Prerequisites

1. WordPress test library installed
2. PHPUnit configured for WordPress
3. Test database configured

### Run Tests

```bash
# Run all unit tests
phpunit tests/unit/test-dark-mode-backend.php

# Run specific test
phpunit --filter test_ajax_handler_requires_valid_nonce tests/unit/test-dark-mode-backend.php
```

## Test Statistics

- **Total Tests**: 32
- **Settings Tests**: 6
- **AJAX Security Tests**: 5
- **User Meta Tests**: 4
- **Palette Detection Tests**: 3
- **CSS Generation Tests**: 5
- **Cache Tests**: 5
- **Integration Tests**: 3

## Requirements Coverage

All backend requirements are covered:

- ✅ Requirement 2.1, 2.4, 2.5 - Mode toggle functionality
- ✅ Requirement 4.2, 4.4, 4.7 - Persistence layer
- ✅ Requirement 6.1, 6.5 - Dark mode palettes
- ✅ Requirement 8.1, 8.2, 8.3 - CSS generation
- ✅ Requirement 10.1, 10.3, 10.4, 10.6 - Settings integration
- ✅ Requirement 11.1 - Error handling and security
- ✅ Requirement 12.2, 12.5, 12.6, 12.7 - Performance and caching

## Notes

- Tests use WordPress's WP_UnitTestCase for proper WordPress environment
- Mock AJAX requests use WPAjaxDie exceptions (WordPress standard)
- Tests clean up after themselves (tearDown method)
- Performance tests verify < 100ms CSS generation requirement
- Security tests verify nonce and capability checks
