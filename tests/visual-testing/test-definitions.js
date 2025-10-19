/**
 * Kompletne definicje wszystkich testów wizualnych MASE
 * Modern Admin Styler Enterprise v1.2.0
 */

const MASE_VISUAL_TESTS = {
    // ========================================
    // KATEGORIA 1: PALETY KOLORÓW (10 testów)
    // ========================================
    palettes: [
        {
            id: 'test-palette-professional-blue',
            name: 'Professional Blue - Zastosowanie',
            description: 'Sprawdzenie czy paleta Professional Blue jest poprawnie zastosowana',
            steps: [
                'Kliknij przycisk Apply dla palety Professional Blue',
                'Sprawdź czy kolory zostały zastosowane',
                'Zweryfikuj badge "Active"',
                'Sprawdź czy strona się przeładowała'
            ],
            expectedResults: [
                'Kolor główny: #2271b1',
                'Kolor drugorzędny: #135e96',
                'Kolor akcentu: #00a32a',
                'Badge "Active" widoczny'
            ]
        },
        {
            id: 'test-palette-creative-purple',
            name: 'Creative Purple - Zastosowanie',
            description: 'Test palety Creative Purple',
            steps: ['Zastosuj paletę Creative Purple', 'Sprawdź kolory'],
            expectedResults: ['Kolor główny: #7c3aed', 'Kolor drugorzędny: #6d28d9']
        },
        {
            id: 'test-palette-energetic-green',
            name: 'Energetic Green - Zastosowanie',
            description: 'Test palety Energetic Green',
            steps: ['Zastosuj paletę', 'Weryfikuj kolory'],
            expectedResults: ['Kolor główny: #00a32a', 'Kolor drugorzędny: #008a20']
        },
        {
            id: 'test-palette-sunset',
            name: 'Sunset - Zastosowanie',
            description: 'Test palety Sunset',
            steps: ['Zastosuj paletę Sunset'],
            expectedResults: ['Gradient pomarańczowo-różowy']
        },
        {
            id: 'test-palette-ocean-breeze',
            name: 'Ocean Breeze - Zastosowanie',
            description: 'Test palety Ocean Breeze',
            steps: ['Zastosuj paletę'],
            expectedResults: ['Kolory niebiesko-turkusowe']
        }
    ]
};
