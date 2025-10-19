# Implementation Plan

- [x] 1. Implement JavaScript Live Preview System

  - Create complete mase-admin.js with MASEAdmin object structure
  - Implement event binding for all form controls (color pickers, sliders, inputs)
  - Implement live preview engine with CSS generation and injection
  - Implement debounce utility for performance optimization
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 1.1 Create MASEAdmin core object and initialization

  - Write MASEAdmin object with config and state properties
  - Implement init() method to set up all components
  - Implement bindEvents() method to attach event listeners
  - Add console logging for initialization status
  - _Requirements: 1.1, 4.4, 9.1_

- [x] 1.2 Implement live preview toggle functionality

  - Write toggleLivePreview() method to enable/disable preview mode
  - Bind change event to #mase-live-preview-toggle checkbox
  - Update state.livePreviewEnabled when toggled
  - Add console logging for state changes
  - _Requirements: 1.1, 1.5, 9.2_

- [x] 1.3 Implement live preview update engine

  - Write collectFormData() method to gather all form values
  - Write generatePreviewCSS() method to create CSS from form data
  - Write applyPreviewCSS() method to inject CSS into page
  - Implement CSS generation for admin bar colors and dimensions
  - Implement CSS generation for admin menu colors and dimensions
  - _Requirements: 1.2, 1.3, 1.4_

- [x] 1.4 Implement color picker event handling

  - Bind change events to all .mase-color-picker elements
  - Implement 100ms debounce for color picker changes
  - Trigger live preview update on color change
  - _Requirements: 1.3, 7.1_

- [x] 1.5 Implement slider event handling

  - Bind input events to all input[type="range"] elements
  - Update slider value display on input
  - Implement 300ms debounce for slider changes
  - Trigger live preview update on slider change
  - _Requirements: 1.4, 7.1_

- [x] 2. Implement Dark Mode System

  - Add dark mode CSS variables to mase-admin.css
  - Implement toggleDarkMode() JavaScript function
  - Add localStorage persistence for dark mode preference
  - Implement dark mode restoration on page load
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 2.1 Add dark mode CSS variables

  - Define :root[data-theme="dark"] selector in mase-admin.css
  - Add dark mode color variables (primary, background, text, border)
  - Add dark mode styles for all UI components
  - Ensure WCAG AA contrast ratios for dark mode
  - _Requirements: 3.4, 3.5_

- [x] 2.2 Implement dark mode toggle JavaScript

  - Write toggleDarkMode() method in MASEAdmin object
  - Bind change event to #master-dark-mode checkbox
  - Set/remove data-theme="dark" attribute on document root
  - Store preference in localStorage as 'mase_dark_mode'
  - Add console logging for dark mode state changes
  - _Requirements: 3.1, 3.2, 9.2_

- [x] 2.3 Implement dark mode persistence

  - Read 'mase_dark_mode' from localStorage on page load
  - Apply data-theme="dark" attribute if preference is true
  - Update checkbox state to match stored preference
  - _Requirements: 3.2, 3.3_

- [x] 3. Fix HTML Element IDs and Structure

  - Correct live preview toggle ID to mase-live-preview-toggle
  - Verify dark mode toggle ID is master-dark-mode
  - Verify save button ID is mase-save-settings
  - Add proper ARIA attributes for accessibility
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 3.1 Fix live preview toggle ID

  - Locate live preview checkbox in admin-settings-page.php
  - Change id attribute to "mase-live-preview-toggle"
  - Verify JavaScript selector matches new ID
  - Add aria-pressed and aria-label attributes
  - _Requirements: 4.1, 4.4_

- [x] 3.2 Verify and fix other element IDs

  - Verify dark mode checkbox has id="master-dark-mode"
  - Verify save button has id="mase-save-settings"
  - Add data-tab attributes to tab buttons
  - Add data-tab-content attributes to tab panels
  - _Requirements: 4.2, 4.3_

- [x] 3.3 Add ARIA attributes for accessibility

  - Add role="switch" to toggle checkboxes
  - Add aria-checked attributes to toggles
  - Add aria-describedby for help text associations
  - Add aria-label to buttons without visible text
  - _Requirements: 4.5_

- [x] 4. Implement Card-Based Layout System

  - Replace table-based layout with card containers
  - Create .mase-section-card structure for each settings section
  - Implement .mase-setting-row grid layout
  - Add responsive breakpoints for mobile devices
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4.1 Create card layout CSS

  - Add .mase-section-card styles to mase-admin.css
  - Add .mase-settings-group styles
  - Add .mase-setting-row grid layout styles
  - Add .mase-setting-label and .mase-setting-control styles
  - Implement 20px spacing between cards
  - _Requirements: 2.3, 2.4_

