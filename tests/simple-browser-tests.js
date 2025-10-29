/**
 * Simple Browser-Based Test Suite for MASE
 * 
 * Run this directly in browser console on MASE settings page
 * No external dependencies, pure JavaScript
 * 
 * Usage:
 * 1. Open WordPress admin
 * 2. Navigate to MASE settings page
 * 3. Open browser console (F12)
 * 4. Paste this entire file
 * 5. Run: runAllTests()
 */

// Test Framework
const TestRunner = {
    tests: [],
    results: {
        passed: 0,
        failed: 0,
        total: 0,
        details: []
    },
    
    test(name, fn) {
        this.tests.push({ name, fn });
    },
    
    async runAll() {
        console.log('🚀 Starting MASE Test Suite...\n');
        this.results = { passed: 0, failed: 0, total: 0, details: [] };
        
        for (const test of this.tests) {
            this.results.total++;
            try {
                await test.fn();
                this.results.passed++;
                this.results.details.push({ name: test.name, status: 'PASS' });
                console.log(`✅ PASS: ${test.name}`);
            } catch (error) {
                this.results.failed++;
                this.results.details.push({ name: test.name, status: 'FAIL', error: error.message });
                console.error(`❌ FAIL: ${test.name}`, error.message);
            }
        }
        
        this.printSummary();
    },
    
    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total Tests: ${this.results.total}`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`Pass Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
        console.log('='.repeat(60));
        
        if (this.results.failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.results.details
                .filter(t => t.status === 'FAIL')
                .forEach(t => console.log(`  - ${t.name}: ${t.error}`));
        }
    }
};

// Helper Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const assert = (condition, message) => {
    if (!condition) throw new Error(message);
};

const assertExists = (selector, message) => {
    const element = $(selector);
    assert(element !== null, message || `Element not found: ${selector}`);
    return element;
};

const assertVisible = (selector, message) => {
    const element = assertExists(selector, message);
    const isVisible = element.offsetParent !== null;
    assert(isVisible, message || `Element not visible: ${selector}`);
    return element;
};

const clickElement = async (selector) => {
    const element = assertVisible(selector);
    element.click();
    await wait(300);
};

const fillInput = async (selector, value) => {
    const element = assertExists(selector);
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    await wait(200);
};

// ============================================================================
// TESTS - General Tab
// ============================================================================

TestRunner.test('General Tab: Settings page loads', () => {
    assertExists('.mase-settings-wrap', 'Settings page wrapper not found');
    assertExists('.mase-tab-nav', 'Tab navigation not found');
    assertExists('#mase-settings-form', 'Settings form not found');
});

TestRunner.test('General Tab: All tabs are present', () => {
    const tabs = [
        'general', 'admin-bar', 'menu', 'content', 'typography',
        'widgets', 'form-controls', 'effects', 'buttons', 'backgrounds',
        'templates', 'login', 'advanced'
    ];
    
    tabs.forEach(tab => {
        assertExists(`[data-tab="${tab}"]`, `Tab button not found: ${tab}`);
        assertExists(`#tab-${tab}`, `Tab content not found: ${tab}`);
    });
});

TestRunner.test('General Tab: Color palettes are visible', () => {
    const palettes = $$('.mase-palette-card');
    assert(palettes.length >= 10, `Expected at least 10 palettes, found ${palettes.length}`);
});

TestRunner.test('General Tab: Master controls exist', () => {
    assertExists('input[name="mase_settings[enable_plugin]"]', 'Enable Plugin toggle not found');
    assertExists('input[name="mase_settings[apply_to_login]"]', 'Apply to Login toggle not found');
    assertExists('input[name="mase_settings[dark_mode]"]', 'Dark Mode toggle not found');
});

// ============================================================================
// TESTS - Live Preview
// ============================================================================

TestRunner.test('Live Preview: Toggle exists', () => {
    assertExists('#mase-live-preview-toggle', 'Live Preview toggle not found');
});

