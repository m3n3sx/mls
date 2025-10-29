# Naprawa nakładających się kolorów w lewym menu

## Problem

Lewe menu WordPress miało nakładające się kolory - wyglądało na ciemniejsze niż powinno.

### Przyczyna

WordPress admin menu składa się z 3 warstw:
```html
<div id="adminmenuwrap">        <!-- Wrapper -->
  <div id="adminmenuback"></div> <!-- Warstwa tła -->
  <ul id="adminmenu">...</ul>    <!-- Lista menu -->
</div>
```

**Błąd:** Ustawialiśmy `background-color` na WSZYSTKICH trzech elementach:
```css
#adminmenu, #adminmenuback, #adminmenuwrap {
  background-color: #23282d;
}
```

**Efekt:** 3 warstwy tego samego koloru = **3x ciemniejszy kolor!**

## Rozwiązanie

Ustawiamy tło tylko na `#adminmenuback` (warstwa tła):

### 1. Normalne tło (bez glassmorphism)
```css
/* Tylko #adminmenuback ma tło */
#adminmenuback {
  background-color: #23282d;
}

/* Pozostałe są przezroczyste */
#adminmenu, #adminmenuwrap {
  background-color: transparent;
  background-image: none;
}
```

### 2. Glassmorphism
```css
/* Tylko #adminmenuback ma glass effect */
#adminmenuback {
  backdrop-filter: blur(20px);
  background: rgba(35, 40, 45, 0.7);
}

/* Pozostałe są przezroczyste */
#adminmenu, #adminmenuwrap {
  background-color: transparent;
  background-image: none;
}

/* Border i shadow na wrapper */
#adminmenuwrap {
  border-right: 1px solid rgba(35, 40, 45, 0.3);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}
```

## Dlaczego #adminmenuback?

1. **Wypełnia cały wrapper** - nawet gdy menu ma `height: auto` (content mode)
2. **Jest warstwą tła** - to jego przeznaczenie w strukturze WordPress
3. **Nie koliduje z zawartością** - `#adminmenu` może być przezroczyste

## Zmiany w kodzie

**Plik:** `includes/class-mase-css-generator.php`

### Funkcja: `generate_admin_menu_css()` (linia ~960)
```php
// PRZED (błąd):
$css .= 'body.wp-admin #adminmenu,';
$css .= 'body.wp-admin #adminmenuback,';
$css .= 'body.wp-admin #adminmenuwrap {';
$css .= 'background-color: ' . $bg_color . ' !important;';
$css .= '}';

// PO (poprawka):
$css .= 'body.wp-admin #adminmenuback {';
$css .= 'background-color: ' . $bg_color . ' !important;';
$css .= '}';

$css .= 'body.wp-admin #adminmenu,';
$css .= 'body.wp-admin #adminmenuwrap {';
$css .= 'background-color: transparent !important;';
$css .= 'background-image: none !important;';
$css .= '}';
```

### Funkcja: `generate_glassmorphism_css()` (linia ~3150)
```php
// PRZED (błąd):
$css .= 'body.wp-admin #adminmenu,';
$css .= 'body.wp-admin #adminmenuback,';
$css .= 'body.wp-admin #adminmenuwrap{';
$css .= 'backdrop-filter:blur(' . $blur_intensity . 'px)!important;';
$css .= 'background:' . $rgba_bg . '!important;';
$css .= '}';

// PO (poprawka):
$css .= 'body.wp-admin #adminmenuback{';
$css .= 'backdrop-filter:blur(' . $blur_intensity . 'px)!important;';
$css .= 'background:' . $rgba_bg . '!important;';
$css .= '}';

$css .= 'body.wp-admin #adminmenu,';
$css .= 'body.wp-admin #adminmenuwrap {';
$css .= 'background-color: transparent !important;';
$css .= 'background-image: none !important;';
$css .= '}';
```

## Testowanie

1. Wyczyść cache: `php clear-mase-cache.php`
2. Odśwież stronę WordPress (Ctrl+F5)
3. Sprawdź lewe menu:
   - ✅ Kolor powinien być jednolity (nie ciemniejszy)
   - ✅ Glassmorphism powinien działać poprawnie
   - ✅ Height mode (full/content) powinien działać

## Dodatkowe korzyści

- **Lepsza wydajność** - mniej warstw CSS do renderowania
- **Zgodność z WordPress** - używamy struktury zgodnie z przeznaczeniem
- **Łatwiejsze debugowanie** - jedno miejsce dla tła
