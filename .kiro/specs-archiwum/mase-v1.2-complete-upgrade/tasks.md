# Implementation Plan

- [x] 1. Extend MASE_Settings class with new schema and methods

  - Add new settings categories to get_defaults() method (palettes, templates, typography, visual_effects, effects, advanced, mobile, accessibility, keyboard_shortcuts)
  - Implement palette management methods (get_palette, get_all_palettes, apply_palette, save_custom_palette, delete_custom_palette)
  - Implement template management methods (get_template, get_all_templates, apply_template, save_custom_template, delete_custom_template)
  - Add auto_switch_palette() method with time-based logic
  - Extend validate() method to handle new field types (color arrays, nested objects, enums)
  - Extend sanitization in update_option() for new fields
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 2. Create palette and template data definitions

  - Define 10 built-in color palettes with IDs, names, and color values
  - Define 11 built-in templates with IDs, names, descriptions, and complete settings
  - Create helper method to get palette colors by ID
  - Create helper method to get template settings by ID
  - Add validation for palette and template IDs
  - _Requirements: 1.1, 2.1, 2.2_

- [x] 3. Extend MASE_CSS_Generator with visual effects support

  - Add generate_palette_css() method to create CSS variables from palette
  - Add generate_typography_css() method for extended typography settings
  - Add generate_glassmorphism_css() method for backdrop-filter effects
  - Add generate_floating_elements_css() method for margin-based floating
  - Add generate_shadows_css() method for shadow presets and custom shadows
  - Add generate_animations_css() method for page and element animations
  - Add generate_mobile_css() method with responsive media queries
  - Add generate_custom_css() method to append user custom CSS
  - Update main generate() method to call all new generators conditionally
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 4. Create MASE_Migration class for version upgrades

  - Implement maybe_migrate() static method to check version and trigger migration
  - Implement migrate() method to execute migration workflow
  - Implement transform_settings() method to map v1.1.0 settings to v1.2.0 structure
  - Implement backup_old_settings() method to store v1.1.0 settings before migration
  - Add version detection logic using get_option('mase_version')
  - Add version update logic using update_option('mase_version', '1.2.0')
  - Register migration on admin_init hook
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 5. Create MASE_Mobile_Optimizer class for device detection

  - Implement is_mobile() method using user agent detection
  - Implement is_low_power_device() method using device capabilities
  - Implement get_optimized_settings() method to reduce effects on mobile
  - Implement should_reduce_effects() method with device checks
  - Implement get_device_capabilities() method returning device info
  - Add mobile detection to settings save workflow
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 6. Add new AJAX endpoints to MASE_Admin class

  - Add ajax_apply_palette() method with nonce verification and capability check
  - Add ajax_save_custom_palette() method with validation
  - Add ajax_delete_custom_palette() method with confirmation
  - Add ajax_apply_template() method with settings merge logic
  - Add ajax_save_custom_template() method with snapshot creation
  - Add ajax_delete_custom_template() method with confirmation
  - Add ajax_import_settings() method with JSON validation
  - Add ajax_export_settings() method with JSON generation
  - Add ajax_create_backup() method with timestamp
  - Add ajax_restore_backup() method with backup ID validation
  - Register all new AJAX actions in constructor
  - _Requirements: 1.3, 2.4, 8.1, 8.2, 8.3, 8.4, 8.5, 11.1, 11.2, 11.3, 11.4, 11.5, 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 7. Create admin settings page HTML template

  - Create admin-settings-page.php with 8-tab structure (General, Admin Bar, Menu, Content, Typography, Effects, Templates, Advanced)
  - Implement header section with plugin title, version badge, and action buttons
  - Implement tab navigation with icons and labels
  - Create General tab with palette grid (10 palettes), template preview (3 templates), and master controls
  - Create Admin Bar tab with color, typography, and visual effects controls
  - Create Menu tab with color, typography, and visual effects controls
  - Create Content tab with background, spacing, and layout controls
  - Create Typography tab with font family, size, weight, line height controls for each area
  - Create Effects tab with animation, hover, and visual effect toggles
  - Create Templates tab with full template gallery (11 templates)
  - Create Advanced tab with custom CSS/JS textareas, auto palette switching, backup controls
  - Add proper WordPress nonce field
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 6.1, 6.2, 6.3, 6.4, 6.5, 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 8. Create CSS files for admin interface styling

  - Create mase-admin.css with base styles, header, tabs, content area, form controls
  - Create mase-palettes.css with palette card styles, grid layout, hover states
  - Create mase-templates.css with template card styles, gallery layout, thumbnail display
  - Implement responsive breakpoints (mobile <768px, tablet 768-1024px, desktop >1024px)
  - Add accessibility styles (focus indicators, high contrast support)
  - Add RTL support with [dir="rtl"] selectors
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 13.1, 13.2, 13.3, 13.4, 13.5, 19.1, 19.2, 19.3, 19.4, 19.5_

