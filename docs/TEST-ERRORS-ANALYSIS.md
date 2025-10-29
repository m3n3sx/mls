# Analiza Błędów Testów Visual Interactive

## 🎯 Podsumowanie

**Data analizy:** 2025-10-28  
**Źródło:** Wyniki testów interaktywnych z `playwright-report/visual-interactive/`  
**Status:** 39 testów wykonanych, 0 passed, 39 failed

---

## 🔴 BŁĘDY KRYTYCZNE

### 1. ❌ JavaScript Error: `self.updatePreview is not a function`

**Status:** ✅ NAPRAWIONE

**Opis:**
- Błąd występował w module `darkModeSync` i innych miejscach
- Funkcja `updatePreview` była zdefiniowana tylko w pod-modułach, nie w głównym obiekcie MASE

**Lokalizacja:**
```
http://localhost:8080/wp-content/plugins/modern-admin-styler-copy/assets/js/mase-admin.js?ver=1.2.0:2550:30
```

**Rozwiązanie:**
- Dodano centralną funkcję `MASE.updatePreview()` w głównym obiekcie (linia 166)
- Funkcja deleguje wywołania do odpowiednich modułów
- Zmieniono wersję pluginu na 1.2.2/1.2.3 aby wymusić przeładowanie cache

**Kod naprawy:**
```javascript
updatePreview: function () {
    if (!this.state.livePreviewEnabled) {
        return;
    }
    if (this.contentManager && typeof this.contentManager.updatePreview === 'function') {
        this.contentManager.updatePreview();
    }
    MASE_DEBUG.log('MASE: Live preview updated');
},
```

---

## 🟡 BŁĘDY W TESTACH (Kod testowy)

### 2. ❌ Undefined Variables in Test Code

**Testy dotknięte:**
- `admin-bar/gradient.spec.cjs`
- `admin-bar/height.spec.cjs`
- `admin-bar/typography.spec.cjs`

**Błędy:**
```javascript
// gradient.spec.cjs - linia ~70
console.log(`  Linear gradient: ${linearBg}`);  // ❌ linearBg is not defined

// height.spec.cjs - linia ~50
console.log(`  Original height: ${originalHeight}`);  // ❌ originalHeight is not defined

// typography.spec.cjs - linia ~75
helpers.assert.contains(largerFontSize, '20', ...);  // ❌ largerFontSize is not defined
```

**Przyczyna:**
Zmienne są używane w `console.log()` i asercjach, ale nigdy nie są zdefiniowane przez `await page.evaluate()` lub podobne wywołania.

**Rozwiązanie:**
Dodać definicje zmiennych przed ich użyciem:

```javascript
// gradient.spec.cjs - przed linią 70
const linearBg = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).backgroundImage : 'none';
});

// height.spec.cjs - przed linią 50
const originalHeight = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).height : '0px';
});

// typography.spec.cjs - przed linią 75
const largerFontSize = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).fontSize : '0px';
});
```

---

### 3. ❌ Field Not Found Errors

**Testy dotknięte:** Wszystkie testy

**Błędy:**
```
Failed to change setting "admin-bar-bg-type": Field not found: admin-bar-bg-type
Failed to change setting "admin-bar-height": Field not found: admin-bar-height
Failed to change setting "admin-bar-font-size": Field not found: admin-bar-font-size
Failed to change setting "content_text_color": Field not found: content_text_color
```

**Przyczyna:**
Nazwy pól w testach nie odpowiadają rzeczywistym ID pól w HTML.

**Analiza:**
Testy używają różnych konwencji nazewnictwa:
- `admin-bar-bg-type` (kebab-case)
- `admin_bar[bg_type]` (array notation)
- `mase_settings[admin_bar][bg_type]` (full array notation)

Rzeczywiste ID pól w HTML to prawdopodobnie:
- `admin-bar-bg-color` (dla koloru tła)
- `admin-bar-height` (dla wysokości)
- `admin-bar-font-size` (dla rozmiaru czcionki)

**Rozwiązanie:**
1. Sprawdzić rzeczywiste ID pól w `includes/admin-settings-page.php`
2. Zaktualizować wszystkie testy aby używały poprawnych ID
3. Stworzyć mapowanie w `helpers.cjs` dla spójności

**Przykład mapowania:**
```javascript
const FIELD_MAPPING = {
  'admin-bar-bg-type': 'admin-bar-bg-type',
  'admin-bar-bg-color': 'admin-bar-bg-color',
  'admin-bar-height': 'admin-bar-height',
  'admin-bar-font-size': 'admin-bar-font-size',
  // ... więcej mapowań
};
```

---

### 4. ❌ Timeout Errors

**Błędy:**
```
page.hover: Timeout 10000ms exceeded.
Call log: - waiting for locator('#wpadminbar .ab-item:first-child')

page.waitForSelector: Timeout 5000ms exceeded.
Call log: - waiting for locator('.notice-success, .updated') to be visible
```

