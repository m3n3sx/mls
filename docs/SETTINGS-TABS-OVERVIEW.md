# Modern Admin Styler - Przegląd Zakładek Ustawień

## Struktura Zakładek

Plugin MASE zawiera **13 zakładek** z kompleksowymi opcjami dostosowywania:

---

## 1. 🏠 General (Ogólne)

**Ikona**: `dashicons-admin-home`

### Sekcje:

#### Color Palettes (Palety Kolorów)
- **10 profesjonalnych palet kolorów**
- Każda paleta pokazuje 4 kolory: Primary, Secondary, Accent, Background
- Przyciski: Preview (podgląd) i Apply (zastosuj)
- Aktywna paleta oznaczona jako "Active"

**Dostępne palety**:
1. Professional Blue
2. Energetic Green
3. Sunset
4. Dark Elegance
5. Ocean Breeze
6. Forest
7. Lavender Dreams
8. Coral Reef
9. Midnight
10. Custom palettes (utworzone przez użytkownika)

#### Quick Templates (Szybkie Szablony)
- **Podgląd 3 popularnych szablonów**
- Każdy szablon ma miniaturkę i opis
- Przycisk "Apply Template"
- Link "View All Templates" prowadzi do zakładki Templates

#### Master Controls (Główne Kontrolki)
- **Enable Plugin** - włącz/wyłącz plugin (toggle switch)
- **Apply to Login Page** - zastosuj do strony logowania
- **Dark Mode** - tryb ciemny dla całego interfejsu admin

---

## 2. 📊 Admin Bar

**Ikona**: `dashicons-admin-generic`

### Sekcje:

#### Admin Bar Colors (Kolory Admin Bar)
- **Background Color** - kolor tła (color picker)
- **Text Color** - kolor tekstu (color picker)
- **Hover Color** - kolor po najechaniu (color picker)
- **Height** - wysokość w pikselach (32-100px)

#### Background Gradient (Gradient Tła)
- **Background Type** - wybór: Solid Color / Gradient
- **Gradient Type** - Linear / Radial / Conic
- **Angle** - kąt gradientu (0-360°, slider)
- **Color Stop 1** - pierwszy kolor gradientu
- **Color Stop 2** - drugi kolor gradientu

#### Admin Bar Typography (Typografia)
- **Font Size** - rozmiar czcionki (10-24px)
- **Font Weight** - grubość czcionki (300-700)
- **Line Height** - wysokość linii (slider)
- **Letter Spacing** - odstęp między literami
- **Text Transform** - transformacja tekstu (none/uppercase/lowercase/capitalize)
- **Font Family** - rodzina czcionki (system lub Google Fonts)

#### Visual Effects (Efekty Wizualne)
- **Glassmorphism** - efekt szkła (toggle + blur intensity)
- **Floating** - pływający admin bar (toggle + margin)
- **Border Radius** - zaokrąglenie rogów (uniform/individual)
- **Shadow** - cień (preset: none/subtle/medium/strong/dramatic)

---

## 3. 📋 Menu

**Ikona**: `dashicons-menu`

### Sekcje:

#### Menu Colors (Kolory Menu)
- **Background Color** - kolor tła menu
- **Text Color** - kolor tekstu
- **Hover Background** - tło po najechaniu
- **Hover Text** - tekst po najechaniu
- **Active Background** - tło aktywnego elementu
- **Active Text** - tekst aktywnego elementu

#### Menu Dimensions (Wymiary Menu)
- **Width** - szerokość menu
  - Unit: pixels (160-400px) lub percent (50-100%)
- **Height Mode** - tryb wysokości: Full / Content
- **Padding** - odstępy wewnętrzne (vertical/horizontal)

#### Menu Gradient Background
- Analogiczne opcje jak w Admin Bar
- Background Type, Gradient Type, Angle, Color Stops

#### Menu Typography
- Font Size, Font Weight, Line Height
- Letter Spacing, Text Transform, Font Family

#### Icon Controls (Kontrolki Ikon)
- **Icon Color Mode** - Auto / Custom
- **Icon Color** - kolor ikon (gdy Custom)

