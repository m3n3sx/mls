#!/bin/bash

# MASE JavaScript Error Checker
# Sprawdza czy są błędy JavaScript w plikach

echo "🔍 Sprawdzanie błędów JavaScript w MASE..."
echo ""

# Sprawdź czy są błędy składni w głównym pliku
echo "1. Sprawdzanie składni assets/js/mase-admin.js..."
if command -v node &> /dev/null; then
    node -c assets/js/mase-admin.js 2>&1
    if [ $? -eq 0 ]; then
        echo "✓ Brak błędów składni"
    else
        echo "✗ Znaleziono błędy składni!"
    fi
else
    echo "⚠ Node.js nie jest zainstalowany, pomijam sprawdzanie składni"
fi

echo ""
echo "2. Sprawdzanie czy jQuery jest załadowane..."
grep -n "jQuery" assets/js/mase-admin.js | head -5

echo ""
echo "3. Sprawdzanie inicjalizacji MASE.init()..."
grep -n "MASE.init()" assets/js/mase-admin.js

echo ""
echo "4. Sprawdzanie event handlerów dla zakładek..."
grep -n "\.mase-tab-button" assets/js/mase-admin.js | head -10

echo ""
echo "5. Sprawdzanie event handlerów dla palet..."
grep -n "\.mase-palette-apply-btn" assets/js/mase-admin.js | head -10

echo ""
echo "6. Sprawdzanie czy są console.error..."
grep -n "console.error" assets/js/mase-admin.js | head -10

echo ""
echo "✅ Sprawdzanie zakończone"
echo ""
echo "INSTRUKCJE DEBUGOWANIA:"
echo "1. Otwórz stronę ustawień MASE w przeglądarce"
echo "2. Naciśnij F12 aby otworzyć DevTools"
echo "3. Przejdź do zakładki Console"
echo "4. Odśwież stronę (F5)"
echo "5. Sprawdź czy są czerwone błędy"
echo "6. Sprawdź czy widzisz 'MASE: Admin initialized successfully'"
echo ""
echo "Jeśli widzisz błędy, skopiuj je i prześlij do debugowania."
