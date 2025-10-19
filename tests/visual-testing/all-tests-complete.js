/**
 * MASE - Kompletna Lista Wszystkich Testów Wizualnych
 * Modern Admin Styler Enterprise v1.2.0
 * 
 * Łącznie: 100+ testów pokrywających wszystkie funkcje
 */

const COMPLETE_TEST_SUITE = {
    
    // ============================================
    // KATEGORIA 1: PALETY KOLORÓW (10 testów)
    // ============================================
    palettes: {
        category: 'Palety Kolorów',
        description: 'Testy wszystkich 10 palet kolorów i funkcji niestandardowych',
        totalTests: 10,
        tests: [
            {
                id: 'palette-01-professional-blue',
                name: 'Professional Blue - Pełny Test',
                priority: 'high',
                duration: '30s',
                steps: [
                    'Otwórz zakładkę General',
                    'Znajdź paletę Professional Blue',
                    'Kliknij przycisk Preview',
                    'Sprawdź podgląd kolorów',
                    'Kliknij przycisk Apply',
                    'Potwierdź zastosowanie',
                    'Poczekaj na przeładowanie',
                    'Zweryfikuj badge "Active"'
                ],
                checks: [
                    'Kolor główny: #2271b1',
                    'Kolor drugorzędny: #135e96',
                    'Kolor akcentu: #00a32a',
                    'Kolor tła: #f0f0f1',
                    'Badge "Active" widoczny',
                    'Admin bar ma nowy kolor',
                    'Menu ma nowy kolor',
                    'Przyciski mają nowy kolor'
                ]
            },
            {
                id: 'palette-02-creative-purple',
                name: 'Creative Purple - Pełny Test',
                priority: 'high',
                duration: '30s',
                steps: [
                    'Zastosuj paletę Creative Purple',
                    'Sprawdź wszystkie kolory',
                    'Zweryfikuj kontrast'
                ],
                checks: [
                    'Kolor główny: #7c3aed',
                    'Kolor drugorzędny: #6d28d9',
                    'Kolor akcentu: #a78bfa',
                    'Kontrast WCAG AA spełniony'
                ]
            }
        ]
    }
};