- [x] 9. Update asset enqueuing in MASE_Admin

  - Enqueue mase-admin.css with wp-color-picker dependency
  - Enqueue mase-palettes.css with mase-admin dependency
  - Enqueue mase-templates.css with mase-admin dependency
  - Enqueue mase-admin.js with jquery and wp-color-picker dependencies
  - Localize script with ajaxUrl, nonce, palettes data, templates data, and translated strings
  - Add conditional loading (only on settings page)
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 10. Create main JavaScript file (mase-admin.js)

  - Set up MASE namespace object with config, state, and modules
  - Implement init() method to initialize all modules
  - Implement bindEvents() method to attach event handlers
  - Initialize WordPress color pickers on .mase-color-picker elements
  - Add debounce utility function for performance
  - Add showNotice() method for user feedback (success, error, info)
  - Add collectFormData() method to gather all form inputs
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 11. Implement palette management in JavaScript

  - Create paletteManager module with apply, save, delete methods
  - Add click handler for palette card "Apply" buttons
  - Implement AJAX call to ajax_apply_palette endpoint
  - Update UI to show active palette badge
  - Add click handler for "Save Custom Palette" button
  - Implement palette name and color collection
  - Add click handler for "Delete Custom Palette" button with confirmation
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 12. Implement template management in JavaScript

  - Create templateManager module with apply, save, delete methods
  - Add click handler for template card "Apply" buttons
  - Implement AJAX call to ajax_apply_template endpoint
  - Update UI to show active template badge
  - Add click handler for "Save Custom Template" button
  - Implement template name and settings snapshot collection
  - Add click handler for "Delete Custom Template" button with confirmation
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 13. Implement live preview functionality in JavaScript

  - Create livePreview module with toggle, bind, update methods
  - Add change handler for "Live Preview" toggle
  - Bind input events (change, input) to all form controls when enabled
  - Implement collectSettings() method to gather current form values
  - Implement generateCSS() method mirroring PHP CSS generation logic
  - Implement applyCSS() method to inject CSS into <style> tag
  - Add debouncing to preview updates (300ms delay)
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 14. Implement settings save functionality in JavaScript

  - Add click handler for "Save Settings" button
  - Implement saveSettings() method with AJAX call
  - Show loading state during save (disable button, show spinner)
  - Handle success response (show success notice, update state)
  - Handle error response (show error notice, enable retry)
  - Handle network errors (show network error notice)
  - Invalidate cache on successful save
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 18.1, 18.2, 18.3, 18.4, 18.5_

- [x] 15. Implement import/export functionality in JavaScript

  - Create importExport module with export and import methods
  - Add click handler for "Export" button to generate JSON file
  - Implement JSON generation from current settings
  - Trigger file download with proper filename (mase-settings-YYYYMMDD.json)
  - Add click handler for "Import" button to open file dialog
  - Implement file reading and JSON parsing
  - Validate imported JSON structure
  - Call ajax_import_settings endpoint with validated data
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 16. Implement keyboard shortcuts in JavaScript

  - Create keyboardShortcuts module with bind and handle methods
  - Add keydown event listener for Ctrl+Shift combinations
  - Implement Ctrl+Shift+1-0 for palette switching (1-10)
  - Implement Ctrl+Shift+T for theme toggle
  - Implement Ctrl+Shift+F for focus mode toggle
  - Implement Ctrl+Shift+P for performance mode toggle
  - Check keyboard_shortcuts.enabled setting before handling
  - Prevent default browser behavior for handled shortcuts
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 17. Implement backup/restore functionality

  - Add click handler for "Create Backup" button
  - Implement AJAX call to ajax_create_backup endpoint
  - Display backup list with timestamps and restore buttons
  - Add click handler for "Restore Backup" buttons with confirmation dialog
  - Implement AJAX call to ajax_restore_backup endpoint
  - Refresh page after successful restore
  - Add automatic backup before template application (if enabled)
  - Add automatic backup before import (if enabled)
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 18. Implement auto palette switching functionality

  - Create cron job registration for hourly palette check
  - Implement cron callback to call MASE_Settings::auto_switch_palette()
  - Implement time-based palette selection logic (morning, afternoon, evening, night)
  - Apply selected palette automatically
  - Log palette switches for debugging
  - Add UI toggle for enabling/disabling auto switching
  - Add UI selectors for time-based palette assignments
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 19. Add accessibility enhancements

  - Add ARIA labels to all form controls
  - Add ARIA live regions for dynamic notices
  - Ensure all interactive elements are keyboard accessible
  - Add visible focus indicators (2px outline, 2px offset)
  - Implement skip navigation link
  - Add screen reader only text for icon buttons
  - Test with keyboard navigation (Tab, Enter, Space, Escape)
  - Test with screen reader (NVDA or JAWS)
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 20. Implement responsive design

  - Add mobile styles (<768px) with single column layout, stacked header, vertical tabs
  - Add tablet styles (768-1024px) with 2-column grid, horizontal tabs
  - Add desktop styles (>1024px) with multi-column grid, sidebar option
  - Ensure touch targets are minimum 44px × 44px on mobile
  - Test on actual mobile devices (iOS, Android)
  - Test on tablets (iPad, Android tablets)
  - Test on various desktop screen sizes
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 19.1, 19.2, 19.3, 19.4, 19.5_

