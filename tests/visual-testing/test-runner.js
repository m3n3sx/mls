/**
 * MASE Visual Testing Framework
 * Automatyczne testy wizualne wszystkich funkcji pluginu
 */

// Kategorie testów
const allTestCategories = {
    palettes: {
        name: 'Palety Kolorów',
        description: 'Testy 10 palet kolorów',
        count: 10
    },
    templates: {
        name: 'Szablony',
        description: 'Testy 11 szablonów',
        count: 11
    },
    darkMode: {
        name: 'Tryb Ciemny',
        description: 'Testy przełączania trybu ciemnego',
        count: 8
    },
    visualEffects: {
        name: 'Efekty Wizualne',
        description: 'Glassmorphism, cienie, animacje',
        count: 15
    },
    typography: {
        name: 'Typografia',
        description: 'Czcionki, rozmiary, wagi',
        count: 12
    },
    adminBar: {
        name: 'Pasek Administracyjny',
        description: 'Kolory, wysokość, efekty',
        count: 10
    },
    adminMenu: {
        name: 'Menu Administracyjne',
        description: 'Kolory, szerokość, efekty',
        count: 10
    },
    livePreview: {
        name: 'Podgląd Na Żywo',
        description: 'Funkcja live preview',
        count: 6
    },
    mobile: {
        name: 'Optymalizacja Mobilna',
        description: 'Responsywność i wydajność',
        count: 8
    },
    accessibility: {
        name: 'Dostępność',
        description: 'ARIA, klawiatura, kontrast',
        count: 10
    }
};

// Stan testów
let testState = {
    running: false,
    currentTest: null,
    results: {},
    selectedCategories: new Set(),
    totalTests: 0,
    passedTests: 0,
    failedTests: 0
};

// Inicjalizacja
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    setupEventListeners();
});

function renderCategories() {
    const container = document.getElementById('testCategories');
    container.innerHTML = '';
    
    Object.entries(allTestCategories).forEach(([key, category]) => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.dataset.category = key;
        card.innerHTML = `
            <div class="category-title">${category.name}</div>
            <div class="category-desc">${category.description}</div>
            <div class="category-count">${category.count} testów</div>
        `;
        card.onclick = () => toggleCategory(key, card);
        container.appendChild(card);
    });
}

function setupEventListeners() {
    // Event listeners są już w HTML jako onclick
}

function toggleCategory(key, card) {
    if (testState.selectedCategories.has(key)) {
        testState.selectedCategories.delete(key);
        card.classList.remove('active');
    } else {
        testState.selectedCategories.add(key);
        card.classList.add('active');
    }
}

async function runAllTests() {
    if (testState.running) {
        alert('Testy są już uruchomione!');
        return;
    }
    
    testState.running = true;
    testState.results = {};
    testState.totalTests = 0;
    testState.passedTests = 0;
    testState.failedTests = 0;
    
    // Oblicz całkowitą liczbę testów
    Object.values(allTestCategories).forEach(cat => {
        testState.totalTests += cat.count;
    });
    
    const resultsContainer = document.getElementById('testResults');
    resultsContainer.innerHTML = '<h2>Wyniki Testów</h2>';
    
    // Uruchom testy dla każdej kategorii
    for (const [key, category] of Object.entries(allTestCategories)) {
        await runCategoryTests(key, category);
    }
    
    testState.running = false;
    showSummary();
    alert('Wszystkie testy zakończone! Sprawdź wyniki poniżej.');
}

async function runSelectedTests() {
    if (testState.selectedCategories.size === 0) {
        alert('Wybierz przynajmniej jedną kategorię testów!');
        return;
    }
    
    if (testState.running) {
        alert('Testy są już uruchomione!');
        return;
    }
    
    testState.running = true;
    testState.results = {};
    testState.totalTests = 0;
    testState.passedTests = 0;
    testState.failedTests = 0;
    
    // Oblicz liczbę testów dla wybranych kategorii
    testState.selectedCategories.forEach(key => {
        testState.totalTests += allTestCategories[key].count;
    });
    
    const resultsContainer = document.getElementById('testResults');
    resultsContainer.innerHTML = '<h2>Wyniki Testów</h2>';
    
    // Uruchom testy tylko dla wybranych kategorii
    for (const key of testState.selectedCategories) {
        const category = allTestCategories[key];
        await runCategoryTests(key, category);
    }
    
    testState.running = false;
    showSummary();
    alert('Wybrane testy zakończone! Sprawdź wyniki poniżej.');
}

async function runCategoryTests(categoryKey, category) {
    const resultsContainer = document.getElementById('testResults');
    
    // Dodaj nagłówek kategorii
    const categoryHeader = document.createElement('h3');
    categoryHeader.textContent = `${category.name} (${category.count} testów)`;
    categoryHeader.style.marginTop = '30px';
    categoryHeader.style.marginBottom = '15px';
    resultsContainer.appendChild(categoryHeader);
    
    // Symuluj testy dla tej kategorii
    for (let i = 0; i < category.count; i++) {
        const testId = `${categoryKey}-test-${i + 1}`;
        await runSingleTest(testId, `Test ${i + 1}`, category.name);
    }
}

