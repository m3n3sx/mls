/**
 * MASE Visual Testing with Playwright
 * Automatyczne testy wizualne z zrzutami ekranu dla każdej opcji
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Konfiguracja
const CONFIG = {
    baseUrl: 'http://localhost/wp-admin/admin.php?page=mase-settings',
    screenshotsDir: path.join(__dirname, 'screenshots'),
    reportsDir: path.join(__dirname, 'reports'),
    viewport: { width: 1920, height: 1080 },
    timeout: 30000
};

// Utwórz katalogi
if (!fs.existsSync(CONFIG.screenshotsDir)) {
    fs.mkdirSync(CONFIG.screenshotsDir, { recursive: true });
}
if (!fs.existsSync(CONFIG.reportsDir)) {
    fs.mkdirSync(CONFIG.reportsDir, { recursive: true });
}

// Wyniki testów
const testResults = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {
        total: 0,
        passed: 0,
        failed: 0,
        screenshots: 0
    }
};

/**
 * Główna funkcja testowa
 */
async function runVisualTests() {
    console.log('🚀 Uruchamianie testów wizualnych MASE...\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 100 
    });
    
    const context = await browser.newContext({
        viewport: CONFIG.viewport,
        ignoreHTTPSErrors: true,
        recordVideo: {
            dir: path.join(CONFIG.screenshotsDir, 'videos'),
            size: CONFIG.viewport
        }
    });
    
    const page = await context.newPage();
    
    try {
        // Zaloguj się do WordPress
        await loginToWordPress(page);
        
        // Przejdź do strony ustawień MASE
        console.log('📍 Przechodzę do strony MASE...');
        await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(3000);
        console.log('✓ Strona MASE załadowana\n');
        
        // Zrzut ekranu początkowy
        await takeScreenshot(page, '00-initial-state', 'Stan początkowy');
        
        // Uruchom testy dla każdej kategorii
        await testColorPalettes(page);
        await testTemplates(page);
        await testDarkMode(page);
        await testVisualEffects(page);
        await testTypography(page);
        await testAdminBar(page);
        await testAdminMenu(page);
        await testLivePreview(page);
        await testMobileOptimization(page);
        await testAccessibility(page);
        
        // Generuj raport
        await generateReport();
        
        console.log('\n✅ Wszystkie testy zakończone!');
        console.log(`📊 Wyniki: ${testResults.summary.passed}/${testResults.summary.total} testów zaliczonych`);
        console.log(`📸 Utworzono ${testResults.summary.screenshots} zrzutów ekranu`);
        
    } catch (error) {
        console.error('❌ Błąd podczas testów:', error);
    } finally {
        await context.close();
        await browser.close();
    }
}

/**
 * Logowanie do WordPress
 */
async function loginToWordPress(page) {
    console.log('🔐 Logowanie do WordPress...');
    
    try {
        await page.goto('http://localhost/wp-login.php', { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#user_login', { timeout: 10000 });
        await page.fill('#user_login', 'admin');
        await page.fill('#user_pass', 'admin123');
        
        // Kliknij i poczekaj na nawigację
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }),
            page.click('#wp-submit')
        ]);
        
        // Poczekaj na dashboard
        await page.waitForTimeout(2000);
        
        console.log('✓ Zalogowano\n');
    } catch (error) {
        console.log('⚠️  Logowanie może nie działać poprawnie, kontynuuję...\n');
        console.log(`   Błąd: ${error.message}\n`);
    }
}

/**
 * Testy palet kolorów
 */
async function testColorPalettes(page) {
    console.log('🎨 Testowanie palet kolorów...');
    
    const palettes = [
        'professional-blue',
        'creative-purple',
        'energetic-green',
        'sunset',
        'ocean-breeze',
        'midnight',
        'forest',
        'coral',
        'dark-elegance',
        'monochrome'
    ];
    
    for (const palette of palettes) {
        await testSingleOption(
            page,
            `palette-${palette}`,
            `Paleta: ${palette}`,
            async () => {
                // Kliknij przycisk Apply dla palety
                const selector = `[data-palette="${palette}"] .apply-palette`;
                await page.click(selector);
                await page.waitForTimeout(1000);
            }
        );
    }
    
    console.log('✓ Palety kolorów przetestowane\n');
}

/**
 * Testy szablonów
 */
