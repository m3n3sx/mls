# CSS Implementation Guide

## Overview

This document provides comprehensive documentation for the MASE admin CSS framework. The production CSS file (`mase-admin.css`) has been optimized for performance (<100KB), with detailed documentation preserved here.

## File Structure

The CSS is organized into 9 major sections:

1. **CSS Variables & Design Tokens** - Foundation layer
2. **Reset & Base Styles** - Browser normalization
3. **Layout Structure** - Header, tabs, content areas
4. **Form Controls** - Toggles, sliders, inputs
5. **Components** - Cards, buttons, badges, notices
6. **Responsive Design** - Mobile, tablet, desktop breakpoints
7. **Interactions & Animations** - Hover, focus, loading states
8. **Utility Classes** - Helper classes
9. **RTL Support** - Right-to-left language support

## Design Tokens

### Color System
- **Primary**: `#0073aa` (WordPress blue)
- **Success**: `#00a32a` (Green)
- **Warning**: `#dba617` (Yellow)
- **Error**: `#d63638` (Red)
- **Gray Scale**: 10-step scale from `#f9fafb` to `#111827`

### Spacing Scale
Based on 4px base unit: `4px, 8px, 16px, 24px, 32px, 48px`

### Typography
- **Font Stack**: System fonts for optimal performance
- **Sizes**: `12px, 13px, 14px, 16px, 18px, 24px`
- **Weights**: `400, 500, 600, 700`

### Border Radius
- **Small**: `3px` - Subtle rounding
- **Base**: `4px` - Standard inputs
- **Medium**: `6px` - Moderate rounding
- **Large**: `8px` - Cards and panels
- **Full**: `9999px` - Pills and circles

### Shadows
Six elevation levels from subtle (`sm`) to prominent (`xl`), plus focus shadow

### Transitions
- **Fast**: `150ms` - Quick interactions
- **Base**: `200ms` - Standard transitions
- **Slow**: `300ms` - Deliberate animations

## Component Documentation

### Toggle Switch (iOS Style)
- **Dimensions**: 44px × 24px container, 20px knob
- **States**: Off (gray), On (primary blue)
- **Animation**: 200ms smooth slide
- **Accessibility**: Keyboard accessible, visible focus

### Slider (Material Design)
- **Track**: 6px height, gray background
- **Thumb**: 16px diameter (20px on hover)
- **Value Display**: Bubble above thumb
- **Interaction**: Smooth dragging, real-time updates

### Color Picker
- **Swatch**: 40px × 40px with border
- **Hex Input**: 100px width
- **Validation**: Hex format checking
- **Accessibility**: Keyboard accessible

### Buttons
- **Primary**: Blue background, white text
- **Secondary**: White background, blue border
- **Height**: 36px with 8px/16px padding
- **States**: Hover (darker), focus (outline), disabled (opacity)

### Cards
- **Background**: White with subtle shadow
- **Border**: 1px solid gray-200
- **Radius**: 8px rounded corners
- **Padding**: 24px
- **Hover**: Increased shadow (interactive cards)

### Badges
- **Padding**: 4px/8px
- **Font**: 12px semibold
- **Variants**: Primary, success, warning, error
- **Radius**: 4px

### Notices
- **Layout**: Flex with icon, message, dismiss
- **Border**: 4px left border (color-coded)
- **Variants**: Success, warning, error, info
- **Animation**: Slide-in from top

## Responsive Breakpoints

### Mobile (<768px)
- Single column layouts
- Stacked header
- Dropdown tabs
- Touch targets: minimum 44px
- Font size: 16px base (prevents iOS zoom)

### Tablet (768-1024px)
- 2-column grids
- Horizontal tabs with scrolling
- Adjusted spacing

### Desktop (>1024px)
- Multi-column layouts
- Sidebar navigation option
- Max width: 1200px

## Accessibility Features

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Visible focus indicators (2px outline, 2px offset)
- Skip navigation links

### Screen Reader Support
- `.mase-sr-only` class for screen reader only content
- ARIA labels on icon-only buttons
- Semantic HTML structure
- Live regions for dynamic content

### Color Contrast
- Text: 4.5:1 minimum (WCAG AA)
- Large text: 3:1 minimum
- UI components: 3:1 minimum
- All combinations verified

### Reduced Motion
- Respects `prefers-reduced-motion` setting
- Animations disabled or reduced
- Functionality maintained
- Loading states use gentle pulsing

## RTL Support

### Layout Mirroring
- Header reverses (left/right swap)
- Tabs flow right-to-left
- Grid columns reverse
- Content areas mirror