#### Submenu Settings (Ustawienia Podmenu)
- **Background Color** - kolor tła podmenu
- **Border Radius** - zaokrąglenie (uniform/individual)
- **Spacing** - odstęp od menu (0-50px)
- **Typography** - Font Size, Text Color, Line Height, Letter Spacing

#### Visual Effects
- Glassmorphism, Floating, Border Radius, Shadow
- Logo Placement (top/bottom, width, alignment)

---

## 4. 📐 Content

**Ikona**: `dashicons-layout`

### Sekcje:

#### Background Settings (Ustawienia Tła)
- **Background Type** - Color / Image / Gradient / Pattern
- **Background Color** - kolor tła
- **Background Image** - upload obrazu
- **Position** - pozycja tła (center/top/bottom/left/right)
- **Size** - rozmiar (cover/contain/auto)
- **Repeat** - powtarzanie (no-repeat/repeat/repeat-x/repeat-y)
- **Opacity** - przezroczystość (0-100%)

#### Spacing Controls (Kontrolki Odstępów)
- **Content Margin** - marginesy treści (top/right/bottom/left)
- **Content Padding** - padding treści
- **Mobile Overrides** - nadpisania dla urządzeń mobilnych

#### Layout Options (Opcje Układu)
- **Content Width** - szerokość treści
- **Sidebar Position** - pozycja sidebara (left/right/none)
- **Responsive Breakpoints** - punkty przełamania responsywności

---

## 5. 🔤 Typography

**Ikona**: `dashicons-editor-textcolor`

### Sekcje:

#### Area Selector (Wybór Obszaru)
Dropdown do wyboru obszaru:
- Admin Bar
- Admin Menu
- Content Area
- Headings
- Paragraphs
- Links

#### Font Settings (Ustawienia Czcionki)
Dla każdego obszaru:
- **Font Family** - rodzina czcionki
  - System fonts
  - Google Fonts (z podglądem)
- **Font Size** - rozmiar (10-72px)
- **Font Weight** - grubość (100-900)
- **Line Height** - wysokość linii (1.0-3.0)
- **Letter Spacing** - odstęp między literami (-2 do 5px)
- **Text Transform** - transformacja tekstu

#### Google Fonts Integration
- **Enable Google Fonts** - włącz Google Fonts
- **Font Display** - strategia ładowania (swap/block/fallback/optional)
- **Font Subset** - podzbiór znaków (latin/latin-ext/cyrillic)
- **Preload Fonts** - wstępne ładowanie krytycznych czcionek

---

## 6. 🎨 Dashboard Widgets

**Ikona**: `dashicons-welcome-widgets-menus`

### Sekcje:

#### Widget Visibility (Widoczność Widgetów)
Lista wszystkich widgetów dashboardu z checkboxami:
- Welcome Panel
- At a Glance
- Activity
- Quick Draft
- WordPress Events and News
- Site Health Status
- Custom widgets (z innych pluginów)

#### Widget Styling (Stylowanie Widgetów)
- **Background Color** - kolor tła widgetu
- **Border Color** - kolor obramowania
- **Border Radius** - zaokrąglenie rogów
- **Shadow** - cień widgetu
- **Padding** - odstępy wewnętrzne

#### Widget Layout (Układ Widgetów)
- **Columns** - liczba kolumn (1-4)
- **Gap** - odstęp między widgetami
- **Order** - kolejność widgetów (drag & drop)

---

## 7. 📝 Form Controls

**Ikona**: `dashicons-edit`

### Sekcje:

#### Input Fields (Pola Wejściowe)
- **Background Color** - kolor tła
- **Border Color** - kolor obramowania
- **Border Width** - szerokość obramowania (0-5px)
- **Border Radius** - zaokrąglenie rogów
- **Focus Color** - kolor przy fokusie
- **Padding** - odstępy wewnętrzne

#### Textareas (Obszary Tekstowe)
- Analogiczne opcje jak Input Fields
- **Min Height** - minimalna wysokość
- **Resize** - możliwość zmiany rozmiaru (none/vertical/horizontal/both)

#### Select Dropdowns (Listy Rozwijane)
- Background Color, Border Color, Border Radius
- **Arrow Color** - kolor strzałki
- **Arrow Style** - styl strzałki

