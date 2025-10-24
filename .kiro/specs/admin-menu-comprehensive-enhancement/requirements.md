# Requirements Document

## Introduction

This document specifies requirements for comprehensive Admin Menu (Left Menu) enhancements in the Modern Admin Styler (MASE) plugin. The feature addresses spacing issues, adds live preview capabilities for all options, fixes submenu positioning, implements Height Mode persistence, adds missing styling options including gradients, submenu customization, advanced typography, and logo placement functionality.

## Glossary

- **Admin Menu**: The vertical navigation menu displayed on the left side of the WordPress admin interface (also called "Left Menu")
- **MASE**: Modern Admin Styler plugin system
- **Live Preview**: Real-time visual updates without page reload when settings change
- **Height Mode**: Setting that controls whether menu items use full height or fit-to-content height
- **Submenu**: Dropdown menus that appear when hovering over Admin Menu items
- **Glassmorphism**: Visual effect combining transparency, blur, and subtle borders
- **Floating Mode**: Menu display mode where the menu has margins and appears to float
- **Google Fonts**: Web fonts provided by Google Fonts API

## Requirements

### Requirement 1: Menu Item Spacing Optimization

**User Story:** As a WordPress administrator, I want menu items to have appropriate padding, so that the menu is not overly stretched and maintains a compact, professional appearance.

#### Acceptance Criteria

1. THE MASE SHALL reduce default menu item padding to create more compact spacing
2. THE MASE SHALL provide padding controls with range 5-30 pixels for vertical padding
3. THE MASE SHALL provide padding controls with range 5-30 pixels for horizontal padding
4. WHEN THE padding changes, THE MASE SHALL update menu item spacing in live preview
5. THE MASE SHALL maintain consistent spacing across all menu items

### Requirement 2: Icon Color Synchronization

**User Story:** As a WordPress administrator, I want menu icons to automatically match the text color, so that the visual design remains consistent.

#### Acceptance Criteria

1. WHEN THE text color setting changes, THE MASE SHALL apply the same color to all menu icons
2. THE MASE SHALL ensure icon color matches text color by default
3. WHERE THE user enables custom icon colors, THE MASE SHALL provide independent icon color controls
4. WHEN THE icon color changes, THE MASE SHALL update icon colors in live preview

### Requirement 3: Dynamic Submenu Positioning

**User Story:** As a WordPress administrator, I want submenus to position correctly based on the current menu width, so that submenus align properly with the menu.

#### Acceptance Criteria

1. WHEN THE menu width changes, THE MASE SHALL recalculate submenu left position to match menu width
2. THE MASE SHALL position submenus at left offset equal to current menu width value
3. WHEN THE menu width is 160 pixels, THE MASE SHALL position submenus at left: 160px
4. WHEN THE menu width is 200 pixels, THE MASE SHALL position submenus at left: 200px
5. WHEN THE width changes, THE MASE SHALL update submenu positioning in live preview

### Requirement 4: Height Mode Persistence

**User Story:** As a WordPress administrator, I want the Height Mode setting to persist after saving and page refresh, so that my preferred height mode is maintained.

#### Acceptance Criteria

1. WHEN THE Height Mode is set to "fit to content" and saved, THE MASE SHALL store the setting in the database
2. WHEN THE page refreshes, THE MASE SHALL load and apply the saved Height Mode setting
3. WHEN THE user navigates to another page and returns, THE MASE SHALL maintain the Height Mode setting
4. THE MASE SHALL display the correct Height Mode value in the settings UI after page load
5. WHEN THE Height Mode changes, THE MASE SHALL update menu item heights in live preview

### Requirement 5: Live Preview for All Options

**User Story:** As a WordPress administrator, I want all menu styling options to update in real-time, so that I can see changes immediately without saving.

#### Acceptance Criteria

1. WHEN THE Height Mode changes, THE MASE SHALL update menu item heights in live preview
2. WHEN THE glassmorphism toggle activates, THE MASE SHALL apply glassmorphism effects in live preview
3. WHEN THE blur intensity changes, THE MASE SHALL update blur effect strength in live preview
4. WHEN THE border radius changes, THE MASE SHALL update corner rounding in live preview
5. WHEN THE shadow preset changes, THE MASE SHALL apply the selected shadow in live preview
6. WHEN THE floating mode activates, THE MASE SHALL apply floating margins in live preview
7. WHEN THE floating margins change, THE MASE SHALL update menu positioning in live preview

### Requirement 6: Background Gradient Support

**User Story:** As a WordPress administrator, I want to apply gradient backgrounds to the Admin Menu, so that I can create more visually appealing designs.

#### Acceptance Criteria

1. THE MASE SHALL provide gradient type selection with options for linear, radial, and conic gradients
2. THE MASE SHALL provide at least two color stop controls with color pickers
3. WHEN THE gradient settings change, THE MASE SHALL update the menu background in live preview
4. THE MASE SHALL provide gradient angle control for linear gradients with range 0-360 degrees
5. THE MASE SHALL allow toggling between solid color and gradient background modes

### Requirement 7: Submenu Background Customization

**User Story:** As a WordPress administrator, I want to customize submenu background color independently, so that submenus can have distinct styling from the main menu.

#### Acceptance Criteria

1. THE MASE SHALL provide submenu background color control independent of menu background
2. WHEN THE submenu background color changes, THE MASE SHALL update submenu backgrounds in live preview
3. THE MASE SHALL apply submenu background color to all submenu dropdowns
4. THE MASE SHALL support both solid colors and transparency for submenu backgrounds

### Requirement 8: Submenu Border Radius Controls

**User Story:** As a WordPress administrator, I want to control submenu corner rounding, so that submenus match my design aesthetic.

