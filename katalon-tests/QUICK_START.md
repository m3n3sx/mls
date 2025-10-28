# 🚀 Quick Start - MASE Katalon Tests

## Szybki start w 5 minut

### Krok 1: Otwórz Katalon Studio (30 sekund)

```bash
cd /home/ooxo/Pobrane/Katalon_Studio_Enterprise_Linux_64-10.3.2
./katalon
```

### Krok 2: Otwórz projekt (30 sekund)

W Katalon Studio:
1. **File** → **Open Project**
2. Wybierz: `/var/www/html/wp-content/plugins/woow-admin/katalon-tests/MASE-Tests.prj`
3. Kliknij **OK**

### Krok 3: Uruchom Smoke Tests (5 minut)

1. W **Test Explorer** znajdź: `Test Suites/TS01_Smoke_Tests`
2. Kliknij prawym przyciskiem → **Run**
3. Wybierz przeglądarkę: **Chrome**
4. Obserwuj wykonanie testów

### Krok 4: Zobacz wyniki

Po zakończeniu testów:
- **Zrzuty ekranu**: `katalon-tests/Screenshots/`
- **Raport HTML**: `katalon-tests/Reports/Smoke_Tests_[timestamp]/report.html`

---

## Alternatywnie: Uruchom z terminala

```bash
cd /var/www/html/wp-content/plugins/woow-admin/katalon-tests
./run-tests.sh
```

Wybierz opcję **1** (Smoke Tests)

---

## Co dalej?

### Uruchom wszystkie testy palet kolorów (30 min)
```bash
./run-tests.sh
# Wybierz opcję 2
```

### Uruchom wszystkie testy szablonów (45 min)
```bash
./run-tests.sh
# Wybierz opcję 3
```

### Uruchom pełną regresję (2-3 godz)
```bash
./run-tests.sh
# Wybierz opcję 5
```

---

## Rozwiązywanie problemów

### WordPress nie działa?
```bash
sudo systemctl start apache2
curl -I http://localhost/wp-admin
```

### Katalon nie znajduje elementów?
- Sprawdź czy wtyczka MASE jest aktywowana
- Sprawdź czy jesteś zalogowany jako admin
- Zwiększ timeout w `Profiles/default.glbl`

### Brak zrzutów ekranu?
```bash
chmod 777 katalon-tests/Screenshots
```

---

## Dokumentacja

- **Pełna dokumentacja**: `README.md`
- **Lista testów**: `TEST_CASES_LIST.md`
- **Skrypt runner**: `run-tests.sh`

---

## Wsparcie

Jeśli masz problemy:
1. Sprawdź logi: `katalon-tests/.katalon/logs/`
2. Sprawdź raporty: `katalon-tests/Reports/`
3. Sprawdź zrzuty: `katalon-tests/Screenshots/`

---

**Gotowe! Miłego testowania! 🎉**
