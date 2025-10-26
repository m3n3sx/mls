# Implementation Plan

## Overview

This implementation plan breaks down the Universal Button Styling System into discrete, manageable coding tasks. Each task builds incrementally on previous work, following MASE architectural patterns. The plan focuses on code implementation tasks that can be executed by a coding agent.

## Task List

- [x] 1. Extend Settings Structure with Button Defaults
  - Add `get_button_defaults()` method to MASE_Settings class
  - Define default button state properties for all 6 button types (Primary, Secondary, Danger, Success, Ghost, Tabs)
  - Define default values for all 5 states (normal, hover, active, focus, disabled)
  - Integrate button defaults into `get_defaults()` method
  - _Requirements: 1.1, 1.2, 11.1_

- [x] 2. Implement Button Settings Validation
  - [x] 2.1 Create `validate_buttons()` method in MASE_Settings class
    - Implement validation loop for all button types and states
    - Validate background type (solid/gradient) and colors
    - Validate gradient settings (type, angle, color stops)
    - Validate border properties (width, style, color, radius)
    - Validate padding ranges (horizontal 5-30px, vertical 3-20px)
    - Validate typography (font size 11-18px, weight, transform)
    - Validate shadow settings (mode, preset, custom values)
    - Validate transition duration (0-1000ms) and ripple effect flag
    - _Requirements: 6.1, 6.2, 11.2_

  - [x] 2.2 Implement accessibility contrast checker
    - Create `check_button_contrast()` method for WCAG compliance
    - Implement `calculate_luminance()` helper method
    - Implement `hex_to_rgb()` helper method
    - Enforce minimum 4.5:1 contrast ratio for button text/background
    - Return validation errors for insufficient contrast
    - _Requirements: 8.1, 8.2_

  - [x] 2.3 Integrate button validation into main validate() method
    - Add button validation routing in `validate()` method
    - Handle validation errors with WP_Error
    - Merge validated button settings with other settings
    - _Requirements: 6.1, 11.2_

