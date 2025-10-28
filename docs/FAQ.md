# Modern Admin Styler Enterprise (MASE) v1.2.0 - FAQ

## General Questions

### What is MASE?

Modern Admin Styler Enterprise (MASE) is a WordPress plugin that transforms your admin interface with modern design patterns, professional color schemes, and powerful customization options. It provides 10 color palettes, 11 templates, visual effects, and enterprise features like backup/restore and import/export.

### What's new in v1.2.0?

Version 1.2.0 is a major upgrade that includes:
- 10 professional color palettes
- 11 complete design templates
- Advanced visual effects (glassmorphism, floating elements, shadows)
- Enhanced typography controls
- Mobile optimization
- Accessibility improvements
- Auto palette switching
- Backup/restore system
- Import/export functionality
- Keyboard shortcuts

### Is MASE compatible with my WordPress version?

MASE requires WordPress 5.8 or higher and PHP 7.4 or higher. It's tested up to WordPress 6.8.

### Will MASE slow down my site?

No. MASE is highly optimized with:
- CSS generation under 100ms
- 24-hour caching
- Lazy loading of assets
- Mobile optimization
- Performance mode for slower devices

The plugin only loads on admin pages and has minimal impact on frontend performance.

---

## Installation & Setup

### How do I install MASE?

1. Upload the plugin folder to `/wp-content/plugins/`
2. Activate through the 'Plugins' menu in WordPress
3. Navigate to 'Modern Admin Styler' in the admin menu
4. Choose a palette or template to get started

### Can I use MASE on multisite?

Yes! MASE is fully compatible with WordPress multisite. Settings are stored per-site, not network-wide, so each site can have its own customization.

### How do I upgrade from v1.1.0?

Simply update the plugin through WordPress. MASE will automatically:
- Detect the old version
- Create a backup of your v1.1.0 settings
- Migrate settings to the new structure
- Preserve all your customizations

### What happens to my settings if I deactivate the plugin?

Your settings are preserved in the WordPress database. When you reactivate MASE, all your customizations will be restored.

### How do I completely remove MASE?

1. Deactivate the plugin
2. Delete the plugin through WordPress
3. (Optional) Manually delete the `mase_settings` option from the database if you want to remove all data

---

## Palettes & Templates

### How many palettes are included?

MASE includes 10 professionally designed color palettes:
1. Professional Blue
2. Energetic Green
3. Creative Purple
4. Warm Sunset
5. Ocean Blue
6. Forest Green
7. Royal Purple
8. Monochrome
9. Dark Elegance
10. Vibrant Coral

### Can I create my own palette?

Yes! You can:
1. Adjust colors in the Admin Bar and Menu tabs
2. Click "Save as Custom Palette"
3. Give it a name
4. Your custom palette appears in the palette grid

### How many templates are included?

MASE includes 11 complete templates:
1. Default
2. Modern Minimal
3. Corporate Professional
4. Creative Studio
5. Dark Mode Pro
6. Eco Friendly
7. Luxury Premium
8. Energetic Startup
9. Warm & Welcoming
10. Tech Forward
11. Bold & Vibrant

### What's the difference between a palette and a template?

- **Palette**: Only changes colors (6 colors: primary, secondary, accent, background, text, text secondary)
- **Template**: Changes everything (colors, typography, visual effects, spacing, animations)

### Can I modify a template after applying it?

Yes! Templates are just starting points. After applying a template, you can customize any setting. You can also save your modifications as a new custom template.

### Can I delete custom palettes and templates?

Yes. Custom palettes and templates have a delete button. Built-in palettes and templates cannot be deleted.

---

## Visual Effects

### What is glassmorphism?

Glassmorphism is a modern design trend that creates a frosted glass effect using backdrop blur. It makes elements semi-transparent with a blurred background, creating depth and visual interest.

### Why doesn't glassmorphism work in my browser?

