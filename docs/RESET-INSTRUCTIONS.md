# Instrukcje po zmianach w kodzie

## Problem
Po zmianach w kodzie (zmiana domyślnej wartości `content_margin.left` z 20 na 0), stare ustawienia nadal są w bazie danych.

## Rozwiązanie

### Krok 1: Wyczyść cache
```bash
php clear-mase-cache.php
```

### Krok 2: Zresetuj ustawienia w WordPress
1. Przejdź do **Admin Styler** (strona ustawień wtyczki)
2. Kliknij przycisk **"Reset All"** w prawym górnym rogu
3. Potwierdź reset
4. Poczekaj na przeładowanie strony

### Krok 3: Sprawdź wyniki
Po resecie:
- ✅ Lewy margin powinien być 0px (brak odstępu od menu)
- ✅ Admin bar powinien mieć domyślne kolory WordPress
- ✅ Menu powinno mieć jednolity kolor (bez nakładania)

## Jeśli admin bar jest pusty

To może być problem z CSS. Sprawdź w DevTools (F12):

### 1. Sprawdź, czy admin bar istnieje w DOM
```javascript
document.querySelector('#wpadminbar')
```

### 2. Sprawdź style admin bara
```javascript
const bar = document.querySelector('#wpadminbar');
console.log('Display:', getComputedStyle(bar).display);
console.log('Visibility:', getComputedStyle(bar).visibility);
console.log('Opacity:', getComputedStyle(bar).opacity);
console.log('Z-index:', getComputedStyle(bar).zIndex);
```

### 3. Sprawdź zawartość admin bara
```javascript
document.querySelector('#wp-toolbar')
document.querySelectorAll('#wpadminbar .ab-item')
```

### 4. Sprawdź kolory
```javascript
const bar = document.querySelector('#wpadminbar');
console.log('Background:', getComputedStyle(bar).backgroundColor);
console.log('Color:', getComputedStyle(bar).color);
```

## Jeśli lewy margin nadal jest

### Sprawdź w DevTools
```javascript
const content = document.querySelector('#wpbody-content');
console.log('Margin-left:', getComputedStyle(content).marginLeft);
```

### Jeśli pokazuje 20px
Oznacza to, że reset nie zadziałał lub cache nie został wyczyszczony.

**Rozwiązanie:**
1. Wyczyść cache ponownie: `php clear-mase-cache.php`
2. Wyczyść cache przeglądarki (Ctrl+Shift+Delete)
3. Zresetuj ustawienia ponownie (przycisk "Reset All")
4. Przeładuj stronę z wymuszeniem (Ctrl+F5)

## Jeśli admin bar jest niewidoczny na stronie ustawień

To normalne zachowanie WordPress. Admin bar czasami jest ukryty na niektórych stronach administracyjnych.

**Aby zobaczyć admin bar:**
- Przejdź do Dashboard (wp-admin/)
- Lub do Posts, Pages, Media
- Tam admin bar powinien być widoczny

## Debug - sprawdź aktualne ustawienia

```bash
# W konsoli WordPress (wp-cli) lub przez kod PHP:
php -r "require 'wp-load.php'; print_r(get_option('mase_settings'));"
```

Sprawdź wartość `spacing.content_margin.left` - powinna być 0, nie 20.
