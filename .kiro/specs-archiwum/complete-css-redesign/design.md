# Design Document

## Overview

This design document outlines the complete CSS architecture for the Modern Admin Styler Enterprise (MASE) plugin redesign. The design implements a modern, production-ready admin interface based on contemporary design principles, creating a cohesive visual system that enhances usability, accessibility, and maintainability. The CSS framework is built from scratch without external dependencies, using modern CSS features including Custom Properties, Grid, and Flexbox.

## Architecture

### File Structure

```
woow-admin/
└── assets/
    └── css/
        └── mase-admin.css (Complete redesign - ~100KB)
```

### CSS Organization

The CSS file is organized into 9 major sections:

1. **CSS Variables & Design Tokens** - Foundation layer defining all design values
2. **Reset & Base Styles** - Normalize browser defaults and set base typography
3. **Layout Structure** - Header, navigation, and content area layouts
4. **Form Controls** - All input elements (toggles, sliders, pickers, inputs)
5. **Components** - Reusable UI elements (cards, buttons, badges, notices)
6. **Responsive Design** - Mobile, tablet, and desktop breakpoints
7. **Interactions & Animations** - Hover, focus, and transition effects
8. **Utility Classes** - Helper classes for common patterns
9. **RTL Support** - Right-to-left language adaptations

### Design System Hierarchy

```
Design Tokens (CSS Variables)
    ↓
Base Styles (Typography, Colors)
    ↓
Layout Components (Header, Tabs, Content)
    ↓
Form Controls (Inputs, Toggles, Sliders)
    ↓
UI Components (Buttons, Cards, Badges)
    ↓
Responsive Adaptations
    ↓
Interactions & States
```

## Components and Interfaces

### 1. CSS Variables & Design Tokens

**Purpose:** Centralized design values for consistency and easy theming

**Variable Categories:**

#### Colors
```css
/* Primary Colors */
--mase-primary: #0073aa;           /* WordPress blue */
--mase-primary-hover: #005a87;     /* Darker blue for hover */
--mase-primary-light: #e5f5fa;     /* Light blue background */

/* Semantic Colors */
--mase-success: #00a32a;           /* Green for success */
--mase-success-light: #e7f7ed;
--mase-warning: #dba617;           /* Yellow for warnings */
--mase-warning-light: #fef8ee;
--mase-error: #d63638;             /* Red for errors */
--mase-error-light: #fcf0f1;

/* Neutral Palette (10-step gray scale) */
--mase-gray-50: #f9fafb;
--mase-gray-100: #f3f4f6;
--mase-gray-200: #e5e7eb;
--mase-gray-300: #d1d5db;
--mase-gray-400: #9ca3af;
--mase-gray-500: #6b7280;
--mase-gray-600: #4b5563;
--mase-gray-700: #374151;
--mase-gray-800: #1f2937;
--mase-gray-900: #111827;

/* Surface Colors */
--mase-background: #f0f0f1;        /* Page background */
--mase-surface: #ffffff;           /* Card/panel background */
--mase-text: #1e1e1e;              /* Primary text */
--mase-text-secondary: #646970;    /* Secondary text */
```

#### Spacing Scale
```css
--mase-space-xs: 4px;
--mase-space-sm: 8px;
--mase-space-md: 16px;
--mase-space-lg: 24px;
--mase-space-xl: 32px;
--mase-space-2xl: 48px;
```

#### Typography
```css
--mase-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                  Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
--mase-font-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, 
                  Courier, monospace;

--mase-font-size-xs: 12px;
--mase-font-size-sm: 13px;
--mase-font-size-base: 14px;
--mase-font-size-lg: 16px;
--mase-font-size-xl: 18px;
--mase-font-size-2xl: 24px;

--mase-font-weight-normal: 400;
--mase-font-weight-medium: 500;
--mase-font-weight-semibold: 600;
--mase-font-weight-bold: 700;

--mase-line-height-tight: 1.25;
--mase-line-height-normal: 1.5;
--mase-line-height-relaxed: 1.75;
```

