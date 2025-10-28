# CSS Variables Documentation

## Overview

This document provides comprehensive documentation for all CSS custom properties (variables) used in the Modern Admin Styler Enterprise (MASE) plugin. These design tokens form the foundation of the design system and enable consistent styling, easy theming, and runtime customization.

All variables are defined at the `:root` level and use the `--mase-` prefix for namespacing.

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Spacing Scale](#spacing-scale)
3. [Typography System](#typography-system)
4. [Border Radius](#border-radius)
5. [Shadow System](#shadow-system)
6. [Transitions & Animations](#transitions--animations)
7. [Z-Index Scale](#z-index-scale)
8. [Usage Examples](#usage-examples)
9. [Fallback Values](#fallback-values)

---

## Color Palette

### Primary Colors

WordPress blue theme colors for brand identity and primary actions.

| Variable | Value | Usage | Example |
|----------|-------|-------|---------|
| `--mase-primary` | `#0073aa` | Main brand color, primary buttons, active states | Buttons, links, active tabs |
| `--mase-primary-hover` | `#005a87` | Darker shade for hover states | Button hover, link hover |
| `--mase-primary-light` | `#e5f5fa` | Light tint for backgrounds | Highlighted sections, info backgrounds |

**Usage Example:**
```css
.my-button {
  background-color: var(--mase-primary);
  color: white;
}

.my-button:hover {
  background-color: var(--mase-primary-hover);
}
```

**Fallback:**
```css
/* Always provide fallback for older browsers */
background-color: #0073aa; /* Fallback */
background-color: var(--mase-primary, #0073aa);
```

---

### Semantic Colors

Status and feedback colors for user interface states.

| Variable | Value | Usage | Example |
|----------|-------|-------|---------|
| `--mase-success` | `#00a32a` | Success states, positive feedback | Success messages, checkmarks |
| `--mase-success-light` | `#e7f7ed` | Light green background | Success notice backgrounds |
| `--mase-warning` | `#dba617` | Warning states, caution messages | Warning notices, alerts |
| `--mase-warning-light` | `#fef8ee` | Light yellow background | Warning notice backgrounds |
| `--mase-error` | `#d63638` | Error states, destructive actions | Error messages, delete buttons |
| `--mase-error-light` | `#fcf0f1` | Light red background | Error notice backgrounds |

**Usage Example:**
```css
.success-message {
  background-color: var(--mase-success-light);
  border-left: 4px solid var(--mase-success);
  color: var(--mase-success);
}

.error-message {
  background-color: var(--mase-error-light);
  border-left: 4px solid var(--mase-error);
  color: var(--mase-error);
}
```

---

### Neutral Palette

10-step gray scale for UI elements, providing fine-grained control over contrast and hierarchy.

| Variable | Value | Usage | Example |
|----------|-------|-------|---------|
| `--mase-gray-50` | `#f9fafb` | Lightest gray, subtle backgrounds | Hover states, disabled backgrounds |
| `--mase-gray-100` | `#f3f4f6` | Very light gray | Tab backgrounds, section backgrounds |
| `--mase-gray-200` | `#e5e7eb` | Light gray | Borders, dividers, disabled toggle |
| `--mase-gray-300` | `#d1d5db` | Medium-light gray | Input borders, inactive elements |
| `--mase-gray-400` | `#9ca3af` | Mid-tone gray | Placeholder text, disabled text |
| `--mase-gray-500` | `#6b7280` | True mid-tone | Secondary icons, muted text |
| `--mase-gray-600` | `#4b5563` | Medium-dark gray | Secondary text, labels |
| `--mase-gray-700` | `#374151` | Dark gray | Body text alternative |
| `--mase-gray-800` | `#1f2937` | Very dark gray | Headings, emphasis text |
| `--mase-gray-900` | `#111827` | Darkest gray | High contrast text, tooltips |

**Usage Example:**
```css
.card {
  background-color: var(--mase-surface);
  border: 1px solid var(--mase-gray-200);
}

.secondary-text {
  color: var(--mase-gray-600);
}

.disabled-input {
  background-color: var(--mase-gray-100);
  color: var(--mase-gray-400);
}
```

---

### Surface Colors

Background and text colors for the main interface.

| Variable | Value | Usage | Example |
|----------|-------|-------|---------|
| `--mase-background` | `#f0f0f1` | Page background (WordPress admin gray) | Body background, content area |
| `--mase-surface` | `#ffffff` | Card and panel backgrounds | Cards, modals, dropdowns |
| `--mase-text` | `#1e1e1e` | Primary text color | Body text, headings |
| `--mase-text-secondary` | `#646970` | Secondary text color | Helper text, captions, labels |

**Usage Example:**
```css
body {
  background-color: var(--mase-background);
  color: var(--mase-text);
}

.card {
  background-color: var(--mase-surface);
}

.helper-text {
  color: var(--mase-text-secondary);
}
```

---

## Spacing Scale

Consistent spacing values based on a 4px base unit for predictable layouts.

| Variable | Value | Usage | Example |
|----------|-------|-------|---------|
| `--mase-space-xs` | `4px` | Extra small spacing | Icon padding, tight gaps |
| `--mase-space-sm` | `8px` | Small spacing | Button padding, small gaps |
| `--mase-space-md` | `16px` | Medium spacing (base) | Default padding, element spacing |
| `--mase-space-lg` | `24px` | Large spacing | Section padding, card padding |
| `--mase-space-xl` | `32px` | Extra large spacing | Major section spacing |
| `--mase-space-2xl` | `48px` | 2X large spacing | Page-level spacing |

**Usage Example:**
```css
.card {
  padding: var(--mase-space-lg); /* 24px */
  margin-bottom: var(--mase-space-xl); /* 32px */
}

.button {
  padding: var(--mase-space-sm) var(--mase-space-md); /* 8px 16px */
}

.form-group {
  gap: var(--mase-space-md); /* 16px between elements */
}
```

**Note:** The spacing scale follows a consistent progression that makes it easy to create harmonious layouts. Use these values instead of arbitrary pixel values for consistency.

---

## Typography System

### Font Families

System font stacks for optimal performance and native appearance.

| Variable | Value | Usage |
|----------|-------|-------|
| `--mase-font-sans` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif` | Default sans-serif font for all text |
| `--mase-font-mono` | `"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace` | Monospace font for code snippets |

**Usage Example:**
```css
body {
  font-family: var(--mase-font-sans);
}

code, pre {
  font-family: var(--mase-font-mono);
}
```

---

### Font Sizes

Modular scale for typography hierarchy (6 sizes).

| Variable | Value | Usage | Example |
|----------|-------|-------|---------|
| `--mase-font-size-xs` | `12px` | Extra small text | Badges, captions, fine print |
| `--mase-font-size-sm` | `13px` | Small text | Helper text, secondary labels |
| `--mase-font-size-base` | `14px` | Base text size | Body text, form inputs, buttons |
| `--mase-font-size-lg` | `16px` | Large text | Emphasized text, subheadings |
| `--mase-font-size-xl` | `18px` | Extra large text | Section headings (h2) |
| `--mase-font-size-2xl` | `24px` | Heading size | Main headings (h1) |

**Usage Example:**
```css
body {
  font-size: var(--mase-font-size-base); /* 14px */
}

h1 {
  font-size: var(--mase-font-size-2xl); /* 24px */
}

h2 {
  font-size: var(--mase-font-size-xl); /* 18px */
}

.caption {
  font-size: var(--mase-font-size-xs); /* 12px */
}
```

---

### Font Weights

Semantic weight names for consistent emphasis.

| Variable | Value | Usage | Example |
|----------|-------|-------|---------|
| `--mase-font-weight-normal` | `400` | Regular text | Body text, paragraphs |
| `--mase-font-weight-medium` | `500` | Medium emphasis | Buttons, tabs, labels |
| `--mase-font-weight-semibold` | `600` | Strong emphasis | Headings, important text |
| `--mase-font-weight-bold` | `700` | Bold text | Extra emphasis, alerts |

**Usage Example:**
```css
body {
  font-weight: var(--mase-font-weight-normal); /* 400 */
}

h1, h2, h3 {
  font-weight: var(--mase-font-weight-semibold); /* 600 */
}

.button {
  font-weight: var(--mase-font-weight-medium); /* 500 */
}
```

---

### Line Heights

Optimized for readability across different text types.

| Variable | Value | Usage | Example |
|----------|-------|-------|---------|
| `--mase-line-height-tight` | `1.25` | Tight leading for headings | Headings, compact text |
| `--mase-line-height-normal` | `1.5` | Normal leading for body text | Body text, paragraphs |
| `--mase-line-height-relaxed` | `1.75` | Relaxed leading for long-form | Long-form content, articles |

**Usage Example:**
```css
h1, h2, h3 {
  line-height: var(--mase-line-height-tight); /* 1.25 */
}

body, p {
  line-height: var(--mase-line-height-normal); /* 1.5 */
}

.article-content {
  line-height: var(--mase-line-height-relaxed); /* 1.75 */
}
```

---

## Border Radius

Consistent rounded corners for visual harmony.

| Variable | Value | Usage | Example |
|----------|-------|-------|---------|
| `--mase-radius-sm` | `3px` | Small radius | Code blocks, small elements |
| `--mase-radius-base` | `4px` | Base radius for inputs | Buttons, inputs, badges |
| `--mase-radius-md` | `6px` | Medium radius | Medium components |
| `--mase-radius-lg` | `8px` | Large radius for cards | Cards, panels, sections |
| `--mase-radius-full` | `9999px` | Fully rounded (pills, circles) | Pills, toggles, circular elements |

**Usage Example:**
```css
.button {
  border-radius: var(--mase-radius-base); /* 4px */
}

.card {
  border-radius: var(--mase-radius-lg); /* 8px */
}

.toggle-slider {
  border-radius: var(--mase-radius-full); /* Fully rounded pill */
}

.avatar {
  border-radius: 50%; /* Or use var(--mase-radius-full) for pill shape */
}
```

---

## Shadow System

Elevation shadows for depth and hierarchy (6 levels).

| Variable | Value | Usage | Example |
|----------|-------|-------|---------|
| `--mase-shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle shadow | Slight elevation, borders |
| `--mase-shadow-base` | `0 1px 3px 0 rgba(0, 0, 0, 0.1)` | Base shadow | Cards, panels |
| `--mase-shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Medium shadow | Hover states, dropdowns |
| `--mase-shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Large shadow | Modals, popovers |
| `--mase-shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` | Extra large shadow | High elevation elements |
| `--mase-shadow-focus` | `0 0 0 3px rgba(0, 115, 170, 0.1)` | Focus indicator (A11Y) | Keyboard focus states |

**Usage Example:**
```css
.card {
  box-shadow: var(--mase-shadow-base); /* Base elevation */
}

.card:hover {
  box-shadow: var(--mase-shadow-md); /* Increased on hover */
}

.modal {
  box-shadow: var(--mase-shadow-lg); /* High elevation */
}

.button:focus {
  box-shadow: var(--mase-shadow-focus); /* Accessibility focus ring */
}
```

**Note:** The focus shadow is specifically designed for accessibility and should be used on all interactive elements to provide clear keyboard navigation feedback.

---

## Transitions & Animations

Consistent motion for smooth interactions.

| Variable | Value | Usage | Example |
|----------|-------|-------|---------|
| `--mase-transition-fast` | `150ms ease` | Quick interactions | Hover states, small changes |
| `--mase-transition-base` | `200ms ease` | Standard transitions | Most UI transitions |
| `--mase-transition-slow` | `300ms ease` | Deliberate animations | Complex state changes |

**Usage Example:**
```css
.button {
  transition: background-color var(--mase-transition-base); /* 200ms */
}

.tooltip {
  transition: opacity var(--mase-transition-fast); /* 150ms */
}

.modal {
  transition: transform var(--mase-transition-slow); /* 300ms */
}

/* Multiple properties */
.card {
  transition: 
    box-shadow var(--mase-transition-base),
    transform var(--mase-transition-base);
}
```

**Note:** Use `ease` timing function for natural-feeling animations. For more complex animations, consider `ease-in-out` or custom cubic-bezier curves.

---

## Z-Index Scale

Layering system for proper stacking context (7 levels).

| Variable | Value | Usage | Example |
|----------|-------|-------|---------|
| `--mase-z-base` | `1` | Base layer | Default stacking |
| `--mase-z-dropdown` | `100` | Dropdown menus | Select dropdowns, autocomplete |
| `--mase-z-sticky` | `200` | Sticky elements | Sticky headers, fixed navigation |
| `--mase-z-fixed` | `300` | Fixed position elements | Fixed sidebars, toolbars |
| `--mase-z-modal-backdrop` | `400` | Modal backdrop | Overlay backgrounds |
| `--mase-z-modal` | `500` | Modal dialogs | Modals, dialogs |
| `--mase-z-toast` | `600` | Toast notifications (highest) | Notifications, alerts |

**Usage Example:**
```css
.header-sticky {
  position: sticky;
  top: 0;
  z-index: var(--mase-z-sticky); /* 200 */
}

.dropdown-menu {
  position: absolute;
  z-index: var(--mase-z-dropdown); /* 100 */
}

.modal-backdrop {
  position: fixed;
  z-index: var(--mase-z-modal-backdrop); /* 400 */
}

.modal {
  position: fixed;
  z-index: var(--mase-z-modal); /* 500 */
}

.toast-notification {
  position: fixed;
  z-index: var(--mase-z-toast); /* 600 - highest */
}
```

**Note:** Always use these predefined z-index values instead of arbitrary numbers to maintain a predictable stacking order throughout the application.

---

## Usage Examples

### Complete Component Example

Here's a complete example showing how to use multiple CSS variables together:

```css
.mase-button {
  /* Typography */
  font-family: var(--mase-font-sans);
  font-size: var(--mase-font-size-base);
  font-weight: var(--mase-font-weight-medium);
  line-height: var(--mase-line-height-tight);
  
  /* Spacing */
  padding: var(--mase-space-sm) var(--mase-space-md);
  
  /* Visual */
  background-color: var(--mase-primary);
  color: white;
  border: none;
  border-radius: var(--mase-radius-base);
  box-shadow: var(--mase-shadow-sm);
  
  /* Interaction */
  cursor: pointer;
  transition: all var(--mase-transition-base);
}

.mase-button:hover {
  background-color: var(--mase-primary-hover);
  box-shadow: var(--mase-shadow-md);
  transform: translateY(-1px);
}

.mase-button:focus {
  outline: 2px solid var(--mase-primary);
  outline-offset: 2px;
  box-shadow: var(--mase-shadow-focus);
}

.mase-button:active {
  transform: translateY(0);
  box-shadow: var(--mase-shadow-sm);
}
```

### Theming Example

CSS variables make theming easy by allowing runtime value changes:

```javascript
// Change primary color at runtime
document.documentElement.style.setProperty('--mase-primary', '#d63638');
document.documentElement.style.setProperty('--mase-primary-hover', '#b32d2e');

// Dark mode example
document.documentElement.style.setProperty('--mase-background', '#1e1e1e');
document.documentElement.style.setProperty('--mase-surface', '#2d2d2d');
document.documentElement.style.setProperty('--mase-text', '#ffffff');
```

---

## Fallback Values

### Browser Compatibility

CSS custom properties are supported in:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+

For older browsers, always provide fallback values:

```css
/* ❌ Bad - No fallback */
.element {
  color: var(--mase-primary);
}

/* ✅ Good - With fallback */
.element {
  color: #0073aa; /* Fallback for older browsers */
  color: var(--mase-primary, #0073aa);
}
```

### Default Values

CSS variables support default values using the second parameter:

```css
/* If --mase-primary is not defined, use #0073aa */
.element {
  color: var(--mase-primary, #0073aa);
}

/* Nested fallbacks */
.element {
  color: var(--custom-color, var(--mase-primary, #0073aa));
}
```

---

## Best Practices

1. **Always use variables for design tokens** - Never hardcode colors, spacing, or other design values
2. **Provide fallbacks** - Include static values before variable declarations for older browsers
3. **Use semantic names** - Choose variables based on purpose, not appearance (e.g., `--mase-primary` not `--mase-blue`)
4. **Maintain consistency** - Stick to the defined scale values instead of creating arbitrary values
5. **Document custom variables** - If you add new variables, document them following this format
6. **Test across browsers** - Verify variable support and fallbacks work correctly
7. **Use calc() for derived values** - Combine variables with calc() for dynamic sizing

```css
/* ✅ Good - Using calc() with variables */
.element {
  padding: calc(var(--mase-space-md) * 2); /* 32px */
  margin-top: calc(var(--mase-space-lg) - var(--mase-space-sm)); /* 16px */
}
```

---

## Related Documentation

- [Component Documentation](./COMPONENTS.md) - Usage examples for each component
- [Responsive Design](./RESPONSIVE.md) - Breakpoint strategy and mobile considerations
- [Design System](../woow-admin/.kiro/specs/complete-css-redesign/design.md) - Complete design system documentation

---

## Changelog

### Version 2.0.0
- Initial comprehensive CSS variables documentation
- Added all design tokens with usage examples
- Included fallback value guidelines
- Added theming examples
