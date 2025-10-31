# Template Visual Enhancements - Architecture Documentation

## Overview

This document describes the architecture and file structure for the Template Visual Enhancements feature (v2.0). This feature adds interactive preview capabilities, theme customization options, advanced visual effects, and enhanced user experience to the Modern Admin Styler (MASE) plugin.

## File Structure

### CSS Files

#### Core Enhancement Files

```
assets/css/
├── mase-micro-interactions.css      # Micro-interaction styles (Requirements 4.1-4.5)
├── mase-theme-transitions.css       # Theme switching animations (Requirements 6.1-6.5)
├── mase-preview-modal.css           # Live preview modal styles (Requirements 1.1-1.5)
└── mase-theme-variants.css          # Theme variants and intensity controls (Requirements 2.1-3.5)
```

#### Enhanced Theme Files (To be created in future tasks)

```
assets/css/themes/
├── terminal-theme-enhanced.css      # Enhanced terminal effects (Requirements 6.1-6.5)
├── gaming-theme-enhanced.css        # Enhanced gaming effects (Requirements 7.1-7.5)
├── glass-theme-enhanced.css         # Enhanced glass effects (Requirements 8.1-8.5)
├── gradient-theme-enhanced.css      # Enhanced gradient effects (Requirements 9.1-9.5)
├── floral-theme-enhanced.css        # Enhanced floral effects (Requirements 10.1-10.5)
└── retro-theme-enhanced.css         # Enhanced retro effects (Requirements 11.1-11.5)
```

### JavaScript Files

#### Core Enhancement Modules

```
assets/js/
├── mase-theme-preview.js            # Interactive preview system (Requirements 1.1-1.5)
├── mase-theme-customizer.js         # Theme customization panel (Requirements 2.1, 3.1-3.4, 14.1-14.5)
└── mase-micro-interactions.js       # Micro-interaction handlers (Requirements 4.1-4.5)
```

## CSS Custom Properties System

### Intensity Control Variables

The intensity system allows users to adjust the strength of visual effects:

```css
:root {
    /* Base multiplier for all effects */
    --mase-intensity-multiplier: 1;
    
    /* Derived variables */
    --mase-animation-speed: calc(1s * var(--mase-intensity-multiplier));
    --mase-blur-amount: calc(20px * var(--mase-intensity-multiplier));
    --mase-glow-intensity: calc(1 * var(--mase-intensity-multiplier));
    --mase-shadow-intensity: calc(1 * var(--mase-intensity-multiplier));
}
```

**Intensity Levels:**
- **Low** (`data-intensity="low"`): multiplier = 0.5
- **Medium** (`data-intensity="medium"`): multiplier = 1.0 (default)
- **High** (`data-intensity="high"`): multiplier = 1.5

### Theme Variant Variables

Each theme has multiple color variants using CSS custom properties:

#### Terminal Theme Variants

```css
/* Green Variant (Default) */
.mase-template-terminal[data-variant="green"] {
    --terminal-primary: #00ff41;
    --terminal-secondary: #00cc33;
    --terminal-glow: rgba(0, 255, 65, 0.8);
    --terminal-background: #0a0e0a;
}

/* Blue, Amber, Red variants follow same pattern */
```

#### Gaming Theme Variants

```css
/* Cyberpunk Variant (Default) */
.mase-template-gaming[data-variant="cyberpunk"] {
    --gaming-primary: #00f5ff;
    --gaming-secondary: #ff0080;
    --gaming-accent: #8000ff;
    --gaming-background: #0a0a14;
}

/* Neon, Matrix variants follow same pattern */
```

#### Glass Theme Variants

```css
/* Clear Variant (Default) */
.mase-template-glass[data-variant="clear"] {
    --glass-tint: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
    --glass-shadow: rgba(0, 0, 0, 0.1);
}

/* Blue, Purple variants follow same pattern */
```

## JavaScript Architecture

### Module Pattern

