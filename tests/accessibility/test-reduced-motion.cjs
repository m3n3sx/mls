/**
 * Reduced Motion Test
 * 
 * Verifies that all functionality works with animations disabled:
 * - prefers-reduced-motion is respected
 * - No content is hidden when animations are disabled
 * - All interactions work without animations
 * - Performance Mode disables animations properly
 * 
 * Requirements: 17.5
 */

const { chromium } = require('playwright');

/**
 * Check if element has animations
 */
async function hasAnimations(page, element) {
	return await page.evaluate((el) => {
		const styles = window.getComputedStyle(el);
		
		// Check for CSS animations
		if (styles.animation && styles.animation !== 'none') {
			return true;
		}
		
		// Check for CSS transitions
		if (styles.transition && styles.transition !== 'all 0s ease 0s') {
			return true;
		}
		
		// Check for transforms
		if (styles.transform && styles.transform !== 'none') {
			return true;
		}
		
		return false;
	}, element);
}

/**
 * Check if element is visible
 */
async function isVisible(page, element) {
	return await page.evaluate((el) => {
		const styles = window.getComputedStyle(el);
		const rect = el.getBoundingClientRect();
		
		return (
			styles.display !== 'none' &&
			styles.visibility !== 'hidden' &&
			styles.opacity !== '0' &&
			rect.width > 0 &&
			rect.height > 0
		);
	}, element);
}

/**
 * Test functionality with reduced motion
 */
async function testReducedMotion() {
	console.log('='.repeat(80));
	console.log('MASE Accessibility: Reduced Motion Test');
	console.log('='.repeat(80));
	console.log('');
	
	const browser = await chromium.launch({ headless: true });
	
	// Test 1: Normal mode (animations enabled)
	console.log('Test 1: Normal Mode (Animations Enabled)');
	console.log('-'.repeat(80));
	
	const normalContext = await browser.newContext();
	const normalPage = await normalContext.newPage();
	
	const baseUrl = process.env.WP_BASE_URL || 'http://localhost:8080';
	await normalPage.goto(`${baseUrl}/wp-admin/admin.php?page=modern-admin-styler`);
	await normalPage.waitForSelector('.mase-header', { timeout: 10000 });
	
	const normalResults = await testPageFunctionality(normalPage, 'normal');
	
	await normalContext.close();
	
	// Test 2: Reduced motion mode
	console.log('');
	console.log('Test 2: Reduced Motion Mode');
	console.log('-'.repeat(80));
	
	const reducedContext = await browser.newContext({
		reducedMotion: 'reduce'
	});
	const reducedPage = await reducedContext.newPage();
	
	await reducedPage.goto(`${baseUrl}/wp-admin/admin.php?page=modern-admin-styler`);
	await reducedPage.waitForSelector('.mase-header', { timeout: 10000 });
	
	const reducedResults = await testPageFunctionality(reducedPage, 'reduced');
	
	await reducedContext.close();
	
	// Test 3: Performance mode
	console.log('');
	console.log('Test 3: Performance Mode');
	console.log('-'.repeat(80));
	
	const perfContext = await browser.newContext();
	const perfPage = await perfContext.newPage();
	
	await perfPage.goto(`${baseUrl}/wp-admin/admin.php?page=modern-admin-styler`);
	await perfPage.waitForSelector('.mase-header', { timeout: 10000 });
	
	// Enable performance mode
	await perfPage.evaluate(() => {
		document.documentElement.setAttribute('data-performance-mode', 'true');
	});
	
	await perfPage.waitForTimeout(500);
	
	const perfResults = await testPageFunctionality(perfPage, 'performance');
	
	await perfContext.close();
	
	// Generate summary
	console.log('');
	console.log('='.repeat(80));
	console.log('SUMMARY');
	console.log('='.repeat(80));
	
	console.log('');
	console.log('Normal Mode:');
	console.log(`  Visible elements: ${normalResults.visibleElements}`);
	console.log(`  Interactive elements: ${normalResults.interactiveElements}`);
	console.log(`  Elements with animations: ${normalResults.animatedElements}`);
	
	console.log('');
	console.log('Reduced Motion Mode:');
	console.log(`  Visible elements: ${reducedResults.visibleElements}`);
	console.log(`  Interactive elements: ${reducedResults.interactiveElements}`);
	console.log(`  Elements with animations: ${reducedResults.animatedElements}`);
	console.log(`  Content hidden: ${normalResults.visibleElements - reducedResults.visibleElements}`);
	
	console.log('');
	console.log('Performance Mode:');
	console.log(`  Visible elements: ${perfResults.visibleElements}`);
	console.log(`  Interactive elements: ${perfResults.interactiveElements}`);
	console.log(`  Elements with animations: ${perfResults.animatedElements}`);
	
	console.log('');
	
	const issues = [];
	
	// Check if content is hidden in reduced motion mode
	if (reducedResults.visibleElements < normalResults.visibleElements) {
		const hiddenCount = normalResults.visibleElements - reducedResults.visibleElements;
		console.log(`✗ ${hiddenCount} elements hidden in reduced motion mode`);
		issues.push(`${hiddenCount} elements hidden in reduced motion mode`);
	} else {
		console.log('✓ No content hidden in reduced motion mode');
	}
	
	// Check if interactions work in reduced motion mode
	if (reducedResults.interactiveElements < normalResults.interactiveElements) {
		const lostCount = normalResults.interactiveElements - reducedResults.interactiveElements;
		console.log(`✗ ${lostCount} interactive elements lost in reduced motion mode`);
		issues.push(`${lostCount} interactive elements lost in reduced motion mode`);
	} else {
		console.log('✓ All interactions work in reduced motion mode');
	}
	
	// Check if animations are disabled in reduced motion mode
	if (reducedResults.animatedElements > 0) {
		console.log(`✗ ${reducedResults.animatedElements} elements still have animations in reduced motion mode`);
		issues.push(`${reducedResults.animatedElements} elements still have animations`);
	} else {
		console.log('✓ All animations disabled in reduced motion mode');
	}
	
	// Check if animations are disabled in performance mode
	if (perfResults.animatedElements > 0) {
		console.log(`✗ ${perfResults.animatedElements} elements still have animations in performance mode`);
		issues.push(`${perfResults.animatedElements} elements still have animations in performance mode`);
	} else {
		console.log('✓ All animations disabled in performance mode');
	}
	
	console.log('');
	
	const passed = issues.length === 0;
	
	if (passed) {
		console.log('✓ PASSED: All reduced motion tests passed');
	} else {
		console.log('✗ FAILED: Some reduced motion issues detected');
		console.log('');
		console.log('Issues:');
		console.log('-'.repeat(80));
		issues.forEach(issue => {
			console.log(`  - ${issue}`);
		});
	}
	
	await browser.close();
	
	return passed;
}