- [x] 3. Implement CSS Generation for Button Styles
  - [x] 3.1 Create main button styles generation method
    - Add `generate_button_styles()` method to MASE_CSS_Generator class
    - Integrate into `generate_css_internal()` method
    - Implement button type selector mapping
    - Add performance monitoring (<100ms target)
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 3.2 Implement CSS custom properties generation
    - Create `generate_button_css_variables()` method
    - Generate CSS variables for all button types and states
    - Use naming convention: --mase-btn-{type}-{state}-{property}
    - _Requirements: 7.6_

  - [x] 3.3 Implement button type CSS generation
    - Create `generate_button_type_css()` method
    - Generate CSS for normal, hover, active, focus, disabled states
    - Apply correct selectors for each button type
    - Add focus indicators for accessibility (2px outline)
    - Add disabled state styling (cursor, opacity)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3, 7.4, 7.5, 8.3_

  - [x] 3.4 Implement button state properties generation
    - Create `generate_button_state_properties()` method
    - Generate background CSS (solid color or gradient)
    - Generate text color CSS
    - Generate border CSS (width, style, color, radius)
    - Generate padding CSS
    - Generate typography CSS (size, weight, transform)
    - Generate shadow CSS (preset or custom)
    - Generate transition CSS
    - Add ripple effect positioning if enabled
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 4.1, 4.2, 4.3_

  - [x] 3.5 Implement gradient background generation
    - Create `generate_button_gradient_background()` method
    - Support linear gradients with angle
    - Support radial gradients
    - Generate color stops from gradient_colors array
    - _Requirements: 1.1_

  - [x] 3.6 Implement shadow value generation
    - Create `get_button_shadow_value()` method
    - Support preset shadows (none, subtle, medium, strong)
    - Support custom shadows (h_offset, v_offset, blur, spread, color)
    - _Requirements: 4.1, 4.2_

  - [x] 3.7 Implement ripple animation CSS
    - Create `generate_ripple_animation_css()` method
    - Generate @keyframes for ripple effect
    - Generate .mase-ripple-effect class styles
    - Only include if ripple is enabled for any button
    - _Requirements: 4.3_

  - [x] 3.8 Implement mobile responsive button CSS
    - Create `generate_button_mobile_css()` method
    - Add media query for screens < 782px
    - Adjust font sizes for mobile (minimum 14px)
    - Ensure minimum touch target size (44x44px)
    - Adjust padding for better touch interaction
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 3.9 Create button selector helper method
    - Create `get_button_selectors()` method
    - Map button types to WordPress core selectors
    - Include all relevant button classes for each type
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 4. Implement JavaScript Button Styler Module
  - [x] 4.1 Create buttonStyler module structure
    - Add buttonStyler object to MASE namespace in mase-admin.js
    - Implement init() method with event bindings
    - Bind button type tab switching
    - Bind button state tab switching
    - Bind property control changes to live preview
    - Bind reset buttons (per-type and all)
    - _Requirements: 5.1, 5.2, 5.3, 12.1, 12.2_

  - [x] 4.2 Implement tab switching functionality
    - Create `switchButtonType()` method
    - Create `switchButtonState()` method
    - Update active tab classes
    - Show/hide corresponding panels
    - Trigger preview update
    - _Requirements: 1.1, 3.1_

  - [x] 4.3 Implement live preview update
    - Create `updatePreview()` method
    - Collect current property values from form
    - Generate preview CSS
    - Apply CSS to preview buttons
    - Update all state previews
    - Debounce updates (300ms)
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 4.4 Implement property collection
    - Create `collectProperties()` method
    - Read all form field values for active type/state
    - Collect gradient color stops
    - Return properties object
    - _Requirements: 5.1_

  - [x] 4.5 Implement preview CSS generation
    - Create `generatePreviewCSS()` method
    - Generate inline CSS string from properties
    - Handle solid and gradient backgrounds
    - Handle uniform and individual border radius
    - Handle preset and custom shadows
    - _Requirements: 5.1, 5.2_

  - [x] 4.6 Implement gradient CSS helper
    - Create `generateGradientCSS()` method
    - Support linear and radial gradients
    - Build color stops string
    - _Requirements: 1.1_

  - [x] 4.7 Implement shadow value helper
    - Create `getShadowValue()` method
    - Map preset names to shadow values
    - Build custom shadow string
    - _Requirements: 4.1, 4.2_

  - [x] 4.8 Implement ripple effect
    - Create `initRippleEffect()` method
    - Bind click event to preview buttons
    - Calculate ripple position from click coordinates
    - Create and animate ripple element
    - Remove ripple after animation (600ms)
    - _Requirements: 4.3_

  - [x] 4.9 Implement reset functionality
    - Create `resetButtonType()` method for single type reset
    - Create `resetAllButtons()` method for complete reset
    - Add confirmation dialogs
    - Make AJAX request to get defaults
    - Populate form with default values
    - Update preview
    - _Requirements: 12.1, 12.2_

  - [x] 4.10 Implement form population helper
    - Create `populateForm()` method
    - Set all form field values from data object
    - Handle color pickers, sliders, selects
    - Trigger change events for dependent fields
    - _Requirements: 12.1_