All JavaScript modules follow a consistent pattern:

```javascript
(function($) {
    'use strict';

    var MASE_ModuleName = {
        config: {
            // Configuration options
        },
        
        state: {
            // State management
        },
        
        init: function() {
            // Initialization logic
        },
        
        // Additional methods...
    };

    $(document).ready(function() {
        MASE_ModuleName.init();
    });

    window.MASE_ModuleName = MASE_ModuleName;

})(jQuery);
```

### Module Dependencies

```
mase-admin.js (Core)
    ├── mase-theme-preview.js
    ├── mase-theme-customizer.js
    └── mase-micro-interactions.js
```

## Naming Conventions

### CSS Classes

All CSS classes follow BEM (Block Element Modifier) naming:

```css
/* Block */
.mase-preview-modal { }

/* Element */
.mase-preview-modal__header { }
.mase-preview-modal__content { }

/* Modifier */
.mase-preview-modal--active { }
.mase-preview-modal--loading { }
```

**Prefix:** All classes use `mase-` prefix to avoid conflicts.

### JavaScript Functions

```javascript
// Public methods: camelCase
MASE_ThemePreview.showPreview()
MASE_ThemePreview.closeModal()

// Private methods: camelCase with underscore prefix
_generatePreviewContent()
_collectMaseStyles()

// Event handlers: handle + EventName
handleCardHover()
handleModalClose()
```

### CSS Custom Properties

```css
/* Theme-specific variables */
--terminal-primary
--gaming-accent
--glass-tint

/* System variables */
--mase-intensity-multiplier
--mase-animation-speed
--mase-blur-amount
```

## Data Attributes

### Intensity Control

```html
<html data-intensity="medium">
```

**Values:** `low`, `medium`, `high`

### Theme Variants

```html
<body class="mase-template-terminal" data-variant="green">
```

**Terminal Variants:** `green`, `blue`, `amber`, `red`
**Gaming Variants:** `cyberpunk`, `neon`, `matrix`
**Glass Variants:** `clear`, `blue`, `purple`
**Gradient Variants:** `warm`, `cool`, `sunset`
**Floral Variants:** `rose`, `lavender`, `sakura`
**Retro Variants:** `classic`, `vaporwave`, `synthwave`
**Professional Variants:** `corporate`, `executive`, `modern`
**Minimal Variants:** `light`, `dark`, `monochrome`

### Template Identification

```html
<div class="mase-template-card" data-template="terminal">
```

## Performance Considerations

### GPU Acceleration

All animated elements use GPU acceleration:

```css
.mase-animated {
    will-change: transform, opacity;
    transform: translateZ(0);
}

/* Remove will-change after animation */
.mase-animated:not(:hover):not(:active) {
    will-change: auto;
}
```

### Debouncing

JavaScript modules use debouncing for performance:

```javascript
config: {
    debounceDelay: 300 // 300ms delay
}

debouncedSave: function() {
    clearTimeout(this.state.debounceTimeout);
    this.state.debounceTimeout = setTimeout(function() {
        self.saveCustomization();
    }, this.config.debounceDelay);
}
```

### Lazy Loading

Heavy modules are loaded on demand:

```javascript
// Load gradient builder only when needed
if (tabId === 'gradient') {
    loadModule('mase-gradient-builder');
}
```

## Accessibility Features

