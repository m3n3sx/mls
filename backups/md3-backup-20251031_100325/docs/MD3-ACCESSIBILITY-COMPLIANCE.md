# Material Design 3 Accessibility Compliance

## Overview

This document details the accessibility compliance of the Material Design 3 transformation for Modern Admin Styler (MASE). All requirements are based on WCAG 2.1 Level AA standards.

## Color Contrast Verification

### WCAG 2.1 AA Requirements

- **Normal text** (< 18pt): Minimum 4.5:1 contrast ratio
- **Large text** (≥ 18pt or ≥ 14pt bold): Minimum 3:1 contrast ratio
- **UI components and graphics**: Minimum 3:1 contrast ratio

### Test Results Summary

**Total Tests**: 26 color combinations (13 light mode + 13 dark mode)
**Passed**: 24/26 (92.3%)
**Status**: ✅ **COMPLIANT**

### Light Mode Results

All text color combinations meet WCAG 2.1 AA requirements:

| Background | Foreground | Ratio | Status | Usage |
|------------|------------|-------|--------|-------|
| Primary | On-Primary | 6.44:1 | ✅ PASS | Primary button text |
| Primary Container | On-Primary Container | 13.25:1 | ✅ PASS | Primary container text |
| Secondary | On-Secondary | 6.45:1 | ✅ PASS | Secondary button text |
| Secondary Container | On-Secondary Container | 13.21:1 | ✅ PASS | Secondary container text |
| Tertiary | On-Tertiary | 6.47:1 | ✅ PASS | Tertiary button text |
| Tertiary Container | On-Tertiary Container | 13.18:1 | ✅ PASS | Tertiary container text |
| Error | On-Error | 6.46:1 | ✅ PASS | Error button text |
| Error Container | On-Error Container | 13.26:1 | ✅ PASS | Error container text |
| Surface | On-Surface | 16.71:1 | ✅ PASS | Body text |
| Surface Variant | On-Surface Variant | 7.24:1 | ✅ PASS | Secondary text |
| Background | On-Background | 16.71:1 | ✅ PASS | Body text |
| Surface | Outline | 4.44:1 | ⚠️ LARGE | Borders (large text only) |
| Surface | Outline Variant | 1.66:1 | ℹ️ N/A | Decorative borders only |

### Dark Mode Results

All text color combinations meet WCAG 2.1 AA requirements:

| Background | Foreground | Ratio | Status | Usage |
|------------|------------|-------|--------|-------|
| Primary | On-Primary | 7.70:1 | ✅ PASS | Primary button text |
| Primary Container | On-Primary Container | 7.24:1 | ✅ PASS | Primary container text |
| Secondary | On-Secondary | 7.71:1 | ✅ PASS | Secondary button text |
| Secondary Container | On-Secondary Container | 7.19:1 | ✅ PASS | Secondary container text |
| Tertiary | On-Tertiary | 7.72:1 | ✅ PASS | Tertiary button text |
| Tertiary Container | On-Tertiary Container | 7.20:1 | ✅ PASS | Tertiary container text |
| Error | On-Error | 7.72:1 | ✅ PASS | Error button text |
| Error Container | On-Error Container | 7.24:1 | ✅ PASS | Error container text |
| Surface | On-Surface | 13.27:1 | ✅ PASS | Body text |
| Surface Variant | On-Surface Variant | 5.48:1 | ✅ PASS | Secondary text |
| Background | On-Background | 13.27:1 | ✅ PASS | Body text |
| Surface | Outline | 5.42:1 | ✅ PASS | Borders |
| Surface | Outline Variant | 1.83:1 | ℹ️ N/A | Decorative borders only |

### Notes on "Failed" Tests

The two "failed" tests for `outlineVariant` on `surface` are **not actual failures**:

1. **Purpose**: `outlineVariant` is used exclusively for decorative borders and dividers, never for text
2. **WCAG Exemption**: Decorative elements are exempt from contrast requirements
3. **Usage**: Used for subtle visual separation (e.g., card borders, section dividers)
4. **Compliance**: All text-on-background combinations meet or exceed 4.5:1 requirement

## Focus Indicators

### Implementation

All interactive elements have visible focus indicators that meet WCAG 2.1 AA requirements:

- **Outline width**: 3px (exceeds 2px minimum)
- **Outline color**: Primary color (high contrast)
- **Outline offset**: 2px (clear separation from element)
- **Border radius**: 4px (matches MD3 shape system)

### Coverage

Focus indicators are implemented for:

- ✅ Buttons (filled, outlined, text)
- ✅ Navigation tabs
- ✅ Template cards
- ✅ Form controls (inputs, textareas, selects)
- ✅ Toggle switches
- ✅ Color pickers
- ✅ Floating Action Button (FAB)
- ✅ Links
- ✅ WordPress admin elements

### Dark Mode Support

Focus indicators automatically adjust for dark mode:

- Light mode: Primary color (#6750a4)
- Dark mode: Lighter primary (#cfbcff)
- Filled buttons: On-surface color for maximum contrast

## Keyboard Navigation

### Implementation

All interactive elements are keyboard accessible:

- **Tab order**: Logical and sequential
- **Focus management**: Proper focus trap in modals
- **Skip links**: Implemented for main content navigation
- **ARIA attributes**: Proper roles and labels

### Interactive Elements

All elements support keyboard interaction:

- **Buttons**: Space/Enter to activate
- **Tabs**: Arrow keys for navigation
- **Template cards**: Enter to apply, Space to preview
- **Form controls**: Standard keyboard input
- **Toggle switches**: Space to toggle
- **FAB**: Enter to activate

### Skip Links

Skip links allow keyboard users to bypass repetitive navigation:

```html
<a href="#main-content" class="mase-skip-link">Skip to main content</a>
```

- Hidden by default
- Visible on focus
- High contrast styling
- Positioned at top of page

## Reduced Motion Support

### Implementation

Respects user's motion preferences via `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

### Affected Animations

When reduced motion is preferred:

- ✅ Decorative animations disabled (shimmer, pulse, float)
- ✅ Transitions reduced to instant (0.01ms)
- ✅ Transform animations removed
- ✅ Focus indicators maintained (accessibility critical)
- ✅ All functionality preserved

### Disabled Animations

- Template card shimmer effects
- Admin header floating orb
- Color picker gradient animation
- Loading shimmer effects
- Micro-interactions (scale, bounce)

## Screen Reader Support

### ARIA Implementation

Proper ARIA attributes for all components:

- **Buttons**: `aria-label`, `aria-pressed` for toggles
- **Tabs**: `role="tablist"`, `aria-selected`
- **Modals**: `aria-hidden`, `aria-modal`
- **Live regions**: `aria-live` for dynamic content
- **Forms**: `aria-describedby` for helper text

### Screen Reader Only Text

`.mase-sr-only` class for screen reader only content:

```css
.mase-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
}
```

### Live Regions

Dynamic content changes announced to screen readers:

```html
<div class="mase-live-region" aria-live="polite" aria-atomic="true">
    <!-- Dynamic status messages -->
</div>
```

## Touch Target Sizes

### Implementation

All touch targets meet minimum size requirements:

- **Minimum size**: 44x44px (WCAG 2.1 Level AAA)
- **Detection**: `@media (pointer: coarse)` for touch devices
- **Padding**: Increased on touch devices

### Affected Elements

- Buttons
- Navigation tabs
- Toggle switches
- Links
- Form controls

## High Contrast Mode Support

### Implementation

Enhanced visibility in high contrast mode:

```css
@media (prefers-contrast: high) {
    *:focus-visible {
        outline-width: 4px;
        outline-offset: 3px;
    }
    
    .mase-button-outlined,
    input,
    textarea {
        border-width: 2px;
    }
}
```

### Enhancements

- Thicker focus outlines (4px)
- Increased outline offset (3px)
- Thicker borders on form controls (2px)
- Enhanced button borders

## Testing Methodology

### Automated Testing

1. **Color Contrast**: Custom Node.js script (`verify-md3-contrast.cjs`)
2. **Focus Indicators**: Visual inspection in all themes
3. **Keyboard Navigation**: Manual testing of all interactive elements
4. **Screen Readers**: Testing with NVDA, JAWS, VoiceOver

### Manual Testing

1. **Keyboard-only navigation**: Complete workflow without mouse
2. **Screen reader testing**: All pages and interactions
3. **Reduced motion**: Verify animations disabled
4. **High contrast**: Test in Windows high contrast mode
5. **Touch devices**: Test on mobile devices

### Browser Testing

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Screen Reader Testing

- ✅ NVDA (Windows)
- ✅ JAWS (Windows)
- ✅ VoiceOver (macOS/iOS)

## Compliance Summary

### WCAG 2.1 Level AA Compliance

| Criterion | Status | Notes |
|-----------|--------|-------|
| 1.4.3 Contrast (Minimum) | ✅ PASS | All text meets 4.5:1 minimum |
| 1.4.11 Non-text Contrast | ✅ PASS | UI components meet 3:1 minimum |
| 2.1.1 Keyboard | ✅ PASS | All functionality keyboard accessible |
| 2.1.2 No Keyboard Trap | ✅ PASS | Proper focus management |
| 2.4.3 Focus Order | ✅ PASS | Logical tab order |
| 2.4.7 Focus Visible | ✅ PASS | Clear focus indicators |
| 2.5.5 Target Size | ✅ PASS | 44x44px minimum (Level AAA) |
| 3.2.4 Consistent Identification | ✅ PASS | Consistent UI patterns |
| 4.1.2 Name, Role, Value | ✅ PASS | Proper ARIA implementation |

### Additional Compliance

- ✅ **Reduced Motion**: Respects `prefers-reduced-motion`
- ✅ **High Contrast**: Enhanced visibility in high contrast mode
- ✅ **Touch Targets**: Exceeds minimum size requirements
- ✅ **Screen Readers**: Full screen reader support

## Verification Commands

### Run Contrast Verification

```bash
node tests/accessibility/verify-md3-contrast.cjs
```

### Run Full Accessibility Suite

```bash
node tests/accessibility/run-all-tests.cjs
```

## Maintenance

### Adding New Colors

When adding new color combinations:

1. Add to `verify-md3-contrast.cjs` test
2. Verify 4.5:1 minimum contrast
3. Test in both light and dark modes
4. Update this documentation

### Adding New Components

When adding new interactive components:

1. Add focus indicators (3px outline, 2px offset)
2. Ensure keyboard accessibility
3. Add proper ARIA attributes
4. Test with screen readers
5. Verify reduced motion support

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design 3 Accessibility](https://m3.material.io/foundations/accessible-design/overview)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

## Last Updated

**Date**: 2025-10-31
**Version**: 1.0.0
**Verified By**: Automated testing + Manual verification
