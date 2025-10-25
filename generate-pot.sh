#!/bin/bash
# Generate translation template (.pot file) for Modern Admin Styler
# Task 46: Localization

echo "Generating translation template..."

# Use WP-CLI to generate POT file
wp i18n make-pot . languages/modern-admin-styler.pot \
  --domain=modern-admin-styler \
  --exclude=node_modules,vendor,tests,dist,coverage,katalon-tests,mcp-server,temp_wooe \
  --headers='{"Report-Msgid-Bugs-To":"https://github.com/m3n3sx/MASE/issues","Last-Translator":"MASE Development Team","Language-Team":"MASE Development Team"}' \
  --file-comment="Translation template for Modern Admin Styler\nCopyright (C) 2025 MASE Development Team\nThis file is distributed under the GPL v2 or later."

if [ $? -eq 0 ]; then
    echo "✓ Translation template generated successfully: languages/modern-admin-styler.pot"
    echo ""
    echo "Translation statistics:"
    msgfmt --statistics languages/modern-admin-styler.pot 2>&1 || echo "  (msgfmt not available for statistics)"
else
    echo "✗ Failed to generate translation template"
    exit 1
fi
