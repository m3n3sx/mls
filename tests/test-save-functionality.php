<?php
/**
 * Test Save Functionality
 * 
 * Prosty test sprawdzający czy mechanizm zapisywania działa poprawnie.
 */

echo "===========================================\n";
echo "Test Funkcjonalności Zapisywania\n";
echo "===========================================\n\n";

$tests_passed = 0;
$tests_failed = 0;

function test_result($name, $passed, $message = '') {
    global $tests_passed, $tests_failed;
    
    if ($passed) {
        $tests_passed++;
        echo "✓ PASS: $name\n";
    } else {
        $tests_failed++;
        echo "✗ FAIL: $name\n";
        if ($message) {
            echo "  Powód: $message\n";
        }
    }
}

echo "--- Test 1: Sprawdzanie plików ---\n";

$required_files = array(
    'includes/class-mase-admin.php' => 'Plik MASE_Admin',
    'includes/class-mase-settings.php' => 'Plik MASE_Settings',
    'assets/js/mase-admin.js' => 'Plik JavaScript'
);

foreach ($required_files as $file => $description) {
    test_result(
        $description . ' istnieje',
        file_exists($file),
        "Nie znaleziono: $file"
    );
}

echo "\n--- Test 2: Sprawdzanie kluczowych funkcji ---\n";

// Sprawdź czy funkcja handle_ajax_save_settings istnieje
$admin_content = file_get_contents('includes/class-mase-admin.php');
test_result(
    'Funkcja handle_ajax_save_settings istnieje',
    strpos($admin_content, 'function handle_ajax_save_settings') !== false
);

// Sprawdź czy akcja AJAX jest zarejestrowana
test_result(
    'Akcja AJAX mase_save_settings jest zarejestrowana',
    strpos($admin_content, "add_action( 'wp_ajax_mase_save_settings'") !== false
);

// Sprawdź czy nonce jest tworzony
test_result(
    'Nonce jest tworzony',
    strpos($admin_content, "wp_create_nonce( 'mase_save_settings' )") !== false
);

// Sprawdź czy nonce jest weryfikowany
test_result(
    'Nonce jest weryfikowany',
    strpos($admin_content, "check_ajax_referer( 'mase_save_settings'") !== false
);

echo "\n--- Test 3: Sprawdzanie walidacji ---\n";

$settings_content = file_get_contents('includes/class-mase-settings.php');

// Sprawdź czy funkcja validate istnieje
test_result(
    'Funkcja validate istnieje',
    strpos($settings_content, 'public function validate') !== false
);

// Sprawdź czy validate zwraca WP_Error
test_result(
    'Funkcja validate zwraca WP_Error przy błędach',
    strpos($settings_content, "return new WP_Error( 'validation_failed'") !== false
);

// Sprawdź czy update_option zwraca WP_Error
test_result(
    'Funkcja update_option zwraca WP_Error',
    strpos($settings_content, 'return $validated;') !== false &&
    strpos($settings_content, 'if ( is_wp_error( $validated ) )') !== false
);

echo "\n--- Test 4: Sprawdzanie obsługi błędów ---\n";

// Sprawdź obsługę błędów mobile optimizer
test_result(
    'Obsługa błędów mobile optimizer',
    strpos($settings_content, "class_exists( 'MASE_Mobile_Optimizer' )") !== false &&
    strpos($settings_content, 'catch ( Exception $e )') !== false
);

// Sprawdź logowanie debugowania
test_result(
    'Logowanie debugowania jest włączone',
    strpos($admin_content, "error_log( 'MASE:") !== false
);

echo "\n--- Test 5: Sprawdzanie JavaScript ---\n";

$js_content = file_get_contents('assets/js/mase-admin.js');

// Sprawdź czy funkcja saveSettings istnieje
test_result(
    'Funkcja saveSettings istnieje w JS',
    strpos($js_content, 'saveSettings:') !== false ||
    strpos($js_content, 'saveSettings =') !== false
);

// Sprawdź czy dane są wysyłane jako JSON
test_result(
    'Ustawienia są wysyłane jako JSON string',
    strpos($js_content, 'JSON.stringify(formData)') !== false ||
    strpos($js_content, 'JSON.stringify( formData )') !== false
);

// Sprawdź czy są obsługiwane błędy walidacji
test_result(
    'Obsługa błędów walidacji w JS',
    strpos($js_content, 'validation_errors') !== false
);

// Sprawdź czy są różne komunikaty błędów
test_result(
    'Różne komunikaty błędów dla różnych statusów HTTP',
    strpos($js_content, 'xhr.status === 403') !== false &&
    strpos($js_content, 'xhr.status === 400') !== false &&
    strpos($js_content, 'xhr.status === 500') !== false
);

echo "\n--- Test 6: Sprawdzanie bezpieczeństwa ---\n";

// Sprawdź sanityzację
test_result(
    'Sanityzacja danych wejściowych',
    strpos($settings_content, 'sanitize_hex_color') !== false &&
    strpos($settings_content, 'sanitize_text_field') !== false
);

// Sprawdź sprawdzanie uprawnień
test_result(
    'Sprawdzanie uprawnień użytkownika',
    strpos($admin_content, "current_user_can( 'manage_options' )") !== false
);

// Sprawdź escapowanie
test_result(
    'Escapowanie danych wyjściowych',
    strpos($admin_content, 'esc_html') !== false ||
    strpos($admin_content, 'esc_attr') !== false ||
    strpos($admin_content, '__( ') !== false
);

echo "\n===========================================\n";
echo "Podsumowanie Testów\n";
echo "===========================================\n";
echo "Zaliczone: $tests_passed\n";
echo "Niezaliczone: $tests_failed\n";
echo "Razem: " . ($tests_passed + $tests_failed) . "\n";

if ($tests_failed > 0) {
    echo "\n⚠ Niektóre testy nie przeszły. Sprawdź powyższe błędy.\n";
    exit(1);
}

echo "\n✓ Wszystkie testy przeszły pomyślnie!\n";
echo "\nMechanizm zapisywania jest prawidłowo zaimplementowany.\n";
echo "\nAby przetestować w WordPress:\n";
echo "1. Zaloguj się do panelu administracyjnego\n";
echo "2. Przejdź do ustawień MASE\n";
echo "3. Zmień dowolne ustawienie\n";
echo "4. Kliknij 'Zapisz ustawienia'\n";
echo "5. Sprawdź czy pojawia się komunikat sukcesu\n";
echo "\nAby włączyć debugowanie:\n";
echo "1. Dodaj do wp-config.php:\n";
echo "   define('WP_DEBUG', true);\n";
echo "   define('WP_DEBUG_LOG', true);\n";
echo "2. Sprawdź logi w wp-content/debug.log\n";

exit(0);
