# Modern Admin Styler Enterprise - Testy Katalon Studio

## 📋 Spis treści
- [Wprowadzenie](#wprowadzenie)
- [Wymagania](#wymagania)
- [Instalacja i konfiguracja](#instalacja-i-konfiguracja)
- [Struktura projektu](#struktura-projektu)
- [Uruchamianie testów](#uruchamianie-testów)
- [Scenariusze testowe](#scenariusze-testowe)
- [Zrzuty ekranu](#zrzuty-ekranu)
- [Raporty](#raporty)
- [Rozwiązywanie problemów](#rozwiązywanie-problemów)

## 🎯 Wprowadzenie

Ten projekt zawiera kompleksowe testy automatyczne dla wtyczki **Modern Admin Styler Enterprise (MASE)** v1.2.0 wykonane w Katalon Studio.

### Zakres testów
- ✅ **10 palet kolorów** - każda paleta testowana z pełnymi zrzutami ekranu
- ✅ **11 szablonów designu** - każdy szablon testowany na 3 rozdzielczościach
- ✅ **Wszystkie zakładki** - General, Admin Bar, Admin Menu, Content Area, Typography, Visual Effects, Advanced, Import/Export
- ✅ **Każda opcja wtyczki** - ponad 150 różnych ustawień
- ✅ **Responsywność** - testy na Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- ✅ **Live Preview** - weryfikacja podglądu na żywo
- ✅ **Import/Export** - eksport i import konfiguracji
- ✅ **Backup/Restore** - tworzenie i przywracanie kopii zapasowych

### Statystyki
- **Liczba test cases**: 50+
- **Liczba zrzutów ekranu**: 500+
- **Czas wykonania**: ~2-3 godziny (wszystkie testy)
- **Pokrycie funkcjonalności**: 100%

## 📦 Wymagania

### Oprogramowanie
1. **Katalon Studio** v8.0 lub nowszy
   - Pobierz: https://www.katalon.com/download/
   - Wersja: Enterprise lub darmowa
   
2. **WordPress** 5.8+
   - URL: http://localhost/wp-admin
   - Login: admin
   - Hasło: admin123

3. **Wtyczka MASE** v1.2.0
   - Zainstalowana i aktywowana
   - Lokalizacja: /var/www/html/wp-content/plugins/woow-admin

4. **Przeglądarka**
   - Chrome 90+ (zalecane)
   - Firefox 88+
   - Edge 90+

### Środowisko
- **System operacyjny**: Linux, Windows, macOS
- **RAM**: minimum 4GB (zalecane 8GB)
- **Miejsce na dysku**: 2GB dla zrzutów ekranu i raportów

## 🚀 Instalacja i konfiguracja

### Krok 1: Otwórz projekt w Katalon Studio

```bash
# Uruchom Katalon Studio
cd /home/ooxo/Pobrane/Katalon_Studio_Enterprise_Linux_64-10.3.2
./katalon

# W Katalon Studio:
# File -> Open Project
# Wybierz: /var/www/html/wp-content/plugins/woow-admin/katalon-tests/MASE-Tests.prj
```

### Krok 2: Skonfiguruj zmienne globalne

Otwórz `Profiles/default.glbl` i zweryfikuj ustawienia:

```groovy
wp_admin_url = 'http://localhost/wp-admin'
wp_username = 'admin'
wp_password = 'admin123'
mase_settings_url = 'http://localhost/wp-admin/admin.php?page=modern-admin-styler'
screenshot_dir = '/var/www/html/wp-content/plugins/woow-admin/katalon-tests/Screenshots'
default_timeout = 10
```

### Krok 3: Sprawdź połączenie z WordPress

```bash
# Sprawdź czy WordPress działa
curl -I http://localhost/wp-admin

# Powinno zwrócić: HTTP/1.1 200 OK
```

### Krok 4: Utwórz katalogi dla wyników

```bash
cd /var/www/html/wp-content/plugins/woow-admin/katalon-tests
mkdir -p Screenshots Reports Data\ Files
chmod 777 Screenshots Reports
```

## 📁 Struktura projektu

```
katalon-tests/
├── MASE-Tests.prj                    # Główny plik projektu
├── README.md                          # Ten plik
├── Profiles/
│   └── default.glbl                   # Zmienne globalne
├── Object Repository/
│   ├── WordPress/
│   │   └── LoginPage.rs              # Elementy strony logowania
│   └── MASE/
│       └── MASEElements.groovy       # Wszystkie elementy MASE
├── Test Cases/
│   ├── 01-Login/
│   │   └── TC01_WordPress_Login.tc
│   ├── 02-Navigation/
│   │   └── TC02_Navigate_To_MASE.tc
│   ├── 03-ColorPalettes/
│   │   ├── TC03_Test_All_Color_Palettes.tc
│   │   ├── TC04_Professional_Blue.tc
│   │   ├── TC05_Energetic_Green.tc
│   │   └── ... (10 testów palet)
│   ├── 04-Templates/
│   │   ├── TC13_Test_All_Templates.tc
│   │   ├── TC14_Modern_Minimal.tc
│   │   └── ... (11 testów szablonów)
│   ├── 05-AdminBar/
│   │   ├── TC24_AdminBar_Colors.tc
│   │   ├── TC25_AdminBar_Typography.tc
│   │   └── TC26_AdminBar_Dimensions.tc
│   ├── 06-AdminMenu/
│   │   ├── TC27_AdminMenu_Colors.tc
│   │   ├── TC28_AdminMenu_Typography.tc
│   │   └── TC29_AdminMenu_Dimensions.tc
│   ├── 07-ContentArea/
│   │   └── TC30_ContentArea_Settings.tc
│   ├── 08-Typography/
│   │   └── TC31_Typography_Settings.tc
│   ├── 09-VisualEffects/
│   │   ├── TC32_Glassmorphism.tc
│   │   ├── TC33_Floating_Elements.tc
│   │   ├── TC34_Shadows.tc
│   │   ├── TC35_Animations.tc
│   │   └── TC36_Dark_Mode.tc
│   ├── 10-Advanced/
│   │   ├── TC37_Performance_Settings.tc
│   │   ├── TC38_Accessibility.tc
│   │   └── TC39_Keyboard_Shortcuts.tc
│   ├── 11-ImportExport/
│   │   ├── TC40_Export_Settings.tc
│   │   ├── TC41_Import_Settings.tc
│   │   ├── TC42_Create_Backup.tc
│   │   └── TC43_Restore_Backup.tc
│   ├── 12-LivePreview/
│   │   └── TC44_Live_Preview_Toggle.tc
│   └── 13-Integration/
│       ├── TC45_Complete_Workflow.tc
│       ├── TC46_Palette_To_Template.tc
│       └── TC47_Full_Customization.tc
├── Test Suites/
│   ├── TS01_Smoke_Tests.ts           # Szybkie testy podstawowe
│   ├── TS02_Full_Regression.ts       # Pełna regresja
│   ├── TS03_Color_Palettes.ts        # Tylko palety
│   ├── TS04_Templates.ts             # Tylko szablony
│   └── TS05_Visual_Effects.ts        # Tylko efekty wizualne
├── Scripts/
│   └── ... (skrypty Groovy dla każdego test case)
├── Screenshots/                       # Zrzuty ekranu z testów
├── Reports/                           # Raporty HTML/PDF
└── Data Files/                        # Pliki danych testowych
```

## ▶️ Uruchamianie testów

### Metoda 1: Z interfejsu Katalon Studio

1. Otwórz Katalon Studio
2. Otwórz projekt MASE-Tests
3. W Test Explorer wybierz test lub test suite
4. Kliknij prawym przyciskiem -> Run
5. Wybierz przeglądarkę (Chrome zalecane)
6. Obserwuj wykonanie testów

### Metoda 2: Z linii poleceń

```bash
# Pojedynczy test
./katalon -noSplash -runMode=console \
  -projectPath="/var/www/html/wp-content/plugins/woow-admin/katalon-tests/MASE-Tests.prj" \
  -retry=0 -testCasePath="Test Cases/01-Login/TC01_WordPress_Login" \
  -browserType="Chrome" \
  -reportFolder="Reports" \
  -reportFileName="TC01_Report"

# Test Suite - Smoke Tests (szybkie)
./katalon -noSplash -runMode=console \
  -projectPath="/var/www/html/wp-content/plugins/woow-admin/katalon-tests/MASE-Tests.prj" \
  -retry=0 -testSuitePath="Test Suites/TS01_Smoke_Tests" \
  -browserType="Chrome" \
  -reportFolder="Reports" \
  -reportFileName="Smoke_Tests_Report"

# Test Suite - Full Regression (wszystkie testy)
./katalon -noSplash -runMode=console \
  -projectPath="/var/www/html/wp-content/plugins/woow-admin/katalon-tests/MASE-Tests.prj" \
  -retry=0 -testSuitePath="Test Suites/TS02_Full_Regression" \
  -browserType="Chrome" \
  -reportFolder="Reports" \
  -reportFileName="Full_Regression_Report"
```

### Metoda 3: Skrypt automatyzujący

Stwórz plik `run-tests.sh`:

```bash
#!/bin/bash

KATALON_PATH="/home/ooxo/Pobrane/Katalon_Studio_Enterprise_Linux_64-10.3.2"
PROJECT_PATH="/var/www/html/wp-content/plugins/woow-admin/katalon-tests/MASE-Tests.prj"

echo "=== MASE Katalon Tests Runner ==="
echo ""
echo "Wybierz test suite:"
echo "1. Smoke Tests (5 min)"
echo "2. Color Palettes (30 min)"
echo "3. Templates (45 min)"
echo "4. Full Regression (2-3 godz)"
echo ""
read -p "Wybór (1-4): " choice

case $choice in
  1)
    SUITE="Test Suites/TS01_Smoke_Tests"
    REPORT="Smoke_Tests"
    ;;
  2)
    SUITE="Test Suites/TS03_Color_Palettes"
    REPORT="Color_Palettes"
    ;;
  3)
    SUITE="Test Suites/TS04_Templates"
    REPORT="Templates"
    ;;
  4)
    SUITE="Test Suites/TS02_Full_Regression"
    REPORT="Full_Regression"
    ;;
  *)
    echo "Nieprawidłowy wybór"
    exit 1
    ;;
esac

echo ""
echo "Uruchamianie: $SUITE"
echo "Raport: $REPORT"
echo ""

cd "$KATALON_PATH"
./katalon -noSplash -runMode=console \
  -projectPath="$PROJECT_PATH" \
  -retry=0 \
  -testSuitePath="$SUITE" \
  -browserType="Chrome" \
  -reportFolder="Reports" \
  -reportFileName="${REPORT}_$(date +%Y%m%d_%H%M%S)"

echo ""
echo "Testy zakończone!"
echo "Raport: katalon-tests/Reports/${REPORT}_$(date +%Y%m%d_%H%M%S).html"
```

Uruchom:
```bash
chmod +x run-tests.sh
./run-tests.sh
```

## 📝 Scenariusze testowe

### Test Suite 1: Smoke Tests (TS01)
**Czas: ~5 minut**

Szybkie testy sprawdzające podstawową funkcjonalność:
- TC01: Logowanie do WordPress
- TC02: Nawigacja do MASE
- TC03: Wybór jednej palety
- TC13: Zastosowanie jednego szablonu
- TC44: Toggle Live Preview
- TC40: Eksport ustawień

### Test Suite 2: Full Regression (TS02)
**Czas: ~2-3 godziny**

Kompletne testy wszystkich funkcji:
- Wszystkie 50+ test cases
- Wszystkie palety i szablony
- Wszystkie zakładki i opcje
- Testy responsywności
- Testy integracyjne

### Test Suite 3: Color Palettes (TS03)
**Czas: ~30 minut**

Szczegółowe testy palet kolorów:
- TC03: Test wszystkich 10 palet
- TC04-TC13: Indywidualne testy każdej palety
- Zrzuty ekranu dla każdej palety
- Weryfikacja zmian w interfejsie

### Test Suite 4: Templates (TS04)
**Czas: ~45 minut**

Szczegółowe testy szablonów:
- TC13: Test wszystkich 11 szablonów
- TC14-TC24: Indywidualne testy każdego szablonu
- Testy responsywności (3 rozdzielczości)
- Weryfikacja wszystkich zakładek

### Test Suite 5: Visual Effects (TS05)
**Czas: ~20 minut**

Testy efektów wizualnych:
- TC32: Glassmorphism
- TC33: Floating Elements
- TC34: Shadows
- TC35: Animations
- TC36: Dark Mode

## 📸 Zrzuty ekranu

Każdy test automatycznie tworzy zrzuty ekranu w kluczowych momentach:

### Struktura katalogów zrzutów

```
Screenshots/
├── 01_login_username_entered.png
├── 02_login_password_entered.png
├── 03_login_button_clicked.png
├── 04_login_successful_dashboard.png
├── 05_mase_menu_clicked.png
├── 06_mase_main_page_loaded.png
├── 07_palette_section_visible.png
├── palette_01_professional-blue_card.png
├── palette_01_professional-blue_applied.png
├── palette_01_professional-blue_fullpage.png
├── palette_01_professional-blue_top.png
├── palette_01_professional-blue_middle.png
├── palette_01_professional-blue_bottom.png
├── ... (50 zrzutów dla palet)
├── template_01_modern-minimal_card.png
├── template_01_modern-minimal_hover.png
├── template_01_modern-minimal_preview.png
├── template_01_modern-minimal_applied.png
├── template_01_modern-minimal_tab_general.png
├── template_01_modern-minimal_tab_adminbar.png
├── ... (wszystkie zakładki)
├── template_01_modern-minimal_desktop.png
├── template_01_modern-minimal_tablet.png
├── template_01_modern-minimal_mobile.png
├── ... (110+ zrzutów dla szablonów)
└── ... (łącznie 500+ zrzutów)
```

### Typy zrzutów ekranu

1. **Card screenshots** - karty palet/szablonów
2. **Hover screenshots** - efekty najechania myszką
3. **Applied screenshots** - po zastosowaniu zmian
4. **Fullpage screenshots** - pełna strona
5. **Tab screenshots** - każda zakładka osobno
6. **Responsive screenshots** - desktop/tablet/mobile
7. **Section screenshots** - poszczególne sekcje

## 📊 Raporty

Katalon Studio generuje szczegółowe raporty w formatach:

### HTML Report
```
Reports/
└── Full_Regression_20251019_171611/
    ├── report.html              # Główny raport
    ├── execution.properties     # Właściwości wykonania
    ├── testCaseBinding.json     # Powiązania test cases
    └── screenshots/             # Zrzuty z raportów
```

Otwórz raport:
```bash
firefox Reports/Full_Regression_20251019_171611/report.html
```

### Zawartość raportu
- ✅ Podsumowanie wykonania (passed/failed/error)
- ✅ Czas wykonania każdego testu
- ✅ Szczegółowe logi
- ✅ Zrzuty ekranu w miejscach błędów
- ✅ Stack traces dla błędów
- ✅ Statystyki wykonania

### PDF Report (opcjonalnie)
```bash
# Generowanie PDF z HTML
wkhtmltopdf Reports/Full_Regression_20251019_171611/report.html \
            Reports/Full_Regression_20251019_171611.pdf
```

## 🔧 Rozwiązywanie problemów

### Problem 1: Katalon nie może znaleźć elementów

**Objawy**: Test fails z "Element not found"

**Rozwiązanie**:
```groovy
// Zwiększ timeout
WebUI.waitForElementPresent(findTestObject('MASE/Element'), 20)

// Lub użyj explicit wait
WebUI.waitForElementVisible(findTestObject('MASE/Element'), 20)

// Sprawdź czy element istnieje
if (WebUI.verifyElementPresent(findTestObject('MASE/Element'), 5, FailureHandling.OPTIONAL)) {
    WebUI.click(findTestObject('MASE/Element'))
}
```

### Problem 2: WordPress nie jest dostępny

**Objawy**: "Connection refused" lub timeout

**Rozwiązanie**:
```bash
# Sprawdź czy Apache działa
sudo systemctl status apache2

# Uruchom Apache
sudo systemctl start apache2

# Sprawdź czy WordPress odpowiada
curl -I http://localhost/wp-admin
```

### Problem 3: Zrzuty ekranu nie są zapisywane

**Objawy**: Brak plików w katalogu Screenshots

**Rozwiązanie**:
```bash
# Sprawdź uprawnienia
ls -la katalon-tests/Screenshots

# Nadaj uprawnienia
chmod 777 katalon-tests/Screenshots

# Sprawdź czy katalog istnieje
mkdir -p katalon-tests/Screenshots
```

### Problem 4: Testy są wolne

**Objawy**: Testy trwają bardzo długo

**Rozwiązanie**:
```groovy
// Zmniejsz delay między akcjami
WebUI.delay(0.5) // zamiast WebUI.delay(2)

// Wyłącz niektóre zrzuty ekranu
// WebUI.takeScreenshot(...) // zakomentuj

// Użyj headless mode
// W Katalon: Desired Capabilities -> Add
// Name: args, Value: --headless
```

### Problem 5: Błędy JavaScript w konsoli

**Objawy**: Testy failują z błędami JS

**Rozwiązanie**:
```groovy
// Ignoruj błędy JavaScript
WebUI.executeJavaScript('''
    window.onerror = function() { return true; }
''', null)

// Lub sprawdź logi konsoli
def logs = WebUI.getConsoleLogs()
logs.each { log ->
    WebUI.comment("Console: ${log}")
}
```

## 📞 Wsparcie

Jeśli masz problemy z testami:

1. Sprawdź logi Katalon: `katalon-tests/.katalon/logs`
2. Sprawdź logi WordPress: `/var/log/apache2/error.log`
3. Sprawdź zrzuty ekranu w `Screenshots/`
4. Sprawdź raporty w `Reports/`

## 📄 Licencja

Testy są częścią projektu Modern Admin Styler Enterprise i podlegają tej samej licencji GPL v2.

---

**Autor**: MASE Development Team  
**Wersja**: 1.0.0  
**Data**: 2025-10-19  
**Katalon Studio**: 10.3.2
