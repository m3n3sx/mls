/**
 * MASE Detailed Visual Testing with Playwright
 * Szczegółowe testy wszystkich opcji wtyczki MASE
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
    timeout: 30000,
    waitAfterAction: 3000 // 3 sekundy po każdej akcji
};

// Utwórz katalogi
[CONFIG.screenshotsDir, CONFIG.reportsDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Wyniki testów
const testResults = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: { total: 0, passed: 0, failed: 0, screenshots: 0 }
};

let screenshotCounter = 0;

/**
 * Główna funkcja testowa
 */
async function runDetailedTests() {
    console.log('🚀 Uruchamianie szczegółowych testów MASE...\n');
    
    const browser = await chromium.launch({ headless: false, slowMo: 50 });
    const context = await browser.newContext({
        viewport: CONFIG.viewport,
        ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
    
    try {
        // Zaloguj się
        await loginToWordPress(page);
        
        // Przejdź do MASE
        console.log('📍 Przechodzę do strony MASE...');
        await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(3000);
        console.log('✓ Strona MASE załadowana\n');
        
        // Zrzut początkowy
        await takeScreenshot(page, 'initial-state', 'Stan początkowy');
        
        // Testy wszystkich zakładek
        await testGeneralTab(page);
        await testAdminBarTab(page);
        await testMenuTab(page);
        await testContentTab(page);
        await testTypographyTab(page);
        await testEffectsTab(page);
        await testTemplatesTab(page);
        await testAdvancedTab(page);
        
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
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }),
            page.click('#wp-submit')
        ]);
        await page.waitForTimeout(2000);
        console.log('✓ Zalogowano\n');
    } catch (error) {
        console.log('⚠️  Logowanie może nie działać poprawnie\n');
    }
}

/**
 * Zakładka: General
 */
async function testGeneralTab(page) {
    console.log('📋 Testowanie zakładki General...\n');
    
    await clickTab(page, 'general');
    
    // Test 1: Tryb ciemny
    await testCheckbox(page, '#mase-dark-mode-toggle', 'Tryb ciemny');
    
    // Test 2: Live preview
    await testCheckbox(page, '#mase-live-preview-toggle', 'Live preview');
    
    // Test 3: Enable plugin
    await testCheckbox(page, '#master-enable-plugin', 'Enable plugin');
    
    // Test 4: Apply to login
    await testCheckbox(page, '#master-apply-to-login', 'Apply to login page');
    
    // Test 5-14: Palety kolorów (10 palet)
    const paletteButtons = await page.$$('.mase-palette-apply-btn');
    console.log(`  Znaleziono ${paletteButtons.length} palet kolorów`);
    
    for (let i = 0; i < Math.min(paletteButtons.length, 10); i++) {
        await testButton(page, `.mase-palette-apply-btn >> nth=${i}`, `Paleta kolorów ${i + 1}`);
    }
    
    console.log('✓ Zakładka General przetestowana\n');
}

/**
 * Zakładka: Admin Bar
 */
async function testAdminBarTab(page) {
    console.log('📊 Testowanie zakładki Admin Bar...\n');
    
    await clickTab(page, 'admin-bar');
    
    // Testy kolorów
    await testColorInput(page, '#admin-bar-bg-color', 'Admin Bar - Kolor tła', '#2271b1');
    await testColorInput(page, '#admin-bar-text-color', 'Admin Bar - Kolor tekstu', '#ffffff');
    await testColorInput(page, '#admin-bar-hover-color', 'Admin Bar - Kolor hover', '#135e96');
    
    // Test wysokości
    await testNumberInput(page, '#admin-bar-height', 'Admin Bar - Wysokość', '40');
    
    // Test rozmiaru czcionki
    await testNumberInput(page, '#admin-bar-font-size', 'Admin Bar - Rozmiar czcionki', '14');
    
    // Test checkboxów
    await testCheckbox(page, '#admin-bar-glassmorphism', 'Admin Bar - Glassmorphism');
    await testCheckbox(page, '#admin-bar-floating', 'Admin Bar - Floating');
    
    console.log('✓ Zakładka Admin Bar przetestowana\n');
}

/**
 * Zakładka: Menu
 */
async function testMenuTab(page) {
    console.log('📑 Testowanie zakładki Menu...\n');
    
    await clickTab(page, 'menu');
    
    // Testy kolorów
    await testColorInput(page, '#admin-menu-bg-color', 'Menu - Kolor tła', '#1d2327');
    await testColorInput(page, '#admin-menu-text-color', 'Menu - Kolor tekstu', '#ffffff');
    await testColorInput(page, '#admin-menu-hover-bg-color', 'Menu - Kolor hover tła', '#2c3338');
    await testColorInput(page, '#admin-menu-hover-text-color', 'Menu - Kolor hover tekstu', '#72aee6');
    
    // Test szerokości
    await testNumberInput(page, '#admin-menu-width', 'Menu - Szerokość', '180');
    
    // Test rozmiaru czcionki
    await testNumberInput(page, '#admin-menu-font-size', 'Menu - Rozmiar czcionki', '13');
    
    // Test checkboxa
    await testCheckbox(page, '#admin-menu-glassmorphism', 'Menu - Glassmorphism');
    
    console.log('✓ Zakładka Menu przetestowana\n');
}

