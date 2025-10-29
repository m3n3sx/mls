#!/bin/bash
#
# Generate WordPress.org readme.txt
# Converts README.md to WordPress.org format
#
# Usage: ./scripts/generate-readme-txt.sh
#

set -e

echo "=========================================="
echo "Generating readme.txt for WordPress.org"
echo "=========================================="
echo ""

# Read version from main plugin file
VERSION=$(grep "Version:" modern-admin-styler.php | head -1 | sed 's/.*Version: //' | sed 's/ *$//')

echo "Plugin version: $VERSION"
echo ""

# Create readme.txt
cat > readme.txt << 'EOF'
=== Modern Admin Styler Enterprise ===
Contributors: masedev
Tags: admin, styling, customization, dashboard, colors
Requires at least: 5.8
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: VERSION_PLACEHOLDER
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Transform your WordPress admin with professional color schemes, templates, and powerful customization options.

== Description ==

Modern Admin Styler Enterprise (MASE) transforms your WordPress admin interface with modern design patterns, professional color schemes, and comprehensive customization options.

= Key Features =

* **10 Professional Color Palettes** - Instantly transform your admin with one-click color schemes
* **11 Complete Design Templates** - Pre-configured designs covering all settings
* **Advanced Visual Effects** - Glassmorphism, floating elements, shadows, and animations
* **Mobile Optimized** - Responsive design with touch-friendly controls
* **Accessibility Enhanced** - WCAG AA compliant with keyboard navigation
* **Import/Export** - Share configurations across sites
* **Backup/Restore** - Automatic backups before major changes
* **Live Preview** - See changes in real-time before saving
* **Performance Optimized** - CSS generation <100ms, 24-hour caching

= Color Palettes =

Choose from 10 professionally designed palettes:

* Professional Blue - Corporate, trustworthy
* Energetic Green - Fresh, growth-focused
* Creative Purple - Artistic, innovative
* Warm Sunset - Inviting, energetic
* Ocean Blue - Calm, tech-forward
* Forest Green - Natural, eco-friendly
* Royal Purple - Elegant, premium
* Monochrome - Clean, minimal
* Dark Elegance - Modern, sleek
* Vibrant Coral - Bold, attention-grabbing

= Templates =

11 complete templates with pre-configured settings:

* Default, Modern Minimal, Corporate Professional
* Creative Studio, Dark Mode Pro, Eco Friendly
* Luxury Premium, Energetic Startup, Warm & Welcoming
* Tech Forward, Bold & Vibrant

= Security =

* CSRF Protection with nonce verification
* Input sanitization and validation
* Output escaping
* Capability checks (manage_options)
* OWASP compliant

= Performance =

* CSS generation: <100ms
* 24-hour caching
* Memory usage: <50MB
* Lighthouse score: >95/100

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/modern-admin-styler/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Navigate to 'Modern Admin Styler' in the admin menu
4. Choose a palette or template to get started

== Frequently Asked Questions ==

= Does this work with any WordPress theme? =

Yes! MASE only styles the WordPress admin area, not your front-end theme.

= Will this slow down my site? =

No. MASE is highly optimized with CSS generation <100ms and 24-hour caching. It only affects admin pages.

= Can I customize the colors? =

Yes! You can create custom palettes and save them for reuse.

= Is it compatible with other plugins? =

Yes! MASE uses WordPress standards and is compatible with most plugins.

= Can I export my settings? =

Yes! Use the Import/Export feature to share configurations across sites.

= Is it accessible? =

Yes! MASE is WCAG AA compliant with keyboard navigation and screen reader support.

== Screenshots ==

1. Admin dashboard with Professional Blue palette
2. Color palette selection interface
3. Template gallery with 11 pre-configured designs
4. Typography customization options
5. Visual effects settings (glassmorphism, shadows)
6. Live preview in action
7. Mobile-optimized admin interface
8. Import/Export and backup features

== Changelog ==

= 1.2.2 =
* Production deployment preparation
* Enhanced security validation
* Performance optimization
* Code quality improvements

= 1.2.1 =
* Fixed: Dark Mode gray circle visual bug
* Fixed: Live Preview aria-checked synchronization
* Enhanced: Accessibility compliance

= 1.2.0 =
* Added: 10 professional color palettes (up from 5)
* Added: 11 complete design templates
* Added: Advanced visual effects (glassmorphism, floating, shadows)
* Added: Mobile optimization with device detection
* Added: Accessibility features (WCAG AA compliant)
* Added: Auto palette switching based on time
* Added: Backup/restore system
* Added: Keyboard shortcuts
* Improved: Live preview performance
* Improved: Security with rate limiting

= 1.1.0 =
* Added: Multi-level caching system
* Added: 5 color palette presets
* Added: Settings import/export
* Improved: Performance optimization

= 1.0.0 =
* Initial release

== Upgrade Notice ==

= 1.2.2 =
Production-ready release with enhanced security and performance. Fully backwards compatible.

= 1.2.1 =
Critical bug fixes for Dark Mode and accessibility. Update recommended.

= 1.2.0 =
Major upgrade with 10 palettes, 11 templates, and mobile optimization. Fully backwards compatible.

== Additional Info ==

For more information, visit the [plugin homepage](https://github.com/m3n3sx/MASE).

For support, please use the [WordPress.org support forum](https://wordpress.org/support/plugin/modern-admin-styler/).
EOF

# Replace version placeholder
sed -i "s/VERSION_PLACEHOLDER/$VERSION/" readme.txt

echo "✓ readme.txt created successfully"
echo ""
echo "File: readme.txt"
echo "Version: $VERSION"
echo ""
echo "Next steps:"
echo "  1. Review readme.txt"
echo "  2. Add screenshots to assets/ directory"
echo "  3. Validate with: https://wordpress.org/plugins/developers/readme-validator/"
