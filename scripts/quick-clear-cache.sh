#!/bin/bash

###############################################################################
# Szybkie czyszczenie cache - bez pytań
###############################################################################

echo "🧹 Czyszczenie cache..."

# WordPress
wp cache flush 2>/dev/null
wp transient delete --all 2>/dev/null

# MASE
wp option delete mase_css_cache 2>/dev/null
wp option delete mase_css_cache_light 2>/dev/null
wp option delete mase_css_cache_dark 2>/dev/null
wp option delete mase_settings_cache 2>/dev/null

# Opcache
wp eval 'if (function_exists("opcache_reset")) opcache_reset();' 2>/dev/null

# Popularne pluginy cache
wp rocket clean --confirm 2>/dev/null
wp w3-total-cache flush all 2>/dev/null
wp litespeed-purge all 2>/dev/null

# Regeneracja CSS MASE
SETTINGS=$(wp option get mase_settings --format=json 2>/dev/null)
if [ ! -z "$SETTINGS" ]; then
    echo "$SETTINGS" | wp option update mase_settings --format=json 2>/dev/null
fi

echo "✅ Cache wyczyszczony!"
echo "💡 Odśwież przeglądarkę: Ctrl+Shift+R"