### Directional Elements
- Icons flip horizontally (arrows, chevrons)
- Toggle switches animate in reverse
- Sliders work right-to-left
- Progress bars fill right-to-left

### Text Alignment
- Body text: right-aligned
- Headings: right-aligned
- Centered text: remains centered
- Numbers/code: remain LTR

### Spacing Adjustments
- Padding swaps (left ↔ right)
- Margins swap (left ↔ right)
- Borders appear on correct side

## Performance Optimization

### Selector Efficiency
- Maximum nesting: 3 levels
- Class-based selectors preferred
- Minimal use of universal selectors
- No overly complex selectors

### Property Optimization
- Expensive properties minimized (box-shadow, filter)
- `will-change` used strategically
- Transform for animations (GPU-accelerated)
- CSS containment where appropriate

### File Size
- Production file: <100KB uncompressed
- Gzipped: ~20KB
- Comments removed for production
- Documentation in separate files

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 14+, Android 10+)

### Fallbacks
- CSS variables with fallback values
- Grid with Flexbox fallback
- Sticky positioning with static fallback
- Progressive enhancement approach

## Testing Checklist

### Visual Testing
- ✓ All components render correctly
- ✓ Spacing is consistent
- ✓ Colors match design tokens
- ✓ Typography is legible

### Responsive Testing
- ✓ Test at 320px, 600px, 768px, 1024px, 1440px
- ✓ Layouts adapt appropriately
- ✓ No horizontal scrolling
- ✓ Touch targets meet 44px minimum

### Accessibility Testing
- ✓ Keyboard navigation works
- ✓ Focus indicators visible
- ✓ Screen reader compatible
- ✓ Color contrast meets WCAG AA
- ✓ Reduced motion respected

### Performance Testing
- ✓ CSS loads in <100ms
- ✓ Animations run at 60fps
- ✓ No layout thrashing
- ✓ Smooth scrolling

### RTL Testing
- ✓ Layouts mirror correctly
- ✓ Icons flip appropriately
- ✓ Text aligns properly
- ✓ Spacing maintains balance

## Maintenance Guidelines

### Adding New Components
1. Follow BEM naming convention
2. Use design tokens (CSS variables)
3. Provide all interaction states
4. Ensure accessibility
5. Test responsiveness
6. Add RTL support
7. Document in this guide

### Modifying Existing Styles
1. Check for dependencies
2. Test all breakpoints
3. Verify accessibility
4. Update documentation
5. Test in all supported browsers

### Performance Considerations
1. Avoid deep nesting (max 3 levels)
2. Use efficient selectors
3. Minimize expensive properties
4. Test file size after changes
5. Profile rendering performance

## Common Patterns

### Form Control Wrapper
```html
<div class="mase-form-control">
  <label class="mase-form-label">Label</label>
  <input class="mase-input" type="text" />
  <span class="mase-helper-text">Helper text</span>
</div>
```

### Card with Header
```html
<div class="mase-card">
  <div class="mase-card-header">
    <h3>Title</h3>
    <button class="mase-btn-secondary">Action</button>
  </div>
  <div class="mase-card-body">
    Content
  </div>
</div>
```

### Toggle with Label
```html
<div class="mase-toggle-wrapper">
  <label class="mase-toggle">
    <input type="checkbox" class="mase-toggle-input" />
    <span class="mase-toggle-slider"></span>
  </label>
  <span class="mase-toggle-label">Enable Feature</span>
</div>
```

### Notice/Alert
```html
<div class="mase-notice mase-notice-success">
  <span class="mase-notice-icon">✓</span>
  <span class="mase-notice-message">Success message</span>
  <button class="mase-notice-dismiss">×</button>
</div>
```

## Troubleshooting

### Issue: Styles not applying
- Check selector specificity
- Verify CSS file is loaded
- Check for typos in class names
- Inspect element in browser DevTools

### Issue: Layout breaking on mobile
- Check responsive breakpoints
- Verify touch target sizes
- Test with actual devices
- Check viewport meta tag

### Issue: Accessibility problems
- Run automated accessibility tests
- Test with keyboard only
- Test with screen reader
- Verify color contrast

### Issue: Performance issues
- Profile with browser DevTools
- Check for layout thrashing
- Minimize expensive properties
- Optimize animations

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [CSS Tricks](https://css-tricks.com/) - Techniques and patterns

## Version History

### v2.0.0 (Current)
- Complete redesign with modern CSS
- Design token system
- Comprehensive accessibility
- RTL support
- Responsive design
- Performance optimized (<100KB)

