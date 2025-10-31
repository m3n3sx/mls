#!/bin/bash

echo "🚀 Quick Fix - Czyszczenie cache i restart"
echo "=========================================="
echo ""

# Uruchom skrypt czyszczenia cache
if [ -f "scripts/clear-all-cache.sh" ]; then
    echo "🗑️  Czyszczenie cache..."
    bash scripts/clear-all-cache.sh
else
    echo "⚠️  Brak skryptu clear-all-cache.sh"
fi

echo ""
echo "✅ Gotowe!"
echo ""
echo "📝 Następne kroki:"
echo "  1. Odśwież przeglądarkę: Ctrl+Shift+R"
echo "  2. Sprawdź czy szablony są widoczne"
echo "  3. Sprawdź czy boczne menu wygląda dobrze"
echo ""
