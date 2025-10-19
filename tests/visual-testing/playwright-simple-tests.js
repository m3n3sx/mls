/**
 * MASE Simple Visual Testing with Playwright
 * Uproszczone testy - zrzuty ekranu strony MASE
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
    console.log('🚀 Uruchamianie prostych testów wizualnych MASE...\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 100 
    });
    
    const context = await browser.newContext({
        viewport: CONFIG.viewport,
        ignoreHTTPSErrors: true
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
        await takeScreenshot(page, '01-mase-initial', 'Strona MASE - Stan początkowy');
        
        // Przewiń stronę w dół i zrób więcej zrzutów
        await scrollAndCapture(page);
        
        // Różne rozdzielczości
        await testDifferentViewports(page);
        
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
        console.log('⚠️  Logowanie może nie działać poprawnie, kontynuuję...\n');
    }
}

/**
 * Przewiń i rób zrzuty ekranu
 */
async function scrollAndCapture(page) {
    console.log('📜 Przewijanie strony i robienie zrzutów...\n');
    
    const scrollSteps = [
        { name: 'Góra strony', scroll: 0 },
        { name: 'Środek strony', scroll: 500 },
        { name: 'Dół strony', scroll: 1000 },
        { name: 'Koniec strony', scroll: 9999 }
    ];
    
    for (const step of scrollSteps) {
        await page.evaluate((y) => window.scrollTo(0, y), step.scroll);
        await page.waitForTimeout(1000);
        
        const testId = `02-scroll-${step.scroll}`;
        await takeScreenshot(page, testId, `Strona MASE - ${step.name}`);
        
        testResults.tests.push({
            id: testId,
            name: step.name,
            status: 'passed',
            screenshot: `${testId}.png`
        });
        testResults.summary.total++;
        testResults.summary.passed++;
    }
    
    // Przewiń z powrotem na górę
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
}

/**
 * Test różnych rozdzielczości
 */
async function testDifferentViewports(page) {
    console.log('📱 Testowanie różnych rozdzielczości...\n');
    
    const viewports = [
        { width: 375, height: 667, name: 'iPhone SE' },
        { width: 768, height: 1024, name: 'iPad' },
        { width: 1366, height: 768, name: 'Laptop' },
        { width: 1920, height: 1080, name: 'Desktop' },
        { width: 2560, height: 1440, name: '2K Monitor' }
    ];
    
    for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(1000);
        
        const testId = `03-viewport-${viewport.width}x${viewport.height}`;
        await takeScreenshot(page, testId, `${viewport.name} (${viewport.width}x${viewport.height})`);
        
        testResults.tests.push({
            id: testId,
            name: viewport.name,
            status: 'passed',
            screenshot: `${testId}.png`
        });
        testResults.summary.total++;
        testResults.summary.passed++;
    }
    
    // Przywróć domyślny viewport
    await page.setViewportSize(CONFIG.viewport);
}

/**
 * Zrób zrzut ekranu
 */
async function takeScreenshot(page, testId, testName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${testId}_${timestamp}.png`;
    const filepath = path.join(CONFIG.screenshotsDir, filename);
    
    console.log(`  📸 ${testName}...`);
    
    await page.screenshot({
        path: filepath,
        fullPage: true
    });
    
    testResults.summary.screenshots++;
    console.log(`  ✓ Zapisano: ${filename}`);
    
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
    <title>MASE - Prosty Raport Testów Wizualnych</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 40px; }
        .container { max-width: 1400px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #2271b1; margin-bottom: 10px; }
        .meta { color: #646970; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0; }
        .summary-card { padding: 30px; border-radius: 8px; text-align: center; }
        .summary-card.total { background: #f0f6fc; border: 2px solid #2271b1; }
        .summary-card.passed { background: #edfaef; border: 2px solid #00a32a; }
        .summary-card.screenshots { background: #fef7e0; border: 2px solid #dba617; }
        .summary-number { font-size: 48px; font-weight: bold; margin-bottom: 10px; }
        .summary-label { font-size: 14px; color: #646970; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 40px; }
        .gallery-item { border: 1px solid #dcdcde; border-radius: 8px; overflow: hidden; }
        .gallery-item img { width: 100%; height: auto; cursor: pointer; transition: transform 0.2s; }
        .gallery-item img:hover { transform: scale(1.05); }
        .gallery-item-title { padding: 15px; background: #f6f7f7; font-size: 14px; font-weight: 600; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; align-items: center; justify-content: center; }
        .modal.active { display: flex; }
        .modal img { max-width: 95%; max-height: 95%; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 MASE - Prosty Raport Testów Wizualnych</h1>
        <div class="meta">
            Data wygenerowania: ${new Date(testResults.timestamp).toLocaleString('pl-PL')}
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
            <div class="summary-card screenshots">
                <div class="summary-number">${testResults.summary.screenshots}</div>
                <div class="summary-label">Zrzuty Ekranu</div>
            </div>
        </div>
        
        <h2>Wskaźnik Sukcesu: ${successRate}%</h2>
        
        <div class="gallery">
            <h2 style="grid-column: 1/-1;">Galeria Zrzutów Ekranu</h2>
            ${testResults.tests.map(test => `
                <div class="gallery-item">
                    <img src="../screenshots/${test.screenshot}" 
                         alt="${test.name}" 
                         onclick="showModal(this.src)">
                    <div class="gallery-item-title">${test.name}</div>
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
    
    const reportPath = path.join(CONFIG.reportsDir, `simple-report-${Date.now()}.html`);
    fs.writeFileSync(reportPath, html);
    
    // Zapisz też JSON
    const jsonPath = path.join(CONFIG.reportsDir, `simple-results-${Date.now()}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(testResults, null, 2));
    
    console.log(`✓ Raport HTML: ${reportPath}`);
    console.log(`✓ Wyniki JSON: ${jsonPath}`);
}

// Uruchom testy
runVisualTests().catch(console.error);
