# 📦 Instalacja i Konfiguracja Katalon Studio dla MASE Tests

## 🎯 Cel

Ten dokument przeprowadzi Cię przez proces instalacji i konfiguracji Katalon Studio do testowania wtyczki Modern Admin Styler Enterprise.

---

## ✅ Wymagania wstępne

### 1. System operacyjny
- ✅ Linux (Ubuntu, Debian, Fedora, etc.)
- ✅ Windows 10/11
- ✅ macOS 10.15+

### 2. Java
Katalon Studio wymaga Java 8 lub nowszej.

**Sprawdź wersję Java:**
```bash
java -version
```

**Jeśli Java nie jest zainstalowana:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-11-jdk

# Fedora
sudo dnf install java-11-openjdk

# macOS (z Homebrew)
brew install openjdk@11
```

### 3. WordPress
- WordPress 5.8+ zainstalowany na http://localhost
- Wtyczka MASE 1.2.0 aktywowana
- Konto administratora: admin / admin123

---

## 📥 Instalacja Katalon Studio

### Metoda 1: Pobierz ze strony (Zalecane)

1. **Przejdź na stronę Katalon:**
   ```
   https://www.katalon.com/download/
   ```

2. **Wybierz wersję:**
   - Katalon Studio (darmowa)
   - Lub Katalon Studio Enterprise (trial 30 dni)

3. **Pobierz dla swojego systemu:**
   - Linux: `Katalon_Studio_Linux_64-X.X.X.tar.gz`
   - Windows: `Katalon_Studio_Windows_64-X.X.X.exe`
   - macOS: `Katalon_Studio_macOS-X.X.X.dmg`

4. **Rozpakuj (Linux):**
   ```bash
   cd ~/Pobrane
   tar -xzf Katalon_Studio_Linux_64-10.3.2.tar.gz
   ```

5. **Uruchom:**
   ```bash
   cd Katalon_Studio_Enterprise_Linux_64-10.3.2
   ./katalon
   ```

### Metoda 2: Użyj istniejącej instalacji

Jeśli Katalon jest już zainstalowany w `/home/ooxo/Pobrane/Katalon_Studio_Enterprise_Linux_64-10.3.2`:

```bash
cd /home/ooxo/Pobrane/Katalon_Studio_Enterprise_Linux_64-10.3.2
./katalon
```

---

## 🔧 Konfiguracja Katalon Studio

### Krok 1: Pierwsze uruchomienie

1. Uruchom Katalon Studio
2. Zaakceptuj licencję
3. Utwórz konto Katalon (opcjonalnie) lub kontynuuj bez konta
4. Wybierz workspace (domyślnie: `~/Katalon Studio`)

### Krok 2: Otwórz projekt MASE Tests

1. W Katalon Studio kliknij: **File** → **Open Project**
2. Przejdź do: `/var/www/html/wp-content/plugins/woow-admin/katalon-tests`
3. Wybierz plik: `MASE-Tests.prj`
4. Kliknij **OK**

### Krok 3: Skonfiguruj przeglądarkę

Katalon automatycznie wykrywa zainstalowane przeglądarki. Zalecane:

**Chrome (zalecane):**
```bash
# Sprawdź czy Chrome jest zainstalowany
google-chrome --version