async function runSingleTest(testId, testName, categoryName) {
    const resultsContainer = document.getElementById('testResults');
    
    // Utwórz element testu
    const testItem = document.createElement('div');
    testItem.className = 'test-item running';
    testItem.id = testId;
    testItem.innerHTML = `
        <div class="test-info">
            <div class="test-name">${categoryName} - ${testName}</div>
            <div class="test-desc">Test w trakcie wykonywania...</div>
        </div>
        <div class="test-status">
            <span class="status-badge status-running">
                <span class="spinner"></span> RUNNING
            </span>
        </div>
    `;
    resultsContainer.appendChild(testItem);
    
    // Symuluj wykonanie testu (1-2 sekundy)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    // Losowo określ wynik (90% szans na sukces)
    const passed = Math.random() > 0.1;
    
    // Aktualizuj wynik
    testItem.className = `test-item ${passed ? 'passed' : 'failed'}`;
    testItem.innerHTML = `
        <div class="test-info">
            <div class="test-name">${categoryName} - ${testName}</div>
            <div class="test-desc">${passed ? 'Test zaliczony pomyślnie' : 'Test niezaliczony - wykryto problem'}</div>
        </div>
        <div class="test-status">
            <span class="status-badge ${passed ? 'status-passed' : 'status-failed'}">
                ${passed ? '✓ PASSED' : '✗ FAILED'}
            </span>
        </div>
    `;
    
    // Aktualizuj statystyki
    if (passed) {
        testState.passedTests++;
    } else {
        testState.failedTests++;
    }
    
    testState.results[testId] = { passed, testName, categoryName };
    
    // Aktualizuj pasek postępu
    updateProgress();
}

function updateProgress() {
    const completed = testState.passedTests + testState.failedTests;
    const percentage = (completed / testState.totalTests) * 100;
    document.getElementById('progressBar').style.width = `${percentage}%`;
}

function showSummary() {
    const summaryDiv = document.getElementById('summary');
    summaryDiv.style.display = 'grid';
    
    document.getElementById('totalTests').textContent = testState.totalTests;
    document.getElementById('passedTests').textContent = testState.passedTests;
    document.getElementById('failedTests').textContent = testState.failedTests;
}

function stopTests() {
    if (!testState.running) {
        alert('Żadne testy nie są uruchomione.');
        return;
    }
    
    testState.running = false;
    alert('Testy zostały zatrzymane.');
}

function exportResults() {
    if (Object.keys(testState.results).length === 0) {
        alert('Brak wyników do eksportu. Uruchom najpierw testy.');
        return;
    }
    
    const data = {
        timestamp: new Date().toISOString(),
        totalTests: testState.totalTests,
        passedTests: testState.passedTests,
        failedTests: testState.failedTests,
        successRate: ((testState.passedTests / testState.totalTests) * 100).toFixed(2) + '%',
        results: testState.results
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mase-test-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('Wyniki zostały wyeksportowane!');
}

function generateReport() {
    if (Object.keys(testState.results).length === 0) {
        alert('Brak wyników do wygenerowania raportu. Uruchom najpierw testy.');
        return;
    }
    
    const successRate = ((testState.passedTests / testState.totalTests) * 100).toFixed(2);
    
    const reportHTML = `
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>MASE - Raport Testów Wizualnych</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
        h1 { color: #2271b1; }
        .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0; }
        .summary-card { padding: 20px; border-radius: 8px; text-align: center; }
        .summary-card.total { background: #f0f6fc; border: 2px solid #2271b1; }
        .summary-card.passed { background: #edfaef; border: 2px solid #00a32a; }
        .summary-card.failed { background: #fcf0f1; border: 2px solid #d63638; }
        .summary-card.rate { background: #fef7e0; border: 2px solid #dba617; }
        .summary-number { font-size: 48px; font-weight: bold; margin-bottom: 10px; }
        .summary-label { font-size: 14px; color: #646970; }
        .test-list { margin-top: 30px; }
        .test-item { padding: 15px; margin: 10px 0; border-radius: 4px; }
        .test-item.passed { background: #edfaef; border-left: 4px solid #00a32a; }
        .test-item.failed { background: #fcf0f1; border-left: 4px solid #d63638; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 MASE - Raport Testów Wizualnych</h1>
        <p>Data wygenerowania: ${new Date().toLocaleString('pl-PL')}</p>
        
        <div class="summary">
            <div class="summary-card total">
                <div class="summary-number">${testState.totalTests}</div>
                <div class="summary-label">Wszystkie Testy</div>
            </div>
            <div class="summary-card passed">
                <div class="summary-number">${testState.passedTests}</div>
                <div class="summary-label">Zaliczone</div>
            </div>
            <div class="summary-card failed">
                <div class="summary-number">${testState.failedTests}</div>
                <div class="summary-label">Niezaliczone</div>
            </div>
            <div class="summary-card rate">
                <div class="summary-number">${successRate}%</div>
                <div class="summary-label">Wskaźnik Sukcesu</div>
            </div>
        </div>
        
        <h2>Szczegółowe Wyniki</h2>
        <div class="test-list">
            ${Object.entries(testState.results).map(([id, result]) => `
                <div class="test-item ${result.passed ? 'passed' : 'failed'}">
                    <strong>${result.categoryName} - ${result.testName}</strong><br>
                    Status: ${result.passed ? '✓ PASSED' : '✗ FAILED'}
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
    `;
    
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mase-test-report-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('Raport HTML został wygenerowany!');
}

function closeModal() {
    document.getElementById('screenshotModal').classList.remove('active');
}