#### Border Radius
```css
--mase-radius-sm: 3px;
--mase-radius-base: 4px;
--mase-radius-md: 6px;
--mase-radius-lg: 8px;
--mase-radius-full: 9999px;
```

#### Shadows
```css
--mase-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--mase-shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--mase-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--mase-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--mase-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--mase-shadow-focus: 0 0 0 3px rgba(0, 115, 170, 0.1);
```

#### Transitions
```css
--mase-transition-fast: 150ms ease;
--mase-transition-base: 200ms ease;
--mase-transition-slow: 300ms ease;
```

#### Z-Index Scale
```css
--mase-z-base: 1;
--mase-z-dropdown: 100;
--mase-z-sticky: 200;
--mase-z-fixed: 300;
--mase-z-modal-backdrop: 400;
--mase-z-modal: 500;
--mase-z-toast: 600;
```

### 2. Layout Structure

#### Header Component

**Purpose:** Top section containing plugin branding and primary actions

**CSS Class:** `.mase-header`

**Structure:**
```html
<div class="mase-header">
  <div class="mase-header-left">
    <h1 class="mase-header-title">Ultimate WordPress Admin Styler</h1>
    <span class="mase-header-badge">v2.0.0</span>
  </div>
  <div class="mase-header-right">
    <div class="mase-live-preview-toggle">
      <label class="mase-toggle">
        <input type="checkbox" />
        <span class="mase-toggle-slider"></span>
      </label>
      <span class="mase-toggle-label">Live Preview</span>
    </div>
    <button class="mase-btn mase-btn-secondary">Export</button>
    <button class="mase-btn mase-btn-secondary">Import</button>
    <button class="mase-btn mase-btn-secondary">Reset</button>
    <button class="mase-btn mase-btn-primary">Save Changes</button>
  </div>
</div>
```

**Styles:**
- Background: `var(--mase-surface)`
- Padding: `var(--mase-space-lg)`
- Border-bottom: `1px solid var(--mase-gray-200)`
- Display: `flex` with `space-between`
- Position: `sticky` with `top: 32px` (below WordPress admin bar)
- Z-index: `var(--mase-z-sticky)`
- Box-shadow: `var(--mase-shadow-sm)`

**Responsive:**
- Desktop: Horizontal layout with all buttons visible
- Tablet: Buttons may wrap to second row
- Mobile: Stack vertically, buttons full width

#### Tab Navigation Component

**Purpose:** Organize settings into 8 distinct sections

**CSS Class:** `.mase-tabs`

**Structure:**
```html
<nav class="mase-tabs">
  <button class="mase-tab mase-tab-active" data-tab="general">
    <span class="mase-tab-icon">⚙️</span>
    <span class="mase-tab-label">General</span>
  </button>
  <button class="mase-tab" data-tab="admin-bar">
    <span class="mase-tab-icon">📊</span>
    <span class="mase-tab-label">Admin Bar</span>
  </button>
  <!-- 6 more tabs -->
</nav>
```

**Layout Options:**

**Option A: Top Horizontal Tabs**
- Display: `flex` with `gap: var(--mase-space-sm)`
- Background: `var(--mase-gray-100)`
- Padding: `var(--mase-space-sm)`
- Border-radius: `var(--mase-radius-lg)`

**Option B: Left Sidebar Tabs**
- Display: `flex` with `flex-direction: column`
- Width: `240px`
- Position: `sticky` with `top: 120px`
- Background: `var(--mase-surface)`
- Border-right: `1px solid var(--mase-gray-200)`

**Tab Styles:**
- Default: Background `transparent`, color `var(--mase-text-secondary)`
- Hover: Background `var(--mase-gray-100)`, color `var(--mase-text)`
- Active: Background `var(--mase-primary)`, color `white`
- Padding: `var(--mase-space-md)`
- Border-radius: `var(--mase-radius-base)`
- Transition: `var(--mase-transition-base)`
- Font-size: `var(--mase-font-size-base)`
- Font-weight: `var(--mase-font-weight-medium)`

**Responsive:**
- Desktop: Full tab layout (horizontal or sidebar)
- Tablet: Horizontal tabs with scrolling
- Mobile: Dropdown select menu

