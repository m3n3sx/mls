# Responsive Design Documentation

## Overview

This document explains the responsive design strategy for the Modern Admin Styler Enterprise (MASE) CSS framework. The design uses a mobile-first approach with carefully chosen breakpoints to ensure optimal user experience across all device sizes.

---

## Table of Contents

1. [Breakpoint Strategy](#breakpoint-strategy)
2. [Mobile Design (<768px)](#mobile-design-768px)
3. [Tablet Design (768px - 1024px)](#tablet-design-768px---1024px)
4. [Desktop Design (>1024px)](#desktop-design-1024px)
5. [Layout Changes](#layout-changes)
6. [Component Adaptations](#component-adaptations)
7. [Touch Targets](#touch-targets)
8. [Typography Scaling](#typography-scaling)
9. [Testing Guidelines](#testing-guidelines)

---

## Breakpoint Strategy

### Defined Breakpoints

The MASE framework uses four primary breakpoints aligned with common device sizes and WordPress admin conventions:

| Breakpoint | Value | Device Category | Usage |
|------------|-------|-----------------|-------|
| `--mase-breakpoint-sm` | `600px` | Small mobile | Phones in portrait |
| `--mase-breakpoint-md` | `782px` | WordPress admin bar | WordPress admin bar breakpoint |
| `--mase-breakpoint-lg` | `1024px` | Tablet | Tablets and small laptops |
| `--mase-breakpoint-xl` | `1280px` | Desktop | Desktop and large screens |

### Mobile-First Approach

The framework follows a mobile-first methodology:

1. **Base styles** target mobile devices (smallest screens)
2. **Media queries** progressively enhance for larger screens
3. **Content prioritization** ensures critical features work on all devices
4. **Performance optimization** reduces unnecessary code for mobile

**Example:**
```css
/* Base styles for mobile */
.mase-header {
  flex-direction: column;
  padding: var(--mase-space-md);
}

/* Tablet and up */
@media (min-width: 768px) {
  .mase-header {
    flex-direction: row;
    padding: var(--mase-space-lg);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .mase-header {
    padding: var(--mase-space-xl);
  }
}
```

### Why These Breakpoints?

1. **600px** - Separates small phones from larger phones/phablets
2. **782px** - WordPress admin bar collapses at this point, ensuring consistency
3. **1024px** - Common tablet landscape width, transition to desktop layouts
4. **1280px** - Comfortable desktop width for multi-column layouts

---

## Mobile Design (<768px)

### Layout Strategy

Mobile layouts prioritize vertical stacking and single-column designs for optimal readability and touch interaction.

### Key Changes

#### 1. Header Component
```css
@media (max-width: 767px) {
  .mase-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--mase-space-md);
  }
  
  .mase-header-left,
  .mase-header-right {
    width: 100%;
    justify-content: center;
  }
  
  .mase-header-right {
    flex-direction: column;
  }
  
  .mase-btn {
    width: 100%; /* Full-width buttons */
  }
}
```

**Result:**
- Header stacks vertically
- Title and badge centered
- Action buttons full-width
- Live Preview toggle prominent

#### 2. Tab Navigation
```css
@media (max-width: 767px) {
  .mase-tabs {
    display: none; /* Hide horizontal tabs */
  }
  
  /* Show dropdown instead */
  .mase-tabs-dropdown {
    display: block;
    width: 100%;
  }
  
  .mase-tabs-select {
    width: 100%;
    height: 44px; /* Touch-friendly height */
    font-size: 16px; /* Prevent iOS zoom */
  }
}
```

**Result:**
- Horizontal tabs convert to dropdown select
- Easier navigation on small screens
- Prevents horizontal scrolling

#### 3. Content Area
```css
@media (max-width: 767px) {
  .mase-content {
    padding: var(--mase-space-md); /* Reduced padding */
  }
  
  .mase-card {
    padding: var(--mase-space-md); /* Reduced card padding */
  }
  
  /* Single column layout */
  .mase-grid {
    grid-template-columns: 1fr;
  }
}
```

**Result:**
- Reduced padding for more screen space
- Single column layout
- Cards stack vertically

#### 4. Form Controls
```css
@media (max-width: 767px) {
  /* Larger touch targets */
  .mase-toggle {
    width: 52px;
    height: 28px;
  }
  
  .mase-toggle-slider::before {
    width: 24px;
    height: 24px;
  }
  
  /* Full-width inputs */
  .mase-input,
  .mase-select {
    width: 100%;
    font-size: 16px; /* Prevent iOS zoom */
  }
  
  /* Larger slider thumb */
  .mase-slider::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
  }
}
```

**Result:**
- Touch targets meet 44px minimum
- Inputs prevent iOS zoom (16px font)
- Better touch interaction

### Mobile-Specific Considerations

1. **Prevent Zoom on Input Focus**
   ```css
   /* Use 16px font size to prevent iOS zoom */
   @media (max-width: 767px) {
     input, select, textarea {
       font-size: 16px;
     }
   }
   ```

2. **Touch-Friendly Spacing**
   ```css
   /* Increase spacing between interactive elements */
   @media (max-width: 767px) {
     .mase-form-group {
       margin-bottom: var(--mase-space-lg);
     }
   }
   ```

3. **Simplified Navigation**
   - Convert complex navigation to simple dropdowns
   - Reduce number of visible options
   - Use hamburger menus for secondary navigation

4. **Content Prioritization**
   - Show most important content first
   - Hide or collapse secondary content
   - Use accordions for long content sections

---

## Tablet Design (768px - 1024px)

### Layout Strategy

Tablet layouts balance between mobile simplicity and desktop complexity, using 2-column grids and horizontal navigation.

### Key Changes

#### 1. Header Component
```css
@media (min-width: 768px) {
  .mase-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .mase-header-right {
    flex-direction: row;
    flex-wrap: wrap; /* Allow wrapping if needed */
  }
  
  .mase-btn {
    width: auto; /* Auto-width buttons */
  }
}
```

**Result:**
- Header returns to horizontal layout
- Buttons may wrap to second row if needed
- More compact than mobile

#### 2. Tab Navigation
```css
@media (min-width: 768px) {
  .mase-tabs {
    display: flex; /* Show horizontal tabs */
    overflow-x: auto; /* Allow horizontal scrolling */
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  }
  
  .mase-tabs-dropdown {
    display: none; /* Hide dropdown */
  }
  
  /* Scrollbar styling */
  .mase-tabs::-webkit-scrollbar {
    height: 4px;
  }
  
  .mase-tabs::-webkit-scrollbar-thumb {
    background-color: var(--mase-gray-300);
    border-radius: var(--mase-radius-full);
  }
}
```

**Result:**
- Horizontal tabs with scrolling
- Touch-friendly scrolling on tablets
- Styled scrollbar for better UX

#### 3. Content Area
```css
@media (min-width: 768px) {
  .mase-content {
    padding: var(--mase-space-lg);
  }
  
  /* 2-column grid */
  .mase-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--mase-space-lg);
  }
  
  /* Sidebar layout option */
  .mase-layout-sidebar {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: var(--mase-space-xl);
  }
}
```

**Result:**
- Increased padding for more breathing room
- 2-column grids for better space utilization
- Optional sidebar layout

#### 4. Form Controls
```css
@media (min-width: 768px) {
  /* Form groups in 2 columns */
  .mase-form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--mase-space-md);
  }
  
  /* Standard touch targets */
  .mase-toggle {
    width: 44px;
    height: 24px;
  }
}
```

**Result:**
- Form fields can be side-by-side
- Standard component sizes
- Better use of horizontal space

### Tablet-Specific Considerations

1. **Horizontal Scrolling**
   ```css
   /* Enable smooth horizontal scrolling */
   .mase-tabs {
     overflow-x: auto;
     -webkit-overflow-scrolling: touch;
     scrollbar-width: thin;
   }
   ```

2. **Flexible Layouts**
   ```css
   /* Allow content to wrap naturally */
   .mase-header-right {
     flex-wrap: wrap;
     gap: var(--mase-space-sm);
   }
   ```

3. **Touch and Mouse Support**
   - Maintain touch-friendly targets (44px minimum)
   - Support hover states for mouse users
   - Enable both touch and click interactions

---

## Desktop Design (>1024px)

### Layout Strategy

Desktop layouts maximize screen space with multi-column grids, sidebar navigation, and expanded content areas.

### Key Changes

#### 1. Header Component
```css
@media (min-width: 1024px) {
  .mase-header {
    padding: var(--mase-space-xl);
  }
  
  .mase-header-right {
    flex-wrap: nowrap; /* No wrapping */
    gap: var(--mase-space-md);
  }
}
```

**Result:**
- Maximum padding for spacious feel
- All buttons on single row
- No wrapping needed

#### 2. Tab Navigation
```css
@media (min-width: 1024px) {
  /* Sidebar navigation option */
  .mase-tabs-sidebar {
    display: flex;
    flex-direction: column;
    width: 240px;
    position: sticky;
    top: 120px;
  }
  
  /* Or full horizontal tabs */
  .mase-tabs {
    overflow-x: visible; /* No scrolling needed */
  }
}
```

**Result:**
- Option for sidebar navigation
- All tabs visible without scrolling
- Sticky positioning for easy access

#### 3. Content Area
```css
@media (min-width: 1024px) {
  .mase-content {
    padding: var(--mase-space-2xl);
    max-width: 1200px; /* Constrain width for readability */
    margin: 0 auto;
  }
  
  /* 3-4 column grids */
  .mase-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .mase-grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }
  
  /* Sidebar + content layout */
  .mase-layout-sidebar {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: var(--mase-space-2xl);
  }
}
```

**Result:**
- Maximum padding and spacing
- Multi-column grids (3-4 columns)
- Constrained max-width for readability
- Sidebar layouts available

#### 4. Form Controls
```css
@media (min-width: 1024px) {
  /* Form groups in 3 columns */
  .mase-form-row {
    grid-template-columns: repeat(3, 1fr);
  }
  
  /* Compact form layouts */
  .mase-form-inline {
    display: flex;
    align-items: center;
    gap: var(--mase-space-md);
  }
  
  .mase-form-inline .mase-input {
    width: auto;
    flex: 1;
  }
}
```

**Result:**
- 3-column form layouts
- Inline form options
- Flexible input widths

### Desktop-Specific Considerations

1. **Maximum Width Constraints**
   ```css
   /* Prevent content from being too wide */
   .mase-content {
     max-width: 1200px;
     margin: 0 auto;
   }
   ```

2. **Hover Effects**
   ```css
   /* Enhanced hover effects for mouse users */
   @media (min-width: 1024px) {
     .mase-card:hover {
       transform: translateY(-2px);
       box-shadow: var(--mase-shadow-md);
     }
   }
   ```

3. **Keyboard Shortcuts**
   - Support keyboard shortcuts for power users
   - Display keyboard hints in tooltips
   - Enable quick navigation between sections

---

## Layout Changes

### Grid System

The framework uses CSS Grid for responsive layouts:

```css
/* Mobile: 1 column */
.mase-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--mase-space-md);
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .mase-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--mase-space-lg);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .mase-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--mase-space-xl);
  }
}

/* Large desktop: 4 columns */
@media (min-width: 1280px) {
  .mase-grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Flexbox Layouts

Flexbox is used for component-level layouts:

```css
/* Mobile: Stack vertically */
.mase-flex {
  display: flex;
  flex-direction: column;
  gap: var(--mase-space-md);
}

/* Tablet and up: Horizontal */
@media (min-width: 768px) {
  .mase-flex {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

/* Desktop: No wrapping */
@media (min-width: 1024px) {
  .mase-flex {
    flex-wrap: nowrap;
  }
}
```

### Sidebar Layouts

```css
/* Mobile: No sidebar */
.mase-layout-sidebar {
  display: block;
}

.mase-sidebar {
  display: none;
}

/* Tablet and up: Show sidebar */
@media (min-width: 768px) {
  .mase-layout-sidebar {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: var(--mase-space-xl);
  }
  
  .mase-sidebar {
    display: block;
  }
}
```

---

## Component Adaptations

### Header Component

| Screen Size | Layout | Button Width | Spacing |
|-------------|--------|--------------|---------|
| Mobile | Vertical stack | Full width | 16px |
| Tablet | Horizontal, may wrap | Auto | 24px |
| Desktop | Horizontal, no wrap | Auto | 32px |

### Tab Navigation

| Screen Size | Display | Scrolling | Layout |
|-------------|---------|-----------|--------|
| Mobile | Dropdown select | N/A | Full width |
| Tablet | Horizontal tabs | Yes | Scrollable |
| Desktop | Horizontal or sidebar | No | Full display |

### Cards

| Screen Size | Columns | Padding | Gap |
|-------------|---------|---------|-----|
| Mobile | 1 | 16px | 16px |
| Tablet | 2 | 24px | 24px |
| Desktop | 3-4 | 24px | 32px |

### Form Controls

| Screen Size | Layout | Input Width | Touch Target |
|-------------|--------|-------------|--------------|
| Mobile | Stacked | Full width | 44px min |
| Tablet | 2 columns | Auto | 44px min |
| Desktop | 3 columns | Auto | Standard |

---

## Touch Targets

### Minimum Sizes

Following WCAG 2.1 Level AAA guidelines:

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Buttons | 44px × 44px | 44px × 44px | 36px × 36px |
| Toggle switches | 52px × 28px | 44px × 24px | 44px × 24px |
| Slider thumbs | 20px | 20px | 16px |
| Links | 44px min height | 44px min height | Standard |
| Icons | 44px × 44px | 44px × 44px | 24px × 24px |

### Implementation

```css
/* Mobile: Larger touch targets */
@media (max-width: 767px) {
  .mase-btn {
    min-height: 44px;
    padding: var(--mase-space-md) var(--mase-space-lg);
  }
  
  .mase-toggle {
    width: 52px;
    height: 28px;
  }
  
  .mase-tab {
    min-height: 44px;
  }
}

/* Desktop: Standard sizes */
@media (min-width: 1024px) {
  .mase-btn {
    height: 36px;
    padding: var(--mase-space-sm) var(--mase-space-md);
  }
  
  .mase-toggle {
    width: 44px;
    height: 24px;
  }
}
```

---

## Typography Scaling

### Font Size Adjustments

Typography scales proportionally across breakpoints for optimal readability:

```css
/* Mobile: Base sizes */
body {
  font-size: 14px;
}

h1 {
  font-size: 20px; /* Reduced from 24px */
}

h2 {
  font-size: 16px; /* Reduced from 18px */
}

/* Tablet: Standard sizes */
@media (min-width: 768px) {
  body {
    font-size: 14px;
  }
  
  h1 {
    font-size: 22px;
  }
  
  h2 {
    font-size: 17px;
  }
}

/* Desktop: Full sizes */
@media (min-width: 1024px) {
  body {
    font-size: 14px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  h2 {
    font-size: 18px;
  }
}
```

### Line Height Adjustments

```css
/* Mobile: Tighter line height for space efficiency */
@media (max-width: 767px) {
  body {
    line-height: 1.4;
  }
  
  h1, h2, h3 {
    line-height: 1.2;
  }
}

/* Desktop: Standard line height */
@media (min-width: 1024px) {
  body {
    line-height: 1.5;
  }
  
  h1, h2, h3 {
    line-height: 1.25;
  }
}
```

### Preventing iOS Zoom

```css
/* Prevent iOS from zooming on input focus */
@media (max-width: 767px) {
  input[type="text"],
  input[type="email"],
  input[type="number"],
  input[type="tel"],
  input[type="url"],
  select,
  textarea {
    font-size: 16px; /* Minimum to prevent zoom */
  }
}
```

---

## Testing Guidelines

### Device Testing

Test on actual devices when possible:

1. **Mobile Phones**
   - iPhone SE (375px)
   - iPhone 12/13 (390px)
   - iPhone 12/13 Pro Max (428px)
   - Samsung Galaxy S21 (360px)
   - Google Pixel 5 (393px)

2. **Tablets**
   - iPad Mini (768px)
   - iPad (810px)
   - iPad Pro (1024px)
   - Android tablets (various)

3. **Desktop**
   - 1280px (common laptop)
   - 1440px (large laptop)
   - 1920px (desktop monitor)
   - 2560px+ (large displays)

### Browser DevTools Testing

Use browser developer tools for quick testing:

```javascript
// Common test widths
const testWidths = [
  320,  // Small phone
  375,  // iPhone
  414,  // Large phone
  768,  // Tablet portrait
  1024, // Tablet landscape
  1280, // Desktop
  1920  // Large desktop
];

// Test each width
testWidths.forEach(width => {
  window.resizeTo(width, 800);
  console.log(`Testing at ${width}px`);
});
```

### Responsive Testing Checklist

- [ ] Header adapts correctly at all breakpoints
- [ ] Tab navigation converts to dropdown on mobile
- [ ] Cards stack properly on mobile
- [ ] Form controls are touch-friendly on mobile
- [ ] Text remains readable at all sizes
- [ ] Images scale appropriately
- [ ] No horizontal scrolling on any device
- [ ] Touch targets meet 44px minimum on mobile
- [ ] Hover effects work on desktop
- [ ] Focus indicators visible on all devices
- [ ] Content prioritization works on mobile
- [ ] Sidebar shows/hides appropriately
- [ ] Buttons are full-width on mobile
- [ ] Spacing is consistent across breakpoints

### Orientation Testing

Test both portrait and landscape orientations:

```css
/* Portrait orientation */
@media (orientation: portrait) {
  .mase-content {
    padding: var(--mase-space-md);
  }
}

/* Landscape orientation */
@media (orientation: landscape) and (max-width: 767px) {
  .mase-header {
    padding: var(--mase-space-sm);
  }
}
```

### Performance Testing

Monitor performance on mobile devices:

1. **Lighthouse Mobile Score** - Target 90+
2. **First Contentful Paint** - Target <1.5s
3. **Time to Interactive** - Target <3s
4. **Cumulative Layout Shift** - Target <0.1

---

## Common Responsive Patterns

### 1. Stacking Pattern

```css
/* Mobile: Stack vertically */
.stack-mobile {
  display: flex;
  flex-direction: column;
}

/* Desktop: Horizontal */
@media (min-width: 1024px) {
  .stack-mobile {
    flex-direction: row;
  }
}
```

### 2. Hide/Show Pattern

```css
/* Hide on mobile */
.hide-mobile {
  display: none;
}

@media (min-width: 768px) {
  .hide-mobile {
    display: block;
  }
}

/* Hide on desktop */
.hide-desktop {
  display: block;
}

@media (min-width: 1024px) {
  .hide-desktop {
    display: none;
  }
}
```

### 3. Reorder Pattern

```css
/* Mobile: Reverse order */
.reorder-mobile {
  display: flex;
  flex-direction: column-reverse;
}

/* Desktop: Normal order */
@media (min-width: 1024px) {
  .reorder-mobile {
    flex-direction: row;
  }
}
```

### 4. Collapse Pattern

```css
/* Mobile: Collapsed */
.collapse-mobile {
  max-height: 0;
  overflow: hidden;
  transition: max-height 300ms ease;
}

.collapse-mobile.expanded {
  max-height: 1000px;
}

/* Desktop: Always expanded */
@media (min-width: 1024px) {
  .collapse-mobile {
    max-height: none;
    overflow: visible;
  }
}
```

---

## Accessibility Considerations

### Screen Reader Announcements

```html
<!-- Announce layout changes -->
<div role="status" aria-live="polite" class="sr-only">
  Layout changed to mobile view
</div>
```

### Skip Navigation

```html
<!-- Skip to main content -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--mase-primary);
  color: white;
  padding: var(--mase-space-sm);
  z-index: 1000;
}

.skip-link:focus {
  top: 0;
}
```

### Focus Management

```javascript
// Manage focus when layout changes
function handleLayoutChange() {
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // Focus on mobile navigation
    document.querySelector('.mase-tabs-dropdown').focus();
  } else {
    // Focus on first tab
    document.querySelector('.mase-tab').focus();
  }
}

window.addEventListener('resize', debounce(handleLayoutChange, 250));
```

---

## Best Practices

1. **Test Early and Often**
   - Test responsive behavior during development
   - Use real devices when possible
   - Check all breakpoints

2. **Mobile-First Mindset**
   - Start with mobile design
   - Progressively enhance for larger screens
   - Prioritize content for small screens

3. **Touch-Friendly Design**
   - Maintain 44px minimum touch targets
   - Provide adequate spacing between elements
   - Support both touch and mouse interactions

4. **Performance Optimization**
   - Minimize CSS for mobile
   - Use responsive images
   - Lazy load non-critical content

5. **Content Prioritization**
   - Show most important content first
   - Hide or collapse secondary content on mobile
   - Use progressive disclosure

6. **Consistent Experience**
   - Maintain brand consistency across devices
   - Ensure feature parity when possible
   - Provide clear navigation at all sizes

7. **Accessibility First**
   - Ensure keyboard navigation works
   - Maintain focus indicators
   - Support screen readers
   - Test with assistive technologies

8. **Avoid Common Pitfalls**
   - Don't rely solely on hover states
   - Avoid horizontal scrolling
   - Don't hide critical content on mobile
   - Test in both orientations
   - Consider slow network connections

---

## Responsive Utilities

### Utility Classes

```css
/* Display utilities */
.show-mobile { display: block; }
.hide-mobile { display: none; }

@media (min-width: 768px) {
  .show-mobile { display: none; }
  .hide-mobile { display: block; }
}

.show-tablet { display: none; }
@media (min-width: 768px) and (max-width: 1023px) {
  .show-tablet { display: block; }
}

.show-desktop { display: none; }
@media (min-width: 1024px) {
  .show-desktop { display: block; }
}

/* Spacing utilities */
.p-mobile { padding: var(--mase-space-md); }
@media (min-width: 1024px) {
  .p-desktop { padding: var(--mase-space-xl); }
}

/* Text alignment */
.text-center-mobile { text-align: center; }
@media (min-width: 1024px) {
  .text-left-desktop { text-align: left; }
}
```

---

## Related Documentation

- [CSS Variables](./CSS-VARIABLES.md) - Design tokens including breakpoints
- [Components](./COMPONENTS.md) - Component-specific responsive behavior
- [Design System](../woow-admin/.kiro/specs/complete-css-redesign/design.md) - Complete design system

---

## Changelog

### Version 2.0.0
- Initial comprehensive responsive design documentation
- Added breakpoint strategy and rationale
- Documented layout changes for all screen sizes
- Included component adaptations
- Added touch target guidelines
- Provided testing guidelines and checklist
- Included common responsive patterns
- Added accessibility considerations

---

## Requirements

This responsive design documentation addresses the following requirements:

- **Requirement 8**: Responsive interface adaptation across devices
  - 8.1: Single column layout below 768px
  - 8.2: 2-column grid between 768-1024px
  - 8.3: Multi-column layout above 1024px
  - 8.4: 44px minimum touch targets on mobile
  - 8.5: Proportional font size adjustments
  - 8.6: Vertical button stacking on mobile
  - 8.7: Dropdown tab navigation on mobile

- **Requirement 14**: Well-organized documentation
  - 14.2: Comprehensive responsive behavior documentation
  - 14.3: Breakpoint strategy explanation
  - 14.4: Layout change documentation
  - 14.5: Mobile-specific considerations