- [x] 4.2 Convert General tab to card layout

  - Replace table elements with div.mase-section-card
  - Wrap each setting in div.mase-setting-row
  - Move labels to div.mase-setting-label
  - Move controls to div.mase-setting-control
  - Preserve all existing form field names and IDs
  - _Requirements: 2.1, 2.2_

- [x] 4.3 Convert Admin Bar tab to card layout

  - Replace table elements with card structure
  - Group related settings in separate cards
  - Maintain proper label-control associations
  - _Requirements: 2.1, 2.2_

- [x] 4.4 Convert Menu tab to card layout

  - Replace table elements with card structure
  - Group related settings in separate cards
  - Maintain proper label-control associations
  - _Requirements: 2.1, 2.2_

- [x] 4.5 Add responsive styles for card layout

  - Add mobile breakpoint styles (max-width: 768px)
  - Stack label and control vertically on mobile
  - Adjust card padding for smaller screens
  - _Requirements: 2.5_

- [x] 5. Implement AJAX Settings Save

  - Implement saveSettings() JavaScript method
  - Add loading state to save button
  - Implement success/error notification display
  - Verify PHP AJAX handler exists and works
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5.1 Implement saveSettings() method

  - Write saveSettings() method in MASEAdmin object
  - Bind click event to #mase-save-settings button
  - Collect all form data using collectFormData()
  - Serialize form data for AJAX transmission
  - _Requirements: 5.1, 5.5_

- [x] 5.2 Implement AJAX request for save

  - Create $.ajax() call to admin-ajax.php
  - Include action: 'mase_save_settings' in data
  - Include nonce from maseAdmin.nonce in data
  - Include serialized settings in data
  - _Requirements: 5.1, 5.5_

- [x] 5.3 Implement save button loading state

  - Disable save button when clicked
  - Change button text to "Saving..."
  - Re-enable button on success or error
  - Restore original button text
  - _Requirements: 5.2, 7.2_

- [x] 5.4 Implement notification system

  - Write showNotice() method to display messages
  - Create notice HTML with appropriate classes
  - Insert notice into page with fade-in animation
  - Auto-dismiss notice after 3 seconds
  - _Requirements: 5.3, 5.4, 7.3_

- [x] 5.5 Verify PHP AJAX handler

  - Check that handle_ajax_save_settings() exists in class-mase-admin.php
  - Verify nonce verification is implemented
  - Verify capability check is implemented
  - Verify settings validation and sanitization
  - Verify cache invalidation on successful save
  - _Requirements: 5.5_

- [x] 6. Implement Tab Navigation System

  - Implement switchTab() JavaScript method
  - Add active state management for tabs
  - Implement localStorage persistence for active tab
  - Add keyboard navigation support
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 6.1 Implement switchTab() method

  - Write switchTab() method in MASEAdmin object
  - Bind click events to all .mase-tab buttons
  - Remove active class from all tabs and content
  - Add active class to clicked tab and corresponding content
  - _Requirements: 8.1, 8.4_

- [x] 6.2 Implement tab persistence

  - Store active tab ID in localStorage as 'mase_active_tab'
  - Write loadSavedTab() method to restore active tab
  - Call loadSavedTab() in init() method
  - _Requirements: 8.2, 8.3_

- [x] 6.3 Add keyboard navigation for tabs

  - Implement arrow key navigation between tabs
  - Implement Home/End key navigation
  - Update aria-selected attributes on tab change
  - Manage tabindex for proper focus order
  - _Requirements: 8.5_

- [x] 7. Verify Script Enqueuing

  - Verify mase-admin.js is enqueued correctly
  - Verify dependencies (jQuery, wp-color-picker) are loaded
  - Verify script localization with nonce and AJAX URL
  - Verify script loads only on settings page
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7.1 Check script enqueue in class-mase-admin.php

  - Verify wp_enqueue_script() call exists in enqueue_assets()
  - Verify script handle is 'mase-admin'
  - Verify dependencies array includes 'jquery' and 'wp-color-picker'
  - Verify version parameter uses MASE_VERSION constant
  - Verify in_footer parameter is true
  - _Requirements: 6.1, 6.4_

- [x] 7.2 Check script localization

  - Verify wp_localize_script() call exists
  - Verify object name is 'maseAdmin'
  - Verify ajaxUrl is set to admin_url('admin-ajax.php')
  - Verify nonce is generated with wp_create_nonce('mase_save_settings')
  - _Requirements: 6.5_

