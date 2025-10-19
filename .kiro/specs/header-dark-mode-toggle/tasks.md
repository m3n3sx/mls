# Implementation Plan

- [x] 1. Add Dark Mode Toggle to Header HTML

  - Locate the header right section in admin-settings-page.php (around line 52)
  - Add dark mode toggle HTML before the Live Preview toggle
  - Use existing .mase-header-toggle class for visual consistency
  - Include proper accessibility attributes (role, aria-checked, aria-label)
  - Use dashicons-admin-appearance icon for dark mode representation
  - Read initial state from $settings['master']['dark_mode']
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.2, 6.3_

- [x] 2. Implement JavaScript Dark Mode Toggle Handler

  - Add toggleDarkMode() method to MASE object in mase-admin.js
  - Apply/remove data-theme="dark" attribute to HTML element
  - Add/remove mase-dark-mode class to body element
  - Update aria-checked attributes for accessibility
  - Sync header toggle with General tab checkbox
  - Save preference to localStorage
  - Display notification feedback to user
  - Add console logging for debugging
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 5.1, 5.2, 5.4, 5.5, 6.4_

- [x] 2.1 Implement toggleDarkMode() method

  - Write method that accepts change event parameter
  - Read checkbox state from event target
  - Apply data-theme="dark" to html element when enabled
  - Remove data-theme attribute when disabled
  - Add/remove mase-dark-mode class to body
  - Update aria-checked on both header and General tab toggles
  - _Requirements: 2.1, 2.2, 3.1, 6.4_

- [x] 2.2 Implement localStorage persistence

  - Save dark mode state to localStorage with key 'mase_dark_mode'
  - Use try-catch for error handling
  - Log success/failure to console
  - Handle localStorage unavailable gracefully
  - _Requirements: 4.1, 5.5_

- [x] 2.3 Implement user feedback notifications

  - Call showNotice() method with appropriate message
  - Display "Dark mode enabled" when toggled on
  - Display "Dark mode disabled" when toggled off
  - Use 'info' type for notifications
  - _Requirements: 5.1, 5.2, 5.4_

- [x] 3. Register Event Handlers

  - Add event binding in bindEvents() method
  - Bind change event to #mase-dark-mode-toggle
  - Bind change event to #master-dark-mode for synchronization
  - Ensure proper context binding with .bind(this)
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 4. Implement Dark Mode Restoration on Page Load

  - Add code to init() method to restore saved preference
  - Read 'mase_dark_mode' from localStorage
  - Apply dark mode if preference is 'true'
  - Update both toggle controls to match saved state
  - Use try-catch for error handling
  - Log restoration to console
  - _Requirements: 4.2, 4.3, 4.5_

- [x] 5. Verify Dark Mode CSS Styles

  - Check that dark mode CSS variables exist in mase-admin.css
  - Verify :root[data-theme="dark"] selector is defined
  - Verify dark mode styles for WordPress admin elements (#wpwrap, #wpadminbar, #adminmenu)
  - Verify dark mode styles for MASE components (cards, inputs, buttons)
  - Verify WCAG AA contrast ratios for all text in dark mode
  - Add any missing dark mode styles if needed
  - _Requirements: 2.3, 2.4, 2.5, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 6. Create Test File for Dark Mode Toggle

  - Create test HTML file to verify toggle functionality
  - Test header toggle click behavior
  - Test synchronization with General tab checkbox
  - Test localStorage persistence across page reloads
  - Test dark mode application to entire admin interface
  - Test accessibility attributes (aria-checked, role)
  - Test keyboard navigation (Tab, Space)
  - _Requirements: All_

- [x] 7. Test Cross-Browser Compatibility

  - Test in Chrome (latest version)
  - Test in Firefox (latest version)
  - Test in Safari (latest version)
  - Test in Edge (latest version)
  - Verify localStorage works in all browsers
  - Verify CSS custom properties work in all browsers
  - Verify dark mode appearance consistent across browsers
  - _Requirements: All_

- [x] 8. Test Accessibility Compliance

  - Test keyboard navigation to toggle
  - Test Space/Enter key to toggle dark mode
  - Test focus indicator visibility
  - Test screen reader announcements
  - Verify aria-checked updates correctly
  - Verify aria-label provides clear description
  - Test with NVDA/JAWS screen readers
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 9. Test Responsive Behavior

  - Test header layout on desktop (1920px)
  - Test header layout on tablet (768px)
  - Test header layout on mobile (375px)
  - Verify toggle remains accessible on all screen sizes
  - Verify icon and label display correctly
  - Verify spacing consistent with other header controls
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 10. Verify Dark Mode Visual Quality

  - Enable dark mode and inspect all admin areas
  - Verify admin bar colors and contrast
  - Verify admin menu colors and contrast
  - Verify content area colors and contrast
  - Verify form controls visible and usable
  - Verify no visual glitches or color bleeding
  - Verify smooth transition when toggling
  - Test with high contrast mode enabled
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 7.1, 7.2, 7.3, 7.4, 7.5_