#### Checkboxes & Radio Buttons
- **Size** - rozmiar (12-32px)
- **Color** - kolor zaznaczenia
- **Border Color** - kolor obramowania
- **Border Radius** - zaokrąglenie (dla checkboxów)

#### Buttons (Przyciski w Formularzach)
- Link do zakładki Universal Buttons
- Szybkie ustawienia dla przycisków formularzy

---

## 8. ✨ Effects

**Ikona**: `dashicons-art`

### Sekcje:

#### Animation Settings (Ustawienia Animacji)
- **Page Animations** - animacje strony (toggle)
- **Animation Speed** - szybkość animacji (100-1000ms)
- **Hover Effects** - efekty po najechaniu (toggle)
- **Transition Duration** - czas tranzycji (100-500ms)

#### Visual Effects (Efekty Wizualne)
- **Glassmorphism** - efekt szkła (global toggle)
- **Blur Intensity** - intensywność rozmycia (0-50px)
- **Shadows** - cienie (global toggle)
- **Shadow Intensity** - intensywność cieni (subtle/medium/strong)

#### Performance Mode (Tryb Wydajności)
- **Reduce Motion** - zmniejsz animacje (dla accessibility)
- **Disable Shadows on Mobile** - wyłącz cienie na mobile
- **Auto-detect Low Power** - automatyczna detekcja trybu oszczędzania energii

#### Advanced Effects (Zaawansowane Efekty)
- **Microanimations** - mikroanimacje (toggle)
- **Particle System** - system cząstek (toggle)
- **3D Effects** - efekty 3D (toggle)
- **Sound Effects** - efekty dźwiękowe (toggle)

---

## 9. 🔘 Universal Buttons

**Ikona**: `dashicons-editor-bold`

### Sekcje:

#### Button Types (Typy Przycisków)
6 typów przycisków z pełną konfiguracją:
1. **Primary** - główne przyciski akcji
2. **Secondary** - drugorzędne przyciski
3. **Danger** - przyciski niebezpiecznych akcji
4. **Success** - przyciski sukcesu
5. **Ghost** - przyciski przezroczyste
6. **Tabs** - przyciski zakładek

#### Button States (Stany Przycisków)
Dla każdego typu, 5 stanów:
- **Normal** - stan normalny
- **Hover** - po najechaniu
- **Active** - aktywny/kliknięty
- **Focus** - w fokusie
- **Disabled** - wyłączony

#### Button Properties (Właściwości)
Dla każdego stanu:
- **Background Type** - Solid / Gradient
- **Background Color** - kolor tła
- **Gradient** - ustawienia gradientu (jeśli gradient)
- **Text Color** - kolor tekstu
- **Border** - Width, Style, Color
- **Border Radius** - zaokrąglenie (uniform/individual)
- **Padding** - horizontal/vertical
- **Font Size** - rozmiar czcionki
- **Font Weight** - grubość czcionki
- **Text Transform** - transformacja tekstu
- **Shadow** - preset/custom
- **Transition Duration** - czas tranzycji
- **Ripple Effect** - efekt ripple (toggle)

#### Quick Actions (Szybkie Akcje)
- **Reset Button Type** - resetuj typ przycisku do domyślnych
- **Reset All Buttons** - resetuj wszystkie przyciski
- **Copy Settings** - kopiuj ustawienia między typami

---

## 10. 🖼️ Backgrounds

**Ikona**: `dashicons-format-image`

### Sekcje:

#### Area Selection (Wybór Obszaru)
Dropdown do wyboru obszaru:
- Dashboard
- Admin Menu
- Post Lists
- Post Editor
- Widgets
- Login Page

#### Background Type (Typ Tła)
Dla każdego obszaru:
- **None** - brak tła
- **Color** - jednolity kolor
- **Image** - obraz
- **Gradient** - gradient
- **Pattern** - wzór

#### Image Settings (Ustawienia Obrazu)
- **Upload Image** - upload z komputera
- **Select from Media Library** - wybór z biblioteki mediów
- **Image URL** - bezpośredni URL
- **Position** - pozycja (9-point picker + custom)
- **Size** - cover/contain/auto/custom
- **Repeat** - no-repeat/repeat/repeat-x/repeat-y
- **Attachment** - scroll/fixed
- **Opacity** - przezroczystość (0-100%)
- **Blend Mode** - tryb mieszania (normal/multiply/screen/overlay/etc.)

