# Analiza struktury lewego menu WordPress

## Struktura DOM WordPress Admin Menu

```html
<div id="adminmenuwrap">
  <div id="adminmenuback"></div>
  <ul id="adminmenu">
    <li class="menu-top">
      <a href="...">
        <div class="wp-menu-image">...</div>
        <div class="wp-menu-name">Dashboard</div>
      </a>
    </li>
    <!-- więcej elementów menu -->
  </ul>
</div>
```

## Elementy i ich role:

### 1. `#adminmenuwrap` (wrapper)
- Kontener dla całego menu
- Position: fixed (domyślnie)
- Z-index: 9990
- Width: 160px (domyślnie)

### 2. `#adminmenuback` (tło)
- Tło pod menu
- Position: absolute
- Wypełnia cały `#adminmenuwrap`
- Używane do efektów wizualnych

### 3. `#adminmenu` (menu)
- Lista elementów menu
- Position: relative
- Zawiera wszystkie linki i submenu

## Problem: Nakładające się kolory

Gdy ustawiamy `background-color` na wszystkich trzech elementach:
```css
#adminmenu { background-color: #23282d; }
#adminmenuback { background-color: #23282d; }
#adminmenuwrap { background-color: #23282d; }
```

Efekt: **3 warstwy tego samego koloru** = ciemniejszy kolor!

## Rozwiązanie

Ustawiać tło tylko na JEDNYM elemencie:
- Opcja 1: Tylko `#adminmenuwrap` (wrapper)
- Opcja 2: Tylko `#adminmenuback` (tło)
- Opcja 3: Tylko `#adminmenu` (menu)

WordPress domyślnie używa `#adminmenu` dla tła.

## Sprawdzenie w kodzie MASE

Linie w `class-mase-css-generator.php`:
- Linia 962-964: Ustawia background na wszystkich trzech
- Linia 977-979: Ponownie ustawia na wszystkich trzech (border radius)
- Linia 3108-3110: Glassmorphism też ustawia na wszystkich trzech

**To jest źródło problemu!**