#### Content Area Component

**Purpose:** Main container for settings and form controls

**CSS Class:** `.mase-content`

**Structure:**
```html
<div class="mase-content">
  <div class="mase-section">
    <h2 class="mase-section-title">Section Title</h2>
    <p class="mase-section-description">Section description text</p>
    
    <div class="mase-card">
      <div class="mase-card-body">
        <!-- Form controls here -->
      </div>
    </div>
  </div>
</div>
```

**Styles:**
- Padding: `var(--mase-space-xl)`
- Max-width: `1200px`
- Margin: `0 auto`
- Background: `var(--mase-background)`

**Section Styles:**
- Margin-bottom: `var(--mase-space-xl)`

**Card Styles:**
- Background: `var(--mase-surface)`
- Border-radius: `var(--mase-radius-lg)`
- Box-shadow: `var(--mase-shadow-base)`
- Padding: `var(--mase-space-lg)`
- Border: `1px solid var(--mase-gray-200)`

### 3. Form Controls

#### Toggle Switch (iOS Style)

**Purpose:** Binary on/off control with smooth animation

**CSS Class:** `.mase-toggle`

**Structure:**
```html
<label class="mase-toggle">
  <input type="checkbox" class="mase-toggle-input" />
  <span class="mase-toggle-slider"></span>
</label>
```

**Dimensions:**
- Container width: `44px`
- Container height: `24px`
- Knob diameter: `20px`
- Border-radius: `var(--mase-radius-full)`

**States:**
- **Off:** Background `var(--mase-gray-300)`, knob at left
- **On:** Background `var(--mase-primary)`, knob at right
- **Hover:** Box-shadow `var(--mase-shadow-md)`
- **Focus:** Outline `2px solid var(--mase-primary)`, offset `2px`
- **Disabled:** Opacity `0.5`, cursor `not-allowed`

**Animation:**
- Transition: `var(--mase-transition-base)`
- Knob translates `20px` when toggled
- Background color fades smoothly

#### Slider (Material Design Style)

**Purpose:** Numeric value selection with visual feedback

**CSS Class:** `.mase-slider`

**Structure:**
```html
<div class="mase-slider-container">
  <input type="range" class="mase-slider" min="0" max="100" value="50" />
  <div class="mase-slider-value">50</div>
</div>
```

**Dimensions:**
- Track height: `6px`
- Thumb diameter: `16px` (default), `20px` (hover)
- Value bubble: `32px` width, `24px` height

**Styles:**
- Track background: `var(--mase-gray-200)`
- Filled track: `var(--mase-primary)`
- Thumb: `var(--mase-surface)` with `var(--mase-shadow-md)`
- Value bubble: `var(--mase-gray-900)` background, white text
- Border-radius: Track `var(--mase-radius-full)`, thumb `50%`

**Interaction:**
- Hover: Thumb scales to `20px`
- Active: Thumb has `var(--mase-shadow-lg)`
- Value updates in real-time during drag

#### Color Picker

**Purpose:** Color selection with hex value display

**CSS Class:** `.mase-color-picker`

**Structure:**
```html
<div class="mase-color-picker">
  <input type="color" class="mase-color-input" value="#0073aa" />
  <div class="mase-color-swatch" style="background-color: #0073aa;"></div>
  <input type="text" class="mase-color-hex" value="#0073aa" />
</div>
```

**Dimensions:**
- Swatch: `40px` × `40px`
- Hex input: `100px` width
- Border-radius: `var(--mase-radius-base)`

**Styles:**
- Swatch border: `2px solid var(--mase-gray-200)`
- Swatch shadow: `var(--mase-shadow-sm)`
- Hex input: Standard text input styling
- Display: `flex` with `gap: var(--mase-space-sm)`

**Interaction:**
- Hover: Swatch shadow increases to `var(--mase-shadow-md)`
- Click swatch: Opens native color picker
- Hex input: Validates format, updates swatch

#### Text Input & Select

**Purpose:** Standard form inputs with consistent styling

**CSS Classes:** `.mase-input`, `.mase-select`