### Reduced Motion Support

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
    .mase-animated {
        animation: none;
        transition: none;
    }
}
```

### Keyboard Navigation

All interactive elements support keyboard navigation:

```javascript
// ESC key closes modal
$(document).on('keydown', function(e) {
    if (self.state.isModalOpen && e.key === 'Escape') {
        self.closeModal();
    }
});
```

### Focus Indicators

All focusable elements have visible focus indicators:

```css
.mase-preview-btn:focus-visible {
    outline: 2px solid var(--mase-primary, #4A90E2);
    outline-offset: 2px;
}
```

### ARIA Attributes

Modal dialogs use proper ARIA attributes:

```html
<div class="mase-preview-modal" 
     role="dialog" 
     aria-modal="true" 
     aria-labelledby="mase-preview-title">
```

## Browser Compatibility

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallbacks

```css
/* Backdrop filter fallback */
.mase-preview-modal {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
}

@supports not (backdrop-filter: blur(10px)) {
    .mase-preview-modal {
        background: rgba(0, 0, 0, 0.95);
    }
}
```

## Integration with Existing MASE

### Asset Enqueuing

New assets are enqueued in `includes/class-mase-admin.php`:

```php
// Enqueue micro-interactions CSS
wp_enqueue_style(
    'mase-micro-interactions',
    plugins_url('../assets/css/mase-micro-interactions.css', __FILE__),
    array('mase-admin'),
    MASE_VERSION
);

// Enqueue theme preview JS
wp_enqueue_script(
    'mase-theme-preview',
    plugins_url('../assets/js/mase-theme-preview.js', __FILE__),
    array('jquery', 'mase-admin'),
    MASE_VERSION,
    true
);
```

### AJAX Handlers

New AJAX handlers are registered in `includes/class-mase-admin.php`:

```php
// Customization save handler
add_action('wp_ajax_mase_save_customization', array($this, 'handle_ajax_save_customization'));
```

### Settings Storage

Customization settings are stored in WordPress options:

```php
$settings = array(
    'intensity' => 'medium',
    'variant' => 'green',
    // ... other settings
);

update_option('mase_customization_settings', $settings);
```

## Future Enhancements

### Planned Features (Future Tasks)

1. **Enhanced Theme Effects** (Tasks 7-12)
   - Terminal scanlines and CRT effects
   - Gaming particle systems
   - Glass prismatic effects
   - Gradient morphing
   - Floral animations
   - Retro VHS effects

2. **Customization Panel** (Task 13)
   - Live preview area
   - Color pickers
   - Effect sliders
   - Save/reset functionality

3. **Export/Import** (Task 14)
   - JSON export
   - Theme sharing
   - Import validation

4. **Animation Controls** (Task 15)
   - Speed control
   - Type toggles
   - Performance mode

5. **Responsive Optimization** (Task 16)
   - Mobile scaling
   - Touch interactions
   - GPU detection

## Testing Strategy

### Visual Testing

```bash
# Run visual regression tests
npm run test:visual
```

### Performance Testing

```bash
# Run performance benchmarks
npm run test:performance
```

### Accessibility Testing

```bash
# Run accessibility audits
npm run test:a11y
```

## Troubleshooting

### Common Issues

1. **Preview modal not showing**
   - Check if `mase-theme-preview.js` is loaded
   - Verify hover delay (2 seconds)
   - Check console for errors

2. **Intensity not applying**
   - Verify `data-intensity` attribute on `<html>`
   - Check if CSS custom properties are supported
   - Ensure `mase-theme-variants.css` is loaded

3. **Variants not switching**
   - Verify `data-variant` attribute on template element
   - Check if variant CSS is loaded
   - Ensure JavaScript is not blocked

### Debug Mode

Enable debug logging:

```javascript
MASE_ThemePreview.config.debug = true;
MASE_ThemeCustomizer.config.debug = true;
```

## Version History

- **v2.0.0** - Initial release of Template Visual Enhancements
  - Interactive preview system
  - Theme intensity controls
  - Color variants
  - Micro-interactions
  - Theme transitions

## References

- [Requirements Document](.kiro/specs/template-visual-enhancements-v2/requirements.md)
- [Design Document](.kiro/specs/template-visual-enhancements-v2/design.md)
- [Tasks Document](.kiro/specs/template-visual-enhancements-v2/tasks.md)
- [MASE Developer Guide](docs/DEVELOPER-GUIDE.md)
- [CSS Variables Guide](docs/CSS-VARIABLES.md)