/**
 * Zakładka: Content
 */
async function testContentTab(page) {
    console.log('📄 Testowanie zakładki Content...\n');
    
    await clickTab(page, 'content');
    
    await testColorInput(page, '#content-bg-color', 'Content - Kolor tła', '#f0f0f1');
    await testColorInput(page, '#content-text-color', 'Content - Kolor tekstu', '#1d2327');
    await testNumberInput(page, '#content-max-width', 'Content - Maksymalna szerokość', '1200');
    
    console.log('✓ Zakładka Content przetestowana\n');
}

/**
 * Zakładka: Typography
 */
async function testTypographyTab(page) {
    console.log('📝 Testowanie zakładki Typography...\n');
    
    await clickTab(page, 'typography');
    
    await testCheckbox(page, '#typography-enable-google-fonts', 'Typography - Enable Google Fonts');
    await testNumberInput(page, '#typo-admin-bar-font-size', 'Typography - Admin Bar rozmiar', '14');
    await testNumberInput(page, '#typo-admin-menu-font-size', 'Typography - Menu rozmiar', '13');
    await testNumberInput(page, '#typo-content-font-size', 'Typography - Content rozmiar', '14');
    
    console.log('✓ Zakładka Typography przetestowana\n');
}

/**
 * Zakładka: Effects
 */
async function testEffectsTab(page) {
    console.log('✨ Testowanie zakładki Effects...\n');
    
    await clickTab(page, 'effects');
    
    await testCheckbox(page, '#effects-page-animations', 'Effects - Page animations');
    await testCheckbox(page, '#effects-microanimations', 'Effects - Microanimations');
    await testCheckbox(page, '#effects-hover-effects', 'Effects - Hover effects');
    await testCheckbox(page, '#effects-particle-system', 'Effects - Particle system');
    await testCheckbox(page, '#effects-3d-effects', 'Effects - 3D effects');
    await testCheckbox(page, '#effects-performance-mode', 'Effects - Performance mode');
    
    console.log('✓ Zakładka Effects przetestowana\n');
}

/**
 * Zakładka: Templates
 */
async function testTemplatesTab(page) {
    console.log('🎨 Testowanie zakładki Templates...\n');
    
    await clickTab(page, 'templates');
    
    // Test przycisków Apply dla szablonów
    const templateButtons = await page.$$('.mase-template-apply-btn');
    console.log(`  Znaleziono ${templateButtons.length} szablonów`);
    
    for (let i = 0; i < Math.min(templateButtons.length, 11); i++) {
        await testButton(page, `.mase-template-apply-btn >> nth=${i}`, `Szablon ${i + 1}`);
    }
    
    console.log('✓ Zakładka Templates przetestowana\n');
}

/**
 * Zakładka: Advanced
 */
async function testAdvancedTab(page) {
    console.log('⚙️  Testowanie zakładki Advanced...\n');
    
    await clickTab(page, 'advanced');
    
    await testCheckbox(page, '#advanced-auto-palette-switch', 'Advanced - Auto palette switch');
    await testCheckbox(page, '#advanced-backup-enabled', 'Advanced - Backup enabled');
    await testCheckbox(page, '#advanced-backup-before-changes', 'Advanced - Backup before changes');
    
    console.log('✓ Zakładka Advanced przetestowana\n');
}

/**
 * Kliknij zakładkę
 */
async function clickTab(page, tabName) {
    try {
        await page.click(`#tab-button-${tabName}`);
        await page.waitForTimeout(1000);
    } catch (error) {
        console.log(`  ⚠️  Nie można kliknąć zakładki ${tabName}`);
    }
}

/**
 * Test checkboxa
 */
async function testCheckbox(page, selector, name) {
    const testId = `checkbox-${++screenshotCounter}`;
    console.log(`  ⏳ ${name}...`);
    
    try {
        const isChecked = await page.isChecked(selector);
        await page.click(selector);
        await page.waitForTimeout(CONFIG.waitAfterAction);
        await takeScreenshot(page, testId, name);
        
        recordTest(testId, name, 'passed');
        console.log(`  ✓ ${name} - OK`);
    } catch (error) {
        recordTest(testId, name, 'failed', error.message);
        console.log(`  ✗ ${name} - FAILED`);
    }
}