**Dimensions:**
- Height: `40px`
- Padding: `var(--mase-space-sm) var(--mase-space-md)`
- Border-radius: `var(--mase-radius-base)`

**Styles:**
- Background: `var(--mase-surface)`
- Border: `1px solid var(--mase-gray-300)`
- Font-size: `var(--mase-font-size-base)`
- Color: `var(--mase-text)`

**States:**
- **Hover:** Border color `var(--mase-gray-400)`
- **Focus:** Border color `var(--mase-primary)`, shadow `var(--mase-shadow-focus)`
- **Error:** Border color `var(--mase-error)`, background `var(--mase-error-light)`
- **Disabled:** Background `var(--mase-gray-100)`, cursor `not-allowed`

### 4. UI Components

#### Button Component

**Purpose:** Clickable actions with clear visual hierarchy

**CSS Classes:** `.mase-btn`, `.mase-btn-primary`, `.mase-btn-secondary`

**Dimensions:**
- Height: `36px`
- Padding: `var(--mase-space-sm) var(--mase-space-md)`
- Border-radius: `var(--mase-radius-base)`
- Font-size: `var(--mase-font-size-base)`
- Font-weight: `var(--mase-font-weight-medium)`

**Primary Button:**
- Background: `var(--mase-primary)`
- Color: `white`
- Border: `none`
- Hover: Background `var(--mase-primary-hover)`, transform `translateY(-1px)`
- Active: Transform `translateY(0)`

**Secondary Button:**
- Background: `var(--mase-surface)`
- Color: `var(--mase-primary)`
- Border: `1px solid var(--mase-primary)`
- Hover: Background `var(--mase-primary-light)`

**States:**
- **Loading:** Spinner icon, disabled state
- **Disabled:** Opacity `0.5`, cursor `not-allowed`
- **Focus:** Outline `2px solid var(--mase-primary)`, offset `2px`

#### Card Component

**Purpose:** Container for grouped content

**CSS Class:** `.mase-card`

**Styles:**
- Background: `var(--mase-surface)`
- Border: `1px solid var(--mase-gray-200)`
- Border-radius: `var(--mase-radius-lg)`
- Box-shadow: `var(--mase-shadow-base)`
- Padding: `var(--mase-space-lg)`

**Variants:**
- **Hover:** Shadow increases to `var(--mase-shadow-md)`
- **Interactive:** Cursor `pointer`, transform `translateY(-2px)` on hover

#### Badge Component

**Purpose:** Small status or version indicators

**CSS Class:** `.mase-badge`

**Dimensions:**
- Padding: `var(--mase-space-xs) var(--mase-space-sm)`
- Border-radius: `var(--mase-radius-base)`
- Font-size: `var(--mase-font-size-xs)`
- Font-weight: `var(--mase-font-weight-semibold)`

**Variants:**
- **Primary:** Background `var(--mase-primary)`, color `white`
- **Success:** Background `var(--mase-success)`, color `white`
- **Warning:** Background `var(--mase-warning)`, color `var(--mase-gray-900)`
- **Error:** Background `var(--mase-error)`, color `white`

#### Notice Component

**Purpose:** Feedback messages for user actions

**CSS Class:** `.mase-notice`

**Structure:**
```html
<div class="mase-notice mase-notice-success">
  <span class="mase-notice-icon">✓</span>
  <span class="mase-notice-message">Settings saved successfully!</span>
  <button class="mase-notice-dismiss">×</button>
</div>
```

**Styles:**
- Padding: `var(--mase-space-md)`
- Border-radius: `var(--mase-radius-base)`
- Border-left: `4px solid` (color varies by type)
- Display: `flex` with `align-items: center`
- Gap: `var(--mase-space-sm)`

**Variants:**
- **Success:** Background `var(--mase-success-light)`, border `var(--mase-success)`
- **Warning:** Background `var(--mase-warning-light)`, border `var(--mase-warning)`
- **Error:** Background `var(--mase-error-light)`, border `var(--mase-error)`
- **Info:** Background `var(--mase-primary-light)`, border `var(--mase-primary)`

### 5. Responsive Design

