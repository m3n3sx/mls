# MASE Plugin - Cache Clearing Guide

Kompletny przewodnik po czyszczeniu cache wtyczki Modern Admin Styler Enterprise.

---

## Szybkie Czyszczenie (Zalecane)

### Metoda 1: Skrypt Bash (Najszybsza)

```bash
cd woow-admin
bash clear-cache.sh
```

To wyczyści:
- ✅ Pliki tymczasowe (temp/, build/)
- ✅ Cache node_modules
- ✅ Cache NPM
- ✅ PHP opcache
- ✅ Pliki .DS_Store i Thumbs.db
- ✅ Pliki log (opcjonalnie)

### Metoda 2: Skrypt PHP (WordPress)

```bash
cd woow-admin
php clear-plugin-cache.php
```

To wyczyści:
- ✅ CSS transient cache
- ✅ Wszystkie transienty MASE
- ✅ WordPress object cache
- ✅ MASE CacheManager
- ✅ PHP opcache
- ✅ Rewrite rules

---

## Czyszczenie Krok po Kroku

### 1. Cache Systemu Plików

**Usuń katalogi tymczasowe:**
```bash
rm -rf woow-admin/temp
rm -rf woow-admin/temp_verify
rm -rf woow-admin/build
rm -rf woow-admin/node_modules/.cache
```

**Wyczyść cache NPM:**
```bash
npm cache clean --force
```

**Usuń pliki systemowe:**
```bash
find woow-admin -name ".DS_Store" -delete
find woow-admin -name "Thumbs.db" -delete
```

### 2. Cache WordPress (Baza Danych)

**Opcja A: Przez phpMyAdmin**
1. Otwórz phpMyAdmin
2. Wybierz swoją bazę danych
3. Kliknij "SQL"
4. Wklej zawartość pliku `clear-wp-cache.sql`
5. Kliknij "Wykonaj"

**Opcja B: Przez MySQL CLI**
```bash
mysql -u username -p database_name < woow-admin/clear-wp-cache.sql
```

**Opcja C: Przez WP-CLI**
```bash
wp transient delete mase_css_cache
wp transient delete --all
wp cache flush
```

**Opcja D: Ręcznie przez SQL**
```sql
DELETE FROM wp_options WHERE option_name = '_transient_mase_css_cache';
DELETE FROM wp_options WHERE option_name = '_transient_timeout_mase_css_cache';
DELETE FROM wp_options WHERE option_name LIKE '_transient_mase%';
DELETE FROM wp_options WHERE option_name LIKE '_transient_timeout_mase%';
OPTIMIZE TABLE wp_options;
```

### 3. Cache PHP

**OPcache:**
```bash
# Przez CLI
php -r "opcache_reset();"

# Lub zrestartuj PHP-FPM
sudo systemctl restart php-fpm
# lub
sudo service php7.4-fpm restart
```

**APCu (jeśli używasz):**
```bash
php -r "if (function_exists('apcu_clear_cache')) apcu_clear_cache();"
```

### 4. Cache Przeglądarki

**Chrome:**
1. Naciśnij `Ctrl+Shift+Delete` (Windows/Linux) lub `Cmd+Shift+Delete` (Mac)
2. Wybierz "Cached images and files"
3. Kliknij "Clear data"

**Firefox:**
1. Naciśnij `Ctrl+Shift+Delete` (Windows/Linux) lub `Cmd+Shift+Delete` (Mac)
2. Wybierz "Cache"
3. Kliknij "Clear Now"

**Safari:**
1. Naciśnij `Cmd+Option+E`
2. Lub: Safari → Preferences → Advanced → Show Develop menu
3. Develop → Empty Caches

**Edge:**
1. Naciśnij `Ctrl+Shift+Delete`
2. Wybierz "Cached images and files"
3. Kliknij "Clear now"

**Hard Refresh (wymusza przeładowanie):**
- Chrome/Firefox/Edge: `Ctrl+Shift+R` lub `Ctrl+F5`
- Safari: `Cmd+Shift+R`

### 5. Cache WordPress (Wtyczki)

**WP Super Cache:**
```bash
wp super-cache flush
```
Lub: Settings → WP Super Cache → Delete Cache

**W3 Total Cache:**
```bash
wp w3-total-cache flush
```
Lub: Performance → Dashboard → Empty All Caches

**WP Rocket:**
```bash
wp rocket clean --confirm
```
Lub: Settings → WP Rocket → Clear Cache