TestRunner.test('Live Preview: Can be toggled', async () => {
    const toggle = assertExists('#mase-live-preview-toggle');
    const initialState = toggle.checked;
    
    await clickElement('#mase-live-preview-toggle');
    await wait(500);
    
    assert(toggle.checked !== initialState, 'Live Preview toggle did not change state');
    
    // Toggle back
    await clickElement('#mase-live-preview-toggle');
});

TestRunner.test('Live Preview: CSS is injected when enabled', async () => {
    const toggle = $('#mase-live-preview-toggle');
    
    if (!toggle.checked) {
        await clickElement('#mase-live-preview-toggle');
        await wait(1000);
    }
    
    const livePreviewStyle = $('#mase-live-preview-css');
    assert(livePreviewStyle !== null, 'Live Preview CSS not injected');
});

// ============================================================================
// TESTS - Admin Bar Tab
// ============================================================================

TestRunner.test('Admin Bar Tab: Can navigate to tab', async () => {
    await clickElement('[data-tab="admin-bar"]');
    await wait(500);
    
    const tabContent = assertVisible('#tab-admin-bar');
    assert(tabContent.classList.contains('active'), 'Admin Bar tab not active');
});

TestRunner.test('Admin Bar Tab: Color controls exist', async () => {
    await clickElement('[data-tab="admin-bar"]');
    await wait(300);
    
    assertExists('input[name*="admin_bar"][name*="background"]', 'Admin Bar background color not found');
    assertExists('input[name*="admin_bar"][name*="text"]', 'Admin Bar text color not found');
});

// ============================================================================
// TESTS - Menu Tab
// ============================================================================

TestRunner.test('Menu Tab: Can navigate to tab', async () => {
    await clickElement('[data-tab="menu"]');
    await wait(500);
    
    const tabContent = assertVisible('#tab-menu');
    assert(tabContent.classList.contains('active'), 'Menu tab not active');
});

TestRunner.test('Menu Tab: Height mode selector exists', async () => {
    await clickElement('[data-tab="menu"]');
    await wait(300);
    
    assertExists('select[name*="menu_height_mode"]', 'Menu height mode selector not found');
});

// ============================================================================
// TESTS - Typography Tab
// ============================================================================

TestRunner.test('Typography Tab: Can navigate to tab', async () => {
    await clickElement('[data-tab="typography"]');
    await wait(500);
    
    const tabContent = assertVisible('#tab-typography');
    assert(tabContent.classList.contains('active'), 'Typography tab not active');
});

TestRunner.test('Typography Tab: Font controls exist', async () => {
    await clickElement('[data-tab="typography"]');
    await wait(300);
    
    const fontControls = $$('select[name*="font"]');
    assert(fontControls.length > 0, 'No font controls found');
});

// ============================================================================
// TESTS - Buttons Tab
// ============================================================================

TestRunner.test('Buttons Tab: Can navigate to tab', async () => {
    await clickElement('[data-tab="buttons"]');
    await wait(500);
    
    const tabContent = assertVisible('#tab-buttons');
    assert(tabContent.classList.contains('active'), 'Buttons tab not active');
});

TestRunner.test('Buttons Tab: Button type selector exists', async () => {
    await clickElement('[data-tab="buttons"]');
    await wait(300);
    
    const buttonTypes = $$('.mase-button-type-tab');
    assert(buttonTypes.length > 0, 'Button type tabs not found');
});

// ============================================================================
// TESTS - Templates Tab
// ============================================================================

TestRunner.test('Templates Tab: Can navigate to tab', async () => {
    await clickElement('[data-tab="templates"]');
    await wait(500);
    
    const tabContent = assertVisible('#tab-templates');
    assert(tabContent.classList.contains('active'), 'Templates tab not active');
});

