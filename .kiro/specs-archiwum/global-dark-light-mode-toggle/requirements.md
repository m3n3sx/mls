# Requirements Document

## Introduction

This feature introduces a global dark/light mode toggle for the Modern Admin Styler (MASE) plugin. The toggle will be accessible from any WordPress admin page via a Floating Action Button (FAB), allowing users to seamlessly switch between light and dark color schemes. The implementation will respect system preferences, persist user choices, and integrate with the existing MASE architecture including the live preview system and color palette management.

## Requirements

### Requirement 1: Floating Action Button (FAB) Component

**User Story:** As a WordPress admin user, I want a persistent floating button in the admin interface, so that I can quickly toggle between light and dark modes from any page.

#### Acceptance Criteria

1. WHEN the WordPress admin loads THEN the system SHALL render a FAB in the bottom-right corner of the viewport
2. WHEN the FAB is rendered THEN it SHALL display a sun icon for light mode OR a moon icon for dark mode
3. WHEN the user hovers over the FAB THEN the system SHALL display a tooltip indicating "Switch to Dark Mode" or "Switch to Light Mode"
4. WHEN the FAB is clicked THEN the system SHALL trigger the mode toggle animation
5. IF the viewport width is less than 768px THEN the FAB SHALL adjust its position to avoid overlapping with mobile UI elements
6. WHEN the FAB is rendered THEN it SHALL have a z-index higher than other admin elements to ensure visibility
7. WHEN the mode changes THEN the FAB icon SHALL animate with a 360-degree rotation over 0.3 seconds

### Requirement 2: Mode Toggle Functionality

**User Story:** As a WordPress admin user, I want the interface to smoothly transition between light and dark modes, so that the change is visually pleasant and not jarring.

#### Acceptance Criteria

1. WHEN the user clicks the FAB THEN the system SHALL toggle between light and dark modes
2. WHEN the mode changes THEN all color variables SHALL transition smoothly over 0.3 seconds
3. WHEN the mode changes THEN the system SHALL update the active color palette to the corresponding light or dark variant
4. WHEN the mode changes THEN the system SHALL save the preference via AJAX to WordPress user meta
5. WHEN the mode changes THEN the system SHALL save the preference to localStorage for immediate persistence
6. WHEN the AJAX save fails THEN the system SHALL display an error notice but maintain the visual mode change
7. WHEN the mode changes THEN the system SHALL trigger a custom event 'mase:modeChanged' with the new mode value

### Requirement 3: System Preference Detection

**User Story:** As a WordPress admin user, I want the interface to automatically match my operating system's dark mode preference, so that the experience is consistent with my system settings.

#### Acceptance Criteria

1. WHEN the user first loads the admin page AND has no saved preference THEN the system SHALL detect the OS preference using 'prefers-color-scheme' media query
2. WHEN the OS preference is 'dark' AND no user preference exists THEN the system SHALL initialize in dark mode
3. WHEN the OS preference is 'light' AND no user preference exists THEN the system SHALL initialize in light mode
4. WHEN the OS preference changes AND the user has not manually set a preference THEN the system SHALL update the mode automatically
5. IF the user has manually set a preference THEN the system SHALL ignore OS preference changes
6. WHEN the system detects OS preference THEN it SHALL log the detection result to the browser console for debugging

### Requirement 4: Persistence Layer

**User Story:** As a WordPress admin user, I want my mode preference to persist across sessions and devices, so that I don't have to reconfigure it every time I log in.

#### Acceptance Criteria

1. WHEN the mode changes THEN the system SHALL save the preference to localStorage with key 'mase_dark_mode'
2. WHEN the mode changes THEN the system SHALL send an AJAX request to save the preference to WordPress user meta with key 'mase_dark_mode_preference'
3. WHEN the admin page loads THEN the system SHALL check localStorage first for the mode preference
4. IF localStorage has no preference THEN the system SHALL check WordPress user meta via localized script data
5. IF neither localStorage nor user meta has a preference THEN the system SHALL use OS preference detection
6. WHEN the AJAX save completes successfully THEN the system SHALL verify the nonce and user capabilities
7. WHEN the user logs in from a different device THEN the system SHALL load their saved preference from user meta

