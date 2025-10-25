# Requirements Document

## Introduction

This document specifies requirements for comprehensive Admin Bar enhancements in the Modern Admin Styler (MASE) plugin. The feature addresses alignment issues, expands live preview capabilities, adds missing styling options, and fixes floating mode layout conflicts.

## Glossary

- **Admin Bar**: The WordPress administrative toolbar displayed at the top of the admin interface
- **MASE**: Modern Admin Styler plugin system
- **Live Preview**: Real-time visual updates without page reload when settings change
- **Floating Mode**: Admin Bar display mode where the bar floats above content with spacing
- **Submenu**: Dropdown menus that appear when hovering over Admin Bar items
- **Glassmorphism**: Visual effect combining transparency, blur, and subtle borders

## Requirements

### Requirement 1: Text and Icon Alignment

**User Story:** As a WordPress administrator, I want text and icons in the Admin Bar to be vertically aligned, so that the interface looks professional and polished.

#### Acceptance Criteria

1. WHEN THE Admin Bar renders, THE MASE SHALL align text and icon elements on the same baseline
2. WHEN THE Admin Bar height changes, THE MASE SHALL maintain vertical alignment between text and icons
3. WHEN THE font size changes, THE MASE SHALL recalculate alignment to keep text and icons aligned

### Requirement 2: Icon Color Synchronization

**User Story:** As a WordPress administrator, I want Admin Bar icons to match the text color automatically, so that the visual design remains consistent.

#### Acceptance Criteria

1. WHEN THE text color setting changes, THE MASE SHALL apply the same color to all Admin Bar icons
2. WHEN THE Admin Bar renders, THE MASE SHALL ensure icon color matches text color by default
3. WHERE THE user enables custom icon colors, THE MASE SHALL provide independent icon color controls

### Requirement 3: Dynamic Text Positioning

**User Story:** As a WordPress administrator, I want Admin Bar text to adjust vertically when I change the bar height, so that content remains centered regardless of height.

#### Acceptance Criteria

1. WHEN THE Admin Bar height changes, THE MASE SHALL recalculate vertical centering for text elements
2. WHILE THE height is being adjusted, THE MASE SHALL update text positioning in real-time
3. WHEN THE Admin Bar height exceeds 60 pixels, THE MASE SHALL maintain proper vertical centering

### Requirement 4: Live Preview for Existing Options

**User Story:** As a WordPress administrator, I want all Admin Bar styling options to update in real-time, so that I can see changes immediately without saving.

#### Acceptance Criteria

1. WHEN THE hover color setting changes, THE MASE SHALL apply the color to hover states in live preview
2. WHEN THE line height setting changes, THE MASE SHALL update text line height in live preview
3. WHEN THE glassmorphism toggle activates, THE MASE SHALL apply glassmorphism effects in live preview
4. WHEN THE blur intensity changes, THE MASE SHALL update blur effect strength in live preview
5. WHEN THE floating effect toggle activates, THE MASE SHALL apply floating mode in live preview
6. WHEN THE floating margin changes, THE MASE SHALL update spacing in live preview
7. WHEN THE border radius changes, THE MASE SHALL update corner rounding in live preview
8. WHEN THE shadow preset changes, THE MASE SHALL apply the selected shadow in live preview

### Requirement 5: Background Gradient Support

**User Story:** As a WordPress administrator, I want to apply gradient backgrounds to the Admin Bar, so that I can create more visually appealing designs.

#### Acceptance Criteria

1. THE MASE SHALL provide gradient type selection with options for linear, radial, and conic gradients
2. THE MASE SHALL provide color stop controls with at least two color pickers
3. WHEN THE gradient settings change, THE MASE SHALL update the Admin Bar background in live preview
4. THE MASE SHALL provide gradient angle control for linear gradients with range 0-360 degrees
5. THE MASE SHALL allow toggling between solid color and gradient background modes

### Requirement 6: Submenu Styling Controls

**User Story:** As a WordPress administrator, I want to customize submenu appearance independently, so that dropdown menus match my design vision.

#### Acceptance Criteria

1. THE MASE SHALL provide submenu background color control independent of Admin Bar background
2. THE MASE SHALL provide submenu border radius control with range 0-20 pixels
3. THE MASE SHALL provide submenu spacing control with range 0-50 pixels to adjust distance from Admin Bar
4. WHEN THE submenu background color changes, THE MASE SHALL update submenu backgrounds in live preview
5. WHEN THE submenu border radius changes, THE MASE SHALL update submenu corner rounding in live preview
6. WHEN THE submenu spacing changes, THE MASE SHALL update vertical offset in live preview

### Requirement 7: Submenu Typography Controls