#### Breakpoints

```css
/* Mobile First Approach */
--mase-breakpoint-sm: 600px;   /* Small mobile */
--mase-breakpoint-md: 782px;   /* WordPress admin bar breakpoint */
--mase-breakpoint-lg: 1024px;  /* Tablet */
--mase-breakpoint-xl: 1280px;  /* Desktop */
```

#### Mobile (<768px)

**Layout Changes:**
- Single column layout
- Header stacks vertically
- Tabs convert to dropdown
- Cards full width
- Touch targets minimum 44px

**Typography:**
- Base font-size: `16px` (prevent zoom on iOS)
- Headings scale down proportionally

**Spacing:**
- Reduce padding: `var(--mase-space-md)` instead of `var(--mase-space-lg)`
- Tighter gaps between elements

#### Tablet (768px - 1024px)

**Layout Changes:**
- 2-column grid for form controls
- Horizontal tabs with scrolling
- Header remains horizontal
- Cards in 2-column grid where appropriate

#### Desktop (>1024px)

**Layout Changes:**
- Full multi-column layouts
- Sidebar navigation option
- 3-4 column grids for dense content
- Maximum content width: `1200px`

### 6. Interactions & Animations

#### Hover States

All interactive elements have hover states:
- Buttons: Background color change, slight lift
- Cards: Shadow increase, subtle lift
- Inputs: Border color change
- Toggles: Shadow appearance
- Links: Color change, underline

#### Focus States

Keyboard navigation support:
- Outline: `2px solid var(--mase-primary)`
- Outline-offset: `2px`
- Visible on all interactive elements
- Skip to content link for accessibility

#### Transitions

Smooth state changes:
- Duration: `var(--mase-transition-base)` (200ms)
- Timing: `ease` function
- Properties: `background-color`, `border-color`, `transform`, `box-shadow`

#### Loading States

Visual feedback during async operations:
- Spinner animation: `rotate 1s linear infinite`
- Button disabled with spinner
- Overlay with loading indicator
- Progress bars for long operations

#### Toast Notifications

Slide-in animations for feedback:
- Enter: Slide from top with fade-in
- Exit: Fade out and slide up
- Duration: 3 seconds (configurable)
- Position: Top-right corner

### 7. Accessibility Features

#### Keyboard Navigation

- All interactive elements focusable
- Logical tab order
- Skip navigation links
- Escape key closes modals/dropdowns
- Arrow keys for slider adjustment

#### Screen Reader Support

- ARIA labels on icon-only buttons
- ARIA live regions for dynamic content
- Semantic HTML structure
- Alt text for images
- Role attributes where needed

#### Color Contrast

- Text: Minimum 4.5:1 ratio (WCAG AA)
- Large text: Minimum 3:1 ratio
- UI components: Minimum 3:1 ratio
- Focus indicators: High contrast

#### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 8. RTL Support

#### Layout Mirroring

```css
[dir="rtl"] .mase-header {
  flex-direction: row-reverse;
}

[dir="rtl"] .mase-toggle-slider {
  transform: translateX(-20px); /* Reverse direction */
}

[dir="rtl"] .mase-tabs {
  border-right: none;
  border-left: 1px solid var(--mase-gray-200);
}
```

#### Text Alignment

- Default: `text-align: left`
- RTL: `text-align: right`
- Centered text remains centered

#### Icon Flipping

- Directional icons (arrows) flip horizontally
- Non-directional icons remain unchanged

## Data Models

### CSS Custom Properties Structure

All design tokens are defined as CSS custom properties at the `:root` level, allowing for:
- Easy theming
- Runtime value changes
- Consistent values across components
- Fallback support for older browsers

### Component State Management

Components use CSS classes for state management:
- `.active` - Active/selected state
- `.disabled` - Disabled state
- `.loading` - Loading state
- `.error` - Error state
- `.success` - Success state

### Responsive Behavior

Media queries use mobile-first approach:
```css
/* Base styles for mobile */
.component { }

/* Tablet and up */
@media (min-width: 768px) { }

/* Desktop and up */
@media (min-width: 1024px) { }
```

