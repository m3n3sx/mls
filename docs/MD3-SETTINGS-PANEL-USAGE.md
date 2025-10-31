# Material Design 3 Settings Panel Usage Guide

## Overview

The MD3 Settings Panel Redesign (Task 17) provides a modern, organized interface for settings with:
- Outlined cards for setting groups (elevation-1)
- Collapsible sections with smooth animations
- Clear visual hierarchy with section dividers
- Descriptive helper text styling
- Success feedback animations

## Requirements Implemented

- **24.1**: Organized settings into clear sections with dividers
- **24.2**: Outlined cards for setting groups with elevation-1
- **24.3**: Collapsible sections with smooth animations and state persistence
- **24.4**: Descriptive helper text in on-surface-variant color
- **24.5**: Success animations and snackbar notifications

## Basic Usage

### Standard Section Card

```php
<div class="mase-section">
	<div class="mase-section-card">
		<h2><?php esc_html_e( 'Section Title', 'modern-admin-styler' ); ?></h2>
		<p class="description"><?php esc_html_e( 'Section description text.', 'modern-admin-styler' ); ?></p>
		
		<div class="mase-settings-group">
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="setting-id">
						<?php esc_html_e( 'Setting Label', 'modern-admin-styler' ); ?>
					</label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="setting-id" name="setting_name" value="" />
					<p class="description"><?php esc_html_e( 'Helper text for this setting.', 'modern-admin-styler' ); ?></p>
				</div>
			</div>
		</div>
	</div>
</div>
```

### Collapsible Section

```php
<div class="mase-section-collapsible" id="advanced-settings" data-section-id="advanced-settings">
	<button type="button" class="mase-section-collapsible-header" aria-expanded="false">
		<div class="mase-section-collapsible-title">
			<span class="dashicons dashicons-admin-tools"></span>
			<h3><?php esc_html_e( 'Advanced Settings', 'modern-admin-styler' ); ?></h3>
		</div>
		<span class="dashicons dashicons-arrow-down-alt2 mase-section-collapsible-icon"></span>
	</button>
	
	<div class="mase-section-collapsible-content">
		<div class="mase-section-collapsible-body">
			<div class="mase-settings-group">
				<!-- Settings rows here -->
			</div>
		</div>
	</div>
</div>
```

### Section Divider

```php
<!-- Simple divider -->
<hr class="mase-section-divider" />

<!-- Divider with label -->
<div class="mase-section-divider-label">
	<span><?php esc_html_e( 'Advanced Options', 'modern-admin-styler' ); ?></span>
</div>
```

### Conditional Groups

```php
<div class="mase-setting-row">
	<div class="mase-setting-label">
		<label for="enable-feature">
			<?php esc_html_e( 'Enable Feature', 'modern-admin-styler' ); ?>
		</label>
	</div>
	<div class="mase-setting-control">
		<input type="checkbox" id="enable-feature" name="enable_feature" value="1" />
	</div>
</div>

<!-- This group only shows when checkbox is checked -->
<div class="mase-conditional-group" data-depends-on="enable-feature">
	<div class="mase-setting-row">
		<div class="mase-setting-label">
			<label for="feature-option">
				<?php esc_html_e( 'Feature Option', 'modern-admin-styler' ); ?>
			</label>
		</div>
		<div class="mase-setting-control">
			<input type="text" id="feature-option" name="feature_option" value="" />
		</div>
	</div>
</div>
```

## JavaScript API

### Show Save Success Feedback

```javascript
// Global save success (bottom-right corner)
jQuery(document).trigger('mase:settings:saved', {
	message: 'Settings saved successfully!'
});

// Section-specific save indicator
MaseSettingsPanel.showSectionSaveIndicator(
	jQuery('#my-section'),
	'Saved'
);
```

### Manually Toggle Section

```javascript
// Expand a section
const $section = jQuery('#advanced-settings');
MaseSettingsPanel.toggleSection($section);
```

### Get Expanded Sections

```javascript
// Get array of expanded section IDs
const expanded = MaseSettingsPanel.getExpandedSections();
console.log(expanded); // ['advanced-settings', 'expert-options']
```

## State Persistence

Collapsible section states are automatically saved to `localStorage` with the key `mase_expanded_sections`. Each section must have:
- An `id` attribute OR
- A `data-section-id` attribute

Example:
```php
<div class="mase-section-collapsible" id="my-section">
	<!-- Section content -->
</div>
```

The section's expanded/collapsed state will persist across page reloads.

## Styling Customization

### Custom Section Colors

```css
/* Custom primary color for a specific section */
.my-custom-section .mase-section-card {
	border-color: var(--md-primary);
}

.my-custom-section h2 {
	color: var(--md-primary);
}
```

### Custom Collapsible Icon

```php
<!-- Use a different icon -->
<span class="dashicons dashicons-plus-alt2 mase-section-collapsible-icon"></span>
```

## Accessibility Features

- **Keyboard Navigation**: All collapsible headers are keyboard accessible (Enter/Space to toggle)
- **ARIA Attributes**: Proper `aria-expanded` states on collapsible headers
- **Focus Indicators**: 3px primary color outline on focus
- **Reduced Motion**: Respects `prefers-reduced-motion` preference
- **High Contrast**: Enhanced borders in high contrast mode

## Responsive Behavior

On mobile (< 768px):
- Setting rows stack vertically (single column)
- Reduced padding for better space utilization
- Touch-friendly tap targets

## Dark Mode Support

All components automatically adapt to dark mode when `data-theme="dark"` is set on the root element:
- Surface colors adjust to dark palette
- Border colors use dark mode variants
- Text colors maintain proper contrast ratios

## Examples in Current Codebase

See `includes/admin-settings-page.php` for existing implementations:
- Admin Bar section (lines 200-400)
- Menu section (lines 600-800)
- Content section (lines 1000-1200)

## Best Practices

1. **Always provide helper text** for complex settings
2. **Use collapsible sections** for advanced/rarely-used options
3. **Group related settings** in the same section card
4. **Add section dividers** between major setting categories
5. **Provide save feedback** after successful operations
6. **Use conditional groups** to hide irrelevant options
7. **Test keyboard navigation** for all interactive elements
8. **Verify dark mode appearance** for all custom sections

## Performance Considerations

- Collapsible sections use CSS `max-height` transitions (GPU-accelerated)
- State persistence uses `localStorage` (minimal overhead)
- Conditional groups use CSS `display` (no layout thrashing)
- Save feedback uses CSS transforms (60fps animations)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All features gracefully degrade in older browsers.