**User Story:** As a WordPress administrator, I want to control submenu text styling independently, so that submenu items have appropriate readability and style.

#### Acceptance Criteria

1. THE MASE SHALL provide submenu font size control with range 10-24 pixels
2. THE MASE SHALL provide submenu text color control independent of Admin Bar text color
3. THE MASE SHALL provide submenu line height control with range 1.0-3.0
4. THE MASE SHALL provide submenu letter spacing control with range -2 to 5 pixels
5. THE MASE SHALL provide submenu text transform options including none, uppercase, lowercase, and capitalize
6. WHEN ANY submenu typography setting changes, THE MASE SHALL update submenu text styling in live preview

### Requirement 8: Font Family Selection

**User Story:** As a WordPress administrator, I want to choose custom fonts including Google Fonts for the Admin Bar, so that typography matches my brand or preferences.

#### Acceptance Criteria

1. THE MASE SHALL provide font family selection with system fonts and Google Fonts
2. THE MASE SHALL load selected Google Fonts dynamically without page reload
3. WHEN THE font family changes, THE MASE SHALL apply the font to Admin Bar text in live preview
4. THE MASE SHALL provide separate font family controls for Admin Bar and submenu text
5. THE MASE SHALL cache Google Fonts selections to minimize API requests

### Requirement 9: Individual Corner Radius Controls

**User Story:** As a WordPress administrator, I want to control each corner radius independently, so that I can create unique border radius designs.

#### Acceptance Criteria

1. THE MASE SHALL provide toggle between uniform and individual corner radius modes
2. WHERE THE individual mode is active, THE MASE SHALL provide four separate slider controls for top-left, top-right, bottom-left, and bottom-right corners
3. WHERE THE uniform mode is active, THE MASE SHALL provide one slider control affecting all corners
4. THE MASE SHALL provide range 0-50 pixels for each corner radius slider
5. WHEN ANY corner radius changes, THE MASE SHALL update Admin Bar corners in live preview

### Requirement 10: Advanced Shadow Controls

**User Story:** As a WordPress administrator, I want detailed control over Admin Bar shadows, so that I can create subtle or dramatic depth effects.

#### Acceptance Criteria

1. THE MASE SHALL provide shadow preset selection with at least 5 predefined shadow styles
2. THE MASE SHALL provide custom shadow controls including horizontal offset, vertical offset, blur radius, and spread radius
3. THE MASE SHALL provide shadow color control with opacity support
4. THE MASE SHALL provide toggle between preset and custom shadow modes
5. WHEN ANY shadow setting changes, THE MASE SHALL update Admin Bar shadow in live preview

### Requirement 11: Admin Bar Width Controls

**User Story:** As a WordPress administrator, I want to control Admin Bar width in pixels or percentage, so that I can create full-width or constrained layouts.

#### Acceptance Criteria

1. THE MASE SHALL provide width unit toggle between pixels and percentage
2. WHERE THE pixel unit is selected, THE MASE SHALL provide slider control with range 800-3000 pixels
3. WHERE THE percentage unit is selected, THE MASE SHALL provide slider control with range 50-100 percent
4. WHEN THE width changes, THE MASE SHALL update Admin Bar width in live preview
5. WHEN THE width is less than 100 percent, THE MASE SHALL center the Admin Bar horizontally

### Requirement 12: Individual Floating Margin Controls

**User Story:** As a WordPress administrator, I want to control each floating margin independently, so that I can position the floating Admin Bar precisely.

#### Acceptance Criteria

1. THE MASE SHALL provide toggle between uniform and individual floating margin modes
2. WHERE THE individual mode is active, THE MASE SHALL provide four separate slider controls for top, right, bottom, and left margins
3. WHERE THE uniform mode is active, THE MASE SHALL provide one slider control affecting all margins
4. THE MASE SHALL provide range 0-100 pixels for each margin slider
5. WHEN ANY floating margin changes, THE MASE SHALL update Admin Bar positioning in live preview

### Requirement 13: Floating Mode Layout Fix

**User Story:** As a WordPress administrator, I want the side menu to position correctly below the floating Admin Bar, so that the Admin Bar does not overlap other interface elements.

#### Acceptance Criteria

1. WHEN THE floating mode is active, THE MASE SHALL apply top padding to the side menu equal to Admin Bar height plus floating margin
2. WHEN THE floating mode is active, THE MASE SHALL prevent Admin Bar from overlapping side menu content
3. WHEN THE Admin Bar height changes in floating mode, THE MASE SHALL recalculate side menu top padding
4. WHEN THE floating margin changes, THE MASE SHALL recalculate side menu top padding
5. WHEN THE floating mode deactivates, THE MASE SHALL remove additional top padding from side menu
