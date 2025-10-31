# Template Visual Enhancements - Developer Guide

## Overview

This guide provides technical documentation for developers working with or extending the Modern Admin Styler Template Visual Enhancements system. It covers CSS custom properties, JavaScript APIs, theme structure, and integration patterns.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [CSS Custom Properties](#css-custom-properties)
3. [JavaScript APIs](#javascript-apis)
4. [Theme Structure](#theme-structure)
5. [Creating Custom Themes](#creating-custom-themes)
6. [Extending Existing Themes](#extending-existing-themes)
7. [Performance Optimization](#performance-optimization)
8. [Testing](#testing)

---

## Architecture Overview

### File Structure

```
assets/
├── css/
│   ├── themes/
│   │   ├── terminal-theme-enhanced.css
│   │   ├── gaming-theme-enhanced.css
│   │   ├── glass-theme-enhanced.css
│   │   ├── gradient-theme-enhanced.css
│   │   ├── floral-theme-enhanced.css
│   │   ├── retro-theme-enhanced.css
│   │   └── theme-variants.css
│   ├── mase-micro-interactions.css
│   ├── mase-theme-transitions.css
│   ├── mase-preview-modal.css
│   ├── mase-intensity-controller.css
│   └── mase-variant-selector.css
├── js/
│   ├── mase-theme-preview.js
│   ├── mase-theme-customizer.js
│   ├── mase-intensity-controller.js
│   ├── mase-variant-selector.js
│   ├── mase-micro-interactions.js
│   ├── mase-theme-transitions.js
│   ├── mase-animation-controls.js
│   └── mase-performance-monitor.js
```

### Design Principles

1. **Progressive Enhancement**: Core functionality works without advanced effects
2. **CSS-First**: Visual effects implemented in CSS, JS only for interactivity
3. **Performance**: 60fps target, GPU acceleration, lazy loading
4. **Modularity**: Each feature is self-contained and can be disabled
5. **Accessibility**: WCAG 2.1 AA compliance maintained

---

## CSS Custom Properties

### Core System Variables

The system uses CSS custom properties for dynamic theming and runtime customization.

#### Intensity Control Variables

```css
:root {
    /* Intensity multiplier (0.5 = Low, 1 = Medium, 1.5 = High) */
    --mase-intensity-multiplier: 1;
    
    /* Derived values */
    --mase-animation-speed: calc(1s * var(--mase-intensity-multiplier));
    --mase-blur-amount: calc(20px * var(--mase-intensity-multiplier));
    --mase-glow-intensity: calc(1 * var(--mase-intensity-multiplier));
    --mase-shadow-depth: calc(10px * var(--mase-intensity-multiplier));
}

/* Intensity presets */
:root[data-intensity="low"] {
    --mase-intensity-multiplier: 0.5;
}

:root[data-intensity="high"] {
    --mase-intensity-multiplier: 1.5;
}
```

#### Theme Color Variables

Each theme defines its own color palette using custom properties:

```css
/* Terminal Theme */
.mase-template-terminal {
    --terminal-primary: #00ff41;
    --terminal-secondary: #008f11;
    --terminal-background: #0a0e0a;
    --terminal-text: #00ff41;
    --terminal-glow: rgba(0, 255, 65, 0.8);
}

/* Gaming Theme */
.mase-template-gaming {
    --gaming-primary: #00f5ff;
    --gaming-secondary: #ff0080;
    --gaming-accent: #8000ff;
    --gaming-background: #0a0a0f;
    --gaming-glow-primary: rgba(0, 245, 255, 0.8);
    --gaming-glow-secondary: rgba(255, 0, 128, 0.8);
}

/* Glass Theme */
.mase-template-glass {
    --glass-blur: var(--mase-blur-amount);
    --glass-opacity: 0.7;
    --glass-border: rgba(255, 255, 255, 0.2);
    --glass-shadow: rgba(0, 0, 0, 0.1);
}
```

#### Variant Color Variables

Color variants override theme colors:

```css
/* Terminal variants */
.mase-template-terminal[data-variant="blue"] {
    --terminal-primary: #00d4ff;
    --terminal-glow: rgba(0, 212, 255, 0.8);
}

.mase-template-terminal[data-variant="amber"] {
    --terminal-primary: #ffb000;
    --terminal-glow: rgba(255, 176, 0, 0.8);
}

.mase-template-terminal[data-variant="red"] {
    --terminal-primary: #ff0040;
    --terminal-glow: rgba(255, 0, 64, 0.8);
}
```

### Using Custom Properties in Your CSS

```css
/* Apply intensity-aware animations */
.my-element {
    animation: pulse var(--mase-animation-speed) infinite;
}

/* Use theme colors */
.my-button {
    background: var(--terminal-primary);
    box-shadow: 0 0 calc(20px * var(--mase-glow-intensity)) var(--terminal-glow);
}

/* Intensity-aware blur */
.my-glass-panel {
    backdrop-filter: blur(var(--mase-blur-amount));
}
```

---

## JavaScript APIs

### Theme Preview API

```javascript
// Show preview for a specific theme
MASEThemePreview.show(themeId, options);

// Example
MASEThemePreview.show('terminal', {
    variant: 'green',
    intensity: 'medium',
    onApply: function(themeId) {
        console.log('Theme applied:', themeId);
    },
    onClose: function() {
        console.log('Preview closed');
    }
});

// Hide preview
MASEThemePreview.hide();

// Check if preview is active
if (MASEThemePreview.isActive()) {
    // Preview is showing
}
```

### Intensity Controller API

```javascript
// Set intensity level
MASEIntensityController.setIntensity('low'); // 'low', 'medium', 'high'

// Get current intensity
const currentIntensity = MASEIntensityController.getIntensity();

// Listen for intensity changes
MASEIntensityController.on('change', function(intensity) {
    console.log('Intensity changed to:', intensity);
});

// Update CSS custom properties
MASEIntensityController.updateProperties({
    '--mase-intensity-multiplier': 1.5,
    '--mase-animation-speed': '1.5s'
});
```

### Variant Selector API

```javascript
// Set theme variant
MASEVariantSelector.setVariant('terminal', 'blue');

// Get current variant for a theme
const variant = MASEVariantSelector.getVariant('terminal');

// Get available variants for a theme
const variants = MASEVariantSelector.getAvailableVariants('terminal');
// Returns: ['green', 'blue', 'amber', 'red']

// Listen for variant changes
MASEVariantSelector.on('change', function(themeId, variant) {
    console.log(`Theme ${themeId} variant changed to ${variant}`);
});
```

### Theme Customizer API

```javascript
// Open customization panel for a theme
MASEThemeCustomizer.open('gaming', {
    colors: {
        primary: '#00f5ff',
        secondary: '#ff0080',
        accent: '#8000ff'
    },
    effects: {
        blur: 20,
        shadow: 15,
        borderRadius: 8
    }
});

// Close customization panel
MASEThemeCustomizer.close();

// Get current customizations
const customizations = MASEThemeCustomizer.getCustomizations('gaming');

// Save customizations
MASEThemeCustomizer.save('gaming', customizations);

// Reset to defaults
MASEThemeCustomizer.reset('gaming');

// Listen for customization changes
MASEThemeCustomizer.on('change', function(themeId, customizations) {
    console.log('Customizations updated:', customizations);
});
```

### Animation Controls API

```javascript
// Set animation speed multiplier
MASEAnimationControls.setSpeed(1.5); // 0.5x to 2x

// Get current speed
const speed = MASEAnimationControls.getSpeed();

// Toggle animation types
MASEAnimationControls.toggleHoverAnimations(false);
MASEAnimationControls.toggleTransitionAnimations(true);
MASEAnimationControls.toggleBackgroundAnimations(false);

// Enable/disable Performance Mode
MASEAnimationControls.setPerformanceMode(true);

// Check if Performance Mode is active
if (MASEAnimationControls.isPerformanceMode()) {
    // Performance mode is enabled
}

// Respect prefers-reduced-motion
if (MASEAnimationControls.prefersReducedMotion()) {
    // User prefers reduced motion
}
```

### Performance Monitor API

```javascript
// Start monitoring
MASEPerformanceMonitor.start();

// Stop monitoring
MASEPerformanceMonitor.stop();

// Get current FPS
const fps = MASEPerformanceMonitor.getFPS();

// Get performance rating for a theme
const rating = MASEPerformanceMonitor.getRating('gaming');
// Returns: 'low', 'medium', or 'high'

// Listen for performance issues
MASEPerformanceMonitor.on('lowPerformance', function(fps) {
    console.warn('Low performance detected:', fps);
    // Suggest enabling Performance Mode
});

// Get performance metrics
const metrics = MASEPerformanceMonitor.getMetrics();
// Returns: { fps, memory, cssSize, animationCount }
```

### Event Bus

All components use a centralized event bus for communication:

```javascript
// Subscribe to events
MASEEventBus.on('theme:changed', function(themeId) {
    console.log('Theme changed to:', themeId);
});

MASEEventBus.on('intensity:changed', function(intensity) {
    console.log('Intensity changed to:', intensity);
});

MASEEventBus.on('variant:changed', function(data) {
    console.log('Variant changed:', data.themeId, data.variant);
});

// Emit custom events
MASEEventBus.emit('custom:event', { data: 'value' });

// Unsubscribe from events
const handler = function(data) { /* ... */ };
MASEEventBus.on('event:name', handler);
MASEEventBus.off('event:name', handler);
```

---

## Theme Structure

### Basic Theme Template

Every theme follows this structure:

```css
/* Theme base class */
.mase-template-mytheme {
    /* Color variables */
    --mytheme-primary: #color;
    --mytheme-secondary: #color;
    --mytheme-accent: #color;
    --mytheme-background: #color;
    --mytheme-text: #color;
    
    /* Effect variables */
    --mytheme-glow: rgba(...);
    --mytheme-shadow: rgba(...);
    
    /* Apply base styles */
    background: var(--mytheme-background);
    color: var(--mytheme-text);
}

/* Variants */
.mase-template-mytheme[data-variant="variant1"] {
    --mytheme-primary: #different-color;
    /* Override other colors as needed */
}

/* Intensity-aware effects */
.mase-template-mytheme .element {
    animation: effect var(--mase-animation-speed) infinite;
    box-shadow: 0 0 var(--mase-blur-amount) var(--mytheme-glow);
}

/* Theme-specific effects */
@keyframes mytheme-effect {
    0% { /* start state */ }
    100% { /* end state */ }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .mase-template-mytheme {
        /* Simplified effects for mobile */
    }
}

/* Performance mode */
:root[data-performance-mode="true"] .mase-template-mytheme {
    /* Disable expensive effects */
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .mase-template-mytheme * {
        animation: none !important;
    }
}
```

### Theme Metadata

Each theme should include metadata in a comment block:

```css
/**
 * Theme: My Custom Theme
 * Description: A brief description of the theme
 * Author: Your Name
 * Version: 1.0.0
 * Performance: medium (low|medium|high)
 * Variants: 3
 * Features: particles, glow, animations
 */
```

### Required Elements

Every theme must style these core elements:

```css
/* Admin Bar */
#wpadminbar { /* ... */ }

/* Menu */
#adminmenu { /* ... */ }
#adminmenu li.menu-top { /* ... */ }
#adminmenu li.menu-top:hover { /* ... */ }

/* Content Area */
.wrap { /* ... */ }

/* Buttons */
.button, .button-primary { /* ... */ }

/* Forms */
input[type="text"], textarea, select { /* ... */ }

/* Cards/Panels */
.postbox { /* ... */ }

/* Notifications */
.notice { /* ... */ }
```

---

## Creating Custom Themes

### Step 1: Create Theme File

Create a new CSS file in `assets/css/themes/`:

```bash
touch assets/css/themes/my-custom-theme.css
```

### Step 2: Define Theme Structure

```css
/**
 * Theme: My Custom Theme
 * Description: A futuristic holographic theme
 * Performance: medium
 * Variants: 3
 */

/* Base theme */
.mase-template-mycustom {
    /* Define color palette */
    --mycustom-primary: #00ffff;
    --mycustom-secondary: #ff00ff;
    --mycustom-accent: #ffff00;
    --mycustom-background: #0a0a1a;
    --mycustom-text: #ffffff;
    --mycustom-glow: rgba(0, 255, 255, 0.6);
    
    /* Apply base styles */
    background: var(--mycustom-background);
    color: var(--mycustom-text);
}

/* Admin bar styling */
.mase-template-mycustom #wpadminbar {
    background: linear-gradient(
        90deg,
        var(--mycustom-primary),
        var(--mycustom-secondary)
    );
    box-shadow: 0 2px calc(10px * var(--mase-glow-intensity)) var(--mycustom-glow);
}

/* Menu styling */
.mase-template-mycustom #adminmenu {
    background: var(--mycustom-background);
}

.mase-template-mycustom #adminmenu li.menu-top:hover {
    background: var(--mycustom-primary);
    box-shadow: 0 0 calc(15px * var(--mase-glow-intensity)) var(--mycustom-glow);
    transition: all calc(0.3s / var(--mase-intensity-multiplier));
}

/* Add custom animations */
@keyframes mycustom-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.mase-template-mycustom .button-primary {
    animation: mycustom-pulse var(--mase-animation-speed) infinite;
}
```

### Step 3: Define Variants

```css
/* Variant 1: Cyan */
.mase-template-mycustom[data-variant="cyan"] {
    --mycustom-primary: #00ffff;
    --mycustom-secondary: #0088ff;
    --mycustom-glow: rgba(0, 255, 255, 0.6);
}

/* Variant 2: Magenta */
.mase-template-mycustom[data-variant="magenta"] {
    --mycustom-primary: #ff00ff;
    --mycustom-secondary: #ff0088;
    --mycustom-glow: rgba(255, 0, 255, 0.6);
}

/* Variant 3: Yellow */
.mase-template-mycustom[data-variant="yellow"] {
    --mycustom-primary: #ffff00;
    --mycustom-secondary: #ffaa00;
    --mycustom-glow: rgba(255, 255, 0, 0.6);
}
```

### Step 4: Register Theme in PHP

Add to `includes/class-mase-template-manager.php`:

```php
public function get_available_templates() {
    return [
        // ... existing themes ...
        'mycustom' => [
            'name' => 'My Custom Theme',
            'description' => 'A futuristic holographic theme',
            'css_file' => 'my-custom-theme.css',
            'performance' => 'medium',
            'variants' => [
                'cyan' => 'Cyan',
                'magenta' => 'Magenta',
                'yellow' => 'Yellow'
            ],
            'preview_image' => 'mycustom-preview.png'
        ]
    ];
}
```

### Step 5: Enqueue Theme CSS

The theme CSS is automatically enqueued when the theme is active. Ensure your theme file is in the correct directory.

### Step 6: Test Your Theme

1. Activate the theme in MASE settings
2. Test all variants
3. Test all intensity levels
4. Test in Performance Mode
5. Test with reduced motion
6. Verify accessibility (contrast ratios)
7. Test on mobile devices

---

## Extending Existing Themes

### Adding Custom Effects to Existing Themes

You can extend existing themes without modifying core files:

```css
/* In your custom CSS file */

/* Add particle effect to gaming theme */
.mase-template-gaming::after {
    content: '';
    position: fixed;
    /* Your custom particle effect */
}

/* Enhance terminal scanlines */
.mase-template-terminal::before {
    /* Override or enhance scanline effect */
    background-size: 100% 2px; /* Finer scanlines */
}

/* Add custom hover effect to glass theme */
.mase-template-glass .button:hover {
    transform: translateY(-2px) scale(1.05);
    transition: transform 0.3s;
}
```

### Creating Theme Mixins

Create reusable effect mixins:

```css
/* Glow effect mixin */
.mase-effect-glow {
    box-shadow: 
        0 0 calc(10px * var(--mase-glow-intensity)) currentColor,
        0 0 calc(20px * var(--mase-glow-intensity)) currentColor,
        0 0 calc(30px * var(--mase-glow-intensity)) currentColor;
}

/* Apply to any theme */
.mase-template-terminal .my-element {
    @extend .mase-effect-glow;
}

/* Ripple effect mixin */
.mase-effect-ripple {
    position: relative;
    overflow: hidden;
}

.mase-effect-ripple::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    transition: width 300ms, height 300ms;
}

.mase-effect-ripple:active::after {
    width: 200%;
    height: 200%;
}
```

### Hooking into Theme Events

```javascript
// Listen for theme activation
MASEEventBus.on('theme:activated', function(themeId) {
    if (themeId === 'gaming') {
        // Initialize custom gaming effects
        initCustomParticles();
    }
});

// Listen for theme deactivation
MASEEventBus.on('theme:deactivated', function(themeId) {
    if (themeId === 'gaming') {
        // Clean up custom effects
        cleanupCustomParticles();
    }
});

// Modify theme before activation
MASEEventBus.on('theme:before-activate', function(themeId, settings) {
    // Modify settings before theme is applied
    settings.intensity = 'high';
    return settings;
});
```

---

## Performance Optimization

### GPU Acceleration

Force GPU acceleration for smooth animations:

```css
.mase-animated {
    /* Trigger GPU acceleration */
    will-change: transform, opacity;
    transform: translateZ(0);
    backface-visibility: hidden;
}

/* Remove will-change when not animating */
.mase-animated:not(:hover):not(:active) {
    will-change: auto;
}
```

### Lazy Loading Effects

Use Intersection Observer for effects that only need to run when visible:

```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('mase-animate-in');
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, { 
    threshold: 0.1,
    rootMargin: '50px' // Start animation slightly before element is visible
});

// Observe elements
document.querySelectorAll('.mase-lazy-animate').forEach(el => {
    observer.observe(el);
});
```

### RequestAnimationFrame for Smooth Animations

```javascript
let rafId;

function animateElement() {
    // Your animation logic
    const element = document.querySelector('.my-element');
    const progress = (Date.now() % 2000) / 2000;
    element.style.transform = `translateX(${progress * 100}px)`;
    
    rafId = requestAnimationFrame(animateElement);
}

// Start animation
animateElement();

// Stop animation when not needed
function stopAnimation() {
    if (rafId) {
        cancelAnimationFrame(rafId);
    }
}
```

### Debouncing and Throttling

```javascript
// Debounce function for resize/scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for frequent events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage
window.addEventListener('resize', debounce(() => {
    // Handle resize
}, 250));

window.addEventListener('scroll', throttle(() => {
    // Handle scroll
}, 100));
```

### CSS Containment

Use CSS containment to improve rendering performance:

```css
.mase-card {
    /* Isolate layout calculations */
    contain: layout style paint;
}

.mase-animation-container {
    /* Isolate animations */
    contain: layout paint;
}
```

### Performance Mode Implementation

```css
/* Disable expensive effects in Performance Mode */
:root[data-performance-mode="true"] {
    --mase-blur-amount: 0px;
    --mase-animation-speed: 0s;
}

:root[data-performance-mode="true"] * {
    animation: none !important;
    transition: none !important;
    backdrop-filter: none !important;
}

:root[data-performance-mode="true"] .mase-particle-system,
:root[data-performance-mode="true"] .mase-complex-effect {
    display: none;
}
```

### Measuring Performance

```javascript
// Measure FPS
let lastTime = performance.now();
let frames = 0;
let fps = 0;

function measureFPS() {
    const now = performance.now();
    frames++;
    
    if (now >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (now - lastTime));
        frames = 0;
        lastTime = now;
        
        // Log or display FPS
        console.log('FPS:', fps);
        
        // Auto-enable Performance Mode if FPS is low
        if (fps < 30) {
            MASEAnimationControls.setPerformanceMode(true);
        }
    }
    
    requestAnimationFrame(measureFPS);
}

measureFPS();
```

---

## Testing

### Visual Regression Testing

Test themes visually across browsers and devices:

```javascript
// Example using Playwright
const { test, expect } = require('@playwright/test');

test('terminal theme renders correctly', async ({ page }) => {
    await page.goto('/wp-admin/');
    
    // Apply terminal theme
    await page.evaluate(() => {
        MASEThemePreview.show('terminal', { variant: 'green' });
    });
    
    // Take screenshot
    await expect(page).toHaveScreenshot('terminal-green.png');
});

test('intensity controls work', async ({ page }) => {
    await page.goto('/wp-admin/');
    
    // Set low intensity
    await page.evaluate(() => {
        MASEIntensityController.setIntensity('low');
    });
    
    // Verify CSS variable
    const intensity = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--mase-intensity-multiplier');
    });
    
    expect(intensity.trim()).toBe('0.5');
});
```

### Performance Testing

```javascript
test('theme maintains 60fps', async ({ page }) => {
    await page.goto('/wp-admin/');
    
    // Start FPS monitoring
    const fps = await page.evaluate(() => {
        return new Promise((resolve) => {
            let frames = 0;
            const start = performance.now();
            
            function count() {
                frames++;
                if (performance.now() - start < 1000) {
                    requestAnimationFrame(count);
                } else {
                    resolve(frames);
                }
            }
            
            requestAnimationFrame(count);
        });
    });
    
    expect(fps).toBeGreaterThanOrEqual(55); // Allow 5fps margin
});
```

### Accessibility Testing

```javascript
const { injectAxe, checkA11y } = require('axe-playwright');

test('theme meets accessibility standards', async ({ page }) => {
    await page.goto('/wp-admin/');
    await injectAxe(page);
    
    // Apply theme
    await page.evaluate(() => {
        MASEThemePreview.show('gaming');
    });
    
    // Check accessibility
    await checkA11y(page, null, {
        rules: {
            'color-contrast': { enabled: true }
        }
    });
});
```

### Unit Testing JavaScript APIs

```javascript
describe('MASEIntensityController', () => {
    test('sets intensity correctly', () => {
        MASEIntensityController.setIntensity('high');
        expect(MASEIntensityController.getIntensity()).toBe('high');
    });
    
    test('updates CSS properties', () => {
        MASEIntensityController.setIntensity('low');
        const multiplier = getComputedStyle(document.documentElement)
            .getPropertyValue('--mase-intensity-multiplier');
        expect(multiplier.trim()).toBe('0.5');
    });
    
    test('emits change event', (done) => {
        MASEIntensityController.on('change', (intensity) => {
            expect(intensity).toBe('high');
            done();
        });
        MASEIntensityController.setIntensity('high');
    });
});
```

### Cross-Browser Testing

```javascript
// Test in multiple browsers
const browsers = ['chromium', 'firefox', 'webkit'];

browsers.forEach(browserType => {
    test(`theme works in ${browserType}`, async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto('/wp-admin/');
        
        // Test theme functionality
        await page.evaluate(() => {
            MASEThemePreview.show('glass');
        });
        
        // Verify backdrop-filter support
        const hasBackdropFilter = await page.evaluate(() => {
            return CSS.supports('backdrop-filter', 'blur(10px)');
        });
        
        if (browserType === 'firefox') {
            // Firefox may need fallback
            expect(hasBackdropFilter).toBeDefined();
        } else {
            expect(hasBackdropFilter).toBe(true);
        }
    });
});
```

---

## Code Examples

### Complete Theme Example

```css
/**
 * Theme: Neon City
 * Description: Cyberpunk-inspired neon theme
 * Performance: medium
 * Variants: 3
 */

.mase-template-neoncity {
    /* Color palette */
    --neon-primary: #ff006e;
    --neon-secondary: #00f5ff;
    --neon-accent: #ffbe0b;
    --neon-background: #0a0a0f;
    --neon-text: #ffffff;
    --neon-glow-primary: rgba(255, 0, 110, 0.8);
    --neon-glow-secondary: rgba(0, 245, 255, 0.8);
    
    background: var(--neon-background);
    color: var(--neon-text);
}

/* Admin bar with neon glow */
.mase-template-neoncity #wpadminbar {
    background: linear-gradient(90deg, 
        var(--neon-primary) 0%, 
        var(--neon-secondary) 100%
    );
    box-shadow: 
        0 2px calc(10px * var(--mase-glow-intensity)) var(--neon-glow-primary),
        0 4px calc(20px * var(--mase-glow-intensity)) var(--neon-glow-secondary);
}

/* Neon sign effect on menu items */
.mase-template-neoncity #adminmenu li.menu-top {
    position: relative;
    transition: all calc(0.3s / var(--mase-intensity-multiplier));
}

.mase-template-neoncity #adminmenu li.menu-top:hover {
    background: transparent;
    color: var(--neon-primary);
    text-shadow: 
        0 0 calc(5px * var(--mase-glow-intensity)) var(--neon-glow-primary),
        0 0 calc(10px * var(--mase-glow-intensity)) var(--neon-glow-primary);
}

/* Flickering neon animation */
@keyframes neon-flicker {
    0%, 100% { opacity: 1; }
    2% { opacity: 0.8; }
    4% { opacity: 1; }
    8% { opacity: 0.9; }
    10% { opacity: 1; }
}

.mase-template-neoncity .button-primary {
    background: var(--neon-primary);
    border: 2px solid var(--neon-primary);
    box-shadow: 
        0 0 calc(10px * var(--mase-glow-intensity)) var(--neon-glow-primary),
        inset 0 0 calc(5px * var(--mase-glow-intensity)) var(--neon-glow-primary);
    animation: neon-flicker var(--mase-animation-speed) infinite;
}

/* Variants */
.mase-template-neoncity[data-variant="pink"] {
    --neon-primary: #ff006e;
    --neon-glow-primary: rgba(255, 0, 110, 0.8);
}

.mase-template-neoncity[data-variant="cyan"] {
    --neon-primary: #00f5ff;
    --neon-glow-primary: rgba(0, 245, 255, 0.8);
}

.mase-template-neoncity[data-variant="yellow"] {
    --neon-primary: #ffbe0b;
    --neon-glow-primary: rgba(255, 190, 11, 0.8);
}

/* Performance mode */
:root[data-performance-mode="true"] .mase-template-neoncity .button-primary {
    animation: none;
    box-shadow: none;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .mase-template-neoncity * {
        animation: none !important;
        transition: none !important;
    }
}
```

---

## Best Practices

1. **Always use CSS custom properties** for values that might change
2. **Respect intensity settings** by using `--mase-intensity-multiplier`
3. **Provide Performance Mode fallbacks** for expensive effects
4. **Support reduced motion** with `@media (prefers-reduced-motion)`
5. **Test on mobile devices** and provide simplified effects
6. **Maintain accessibility** with proper contrast ratios
7. **Use GPU acceleration** with `transform: translateZ(0)`
8. **Lazy load effects** with Intersection Observer
9. **Debounce/throttle** scroll and resize handlers
10. **Document your code** with clear comments

---

## Resources

- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Web Animations API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Intersection Observer (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)

---

**Version**: 2.0.0  
**Last Updated**: 2025-10-30