Backdrop blur (used for glassmorphism) is not supported in Firefox versions before 103. MASE provides a fallback with a semi-transparent background without blur.

### What is the floating effect?

The floating effect adds top margin to elements (like the admin bar) to create visual separation from the page edge. Combined with border radius and shadows, it creates a modern floating appearance.

### How do I disable all effects for better performance?

1. Enable **Performance Mode** in the Effects tab
2. Or use the keyboard shortcut: Ctrl+Shift+P
3. Performance mode disables expensive effects while keeping basic styling

### Can I use different effects on mobile vs desktop?

Yes! MASE automatically optimizes effects for mobile devices. You can also enable "Reduced Effects" in the Mobile settings to further reduce effects on mobile.

---

## Typography

### Can I use Google Fonts?

Yes! In the Typography tab:
1. Enable Google Fonts
2. Enter the font family (e.g., "Inter:300,400,500,600,700")
3. The font loads from Google Fonts CDN
4. Apply to Admin Bar, Menu, or Content areas

### What fonts are available by default?

MASE uses system fonts by default for best performance:
- macOS: San Francisco
- Windows: Segoe UI
- Linux: Ubuntu
- Fallback: Arial, sans-serif

### Can I use different fonts for different areas?

Yes! You can set different fonts for:
- Admin Bar
- Admin Menu
- Content Area

Each area has independent typography controls.

### Why isn't my custom font showing?

Check that:
1. Google Fonts is enabled in Typography tab
2. Font name is spelled correctly
3. Font weights are specified (e.g., "Inter:400,700")
4. Your browser has internet access to load from Google Fonts CDN

---

## Live Preview

### What is Live Preview?

Live Preview lets you see changes in real-time as you adjust settings, without saving. It's perfect for experimenting with different looks.

### How do I enable Live Preview?

Click the "Live Preview" toggle button in the header. When enabled, changes apply instantly as you adjust controls.

### Do Live Preview changes persist?

No. Live Preview changes are temporary. You must click "Save Settings" to make them permanent.

### Why is Live Preview slow?

Live Preview updates are debounced (delayed by 300ms) to prevent performance issues. If it's still slow:
1. Disable expensive effects temporarily
2. Use a faster device
3. Close other browser tabs
4. Disable browser extensions

---

## Import/Export

### How do I export my settings?

1. Click the "Export" button in the header or Advanced tab
2. A JSON file downloads automatically
3. Filename format: `mase-settings-YYYYMMDD.json`

### How do I import settings?

1. Click "Import" in the Advanced tab
2. Select a `.json` file from your computer
3. Settings are validated before import
4. Confirm the import
5. Settings are applied immediately

### Can I share my settings with others?

Yes! Export your settings and share the JSON file. Others can import it on their WordPress sites.

### What happens if I import invalid settings?

MASE validates all imported settings. If the file is invalid or corrupted, the import is rejected with an error message. Your current settings remain unchanged.

### Can I import settings from v1.1.0?

No. v1.1.0 used a different settings structure. However, the automatic migration handles upgrading from v1.1.0 to v1.2.0.

---

## Backup & Restore

### When are backups created automatically?

Automatic backups are created:
- Before applying a template
- Before importing settings
- Before major version upgrades

### How do I create a manual backup?

1. Navigate to the Advanced tab
2. Click "Create Backup"
3. Backup is saved with timestamp

### How many backups are kept?

MASE keeps the 10 most recent backups. Older backups are automatically deleted.

### How do I restore from a backup?

1. View the backup list in the Advanced tab
2. Find the backup you want to restore
3. Click "Restore"
4. Confirm the action
5. Page refreshes with restored settings

### Where are backups stored?

Backups are stored in the WordPress options table. They survive plugin deactivation but are removed if you delete the plugin.

### Can I export backups?

Yes! Backups are just settings snapshots. You can export any backup as a JSON file for external storage.

---

## Keyboard Shortcuts

