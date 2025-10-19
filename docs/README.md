# MASE CSS Framework Documentation

Welcome to the Modern Admin Styler Enterprise (MASE) CSS Framework documentation. This comprehensive guide covers all aspects of the design system, from design tokens to component usage and responsive behavior.

## Documentation Structure

### 📘 [CSS Variables](./CSS-VARIABLES.md)
Complete reference for all CSS custom properties (design tokens) used throughout the framework.

**Contents:**
- Color palette (primary, semantic, neutral, surface)
- Spacing scale (6 values from xs to 2xl)
- Typography system (fonts, sizes, weights, line heights)
- Border radius values
- Shadow system (6 elevation levels)
- Transitions and animations
- Z-index scale
- Usage examples and fallback values

**Use this when:**
- You need to reference design token values
- You're creating custom components
- You want to understand the theming system
- You need to provide fallback values for older browsers

---

### 🧩 [Components](./COMPONENTS.md)
Detailed documentation for all UI components with HTML structure, variants, states, and usage examples.

**Components Covered:**
1. Header Component
2. Tab Navigation
3. Card Component
4. Toggle Switch
5. Slider Component
6. Color Picker
7. Text Input & Select
8. Button Component
9. Badge Component
10. Notice Component

**Each component includes:**
- Purpose and use cases
- Complete HTML structure
- CSS class reference
- Available variants
- All interaction states
- Accessibility guidelines
- JavaScript usage examples

**Use this when:**
- You're implementing a specific component
- You need to understand component variants
- You want to see HTML structure examples
- You're looking for accessibility best practices

---

### 📱 [Responsive Design](./RESPONSIVE.md)
Comprehensive guide to responsive behavior, breakpoints, and mobile-first design strategy.

**Contents:**
- Breakpoint strategy (4 breakpoints: 600px, 782px, 1024px, 1280px)
- Mobile design (<768px) - single column, touch-friendly
- Tablet design (768px-1024px) - 2-column grids, horizontal tabs
- Desktop design (>1024px) - multi-column, sidebar options
- Layout changes across breakpoints
- Component adaptations
- Touch target guidelines (44px minimum)
- Typography scaling
- Testing guidelines and checklist

**Use this when:**
- You're implementing responsive layouts
- You need to understand breakpoint behavior
- You're optimizing for mobile devices
- You want to ensure touch-friendly interfaces
- You're testing across different screen sizes

---

## Quick Start

### 1. Understanding Design Tokens

Start by familiarizing yourself with the CSS variables:

```css
/* Example: Using design tokens */
.my-component {
  /* Colors */
  background-color: var(--mase-primary);
  color: var(--mase-text);
  
  /* Spacing */
  padding: var(--mase-space-lg);
  margin-bottom: var(--mase-space-xl);
  
  /* Typography */
  font-family: var(--mase-font-sans);
  font-size: var(--mase-font-size-base);
  font-weight: var(--mase-font-weight-medium);
  
  /* Visual */
  border-radius: var(--mase-radius-lg);
  box-shadow: var(--mase-shadow-base);
  
  /* Animation */
  transition: all var(--mase-transition-base);
}
```

### 2. Building Components

Use the component documentation to implement UI elements:

```html
<!-- Example: Button with proper structure -->
<button class="mase-btn mase-btn-primary">
  Save Changes
</button>

<!-- Example: Toggle switch with label -->
<div class="mase-toggle-wrapper">
  <label class="mase-toggle">
    <input type="checkbox" class="mase-toggle-input" id="feature" />
    <span class="mase-toggle-slider"></span>
  </label>
  <label for="feature" class="mase-toggle-label">Enable Feature</label>
</div>
```

### 3. Implementing Responsive Layouts

Follow the mobile-first approach:

```css
/* Mobile first (base styles) */
.my-layout {
  display: flex;
  flex-direction: column;
  padding: var(--mase-space-md);
}

/* Tablet and up */
@media (min-width: 768px) {
  .my-layout {
    flex-direction: row;
    padding: var(--mase-space-lg);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .my-layout {
    padding: var(--mase-space-xl);
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## Design Principles

### 1. Consistency
- Use design tokens for all values
- Follow established patterns
- Maintain visual hierarchy

### 2. Accessibility
- WCAG 2.1 Level AA compliant
- Keyboard navigation support
- Screen reader optimized
- Sufficient color contrast (4.5:1 minimum)
- Clear focus indicators

### 3. Performance
- Mobile-first approach
- Minimal CSS footprint (<100KB)
- Optimized animations (60fps)
- Efficient selectors (max 3 levels)

### 4. Responsiveness
- Mobile-first design
- Touch-friendly interfaces (44px minimum)
- Flexible layouts
- Progressive enhancement

### 5. Maintainability
- Well-organized code
- Comprehensive documentation
- Consistent naming (BEM methodology)
- Clear comments

---

## Browser Support

The MASE CSS Framework supports modern browsers:

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile browsers** (iOS 14+, Android 10+)

### Fallback Strategy

Always provide fallback values for CSS custom properties:

```css
/* ✅ Good - With fallback */
.element {
  color: #0073aa; /* Fallback */
  color: var(--mase-primary, #0073aa);
}

/* ❌ Bad - No fallback */
.element {
  color: var(--mase-primary);
}
```

---

## File Structure

```
woow-admin/
├── assets/
│   └── css/
│       └── mase-admin.css          # Main CSS file (~100KB)
├── docs/
│   ├── README.md                   # This file
│   ├── CSS-VARIABLES.md            # Design tokens reference
│   ├── COMPONENTS.md               # Component documentation
│   └── RESPONSIVE.md               # Responsive design guide
└── .kiro/
    └── specs/
        └── complete-css-redesign/
            ├── requirements.md     # Feature requirements
            ├── design.md           # Design system specification
            └── tasks.md            # Implementation tasks
```

---

## Common Tasks

### Adding a New Component

1. Review existing components in [COMPONENTS.md](./COMPONENTS.md)
2. Use design tokens from [CSS-VARIABLES.md](./CSS-VARIABLES.md)
3. Follow BEM naming convention (`.mase-component__element--modifier`)
4. Implement responsive behavior per [RESPONSIVE.md](./RESPONSIVE.md)
5. Test accessibility (keyboard, screen reader, contrast)
6. Document the new component

### Customizing Colors

```javascript
// Change primary color at runtime
document.documentElement.style.setProperty('--mase-primary', '#d63638');
document.documentElement.style.setProperty('--mase-primary-hover', '#b32d2e');
```

### Creating a Theme

```css
/* Custom theme using CSS variables */
:root {
  --mase-primary: #8b5cf6;
  --mase-primary-hover: #7c3aed;
  --mase-primary-light: #f5f3ff;
  
  /* Override other variables as needed */
}
```

### Debugging Responsive Issues

1. Use browser DevTools responsive mode
2. Test at all breakpoints: 320px, 768px, 1024px, 1280px
3. Check [RESPONSIVE.md](./RESPONSIVE.md) for expected behavior
4. Verify touch targets meet 44px minimum on mobile
5. Test in both portrait and landscape orientations

---

## Best Practices

### ✅ Do

- Use CSS variables for all design values
- Follow mobile-first approach
- Provide fallback values for older browsers
- Test across all breakpoints
- Ensure keyboard accessibility
- Maintain 44px touch targets on mobile
- Use semantic HTML
- Document custom components

### ❌ Don't

- Hardcode colors, spacing, or other design values
- Use arbitrary values outside the design system
- Forget to test on real devices
- Ignore accessibility requirements
- Create components without documentation
- Use deep selector nesting (>3 levels)
- Rely solely on hover states
- Allow horizontal scrolling on mobile

---

## Testing Checklist

### Visual Testing
- [ ] Components render correctly
- [ ] Spacing is consistent
- [ ] Colors match design tokens
- [ ] Typography is legible
- [ ] Shadows and borders appear correctly

### Responsive Testing
- [ ] Mobile layout (320px, 375px, 414px)
- [ ] Tablet layout (768px, 1024px)
- [ ] Desktop layout (1280px, 1920px)
- [ ] No horizontal scrolling
- [ ] Touch targets meet 44px minimum
- [ ] Content prioritization works

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] ARIA labels present
- [ ] Semantic HTML used

### Performance Testing
- [ ] CSS loads in <100ms
- [ ] Animations run at 60fps
- [ ] No layout thrashing
- [ ] File size <100KB uncompressed

---

## Getting Help

### Documentation Issues

If you find errors or gaps in the documentation:

1. Check the related spec files in `.kiro/specs/complete-css-redesign/`
2. Review the main CSS file at `assets/css/mase-admin.css`
3. Consult the design system documentation

### Component Questions

For component-specific questions:

1. Check [COMPONENTS.md](./COMPONENTS.md) for usage examples
2. Review the HTML structure examples
3. Look at the JavaScript usage examples
4. Check accessibility guidelines

### Responsive Issues

For responsive design questions:

1. Review [RESPONSIVE.md](./RESPONSIVE.md) for breakpoint behavior
2. Check the testing guidelines
3. Verify touch target sizes
4. Test on actual devices when possible

---

## Contributing

When contributing to the CSS framework:

1. **Follow the design system** - Use existing design tokens
2. **Document your changes** - Update relevant documentation files
3. **Test thoroughly** - Check all breakpoints and browsers
4. **Maintain accessibility** - Ensure WCAG AA compliance
5. **Keep it performant** - Monitor file size and animation performance

---

## Version History

### Version 2.0.0 (Current)
- Complete CSS redesign with modern design system
- Comprehensive documentation (CSS Variables, Components, Responsive)
- Mobile-first responsive design
- WCAG 2.1 Level AA accessibility
- Performance optimized (<100KB, 60fps animations)
- RTL support
- Reduced motion support

---

## Related Resources

### Internal Documentation
- [Requirements Document](../.kiro/specs/complete-css-redesign/requirements.md)
- [Design System Specification](../.kiro/specs/complete-css-redesign/design.md)
- [Implementation Tasks](../.kiro/specs/complete-css-redesign/tasks.md)

### External Resources
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [BEM Methodology](http://getbem.com/)
- [Mobile-First Design](https://www.lukew.com/ff/entry.asp?933)

---

## License

Modern Admin Styler Enterprise (MASE)
Version 2.0.0
GPL-2.0+

---

**Last Updated:** October 2025
**Documentation Version:** 2.0.0
