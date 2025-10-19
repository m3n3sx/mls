# 🚀 MASE Visual Testing - Szybki Start

## Uruchomienie w 3 krokach

### 1. Uruchom serwer testowy
```bash
cd tests/visual-testing
./run-tests.sh
```

### 2. Otwórz przeglądarkę
Skrypt automatycznie otworzy przeglądarkę na:
```
http://localhost:8765/index.html
```

### 3. Uruchom testy
W przeglądarce kliknij:
- **"Uruchom Wszystkie Testy"** - uruchomi wszystkie 100 testów
- **"Uruchom Wybrane"** - uruchomi tylko wybrane kategorie

## Wybór kategorii testów

Kliknij na kartę kategorii aby ją zaznaczyć:
- ✅ Palety Kolorów (10 testów)
- ✅ Szablony (11 testów)
- ✅ Tryb Ciemny (8 testów)
- ✅ Efekty Wizualne (15 testów)
- ✅ Typografia (12 testów)
- ✅ Pasek Administracyjny (10 testów)
- ✅ Menu Administracyjne (10 testów)
- ✅ Podgląd Na Żywo (6 testów)
- ✅ Optymalizacja Mobilna (8 testów)
- ✅ Dostępność (10 testów)

## Interpretacja wyników

### Statusy testów
- 🟢 **PASSED** - Test zaliczony
- 🔴 **FAILED** - Test niezaliczony
- 🟡 **RUNNING** - Test w trakcie

### Pasek postępu
Pokazuje procent ukończonych testów w czasie rzeczywistym.

### Podsumowanie
Po zakończeniu testów zobaczysz:
- Całkowitą liczbę testów
- Liczbę zaliczonych testów
- Liczbę niezaliczonych testów
- Wskaźnik sukcesu (%)

## Eksport wyników

### JSON
Kliknij **"Eksportuj Wyniki"** aby pobrać plik JSON z wynikami:
```json
{
  "timestamp": "2025-10-19T...",
  "totalTests": 100,
  "passedTests": 95,
  "failedTests": 5,
  "successRate": "95.00%",
  "results": {...}
}
```

### Raport HTML
Kliknij **"Generuj Raport"** aby pobrać czytelny raport HTML z:
- Podsumowaniem wyników
- Szczegółową listą wszystkich testów
- Kolorowym oznaczeniem statusów

## Zatrzymanie testów

Aby zatrzymać testy w trakcie wykonywania:
1. Kliknij **"Zatrzymaj"** w interfejsie
2. Lub naciśnij `Ctrl+C` w terminalu aby zatrzymać serwer

## Rozwiązywanie problemów

### Port zajęty
Jeśli port 8765 jest zajęty, edytuj `run-tests.sh`:
```bash
PORT=8888  # Zmień na inny port
```

### Przeglądarka się nie otwiera
Otwórz ręcznie:
```
http://localhost:8765/index.html
```

### Brak Pythona
Zainstaluj Python 3:
```bash
# Ubuntu/Debian
sudo apt install python3

# macOS
brew install python3
```

## Wskazówki

1. **Testuj regularnie** - Po każdej zmianie w kodzie
2. **Sprawdzaj wszystkie kategorie** - Upewnij się że nic nie zostało zepsute
3. **Analizuj niezaliczone testy** - Sprawdź szczegóły w konsoli przeglądarki
4. **Zapisuj raporty** - Dokumentuj wyniki dla przyszłych porównań

## Następne kroki

Po uruchomieniu testów wizualnych, możesz również uruchomić:
- Testy dostępności: `tests/test-dark-mode-accessibility.html`
- Testy kompatybilności: `tests/browser-compatibility/`
- Testy jakości wizualnej: `tests/test-dark-mode-visual-quality.html`

---

**Powodzenia z testowaniem! 🎉**
