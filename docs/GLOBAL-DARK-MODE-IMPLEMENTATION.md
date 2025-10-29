# Globalny Dark Mode - Implementacja

## Co zostało dodane

### 1. Floating Action Button (FAB)
- **Lokalizacja:** Prawy dolny róg ekranu
- **Widoczność:** Na wszystkich stronach WordPress admin
- **Funkcja:** Przełączanie między trybem jasnym i ciemnym

### 2. Pliki

**PHP:**
- `includes/class-mase-admin.php`
  - `enqueue_global_dark_mode()` - ładuje CSS i JS
  - `render_global_dark_mode_fab()` - renderuje przycisk FAB
  - Hook: `admin_enqueue_scripts` - ładuje assety
  - Hook: `admin_footer` - renderuje FAB

**JavaScript:**
- `assets/js/mase-global-dark-mode.js` (NOWY PLIK)
  - Lekki skrypt (~200 linii)
  - Przełączanie dark/light mode
  - Zapisywanie do localStorage
  - Zapisywanie do user meta (AJAX)
  - Skrót klawiszowy: Ctrl+Shift+D

**CSS:**
- `assets/css/mase-admin.css` (już istnieje)
  - Style dla `.mase-dark-mode-fab`
  - Linie ~10895-11100

### 3. Funkcjonalność

**Przełączanie:**
- Kliknięcie FAB
- Skrót klawiszowy: Ctrl+Shift+D
- Automatyczne ładowanie z localStorage
- Synchronizacja z user meta

**Zapisywanie:**
- localStorage (natychmiastowe, lokalne)
- User meta (przez AJAX, globalne dla użytkownika)

**Ikony:**
- Light mode: 🌙 (księżyc)
- Dark mode: ☀️ (słońce)

## Jak to działa

### 1. Inicjalizacja (przy ładowaniu strony)

```javascript
// 1. Sprawdź localStorage
var savedMode = localStorage.getItem('mase_dark_mode');

// 2. Jeśli 'dark', dodaj klasy CSS
if (savedMode === 'dark') {
    $('html').attr('data-theme', 'dark');
    $('body').addClass('mase-dark-mode');
}
```

### 2. Przełączanie (kliknięcie FAB)

```javascript
// 1. Zmień klasy CSS
$('html').attr('data-theme', 'dark'); // lub removeAttr
$('body').addClass('mase-dark-mode'); // lub removeClass

// 2. Zaktualizuj FAB (ikona, tooltip, aria-*)
$fab.find('.dashicons').removeClass('dashicons-moon').addClass('dashicons-sun');

// 3. Zapisz do localStorage
localStorage.setItem('mase_dark_mode', 'dark');

// 4. Zapisz do serwera (AJAX)
$.ajax({
    url: ajaxUrl,
    data: {
        action: 'mase_toggle_dark_mode',
        mode: 'dark'
    }
});
```

### 3. Zapisywanie na serwerze (PHP)

```php
// Handler AJAX
public function handle_ajax_toggle_dark_mode() {
    check_ajax_referer('mase_toggle_dark_mode', 'nonce');
    
    $mode = sanitize_text_field($_POST['mode']);
    $user_id = get_current_user_id();
    
    update_user_meta($user_id, 'mase_dark_mode_preference', $mode);
    
    wp_send_json_success();
}
```

## CSS Classes

**Dark Mode aktywny:**
```html
<html data-theme="dark">
<body class="mase-dark-mode">
```

**Light Mode aktywny:**
```html
<html>
<body>
```

## Stylowanie własnych elementów

Jeśli chcesz dodać własne style dla dark mode:

```css
/* Light mode (default) */
.my-element {
    background-color: #ffffff;
    color: #000000;
}

/* Dark mode */
html[data-theme="dark"] .my-element,
body.mase-dark-mode .my-element {
    background-color: #1a1a1a;
    color: #e0e0e0;
}
```

## Accessibility

**ARIA attributes:**
- `aria-label` - opisuje akcję przycisku
- `aria-pressed` - stan przycisku (true/false)
- `role="button"` - semantyczna rola

**Screen reader:**
- `.sr-only` - tekst tylko dla czytników ekranu
- Tooltip z nazwą trybu

**Keyboard:**
- Skrót: Ctrl+Shift+D
- Focus visible (outline)

## Testowanie

### 1. Test podstawowy
1. Otwórz dowolną stronę WordPress admin
2. Kliknij FAB w prawym dolnym rogu
3. Sprawdź, czy tło się zmienia
4. Odśwież stronę - tryb powinien być zachowany

### 2. Test localStorage
```javascript
// W konsoli (F12):
localStorage.getItem('mase_dark_mode') // powinno zwrócić 'dark' lub 'light'
```

### 3. Test user meta
```php
// W PHP:
$user_id = get_current_user_id();
$mode = get_user_meta($user_id, 'mase_dark_mode_preference', true);
echo $mode; // 'dark' lub 'light'
```

### 4. Test skrótu klawiszowego
1. Naciśnij Ctrl+Shift+D
2. Tryb powinien się przełączyć

### 5. Test na różnych stronach
- Dashboard
- Posts
- Pages
- Media
- Settings
- MASE Settings

## Wydajność

**Rozmiar:**
- CSS: ~5KB (już załadowany)
- JS: ~6KB (nowy plik)
- Razem: ~11KB

**Ładowanie:**
- CSS i JS ładowane na wszystkich stronach admin
- Minimalny wpływ na wydajność
- Brak skanowania DOM
- Brak MutationObserver

**Porównanie ze starym rozwiązaniem:**
- Stary: ~350 linii CSS + ~150 linii JS + skanowanie DOM
- Nowy: ~50 linii CSS + ~200 linii JS + brak skanowania
- Oszczędność: ~250 linii kodu + lepsza wydajność

## Troubleshooting

### FAB nie jest widoczny
1. Sprawdź, czy CSS jest załadowany:
   ```javascript
   $('link[href*="mase-admin.css"]').length // powinno być > 0
   ```
2. Sprawdź, czy FAB jest w DOM:
   ```javascript
   $('#mase-global-dark-mode-fab').length // powinno być 1
   ```

### Dark mode się nie przełącza
1. Sprawdź console (F12) - czy są błędy?
2. Sprawdź, czy JS jest załadowany:
   ```javascript
   typeof MASEGlobalDarkMode // powinno być 'object'
   ```
3. Sprawdź localStorage:
   ```javascript
   localStorage.getItem('mase_dark_mode')
   ```

### Tryb nie jest zachowywany
1. Sprawdź, czy localStorage działa:
   ```javascript
   localStorage.setItem('test', '1');
   localStorage.getItem('test'); // powinno zwrócić '1'
   ```
2. Sprawdź, czy AJAX działa:
   - Otwórz Network tab (F12)
   - Przełącz tryb
   - Sprawdź, czy jest request do `admin-ajax.php`

## Przyszłe ulepszenia

1. **Auto dark mode** - wykrywanie preferencji systemu
   ```javascript
   if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
       // Enable dark mode
   }
   ```

2. **Harmonogram** - automatyczne przełączanie o określonych godzinach
3. **Animacje** - płynne przejścia między trybami
4. **Więcej motywów** - nie tylko dark/light, ale też sepia, high contrast
