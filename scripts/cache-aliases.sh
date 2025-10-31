#!/bin/bash

###############################################################################
# Aliasy do czyszczenia cache
# Dodaj do ~/.bashrc lub ~/.zshrc:
# source /path/to/scripts/cache-aliases.sh
###############################################################################

# Szybkie czyszczenie
alias cc='bash scripts/quick-clear-cache.sh'
alias clearcache='bash scripts/quick-clear-cache.sh'

# Pełne czyszczenie
alias cca='bash scripts/clear-all-cache.sh'
alias clearall='bash scripts/clear-all-cache.sh'

# Tylko MASE
alias ccm='wp option delete mase_css_cache mase_css_cache_light mase_css_cache_dark mase_settings_cache && echo "✅ MASE cache wyczyszczony"'

# Tylko WordPress
alias ccw='wp cache flush && wp transient delete --all && echo "✅ WordPress cache wyczyszczony"'

# Regeneracja CSS MASE
alias regen='wp option get mase_settings --format=json | wp option update mase_settings --format=json && echo "✅ CSS zregenerowany"'

echo "✅ Aliasy cache załadowane:"
echo "   cc        - Szybkie czyszczenie"
echo "   cca       - Pełne czyszczenie"
echo "   ccm       - Tylko MASE"
echo "   ccw       - Tylko WordPress"
echo "   regen     - Regeneracja CSS"
