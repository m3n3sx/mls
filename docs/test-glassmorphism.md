# Test Glass Effect - Instrukcje

## Problem
Na stronie ustawień wtyczki (Admin Styler) nie ma admin bara, więc nie można zobaczyć efektu glassmorphism.

## Jak przetestować glass effect:

### Krok 1: Włącz Glass Effect
1. Przejdź do **Admin Styler → Effects** (zakładka Effects)
2. Znajdź sekcję **Admin Bar Visual Effects**
3. Włącz **Glassmorphism** (przełącznik)
4. Ustaw **Blur Intensity** na 20-30px
5. Kliknij **Save Settings**

### Krok 2: Przetestuj na innej stronie
Przejdź do jednej z tych stron, aby zobaczyć admin bar z glass effect:
- **Dashboard** (wp-admin/)
- **Posts** (wp-admin/edit.php)
- **Pages** (wp-admin/edit.php?post_type=page)
- **Media** (wp-admin/upload.php)

### Krok 3: Sprawdź efekt
Admin bar powinien mieć:
- ✓ Półprzezroczyste tło (70% opacity)
- ✓ Efekt blur (rozmycie tła za admin barem)
- ✓ Subtelny cień na dole
- ✓ Kolory z twojej palety (nie białe!)
- ✓ Widoczny tekst

### Krok 4: Test Admin Menu
1. Wróć do **Admin Styler → Effects**
2. Znajdź sekcję **Admin Menu Visual Effects**
3. Włącz **Glassmorphism** dla menu
4. Zapisz i sprawdź na Dashboard

## Alternatywny test - Live Preview

Jeśli masz włączony **Live Preview**:
1. Na stronie ustawień włącz **Live Preview** (przełącznik w górnym prawym rogu)
2. Włącz **Glassmorphism** w zakładce Effects
3. Otwórz nową kartę z Dashboard
4. Powinieneś zobaczyć efekt natychmiast

## Debugowanie

Jeśli efekt nie działa:

### 1. Sprawdź cache
```bash
php clear-mase-cache.php
```

### 2. Sprawdź w DevTools (F12)
Otwórz Console i sprawdź:
```javascript
// Sprawdź, czy CSS jest załadowany
document.querySelector('#mase-custom-css')

// Sprawdź style admin bara
getComputedStyle(document.querySelector('#wpadminbar')).backdropFilter
```

### 3. Sprawdź ustawienia
W DevTools → Elements → #wpadminbar powinno być:
```css
backdrop-filter: blur(20px) !important;
background: rgba(35, 40, 45, 0.7) !important;
border-bottom: 1px solid rgba(35, 40, 45, 0.3) !important;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
```

## Uwaga o przeglądarkach

Glass effect (backdrop-filter) wymaga:
- Chrome 76+
- Firefox 103+
- Safari 9+
- Edge 79+

Starsze przeglądarki pokażą solidne tło bez blur.
