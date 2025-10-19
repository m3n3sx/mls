#!/bin/bash

###############################################################################
# MASE Visual Testing - Weryfikacja Instalacji
###############################################################################

echo "🔍 Weryfikacja systemu testów wizualnych MASE..."
echo ""

# Sprawdź pliki
echo "📁 Sprawdzanie plików..."
files=(
    "index.html"
    "test-runner.js"
    "test-definitions.js"
    "run-tests.sh"
    "README.md"
    "QUICK-START.md"
)

all_ok=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file - BRAK!"
        all_ok=false
    fi
done

echo ""

# Sprawdź Python
echo "🐍 Sprawdzanie Python..."
if command -v python3 &> /dev/null; then
    version=$(python3 --version)
    echo "  ✓ $version"
else
    echo "  ✗ Python3 nie jest zainstalowany!"
    all_ok=false
fi

echo ""

# Sprawdź uprawnienia
echo "🔐 Sprawdzanie uprawnień..."
if [ -x "run-tests.sh" ]; then
    echo "  ✓ run-tests.sh jest wykonywalny"
else
    echo "  ⚠️  run-tests.sh nie jest wykonywalny - naprawiam..."
    chmod +x run-tests.sh
    echo "  ✓ Naprawiono"
fi

echo ""

# Podsumowanie
if [ "$all_ok" = true ]; then
    echo "✅ Wszystko gotowe!"
    echo ""
    echo "Aby uruchomić testy:"
    echo "  ./run-tests.sh"
    echo ""
    echo "Lub otwórz bezpośrednio:"
    echo "  index.html w przeglądarce"
    exit 0
else
    echo "❌ Wykryto problemy - sprawdź powyższe błędy"
    exit 1
fi