**LiteSpeed Cache:**
```bash
wp litespeed-purge all
```
Lub: LiteSpeed Cache → Dashboard → Purge All

### 6. Cache Serwera

**Nginx FastCGI Cache:**
```bash
sudo rm -rf /var/cache/nginx/*
sudo systemctl reload nginx
```

**Apache mod_cache:**
```bash
sudo rm -rf /var/cache/apache2/mod_cache_disk/*
sudo systemctl reload apache2
```

**Varnish:**
```bash
sudo varnishadm "ban req.url ~ ."
```

**Redis:**
```bash
redis-cli FLUSHALL
```

**Memcached:**
```bash
echo "flush_all" | nc localhost 11211
```

---

## Weryfikacja Czyszczenia

### 1. Sprawdź Transienty

```bash
wp transient list | grep mase
```

Powinno zwrócić: brak wyników

### 2. Sprawdź Opcje

```sql
SELECT * FROM wp_options WHERE option_name LIKE '%mase%cache%';
```

Powinno zwrócić: brak wyników (lub tylko mase_settings)

### 3. Sprawdź Pliki

```bash
ls -la woow-admin/temp* 2>/dev/null
ls -la woow-admin/build 2>/dev/null
```

Powinno zwrócić: "No such file or directory"

### 4. Sprawdź WordPress Admin

1. Zaloguj się do WordPress admin
2. Przejdź do: Modern Admin Styler → Settings
3. Sprawdź czy strona się ładuje
4. Zmień jakieś ustawienie i zapisz
5. Sprawdź czy CSS się regeneruje

### 5. Sprawdź Logi

```bash
tail -f /var/log/php-fpm/error.log
tail -f /var/log/nginx/error.log
```

Nie powinno być błędów związanych z MASE.

---

## Rozwiązywanie Problemów

### Problem: "Cache nie został wyczyszczony"

**Rozwiązanie:**
1. Sprawdź uprawnienia do plików:
   ```bash
   ls -la woow-admin/
   ```
2. Upewnij się, że masz uprawnienia do zapisu
3. Spróbuj z sudo (jeśli to bezpieczne):
   ```bash
   sudo bash clear-cache.sh
   ```

### Problem: "Transient cache nadal istnieje"

**Rozwiązanie:**
1. Sprawdź prefix tabeli WordPress (może nie być 'wp_'):
   ```sql
   SHOW TABLES LIKE '%options';
   ```
2. Dostosuj zapytania SQL do swojego prefiksu
3. Użyj WP-CLI:
   ```bash
   wp transient delete --all
   ```

### Problem: "CSS się nie regeneruje"

**Rozwiązanie:**
1. Wyczyść cache przeglądarki (hard refresh)
2. Sprawdź uprawnienia do katalogu uploads:
   ```bash
   ls -la wp-content/uploads/
   ```
3. Zdeaktywuj i aktywuj wtyczkę:
   ```bash
   wp plugin deactivate modern-admin-styler
   wp plugin activate modern-admin-styler
   ```
4. Sprawdź logi błędów PHP

### Problem: "Strona się nie ładuje po czyszczeniu"

**Rozwiązanie:**
1. Sprawdź logi błędów
2. Wyłącz wtyczkę:
   ```bash
   wp plugin deactivate modern-admin-styler
   ```
3. Wyczyść cache ponownie
4. Włącz wtyczkę:
   ```bash
   wp plugin activate modern-admin-styler
   ```
5. Jeśli problem persystuje, przywróć backup

### Problem: "Opcache się nie czyści"

**Rozwiązanie:**
1. Zrestartuj PHP-FPM:
   ```bash
   sudo systemctl restart php-fpm
   ```
2. Lub zrestartuj cały serwer web:
   ```bash
   sudo systemctl restart nginx
   # lub
   sudo systemctl restart apache2
   ```

---

## Automatyczne Czyszczenie

### Cron Job (Codziennie o 3:00)

```bash
# Edytuj crontab
crontab -e

# Dodaj linię:
0 3 * * * cd /path/to/wordpress/wp-content/plugins/woow-admin && bash clear-cache.sh > /dev/null 2>&1
```

### WordPress Cron

Dodaj do `functions.php` lub wtyczki:

```php
// Schedule daily cache cleanup
if (!wp_next_scheduled('mase_daily_cache_cleanup')) {
    wp_schedule_event(time(), 'daily', 'mase_daily_cache_cleanup');
}

add_action('mase_daily_cache_cleanup', function() {
    // Clear MASE transients
    delete_transient('mase_css_cache');
    
    // Clear all MASE transients
    global $wpdb;
    $wpdb->query(
        "DELETE FROM {$wpdb->options} 
         WHERE option_name LIKE '_transient_mase%' 
         OR option_name LIKE '_transient_timeout_mase%'"
    );
    
    // Clear object cache
    wp_cache_flush();
    
    // Log cleanup
    error_log('MASE: Daily cache cleanup completed');
});
```

---

## Najlepsze Praktyki

### Kiedy Czyścić Cache?

1. **Po aktualizacji wtyczki** - Zawsze
2. **Po zmianie ustawień** - Opcjonalnie
3. **Gdy CSS się nie aktualizuje** - Tak
4. **Przed testowaniem** - Zalecane
5. **Przed wydaniem** - Obowiązkowo
6. **Gdy występują błędy** - Tak
7. **Regularnie (co tydzień)** - Zalecane

### Czego NIE Czyścić?

❌ **NIE usuwaj:**
- `mase_settings` - Główne ustawienia wtyczki
- `mase_version` - Wersja wtyczki
- `mase_settings_backup_110` - Backup ustawień z v1.1.0

✅ **Możesz usunąć:**
- `_transient_mase_css_cache` - Cache CSS
- `_transient_mase_*` - Wszystkie transienty
- Pliki tymczasowe (temp/, build/)
- Cache przeglądarki

### Backup Przed Czyszczeniem

**Zawsze zrób backup przed czyszczeniem cache:**

```bash
# Backup bazy danych
wp db export backup-before-cache-clear.sql

# Backup plików wtyczki
tar -czf mase-backup-$(date +%Y%m%d).tar.gz woow-admin/

# Backup ustawień
wp option get mase_settings > mase-settings-backup.json
```

---

## Skrypty Pomocnicze

### Sprawdź Rozmiar Cache

```bash
#!/bin/bash
echo "MASE Cache Size Report"
echo "======================"
echo ""

# Database cache
echo "Database transients:"
mysql -u username -p -e "SELECT COUNT(*) as count, SUM(LENGTH(option_value)) as size FROM wp_options WHERE option_name LIKE '_transient_mase%'" database_name

# File cache
echo ""
echo "File cache:"
du -sh woow-admin/temp* 2>/dev/null || echo "No temp directories"
du -sh woow-admin/build 2>/dev/null || echo "No build directory"
du -sh woow-admin/node_modules/.cache 2>/dev/null || echo "No node cache"

echo ""
echo "Total plugin size:"
du -sh woow-admin/
```

### Monitor Cache

```bash
#!/bin/bash
# Monitor MASE cache in real-time

watch -n 5 '
echo "MASE Cache Monitor"
echo "=================="
echo ""
echo "Transients:"
mysql -u username -p -e "SELECT COUNT(*) FROM wp_options WHERE option_name LIKE \"_transient_mase%\"" database_name
echo ""
echo "Temp files:"
ls -lh woow-admin/temp* 2>/dev/null | wc -l
'
```

---

## Podsumowanie

### Szybkie Polecenia

```bash
# Wszystko naraz (zalecane)
cd woow-admin
bash clear-cache.sh
php clear-plugin-cache.php

# Tylko pliki
bash clear-cache.sh

# Tylko WordPress
php clear-plugin-cache.php

# Tylko baza danych
mysql -u username -p database_name < clear-wp-cache.sql

# Tylko WP-CLI
wp transient delete --all && wp cache flush
```

### Kolejność Czyszczenia

1. ✅ Cache systemu plików (`clear-cache.sh`)
2. ✅ Cache WordPress (`clear-plugin-cache.php`)
3. ✅ Cache przeglądarki (Ctrl+Shift+Delete)
4. ✅ Cache serwera (jeśli dotyczy)
5. ✅ Weryfikacja (sprawdź czy działa)

---

## Wsparcie

Jeśli masz problemy z czyszczeniem cache:

1. Sprawdź logi błędów
2. Przeczytaj sekcję "Rozwiązywanie Problemów"
3. Sprawdź dokumentację: `docs/TROUBLESHOOTING.md`
4. Zgłoś problem na GitHub

---

**Modern Admin Styler Enterprise v1.2.0**  
**Cache Clearing Guide - January 18, 2025**