# Jeśli nie, zainstaluj:
# Ubuntu/Debian
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt-get install -f
```

**Firefox:**
```bash
# Ubuntu/Debian
sudo apt install firefox
```

### Krok 4: Zweryfikuj zmienne globalne

1. W Katalon Studio otwórz: **Profiles** → **default**
2. Sprawdź zmienne:
   - `wp_admin_url`: http://localhost/wp-admin
   - `wp_username`: admin
   - `wp_password`: admin123
   - `mase_settings_url`: http://localhost/wp-admin/admin.php?page=modern-admin-styler
   - `screenshot_dir`: /var/www/html/wp-content/plugins/woow-admin/katalon-tests/Screenshots
   - `default_timeout`: 10

3. Jeśli coś jest nieprawidłowe, edytuj wartości

### Krok 5: Sprawdź Object Repository

1. W **Test Explorer** rozwiń: **Object Repository**
2. Sprawdź czy widoczne są foldery:
   - WordPress
   - MASE
3. Otwórz `MASE/MASEElements.groovy` i sprawdź czy zawiera definicje elementów

---

## 🧪 Test instalacji

### Test 1: Uruchom pojedynczy test

1. W **Test Explorer** rozwiń: **Test Cases** → **01-Login**
2. Kliknij prawym na: **TC01_WordPress_Login**
3. Wybierz: **Run** → **Chrome**
4. Obserwuj wykonanie testu

**Oczekiwany rezultat:**
- Przeglądarka się otwiera
- Następuje logowanie do WordPress
- Test kończy się sukcesem (zielony status)
- Zrzuty ekranu w katalogu Screenshots

### Test 2: Uruchom Smoke Tests

1. W **Test Explorer** rozwiń: **Test Suites**
2. Kliknij prawym na: **TS01_Smoke_Tests**
3. Wybierz: **Run** → **Chrome**
4. Poczekaj ~5 minut

**Oczekiwany rezultat:**
- Wszystkie 6 testów przechodzą pomyślnie
- Raport HTML w katalogu Reports
- ~20 zrzutów ekranu w Screenshots

---

## 🔍 Weryfikacja środowiska

### Sprawdź WordPress

```bash
# Sprawdź czy Apache działa
sudo systemctl status apache2

# Sprawdź czy WordPress odpowiada
curl -I http://localhost/wp-admin

# Powinno zwrócić: HTTP/1.1 200 OK lub 302 Found
```

### Sprawdź wtyczkę MASE

```bash
# Sprawdź czy wtyczka istnieje
ls -la /var/www/html/wp-content/plugins/woow-admin/modern-admin-styler.php

# Sprawdź czy jest aktywowana (zaloguj się do WP i sprawdź w Wtyczki)
```

### Sprawdź uprawnienia

```bash
# Nadaj uprawnienia do katalogów testowych
cd /var/www/html/wp-content/plugins/woow-admin/katalon-tests
chmod 777 Screenshots Reports
```

---

## 🚀 Pierwsze uruchomienie testów

### Opcja A: Z GUI Katalon Studio

1. Otwórz projekt MASE-Tests
2. Test Suites → TS01_Smoke_Tests
3. Prawy klik → Run → Chrome
4. Obserwuj wykonanie

### Opcja B: Z terminala (skrypt)

```bash
cd /var/www/html/wp-content/plugins/woow-admin/katalon-tests
chmod +x run-tests.sh
./run-tests.sh
# Wybierz opcję 1 (Smoke Tests)
```

### Opcja C: Z linii poleceń Katalon

```bash
cd /home/ooxo/Pobrane/Katalon_Studio_Enterprise_Linux_64-10.3.2

./katalon -noSplash -runMode=console \
  -projectPath="/var/www/html/wp-content/plugins/woow-admin/katalon-tests/MASE-Tests.prj" \
  -testSuitePath="Test Suites/TS01_Smoke_Tests" \
  -browserType="Chrome" \
  -reportFolder="Reports" \
  -reportFileName="First_Run"
```

---

## 📊 Sprawdź wyniki

### Zrzuty ekranu

```bash
cd /var/www/html/wp-content/plugins/woow-admin/katalon-tests/Screenshots
ls -lh
# Powinny być pliki PNG
```

### Raporty

```bash
cd /var/www/html/wp-content/plugins/woow-admin/katalon-tests/Reports
ls -lh
# Powinien być katalog z raportem
```

**Otwórz raport w przeglądarce:**
```bash
firefox Reports/First_Run/First_Run.html
# lub
xdg-open Reports/First_Run/First_Run.html
```

---

## 🔧 Rozwiązywanie problemów instalacji

### Problem 1: Katalon nie uruchamia się

**Objawy:** Błąd przy uruchamianiu `./katalon`

**Rozwiązanie:**
```bash
# Sprawdź Java
java -version

