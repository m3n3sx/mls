# Modern Admin Styler - Translation Guide

This directory contains translation files for the Modern Admin Styler Enterprise plugin.

## For Translators

### Getting Started

1. **Download the POT file**: `modern-admin-styler.pot` is the template file containing all translatable strings.

2. **Create a PO file**: Use a translation tool like [Poedit](https://poedit.net/) to create a new translation:
   - Open Poedit
   - Select "Create new translation"
   - Choose `modern-admin-styler.pot`
   - Select your language
   - Save as `modern-admin-styler-{locale}.po` (e.g., `modern-admin-styler-es_ES.po` for Spanish)

3. **Translate strings**: Translate all msgid strings into your language in the msgstr fields.

4. **Generate MO file**: Poedit will automatically generate a `.mo` file when you save. This is the compiled translation file WordPress uses.

### Translation Context

The plugin includes translations for:

- **Dark Mode FAB Tooltip**: Strings shown when hovering over the dark mode toggle button
  - "Switch to Dark Mode"
  - "Switch to Light Mode"
  - "Toggle Dark Mode"

- **Screen Reader Announcements**: Accessibility strings for screen readers
  - "Dark mode activated"
  - "Light mode activated"
  - "Dark mode enabled"
  - "Light mode enabled"
  - "Current mode: Dark"
  - "Current mode: Light"

- **Error Messages**: User-facing error messages
  - "Failed to toggle dark mode. Please try again."
  - "Dark mode applied locally. Preference will sync on next save."
  - "Could not save dark mode preference to browser storage."
  - "Network error while saving dark mode preference."
  - "You do not have permission to change dark mode settings."
  - "Server error while saving dark mode preference. Please try again later."

- **Settings Labels**: Labels in the admin settings interface
  - "Enable Dark Mode"
  - "Dark Mode Settings"
  - "Light Palette"
  - "Dark Palette"
  - "Transition Duration"
  - "Keyboard Shortcut"
  - "FAB Position"
  - "Respect System Preference"

- **General UI Messages**: Common interface messages
  - "Saving..."
  - "Settings saved successfully!"
  - "An error occurred. Please try again."
  - "Loading..."
  - "Applying palette..."
  - "Palette applied successfully!"
  - "Applying template..."
  - "Template applied successfully!"

### File Naming Convention

Translation files should follow WordPress locale naming:

- Spanish (Spain): `modern-admin-styler-es_ES.po` / `modern-admin-styler-es_ES.mo`
- French (France): `modern-admin-styler-fr_FR.po` / `modern-admin-styler-fr_FR.mo`
- German (Germany): `modern-admin-styler-de_DE.po` / `modern-admin-styler-de_DE.mo`
- Italian (Italy): `modern-admin-styler-it_IT.po` / `modern-admin-styler-it_IT.mo`
- Portuguese (Brazil): `modern-admin-styler-pt_BR.po` / `modern-admin-styler-pt_BR.mo`
- Polish (Poland): `modern-admin-styler-pl_PL.po` / `modern-admin-styler-pl_PL.mo`

See [WordPress Locale Codes](https://wpastra.com/docs/complete-list-wordpress-locale-codes/) for more locales.

### Testing Your Translation

1. Place your `.mo` file in this `languages/` directory
2. Set your WordPress site language to match your translation in Settings > General
3. Visit the Modern Admin Styler settings page
4. Verify all strings appear in your language

### Contributing Translations

To contribute your translation:

1. Fork the repository
2. Add your `.po` and `.mo` files to the `languages/` directory
3. Submit a pull request with:
   - Your translation files
   - Your name/username for credits
   - Any notes about translation choices

## For Developers

### Updating Translations

When adding new translatable strings:

1. **PHP**: Wrap strings in translation functions:
   ```php
   __( 'String to translate', 'modern-admin-styler' )
   _e( 'String to translate', 'modern-admin-styler' )
   esc_html__( 'String to translate', 'modern-admin-styler' )
   esc_attr__( 'String to translate', 'modern-admin-styler' )
   ```

2. **JavaScript**: Add strings to `wp_localize_script()` in `includes/class-mase-admin.php`:
   ```php
   wp_localize_script(
       'mase-admin',
       'maseL10n',
       array(
           'newString' => __( 'New translatable string', 'modern-admin-styler' ),
       )
   );
   ```

3. **Regenerate POT file**: Use WP-CLI or a tool like Poedit to scan the codebase and update the POT file:
   ```bash
   wp i18n make-pot . languages/modern-admin-styler.pot
   ```

### Text Domain

- **Text Domain**: `modern-admin-styler`
- **Domain Path**: `/languages`

These are defined in the main plugin file header.

## Resources

- [WordPress I18n Documentation](https://developer.wordpress.org/plugins/internationalization/)
- [Poedit Translation Tool](https://poedit.net/)
- [GlotPress (WordPress.org Translation Platform)](https://translate.wordpress.org/)
- [WordPress Locale Codes](https://wpastra.com/docs/complete-list-wordpress-locale-codes/)

## Support

For translation questions or issues, please open an issue on the [GitHub repository](https://github.com/m3n3sx/MASE/issues).