/**
 * Test pola kolorów
 */
async function testColorInput(page, selector, name, value) {
    const testId = `color-${++screenshotCounter}`;
    console.log(`  ⏳ ${name}...`);
    
    try {
        await page.fill(selector, value);
        await page.waitForTimeout(CONFIG.waitAfterAction);
        await takeScreenshot(page, testId, name);
        
        recordTest(testId, name, 'passed');
        console.log(`  ✓ ${name} - OK`);
    } catch (error) {
        recordTest(testId, name, 'failed', error.message);
        console.log(`  ✗ ${name} - FAILED`);
    }
}

/**
 * Test pola liczbowego
 */
async function testNumberInput(page, selector, name, value) {
    const testId = `number-${++screenshotCounter}`;
    console.log(`  ⏳ ${name}...`);
    
    try {
        await page.fill(selector, value);
        await page.waitForTimeout(CONFIG.waitAfterAction);
        await takeScreenshot(page, testId, name);
        
        recordTest(testId, name, 'passed');
        console.log(`  ✓ ${name} - OK`);
    } catch (error) {
        recordTest(testId, name, 'failed', error.message);
        console.log(`  ✗ ${name} - FAILED`);
    }
}

/**
 * Test przycisku
 */
async function testButton(page, selector, name) {
    const testId = `button-${++screenshotCounter}`;
    console.log(`  ⏳ ${name}...`);
    
    try {
        await page.click(selector);
        await page.waitForTimeout(CONFIG.waitAfterAction);
        await takeScreenshot(page, testId, name);
        
        recordTest(testId, name, 'passed');
        console.log(`  ✓ ${name} - OK`);
    } catch (error) {
        recordTest(testId, name, 'failed', error.message);
        console.log(`  ✗ ${name} - FAILED`);
    }
}

/**
 * Zrób zrzut ekranu
 */
async function takeScreenshot(page, testId, testName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${String(screenshotCounter).padStart(3, '0')}-${testId}_${timestamp}.png`;
    const filepath = path.join(CONFIG.screenshotsDir, filename);
    
    await page.screenshot({ path: filepath, fullPage: true });
    testResults.summary.screenshots++;
    
    return filename;
}

/**
 * Zapisz wynik testu
 */
function recordTest(testId, testName, status, error = null) {
    testResults.tests.push({
        id: testId,
        name: testName,
        status,
        error,
        screenshot: `${String(screenshotCounter).padStart(3, '0')}-${testId}.png`
    });
    
    testResults.summary.total++;
    if (status === 'passed') testResults.summary.passed++;
    else testResults.summary.failed++;
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
    <title>MASE - Szczegółowy Raport Testów</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 40px; }
        .container { max-width: 1600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
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
        .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 40px; }
        .gallery-item { border: 1px solid #dcdcde; border-radius: 8px; overflow: hidden; }
        .gallery-item.failed { border-color: #d63638; border-width: 2px; }
        .gallery-item img { width: 100%; height: auto; cursor: pointer; transition: transform 0.2s; }
        .gallery-item img:hover { transform: scale(1.05); }
        .gallery-item-title { padding: 15px; background: #f6f7f7; font-size: 14px; font-weight: 600; }
        .gallery-item.failed .gallery-item-title { background: #fcf0f1; color: #d63638; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; align-items: center; justify-content: center; }
        .modal.active { display: flex; }
        .modal img { max-width: 95%; max-height: 95%; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 MASE - Szczegółowy Raport Testów Wizualnych</h1>
        <div class="meta">
            Data wygenerowania: ${new Date(testResults.timestamp).toLocaleString('pl-PL')}<br>
            Wszystkie opcje wtyczki MASE przetestowane
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
        
        <div class="gallery">
            <h2 style="grid-column: 1/-1;">Galeria Zrzutów Ekranu</h2>
            ${testResults.tests.map(test => `
                <div class="gallery-item ${test.status}">
                    <img src="../screenshots/${test.screenshot}" 
                         alt="${test.name}" 
                         onclick="showModal(this.src)">
                    <div class="gallery-item-title">
                        ${test.status === 'passed' ? '✓' : '✗'} ${test.name}
                    </div>
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
    
    const reportPath = path.join(CONFIG.reportsDir, `detailed-report-${Date.now()}.html`);
    fs.writeFileSync(reportPath, html);
    
    const jsonPath = path.join(CONFIG.reportsDir, `detailed-results-${Date.now()}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(testResults, null, 2));
    
    console.log(`✓ Raport HTML: ${reportPath}`);
    console.log(`✓ Wyniki JSON: ${jsonPath}`);
}

// Uruchom testy
runDetailedTests().catch(console.error);