### What keyboard shortcuts are available?

- **Ctrl+Shift+1-0**: Switch to palette 1-10
- **Ctrl+Shift+T**: Toggle between light and dark themes
- **Ctrl+Shift+F**: Toggle focus mode
- **Ctrl+Shift+P**: Toggle performance mode

### How do I enable/disable keyboard shortcuts?

1. Navigate to the Advanced tab
2. Toggle "Enable Keyboard Shortcuts"
3. Individual shortcuts can be disabled

### Do keyboard shortcuts work on Mac?

Yes! Use Cmd instead of Ctrl:
- **Cmd+Shift+1-0**: Switch palettes
- **Cmd+Shift+T**: Toggle theme
- **Cmd+Shift+F**: Focus mode
- **Cmd+Shift+P**: Performance mode

### Can I customize keyboard shortcuts?

Not in the current version. Custom keyboard shortcuts are planned for a future release.

---

## Mobile & Responsive

### Is MASE mobile-friendly?

Yes! MASE is fully responsive with:
- Mobile-optimized layouts
- Touch-friendly controls (44px minimum)
- Reduced effects on mobile
- Compact mode for smaller screens

### How does mobile optimization work?

MASE automatically detects mobile devices and:
- Increases touch target sizes
- Reduces expensive visual effects
- Adjusts spacing for smaller screens
- Optimizes performance

### Can I disable mobile optimization?

Yes. In the Mobile settings:
1. Disable "Mobile Optimized"
2. This applies desktop settings to mobile devices
3. Not recommended for best user experience

### What is Compact Mode?

Compact Mode reduces padding and spacing by 25% for smaller screens. Enable it in the Mobile settings if you need more space on mobile devices.

---

## Accessibility

### Is MASE accessible?

Yes! MASE is WCAG AA compliant with:
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Reduced motion support
- Focus indicators
- ARIA labels

### How do I enable High Contrast mode?

1. Navigate to the Advanced tab
2. Enable "High Contrast Mode"
3. Color contrast increases to meet WCAG AAA standards (7:1)

### How do I enable Reduced Motion?

1. Navigate to the Advanced tab
2. Enable "Reduced Motion"
3. All animations and transitions are disabled

### Can I navigate MASE with only a keyboard?

Yes! All controls are keyboard accessible:
- **Tab**: Move between controls
- **Enter/Space**: Activate buttons
- **Arrow keys**: Navigate tabs
- **Escape**: Close dialogs

### Does MASE work with screen readers?

Yes! MASE is tested with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)

All controls have proper ARIA labels and roles.

---

## Performance

### How fast is CSS generation?

CSS generation typically takes less than 100ms. This includes:
- Reading settings
- Generating CSS for all components
- Minifying the output
- Caching the result

### How does caching work?

MASE uses a two-level caching system:
1. **Memory cache**: Stores CSS in PHP memory during request
2. **Transient cache**: Stores CSS in database for 24 hours

Cache is automatically invalidated when settings change.

### What is Performance Mode?

Performance Mode disables expensive visual effects:
- Glassmorphism (backdrop blur)
- Shadows
- Animations
- Transitions

This improves performance on slower devices while keeping basic styling.

### How can I improve performance?

1. Enable Performance Mode
2. Reduce blur intensity
3. Disable animations
4. Use simpler shadow presets
5. Disable particle effects and 3D effects

### Does MASE affect frontend performance?

No. MASE only loads on admin pages. It has zero impact on your site's frontend performance.

---

## Troubleshooting

### My changes aren't saving

Check that:
1. You clicked "Save Settings"
2. You have `manage_options` capability
3. JavaScript is enabled in your browser
4. No JavaScript errors in browser console
5. WordPress nonce is valid (refresh page if expired)

### Colors aren't applying

Try:
1. Clear the CSS cache (save settings again)
2. Hard refresh your browser (Ctrl+Shift+R)
3. Check if another plugin is overriding styles
4. Disable browser extensions temporarily