## Error Handling

### CSS Fallbacks

1. **Custom Properties:** Fallback values provided
   ```css
   color: #0073aa; /* Fallback */
   color: var(--mase-primary, #0073aa);
   ```

2. **Grid Support:** Flexbox fallback
   ```css
   display: flex; /* Fallback */
   display: grid;
   ```

3. **Modern Features:** Progressive enhancement
   - Sticky positioning falls back to static
   - CSS Grid falls back to Flexbox
   - Custom properties fall back to static values

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 14+, Android 10+)

## Testing Strategy

### Visual Testing

1. **Component Rendering**
   - All components render correctly
   - Spacing is consistent
   - Colors match design tokens
   - Typography is legible

2. **Responsive Behavior**
   - Test at 320px, 600px, 768px, 1024px, 1440px
   - Layouts adapt appropriately
   - No horizontal scrolling
   - Touch targets meet 44px minimum

3. **Browser Testing**
   - Test in all supported browsers
   - Check for visual inconsistencies
   - Verify fallbacks work

### Interaction Testing

1. **Hover States**
   - All interactive elements respond
   - Transitions are smooth
   - Visual feedback is clear

2. **Focus States**
   - Keyboard navigation works
   - Focus indicators visible
   - Tab order is logical

3. **Form Controls**
   - Toggles switch smoothly
   - Sliders update values
   - Color pickers work
   - Inputs validate properly

### Accessibility Testing

1. **Keyboard Navigation**
   - All features accessible via keyboard
   - Focus visible at all times
   - Logical tab order

2. **Screen Reader**
   - Test with NVDA/JAWS/VoiceOver
   - All content announced correctly
   - ARIA labels present

3. **Color Contrast**
   - Use contrast checker tools
   - Verify WCAG AA compliance
   - Test in high contrast mode

### Performance Testing

1. **Load Time**
   - CSS file loads in <100ms
   - No render-blocking issues
   - Optimized file size

2. **Runtime Performance**
   - Animations run at 60fps
   - No layout thrashing
   - Smooth scrolling

3. **Memory Usage**
   - No memory leaks
   - Efficient selector usage
   - Minimal repaints

## Integration Points

### WordPress Admin

- Compatible with WordPress admin styles
- Works with admin color schemes
- Respects WordPress breakpoints
- Integrates with admin bar

### MASE Plugin

- Enqueued via `class-mase-admin.php`
- Loaded on MASE settings pages only
- No conflicts with other plugins
- Version-controlled asset loading

### Future Enhancements

1. **Dark Mode**
   - CSS variables ready for dark theme
   - Color scheme media query support
   - Toggle between light/dark

2. **Custom Themes**
   - User-defined color palettes
   - Export/import theme settings
   - Theme preview system

3. **Animation Library**
   - Reusable animation classes
   - Configurable timing
   - Performance-optimized

4. **Component Library**
   - Additional UI components
   - Documented patterns
   - Storybook integration

## File Size & Performance

### Target Metrics

- **Uncompressed:** <100KB
- **Gzipped:** <20KB
- **Load time:** <100ms
- **Parse time:** <50ms
- **Render time:** <200ms

### Optimization Techniques

1. **Selector Efficiency**
   - Avoid deep nesting (max 3 levels)
   - Use classes over complex selectors
   - Minimize universal selectors

2. **Property Optimization**
   - Group related properties
   - Use shorthand where possible
   - Minimize expensive properties

3. **Code Organization**
   - Logical section grouping
   - Remove duplicate rules
   - Consistent formatting

## Documentation

### Inline Comments

- Section headers with clear descriptions
- Complex selector explanations
- Browser-specific hacks documented
- TODO items for future improvements

### Table of Contents

Comprehensive TOC at file beginning listing all sections for easy navigation.

### Usage Examples

Code comments include usage examples for complex components.

## Conclusion

This design provides a comprehensive, modern CSS framework for the MASE plugin that prioritizes usability, accessibility, and maintainability. The system is built on a solid foundation of design tokens, uses modern CSS features, and provides excellent browser support while remaining performant and easy to maintain.