async function testTemplates(page) {
    console.log('📋 Testowanie szablonów...');
    
    const templates = [
        'default',
        'minimalist',
        'corporate',
        'creative',
        'dark-professional',
        'light-airy',
        'bold-modern',
        'classic',
        'futuristic',
        'elegant',
        'high-contrast'
    ];
    
    for (const template of templates) {
        await testSingleOption(
            page,
            `template-${template}`,
            `Szablon: ${template}`,
            async () => {
                const selector = `[data-template="${template}"] .apply-template`;
                await page.click(selector);
                await page.waitForTimeout(1000);
            }
        );
    }
    
    console.log('✓ Szablony przetestowane\n');
}

/**
 * Testy trybu ciemnego
 */
async function testDarkMode(page) {
    console.log('🌙 Testowanie trybu ciemnego...');
    
    // Włącz tryb ciemny
    await testSingleOption(
        page,
        'dark-mode-enabled',
        'Tryb ciemny: włączony',
        async () => {
            await page.click('#dark-mode-toggle');
            await page.waitForTimeout(500);
        }
    );
    
    // Wyłącz tryb ciemny
    await testSingleOption(
        page,
        'dark-mode-disabled',
        'Tryb ciemny: wyłączony',
        async () => {
            await page.click('#dark-mode-toggle');
            await page.waitForTimeout(500);
        }
    );
    
    console.log('✓ Tryb ciemny przetestowany\n');
}

/**
 * Testy efektów wizualnych
 */
async function testVisualEffects(page) {
    console.log('✨ Testowanie efektów wizualnych...');
    
    const effects = [
        { id: 'glassmorphism-admin-bar', name: 'Glassmorphism - Admin Bar' },
        { id: 'glassmorphism-menu', name: 'Glassmorphism - Menu' },
        { id: 'floating-admin-bar', name: 'Floating - Admin Bar' },
        { id: 'floating-menu', name: 'Floating - Menu' },
        { id: 'border-radius', name: 'Border Radius' },
        { id: 'shadows-soft', name: 'Cienie: Soft' },
        { id: 'shadows-medium', name: 'Cienie: Medium' },
        { id: 'shadows-hard', name: 'Cienie: Hard' },
        { id: 'shadows-dramatic', name: 'Cienie: Dramatic' }
    ];
    
    for (const effect of effects) {
        await testSingleOption(
            page,
            `effect-${effect.id}`,
            effect.name,
            async () => {
                await page.click(`#${effect.id}`);
                await page.waitForTimeout(500);
            }
        );
    }
    
    console.log('✓ Efekty wizualne przetestowane\n');
}

/**
 * Testy typografii
 */
async function testTypography(page) {
    console.log('📝 Testowanie typografii...');
    
    const fontSizes = [
        { selector: '#admin-bar-font-size', value: '14', name: 'Admin Bar Font Size: 14px' },
        { selector: '#menu-font-size', value: '13', name: 'Menu Font Size: 13px' },
        { selector: '#content-font-size', value: '14', name: 'Content Font Size: 14px' }
    ];
    
    for (const font of fontSizes) {
        await testSingleOption(
            page,
            `font-${font.selector.replace('#', '')}`,
            font.name,
            async () => {
                await page.fill(font.selector, font.value);
                await page.waitForTimeout(500);
            }
        );
    }
    
    console.log('✓ Typografia przetestowana\n');
}

/**
 * Testy paska administracyjnego
 */
async function testAdminBar(page) {
    console.log('📊 Testowanie paska administracyjnego...');
    
    const options = [
        { selector: '#admin-bar-bg-color', value: '#2271b1', name: 'Kolor tła' },
        { selector: '#admin-bar-text-color', value: '#ffffff', name: 'Kolor tekstu' },
        { selector: '#admin-bar-height', value: '32', name: 'Wysokość: 32px' }
    ];
    
    for (const option of options) {
        await testSingleOption(
            page,
            `admin-bar-${option.selector.replace('#', '')}`,
            `Admin Bar - ${option.name}`,
            async () => {
                await page.fill(option.selector, option.value);
                await page.waitForTimeout(500);
            }
        );
    }
    
    console.log('✓ Pasek administracyjny przetestowany\n');
}

/**
 * Testy menu administracyjnego
 */
async function testAdminMenu(page) {
    console.log('📑 Testowanie menu administracyjnego...');
    
    const options = [
        { selector: '#admin-menu-bg-color', value: '#1d2327', name: 'Kolor tła' },
        { selector: '#admin-menu-text-color', value: '#ffffff', name: 'Kolor tekstu' },
        { selector: '#admin-menu-width', value: '160', name: 'Szerokość: 160px' }
    ];
    
    for (const option of options) {
        await testSingleOption(
            page,
            `admin-menu-${option.selector.replace('#', '')}`,
            `Admin Menu - ${option.name}`,
            async () => {
                await page.fill(option.selector, option.value);
                await page.waitForTimeout(500);
            }
        );
    }
    
    console.log('✓ Menu administracyjne przetestowane\n');
}

