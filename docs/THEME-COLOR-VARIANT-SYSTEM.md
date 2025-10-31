# Theme Color Variant System Documentation

## Overview

The Theme Color Variant System allows users to select different color schemes for each template theme while maintaining all visual effects and animations. This system uses CSS custom properties (CSS variables) to enable dynamic color switching without modifying the core theme structure.

## Architecture

### CSS Custom Properties

Each theme defines a set of CSS custom properties that control its color scheme. These properties are defined in `assets/css/mase-theme-variants.css` and can be overridden based on the selected variant.

### Naming Conventions

#### Terminal Theme
- `--terminal-primary`: Main terminal text color
- `--terminal-secondary`: Secondary accent color
- `--terminal-glow`: Glow effect color (rgba)
- `--terminal-shadow`: Shadow effect color (rgba)

#### Gaming Theme
- `--gaming-primary`: Primary accent color
- `--gaming-secondary`: Secondary accent color
- `--gaming-accent`: Tertiary accent color
- `--gaming-glow-primary`: Primary glow effect (rgba)
- `--gaming-glow-secondary`: Secondary glow effect (rgba)

#### Glass Theme
- `--glass-tint`: Glass tint overlay color (rgba)
- `--glass-border`: Glass border color (rgba)
- `--glass-shadow`: Glass shadow color (rgba)

#### Gradient Theme
- `--gradient-color-1`: First gradient stop color
- `--gradient-color-2`: Second gradient stop color
- `--gradient-color-3`: Third gradient stop color

#### Floral Theme
- `--floral-primary`: Primary floral color
- `--floral-secondary`: Secondary floral color
- `--floral-accent`: Accent floral color

#### Retro Theme
- `--retro-primary`: Primary retro color
- `--retro-secondary`: Secondary retro color
- `--retro-accent`: Accent retro color

#### Professional Theme
- `--professional-primary`: Primary professional color
- `--professional-secondary`: Secondary professional color
- `--professional-accent`: Accent professional color

#### Minimal Theme
- `--minimal-primary`: Primary background color
- `--minimal-secondary`: Secondary background color
- `--minimal-accent`: Accent color
- `--minimal-text`: Text color

## Variant Selection

Variants are applied using the `data-variant` attribute on the theme container or `:root` element:

```html
<!-- On theme container -->
<body class="mase-template-terminal" data-variant="blue">

<!-- On root element -->
<html data-template="terminal" data-variant="blue">
```

## Available Variants

### Terminal Theme (Requirement 3.5)
1. **Green** (default) - Classic terminal green
2. **Blue** - Cyan/blue terminal
3. **Amber** - Amber/orange terminal
4. **Red** - Red terminal

### Gaming Theme (Requirement 3.1)
1. **Cyberpunk** (default) - Cyan, magenta, purple
2. **Neon** - Bright neon colors
3. **Matrix** - Green matrix style

### Glass Theme (Requirement 3.1)
1. **Clear** (default) - Transparent glass
2. **Blue** - Blue-tinted glass
3. **Purple** - Purple-tinted glass

### Gradient Theme (Requirement 3.1)
1. **Warm** (default) - Warm colors (red, orange, pink)
2. **Cool** - Cool colors (blue, cyan, teal)
3. **Sunset** - Sunset colors (red, yellow, pink)

### Floral Theme (Requirement 3.1)
1. **Rose** (default) - Pink and rose colors
2. **Lavender** - Purple and lavender colors
3. **Sakura** - Soft pink and cream colors

### Retro Theme (Requirement 3.1)
1. **Classic** (default) - Classic 80s colors
2. **Synthwave** - Synthwave pink and purple
3. **Vaporwave** - Vaporwave cyan and pink

### Professional Theme (Requirement 3.1)
1. **Corporate** (default) - Dark gray with gold accent
2. **Executive** - Very dark with blue accent
3. **Modern** - Gray with teal accent

### Minimal Theme (Requirement 3.1)
1. **Light** (default) - White background
2. **Dark** - Dark background
3. **Monochrome** - Pure black and white

## Implementation Guidelines

### For Theme CSS Files

When creating or updating theme CSS files, always use CSS custom properties for colors:

```css
/* CORRECT - Uses CSS custom properties */
.mase-template-terminal {
    color: var(--terminal-primary, #00ff41);
    text-shadow: 0 0 10px var(--terminal-glow, rgba(0, 255, 65, 0.8));
}

/* INCORRECT - Hardcoded colors */
.mase-template-terminal {
    color: #00ff41;
    text-shadow: 0 0 10px rgba(0, 255, 65, 0.8);
}
```

### Fallback Values

Always provide fallback values in `var()` functions to ensure themes work even if custom properties are not defined:

```css
color: var(--terminal-primary, #00ff41);
```

### Variant Specificity

Variant styles should be defined with appropriate specificity:

```css
/* Variant definition */
.mase-template-terminal[data-variant="blue"] {
    --terminal-primary: #00d4ff;
    --terminal-glow: rgba(0, 212, 255, 0.8);
}

/* Alternative for root-level variants */
:root[data-template="terminal"][data-variant="blue"] {
    --terminal-primary: #00d4ff;
    --terminal-glow: rgba(0, 212, 255, 0.8);
}
```

## Integration with Intensity System

Color variants work seamlessly with the intensity control system. The intensity multipliers affect visual effects while variants control colors:

```css
/* Intensity affects effect strength */
box-shadow: 0 0 calc(30px * var(--mase-glow-intensity, 1)) var(--terminal-glow);

/* Variant affects color */
--terminal-glow: rgba(0, 255, 65, 0.8); /* Green variant */
--terminal-glow: rgba(0, 212, 255, 0.8); /* Blue variant */
```

## JavaScript Integration

Variants are managed through JavaScript in `assets/js/mase-theme-customizer.js`:

```javascript
// Apply variant
function applyVariant(theme, variant) {
    document.body.setAttribute('data-variant', variant);
    // or
    document.documentElement.setAttribute('data-variant', variant);
}

// Save variant preference
function saveVariant(theme, variant) {
    wp.ajax.post('mase_save_variant', {
        theme: theme,
        variant: variant,
        nonce: maseAdmin.nonce
    });
}
```

## Requirements Mapping

- **Requirement 3.1**: At least 3 color variants for each template theme ✓
- **Requirement 3.2**: Update all theme colors using CSS custom properties ✓
- **Requirement 3.3**: Display color variant swatches in template card (UI implementation)
- **Requirement 3.4**: Preserve all visual effects when changing variants ✓
- **Requirement 3.5**: Terminal theme offers green, blue, amber, and red variants ✓

## File Structure

```
assets/css/
├── mase-theme-variants.css          # All variant definitions
└── themes/
    ├── terminal-theme.css           # Uses --terminal-* variables
    ├── gaming-theme.css             # Uses --gaming-* variables
    ├── glass-theme.css              # Uses --glass-* variables
    ├── gradient-theme.css           # Uses --gradient-* variables
    ├── floral-theme.css             # Uses --floral-* variables
    ├── retro-theme.css              # Uses --retro-* variables
    ├── professional-theme.css       # Uses --professional-* variables
    └── minimal-theme.css            # Uses --minimal-* variables
```

## Testing

To test variants:

1. Apply a theme
2. Change the `data-variant` attribute in browser DevTools
3. Verify colors change while effects remain intact
4. Test all variants for each theme
5. Verify fallback colors work when custom properties are undefined

## Browser Support

CSS custom properties are supported in:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+

Fallback values ensure graceful degradation in older browsers.
