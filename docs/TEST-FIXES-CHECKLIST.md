# Lista Poprawek Testów - Szczegółowa

## 📋 CHECKLIST NAPRAW

---

## 🔴 PRIORYTET 1: Undefined Variables

### ✅ Plik: `tests/visual-interactive/scenarios/admin-bar/gradient.spec.cjs`

**Błędy do naprawy:**

1. **Linia ~70:** `linearBg is not defined`
```javascript
// PRZED (błąd):
console.log(`  Linear gradient: ${linearBg}`);

// PO (poprawka):
const linearBg = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).backgroundImage : 'none';
});
console.log(`  Linear gradient: ${linearBg}`);
```

2. **Linia ~80:** `angle45Bg is not defined`
```javascript
// Dodać przed użyciem:
const angle45Bg = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).backgroundImage : 'none';
});
```

3. **Linia ~100:** `radialBg is not defined`
```javascript
// Dodać przed użyciem:
const radialBg = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).backgroundImage : 'none';
});
```

4. **Linia ~115:** `conicBg is not defined`
```javascript
// Dodać przed użyciem:
const conicBg = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).backgroundImage : 'none';
});
```

5. **Linia ~160:** `noBg is not defined`
```javascript
// Dodać przed użyciem:
const noBg = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).backgroundImage : 'none';
});
```

6. **Linia ~220:** `reloadedBg is not defined`
```javascript
// Dodać przed użyciem:
const reloadedBg = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).backgroundImage : 'none';
});
```

---

### ✅ Plik: `tests/visual-interactive/scenarios/admin-bar/height.spec.cjs`

**Błędy do naprawy:**

1. **Linia ~50:** `originalHeight is not defined`
```javascript
// PRZED (błąd):
console.log(`  Original height: ${originalHeight}`);

// PO (poprawka):
const originalHeight = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).height : '0px';
});
console.log(`  Original height: ${originalHeight}`);
```

2. **Linia ~70:** `height60 is not defined`
```javascript
const height60 = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).height : '0px';
});
```

3. **Linia ~85:** `height28 is not defined`
```javascript
const height28 = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).height : '0px';
});
```

4. **Linia ~110:** `maxHeight is not defined`
```javascript
const maxHeight = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).height : '0px';
});
```

5. **Linia ~130:** `standardHeight is not defined`
```javascript
const standardHeight = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).height : '0px';
});
```

6. **Linia ~140:** `itemHeight, itemLineHeight is not defined`
```javascript
const { itemHeight, itemLineHeight } = await page.evaluate(() => {
  const item = document.querySelector('#wpadminbar .ab-item');
  if (!item) return { itemHeight: '0px', itemLineHeight: '0' };
  const styles = window.getComputedStyle(item);
  return {
    itemHeight: styles.height,
    itemLineHeight: styles.lineHeight
  };
});
```

7. **Linia ~160:** `finalHeight is not defined`
```javascript
const finalHeight = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).height : '0px';
});
```

8. **Linia ~190:** `reloadedHeight is not defined`
```javascript
const reloadedHeight = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).height : '0px';
});
```

9. **Linia ~210:** `tabletHeight is not defined`
```javascript
const tabletHeight = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).height : '0px';
});
```

---

### ✅ Plik: `tests/visual-interactive/scenarios/admin-bar/typography.spec.cjs`

**Błędy do naprawy:**

1. **Linia ~75:** `largerFontSize is not defined`
```javascript
// PRZED (błąd):
helpers.assert.contains(largerFontSize, '20', 'Font size should be 20px');

// PO (poprawka):
const largerFontSize = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).fontSize : '0px';
});
helpers.assert.contains(largerFontSize, '20', 'Font size should be 20px');
```

2. **Linia ~85:** `originalFontWeight is not defined`
```javascript
const originalFontWeight = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).fontWeight : '400';
});
```

3. **Linia ~95:** `newFontWeight is not defined`
```javascript
const newFontWeight = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).fontWeight : '400';
});
```

4. **Linia ~110:** `normalFontWeight is not defined`
```javascript
const normalFontWeight = await page.evaluate(() => {
  const adminBar = document.querySelector('#wpadminbar');
  return adminBar ? window.getComputedStyle(adminBar).fontWeight : '400';
});
```

---

## 🔴 PRIORYTET 2: Field Not Found Errors

### Problem: Nazwy pól nie odpowiadają rzeczywistym ID w HTML

**Krok 1:** Sprawdzić rzeczywiste ID pól w HTML

```bash
# Uruchomić w terminalu:
grep -r "id=\"admin-bar" includes/admin-settings-page.php includes/templates/
```

**Krok 2:** Stworzyć mapowanie w `helpers.cjs`

```javascript
// Dodać na początku klasy TestHelpers:
constructor(page, config) {
  this.page = page;
  this.config = config;
  this.screenshots = [];
  this.consoleErrors = [];
  
  // Mapowanie nazw pól test -> HTML ID
  this.fieldMapping = {
    // Admin Bar
    'admin-bar-bg-type': 'admin-bar-bg-type',
    'admin-bar-bg-color': 'admin-bar-bg-color',
    'admin-bar-text-color': 'admin-bar-text-color',
    'admin-bar-hover-color': 'admin-bar-hover-color',
    'admin-bar-height': 'admin-bar-height',
    'admin-bar-font-size': 'admin-bar-font-size',
    'admin-bar-font-weight': 'admin-bar-font-weight',
    'admin-bar-gradient-type': 'admin-bar-gradient-type',
    'admin-bar-gradient-angle': 'admin-bar-gradient-angle',
    'admin-bar-gradient-color-1': 'admin-bar-gradient-color-1',
    'admin-bar-gradient-color-2': 'admin-bar-gradient-color-2',
    
    // Content
    'content_text_color': 'content-text-color',
    'content_font_family': 'content-font-family',
    'content_font_size': 'content-font-size',
    
    // Dodać więcej mapowań...
  };
}
```