### Glassmorphism isn't working

Glassmorphism requires backdrop-filter support:
- Works in Chrome 76+, Safari 14+, Edge 79+
- Doesn't work in Firefox <103
- MASE provides a fallback for unsupported browsers

### Live Preview isn't updating

Check that:
1. Live Preview toggle is enabled
2. JavaScript is enabled
3. No JavaScript errors in console
4. You're adjusting supported controls

### Import failed

Common reasons:
1. Invalid JSON format
2. Corrupted file
3. Wrong file type (must be .json)
4. File from incompatible version

Try exporting settings again or check file contents.

### Settings reset after update

This shouldn't happen. If it does:
1. Check for backup in Advanced tab
2. Restore from backup
3. Contact support with details

---

## Advanced

### Can I add custom CSS?

Yes! In the Advanced tab:
1. Enter CSS in the Custom CSS textarea
2. CSS is sanitized and appended to generated styles
3. Use `body.wp-admin` prefix for specificity

### Can I add custom JavaScript?

Yes, but use with caution:
1. Enter JavaScript in the Custom JS textarea
2. Code executes after plugin initialization
3. Security warning is displayed
4. Test thoroughly before using in production

### What is Auto Palette Switching?

Auto Palette Switching changes palettes based on time of day:
- **Morning** (6:00-11:59): Bright, energetic palette
- **Afternoon** (12:00-17:59): Professional palette
- **Evening** (18:00-21:59): Warm palette
- **Night** (22:00-5:59): Dark palette

This reduces eye strain and adapts to different lighting conditions.

### How do I extend MASE?

See the [Developer Documentation](DEVELOPER.md) for:
- Hooks and filters
- Creating custom palettes
- Creating custom templates
- Adding custom settings
- JavaScript API

### Can I use MASE with other admin plugins?

MASE is designed to be compatible with most WordPress plugins. However, conflicts may occur with other admin styling plugins. If you experience issues:
1. Deactivate other admin styling plugins
2. Test MASE alone
3. Reactivate plugins one by one to identify conflicts

---

## Support & Resources

### Where can I get help?

- Check this FAQ
- Read the [User Guide](USER-GUIDE.md)
- Review [Troubleshooting Guide](TROUBLESHOOTING.md)
- Check [Developer Documentation](DEVELOPER.md)
- Visit the plugin repository

### How do I report a bug?

1. Check if it's a known issue
2. Gather information:
   - WordPress version
   - PHP version
   - Browser and version
   - Steps to reproduce
   - Error messages
3. Submit an issue on the plugin repository

### How do I request a feature?

Feature requests are welcome! Submit them on the plugin repository with:
- Clear description of the feature
- Use case and benefits
- Examples from other plugins (if applicable)

### Is there a premium version?

MASE v1.2.0 is the complete, full-featured version. There is no premium version with additional features.

---

## Migration from v1.1.0

### Will my settings be preserved?

Yes! MASE automatically migrates your v1.1.0 settings to v1.2.0 format. All your customizations are preserved.

### What happens during migration?

1. MASE detects v1.1.0 installation
2. Creates backup of old settings
3. Transforms settings to new structure
4. Adds default values for new features
5. Updates version number

### Can I rollback to v1.1.0?

Yes, but not recommended:
1. Deactivate v1.2.0
2. Install v1.1.0
3. Activate v1.1.0
4. Your v1.1.0 settings are backed up in the database

### What new features will I get?

After upgrading from v1.1.0, you'll get:
- 10 color palettes (vs 5 in v1.1.0)
- 11 templates (new feature)
- Visual effects (glassmorphism, floating, shadows)
- Enhanced typography controls
- Mobile optimization
- Accessibility features
- Auto palette switching
- Backup/restore system
- Keyboard shortcuts

---

**Version**: 1.2.0  
**Last Updated**: January 2025