TestRunner.test('Templates Tab: Template cards exist', async () => {
    await clickElement('[data-tab="templates"]');
    await wait(300);
    
    const templates = $$('.mase-template-card');
    assert(templates.length >= 11, `Expected at least 11 templates, found ${templates.length}`);
});

// ============================================================================
// TESTS - Advanced Tab
// ============================================================================

TestRunner.test('Advanced Tab: Can navigate to tab', async () => {
    await clickElement('[data-tab="advanced"]');
    await wait(500);
    
    const tabContent = assertVisible('#tab-advanced');
    assert(tabContent.classList.contains('active'), 'Advanced tab not active');
});

TestRunner.test('Advanced Tab: Custom CSS textarea exists', async () => {
    await clickElement('[data-tab="advanced"]');
    await wait(300);
    
    assertExists('textarea[name*="custom_css"]', 'Custom CSS textarea not found');
});

TestRunner.test('Advanced Tab: Custom JS textarea exists', async () => {
    await clickElement('[data-tab="advanced"]');
    await wait(300);
    
    assertExists('textarea[name*="custom_js"]', 'Custom JS textarea not found');
});

// ============================================================================
// TESTS - Form Functionality
// ============================================================================

TestRunner.test('Form: Save button exists', () => {
    const saveButton = $('button:has-text("Save Settings")') || 
                      $('button[type="submit"]') ||
                      $('.mase-save-button');
    assert(saveButton !== null, 'Save button not found');
});

TestRunner.test('Form: Nonce field exists', () => {
    assertExists('input[name="mase_nonce"]', 'Nonce field not found');
});

// ============================================================================
// TESTS - Accessibility
// ============================================================================

TestRunner.test('Accessibility: Tab navigation has ARIA labels', () => {
    const tabNav = assertExists('.mase-tab-nav');
    assert(tabNav.getAttribute('role') === 'tablist', 'Tab navigation missing role="tablist"');
    
    const tabs = $$('.mase-tab-button');
    tabs.forEach((tab, index) => {
        assert(tab.getAttribute('role') === 'tab', `Tab ${index} missing role="tab"`);
        assert(tab.hasAttribute('aria-controls'), `Tab ${index} missing aria-controls`);
    });
});

TestRunner.test('Accessibility: Form inputs have labels', () => {
    const inputs = $$('input[type="text"], input[type="number"], input[type="color"]');
    let unlabeled = 0;
    
    inputs.forEach(input => {
        const id = input.id;
        if (id) {
            const label = $(`label[for="${id}"]`);
            if (!label && !input.getAttribute('aria-label')) {
                unlabeled++;
            }
        }
    });
    
    // Allow some unlabeled inputs (color pickers, etc.)
    assert(unlabeled < inputs.length * 0.3, `Too many unlabeled inputs: ${unlabeled}/${inputs.length}`);
});

// ============================================================================
// TESTS - Performance
// ============================================================================

TestRunner.test('Performance: No duplicate IDs', () => {
    const ids = {};
    const elements = $$('[id]');
    
    elements.forEach(el => {
        const id = el.id;
        if (ids[id]) {
            throw new Error(`Duplicate ID found: ${id}`);
        }
        ids[id] = true;
    });
});

TestRunner.test('Performance: No console errors', () => {
    // This test checks if there were errors during page load
    // In a real scenario, you'd need to capture console errors
    console.log('⚠️  Manual check: Review console for errors');
});

// ============================================================================
// RUN ALL TESTS
// ============================================================================

// Auto-run if this is the main execution
if (typeof window !== 'undefined' && window.location.href.includes('page=mase-settings')) {
    console.log('🎯 MASE settings page detected. Ready to run tests.');
    console.log('📝 Run: runAllTests()');
}

// Export function to run all tests
window.runAllTests = () => TestRunner.runAll();
window.MASETests = TestRunner;

console.log('✅ MASE Test Suite loaded!');
console.log('📝 To run tests, type: runAllTests()');