# Sprawdź uprawnienia
chmod +x katalon

# Sprawdź logi
cat ~/.katalon/logs/katalon.log
```

### Problem 2: Nie można otworzyć projektu

**Objawy:** "Project file not found"

**Rozwiązanie:**
```bash
# Sprawdź czy plik projektu istnieje
ls -la /var/www/html/wp-content/plugins/woow-admin/katalon-tests/MASE-Tests.prj

# Sprawdź uprawnienia
chmod 644 /var/www/html/wp-content/plugins/woow-admin/katalon-tests/MASE-Tests.prj
```

### Problem 3: Brak przeglądarki

**Objawy:** "Browser not found"

**Rozwiązanie:**
```bash
# Zainstaluj Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb

# Lub Firefox
sudo apt install firefox
```

### Problem 4: WordPress nie odpowiada

**Objawy:** Test fails z "Connection refused"

**Rozwiązanie:**
```bash
# Uruchom Apache
sudo systemctl start apache2

# Sprawdź status
sudo systemctl status apache2

# Sprawdź czy WordPress działa
curl -I http://localhost/wp-admin
```

### Problem 5: Brak uprawnień do zapisu

**Objawy:** "Permission denied" przy zapisie zrzutów

**Rozwiązanie:**
```bash
cd /var/www/html/wp-content/plugins/woow-admin/katalon-tests
chmod 777 Screenshots Reports
```

---

## 📚 Następne kroki

Po pomyślnej instalacji:

1. **Przeczytaj dokumentację:**
   - `README.md` - pełna dokumentacja
   - `QUICK_START.md` - szybki start
   - `TEST_CASES_LIST.md` - lista testów

2. **Uruchom testy:**
   - Smoke Tests (5 min)
   - Color Palettes (30 min)
   - Templates (45 min)
   - Full Regression (2-3 godz)

3. **Sprawdź wyniki:**
   - Zrzuty ekranu w `Screenshots/`
   - Raporty HTML w `Reports/`

4. **Dostosuj testy:**
   - Edytuj zmienne w `Profiles/default.glbl`
   - Dodaj nowe test cases
   - Rozszerz Object Repository

---

## ✅ Checklist instalacji

Przed rozpoczęciem testowania upewnij się, że:

- [ ] Java 8+ jest zainstalowana
- [ ] Katalon Studio jest zainstalowany i uruchamia się
- [ ] Projekt MASE-Tests otwiera się w Katalon
- [ ] Chrome lub Firefox jest zainstalowany
- [ ] WordPress działa na http://localhost
- [ ] Wtyczka MASE jest aktywowana
- [ ] Możesz zalogować się jako admin/admin123
- [ ] Katalogi Screenshots i Reports mają uprawnienia 777
- [ ] Test TC01_WordPress_Login przechodzi pomyślnie
- [ ] Smoke Tests przechodzą pomyślnie

---

## 🎉 Gotowe!

Jeśli wszystkie punkty checklisty są zaznaczone, instalacja jest kompletna i możesz rozpocząć testowanie wtyczki MASE!

**Powodzenia! 🚀**

---

## 📞 Wsparcie

Jeśli masz problemy:
1. Sprawdź logi Katalon: `~/.katalon/logs/`
2. Sprawdź logi Apache: `/var/log/apache2/error.log`
3. Sprawdź dokumentację: `README.md`
4. Sprawdź Quick Start: `QUICK_START.md`

---

**Dokument utworzony**: 2025-10-19  
**Wersja**: 1.0.0  
**Katalon Studio**: 10.3.2  
**MASE Plugin**: 1.2.0
