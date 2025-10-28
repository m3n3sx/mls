# Implementation Plan

## Overview

This implementation plan breaks down the three advanced customization features into discrete, manageable coding tasks. Each task builds incrementally on previous work and includes specific requirements references.

## Task Structure

- Tasks are organized by feature area
- Each task includes specific file modifications
- Sub-tasks marked with `*` are optional (testing, documentation)
- All tasks reference specific requirements from requirements.md

---

## Feature 1: Content Typography System

- [x] 1. Extend settings storage for typography
- [x] 1.1 Add `content_typography` section to `MASE_Settings::get_defaults()`
  - Create default settings for 6 admin areas (body_text, headings, comments, widgets, meta, tables, notices)
  - Define 13 typography properties per area (font_family, size, line_height, letter_spacing, word_spacing, weight, style, transform, shadow, stroke, ligatures, drop_caps, variant)
  - Add heading hierarchy settings with scale ratios (1.125-1.618)
  - Add Google Fonts configuration (enabled, list, font_display, preload_fonts, font_subset)
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 1.2 Add typography validation to `MASE_Settings::validate()`
  - Validate font size range (8-72px)
  - Validate line height range (0.8-3.0)
  - Validate letter spacing range (-5px to 10px)
  - Validate word spacing range (-5px to 10px)
  - Validate font weight (100-900, multiples of 100)
  - Validate text transform enum (none, uppercase, lowercase, capitalize)
  - Validate Google Fonts list (array of strings)
  - Validate scale ratio (1.125, 1.200, 1.250, 1.333, 1.414, 1.500, 1.618)
  - Return WP_Error with detailed messages on validation failure
  - _Requirements: 1.7, 4.2_

- [x] 2. Implement CSS generation for typography
- [x] 2.1 Add `generate_content_typography_css()` method to `MASE_CSS_Generator`
  - Generate Google Fonts @import statement if enabled
  - Generate body text typography CSS for 6 admin areas
  - Generate heading hierarchy CSS (H1-H6) with scale ratios
  - Apply responsive font scaling using CSS clamp()
  - Use high-specificity selectors to override WordPress defaults
  - Maintain < 100ms generation time using string concatenation
  - _Requirements: 1.1, 1.3, 1.8, 4.3, 5.5_

- [x] 2.2 Call `generate_content_typography_css()` from `generate_css_internal()`
  - Add method call after existing CSS generation
  - Pass full settings array
  - Concatenate returned CSS to main CSS string
  - _Requirements: 4.3_

- [x] 3. Create typography UI tab
- [x] 3.1 Add typography tab HTML to `admin-settings-page.php`
  - Create area selector buttons (body_text, headings, comments, widgets, meta, tables, notices)
  - Add font family selector with system fonts and Google Fonts optgroup
  - Add font size range slider (8-72px) with number input
  - Add line height range slider (0.8-3.0) with number input
  - Add letter spacing range slider (-5px to 10px) with number input
  - Add word spacing range slider (-5px to 10px) with number input
  - Add font weight select (100-900)
  - Add font style select (normal, italic, oblique)
  - Add text transform select (none, uppercase, lowercase, capitalize)
  - Add advanced options collapsible section (text shadow, ligatures, drop caps, font variant)
  - Add heading hierarchy section with scale ratio selector
  - Add Google Fonts settings (enable checkbox, font display select, preload fonts input)
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 3.2 Add typography tab CSS to `assets/css/mase-admin.css`
  - Style area selector buttons
  - Style typography control groups
  - Style range sliders with value display
  - Style advanced options collapsible section
  - Style heading hierarchy controls
  - Ensure responsive layout for mobile devices
  - _Requirements: 6.6_

- [x] 4. Implement typography live preview
- [x] 4.1 Add `initTypographyPreview()` method to `MASE.livePreview` module in `mase-admin.js`
  - Attach event listeners to font family selectors
  - Attach event listeners to typography property inputs (font size, line height, etc.)
  - Attach event listeners to Google Font selectors
  - Use existing debounce mechanism (300ms delay)
  - _Requirements: 1.6, 4.4, 5.4_