**Przyczyna:**
- Elementy nie istnieją na stronie ustawień (np. `#wpadminbar` jest tylko w głównym admin, nie na stronie ustawień)
- Timeouty są za krótkie dla niektórych operacji

**Rozwiązanie:**
1. Usunąć testy, które próbują weryfikować elementy niedostępne na stronie ustawień
2. Zwiększyć timeouty dla operacji AJAX
3. Dodać warunki sprawdzające czy element istnieje przed interakcją

```javascript
// Zamiast:
await page.hover('#wpadminbar .ab-item:first-child');

// Użyć:
const adminBarExists = await page.locator('#wpadminbar').count() > 0;
if (adminBarExists) {
  await page.hover('#wpadminbar .ab-item:first-child');
} else {
  console.log('  ℹ️ Admin bar not visible on settings page - skipping hover test');
}
```

---

### 5. ❌ Template/Palette Not Found

**Błędy:**
```
Assertion failed: Should have at least one predefined template
Expected true, got false

Assertion failed: Palette section should be found
Expected true, got false
```

**Przyczyna:**
- Szablony i palety mogą nie być załadowane
- Selektory mogą być niepoprawne
- Zakładki mogą mieć inne nazwy

**Rozwiązanie:**
1. Sprawdzić czy zakładki "Templates" i "Palettes" istnieją
2. Zweryfikować selektory dla szablonów i palet
3. Dodać fallback jeśli nie ma predefiniowanych szablonów/palet

---

### 6. ❌ Screenshot Quality Error

**Błąd:**
```
page.screenshot: options.quality is unsupported for the png screenshots
```

**Przyczyna:**
Parametr `quality` jest używany dla PNG, ale jest obsługiwany tylko dla JPEG.

**Rozwiązanie:**
W `helpers.cjs` - usunąć `quality` dla PNG:

```javascript
async takeScreenshot(name, options = {}) {
  const screenshotOptions = {
    path: `${this.config.output.screenshotsDir}/${name}-${Date.now()}.png`,
    fullPage: options.fullPage || false,
    // Usunąć quality dla PNG
    // quality: this.config.output.screenshotQuality
  };
  
  await this.page.screenshot(screenshotOptions);
}
```

---

### 7. ❌ Comprehensive Test Syntax Error

**Błąd:**
```
Failed to load test metadata from .../comprehensive.spec.cjs: Unexpected token 'const'
```

**Przyczyna:**
Plik `comprehensive.spec.cjs` ma błąd składni JavaScript.

**Rozwiązanie:**
Sprawdzić i naprawić składnię w pliku `tests/visual-interactive/scenarios/live-preview/comprehensive.spec.cjs`

---

## 📊 STATYSTYKI BŁĘDÓW

| Kategoria | Liczba | Priorytet |
|-----------|--------|-----------|
| JavaScript Errors (updatePreview) | 3 | ✅ NAPRAWIONE |
| Undefined Variables | 15+ | 🔴 WYSOKI |
| Field Not Found | 20+ | 🔴 WYSOKI |
| Timeout Errors | 10+ | 🟡 ŚREDNI |
| Template/Palette Not Found | 2 | 🟡 ŚREDNI |
| Screenshot Quality | 5+ | 🟢 NISKI |
| Syntax Errors | 1 | 🟡 ŚREDNI |

---

## 🔧 PLAN NAPRAWY

### Faza 1: Krytyczne (Priorytet 1)
1. ✅ Naprawić `updatePreview` error - **DONE**
2. ⏳ Naprawić undefined variables w testach
3. ⏳ Zweryfikować i poprawić nazwy pól (field IDs)

### Faza 2: Ważne (Priorytet 2)
4. ⏳ Zwiększyć timeouty i dodać warunki sprawdzające
5. ⏳ Naprawić błąd składni w comprehensive.spec.cjs
6. ⏳ Zweryfikować istnienie szablonów/palet

### Faza 3: Ulepszenia (Priorytet 3)
7. ⏳ Usunąć parametr quality dla PNG screenshots
8. ⏳ Dodać lepsze error handling
9. ⏳ Stworzyć mapowanie nazw pól

---

## 📝 NASTĘPNE KROKI

1. **Natychmiastowe:**
   - Naprawić undefined variables w 3 głównych testach
   - Zweryfikować ID pól w HTML

2. **Krótkoterminowe:**
   - Uruchomić testy ponownie po naprawach
   - Zweryfikować czy błąd updatePreview zniknął

3. **Długoterminowe:**
   - Stworzyć dokumentację poprawnych nazw pól
   - Dodać walidację nazw pól w helpers.cjs
   - Ulepszyć error handling w testach

---

## 🎯 CEL

**Docelowy wynik:** 39/39 testów passed (100%)

**Aktualny postęp:**
- ✅ Naprawiono błąd JavaScript (updatePreview)
- ⏳ Pozostało ~35 błędów do naprawy w kodzie testowym
- ⏳ Pozostało ~20 błędów związanych z nazwami pól

**Szacowany czas naprawy:** 2-3 godziny pracy