/**
 * Testy podglądu na żywo
 */
async function testLivePreview(page) {
    console.log('👁️ Testowanie podglądu na żywo...');
    
    await testSingleOption(
        page,
        'live-preview-enabled',
        'Podgląd na żywo: włączony',
        async () => {
            await page.click('#live-preview-toggle');
            await page.waitForTimeout(500);
        }
    );
    
    await testSingleOption(
        page,
        'live-preview-disabled',
        'Podgląd na żywo: wyłączony',
        async () => {
            await page.click('#live-preview-toggle');
            await page.waitForTimeout(500);
        }
    );
    
    console.log('✓ Podgląd na żywo przetestowany\n');
}

/**
 * Testy optymalizacji mobilnej
 */
async function testMobileOptimization(page) {
    console.log('📱 Testowanie optymalizacji mobilnej...');
    
    // Test w różnych rozdzielczościach
    const viewports = [
        { width: 375, height: 667, name: 'iPhone SE' },
        { width: 768, height: 1024, name: 'iPad' },
        { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await testSingleOption(
            page,
            `mobile-${viewport.name.toLowerCase().replace(' ', '-')}`,
            `Widok: ${viewport.name} (${viewport.width}x${viewport.height})`,
            async () => {
                await page.waitForTimeout(500);
            }
        );
    }
    
    // Przywróć domyślny viewport
    await page.setViewportSize(CONFIG.viewport);
    
    console.log('✓ Optymalizacja mobilna przetestowana\n');
}

/**
 * Testy dostępności
 */
async function testAccessibility(page) {
    console.log('♿ Testowanie dostępności...');
    
    // Test nawigacji klawiaturą
    await testSingleOption(
        page,
        'accessibility-keyboard-nav',
        'Nawigacja klawiaturą',
        async () => {
            await page.keyboard.press('Tab');
            await page.waitForTimeout(200);
            await page.keyboard.press('Tab');
            await page.waitForTimeout(200);
        }
    );
    
    // Test wysokiego kontrastu
    await testSingleOption(
        page,
        'accessibility-high-contrast',
        'Wysoki kontrast',
        async () => {
            await page.click('#high-contrast-mode');
            await page.waitForTimeout(500);
        }
    );
    
    console.log('✓ Dostępność przetestowana\n');
}

/**
 * Test pojedynczej opcji
 */
async function testSingleOption(page, testId, testName, actionFn) {
    const startTime = Date.now();
    
    try {
        console.log(`  ⏳ ${testName}...`);
        
        // Wykonaj akcję
        await actionFn();
        
        // Poczekaj 3 sekundy na zastosowanie zmian
        await page.waitForTimeout(3000);
        
        // Zrób zrzut ekranu
        const screenshotPath = await takeScreenshot(page, testId, testName);
        
        // Zapisz wynik
        const duration = Date.now() - startTime;
        testResults.tests.push({
            id: testId,
            name: testName,
            status: 'passed',
            duration,
            screenshot: screenshotPath
        });
        
        testResults.summary.total++;
        testResults.summary.passed++;
        
        console.log(`  ✓ ${testName} - OK (${duration}ms)`);
        
    } catch (error) {
        const duration = Date.now() - startTime;
        testResults.tests.push({
            id: testId,
            name: testName,
            status: 'failed',
            duration,
            error: error.message
        });
        
        testResults.summary.total++;
        testResults.summary.failed++;
        
        console.log(`  ✗ ${testName} - FAILED (${duration}ms)`);
        console.error(`    Error: ${error.message}`);
    }
}

/**
 * Zrób zrzut ekranu
 */
async function takeScreenshot(page, testId, testName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${testId}_${timestamp}.png`;
    const filepath = path.join(CONFIG.screenshotsDir, filename);
    
    await page.screenshot({
        path: filepath,
        fullPage: true
    });
    
    testResults.summary.screenshots++;
    
    return filename;
}

/**
 * Generuj raport HTML
 */
async function generateReport() {
    console.log('\n📊 Generowanie raportu...');
    
    const successRate = ((testResults.summary.passed / testResults.summary.total) * 100).toFixed(2);
    
    const html = `
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MASE - Raport Testów Wizualnych z Playwright</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 40px; }
        .container { max-width: 1400px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #2271b1; margin-bottom: 10px; }
        .meta { color: #646970; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0; }
        .summary-card { padding: 30px; border-radius: 8px; text-align: center; }
        .summary-card.total { background: #f0f6fc; border: 2px solid #2271b1; }
        .summary-card.passed { background: #edfaef; border: 2px solid #00a32a; }
        .summary-card.failed { background: #fcf0f1; border: 2px solid #d63638; }
        .summary-card.screenshots { background: #fef7e0; border: 2px solid #dba617; }
        .summary-number { font-size: 48px; font-weight: bold; margin-bottom: 10px; }
        .summary-label { font-size: 14px; color: #646970; }
        .test-list { margin-top: 40px; }
        .test-item { margin: 20px 0; padding: 20px; border-radius: 8px; border-left: 4px solid #dcdcde; }
        .test-item.passed { background: #edfaef; border-left-color: #00a32a; }
        .test-item.failed { background: #fcf0f1; border-left-color: #d63638; }
        .test-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .test-name { font-size: 18px; font-weight: 600; }
        .test-status { padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; }
        .test-status.passed { background: #00a32a; color: white; }
        .test-status.failed { background: #d63638; color: white; }
        .test-meta { font-size: 13px; color: #646970; margin-bottom: 15px; }
        .screenshot { max-width: 100%; border: 1px solid #dcdcde; border-radius: 4px; cursor: pointer; transition: transform 0.2s; }
        .screenshot:hover { transform: scale(1.02); }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; align-items: center; justify-content: center; }
        .modal.active { display: flex; }
        .modal img { max-width: 95%; max-height: 95%; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 MASE - Raport Testów Wizualnych z Playwright</h1>
        <div class="meta">
            Data wygenerowania: ${new Date(testResults.timestamp).toLocaleString('pl-PL')}<br>
            Czas trwania: ${Math.round((Date.now() - new Date(testResults.timestamp).getTime()) / 1000)}s
        </div>
        
        <div class="summary">
            <div class="summary-card total">
                <div class="summary-number">${testResults.summary.total}</div>
                <div class="summary-label">Wszystkie Testy</div>
            </div>
            <div class="summary-card passed">
                <div class="summary-number">${testResults.summary.passed}</div>
                <div class="summary-label">Zaliczone</div>
            </div>
            <div class="summary-card failed">
                <div class="summary-number">${testResults.summary.failed}</div>
                <div class="summary-label">Niezaliczone</div>
            </div>
            <div class="summary-card screenshots">
                <div class="summary-number">${testResults.summary.screenshots}</div>
                <div class="summary-label">Zrzuty Ekranu</div>
            </div>
        </div>
        
        <h2>Wskaźnik Sukcesu: ${successRate}%</h2>
        
        <div class="test-list">
            <h2>Szczegółowe Wyniki</h2>
            ${testResults.tests.map(test => `
                <div class="test-item ${test.status}">
                    <div class="test-header">
                        <div class="test-name">${test.name}</div>
                        <div class="test-status ${test.status}">${test.status === 'passed' ? '✓ PASSED' : '✗ FAILED'}</div>
                    </div>
                    <div class="test-meta">
                        ID: ${test.id} | Czas: ${test.duration}ms
                        ${test.error ? `<br>Błąd: ${test.error}` : ''}
                    </div>
                    ${test.screenshot ? `
                        <img src="../screenshots/${test.screenshot}" 
                             alt="${test.name}" 
                             class="screenshot"
                             onclick="showModal(this.src)">
                    ` : ''}
                </div>
            `).join('')}
        </div>
    </div>
    
    <div class="modal" id="modal" onclick="hideModal()">
        <img id="modalImage" src="" alt="Screenshot">
    </div>
    
    <script>
        function showModal(src) {
            document.getElementById('modalImage').src = src;
            document.getElementById('modal').classList.add('active');
        }
        function hideModal() {
            document.getElementById('modal').classList.remove('active');
        }
    </script>
</body>
</html>
    `;
    
    const reportPath = path.join(CONFIG.reportsDir, `report-${Date.now()}.html`);
    fs.writeFileSync(reportPath, html);
    
    // Zapisz też JSON
    const jsonPath = path.join(CONFIG.reportsDir, `results-${Date.now()}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(testResults, null, 2));
    
    console.log(`✓ Raport HTML: ${reportPath}`);
    console.log(`✓ Wyniki JSON: ${jsonPath}`);
}

// Uruchom testy
runVisualTests().catch(console.error);