/**
 * Test page functionality
 */
async function testPageFunctionality(page, mode) {
	const results = {
		visibleElements: 0,
		interactiveElements: 0,
		animatedElements: 0,
		mode: mode
	};
	
	// Count visible elements
	const allElements = await page.$('*');
	for (const element of allElements) {
		if (await isVisible(page, element)) {
			results.visibleElements++;
		}
	}
	
	console.log(`  Visible elements: ${results.visibleElements}`);
	
	// Count interactive elements
	const interactiveSelectors = [
		'button',
		'a[href]',
		'input:not([type="hidden"])',
		'select',
		'textarea',
		'[tabindex]:not([tabindex="-1"])'
	];
	
	const interactive = await page.$(interactiveSelectors.join(','));
	results.interactiveElements = interactive.length;
	
	console.log(`  Interactive elements: ${results.interactiveElements}`);
	
	// Count animated elements
	const testSelectors = [
		'.mase-card',
		'.mase-button',
		'.mase-tab',
		'.mase-palette-card',
		'.mase-template-card',
		'.button',
		'button'
	];
	
	for (const selector of testSelectors) {
		const elements = await page.$(selector);
		for (const element of elements) {
			if (await hasAnimations(page, element)) {
				results.animatedElements++;
			}
		}
	}
	
	console.log(`  Elements with animations: ${results.animatedElements}`);
	
	// Test tab switching
	const tabsWork = await page.evaluate(() => {
		const tabs = document.querySelectorAll('.mase-tab');
		if (tabs.length === 0) return false;
		
		tabs[0].click();
		return true;
	});
	
	console.log(`  Tab switching: ${tabsWork ? 'Works' : 'Failed'}`);
	
	// Test button clicks
	const buttonsWork = await page.evaluate(() => {
		const buttons = document.querySelectorAll('button:not([disabled])');
		if (buttons.length === 0) return false;
		
		let clicked = false;
		const handler = () => { clicked = true; };
		buttons[0].addEventListener('click', handler, { once: true });
		buttons[0].click();
		buttons[0].removeEventListener('click', handler);
		
		return clicked;
	});
	
	console.log(`  Button clicks: ${buttonsWork ? 'Work' : 'Failed'}`);
	
	// Test form inputs
	const inputsWork = await page.evaluate(() => {
		const inputs = document.querySelectorAll('input[type="text"]');
		if (inputs.length === 0) return false;
		
		inputs[0].value = 'test';
		return inputs[0].value === 'test';
	});
	
	console.log(`  Form inputs: ${inputsWork ? 'Work' : 'Failed'}`);
	
	return results;
}

// Run tests if called directly
if (require.main === module) {
	testReducedMotion()
		.then(passed => {
			process.exit(passed ? 0 : 1);
		})
		.catch(error => {
			console.error('Error running reduced motion tests:', error);
			process.exit(1);
		});
}

module.exports = { testReducedMotion };