- [x] 4.2 Add `updateTypographyPreview()` method to `MASE.livePreview` module
  - Collect current typography values from form
  - Generate preview CSS using `generateTypographyCSS()` helper
  - Inject CSS into page using existing `injectCSS()` method
  - _Requirements: 1.6, 4.4_

- [x] 4.3 Add `loadGoogleFont()` method to `MASE.livePreview` module
  - Create link element for Google Fonts API
  - Set href with font family and weights
  - Add font-display: swap parameter
  - Append to document head
  - Cache loaded fonts to prevent duplicate requests
  - _Requirements: 1.2, 1.5_

- [x] 4.4 Add `generateTypographyCSS()` helper method
  - Build CSS string from current form values
  - Apply to appropriate selectors based on selected area
  - Include Google Fonts @import if needed
  - Return CSS string
  - _Requirements: 1.6_

- [-] 5. Implement Google Fonts integration
- [x] 5.1 Add Google Fonts API helper methods to `MASE_Settings`
  - Add `get_google_fonts_list()` method to fetch available fonts
  - Add `get_google_font_url()` method to generate API URL
  - Add `preload_google_fonts()` method to generate preload links
  - Cache fonts list for 24 hours
  - _Requirements: 1.2, 1.5_

- [x] 5.2 Enqueue Google Fonts in `MASE_Admin::enqueue_assets()`
  - Check if Google Fonts enabled in settings
  - Generate Google Fonts URL from settings
  - Enqueue stylesheet with font-display: swap
  - Add preload links for critical fonts
  - Only load on MASE settings page (conditional loading)
  - _Requirements: 1.2, 1.5, 5.1, 5.7_

- [ ]\* 5.3 Add font subsetting for Polish language
  - Modify Google Fonts URL to include latin-ext subset
  - Test with Polish characters (ą, ć, ę, ł, ń, ó, ś, ź, ż)
  - _Requirements: 5.2_

- [ ]\* 6. Testing and validation
- [ ]\* 6.1 Write unit tests for typography validation
  - Test font size validation (valid: 16, invalid: 5, 80)
  - Test line height validation (valid: 1.5, invalid: 0.5, 4.0)
  - Test font weight validation (valid: 400, invalid: 450, 1000)
  - Test Google Fonts list validation
  - _Requirements: 1.7_

- [ ]\* 6.2 Write integration tests for typography CSS generation
  - Test CSS output for each admin area
  - Test heading hierarchy with different scale ratios
  - Test Google Fonts @import generation
  - Test performance (< 100ms target)
  - _Requirements: 1.8, 5.5_

- [ ]\* 6.3 Write accessibility tests for typography controls
  - Test keyboard navigation
  - Test screen reader announcements
  - Test color contrast for preview text
  - Test focus indicators
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

---

## Feature 2: Dashboard Widgets Customization

- [x] 7. Extend settings storage for widgets
- [x] 7.1 Add `dashboard_widgets` section to `MASE_Settings::get_defaults()`
  - Create container settings (bg_type, bg_color, gradient, border, border_radius, shadow, padding, margin)
  - Create header settings (bg_color, font_size, font_weight, text_color, border_bottom)
  - Create content settings (bg_color, font_size, text_color, link_color, list_style)
  - Create specific widget overrides (dashboard_right_now, dashboard_activity, dashboard_quick_press, dashboard_primary)
  - Create advanced effects settings (glassmorphism, blur_intensity, hover_animation)
  - Create responsive layout settings (mobile_stack, tablet_columns, desktop_columns)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 7.2 Add widget validation to `MASE_Settings::validate()`
  - Validate border width range (0-10px)
  - Validate border radius range (0-50px)
  - Validate header font size range (12-24px)
  - Validate padding range (5-50px)
  - Validate margin range (0-30px)
  - Validate responsive columns (1-4)
  - Validate hover animation enum (none, lift, glow, scale)
  - Return WP_Error with detailed messages on validation failure
  - _Requirements: 2.8, 4.2_

