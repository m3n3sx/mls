# Performance Monitor - Critical Memory Issue

## 🚨 Status: DISABLED

Performance Monitor został **całkowicie wyłączony** z powodu krytycznych problemów z pamięcią.

## Problem

Performance Monitor (`class-mase-performance-monitor.php`) powoduje wyczerpanie pamięci (536MB) podczas:
- Inicjalizacji pluginu
- Ładowania strony ustawień
- Generowania CSS
- Każdego wywołania `get_metrics()`

## Root Cause

1. **Plik zbyt duży**: 1,634 linii (545% ponad limit 300 linii)
2. **Zbyt wiele odpowiedzialności**: Monitoring, metryki, rekomendacje, cache stats, device detection
3. **Problemy z pamięcią**:
   - Ładuje wszystkie ustawienia do `$cached_settings`
   - Wywołuje `$cache_manager->get_stats()` który serializuje cały cache
   - Zbiera metryki z wielu źródeł jednocześnie
   - Brak lazy loading

## Gdzie został wyłączony

### 1. Service Container
```php
// includes/class-mase-service-container.php
public function get_performance_monitor() {
    return null; // DISABLED
}
```

### 2. Main Plugin File
```php
// modern-admin-styler.php
// $performance_monitor = $container->get_performance_monitor(); // COMMENTED OUT
```

### 3. Performance Dashboard
```php
// includes/performance-dashboard-section.php
$metrics = array(
    'performance_score' => 0,
    // ... placeholder data
);
```

### 4. CSS Generator
```php
// includes/class-mase-css-generator.php
private function get_performance_monitor() {
    return null; // DISABLED
}
```

## Rozwiązanie długoterminowe

Performance Monitor musi zostać **całkowicie przepisany** z następującymi zasadami:

### 1. Podział na mniejsze klasy (max 300 linii każda)

```
MASE_Performance_Monitor (główny koordynator)
├── MASE_Performance_Metrics_Collector (zbieranie metryk)
├── MASE_Performance_Analyzer (analiza danych)
├── MASE_Performance_Recommendations (generowanie rekomendacji)
└── MASE_Performance_Storage (zapis/odczyt danych)
```

### 2. Lazy Loading

- Nie ładuj wszystkich danych w konstruktorze
- Ładuj metryki tylko gdy są potrzebne
- Cache tylko niezbędne dane

### 3. Memory Management

```php
// Zamiast:
$this->cached_settings = $this->settings->get_option(); // Cały array!

// Użyj:
$value = $this->settings->get_option('specific_key'); // Tylko potrzebna wartość
```

### 4. Singleton Pattern (już zaimplementowany)

Service Container zapewnia, że istnieje tylko jedna instancja każdej klasy.

### 5. Limit danych w cache

```php
// Przechowuj tylko ostatnie 10 pomiarów
$metrics = array_slice($metrics, -10);
```

## Co działa bez Performance Monitor

✅ **Podstawowe funkcje pluginu**:
- Ładowanie ustawień
- Generowanie CSS
- Palety kolorów
- Typografia
- Import/Export
- Live Preview
- Cache management

❌ **Wyłączone funkcje**:
- Performance Dashboard (pokazuje zera)
- Performance Score
- CSS Generation Time tracking
- Cache Hit Ratio stats
- Performance Recommendations
- Device Capabilities detection (częściowo)

## Następne kroki

1. **Nie włączaj Performance Monitor** dopóki nie zostanie przepisany
2. **Podziel plik** na 4-5 mniejszych klas
3. **Zaimplementuj lazy loading** dla wszystkich metryk
4. **Dodaj memory guards** - sprawdzaj użycie pamięci przed operacjami
5. **Testuj z małymi danymi** - zacznij od prostych metryk

## Tymczasowe rozwiązanie

Jeśli potrzebujesz podstawowych metryk:

```php
// Prosty tracking bez Performance Monitor
$generation_times = get_transient('mase_css_generation_times');
if (!is_array($generation_times)) {
    $generation_times = array();
}
$generation_times[] = array(
    'time' => $duration,
    'timestamp' => time(),
);
$generation_times = array_slice($generation_times, -10);
set_transient('mase_css_generation_times', $generation_times, HOUR_IN_SECONDS);
```

## Ostrzeżenie

⚠️ **NIE WŁĄCZAJ PERFORMANCE MONITOR** bez przepisania kodu!

Każda próba włączenia spowoduje:
- Fatal error: Memory exhausted
- Plugin crash
- WordPress admin niedostępny

---

**Data wyłączenia**: 2025-10-15  
**Powód**: Critical memory exhaustion (536MB limit exceeded)  
**Status**: Wymaga całkowitego przepisania