#### Gradient Builder (Konstruktor Gradientów)
- **Gradient Type** - Linear/Radial/Conic
- **Angle** - kąt (0-360°)
- **Color Stops** - do 10 punktów kolorów
  - Add/Remove color stops
  - Position slider dla każdego punktu
  - Color picker dla każdego punktu
- **Gradient Presets** - gotowe gradienty

#### Pattern Library (Biblioteka Wzorów)
- **Pattern Categories**:
  - Geometric (geometryczne)
  - Organic (organiczne)
  - Abstract (abstrakcyjne)
  - Textures (tekstury)
- **Pattern Preview** - podgląd wzoru
- **Pattern Scale** - skala wzoru (50-200%)
- **Pattern Opacity** - przezroczystość wzoru

#### Responsive Variations (Warianty Responsywne)
- **Enable Responsive** - włącz różne tła dla różnych urządzeń
- **Desktop** - ustawienia dla desktop
- **Tablet** - ustawienia dla tablet
- **Mobile** - ustawienia dla mobile
- **Inherit from Desktop** - dziedzicz z desktop

---

## 11. 📋 Templates

**Ikona**: `dashicons-portfolio`

### Sekcje:

#### Full Template Gallery (Pełna Galeria Szablonów)
Grid z wszystkimi dostępnymi szablonami:

**Predefiniowane szablony** (10):
1. **Default** - domyślny WordPress
2. **Modern Minimal** - minimalistyczny
3. **Dark Professional** - ciemny profesjonalny
4. **Colorful Creative** - kolorowy kreatywny
5. **Corporate Blue** - korporacyjny niebieski
6. **Nature Green** - naturalna zieleń
7. **Sunset Orange** - pomarańczowy zachód
8. **Ocean Blue** - niebieski ocean
9. **Forest Dark** - ciemny las
10. **Lavender Light** - jasna lawenda

Każdy szablon pokazuje:
- **Thumbnail** - miniaturka podglądu
- **Name** - nazwa szablonu
- **Description** - opis
- **Preview Button** - przycisk podglądu
- **Apply Button** - przycisk zastosowania
- **Active Badge** - oznaczenie aktywnego

#### Custom Templates (Własne Szablony)
- **Create New Template** - utwórz nowy szablon
  - Name - nazwa
  - Description - opis
  - Snapshot Current Settings - zapisz obecne ustawienia
- **Manage Custom Templates** - zarządzaj własnymi
  - Edit - edytuj
  - Duplicate - duplikuj
  - Delete - usuń
  - Export - eksportuj
  - Import - importuj

#### Template Actions (Akcje Szablonów)
- **Export Template** - eksportuj szablon do pliku JSON
- **Import Template** - importuj szablon z pliku JSON
- **Share Template** - udostępnij szablon (generuje kod)

---

## 12. 🔐 Login Page

**Ikona**: `dashicons-lock`

### Sekcje:

#### Logo Settings (Ustawienia Logo)
- **Enable Custom Logo** - włącz własne logo (toggle)
- **Logo Upload** - upload logo
- **Logo Width** - szerokość logo (20-400px)
- **Logo Height** - wysokość logo (20-400px)
- **Logo Link URL** - URL po kliknięciu logo
- **Logo Link Title** - tytuł linku (tooltip)

#### Background Settings (Ustawienia Tła)
- **Background Type** - Color/Image/Gradient
- **Background Color** - kolor tła
- **Background Image** - upload obrazu tła
- **Position** - pozycja tła
- **Size** - rozmiar tła
- **Repeat** - powtarzanie
- **Opacity** - przezroczystość

#### Gradient Settings (Ustawienia Gradientu)
- **Gradient Type** - Linear/Radial
- **Gradient Angle** - kąt gradientu
- **Color Stops** - punkty kolorów (2-10)

#### Form Styling (Stylowanie Formularza)
- **Form Background** - kolor tła formularza
- **Form Border Color** - kolor obramowania
- **Form Border Radius** - zaokrąglenie rogów
- **Form Box Shadow** - cień formularza (none/default/subtle/medium/strong)
- **Form Text Color** - kolor tekstu
- **Form Focus Color** - kolor przy fokusie

