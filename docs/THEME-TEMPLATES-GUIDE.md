# Theme Templates System - Quick Start Guide

## Overview

The Modern Admin Styler now includes 8 spectacular theme templates that transform the WordPress admin interface with stunning visual effects.

## Available Templates

### 1. Terminal Linux Theme
- **Style:** Matrix-style hacker/developer theme
- **Features:** Green phosphor glow, monospace fonts, blinking cursor
- **Best For:** Developers, tech enthusiasts
- **File:** `assets/css/themes/terminal-theme.css`

### 2. Gaming Cyberpunk Theme
- **Style:** RGB neon effects with cyberpunk aesthetics
- **Features:** Animated neon borders, pulsing glow, dynamic colors
- **Best For:** Gamers, tech enthusiasts
- **File:** `assets/css/themes/gaming-theme.css`

### 3. Floral Natural Theme
- **Style:** Organic shapes with pastel colors
- **Features:** Soft animations, rounded borders, nature-inspired
- **Best For:** Nature lovers, creative professionals
- **File:** `assets/css/themes/floral-theme.css`

### 4. Professional Dark Theme
- **Style:** Corporate elegance with gold accents
- **Features:** Dark gradients, gold highlights, business-ready
- **Best For:** Business professionals, corporate users
- **File:** `assets/css/themes/professional-theme.css`

### 5. Retro 80s Synthwave Theme
- **Style:** Nostalgic 80s with vaporwave aesthetics
- **Features:** Animated gradients, grid overlay, neon flicker
- **Best For:** Retro enthusiasts, creative professionals
- **File:** `assets/css/themes/retro-theme.css`

### 6. Glass Material Theme
- **Style:** Premium glassmorphism with prismatic effects
- **Features:** Advanced blur, multi-layer glass, light refraction
- **Best For:** Modern design lovers, premium users
- **File:** `assets/css/themes/glass-theme.css`

### 7. Gradient Flow Theme
- **Style:** Dynamic flowing gradients with motion
- **Features:** Animated backgrounds, particle effects, color shifts
- **Best For:** Creative professionals, modern design lovers
- **File:** `assets/css/themes/gradient-theme.css`

### 8. Minimalist Modern Theme
- **Style:** Clean design with typography focus
- **Features:** Whitespace, accessible colors, clean UI
- **Best For:** Minimalists, accessibility-focused users
- **File:** `assets/css/themes/minimal-theme.css`

## Usage

### Applying Templates via PHP

```php
// Get template manager instance
$template_manager = new MASE_Template_Manager();

// Apply a template
$template_manager->apply_template('terminal');

// Get active template
$active = $template_manager->get_active_template();

// Get all templates
$templates = $template_manager->get_all_templates();
```

### Applying Templates via AJAX

```javascript
jQuery.ajax({
    url: maseAdmin.ajaxUrl,
    type: 'POST',
    data: {
        action: 'mase_apply_theme_template',
        nonce: maseAdmin.nonce,
        template_id: 'gaming'
    },
    success: function(response) {
        if (response.success) {
            window.location.reload();
        }
    }
});
```

## Template Structure

Each template includes:

1. **Base Styling** - Background, colors, borders
2. **Admin Bar Styling** - Top WordPress admin bar
3. **Admin Menu Styling** - Left sidebar menu
4. **Content Area Styling** - Main content wrapper
5. **Button Styling** - Form buttons and controls
6. **Animations** - Keyframe animations and transitions

## Creating Custom Templates

To create a new template:

1. Create CSS file in `assets/css/themes/your-theme.css`
2. Register in `MASE_Template_Manager::register_templates()`
3. Add to template array with metadata

Example:

```php
'your-theme' => array(
    'name'        => __( 'Your Theme Name', 'modern-admin-styler' ),
    'description' => __( 'Theme description', 'modern-admin-styler' ),
    'css_class'   => 'mase-template-your-theme',
    'css_file'    => 'your-theme.css',
    'category'    => 'custom',
    'features'    => array( 'feature1', 'feature2' ),
),
```

## Template Categories

- **tech** - Technology/developer themes
- **gaming** - Gaming/cyberpunk themes
- **nature** - Natural/organic themes
- **business** - Professional/corporate themes
- **retro** - Retro/vintage themes
- **modern** - Modern/contemporary themes
- **minimal** - Minimalist/clean themes

## Performance

- Templates are loaded only when active
- CSS is cached for optimal performance
- No JavaScript required for template rendering
- Minimal impact on page load times

## Browser Compatibility

All templates are tested and compatible with:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Accessibility

Templates maintain WCAG 2.1 AA compliance:
- Sufficient color contrast
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators

## Support

For issues or questions:
1. Check WordPress debug log
2. Verify template CSS file exists
3. Clear cache after applying template
4. Check browser console for errors
