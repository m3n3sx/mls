# Requirements Document

## Introduction

This feature adds a dark mode toggle to the MASE settings page header, making dark mode more accessible and prominent. Currently, dark mode exists only as a checkbox in the General tab. This enhancement moves the toggle to the header alongside the Live Preview toggle, making it instantly accessible from any tab and ensuring it affects the entire WordPress admin interface, not just the settings page.

## Glossary

- **MASE**: Modern Admin Styler for WordPress plugin
- **Header Toggle**: A switch control located in the settings page header that remains visible across all tabs
- **Dark Mode**: A color scheme that uses light text on dark backgrounds to reduce eye strain
- **WordPress Admin**: The entire WordPress administrative interface including admin bar, menu, and content areas
- **Live Preview Toggle**: An existing header toggle that enables real-time preview of style changes
- **General Tab**: The first tab in MASE settings where dark mode checkbox currently exists
- **localStorage**: Browser storage mechanism for persisting user preferences across sessions
- **MASEAdmin Object**: The main JavaScript object that manages MASE functionality

## Requirements

### Requirement 1: Header Toggle Visibility

**User Story:** As a WordPress administrator, I want to see the dark mode toggle in the header, so that I can quickly enable or disable dark mode without navigating to the General tab.

#### Acceptance Criteria

1. WHEN THE MASE settings page loads, THE Header SHALL display a dark mode toggle control before the Live Preview toggle
2. THE Dark Mode Toggle SHALL include a moon/appearance icon and "Dark Mode" label text
3. THE Dark Mode Toggle SHALL remain visible when switching between tabs
4. THE Dark Mode Toggle SHALL use the same visual style as the Live Preview toggle
5. THE Dark Mode Toggle SHALL display the current dark mode state (checked or unchecked)

### Requirement 2: Entire Admin Dark Mode Application

**User Story:** As a WordPress administrator, I want dark mode to affect the entire WordPress admin interface, so that I have a consistent dark experience across all admin pages.

#### Acceptance Criteria

1. WHEN THE Dark Mode Toggle is enabled, THE System SHALL apply data-theme="dark" attribute to the HTML element
2. WHEN THE Dark Mode Toggle is enabled, THE System SHALL add mase-dark-mode class to the body element
3. WHEN data-theme="dark" is applied, THE System SHALL style the WordPress admin bar with dark colors
4. WHEN data-theme="dark" is applied, THE System SHALL style the WordPress admin menu with dark colors
5. WHEN data-theme="dark" is applied, THE System SHALL style all content areas, cards, and panels with dark colors

### Requirement 3: Toggle Synchronization

**User Story:** As a WordPress administrator, I want the header toggle and General tab checkbox to stay synchronized, so that both controls always show the same state.

#### Acceptance Criteria

1. WHEN THE Header Dark Mode Toggle is changed, THE System SHALL update the General tab checkbox to match
2. WHEN THE General tab checkbox is changed, THE System SHALL update the Header Dark Mode Toggle to match
3. THE System SHALL update aria-checked attributes on both controls when either changes
4. THE System SHALL maintain synchronization without page reload
5. WHEN THE page loads, THE System SHALL set both controls to the same initial state

### Requirement 4: Preference Persistence

**User Story:** As a WordPress administrator, I want my dark mode preference to persist across sessions, so that I don't have to re-enable it every time I visit the settings page.

#### Acceptance Criteria

1. WHEN THE Dark Mode Toggle is changed, THE System SHALL save the preference to localStorage with key "mase_dark_mode"
2. WHEN THE settings page loads, THE System SHALL read the dark mode preference from localStorage
3. IF localStorage contains "mase_dark_mode" value "true", THEN THE System SHALL enable dark mode automatically
4. IF localStorage contains "mase_dark_mode" value "false", THEN THE System SHALL disable dark mode
5. THE System SHALL apply the saved preference before the page becomes visible to prevent flashing

### Requirement 5: User Feedback

**User Story:** As a WordPress administrator, I want to receive confirmation when I toggle dark mode, so that I know my action was successful.

#### Acceptance Criteria

1. WHEN THE Dark Mode Toggle is enabled, THE System SHALL display a notification message "Dark mode enabled"
2. WHEN THE Dark Mode Toggle is disabled, THE System SHALL display a notification message "Dark mode disabled"
3. THE System SHALL display notifications using the existing showNotice() method
4. THE System SHALL log dark mode state changes to the browser console
5. THE System SHALL log localStorage save operations to the browser console

### Requirement 6: Accessibility Compliance

**User Story:** As a WordPress administrator using assistive technology, I want the dark mode toggle to be fully accessible, so that I can use it with keyboard and screen readers.

#### Acceptance Criteria

1. THE Dark Mode Toggle SHALL include role="switch" attribute
2. THE Dark Mode Toggle SHALL include aria-checked attribute reflecting current state
3. THE Dark Mode Toggle SHALL include aria-label describing its purpose
4. WHEN THE toggle state changes, THE System SHALL update aria-checked to match
5. THE Dark Mode Toggle SHALL be keyboard accessible using Tab and Space/Enter keys

### Requirement 7: CSS Dark Mode Styles

**User Story:** As a WordPress administrator, I want dark mode to look professional and maintain proper contrast, so that the interface remains readable and visually appealing.

#### Acceptance Criteria

1. THE System SHALL define dark mode color variables in CSS under html[data-theme="dark"] selector
2. THE System SHALL apply dark mode styles to WordPress admin wrapper elements (#wpwrap, #wpcontent, #wpbody)
3. THE System SHALL apply dark mode styles to form inputs, textareas, and select elements
4. THE System SHALL maintain WCAG AA contrast ratios for all text in dark mode
5. THE System SHALL ensure smooth visual transitions when toggling dark mode
