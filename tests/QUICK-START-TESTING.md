# Quick Start - Testing MASE Plugin

## 🚀 Najszybszy sposób (30 sekund)

### Browser Tests - Zero Setup

1. Otwórz WordPress admin: http://localhost:8080/wp-admin
2. Przejdź do MASE settings: http://localhost:8080/wp-admin/admin.php?page=mase-settings
3. Otwórz konsolę przeglądarki (F12)
4. Skopiuj i wklej zawartość pliku: `tests/simple-browser-tests.js`
5. Uruchom: `runAllTests()`

**Gotowe!** Zobaczysz wyniki w konsoli.

---

## 🎯 Dla poważnych testów (5 minut)

### Cypress - Najbardziej stabilny

```bash
# 1. Zainstaluj Cypress (tylko raz)
npm install --save-dev cypress

# 2. Uruchom Cypress UI
npx cypress open

# 3. Wybierz test: tests/cypress/e2e/mase-basic.cy.js

# 4. Lub uruchom headless:
npx cypress run
```

---

## 📊 Porównanie wyników

| Framework | Pass Rate | Czas | Stabilność |
|-----------|-----------|------|------------|
| Browser Tests | ? | 30s | ⭐⭐⭐⭐⭐ |
| Cypress | ? | 2min | ⭐⭐⭐⭐⭐ |
| Playwright | 24% | 2min | ⭐⭐⭐ |

---

## 🔧 Troubleshooting

### WordPress nie działa?
```bash
curl http://localhost:8080/wp-login.php
# Powinno zwrócić HTML z formularzem logowania
```

### Plugin nie aktywny?
```bash
docker exec mase_wordpress php /tmp/activate-plugin.php
```

### Cypress nie instaluje się?
```bash
# Użyj Browser Tests - nie wymagają instalacji!
```

---

## 📖 Więcej informacji

- [Porównanie frameworków](../TESTING-FRAMEWORKS-COMPARISON.md)
- [Pełna dokumentacja testów](./TESTING-GUIDE.md)
- [Wszystkie scenariusze](./visual-interactive/TEST-SCENARIOS-COMPLETE.md)
