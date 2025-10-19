/**
 * Inspekcja strony MASE - sprawdź wszystkie dostępne opcje
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function inspectMASE() {
    console.log('🔍 Inspekcja strony MASE...\n');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();
    
    try {
        // Zaloguj się
        console.log('🔐 Logowanie...');
        await page.goto('http://localhost/wp-login.php');
        await page.fill('#user_login', 'admin');
        await page.fill('#user_pass', 'admin123');
        await Promise.all([
            page.waitForNavigation({ timeout: 15000 }),
            page.click('#wp-submit')
        ]);
        console.log('✓ Zalogowano\n');
        
        // Przejdź do MASE
        console.log('📍 Przechodzę do strony MASE...');
        await page.goto('http://localhost/wp-admin/admin.php?page=mase-settings', { timeout: 15000 });
        await page.waitForTimeout(3000);
        console.log('✓ Strona załadowana\n');
        
        // Zrób zrzut ekranu
        await page.screenshot({ path: 'mase-page-full.png', fullPage: true });
        console.log('✓ Zrzut ekranu: mase-page-full.png\n');
        
        // Pobierz HTML
        const html = await page.content();
        fs.writeFileSync('mase-page.html', html);
        console.log('✓ HTML zapisany: mase-page.html\n');
        
        // Znajdź wszystkie przyciski
        console.log('🔘 Szukam przycisków...');
        const buttons = await page.$$eval('button, input[type="button"], input[type="submit"], .button', 
            elements => elements.map(el => ({
                text: el.textContent?.trim() || el.value,
                class: el.className,
                id: el.id,
                type: el.type
            }))
        );
        console.log(`Znaleziono ${buttons.length} przycisków:`);
        buttons.forEach((btn, i) => {
            if (btn.text) console.log(`  ${i+1}. "${btn.text}" (${btn.class || btn.id})`);
        });
        console.log('');
        
        // Znajdź wszystkie inputy
        console.log('📝 Szukam pól input...');
        const inputs = await page.$$eval('input[type="text"], input[type="number"], input[type="color"], textarea, select', 
            elements => elements.map(el => ({
                name: el.name,
                id: el.id,
                type: el.type,
                placeholder: el.placeholder
            }))
        );
        console.log(`Znaleziono ${inputs.length} pól input:`);
        inputs.slice(0, 20).forEach((inp, i) => {
            console.log(`  ${i+1}. ${inp.type} - ${inp.name || inp.id}`);
        });
        console.log('');
        
        // Znajdź wszystkie checkboxy
        console.log('☑️  Szukam checkboxów...');
        const checkboxes = await page.$$eval('input[type="checkbox"]', 
            elements => elements.map(el => ({
                name: el.name,
                id: el.id,
                checked: el.checked
            }))
        );
        console.log(`Znaleziono ${checkboxes.length} checkboxów:`);
        checkboxes.forEach((cb, i) => {
            console.log(`  ${i+1}. ${cb.name || cb.id} (${cb.checked ? 'checked' : 'unchecked'})`);
        });
        console.log('');
        
        // Znajdź wszystkie sekcje/tabs
        console.log('📑 Szukam sekcji/tabs...');
        const tabs = await page.$$eval('.nav-tab, [role="tab"], .tab', 
            elements => elements.map(el => ({
                text: el.textContent?.trim(),
                class: el.className,
                href: el.href
            }))
        );
        console.log(`Znaleziono ${tabs.length} tabs:`);
        tabs.forEach((tab, i) => {
            if (tab.text) console.log(`  ${i+1}. "${tab.text}"`);
        });
        console.log('');
        
        // Zapisz wszystko do JSON
        const inspection = {
            buttons,
            inputs,
            checkboxes,
            tabs,
            timestamp: new Date().toISOString()
        };
        fs.writeFileSync('mase-inspection.json', JSON.stringify(inspection, null, 2));
        console.log('✓ Inspekcja zapisana: mase-inspection.json\n');
        
        console.log('✅ Inspekcja zakończona!');
        console.log('📁 Pliki:');
        console.log('   - mase-page-full.png (zrzut ekranu)');
        console.log('   - mase-page.html (HTML strony)');
        console.log('   - mase-inspection.json (analiza elementów)');
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    } finally {
        await browser.close();
    }
}

inspectMASE();
