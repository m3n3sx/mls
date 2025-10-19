# 👁️ Przewodnik Wizualny - System Testów MASE

## 🖥️ Co zobaczysz po uruchomieniu

### 1. Ekran Główny

```
╔════════════════════════════════════════════════════════════╗
║  🧪 MASE - Automatyczne Testy Wizualne                   ║
║  Kompleksowe testy wszystkich funkcji MASE v1.2.0        ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  [▶️ Uruchom Wszystkie]  [✓ Uruchom Wybrane]             ║
║  [⏹️ Zatrzymaj]  [📥 Eksportuj]  [📊 Generuj Raport]     ║
║                                                            ║
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░  65%                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

### 2. Kategorie Testów (Karty)

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Palety Kolorów      │  │ Szablony            │  │ Tryb Ciemny         │
│ Testy 10 palet      │  │ Testy 11 szablonów  │  │ Przełączanie trybu  │
│ 10 testów           │  │ 11 testów           │  │ 8 testów            │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Efekty Wizualne     │  │ Typografia          │  │ Pasek Admin         │
│ Glassmorphism, etc  │  │ Czcionki, rozmiary  │  │ Kolory, wysokość    │
│ 15 testów           │  │ 12 testów           │  │ 10 testów           │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

**Kliknij kartę aby ją zaznaczyć** - zmieni kolor na niebieski

### 3. Wyniki Testów (W trakcie)

```
Wyniki Testów
═════════════════════════════════════════════════════════════

Palety Kolorów (10 testów)
───────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────┐
│ Palety Kolorów - Test 1                    [🔄 RUNNING] │
│ Test w trakcie wykonywania...                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Palety Kolorów - Test 2                    [✓ PASSED]   │
│ Test zaliczony pomyślnie                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Palety Kolorów - Test 3                    [✗ FAILED]   │
│ Test niezaliczony - wykryto problem                     │
└─────────────────────────────────────────────────────────┘
```

### 4. Podsumowanie (Po zakończeniu)

```
╔═══════════════════════════════════════════════════════════╗
║                    PODSUMOWANIE TESTÓW                    ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ║
║   │     100      │  │      95      │  │       5      │  ║
║   │ Wszystkie    │  │  Zaliczone   │  │ Niezaliczone │  ║
║   │   Testy      │  │              │  │              │  ║
║   └──────────────┘  └──────────────┘  └──────────────┘  ║
║                                                           ║
║                  Wskaźnik Sukcesu: 95%                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

## 🎨 Kolory Statusów

### Statusy Testów
- 🟢 **Zielony** - Test PASSED (zaliczony)
- 🔴 **Czerwony** - Test FAILED (niezaliczony)
- 🔵 **Niebieski** - Test RUNNING (w trakcie)
- ⚪ **Szary** - Test PENDING (oczekuje)

### Karty Kategorii
- **Biały** - Kategoria niezaznaczona
- **Niebieski** - Kategoria zaznaczona
- **Hover** - Lekki cień przy najechaniu

## 📱 Responsywność

### Desktop (>1200px)
```
┌────────────────────────────────────────────────────────┐
│  [Przyciski]                                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ Kat1 │ │ Kat2 │ │ Kat3 │ │ Kat4 │ │ Kat5 │        │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘        │
│  [Wyniki testów - pełna szerokość]                    │
└────────────────────────────────────────────────────────┘
```

### Tablet (768-1200px)
```
┌──────────────────────────────────┐
│  [Przyciski w 2 rzędach]        │
│  ┌──────┐ ┌──────┐ ┌──────┐     │
│  │ Kat1 │ │ Kat2 │ │ Kat3 │     │
│  └──────┘ └──────┘ └──────┘     │
│  [Wyniki testów]                │
└──────────────────────────────────┘
```

### Mobile (<768px)
```
┌────────────────────┐
│  [Przyciski]       │
│  [pionowo]         │
│  ┌──────────────┐  │
│  │   Kategoria  │  │
│  └──────────────┘  │
│  [Wyniki]          │
└────────────────────┘
```

## 🖱️ Interakcje

### Kliknięcia
1. **Karta kategorii** - Zaznacz/odznacz kategorię
2. **Uruchom Wszystkie** - Start wszystkich 100 testów
3. **Uruchom Wybrane** - Start tylko zaznaczonych kategorii
4. **Zatrzymaj** - Przerwij wykonywanie testów
5. **Eksportuj** - Pobierz JSON z wynikami
6. **Generuj Raport** - Pobierz HTML raport

### Hover
- **Karty kategorii** - Lekki cień i zmiana koloru ramki
- **Przyciski** - Ciemniejszy odcień koloru
- **Testy** - Lekkie podświetlenie

## 📊 Pasek Postępu

```
Przed rozpoczęciem:
▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0%

W trakcie (25%):
▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  25%

W trakcie (50%):
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░  50%

W trakcie (75%):
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░  75%

Zakończone (100%):
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  100%
```

## 💾 Eksport Wyników

### JSON (Eksportuj Wyniki)
```json
{
  "timestamp": "2025-10-19T12:34:56.789Z",
  "totalTests": 100,
  "passedTests": 95,
  "failedTests": 5,
  "successRate": "95.00%",
  "results": {
    "test-1": {
      "passed": true,
      "testName": "Test 1",
      "categoryName": "Palety Kolorów"
    }
  }
}
```

### HTML (Generuj Raport)
Czytelny raport HTML z:
- Podsumowaniem w kolorowych kartach
- Szczegółową listą wszystkich testów
- Kolorowym oznaczeniem statusów
- Datą i godziną wygenerowania

## 🎯 Przykładowy Przepływ Pracy

```
1. Otwórz interfejs
   ↓
2. Zaznacz kategorie (opcjonalnie)
   ↓
3. Kliknij "Uruchom Wszystkie" lub "Uruchom Wybrane"
   ↓
4. Obserwuj pasek postępu
   ↓
5. Sprawdź wyniki w czasie rzeczywistym
   ↓
6. Przejrzyj podsumowanie
   ↓
7. Eksportuj wyniki (JSON)
   ↓
8. Wygeneruj raport (HTML)
   ↓
9. Gotowe! 🎉
```

## 🔍 Szczegóły Wizualne

### Czcionki
- **Nagłówki:** 32px, bold
- **Tytuły kategorii:** 18px, semi-bold
- **Nazwy testów:** 14px, medium
- **Opisy:** 13px, regular

### Kolory
- **Główny:** #2271b1 (niebieski WordPress)
- **Sukces:** #00a32a (zielony)
- **Błąd:** #d63638 (czerwony)
- **Tło:** #f0f0f1 (jasny szary)
- **Tekst:** #1d2327 (ciemny szary)

### Odstępy
- **Padding kart:** 20px
- **Gap między kartami:** 20px
- **Margin sekcji:** 30px
- **Border radius:** 8px (karty), 4px (przyciski)

## 📸 Screenshoty (Placeholder)

System jest przygotowany na obsługę screenshotów:
- Przed wykonaniem testu
- Po wykonaniu testu
- W przypadku błędu

Screenshoty będą zapisywane w: `screenshots/`

---

**Teraz wiesz dokładnie czego się spodziewać! 🎨**

Uruchom testy i zobacz to na własne oczy:
```bash
cd tests/visual-testing
./run-tests.sh
```
