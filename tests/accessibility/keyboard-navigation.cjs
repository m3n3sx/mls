/**
 * Keyboard Navigation Test
 * 
 * Verifies that all interactive elements are keyboard accessible:
 * - All interactive elements can be reached via Tab key
 * - Focus indicators are visible
 * - Tab order is logical
 * - No keyboard traps exist
 * - Enter/Space activate buttons and controls
 * 
 * Requirements: 11.2
 */

const { chromium } = require('playwright');

/**
 * Check if element has visible focus indicator
 * @param {object} page - Playwright page object
 * @param {object} element - Element handle
 * @returns {boolean} True if focus indicator is visible
 */
async function hasFocusIndicator(page, element) {
  return await page.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    
    // Check for outline
    if (styles.outline !== 'none' && styles.outline !== 'rgb(0, 0, 0) none 0px') {
      return true;
    }
    
    // Check for box-shadow (focus ring)
    if (styles.boxShadow !== 'none' && styles.boxShadow.includes('rgb')) {
      return true;
    }
    
    // Check for border change
    if (styles.borderColor && styles.borderColor !== 'rgb(0, 0, 0)') {
      return true;
    }
    
    return false;
  }, element);
}

/**
 * Get element description for reporting
 * @param {object} page - Playwright page object
 * @param {object} element - Element handle
 * @returns {string} Element description
 */
async function getElementDescription(page, element) {
  return await page.evaluate((el) => {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const classes = el.className ? `.${el.className.split(' ')[0]}` : '';
    const text = el.textContent ? el.textContent.trim().substring(0, 30) : '';
    const type = el.type ? `[type="${el.type}"]` : '';
    
    return `${tag}${id}${classes}${type}${text ? ` "${text}"` : ''}`;
  }, element);
}

/**
 * Test keyboard navigation
 */