#### Glassmorphism Effect (Efekt Szkła)
- **Enable Glassmorphism** - włącz efekt szkła (toggle)
- **Blur Intensity** - intensywność rozmycia (0-50px)
- **Opacity** - przezroczystość (0-100%)

#### Typography (Typografia)
- **Label Font Family** - czcionka etykiet
- **Label Font Size** - rozmiar czcionki etykiet
- **Label Font Weight** - grubość czcionki etykiet
- **Input Font Family** - czcionka pól wejściowych
- **Input Font Size** - rozmiar czcionki pól

#### Additional Elements (Dodatkowe Elementy)
- **Footer Text** - tekst w stopce (HTML allowed)
- **Hide WordPress Branding** - ukryj branding WordPress (toggle)
- **Custom CSS** - własny CSS dla strony logowania
- **Remember Me Style** - styl checkboxa "Zapamiętaj mnie"

#### Preview (Podgląd)
- **Preview Login Page** - przycisk otwierający podgląd w nowym oknie

---

## 13. ⚙️ Advanced

**Ikona**: `dashicons-admin-tools`

### Sekcje:

#### Custom CSS (Własny CSS)
- **Custom CSS Editor** - edytor CSS z syntax highlighting
- **Apply to** - gdzie zastosować (Admin/Login/Both)
- **Minify CSS** - minifikuj CSS (toggle)

#### Custom JavaScript (Własny JavaScript)
- **Custom JS Editor** - edytor JS z syntax highlighting
- **Apply to** - gdzie zastosować (Admin/Login/Both)
- **Load in Footer** - ładuj w stopce (toggle)

#### Auto Palette Switch (Automatyczna Zmiana Palety)
- **Enable Auto Switch** - włącz automatyczną zmianę (toggle)
- **Time-based Switching** - zmiana na podstawie czasu
  - Morning (6:00-12:00) - paleta poranna
  - Afternoon (12:00-18:00) - paleta popołudniowa
  - Evening (18:00-22:00) - paleta wieczorna
  - Night (22:00-6:00) - paleta nocna

#### Backup & Restore (Kopia Zapasowa i Przywracanie)
- **Auto Backup** - automatyczna kopia przed zmianami (toggle)
- **Backup Frequency** - częstotliwość kopii (daily/weekly/monthly)
- **Max Backups** - maksymalna liczba kopii (1-10)
- **Create Backup Now** - utwórz kopię teraz
- **Backup List** - lista kopii zapasowych
  - Date/Time - data i czas
  - Size - rozmiar
  - Restore - przywróć
  - Download - pobierz
  - Delete - usuń

#### Import/Export (Import/Eksport)
- **Export Settings** - eksportuj ustawienia do JSON
- **Import Settings** - importuj ustawienia z JSON
- **Export Format** - format eksportu (JSON/PHP Array)
- **Include Custom Palettes** - dołącz własne palety (toggle)
- **Include Custom Templates** - dołącz własne szablony (toggle)

#### Reset Options (Opcje Resetowania)
- **Reset All Settings** - resetuj wszystkie ustawienia
- **Reset Specific Section** - resetuj konkretną sekcję (dropdown)
- **Clear Cache** - wyczyść cache
- **Clear Transients** - wyczyść transients

#### Performance (Wydajność)
- **Enable Caching** - włącz cache (toggle)
- **Cache Duration** - czas cache (1-24 godziny)
- **Minify CSS** - minifikuj CSS (toggle)
- **Minify JS** - minifikuj JS (toggle)
- **Lazy Load Images** - lazy loading obrazów (toggle)
- **Optimize Database** - optymalizuj bazę danych (przycisk)

#### Compatibility (Kompatybilność)
- **Disable for Specific Plugins** - wyłącz dla konkretnych pluginów
- **Disable for Specific Themes** - wyłącz dla konkretnych motywów
- **Compatibility Mode** - tryb kompatybilności (toggle)
- **Debug Mode** - tryb debugowania (toggle)

