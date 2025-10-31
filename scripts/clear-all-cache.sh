#!/bin/bash

###############################################################################
# Hardkorowe czyszczenie cache WordPress
# Czyści wszystkie możliwe cache'e żeby zmiany były widoczne natychmiast
###############################################################################

set -e

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_message() {
    echo -e "${1}${2}${NC}"
}

print_header() {
    echo ""
    print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    print_message "$BLUE" "  $1"
    print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

print_header "HARDKOROWE CZYSZCZENIE CACHE WORDPRESS"

# 1. WordPress Object Cache
print_message "$YELLOW" "🗑️  Czyszczenie WordPress Object Cache..."
if command -v wp &> /dev/null; then
    wp cache flush 2>/dev/null && print_message "$GREEN" "✅ Object cache wyczyszczony" || print_message "$YELLOW" "⚠️  Brak WP-CLI"
else
    print_message "$YELLOW" "⚠️  WP-CLI niedostępny"
fi

# 2. WordPress Transients
print_message "$YELLOW" "🗑️  Usuwanie wszystkich transients..."
if command -v wp &> /dev/null; then
    wp transient delete --all 2>/dev/null && print_message "$GREEN" "✅ Transients usunięte" || true
fi

# 3. MASE CSS Cache
print_message "$YELLOW" "🗑️  Czyszczenie MASE CSS cache..."
if command -v wp &> /dev/null; then
    wp option delete mase_css_cache_light 2>/dev/null && print_message "$GREEN" "✅ Light CSS cache usunięty" || true
    wp option delete mase_css_cache_dark 2>/dev/null && print_message "$GREEN" "✅ Dark CSS cache usunięty" || true
    wp option delete mase_css_cache 2>/dev/null && print_message "$GREEN" "✅ CSS cache usunięty" || true
fi

# 4. MASE Settings Cache
print_message "$YELLOW" "🗑️  Czyszczenie MASE settings cache..."
if command -v wp &> /dev/null; then
    wp option delete mase_settings_cache 2>/dev/null && print_message "$GREEN" "✅ Settings cache usunięty" || true
fi

# 5. Rewrite Rules
print_message "$YELLOW" "🗑️  Flush rewrite rules..."
if command -v wp &> /dev/null; then
    wp rewrite flush 2>/dev/null && print_message "$GREEN" "✅ Rewrite rules flushed" || true
fi

# 6. Opcache (PHP)
print_message "$YELLOW" "🗑️  Czyszczenie PHP Opcache..."
if command -v wp &> /dev/null; then
    wp eval 'if (function_exists("opcache_reset")) { opcache_reset(); echo "OK"; }' 2>/dev/null && print_message "$GREEN" "✅ Opcache wyczyszczony" || print_message "$YELLOW" "⚠️  Opcache niedostępny"
fi

# 7. Browser Cache Headers
print_message "$YELLOW" "🗑️  Dodawanie nagłówków no-cache..."
cat > .htaccess.cache << 'EOF'
# Dodaj do .htaccess dla wymuszenia braku cache w przeglądarce (TYLKO DO DEVELOPMENTU!)
<IfModule mod_headers.c>
    <FilesMatch "\.(css|js)$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires 0
    </FilesMatch>
</IfModule>
EOF
print_message "$GREEN" "✅ Plik .htaccess.cache utworzony (dodaj do .htaccess jeśli potrzeba)"

# 8. Czyszczenie cache pluginów
print_message "$YELLOW" "🗑️  Czyszczenie cache popularnych pluginów..."

# WP Super Cache
if command -v wp &> /dev/null; then
    wp cache flush 2>/dev/null || true
fi

# W3 Total Cache
if [ -d "wp-content/cache/w3tc" ]; then
    rm -rf wp-content/cache/w3tc/* 2>/dev/null && print_message "$GREEN" "✅ W3 Total Cache wyczyszczony" || true
fi

# WP Rocket
if [ -d "wp-content/cache/wp-rocket" ]; then
    rm -rf wp-content/cache/wp-rocket/* 2>/dev/null && print_message "$GREEN" "✅ WP Rocket cache wyczyszczony" || true
fi

# LiteSpeed Cache
if command -v wp &> /dev/null; then
    wp litespeed-purge all 2>/dev/null && print_message "$GREEN" "✅ LiteSpeed cache wyczyszczony" || true
fi

# 9. Czyszczenie cache katalogów
print_message "$YELLOW" "🗑️  Czyszczenie katalogów cache..."
if [ -d "wp-content/cache" ]; then
    find wp-content/cache -type f -delete 2>/dev/null && print_message "$GREEN" "✅ wp-content/cache wyczyszczony" || true
fi

# 10. Regeneracja MASE CSS
print_message "$YELLOW" "🔄 Regeneracja MASE CSS..."
if command -v wp &> /dev/null; then
    # Pobierz aktualne ustawienia i zapisz ponownie (wymusi regenerację CSS)
    SETTINGS=$(wp option get mase_settings --format=json 2>/dev/null || echo "{}")
    if [ "$SETTINGS" != "{}" ]; then
        echo "$SETTINGS" | wp option update mase_settings --format=json 2>/dev/null && print_message "$GREEN" "✅ MASE CSS zregenerowany" || true
    fi
fi

# 11. Timestamp dla wymuszenia przeładowania
print_message "$YELLOW" "🔄 Dodawanie timestamp do assetów..."
TIMESTAMP=$(date +%s)
print_message "$BLUE" "   Dodaj do enqueue: ?ver=$TIMESTAMP"

# 12. Czyszczenie session
print_message "$YELLOW" "🗑️  Czyszczenie PHP sessions..."
if [ -d "/tmp" ]; then
    find /tmp -name "sess_*" -type f -mmin +60 -delete 2>/dev/null && print_message "$GREEN" "✅ Stare sesje usunięte" || true
fi

print_header "PODSUMOWANIE"

print_message "$GREEN" "✅ Wszystkie cache'e wyczyszczone!"
echo ""
print_message "$CYAN" "Następne kroki:"
print_message "$CYAN" "  1. Odśwież przeglądarkę: Ctrl+Shift+R (Windows/Linux) lub Cmd+Shift+R (Mac)"
print_message "$CYAN" "  2. Wyczyść cache przeglądarki (DevTools > Application > Clear storage)"
print_message "$CYAN" "  3. Otwórz tryb incognito dla czystego testu"
print_message "$CYAN" "  4. Sprawdź czy pliki CSS/JS mają nowe timestampy w źródle strony"
echo ""
print_message "$YELLOW" "💡 Dla developmentu dodaj do wp-config.php:"
print_message "$BLUE" "   define('WP_CACHE', false);"
print_message "$BLUE" "   define('CONCATENATE_SCRIPTS', false);"
echo ""

# Wyświetl informacje o cache
print_message "$BLUE" "📊 Status cache:"
if command -v wp &> /dev/null; then
    echo ""
    print_message "$CYAN" "WordPress:"
    wp option list | grep -E "cache|transient" | wc -l | xargs -I {} echo "  Opcje cache: {}"
    
    echo ""
    print_message "$CYAN" "MASE:"
    wp option get mase_settings --format=json 2>/dev/null | wc -c | xargs -I {} echo "  Rozmiar ustawień: {} bajtów"
fi

echo ""
print_message "$GREEN" "🎉 Gotowe! Zmiany powinny być teraz widoczne natychmiast."