- [x] 21. Update main plugin file

  - Update plugin header version to 1.2.0
  - Update MASE_VERSION constant to 1.2.0
  - Add require_once for class-mase-migration.php
  - Add require_once for class-mase-mobile-optimizer.php
  - Update changelog in plugin header
  - Verify all class files are included
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 22. Create migration test scenarios

  - Create test WordPress installation with MASE v1.1.0
  - Configure v1.1.0 settings (admin bar colors, menu colors, basic settings)
  - Upgrade to v1.2.0 and verify migration executes
  - Verify old settings are backed up to mase_settings_backup_110
  - Verify new settings include all v1.1.0 values plus new defaults
  - Verify version is updated to 1.2.0
  - Test rollback by restoring backup
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 23. Write PHP unit tests

  - Write tests for MASE_Settings::get_palette() with valid and invalid IDs
  - Write tests for MASE_Settings::apply_palette() with palette application
  - Write tests for MASE_Settings::save_custom_palette() with validation
  - Write tests for MASE_CSS_Generator::generate_palette_css() output
  - Write tests for MASE_CSS_Generator::generate_glassmorphism_css() output
  - Write tests for MASE_Migration::transform_settings() with v1.1.0 data
  - Write tests for MASE_Mobile_Optimizer::is_mobile() with various user agents
  - _Requirements: All_

- [x] 24. Write JavaScript unit tests

  - Write tests for MASE.debounce() utility function
  - Write tests for MASE.paletteManager.apply() method
  - Write tests for MASE.livePreview.generateCSS() method
  - Write tests for MASE.importExport.validateJSON() method
  - Write tests for MASE.keyboardShortcuts.handleShortcut() method
  - _Requirements: All_

- [x] 25. Write integration tests

  - Write test for complete palette application workflow (UI → AJAX → Settings → CSS → Cache)
  - Write test for complete template application workflow
  - Write test for import/export round-trip (export → import → verify)
  - Write test for live preview updates (change input → CSS generated → applied)
  - Write test for backup/restore workflow (create → restore → verify)
  - _Requirements: All_

- [x] 26. Perform browser compatibility testing

  - Test in Chrome 90+ on Windows, Mac, Linux
  - Test in Firefox 88+ on Windows, Mac, Linux
  - Test in Safari 14+ on Mac and iOS
  - Test in Edge 90+ on Windows
  - Verify backdrop-filter fallback in Firefox <103
  - Verify all features work without JavaScript errors
  - Test with browser dev tools console open for errors
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [x] 27. Perform accessibility testing

  - Test keyboard navigation through all tabs and controls
  - Test with screen reader (NVDA on Windows or VoiceOver on Mac)
  - Verify color contrast meets WCAG AA standards (4.5:1 for text)
  - Test with high contrast mode enabled
  - Test with reduced motion preference enabled
  - Verify all images have alt text
  - Verify all form controls have labels
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 28. Perform performance testing

  - Measure CSS generation time (should be <100ms)
  - Measure settings save time (should be <500ms)
  - Measure page load time with plugin active (should be <450ms)
  - Measure memory usage (should be <50MB)
  - Measure cache hit rate (should be >80%)
  - Profile JavaScript execution with Chrome DevTools
  - Profile PHP execution with Xdebug
  - Run Lighthouse audit (should score >95/100)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 17.1, 17.2, 17.3, 17.4, 17.5_

- [x] 29. Perform security audit

  - Verify all AJAX endpoints check nonce
  - Verify all AJAX endpoints check user capabilities
  - Verify all inputs are validated
  - Verify all outputs are escaped
  - Verify custom CSS is sanitized with wp_kses_post()
  - Test for SQL injection vulnerabilities
  - Test for XSS vulnerabilities
  - Test for CSRF vulnerabilities
  - _Requirements: 11.1, 11.2, 11.3, 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 30. Create documentation

  - Write user guide with screenshots for each feature
  - Document all 10 color palettes with use cases
  - Document all 11 templates with descriptions
  - Create developer documentation for extending the plugin
  - Document all hooks and filters
  - Create FAQ section
  - Create troubleshooting guide
  - Update README.md with new features
  - _Requirements: All_

- [x] 31. Prepare for release

  - Update version numbers in all files
  - Update changelog with all new features
  - Create release notes
  - Tag version in git (v1.2.0)
  - Create release package (ZIP file)
  - Test installation from ZIP file
  - Test upgrade from v1.1.0 using ZIP file
  - Verify all files are included in package
  - _Requirements: All_

- [x] 32. Final validation
  - Verify all requirements are met
  - Verify all acceptance criteria pass
  - Run complete test suite (unit, integration, E2E)
  - Verify no PHP errors or warnings
  - Verify no JavaScript console errors
  - Verify plugin activates without errors
  - Verify plugin deactivates without errors
  - Verify settings are preserved on deactivation
  - _Requirements: All_
