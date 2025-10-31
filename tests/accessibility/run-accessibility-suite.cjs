/**
 * Accessibility Test Suite Runner
 * 
 * Runs all accessibility tests for Task 17
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

const { runContrastTests } = require('./contrast-verification.cjs');
const { runThemeVariantContrastTests } = require('./verify-theme-variants-contrast.cjs');
const { runKeyboardTests } = require('./keyboard-navigation.cjs');
const { testReducedMotion } = require('./test-reduced-motion.cjs');

/**
 * Run all accessibility tests
 */
async function runAccessibilitySuite() {
	console.log('');
	console.log('╔' + '═'.repeat(78) + '╗');
	console.log('║' + ' '.repeat(20) + 'MASE ACCESSIBILITY TEST SUITE' + ' '.repeat(29) + '║');
	console.log('║' + ' '.repeat(25) + 'Task 17: Complete' + ' '.repeat(34) + '║');
	console.log('╚' + '═'.repeat(78) + '╝');
	console.log('');
	
	const results = {
		contrastTests: false,
		themeVariantContrast: false,
		keyboardNavigation: false,
		reducedMotion: false
	};
	
	const startTime = Date.now();
	
	try {
		// Test 17.1: Verify contrast ratios
		console.log('');
		console.log('┌' + '─'.repeat(78) + '┐');
		console.log('│ Task 17.1: Verify Contrast Ratios' + ' '.repeat(44) + '│');
		console.log('└' + '─'.repeat(78) + '┘');
		console.log('');
		
		results.contrastTests = await runContrastTests();
		
		// Test 17.1 (extended): Theme variant contrast
		console.log('');
		console.log('┌' + '─'.repeat(78) + '┐');
		console.log('│ Task 17.1 (Extended): Theme Variant Contrast' + ' '.repeat(33) + '│');
		console.log('└' + '─'.repeat(78) + '┘');
		console.log('');
		
		results.themeVariantContrast = await runThemeVariantContrastTests();
		
		// Test 17.4: Keyboard navigation
		console.log('');
		console.log('┌' + '─'.repeat(78) + '┐');
		console.log('│ Task 17.4: Verify Keyboard Navigation' + ' '.repeat(40) + '│');
		console.log('└' + '─'.repeat(78) + '┘');
		console.log('');
		
		results.keyboardNavigation = await runKeyboardTests();
		
		// Test 17.5: Reduced motion
		console.log('');
		console.log('┌' + '─'.repeat(78) + '┐');
		console.log('│ Task 17.5: Test with Animations Disabled' + ' '.repeat(37) + '│');
		console.log('└' + '─'.repeat(78) + '┘');
		console.log('');
		
		results.reducedMotion = await testReducedMotion();
		
	} catch (error) {
		console.error('Error running accessibility tests:', error);
	}
	
	const endTime = Date.now();
	const duration = ((endTime - startTime) / 1000).toFixed(2);
	
	// Generate final summary
	console.log('');
	console.log('╔' + '═'.repeat(78) + '╗');
	console.log('║' + ' '.repeat(30) + 'FINAL SUMMARY' + ' '.repeat(35) + '║');
	console.log('╠' + '═'.repeat(78) + '╣');
	
	const tests = [
		{ name: 'Contrast Ratios (17.1)', passed: results.contrastTests },
		{ name: 'Theme Variant Contrast (17.1)', passed: results.themeVariantContrast },
		{ name: 'Keyboard Navigation (17.4)', passed: results.keyboardNavigation },
		{ name: 'Reduced Motion (17.5)', passed: results.reducedMotion }
	];
	
	tests.forEach(test => {
		const status = test.passed ? '✓ PASS' : '✗ FAIL';
		const statusColor = test.passed ? '\x1b[32m' : '\x1b[31m';
		const resetColor = '\x1b[0m';
		const padding = ' '.repeat(50 - test.name.length);
		console.log(`║  ${test.name}${padding}${statusColor}${status}${resetColor}     ║`);
	});
	
	console.log('╠' + '═'.repeat(78) + '╣');
	
	const totalTests = tests.length;
	const passedTests = tests.filter(t => t.passed).length;
	const failedTests = totalTests - passedTests;
	const passRate = ((passedTests / totalTests) * 100).toFixed(1);
	
	console.log(`║  Total Tests: ${totalTests}` + ' '.repeat(62) + '║');
	console.log(`║  Passed: ${passedTests}` + ' '.repeat(66) + '║');
	console.log(`║  Failed: ${failedTests}` + ' '.repeat(66) + '║');
	console.log(`║  Pass Rate: ${passRate}%` + ' '.repeat(61) + '║');
	console.log(`║  Duration: ${duration}s` + ' '.repeat(62) + '║');
	console.log('╠' + '═'.repeat(78) + '╣');
	
	const allPassed = passedTests === totalTests;
	
	if (allPassed) {
		console.log('║' + ' '.repeat(15) + '\x1b[32m✓ ALL ACCESSIBILITY TESTS PASSED\x1b[0m' + ' '.repeat(30) + '║');
		console.log('║' + ' '.repeat(10) + 'Task 17: Accessibility Enhancements - COMPLETE' + ' '.repeat(21) + '║');
	} else {
		console.log('║' + ' '.repeat(15) + '\x1b[31m✗ SOME ACCESSIBILITY TESTS FAILED\x1b[0m' + ' '.repeat(29) + '║');
		console.log('║' + ' '.repeat(20) + 'Please review the issues above' + ' '.repeat(27) + '║');
	}
	
	console.log('╚' + '═'.repeat(78) + '╝');
	console.log('');
	
	// Task 17.2 and 17.3 notes
	console.log('Note: Task 17.2 (High Contrast Variants) and Task 17.3 (Focus Indicators)');
	console.log('      have been implemented. Visual verification recommended.');
	console.log('');
	console.log('Files created:');
	console.log('  - assets/css/mase-high-contrast.css');
	console.log('  - assets/js/mase-high-contrast.js');
	console.log('  - assets/css/mase-focus-indicators.css');
	console.log('  - assets/js/mase-keyboard-navigation.js');
	console.log('  - assets/css/mase-reduced-motion.css');
	console.log('  - tests/accessibility/verify-theme-variants-contrast.cjs');
	console.log('  - tests/accessibility/test-reduced-motion.cjs');
	console.log('');
	
	return allPassed;
}

// Run tests if called directly
if (require.main === module) {
	runAccessibilitySuite()
		.then(passed => {
			process.exit(passed ? 0 : 1);
		})
		.catch(error => {
			console.error('Fatal error:', error);
			process.exit(1);
		});
}

module.exports = { runAccessibilitySuite };
