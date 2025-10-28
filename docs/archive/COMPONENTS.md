# Component Documentation

## Overview

This document provides comprehensive documentation for all UI components in the Modern Admin Styler Enterprise (MASE) CSS framework. Each component includes usage examples, HTML structure, variants, states, and accessibility considerations.

---

## Table of Contents

1. [Header Component](#header-component)
2. [Tab Navigation](#tab-navigation)
3. [Card Component](#card-component)
4. [Toggle Switch](#toggle-switch)
5. [Slider Component](#slider-component)
6. [Color Picker](#color-picker)
7. [Text Input & Select](#text-input--select)
8. [Button Component](#button-component)
9. [Badge Component](#badge-component)
10. [Notice Component](#notice-component)

---

## Header Component

### Purpose
Top section containing plugin branding, version badge, and primary actions including the Live Preview toggle.

### HTML Structure
```html
<div class="mase-header">
  <div class="mase-header-left">
    <h1 class="mase-header-title">Ultimate WordPress Admin Styler</h1>
    <span class="mase-header-badge">v2.0.0</span>
  </div>
  <div class="mase-header-right">
    <div class="mase-live-preview-toggle">
      <label class="mase-toggle">
        <input type="checkbox" class="mase-toggle-input" />
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

### CSS Classes
- `.mase-header` - Main header container
- `.mase-header-left` - Left section (title and badge)
- `.mase-header-right` - Right section (actions and toggle)
- `.mase-header-title` - Plugin title
- `.mase-header-badge` - Version badge
- `.mase-live-preview-toggle` - Live preview toggle container

### Variants
None - Single standard layout

### States
- **Default** - Normal display
- **Sticky** - Remains visible during scroll (position: sticky)

### Accessibility
- Semantic HTML with proper heading hierarchy
- All buttons have clear labels
- Keyboard navigable

### Requirements
Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7

---

## Tab Navigation

### Purpose
Organize settings into 8 distinct sections with clear visual navigation. Supports both horizontal (top) and sidebar (left) layouts.

### HTML Structure

**Horizontal Layout:**
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
  <button class="mase-tab" data-tab="menu">
    <span class="mase-tab-icon">📋</span>
    <span class="mase-tab-label">Menu</span>
  </button>
  <!-- 5 more tabs -->
</nav>
```

**Sidebar Layout:**
```html
<nav class="mase-tabs mase-tabs-sidebar">
  <!-- Same tab structure as above -->
</nav>
```

### CSS Classes
- `.mase-tabs` - Tab navigation container
- `.mase-tabs-sidebar` - Modifier for sidebar layout
- `.mase-tab` - Individual tab button
- `.mase-tab-active` or `.active` - Active tab state
- `.mase-tab-icon` - Icon within tab
- `.mase-tab-label` - Text label within tab
- `.mase-disabled` - Disabled tab state

### Variants
1. **Horizontal Tabs** (default) - Top navigation with horizontal layout
2. **Sidebar Tabs** - Left sidebar with vertical layout (add `.mase-tabs-sidebar`)

### States
- **Default** - Inactive tab with transparent background
- **Hover** - Light gray background, subtle lift effect
- **Active** - Primary blue background, white text
- **Focus** - 2px outline for keyboard navigation
- **Disabled** - Reduced opacity, no interaction

### Accessibility
- Semantic `<nav>` element
- Keyboard navigable with Tab key
- Clear focus indicators (2px outline)
- ARIA labels on icon-only buttons
- Minimum font size 14px for readability

### Usage Example
```javascript
// Activate a tab
document.querySelector('[data-tab="admin-bar"]').classList.add('mase-tab-active');

// Remove active state from all tabs
document.querySelectorAll('.mase-tab').forEach(tab => {
  tab.classList.remove('mase-tab-active');
});
```

### Requirements
Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7

---

## Card Component

### Purpose
Container for grouped content with elevation, providing visual separation and hierarchy.

### HTML Structure
```html
<div class="mase-card">
  <div class="mase-card-body">
    <h3>Card Title</h3>
    <p>Card content goes here...</p>
    <!-- Form controls, content, etc. -->
  </div>
</div>
```

**Interactive Card:**
```html
<div class="mase-card mase-card-interactive">
  <div class="mase-card-body">
    <!-- Content -->
  </div>
</div>
```

### CSS Classes
- `.mase-card` - Card container
- `.mase-card-body` - Inner content container
- `.mase-card-interactive` - Modifier for clickable cards

### Variants
1. **Standard Card** - Default card with base shadow
2. **Interactive Card** - Clickable card with hover effects (add `.mase-card-interactive`)

### States
- **Default** - White background, base shadow
- **Hover** (interactive only) - Increased shadow, subtle lift

### Accessibility
- Semantic HTML structure
- If interactive, use `<button>` or `<a>` wrapper
- Ensure sufficient color contrast

### Usage Example
```html
<!-- Standard content card -->
<div class="mase-card">
  <div class="mase-card-body">
    <h3 class="mase-section-title">General Settings</h3>
    <div class="mase-toggle-wrapper">
      <label class="mase-toggle">
        <input type="checkbox" class="mase-toggle-input" />
        <span class="mase-toggle-slider"></span>
      </label>
      <span class="mase-toggle-label">Enable Feature</span>
    </div>
  </div>
</div>

<!-- Interactive card (clickable) -->
<button class="mase-card mase-card-interactive">
  <div class="mase-card-body">
    <h3>Theme Option</h3>
    <p>Click to select this theme</p>
  </div>
</button>
```

### Requirements
Requirements: 3.1, 3.2, 3.7

---

## Toggle Switch

### Purpose
iOS-style toggle switch for binary on/off controls with smooth animations and clear visual feedback.

### HTML Structure
```html
<!-- Basic toggle -->
<label class="mase-toggle">
  <input type="checkbox" class="mase-toggle-input" />
  <span class="mase-toggle-slider"></span>
</label>

<!-- Toggle with label -->
<div class="mase-toggle-wrapper">
  <label class="mase-toggle">
    <input type="checkbox" class="mase-toggle-input" id="feature-toggle" />
    <span class="mase-toggle-slider"></span>
  </label>
  <label for="feature-toggle" class="mase-toggle-label">Enable Feature</label>
</div>

<!-- Disabled toggle -->
<label class="mase-toggle">
  <input type="checkbox" class="mase-toggle-input" disabled />
  <span class="mase-toggle-slider"></span>
</label>
```

### CSS Classes
- `.mase-toggle` - Toggle container (label element)
- `.mase-toggle-input` - Hidden checkbox input
- `.mase-toggle-slider` - Visible toggle background and knob
- `.mase-toggle-wrapper` - Container for toggle + label
- `.mase-toggle-label` - Text label accompanying toggle

### Dimensions
- Container: 44px × 24px (iOS standard)
- Knob: 20px diameter
- Border radius: Fully rounded (pill shape)

### Variants
None - Single standard design

### States
- **Off** - Gray background (#d1d5db), knob at left
- **On** - Primary blue background (#0073aa), knob at right
- **Hover** - Increased shadow
- **Focus** - 2px outline, focus shadow
- **Disabled** - 50% opacity, no interaction

### Accessibility
- Uses native checkbox for semantic HTML
- Keyboard accessible (Space to toggle)
- Clear focus indicators
- Screen reader compatible
- Maintains ARIA states automatically

### Usage Example
```javascript
// Get toggle state
const toggle = document.querySelector('.mase-toggle-input');
const isEnabled = toggle.checked;

// Set toggle state
toggle.checked = true; // Enable
toggle.checked = false; // Disable

// Listen for changes
toggle.addEventListener('change', (e) => {
  if (e.target.checked) {
    console.log('Toggle enabled');
  } else {
    console.log('Toggle disabled');
  }
});
```

### Animation Details
- Transition duration: 200ms
- Timing function: ease
- Animated properties: background-color, transform
- Knob translates 20px when toggled

### Requirements
Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7

---

## Slider Component

### Purpose
Material Design-style range slider with visual feedback and value display bubble.

### HTML Structure
```html
<div class="mase-slider-container">
  <input 
    type="range" 
    class="mase-slider" 
    min="0" 
    max="100" 
    value="50"
    id="opacity-slider"
  />
  <div class="mase-slider-value">50</div>
</div>
```

**With Label:**
```html
<div class="mase-form-group">
  <label for="opacity-slider">Opacity</label>
  <div class="mase-slider-container">
    <input 
      type="range" 
      class="mase-slider" 
      min="0" 
      max="100" 
      value="50"
      id="opacity-slider"
    />
    <div class="mase-slider-value">50</div>
  </div>
</div>
```

### CSS Classes
- `.mase-slider-container` - Wrapper container
- `.mase-slider` - Range input element
- `.mase-slider-value` - Value display bubble

### Dimensions
- Track height: 6px
- Thumb diameter: 16px (default), 20px (hover/active)
- Value bubble: 32px min-width × 24px height

### Variants
None - Single standard design

### States
- **Default** - Gray track, primary filled portion, 16px thumb
- **Hover** - 20px thumb, increased shadow
- **Active** - 20px thumb, maximum shadow, slight scale
- **Focus** - 2px outline on thumb
- **Disabled** - Reduced opacity, no interaction

### Accessibility
- Native range input for semantic HTML
- Keyboard accessible (Arrow keys to adjust)
- Clear focus indicators
- Value display for visual feedback
- ARIA attributes supported

### Usage Example
```javascript
// Get slider value
const slider = document.querySelector('.mase-slider');
const value = slider.value;

// Set slider value
slider.value = 75;

// Update value display
const valueDisplay = document.querySelector('.mase-slider-value');
slider.addEventListener('input', (e) => {
  const value = e.target.value;
  valueDisplay.textContent = value;
  
  // Update value bubble position (optional)
  const percent = (value - slider.min) / (slider.max - slider.min);
  const offset = percent * slider.offsetWidth;
  valueDisplay.style.left = `${offset}px`;
});

// Update filled track (for WebKit browsers)
slider.addEventListener('input', (e) => {
  const value = e.target.value;
  const percent = ((value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.setProperty('--slider-value', `${percent}%`);
});
```

### Animation Details
- Transition duration: 200ms
- Timing function: ease
- Animated properties: width, height, box-shadow, transform
- Real-time value updates during drag

### Requirements
Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7

---

## Color Picker

### Purpose
Color selection control with hex value display and native color picker integration.

### HTML Structure
```html
<div class="mase-color-picker">
  <input 
    type="color" 
    class="mase-color-input" 
    value="#0073aa"
    id="primary-color"
  />
  <div class="mase-color-swatch" style="background-color: #0073aa;"></div>
  <input 
    type="text" 
    class="mase-color-hex" 
    value="#0073aa"
    pattern="^#[0-9A-Fa-f]{6}$"
  />
</div>
```

**With Label:**
```html
<div class="mase-form-group">
  <label for="primary-color">Primary Color</label>
  <div class="mase-color-picker">
    <input type="color" class="mase-color-input" value="#0073aa" id="primary-color" />
    <div class="mase-color-swatch" style="background-color: #0073aa;"></div>
    <input type="text" class="mase-color-hex" value="#0073aa" />
  </div>
</div>
```

### CSS Classes
- `.mase-color-picker` - Container for color picker elements
- `.mase-color-input` - Hidden native color input
- `.mase-color-swatch` - Visible color preview
- `.mase-color-hex` - Hex value text input

### Dimensions
- Swatch: 40px × 40px
- Hex input: 100px width
- Border radius: 4px

### Variants
None - Single standard design

### States
- **Default** - Swatch shows current color, hex input displays value
- **Hover** - Increased shadow on swatch
- **Focus** - Outline on hex input
- **Invalid** - Error styling on hex input for invalid format

### Accessibility
- Native color input for browser color picker
- Text input allows manual hex entry
- Keyboard accessible
- Clear focus indicators
- Validation feedback

### Usage Example
```javascript
// Get color picker elements
const colorInput = document.querySelector('.mase-color-input');
const colorSwatch = document.querySelector('.mase-color-swatch');
const hexInput = document.querySelector('.mase-color-hex');

// Sync color input with swatch and hex
colorInput.addEventListener('input', (e) => {
  const color = e.target.value;
  colorSwatch.style.backgroundColor = color;
  hexInput.value = color;
});

// Sync hex input with color input and swatch
hexInput.addEventListener('input', (e) => {
  const hex = e.target.value;
  
  // Validate hex format
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    colorInput.value = hex;
    colorSwatch.style.backgroundColor = hex;
    hexInput.classList.remove('mase-error');
  } else {
    hexInput.classList.add('mase-error');
  }
});

// Click swatch to open color picker
colorSwatch.addEventListener('click', () => {
  colorInput.click();
});
```

### Validation
```javascript
// Hex color validation function
function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

// Normalize hex format
function normalizeHex(hex) {
  hex = hex.trim();
  if (!hex.startsWith('#')) {
    hex = '#' + hex;
  }
  return hex.toUpperCase();
}
```

### Requirements
Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7

---

## Text Input & Select

### Purpose
Standard form inputs with consistent styling for text entry and dropdown selection.

### HTML Structure

**Text Input:**
```html
<div class="mase-form-group">
  <label for="site-title">Site Title</label>
  <input 
    type="text" 
    class="mase-input" 
    id="site-title"
    placeholder="Enter site title"
  />
</div>
```

**Select Dropdown:**
```html
<div class="mase-form-group">
  <label for="theme-select">Select Theme</label>
  <select class="mase-select" id="theme-select">
    <option value="">Choose a theme...</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
    <option value="auto">Auto</option>
  </select>
</div>
```

**Input with Error:**
```html
<div class="mase-form-group">
  <label for="email">Email Address</label>
  <input 
    type="email" 
    class="mase-input mase-error" 
    id="email"
    value="invalid-email"
  />
  <span class="mase-helper-text mase-error">Please enter a valid email address</span>
</div>
```

**Disabled Input:**
```html
<input type="text" class="mase-input" disabled value="Disabled input" />
```

### CSS Classes
- `.mase-input` - Text input field
- `.mase-select` - Select dropdown
- `.mase-form-group` - Container for label + input
- `.mase-helper-text` - Helper/error text below input
- `.mase-error` - Error state modifier
- `.mase-disabled` - Disabled state modifier

### Dimensions
- Height: 40px
- Padding: 8px 16px
- Border radius: 4px
- Font size: 14px

### Variants
1. **Text Input** - Standard text entry
2. **Select Dropdown** - Dropdown selection
3. **Textarea** - Multi-line text (uses same `.mase-input` class)

### States
- **Default** - White background, gray border
- **Hover** - Darker border color
- **Focus** - Primary border, focus shadow
- **Error** - Red border, light red background
- **Disabled** - Gray background, no interaction

### Accessibility
- Semantic HTML with proper labels
- Keyboard accessible
- Clear focus indicators
- Error messages associated with inputs
- Placeholder text for guidance

### Usage Example
```javascript
// Validate input
const input = document.querySelector('.mase-input');
const helperText = document.querySelector('.mase-helper-text');

input.addEventListener('blur', (e) => {
  if (!e.target.value) {
    input.classList.add('mase-error');
    helperText.textContent = 'This field is required';
    helperText.classList.add('mase-error');
  } else {
    input.classList.remove('mase-error');
    helperText.classList.remove('mase-error');
  }
});

// Select change handler
const select = document.querySelector('.mase-select');
select.addEventListener('change', (e) => {
  console.log('Selected:', e.target.value);
});
```

### Requirements
Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7

---

## Button Component

### Purpose
Clickable actions with clear visual hierarchy for primary and secondary operations.

### HTML Structure

**Primary Button:**
```html
<button class="mase-btn mase-btn-primary">
  Save Changes
</button>
```

**Secondary Button:**
```html
<button class="mase-btn mase-btn-secondary">
  Cancel
</button>
```

**Button with Icon:**
```html
<button class="mase-btn mase-btn-primary">
  <span class="mase-btn-icon">💾</span>
  <span class="mase-btn-text">Save</span>
</button>
```

**Loading Button:**
```html
<button class="mase-btn mase-btn-primary mase-loading" disabled>
  <span class="mase-spinner"></span>
  <span class="mase-btn-text">Saving...</span>
</button>
```

**Disabled Button:**
```html
<button class="mase-btn mase-btn-primary" disabled>
  Disabled
</button>
```

### CSS Classes
- `.mase-btn` - Base button class
- `.mase-btn-primary` - Primary button variant (blue)
- `.mase-btn-secondary` - Secondary button variant (outlined)
- `.mase-btn-icon` - Icon within button
- `.mase-btn-text` - Text within button
- `.mase-loading` - Loading state modifier
- `.mase-spinner` - Loading spinner element

### Dimensions
- Height: 36px
- Padding: 8px 16px
- Border radius: 4px
- Font size: 14px
- Font weight: 500

### Variants
1. **Primary Button** - Solid blue background, white text
2. **Secondary Button** - White background, blue border and text

### States
- **Default** - Standard appearance
- **Hover** - Darker background (primary) or light blue background (secondary), subtle lift
- **Active** - Pressed state, no lift
- **Focus** - 2px outline for keyboard navigation
- **Loading** - Spinner icon, disabled interaction
- **Disabled** - 50% opacity, no interaction

### Accessibility
- Semantic `<button>` element
- Keyboard accessible (Enter/Space to activate)
- Clear focus indicators
- Disabled state prevents interaction
- Loading state communicated to screen readers

### Usage Example
```javascript
// Show loading state
const button = document.querySelector('.mase-btn-primary');
button.classList.add('mase-loading');
button.disabled = true;
button.innerHTML = '<span class="mase-spinner"></span> Saving...';

// Remove loading state
setTimeout(() => {
  button.classList.remove('mase-loading');
  button.disabled = false;
  button.textContent = 'Save Changes';
}, 2000);

// Button click handler
button.addEventListener('click', async () => {
  button.classList.add('mase-loading');
  button.disabled = true;
  
  try {
    await saveSettings();
    showSuccessNotice('Settings saved!');
  } catch (error) {
    showErrorNotice('Failed to save settings');
  } finally {
    button.classList.remove('mase-loading');
    button.disabled = false;
  }
});
```

### Animation Details
- Transition duration: 200ms
- Timing function: ease
- Animated properties: background-color, transform, box-shadow
- Hover lift: translateY(-1px)

### Requirements
Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7

---

## Badge Component

### Purpose
Small status or version indicators for labels and metadata.

### HTML Structure

**Primary Badge:**
```html
<span class="mase-badge">v2.0.0</span>
```

**Success Badge:**
```html
<span class="mase-badge mase-badge-success">Active</span>
```

**Warning Badge:**
```html
<span class="mase-badge mase-badge-warning">Beta</span>
```

**Error Badge:**
```html
<span class="mase-badge mase-badge-error">Deprecated</span>
```

### CSS Classes
- `.mase-badge` - Base badge class (primary blue)
- `.mase-badge-success` - Success variant (green)
- `.mase-badge-warning` - Warning variant (yellow)
- `.mase-badge-error` - Error variant (red)

### Dimensions
- Padding: 4px 8px
- Border radius: 4px
- Font size: 12px
- Font weight: 600
- Line height: 1

### Variants
1. **Primary Badge** - Blue background, white text
2. **Success Badge** - Green background, white text
3. **Warning Badge** - Yellow background, dark text
4. **Error Badge** - Red background, white text

### States
None - Badges are static indicators

### Accessibility
- Semantic HTML (typically `<span>`)
- Sufficient color contrast
- Text content is screen reader accessible

### Usage Example
```html
<!-- Version badge in header -->
<h1 class="mase-header-title">
  Ultimate WordPress Admin Styler
  <span class="mase-badge">v2.0.0</span>
</h1>

<!-- Status badges -->
<div class="feature-list">
  <div class="feature-item">
    <span class="feature-name">Live Preview</span>
    <span class="mase-badge mase-badge-success">Active</span>
  </div>
  <div class="feature-item">
    <span class="feature-name">Dark Mode</span>
    <span class="mase-badge mase-badge-warning">Beta</span>
  </div>
  <div class="feature-item">
    <span class="feature-name">Old Feature</span>
    <span class="mase-badge mase-badge-error">Deprecated</span>
  </div>
</div>
```

### Requirements
Requirements: 1.2, 12.1

---

## Notice Component

### Purpose
Feedback messages for user actions with different severity levels.

### HTML Structure

**Success Notice:**
```html
<div class="mase-notice mase-notice-success">
  <span class="mase-notice-icon">✓</span>
  <span class="mase-notice-message">Settings saved successfully!</span>
  <button class="mase-notice-dismiss" aria-label="Dismiss">×</button>
</div>
```

**Warning Notice:**
```html
<div class="mase-notice mase-notice-warning">
  <span class="mase-notice-icon">⚠</span>
  <span class="mase-notice-message">Some settings require page reload.</span>
  <button class="mase-notice-dismiss" aria-label="Dismiss">×</button>
</div>
```

**Error Notice:**
```html
<div class="mase-notice mase-notice-error">
  <span class="mase-notice-icon">✕</span>
  <span class="mase-notice-message">Failed to save settings. Please try again.</span>
  <button class="mase-notice-dismiss" aria-label="Dismiss">×</button>
</div>
```

**Info Notice:**
```html
<div class="mase-notice mase-notice-info">
  <span class="mase-notice-icon">ℹ</span>
  <span class="mase-notice-message">Changes will take effect immediately.</span>
  <button class="mase-notice-dismiss" aria-label="Dismiss">×</button>
</div>
```

### CSS Classes
- `.mase-notice` - Base notice container
- `.mase-notice-success` - Success variant (green)
- `.mase-notice-warning` - Warning variant (yellow)
- `.mase-notice-error` - Error variant (red)
- `.mase-notice-info` - Info variant (blue)
- `.mase-notice-icon` - Icon element
- `.mase-notice-message` - Message text
- `.mase-notice-dismiss` - Dismiss button

### Dimensions
- Padding: 16px
- Border radius: 4px
- Border-left: 4px solid (color varies by type)
- Gap: 8px between elements

### Variants
1. **Success Notice** - Green theme for positive feedback
2. **Warning Notice** - Yellow theme for caution messages
3. **Error Notice** - Red theme for errors
4. **Info Notice** - Blue theme for informational messages

### States
- **Visible** - Displayed on screen
- **Hidden** - Removed from DOM or hidden with CSS

### Accessibility
- Semantic HTML structure
- ARIA labels on dismiss button
- Sufficient color contrast
- Screen reader announcements via ARIA live regions
- Keyboard accessible dismiss button

### Usage Example
```javascript
// Show success notice
function showSuccessNotice(message) {
  const notice = document.createElement('div');
  notice.className = 'mase-notice mase-notice-success';
  notice.innerHTML = `
    <span class="mase-notice-icon">✓</span>
    <span class="mase-notice-message">${message}</span>
    <button class="mase-notice-dismiss" aria-label="Dismiss">×</button>
  `;
  
  document.body.appendChild(notice);
  
  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    notice.remove();
  }, 3000);
  
  // Manual dismiss
  notice.querySelector('.mase-notice-dismiss').addEventListener('click', () => {
    notice.remove();
  });
}

// Show error notice
function showErrorNotice(message) {
  const notice = document.createElement('div');
  notice.className = 'mase-notice mase-notice-error';
  notice.setAttribute('role', 'alert'); // ARIA live region
  notice.innerHTML = `
    <span class="mase-notice-icon">✕</span>
    <span class="mase-notice-message">${message}</span>
    <button class="mase-notice-dismiss" aria-label="Dismiss">×</button>
  `;
  
  document.body.appendChild(notice);
  
  notice.querySelector('.mase-notice-dismiss').addEventListener('click', () => {
    notice.remove();
  });
}

// Usage
showSuccessNotice('Settings saved successfully!');
showErrorNotice('Failed to save settings. Please try again.');
```

### Animation (Optional)
```css
/* Slide-in animation */
@keyframes slideIn {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.mase-notice {
  animation: slideIn 300ms ease;
}
```

### Requirements
Requirements: 13.1, 13.2, 13.3, 13.4, 13.5

---

## Related Documentation

- [CSS Variables](./CSS-VARIABLES.md) - Design tokens and variables
- [Responsive Design](./RESPONSIVE.md) - Breakpoint strategy and mobile behavior
- [Design System](../woow-admin/.kiro/specs/complete-css-redesign/design.md) - Complete design system

---

## Best Practices

1. **Use semantic HTML** - Always use appropriate HTML elements (`<button>`, `<input>`, `<label>`, etc.)
2. **Provide labels** - All form controls should have associated labels
3. **Include ARIA attributes** - Add ARIA labels, roles, and states where needed
4. **Test keyboard navigation** - Ensure all components are keyboard accessible
5. **Verify color contrast** - Use tools to check WCAG AA compliance
6. **Handle loading states** - Provide visual feedback during async operations
7. **Show validation errors** - Display clear error messages for invalid inputs
8. **Support disabled states** - Properly style and handle disabled components
9. **Use consistent spacing** - Apply design system spacing values
10. **Test across browsers** - Verify components work in all supported browsers

---

## Changelog

### Version 2.0.0
- Initial comprehensive component documentation
- Added all components with usage examples
- Included HTML structure and CSS classes
- Added accessibility guidelines
- Included JavaScript usage examples