- [x] 7.3 Verify conditional loading

  - Check that enqueue_assets() has $hook parameter check
  - Verify script only loads on 'toplevel_page_mase-settings' hook
  - _Requirements: 6.2_

- [x] 8. Add Console Logging for Debugging

  - Add initialization logging
  - Add state change logging
  - Add AJAX request/response logging
  - Add error logging with stack traces
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 8.1 Add initialization logging

  - Log "MASE Admin initializing..." at start of init()
  - Log successful initialization of each component
  - Log any initialization errors
  - _Requirements: 9.1, 4.4_

- [x] 8.2 Add state change logging

  - Log live preview state changes (enabled/disabled)
  - Log dark mode state changes
  - Log active tab changes
  - _Requirements: 9.2_

- [x] 8.3 Add AJAX logging

  - Log AJAX request data before sending
  - Log AJAX response data on success
  - Log AJAX errors with status codes
  - _Requirements: 9.3_

- [x] 8.4 Add user interaction logging

  - Log palette card clicks
  - Log template card clicks
  - Log form control changes (when live preview is active)
  - _Requirements: 9.4_

- [x] 8.5 Add error logging

  - Wrap all operations in try-catch blocks
  - Log error messages and stack traces
  - Display user-friendly error messages
  - _Requirements: 9.5_

- [x] 9. Integration Testing and Validation

  - Test live preview with all form controls
  - Test dark mode toggle and persistence
  - Test settings save and reload
  - Test tab navigation and persistence
  - Test cross-browser compatibility
  - _Requirements: All_

- [x] 9.1 Test live preview functionality

  - Enable live preview toggle
  - Change admin bar background color
  - Verify color updates in real-time
  - Change admin bar height slider
  - Verify height updates in real-time
  - Disable live preview and verify updates stop
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 9.2 Test dark mode functionality

  - Enable dark mode toggle
  - Verify data-theme="dark" attribute is set
  - Verify dark colors are applied
  - Reload page and verify dark mode persists
  - Disable dark mode and verify light theme returns
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 9.3 Test settings save functionality

  - Modify multiple settings across different tabs
  - Click save button
  - Verify "Saving..." state appears
  - Verify success notification appears
  - Reload page and verify settings persist
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 9.4 Test tab navigation

  - Click each tab and verify content switches
  - Verify active states update correctly
  - Reload page and verify last active tab is restored
  - Test keyboard navigation with arrow keys
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 9.5 Test card layout responsiveness

  - View settings page on desktop (1920px width)
  - View settings page on tablet (768px width)
  - View settings page on mobile (375px width)
  - Verify cards stack properly on mobile
  - Verify all controls remain accessible
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 9.6 Test cross-browser compatibility

  - Test in Chrome/Edge (latest version)
  - Test in Firefox (latest version)
  - Test in Safari (latest version)
  - Verify localStorage works in all browsers
  - Verify CSS custom properties work in all browsers
  - _Requirements: All_

- [x] 9.7 Test error handling

  - Simulate network error during save
  - Verify error notification appears
  - Simulate invalid nonce
  - Verify 403 error is handled gracefully
  - Check browser console for any JavaScript errors
  - _Requirements: 5.4, 9.5_

- [x] 10. Enable Live Preview by Default

  - Update HTML to include checked attribute on live preview toggle
  - Update JavaScript initialization to enable live preview by default
  - Ensure proper ARIA attributes are set
  - Add console logging for default state
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 10.1 Update HTML checkbox to be checked by default

  - Locate live preview toggle in admin-settings-page.php (around line 35)
  - Add `checked` attribute to the input element
  - Change `aria-checked="false"` to `aria-checked="true"`
  - Verify role="switch" attribute is present
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 10.2 Update JavaScript initialization

  - Modify init() method in mase-admin.js
  - Set config.livePreviewEnabled = true by default
  - Ensure checkbox is checked programmatically using jQuery
  - Update aria-checked attribute to "true"
  - Add console log: "MASE: Live Preview enabled by default"
  - _Requirements: 10.1, 10.4, 10.5_

- [x] 10.3 Test default live preview functionality

  - Load settings page and verify checkbox is checked
  - Verify console shows "Live Preview enabled by default" message
  - Change a color picker value without clicking the toggle
  - Verify live preview updates are applied immediately
  - Uncheck the toggle and verify live preview stops
  - Reload page and verify live preview is enabled again by default
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