### Requirement 5: Keyboard Accessibility

**User Story:** As a keyboard-only WordPress admin user, I want to toggle dark mode using a keyboard shortcut, so that I can access this feature without using a mouse.

#### Acceptance Criteria

1. WHEN the user presses Ctrl+Shift+D (Windows/Linux) OR Cmd+Shift+D (Mac) THEN the system SHALL toggle the mode
2. WHEN the keyboard shortcut is triggered THEN the system SHALL execute the same logic as clicking the FAB
3. WHEN the keyboard shortcut is triggered THEN the system SHALL provide visual feedback by animating the FAB
4. WHEN the keyboard shortcut is triggered THEN the system SHALL announce the mode change to screen readers
5. IF the user is typing in an input field THEN the keyboard shortcut SHALL NOT trigger
6. WHEN the FAB has focus AND the user presses Enter or Space THEN the system SHALL toggle the mode
7. WHEN the FAB receives focus THEN it SHALL display a visible focus indicator meeting WCAG 2.1 AA standards

### Requirement 6: Dark Mode Color Palettes

**User Story:** As a WordPress admin user, I want dark mode to use appropriate color palettes optimized for low-light viewing, so that the interface is comfortable to use at night.

#### Acceptance Criteria

1. WHEN the system initializes THEN it SHALL define separate color palettes for light and dark modes in class-mase-settings.php
2. WHEN dark mode is active THEN the system SHALL use dark-optimized color values with appropriate contrast ratios
3. WHEN light mode is active THEN the system SHALL use the existing light-optimized color palettes
4. WHEN the mode changes THEN the CSS generator SHALL regenerate the dynamic CSS with the appropriate palette
5. WHEN dark mode is active THEN background colors SHALL be dark (luminance < 0.3) and text colors SHALL be light (luminance > 0.7)
6. WHEN dark mode is active THEN all color combinations SHALL meet WCAG 2.1 AA contrast requirements (4.5:1 for normal text)
7. WHEN a user has a custom palette active THEN the system SHALL generate a dark variant by inverting luminance values

### Requirement 7: Integration with Live Preview System

**User Story:** As a WordPress admin user, I want to preview dark mode changes in real-time, so that I can see how my customizations look before saving.

#### Acceptance Criteria

1. WHEN the live preview is active AND the mode changes THEN the preview SHALL update immediately without page reload
2. WHEN the user toggles dark mode in preview THEN the system SHALL NOT save the preference until explicitly saved
3. WHEN the user exits preview mode THEN the system SHALL restore the previously saved mode preference
4. WHEN the live preview updates THEN it SHALL use the same CSS generation logic as the saved settings
5. WHEN the mode changes in preview THEN the system SHALL trigger the 'mase:previewUpdated' event
6. WHEN the user saves settings with dark mode active THEN the system SHALL persist both the mode and the active palette
7. IF the live preview system is not initialized THEN the mode toggle SHALL still function for saved settings

### Requirement 8: CSS Generation for Dark Mode

**User Story:** As a WordPress admin user, I want dark mode to apply consistently across all admin interface elements, so that the entire experience is cohesive.

#### Acceptance Criteria

1. WHEN dark mode is active THEN the CSS generator SHALL create CSS custom properties for dark mode colors
2. WHEN the CSS is generated THEN it SHALL use a `.mase-dark-mode` class on the body element to scope dark mode styles
3. WHEN dark mode CSS is generated THEN it SHALL include styles for admin bar, admin menu, content area, and typography
4. WHEN the mode changes THEN the system SHALL add or remove the `.mase-dark-mode` class from the body element
5. WHEN dark mode is active THEN the generated CSS SHALL override WordPress default admin styles appropriately
6. WHEN the CSS generator runs THEN it SHALL cache the generated dark mode CSS separately from light mode CSS
7. WHEN the cache is cleared THEN both light and dark mode CSS SHALL be regenerated