**Krok 3:** Zaktualizować metodę `changeSetting` aby używała mapowania

```javascript
async changeSetting(fieldName, value) {
  // Użyć mapowania jeśli istnieje
  const mappedFieldName = this.fieldMapping[fieldName] || fieldName;
  
  // Reszta kodu bez zmian...
  const field = await this.page.locator(`#${mappedFieldName}, [name="${mappedFieldName}"]`).first();
  // ...
}
```

---

## 🟡 PRIORYTET 3: Timeout Errors

### Problem: Elementy nie istnieją lub timeouty za krótkie

**Rozwiązanie 1:** Dodać sprawdzanie istnienia elementu

```javascript
// W helpers.cjs - dodać nową metodę:
async elementExists(selector, timeout = 1000) {
  try {
    await this.page.waitForSelector(selector, { timeout });
    return true;
  } catch {
    return false;
  }
}
```

**Rozwiązanie 2:** Użyć w testach

```javascript
// Zamiast:
await page.hover('#wpadminbar .ab-item:first-child');

// Użyć:
if (await helpers.elementExists('#wpadminbar')) {
  await page.hover('#wpadminbar .ab-item:first-child');
} else {
  console.log('  ℹ️ Admin bar not visible on settings page - skipping hover test');
}
```

**Rozwiązanie 3:** Zwiększyć timeouty w config

```javascript
// W config.cjs:
timeouts: {
  navigation: 30000,  // było: 30000
  element: 15000,     // było: 10000 - ZWIĘKSZYĆ
  ajax: 15000,        // było: 10000 - ZWIĘKSZYĆ
  save: 10000,        // było: 5000 - ZWIĘKSZYĆ
}
```

---

## 🟡 PRIORYTET 4: Screenshot Quality Error

### Plik: `tests/visual-interactive/helpers.cjs`

**Błąd:**
```
page.screenshot: options.quality is unsupported for the png screenshots
```

**Poprawka:**

```javascript
// Znaleźć metodę takeScreenshot (około linia 200-250)
async takeScreenshot(name, options = {}) {
  try {
    const timestamp = Date.now();
    const filename = `${name}-${timestamp}.png`;
    const filepath = `${this.config.output.screenshotsDir}/${filename}`;

    const screenshotOptions = {
      path: filepath,
      fullPage: options.fullPage || false,
      // USUNĄĆ tę linię:
      // quality: this.config.output.screenshotQuality
    };

    await this.page.screenshot(screenshotOptions);
    this.screenshots.push({ name, filepath, timestamp });
    
    return filepath;
  } catch (error) {
    console.error(`Failed to take screenshot "${name}":`, error.message);
    return null;
  }
}
```

---

## 🟡 PRIORYTET 5: Syntax Error

### Plik: `tests/visual-interactive/scenarios/live-preview/comprehensive.spec.cjs`

**Błąd:**
```
Unexpected token 'const'
```

**Akcja:**
1. Otworzyć plik
2. Sprawdzić składnię JavaScript
3. Upewnić się, że wszystkie nawiasy są zamknięte
4. Sprawdzić czy nie ma `const` poza funkcją

---

## 📊 PODSUMOWANIE NAPRAW

### Pliki do edycji:

1. ✅ `tests/visual-interactive/scenarios/admin-bar/gradient.spec.cjs` - 6 zmiennych
2. ✅ `tests/visual-interactive/scenarios/admin-bar/height.spec.cjs` - 9 zmiennych
3. ✅ `tests/visual-interactive/scenarios/admin-bar/typography.spec.cjs` - 4 zmienne
4. ✅ `tests/visual-interactive/helpers.cjs` - mapowanie pól + screenshot fix
5. ✅ `tests/visual-interactive/config.cjs` - zwiększenie timeoutów
6. ✅ `tests/visual-interactive/scenarios/live-preview/comprehensive.spec.cjs` - syntax fix

### Szacowany czas:
- Undefined variables: 30 minut
- Field mapping: 45 minut
- Timeout fixes: 20 minut
- Screenshot fix: 5 minut
- Syntax fix: 10 minut

**RAZEM: ~2 godziny**

---

## 🎯 KOLEJNOŚĆ NAPRAW

1. **Najpierw:** Napraw undefined variables (najszybsze, największy wpływ)
2. **Potem:** Zweryfikuj nazwy pól i stwórz mapowanie
3. **Następnie:** Zwiększ timeouty i dodaj sprawdzanie elementów
4. **Na koniec:** Drobne poprawki (screenshot, syntax)

---

## ✅ WERYFIKACJA

Po każdej naprawie uruchomić:

```bash
# Test pojedynczej zakładki:
node tests/visual-interactive/runner.cjs --mode headless --tab admin-bar

# Test pojedynczego testu:
node tests/visual-interactive/runner.cjs --mode headless --test "Admin Bar Colors"

# Wszystkie testy:
node tests/visual-interactive/runner.cjs --mode headless
```

**Cel:** 39/39 testów passed ✅
