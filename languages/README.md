# Modern Admin Styler - Localization

This directory contains translation files for the Modern Admin Styler plugin.

## Files

- **modern-admin-styler.pot** - Translation template file containing all translatable strings
- **modern-admin-styler-pl_PL.po** - Polish translation (example)
- **modern-admin-styler-pl_PL.mo** - Compiled Polish translation (example)

## Translation Statistics

The plugin contains **720+ translatable strings** including:

- Background system strings (images, gradients, patterns)
- Admin interface labels and descriptions
- JavaScript messages and notifications
- Error messages and validation feedback
- Accessibility labels and ARIA descriptions

## Text Domain

The plugin uses the text domain: **`modern-admin-styler`**

## Creating a New Translation

### Method 1: Using Poedit (Recommended)

1. Download and install [Poedit](https://poedit.net/)
2. Open `modern-admin-styler.pot` in Poedit
3. Create a new translation for your language
4. Translate the strings
5. Save the file as `modern-admin-styler-{locale}.po` (e.g., `modern-admin-styler-fr_FR.po`)
6. Poedit will automatically generate the `.mo` file

### Method 2: Using Command Line

1. Copy the POT file:
   ```bash
   cp modern-admin-styler.pot modern-admin-styler-{locale}.po
   ```

2. Edit the PO file header with your language information

3. Translate the strings using a text editor or translation tool

4. Compile the PO file to MO:
   ```bash
   msgfmt modern-admin-styler-{locale}.po -o modern-admin-styler-{locale}.mo
   ```

### Method 3: Using WordPress.org Translation Platform

1. Visit the plugin's translation page on WordPress.org
2. Select your language
3. Translate strings online
4. WordPress will automatically generate and distribute the translation files

## Updating the Translation Template

When new strings are added to the plugin, regenerate the POT file:

```bash
./generate-pot.sh
```

Or manually using WP-CLI:

```bash
wp i18n make-pot . languages/modern-admin-styler.pot \
  --domain=modern-admin-styler \
  --exclude=node_modules,vendor,tests,dist,coverage
```

## Translation Functions Used

The plugin uses WordPress standard translation functions:

### PHP Functions
- `__( $text, 'modern-admin-styler' )` - Returns translated string
- `_e( $text, 'modern-admin-styler' )` - Echoes translated string
- `esc_html__( $text, 'modern-admin-styler' )` - Returns escaped translated string
- `esc_html_e( $text, 'modern-admin-styler' )` - Echoes escaped translated string
- `esc_attr__( $text, 'modern-admin-styler' )` - Returns attribute-escaped translated string
- `esc_attr_e( $text, 'modern-admin-styler' )` - Echoes attribute-escaped translated string

### JavaScript Localization
JavaScript strings are localized via `wp_localize_script()` in the `MASE_Admin` class:

```php
wp_localize_script(
    'mase-admin',
    'maseAdmin',
    array(
        'strings' => array(
            'backgroundUploadSuccess' => __( 'Background image uploaded successfully!', 'modern-admin-styler' ),
            // ... more strings
        ),
    )
);
```

Access in JavaScript:
```javascript
const message = maseAdmin.strings.backgroundUploadSuccess;
MASE.showNotice(message, 'success');
```

## Background System Strings

The Advanced Background System includes extensive localization for:

### Upload Interface
- File upload messages
- Drag and drop instructions
- File validation errors
- Upload progress indicators

### Gradient Builder
- Gradient type labels
- Color stop management
- Angle control labels
- Preset categories

### Pattern Library
- Pattern selection
- Pattern customization
- Category filters

### Advanced Properties
- Opacity controls
- Blend mode options
- Position picker
- Size and repeat options

### Responsive Variations
- Breakpoint labels
- Device preview controls
- Responsive configuration

## Testing Translations

### Enable a Translation

1. Set WordPress language in `wp-config.php`:
   ```php
   define( 'WPLANG', 'pl_PL' );
   ```

2. Or use the WordPress admin:
   - Go to Settings → General
   - Select your language
   - Save changes

3. Clear WordPress cache if using a caching plugin

4. Visit the MASE settings page to see translated strings

### Verify Translation Coverage

Run the localization verification script:

```bash
./verify-localization.sh
```

This will check:
- POT file exists and contains all strings
- PHP templates use translation functions
- JavaScript strings are localized
- Text domain consistency

## Contributing Translations

We welcome translations in all languages! To contribute:

1. Create a translation using one of the methods above
2. Test the translation thoroughly
3. Submit a pull request with your `.po` and `.mo` files
4. Or submit via WordPress.org translation platform

## Language Codes

Common language codes (locale):

- English (US): `en_US`
- Polish: `pl_PL`
- German: `de_DE`
- French: `fr_FR`
- Spanish: `es_ES`
- Italian: `it_IT`
- Portuguese (Brazil): `pt_BR`
- Russian: `ru_RU`
- Japanese: `ja`
- Chinese (Simplified): `zh_CN`

For a complete list, see: https://make.wordpress.org/polyglots/teams/

## Support

For translation questions or issues:

- GitHub Issues: https://github.com/m3n3sx/MASE/issues
- WordPress.org Support: https://wordpress.org/support/plugin/modern-admin-styler/

## License

All translation files are distributed under the GPL v2 or later, same as the plugin.