#### System Information (Informacje Systemowe)
- **WordPress Version** - wersja WordPress
- **PHP Version** - wersja PHP
- **MySQL Version** - wersja MySQL
- **Server Software** - oprogramowanie serwera
- **Memory Limit** - limit pamięci
- **Max Upload Size** - maksymalny rozmiar uploadu
- **Plugin Version** - wersja pluginu
- **Active Theme** - aktywny motyw

---

## Nawigacja i Funkcje Globalne

### Header (Nagłówek)
- **Tytuł**: "Modern Admin Styler" + badge wersji
- **Subtitle**: Opis pluginu
- **Dark Mode Toggle** - przełącznik trybu ciemnego (globalny)
- **Live Preview Toggle** - przełącznik podglądu na żywo
- **Reset All** - resetuj wszystkie ustawienia
- **Save Settings** - zapisz ustawienia (główny przycisk)

### Tab Navigation (Nawigacja Zakładek)
- **13 zakładek** z ikonami i etykietami
- **Keyboard accessible** - nawigacja klawiaturą (Tab, Arrow keys)
- **ARIA labels** - dla screen readerów
- **Active state** - wizualne oznaczenie aktywnej zakładki

### Loading States (Stany Ładowania)
- **Loading Overlay** - nakładka podczas ładowania
- **Spinner** - animowany spinner
- **Loading Text** - tekst "Loading..."

### Error Handling (Obsługa Błędów)
- **Error Boundary** - granica błędów
- **Error Message** - komunikat błędu
- **Reload Button** - przycisk przeładowania

### Notices (Powiadomienia)
- **Success** - powiadomienie sukcesu (zielone)
- **Error** - powiadomienie błędu (czerwone)
- **Warning** - ostrzeżenie (żółte)
- **Info** - informacja (niebieskie)
- **ARIA Live Region** - dla screen readerów

---

## Accessibility (Dostępność)

### Keyboard Navigation
- **Tab** - przejście do następnego elementu
- **Shift+Tab** - przejście do poprzedniego elementu
- **Arrow Keys** - nawigacja w zakładkach
- **Enter/Space** - aktywacja przycisku/toggle
- **Escape** - zamknięcie modala/dropdown

### Screen Reader Support
- **ARIA Labels** - etykiety dla wszystkich kontrolek
- **ARIA Descriptions** - opisy dla złożonych elementów
- **ARIA Live Regions** - dynamiczne powiadomienia
- **Role Attributes** - role dla semantyki
- **Focus Management** - zarządzanie fokusem

### Visual Accessibility
- **High Contrast Mode** - tryb wysokiego kontrastu
- **Focus Indicators** - wskaźniki fokusu
- **Color Contrast** - kontrast kolorów (WCAG AA)
- **Font Scaling** - skalowanie czcionek
- **Reduced Motion** - zmniejszone animacje

---

## Responsive Design

### Breakpoints
- **Desktop**: > 1200px
- **Tablet**: 768px - 1200px
- **Mobile**: < 768px

### Mobile Optimizations
- **Touch-friendly** - przyciski min. 44x44px
- **Collapsible Sections** - zwijane sekcje
- **Simplified UI** - uproszczony interfejs
- **Optimized Performance** - zoptymalizowana wydajność

---

## Performance

### Optimization Techniques
- **Lazy Loading** - leniwe ładowanie zakładek
- **Code Splitting** - podział kodu
- **Caching** - cache CSS/JS
- **Minification** - minifikacja zasobów
- **Debouncing** - debouncing dla live preview
- **Throttling** - throttling dla scroll events

### Loading Strategy
- **Critical CSS** - krytyczny CSS inline
- **Deferred JS** - odroczone ładowanie JS
- **Async Loading** - asynchroniczne ładowanie
- **Resource Hints** - preload/prefetch

---

## Podsumowanie

Plugin MASE oferuje **kompleksowy system dostosowywania** WordPress admin z:
- **13 zakładkami** ustawień
- **Ponad 500 opcji** konfiguracji
- **10 gotowych palet** kolorów
- **10 gotowych szablonów**
- **Pełną dostępnością** (WCAG 2.1 AA)
- **Responsywnym designem**
- **Wysoką wydajnością**

Każda zakładka jest **logicznie zorganizowana** i zawiera **intuicyjne kontrolki** z **podglądem na żywo**.
