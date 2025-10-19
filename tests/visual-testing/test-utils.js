/**
 * MASE Test Utilities
 * Helper functions for Playwright tests
 */

/**
 * Helper for waiting for tab switches
 * @param {Page} page - Playwright page object
 * @param {string} tabId - Tab ID to switch to
 * @param {number} timeout - Maximum wait time in ms
 */
async function waitForTabSwitch(page, tabId, timeout = 2000) {
    try {
        // Click the tab button
        await page.click(`#tab-button-${tabId}`);
        
        // Wait for tab content to become active
        await page.waitForSelector(`#tab-${tabId}.active`, { timeout });
        
        // Additional wait for any animations/transitions
        await page.waitForTimeout(500);
        
        // Verify tab is visible
        const isVisible = await page.isVisible(`#tab-${tabId}`);
        if (!isVisible) {
            throw new Error(`Tab ${tabId} is not visible after switch`);
        }
        
        console.log(`✓ Switched to tab: ${tabId}`);
        return true;
    } catch (error) {
        console.error(`✗ Failed to switch to tab ${tabId}:`, error.message);
        return false;
    }
}

/**
 * Helper for color picker interactions
 * Uses fallback inputs for better test compatibility
 * @param {Page} page - Playwright page object
 * @param {string} selector - Color picker selector
 * @param {string} value - Color value to set
 * @param {boolean} verify - Whether to verify the value was set
 */
async function setColorPicker(page, selector, value, verify = true) {
    try {
        // Try fallback input first
        const fallbackSelector = `${selector}-fallback`;
        const fallbackExists = await page.$(fallbackSelector);
        
        const targetSelector = fallbackExists ? fallbackSelector : selector;
        
        // Fill the input
        await page.fill(targetSelector, value);
        
        // Wait for synchronization
        await page.waitForTimeout(500);
        
        // Verify if requested
        if (verify) {
            const appliedValue = await page.inputValue(targetSelector);
            if (!appliedValue || appliedValue.toLowerCase() !== value.toLowerCase()) {
                throw new Error(`Color not applied: expected ${value}, got ${appliedValue}`);
            }
        }
        
        console.log(`✓ Set color ${selector} to ${value}`);
        return true;
    } catch (error) {
        console.error(`✗ Failed to set color ${selector}:`, error.message);
        return false;
    }
}

/**
 * Helper for toggle interactions
 * Uses force option to bypass pointer-events blocking
 * @param {Page} page - Playwright page object
 * @param {string} selector - Toggle checkbox selector
 * @param {boolean} verifyStateChange - Whether to verify state changed
 */
async function clickToggle(page, selector, verifyStateChange = true) {
    try {
        // Get initial state
        const initialState = await page.isChecked(selector);
        
        // Click with force option
        await page.click(selector, { force: true });
        
        // Wait for state change
        await page.waitForTimeout(500);
        
        // Verify state changed if requested
        if (verifyStateChange) {
            const newState = await page.isChecked(selector);
            if (newState === initialState) {
                throw new Error('Toggle state did not change');
            }
            console.log(`✓ Toggle ${selector}: ${initialState} → ${newState}`);
        } else {
            console.log(`✓ Clicked toggle ${selector}`);
        }
        
        return true;
    } catch (error) {
        console.error(`✗ Failed to click toggle ${selector}:`, error.message);
        return false;
    }
}

/**
 * Helper for clicking template buttons with visibility checks
 * @param {Page} page - Playwright page object
 * @param {number} index - Template button index
 * @param {boolean} ensureVisible - Whether to ensure button is visible first
 */
async function clickTemplateButton(page, index, ensureVisible = true) {
    try {
        const selector = `.mase-template-apply-btn >> nth=${index}`;
        
        // Check visibility if requested
        if (ensureVisible) {
            const isVisible = await page.isVisible(selector);
            if (!isVisible) {
                throw new Error(`Template button ${index} is not visible`);
            }
        }
        
        // Click with force option
        await page.click(selector, { force: true });
        
        // Wait for template application
        await page.waitForTimeout(500);
        
        console.log(`✓ Clicked template button ${index}`);
        return true;
    } catch (error) {
        console.error(`✗ Failed to click template button ${index}:`, error.message);
        return false;
    }
}

/**
 * Helper for taking screenshots with consistent naming
 * @param {Page} page - Playwright page object
 * @param {string} name - Screenshot name
 * @param {string} dir - Directory to save screenshot
 */
async function takeTestScreenshot(page, name, dir = 'screenshots') {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${name}_${timestamp}.png`;
        const filepath = `${dir}/${filename}`;
        
        await page.screenshot({ path: filepath, fullPage: true });
        
        console.log(`✓ Screenshot saved: ${filename}`);
        return filename;
    } catch (error) {
        console.error(`✗ Failed to take screenshot ${name}:`, error.message);
        return null;
    }
}

/**
 * Helper for waiting for AJAX/network requests to complete
 * @param {Page} page - Playwright page object
 * @param {number} timeout - Maximum wait time in ms
 */
async function waitForNetworkIdle(page, timeout = 2000) {
    try {
        await page.waitForLoadState('networkidle', { timeout });
        console.log('✓ Network idle');
        return true;
    } catch (error) {
        console.warn('⚠️  Network did not become idle within timeout');
        return false;
    }
}

/**
 * Helper for verifying element visibility with retry
 * @param {Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {number} retries - Number of retries
 * @param {number} delay - Delay between retries in ms
 */
async function ensureVisible(page, selector, retries = 3, delay = 500) {
    for (let i = 0; i < retries; i++) {
        const isVisible = await page.isVisible(selector);
        if (isVisible) {
            console.log(`✓ Element ${selector} is visible`);
            return true;
        }
        
        if (i < retries - 1) {
            console.log(`⏳ Element ${selector} not visible, retrying... (${i + 1}/${retries})`);
            await page.waitForTimeout(delay);
        }
    }
    
    console.error(`✗ Element ${selector} not visible after ${retries} retries`);
    return false;
}

module.exports = {
    waitForTabSwitch,
    setColorPicker,
    clickToggle,
    clickTemplateButton,
    takeTestScreenshot,
    waitForNetworkIdle,
    ensureVisible
};
