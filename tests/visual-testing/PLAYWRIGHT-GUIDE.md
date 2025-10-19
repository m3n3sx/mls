# 🎭 MASE Playwright Visual Testing - Kompletny Przewodnik

## 📋 Spis Treści

1. [Czym jest Playwright?](#czym-jest-playwright)
2. [Instalacja](#instalacja)
3. [Konfiguracja](#konfiguracja)
4. [Uruchomienie](#uruchomienie)
5. [Wyniki](#wyniki)
6. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

## Czym jest Playwright?

Playwright to nowoczesne narzędzie do automatyzacji przeglądarek, które pozwala na:
- ✅ Automatyczne testowanie interfejsu użytkownika
- ✅ Robienie zrzutów ekranu
- ✅ Nagrywanie wideo z testów
- ✅ Testowanie w różnych przeglądarkach (Chromium, Firefox, WebKit)
- ✅ Symulowanie interakcji użytkownika

## 📦 Instalacja

### Krok 1: Zainstaluj Node.js

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**macOS:**
```bash
brew install node
```

**Weryfikacja:**
```bash
node --version  # Powinno pokazać v18.x lub nowsze
npm --version   # Powinno pokazać 9.x lub nowsze
```

### Krok 2: Przejdź do katalogu testów

```bash
cd tests/visual-testing
```

### Krok 3: Zainstaluj zależności

```bash
npm install
```

To zainstaluje:
- Playwright (biblioteka)
- Wszystkie wymagane zależności

### Krok 4: Zainstaluj przeglądarki Playwright

```bash
npx playwright install chromium
```

To pobierze i zainstaluje przeglądarkę Chromium (~170MB).

## ⚙️ Konfiguracja

### Konfiguracja WordPress

Upewnij się że:
1. WordPress działa na `http://localhost`
2. Masz konto administratora:
   - Login: `admin`
   - Hasło: `admin`
3. Plugin MASE jest aktywny

### Konfiguracja testów

Edytuj `playwright-visual-tests.js` jeśli potrzebujesz zmienić:

```javascript
const CONFIG = {
    baseUrl: 'http://localhost/wp-admin/admin.php?page=mase-settings',
    screenshotsDir: path.join(__dirname, 'screenshots'),
    reportsDir: path.join(__dirname, 'reports'),
    viewport: { width: 1920, height: 1080 },
    timeout: 30000
};
```

## 🚀 Uruchomienie

### Metoda 1: Automatyczny skrypt (ZALECANE)

```bash
./run-playwright-tests.sh
```

Skrypt automatycznie:
- ✅ Sprawdzi wymagania
- ✅ Zainstaluje zależności
- ✅ Uruchomi testy
- ✅ Wygeneruje raporty
- ✅ Otworzy raport w przeglądarce

### Metoda 2: Bezpośrednio przez Node.js

```bash
node playwright-visual-tests.js
```

### Metoda 3: Przez npm

```bash
npm test
```

### Tryb z widoczną przeglądarką (headed mode)

```bash
npm run test:headed
```

### Tryb debug

```bash
npm run test:debug
```

## 📊 Co testujemy?

System wykonuje **100+ testów** w 10 kategoriach:

### 1. Palety Kolorów (10 testów)
- Professional Blue
- Creative Purple
- Energetic Green
- Sunset
- Ocean Breeze
- Midnight
- Forest
- Coral
- Dark Elegance
- Monochrome

### 2. Szablony (11 testów)
- Default
- Minimalist
- Corporate
- Creative
- Dark Professional
- Light & Airy
- Bold & Modern
- Classic
- Futuristic
- Elegant
- High Contrast

### 3. Tryb Ciemny (2 testy)
- Włączanie
- Wyłączanie

### 4. Efekty Wizualne (9 testów)
- Glassmorphism (Admin Bar, Menu)
- Floating (Admin Bar, Menu)
- Border Radius
- Cienie (Soft, Medium, Hard, Dramatic)

### 5. Typografia (3 testy)
- Font Size Admin Bar
- Font Size Menu
- Font Size Content

### 6. Pasek Administracyjny (3 testy)
- Kolor tła
- Kolor tekstu
- Wysokość

### 7. Menu Administracyjne (3 testy)
- Kolor tła
- Kolor tekstu
- Szerokość

### 8. Podgląd Na Żywo (2 testy)
- Włączanie
- Wyłączanie

### 9. Optymalizacja Mobilna (3 testy)
- iPhone SE (375x667)
- iPad (768x1024)
- Desktop (1920x1080)

### 10. Dostępność (2 testy)
- Nawigacja klawiaturą
- Wysoki kontrast

## 📸 Wyniki

### Struktura katalogów

```
tests/visual-testing/
├── screenshots/           # Zrzuty ekranu
│   ├── palette-professional-blue_2025-10-19.png
│   ├── template-minimalist_2025-10-19.png
│   └── videos/           # Nagrania wideo
│       └── test-session.webm
├── reports/              # Raporty HTML i JSON
│   ├── report-1697712345678.html
│   └── results-1697712345678.json
└── logs/                 # Logi testów
    └── test-run-20251019-120000.log
```

### Raport HTML

Raport zawiera:
- 📊 Podsumowanie (wszystkie/zaliczone/niezaliczone)
- 📈 Wskaźnik sukcesu (%)
- 📋 Szczegółowa lista testów
- 📸 Zrzuty ekranu (klikalne)
- ⏱️ Czas wykonania każdego testu
- ❌ Szczegóły błędów (jeśli wystąpiły)

### Wyniki JSON

```json
{
  "timestamp": "2025-10-19T12:34:56.789Z",
  "tests": [
    {
      "id": "palette-professional-blue",
      "name": "Paleta: professional-blue",
      "status": "passed",
      "duration": 1234,
      "screenshot": "palette-professional-blue_2025-10-19.png"
    }
  ],
  "summary": {
    "total": 100,
    "passed": 98,
    "failed": 2,
    "screenshots": 100
  }
}
```

## 🎥 Nagrania Wideo

Playwright automatycznie nagrywa wideo z każdej sesji testowej:
- Format: WebM
- Lokalizacja: `screenshots/videos/`
- Przydatne do debugowania

## 🐛 Rozwiązywanie Problemów

### Problem: Node.js nie jest zainstalowany

**Rozwiązanie:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node
```

### Problem: WordPress nie odpowiada

**Rozwiązanie:**
1. Sprawdź czy WordPress działa:
   ```bash
   curl http://localhost/wp-login.php
   ```
2. Uruchom serwer lokalny (XAMPP, MAMP, Local by Flywheel)
3. Sprawdź konfigurację w `playwright-visual-tests.js`

### Problem: Błąd logowania

**Rozwiązanie:**
1. Sprawdź dane logowania w `playwright-visual-tests.js`:
   ```javascript
   await page.fill('#user_login', 'admin');
   await page.fill('#user_pass', 'admin');
   ```
2. Zmień na swoje dane logowania

### Problem: Przeglądarki Playwright nie są zainstalowane

**Rozwiązanie:**
```bash
npx playwright install chromium
```

### Problem: Timeout podczas testów

**Rozwiązanie:**
Zwiększ timeout w `playwright-visual-tests.js`:
```javascript
const CONFIG = {
    timeout: 60000  // 60 sekund zamiast 30
};
```

### Problem: Brak uprawnień do zapisu

**Rozwiązanie:**
```bash
chmod -R 755 screenshots reports logs
```

### Problem: Port zajęty

**Rozwiązanie:**
Zmień port WordPress w konfiguracji lub zatrzymaj proces zajmujący port 80.

## 📝 Dostosowywanie Testów

### Dodaj własny test

Edytuj `playwright-visual-tests.js`:

```javascript
async function testMyFeature(page) {
    console.log('🎯 Testowanie mojej funkcji...');
    
    await testSingleOption(
        page,
        'my-feature-test',
        'Moja funkcja',
        async () => {
            // Twój kod testowy
            await page.click('#my-button');
            await page.waitForTimeout(500);
        }
    );
    
    console.log('✓ Moja funkcja przetestowana\n');
}
```

Dodaj do głównej funkcji:
```javascript
await testMyFeature(page);
```

### Zmień rozdzielczość

```javascript
const CONFIG = {
    viewport: { width: 2560, height: 1440 }  // 2K
};
```

### Testuj w innych przeglądarkach

```javascript
// Firefox
const { firefox } = require('playwright');
const browser = await firefox.launch();

// WebKit (Safari)
const { webkit } = require('playwright');
const browser = await webkit.launch();
```

## 🎯 Najlepsze Praktyki

1. **Uruchamiaj testy regularnie** - Po każdej zmianie w kodzie
2. **Sprawdzaj zrzuty ekranu** - Wizualna weryfikacja jest kluczowa
3. **Archiwizuj raporty** - Porównuj wyniki między wersjami
4. **Testuj w różnych rozdzielczościach** - Desktop, tablet, mobile
5. **Używaj trybu headed podczas debugowania** - Łatwiej zobaczyć co się dzieje
6. **Zapisuj logi** - Pomocne przy diagnozowaniu problemów

## 🔄 Integracja CI/CD

### GitHub Actions

```yaml
name: Visual Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd tests/visual-testing
          npm install
          npx playwright install chromium
      - name: Run tests
        run: |
          cd tests/visual-testing
          npm test
      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        with:
          name: screenshots
          path: tests/visual-testing/screenshots/
      - name: Upload reports
        uses: actions/upload-artifact@v3
        with:
          name: reports
          path: tests/visual-testing/reports/
```

## 📚 Dodatkowe Zasoby

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Visual Testing Best Practices](https://playwright.dev/docs/test-snapshots)

## 🎉 Gotowe!

Teraz możesz uruchomić testy:

```bash
cd tests/visual-testing
./run-playwright-tests.sh
```

**Powodzenia z testowaniem! 🚀**