- [x] 5. Create Admin Interface HTML
  - [x] 5.1 Create button styling tab in settings page
    - Add "Universal Buttons" tab to MASE settings navigation
    - Create tab content container
    - Add tab activation JavaScript
    - _Requirements: 1.1_

  - [x] 5.2 Create button type selector tabs
    - Add horizontal tab navigation for button types
    - Create tabs for Primary, Secondary, Danger, Success, Ghost, Tabs
    - Add active state styling
    - _Requirements: 1.1_

  - [x] 5.3 Create button state selector tabs
    - Add horizontal tab navigation for button states
    - Create tabs for Normal, Hover, Active, Focus, Disabled
    - Add active state styling
    - _Requirements: 3.1_

  - [x] 5.4 Create background controls section
    - Add background type selector (solid/gradient)
    - Add solid color picker
    - Add gradient type selector (linear/radial)
    - Add gradient angle slider (0-360)
    - Add gradient color stops editor
    - Show/hide controls based on background type
    - _Requirements: 1.1, 1.2_

  - [x] 5.5 Create text color control
    - Add text color picker
    - Show contrast ratio indicator
    - Display warning if contrast insufficient
    - _Requirements: 1.3, 8.1_

  - [x] 5.6 Create border controls section
    - Add border width slider (0-5px)
    - Add border style selector (solid/dashed/dotted/none)
    - Add border color picker
    - Add border radius mode selector (uniform/individual)
    - Add uniform radius slider (0-25px)
    - Add individual corner radius sliders (0-25px each)
    - Show/hide controls based on radius mode
    - _Requirements: 1.4_

  - [x] 5.7 Create padding controls section
    - Add horizontal padding slider (5-30px)
    - Add vertical padding slider (3-20px)
    - Display current values
    - _Requirements: 1.5_

  - [x] 5.8 Create typography controls section
    - Add font size slider (11-18px)
    - Add font weight selector (300/400/500/600/700)
    - Add text transform selector (none/uppercase/lowercase/capitalize)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 5.9 Create effects controls section
    - Add shadow mode selector (preset/custom/none)
    - Add shadow preset selector (none/subtle/medium/strong)
    - Add custom shadow controls (h_offset, v_offset, blur, spread, color)
    - Add transition duration slider (0-1000ms)
    - Add ripple effect checkbox
    - Show/hide controls based on shadow mode
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 5.10 Create live preview area
    - Add preview container with sample buttons
    - Create preview buttons for each button type
    - Show all states in preview (normal, hover, active, focus, disabled)
    - Add state labels
    - _Requirements: 5.1, 5.2_

  - [x] 5.11 Create reset buttons
    - Add "Reset This Button Type" button
    - Add "Reset All Buttons" button
    - Position in appropriate location
    - _Requirements: 12.1, 12.2_

- [x] 6. Implement AJAX Endpoints
  - [x] 6.1 Create get button defaults endpoint
    - Add `ajax_get_button_defaults()` method to MASE_Admin class
    - Verify nonce and capabilities
    - Get defaults for specified button type
    - Return JSON response with defaults
    - _Requirements: 12.1_

  - [x] 6.2 Create reset button type endpoint
    - Add `ajax_reset_button_type()` method to MASE_Admin class
    - Verify nonce and capabilities
    - Reset specified button type to defaults
    - Clear button CSS cache
    - Return JSON success response
    - _Requirements: 12.1_

  - [x] 6.3 Create reset all buttons endpoint
    - Add `ajax_reset_all_buttons()` method to MASE_Admin class
    - Verify nonce and capabilities
    - Reset all button types to defaults
    - Clear all button CSS cache
    - Return JSON success response
    - _Requirements: 12.2_

  - [x] 6.4 Register AJAX actions
    - Register `wp_ajax_mase_get_button_defaults` action
    - Register `wp_ajax_mase_reset_button_type` action
    - Register `wp_ajax_mase_reset_all_buttons` action
    - _Requirements: 12.1, 12.2_

- [x] 7. Implement Cache Management
  - [x] 7.1 Add button CSS cache methods
    - Add `get_cached_button_css()` method to MASE_Cache class
    - Add `set_cached_button_css()` method to MASE_Cache class
    - Add `clear_button_css_cache()` method to MASE_Cache class
    - Use separate cache keys for button CSS
    - _Requirements: 7.6_

  - [x] 7.2 Integrate cache clearing on settings save
    - Clear button CSS cache when button settings are saved
    - Clear button CSS cache when buttons are reset
    - _Requirements: 6.3_

- [x] 8. Add Plugin Compatibility Exclusions
  - [x] 8.1 Create button selector exclusion system
    - Add `excluded_button_selectors` setting field
    - Allow users to specify selectors to exclude from styling
    - Implement exclusion logic in CSS generation
    - _Requirements: 10.1, 10.2_

  - [x] 8.2 Add exclusion UI
    - Create textarea for excluded selectors
    - Add help text with examples
    - Add validation for selector format
    - _Requirements: 10.3_