- [x] 8. Implement CSS generation for widgets
- [x] 8.1 Add `generate_dashboard_widgets_css()` method to `MASE_CSS_Generator`
  - Generate container CSS (.postbox selector)
  - Generate header CSS (.postbox .hndle selector)
  - Generate content CSS (.postbox .inside selector)
  - Generate specific widget overrides (#dashboard_right_now, etc.)
  - Generate glassmorphism CSS (backdrop-filter)
  - Generate hover animation CSS (transform, box-shadow)
  - Generate responsive layout CSS (media queries)
  - Use high-specificity selectors to override WordPress defaults
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.3_

- [x] 8.2 Call `generate_dashboard_widgets_css()` from `generate_css_internal()`
  - Add method call after typography CSS generation
  - Pass full settings array
  - Concatenate returned CSS to main CSS string
  - _Requirements: 4.3_

- [x] 9. Create widgets UI tab
- [x] 9.1 Add widgets tab HTML to `admin-settings-page.php`
  - Create widget selector buttons (container, header, content, specific widgets)
  - Add container styling controls (background, border, border radius, shadow, padding, margin)
  - Add header styling controls (background, typography, border bottom)
  - Add content styling controls (background, typography, link colors, list styling)
  - Add advanced effects section (glassmorphism, hover animations)
  - Add responsive layout controls (mobile stack, tablet/desktop columns)
  - Reuse existing gradient builder component for gradients
  - Reuse existing shadow controls for box shadows
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 9.2 Add widgets tab CSS to `assets/css/mase-admin.css`
  - Style widget selector buttons
  - Style widget control groups
  - Style advanced effects collapsible section
  - Style responsive layout controls
  - Ensure responsive layout for mobile devices
  - _Requirements: 6.6_

- [x] 10. Implement widgets live preview
- [x] 10.1 Add `initWidgetPreview()` method to `MASE.livePreview` module in `mase-admin.js`
  - Attach event listeners to widget style controls
  - Use existing debounce mechanism (300ms delay)
  - _Requirements: 2.7, 4.4, 5.4_

- [x] 10.2 Add `updateWidgetPreview()` method to `MASE.livePreview` module
  - Collect current widget values from form
  - Generate preview CSS using `generateWidgetCSS()` helper
  - Inject CSS into page using existing `injectCSS()` method
  - _Requirements: 2.7, 4.4_

- [x] 10.3 Add `generateWidgetCSS()` helper method
  - Build CSS string from current form values
  - Apply to appropriate widget selectors
  - Include glassmorphism and hover animation CSS
  - Include responsive layout CSS
  - Return CSS string
  - _Requirements: 2.7_

- [ ]\* 11. Testing and validation
- [ ]\* 11.1 Write unit tests for widget validation
  - Test border width validation (valid: 5, invalid: 15)
  - Test border radius validation (valid: 10, invalid: 60)
  - Test header font size validation (valid: 16, invalid: 10, 30)
  - Test responsive columns validation (valid: 3, invalid: 5)
  - _Requirements: 2.8_

- [ ]\* 11.2 Write integration tests for widget CSS generation
  - Test CSS output for each widget type
  - Test glassmorphism effect CSS
  - Test hover animation CSS
  - Test responsive layout CSS
  - Test performance (< 100ms target)
  - _Requirements: 2.1, 2.2, 2.3, 5.5_

- [ ]\* 11.3 Write browser compatibility tests for widgets
  - Test glassmorphism in browsers with backdrop-filter support
  - Test fallback for browsers without backdrop-filter
  - Test responsive layouts across devices
  - Test hover animations
  - _Requirements: 2.5, 2.6_

---

## Feature 3: Advanced Input Fields & Forms System

- [x] 12. Extend settings storage for form controls
- [x] 12.1 Add `form_controls` section to `MASE_Settings::get_defaults()`
  - Create text_inputs settings (bg_color, text_color, placeholder_color, border, border_radius, padding, height, font properties)
  - Create textareas settings (extends text_inputs with min_height, resize, line_height)
  - Create selects settings (extends text_inputs with arrow_icon, dropdown colors)
  - Create checkboxes settings (size, bg_color, border_color, check_color, border_radius, animation)
  - Create radios settings (size, bg_color, border_color, dot_color, dot_size, animation)
  - Create file_uploads settings (dropzone colors, progress colors, button style)
  - Create search_fields settings (extends text_inputs with icon_position, clear_button)
  - Add state-specific settings (focus, hover, error, disabled)
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 12.2 Add form control validation to `MASE_Settings::validate()`
  - Validate border width range (0-5px)
  - Validate border radius range (0-25px)
  - Validate font size range (10-18px)
  - Validate checkbox/radio size range (12-24px)
  - Validate padding range (3-25px)
  - Validate height range (20-60px)
  - Validate color values (hex format)
  - Validate animation enum (slide, fade, bounce, none)
  - Return WP_Error with detailed messages on validation failure
  - _Requirements: 3.7, 4.2_

- [x] 13. Implement CSS generation for form controls
- [x] 13.1 Add `generate_form_controls_css()` method to `MASE_CSS_Generator`
  - Generate text input CSS (input[type="text"], input[type="email"], etc.)
  - Generate textarea CSS
  - Generate select dropdown CSS (including custom arrow)
  - Generate checkbox CSS (including custom checkmark)
  - Generate radio button CSS (including custom dot)
  - Generate file upload CSS (dropzone, progress bar)
  - Generate search field CSS (icon, clear button)
  - Generate state-specific CSS (focus, hover, error, disabled)
  - Use high-specificity selectors to override WordPress defaults
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.8, 4.3_

- [x] 13.2 Call `generate_form_controls_css()` from `generate_css_internal()`
  - Add method call after widget CSS generation
  - Pass full settings array
  - Concatenate returned CSS to main CSS string
  - _Requirements: 4.3_

- [x] 14. Create form controls UI tab
- [x] 14.1 Add form controls tab HTML to `admin-settings-page.php`
  - Create control type selector buttons (text_inputs, textareas, selects, checkboxes, radios, file_uploads, search_fields)
  - Add basic styling controls (background colors, text colors, border, border radius, padding)
  - Add typography controls (font family, font size, font weight)
  - Add interactive states section (focus, hover, error, disabled)
  - Add special controls section (checkbox/radio styling, select dropdown styling, file upload styling)
  - Show/hide controls based on selected control type
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 14.2 Add form controls tab CSS to `assets/css/mase-admin.css`
  - Style control type selector buttons
  - Style form control groups
  - Style state-specific controls
  - Style special controls sections
  - Ensure responsive layout for mobile devices
  - _Requirements: 6.6_

- [x] 15. Implement form controls live preview
- [x] 15.1 Add `initFormControlPreview()` method to `MASE.livePreview` module in `mase-admin.js`
  - Attach event listeners to form control style inputs
  - Use existing debounce mechanism (300ms delay)
  - _Requirements: 3.6, 4.4, 5.4_

- [x] 15.2 Add `updateFormControlPreview()` method to `MASE.livePreview` module
  - Collect current form control values from form
  - Generate preview CSS using `generateFormControlCSS()` helper
  - Inject CSS into page using existing `injectCSS()` method
  - _Requirements: 3.6, 4.4_

- [x] 15.3 Add `generateFormControlCSS()` helper method
  - Build CSS string from current form values
  - Apply to appropriate form control selectors
  - Include state-specific CSS (focus, hover, error, disabled)
  - Include special control CSS (checkbox checkmark, select arrow, etc.)
  - Return CSS string
  - _Requirements: 3.6_

- [ ]\* 16. Testing and validation
- [ ]\* 16.1 Write unit tests for form control validation
  - Test border width validation (valid: 2, invalid: 8)
  - Test border radius validation (valid: 10, invalid: 30)
  - Test font size validation (valid: 14, invalid: 8, 20)
  - Test checkbox size validation (valid: 16, invalid: 10, 30)
  - Test color validation (valid: #ffffff, invalid: white)
  - _Requirements: 3.7_

- [ ]\* 16.2 Write integration tests for form control CSS generation
  - Test CSS output for each control type
  - Test state-specific CSS (focus, hover, error, disabled)
  - Test special control CSS (checkbox, radio, select, file upload)
  - Test performance (< 100ms target)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.5_

- [ ]\* 16.3 Write accessibility tests for form controls
  - Test focus indicators visibility
  - Test color contrast for all states
  - Test touch target sizes (min 44px)
  - Test keyboard navigation
  - Test screen reader compatibility
  - _Requirements: 3.5, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

---

## Integration and Final Testing

- [x] 17. Integration testing
- [x] 17.1 Test all three features together
  - Enable all features and verify no conflicts
  - Test settings save with all features enabled
  - Test live preview with all features enabled
  - Test CSS generation performance with all features
  - Verify cache invalidation works correctly
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.7_

- [x] 17.2 Test with existing MASE features
  - Test with palettes applied
  - Test with templates applied
  - Test with dark mode enabled
  - Test with existing visual effects
  - Test with existing button styling
  - Test with existing background system
  - _Requirements: 4.1, 4.6_

- [x] 17.3 Test settings export/import
  - Export settings with all features configured
  - Import settings and verify all features preserved
  - Test with partial settings (only some features configured)
  - _Requirements: 4.6_

- [ ]\* 18. Performance optimization
- [ ]\* 18.1 Optimize CSS generation
  - Profile CSS generation time
  - Optimize string concatenation
  - Verify < 100ms target met
  - _Requirements: 5.5_

- [ ]\* 18.2 Optimize live preview
  - Profile preview update time
  - Optimize CSS injection
  - Verify debounce working correctly
  - Verify < 50ms update time
  - _Requirements: 5.4_

- [ ]\* 18.3 Optimize Google Fonts loading
  - Implement lazy loading for typography tab
  - Verify font-display: swap applied
  - Verify preload links working
  - Test font subsetting
  - _Requirements: 1.5, 5.1, 5.2, 5.6_

- [ ]\* 19. Accessibility audit
- [ ]\* 19.1 Run WCAG 2.1 AA compliance tests
  - Test color contrast ratios
  - Test keyboard navigation
  - Test screen reader compatibility
  - Test focus indicators
  - Test touch targets
  - Test reduced motion
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ]\* 19.2 Fix accessibility issues
  - Address any failing tests
  - Add missing ARIA labels
  - Improve focus indicators
  - Enhance screen reader announcements
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ]\* 20. Browser compatibility testing
- [ ]\* 20.1 Test in all major browsers
  - Chrome (latest)
  - Firefox (latest)
  - Safari (latest)
  - Edge (latest)
  - _Requirements: 2.6_

- [ ]\* 20.2 Test responsive layouts
  - Mobile devices (< 768px)
  - Tablet devices (768px - 1024px)
  - Desktop devices (> 1024px)
  - _Requirements: 2.5, 6.6_

- [ ]\* 21. Documentation
- [ ]\* 21.1 Update user documentation
  - Add typography system guide
  - Add widgets customization guide
  - Add form controls guide
  - Add screenshots and examples
  - _Requirements: All_

- [ ]\* 21.2 Update developer documentation
  - Document new settings structure
  - Document new validation methods
  - Document new CSS generation methods
  - Document new live preview handlers
  - _Requirements: 4.1, 4.2, 4.3, 4.4_