#### Acceptance Criteria

1. THE MASE SHALL provide submenu border radius control with range 0-20 pixels
2. THE MASE SHALL provide toggle between uniform and individual corner radius modes for submenus
3. WHERE THE individual mode is active, THE MASE SHALL provide four separate controls for submenu corners
4. WHEN THE submenu border radius changes, THE MASE SHALL update submenu corners in live preview

### Requirement 9: Submenu Spacing Controls

**User Story:** As a WordPress administrator, I want to control the distance between the menu and submenus, so that I can adjust submenu positioning.

#### Acceptance Criteria

1. THE MASE SHALL provide submenu spacing control with range 0-50 pixels
2. THE MASE SHALL adjust vertical offset between menu and submenu based on spacing value
3. WHEN THE submenu spacing changes, THE MASE SHALL update submenu position in live preview
4. THE MASE SHALL maintain submenu alignment with parent menu items

### Requirement 10: Submenu Typography Controls

**User Story:** As a WordPress administrator, I want to control submenu text styling independently, so that submenu items have appropriate readability and style.

#### Acceptance Criteria

1. THE MASE SHALL provide submenu font size control with range 10-24 pixels
2. THE MASE SHALL provide submenu text color control independent of menu text color
3. THE MASE SHALL provide submenu line height control with range 1.0-3.0
4. THE MASE SHALL provide submenu letter spacing control with range -2 to 5 pixels
5. THE MASE SHALL provide submenu text transform options including none, uppercase, lowercase, and capitalize
6. WHEN ANY submenu typography setting changes, THE MASE SHALL update submenu text styling in live preview

### Requirement 11: Font Family Selection with Google Fonts

**User Story:** As a WordPress administrator, I want to choose custom fonts including Google Fonts for the Admin Menu, so that typography matches my brand or preferences.

#### Acceptance Criteria

1. THE MASE SHALL provide font family selection with system fonts and Google Fonts
2. THE MASE SHALL load selected Google Fonts dynamically without page reload
3. WHEN THE font family changes, THE MASE SHALL apply the font to menu text in live preview
4. THE MASE SHALL provide separate font family controls for menu and submenu text
5. THE MASE SHALL cache Google Fonts selections to minimize API requests
6. THE MASE SHALL provide at least 10 popular Google Fonts options

### Requirement 12: Individual Corner Radius Controls

**User Story:** As a WordPress administrator, I want to control each corner radius independently for the menu, so that I can create unique border radius designs.

#### Acceptance Criteria

1. THE MASE SHALL provide toggle between uniform and individual corner radius modes
2. WHERE THE individual mode is active, THE MASE SHALL provide four separate slider controls for top-left, top-right, bottom-left, and bottom-right corners
3. WHERE THE uniform mode is active, THE MASE SHALL provide one slider control affecting all corners
4. THE MASE SHALL provide range 0-50 pixels for each corner radius slider
5. WHEN ANY corner radius changes, THE MASE SHALL update menu corners in live preview

### Requirement 13: Advanced Shadow Controls

**User Story:** As a WordPress administrator, I want detailed control over menu shadows, so that I can create subtle or dramatic depth effects.

#### Acceptance Criteria

1. THE MASE SHALL provide shadow preset selection with at least 5 predefined shadow styles
2. THE MASE SHALL provide custom shadow controls including horizontal offset, vertical offset, blur radius, and spread radius
3. THE MASE SHALL provide shadow color control with opacity support
4. THE MASE SHALL provide toggle between preset and custom shadow modes
5. WHEN ANY shadow setting changes, THE MASE SHALL update menu shadow in live preview

### Requirement 14: Menu Width Controls

**User Story:** As a WordPress administrator, I want to control menu width in pixels or percentage, so that I can create custom menu layouts.

#### Acceptance Criteria

1. THE MASE SHALL provide width unit toggle between pixels and percentage
2. WHERE THE pixel unit is selected, THE MASE SHALL provide slider control with range 100-400 pixels
3. WHERE THE percentage unit is selected, THE MASE SHALL provide slider control with range 50-100 percent
4. WHEN THE width changes, THE MASE SHALL update menu width in live preview
5. WHEN THE width changes, THE MASE SHALL recalculate submenu positioning automatically

### Requirement 15: Individual Floating Margin Controls

**User Story:** As a WordPress administrator, I want to control each floating margin independently, so that I can position the floating menu precisely.

#### Acceptance Criteria

1. THE MASE SHALL provide toggle between uniform and individual floating margin modes
2. WHERE THE individual mode is active, THE MASE SHALL provide four separate slider controls for top, right, bottom, and left margins
3. WHERE THE uniform mode is active, THE MASE SHALL provide one slider control affecting all margins
4. THE MASE SHALL provide range 0-100 pixels for each margin slider
5. WHEN ANY floating margin changes, THE MASE SHALL update menu positioning in live preview

### Requirement 16: Logo Placement in Menu

**User Story:** As a WordPress administrator, I want to add and position a custom logo in the menu, so that I can brand the admin interface.

#### Acceptance Criteria

1. THE MASE SHALL provide logo upload functionality with support for PNG, JPG, and SVG formats
2. THE MASE SHALL provide logo position selection with options for top and bottom placement
3. THE MASE SHALL provide logo size controls with range 20-200 pixels for width
4. THE MASE SHALL provide logo alignment options including left, center, and right
5. WHEN THE logo is uploaded, THE MASE SHALL display the logo in the selected position in live preview
6. WHEN THE logo position changes, THE MASE SHALL move the logo to the new position in live preview
7. THE MASE SHALL provide option to remove the logo
8. THE MASE SHALL maintain logo aspect ratio when resizing