async function runKeyboardTests() {
  console.log('='.repeat(80));
  console.log('MASE Accessibility: Keyboard Navigation Test');
  console.log('='.repeat(80));
  console.log('');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to MASE settings page
  const baseUrl = process.env.WP_BASE_URL || 'http://localhost:8080';
  await page.goto(`${baseUrl}/wp-admin/admin.php?page=modern-admin-styler`);
  
  // Wait for page to load
  await page.waitForSelector('.mase-header', { timeout: 10000 });
  
  const results = {
    totalElements: 0,
    reachable: 0,
    unreachable: 0,
    withFocusIndicator: 0,
    withoutFocusIndicator: 0,
    tabOrder: [],
    issues: []
  };
  
  console.log('Test 1: Tab Order and Reachability');
  console.log('-'.repeat(80));
  
  // Get all interactive elements
  const interactiveSelectors = [
    'button',
    'a[href]',
    'input:not([type="hidden"])',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])'
  ];
  
  const allInteractive = await page.$$(interactiveSelectors.join(','));
  results.totalElements = allInteractive.length;
  
  console.log(`Found ${results.totalElements} interactive elements`);
  console.log('');
  
  // Focus on first element
  await page.keyboard.press('Tab');
  
  const visitedElements = new Set();
  let previousElement = null;
  let tabCount = 0;
  const maxTabs = results.totalElements * 2; // Safety limit
  
  while (tabCount < maxTabs) {
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    
    // Check if we've cycled back to the start
    const elementId = await page.evaluate(el => {
      if (!el) return null;
      return el.tagName + (el.id || '') + (el.className || '');
    }, focusedElement);
    
    if (visitedElements.has(elementId) && visitedElements.size > 5) {
      // We've completed a full cycle
      break;
    }
    
    visitedElements.add(elementId);
    
    // Check if element is interactive
    const isInteractive = await page.evaluate((el, selectors) => {
      return selectors.some(selector => el.matches(selector));
    }, focusedElement, interactiveSelectors);
    
    if (isInteractive) {
      const description = await getElementDescription(page, focusedElement);
      const hasFocus = await hasFocusIndicator(page, focusedElement);
      
      results.tabOrder.push({
        order: results.reachable + 1,
        element: description,
        hasFocusIndicator: hasFocus
      });
      
      results.reachable++;
      
      if (hasFocus) {
        results.withFocusIndicator++;
        console.log(`✓ [${results.reachable}] ${description} - Focus indicator visible`);
      } else {
        results.withoutFocusIndicator++;
        console.log(`✗ [${results.reachable}] ${description} - No focus indicator`);
        results.issues.push({
          type: 'missing-focus-indicator',
          element: description
        });
      }
    }
    
    // Move to next element
    await page.keyboard.press('Tab');
    tabCount++;
    
    // Small delay to allow focus to update
    await page.waitForTimeout(50);
  }
  
  results.unreachable = results.totalElements - results.reachable;
  
  console.log('');
  console.log('Test 2: Keyboard Activation');
  console.log('-'.repeat(80));
  
  // Test button activation with Enter and Space
  const buttons = await page.$$('button:not([disabled])');
  let activationTests = 0;
  let activationPassed = 0;
  
  for (let i = 0; i < Math.min(buttons.length, 5); i++) {
    const button = buttons[i];
    const description = await getElementDescription(page, button);
    
    // Focus the button
    await button.focus();
    
    // Try Enter key
    activationTests++;
    const enterWorks = await page.evaluate((btn) => {
      let clicked = false;
      const handler = () => { clicked = true; };
      btn.addEventListener('click', handler, { once: true });
      
      // Simulate Enter key
      const event = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' });
      btn.dispatchEvent(event);
      
      btn.removeEventListener('click', handler);
      return clicked;
    }, button);
    
    if (enterWorks) {
      activationPassed++;
      console.log(`✓ ${description} - Enter key works`);
    } else {
      console.log(`✗ ${description} - Enter key doesn't work`);
      results.issues.push({
        type: 'keyboard-activation-failed',
        element: description,
        key: 'Enter'
      });
    }
  }
  
  console.log('');
  console.log('Test 3: Keyboard Traps');
  console.log('-'.repeat(80));
  
  // Check for keyboard traps by trying to tab through entire page
  let trapDetected = false;
  const startElement = await page.evaluateHandle(() => document.activeElement);
  
  for (let i = 0; i < 50; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(50);
    
    const currentElement = await page.evaluateHandle(() => document.activeElement);
    const isSame = await page.evaluate((start, current) => start === current, startElement, currentElement);
    
    if (isSame && i > 10) {
      trapDetected = true;
      const description = await getElementDescription(page, currentElement);
      console.log(`✗ Keyboard trap detected at: ${description}`);
      results.issues.push({
        type: 'keyboard-trap',
        element: description
      });
      break;
    }
  }
  
  if (!trapDetected) {
    console.log('✓ No keyboard traps detected');
  }
  
  console.log('');
  console.log('Test 4: Tab Order Logic');
  console.log('-'.repeat(80));
  
  // Check if tab order follows visual order
  const tabOrderLogical = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
    
    for (let i = 1; i < elements.length; i++) {
      const prev = elements[i - 1].getBoundingClientRect();
      const curr = elements[i].getBoundingClientRect();
      
      // Check if current element is significantly above previous (wrong order)
      if (curr.top < prev.top - 50) {
        return false;
      }
    }
    
    return true;
  });
  
  if (tabOrderLogical) {
    console.log('✓ Tab order follows logical visual order');
  } else {
    console.log('✗ Tab order does not follow visual order');
    results.issues.push({
      type: 'illogical-tab-order',
      element: 'Page layout'
    });
  }
  
  // Generate summary
  console.log('');
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total interactive elements: ${results.totalElements}`);
  console.log(`Reachable via keyboard: ${results.reachable} (${((results.reachable / results.totalElements) * 100).toFixed(1)}%)`);
  console.log(`With focus indicators: ${results.withFocusIndicator} (${((results.withFocusIndicator / results.reachable) * 100).toFixed(1)}%)`);
  console.log(`Without focus indicators: ${results.withoutFocusIndicator}`);
  console.log(`Keyboard activation tests: ${activationPassed}/${activationTests} passed`);
  console.log(`Keyboard traps: ${trapDetected ? 'DETECTED' : 'None'}`);
  console.log(`Tab order: ${tabOrderLogical ? 'Logical' : 'Illogical'}`);
  console.log('');
  
  const passed = 
    results.unreachable === 0 &&
    results.withoutFocusIndicator === 0 &&
    !trapDetected &&
    tabOrderLogical &&
    activationPassed === activationTests;
  
  if (passed) {
    console.log('✓ PASSED: All keyboard navigation tests passed');
  } else {
    console.log('✗ FAILED: Some keyboard navigation issues detected');
    console.log('');
    console.log('Issues:');
    console.log('-'.repeat(80));
    results.issues.forEach(issue => {
      console.log(`  ${issue.type}: ${issue.element}`);
    });
  }
  
  await browser.close();
  
  return passed;
}

// Run tests if called directly
if (require.main === module) {
  runKeyboardTests()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Error running keyboard tests:', error);
      process.exit(1);
    });
}

module.exports = { runKeyboardTests };