### Requirement 9: Animation and Visual Feedback

**User Story:** As a WordPress admin user, I want smooth visual transitions when toggling modes, so that the change feels polished and professional.

#### Acceptance Criteria

1. WHEN the mode changes THEN all color properties SHALL transition with `transition: all 0.3s ease-in-out`
2. WHEN the FAB icon changes THEN it SHALL rotate 360 degrees over 0.3s with `transform: rotate(360deg)`
3. WHEN the mode toggle starts THEN the FAB SHALL be temporarily disabled to prevent rapid clicking
4. WHEN the transition completes THEN the FAB SHALL be re-enabled for further interactions
5. WHEN the mode changes THEN the system SHALL add a `.mase-transitioning` class during the animation
6. WHEN the user has `prefers-reduced-motion` enabled THEN transitions SHALL be instant (0s duration)
7. WHEN the animation completes THEN the system SHALL trigger a 'mase:transitionComplete' event

### Requirement 10: Settings Integration

**User Story:** As a WordPress admin user, I want dark mode settings to be part of the MASE settings structure, so that they can be exported, imported, and reset like other settings.

#### Acceptance Criteria

1. WHEN the settings are initialized THEN the system SHALL include a 'dark_light_toggle' section in get_defaults()
2. WHEN the settings are saved THEN the dark mode preference SHALL be included in the 'mase_settings' option
3. WHEN the user exports settings THEN the dark mode preference SHALL be included in the export file
4. WHEN the user imports settings THEN the dark mode preference SHALL be restored from the import file
5. WHEN the user resets settings to defaults THEN the dark mode preference SHALL be cleared and OS preference SHALL be used
6. WHEN the settings are validated THEN the dark mode value SHALL be sanitized as a boolean
7. WHEN the settings page loads THEN it SHALL display the current dark mode state in the settings UI

### Requirement 11: Error Handling and Fallbacks

**User Story:** As a WordPress admin user, I want the dark mode toggle to work reliably even if some features fail, so that I can always control the interface appearance.

#### Acceptance Criteria

1. WHEN the AJAX save fails THEN the system SHALL log the error to the console and display a user-friendly notice
2. WHEN localStorage is unavailable THEN the system SHALL fall back to user meta only
3. WHEN user meta save fails THEN the system SHALL maintain the visual mode change and retry on next toggle
4. WHEN the CSS generator fails THEN the system SHALL use fallback inline styles for basic dark mode
5. WHEN JavaScript fails to load THEN the FAB SHALL not render but existing saved preferences SHALL still apply via PHP
6. WHEN the browser does not support CSS custom properties THEN the system SHALL use static fallback colors
7. WHEN any error occurs THEN the system SHALL log detailed error information for debugging

### Requirement 12: Performance Optimization

**User Story:** As a WordPress admin user, I want dark mode to toggle instantly without lag, so that the interface remains responsive.

#### Acceptance Criteria

1. WHEN the mode changes THEN the visual update SHALL complete within 50ms (excluding transition time)
2. WHEN the CSS is generated THEN it SHALL be cached using the MASE_Cache class
3. WHEN the page loads THEN the initial mode SHALL be determined synchronously to prevent flash of wrong theme
4. WHEN the FAB is rendered THEN it SHALL use CSS transforms for positioning to enable GPU acceleration
5. WHEN the mode changes THEN the system SHALL debounce rapid toggle attempts to prevent performance issues
6. WHEN the AJAX save is triggered THEN it SHALL not block the UI thread
7. WHEN the dark mode CSS is loaded THEN it SHALL be minified and concatenated with other MASE styles