- [x] 9. Implement Migration for Existing Installations
  - [x] 9.1 Create migration method
    - Add `migrate_to_button_system()` method to MASE_Migration class
    - Check current plugin version
    - Add button defaults if not present
    - Update plugin version
    - _Requirements: 11.1_

  - [x] 9.2 Hook migration into plugin activation
    - Run migration on plugin update
    - Log migration results
    - _Requirements: 11.1_

- [x] 10. Add Localization Support
  - [x] 10.1 Add translatable strings
    - Wrap all user-facing strings in translation functions
    - Add text domain to all strings
    - _Requirements: 1.1_

  - [x] 10.2 Update POT file
    - Generate updated .pot file with new strings
    - Include button-related strings
    - _Requirements: 1.1_

- [ ]\* 11. Write Documentation
  - Create user guide for button styling system
  - Document button type descriptions
  - Document property controls
  - Add screenshots of interface
  - Document accessibility features
  - _Requirements: 1.1_

- [ ]\* 12. Write Unit Tests
  - [ ]\* 12.1 Test button validation methods
    - Test `validate_buttons()` with valid inputs
    - Test `validate_buttons()` with invalid inputs
    - Test contrast ratio calculations
    - Test gradient color validation
    - _Requirements: 6.1, 8.1_

  - [ ]\* 12.2 Test CSS generation methods
    - Test `generate_button_styles()` output
    - Test `generate_button_type_css()` for each type
    - Test `generate_button_state_properties()` for each state
    - Test gradient CSS generation
    - Test shadow CSS generation
    - Test mobile responsive CSS
    - _Requirements: 7.1, 7.2, 7.3, 9.1_

  - [ ]\* 12.3 Test JavaScript button styler
    - Test property collection
    - Test CSS generation
    - Test live preview updates
    - Test ripple effect
    - Test reset functionality
    - _Requirements: 5.1, 5.2, 5.3, 12.1, 12.2_

- [ ]\* 13. Write Integration Tests
  - [ ]\* 13.1 Test complete settings save/load flow
    - Test saving button settings
    - Test loading button settings
    - Test defaults merging
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]\* 13.2 Test live preview functionality
    - Test real-time updates
    - Test state switching
    - Test type switching
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]\* 13.3 Test AJAX endpoints
    - Test get defaults endpoint
    - Test reset button type endpoint
    - Test reset all buttons endpoint
    - _Requirements: 12.1, 12.2_

- [ ]\* 14. Write Accessibility Tests
  - [ ]\* 14.1 Test contrast ratios
    - Test WCAG AA compliance
    - Test contrast calculation accuracy
    - _Requirements: 8.1, 8.2_

  - [ ]\* 14.2 Test keyboard navigation
    - Test focus indicators
    - Test keyboard accessibility
    - _Requirements: 8.3, 8.4_

  - [ ]\* 14.3 Test screen reader compatibility
    - Test ARIA labels
    - Test button state announcements
    - _Requirements: 8.5_

- [ ]\* 15. Write Browser Compatibility Tests
  - [ ]\* 15.1 Test cross-browser CSS rendering
    - Test in Chrome, Firefox, Safari, Edge
    - Test gradient rendering
    - Test shadow rendering
    - Test transitions
    - _Requirements: 10.1_

  - [ ]\* 15.2 Test mobile responsive behavior
    - Test touch targets
    - Test mobile font sizes
    - Test mobile padding
    - _Requirements: 9.1, 9.2, 9.3_

## Notes

- Tasks marked with \* are optional and focus on testing/documentation
- Core implementation tasks (1-10) must be completed for MVP
- Each task should be completed and tested before moving to the next
- Follow MASE architectural patterns throughout implementation
- Maintain backward compatibility with existing MASE installations
- Ensure all code follows WordPress coding standards
- Test accessibility compliance at each stage
