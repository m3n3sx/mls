/**
 * Accessibility Test Suite Runner
 * 
 * Runs all accessibility tests for MASE visual redesign:
 * - Color contrast verification (WCAG AA)
 * - Keyboard navigation testing
 * - Screen reader compatibility
 * 
 * Requirements: 11.1, 11.2, 11.3
 */

const { runContrastTests } = require('./contrast-verification');
const { runKeyboardTests } = require('./keyboard-navigation');
const { runScreenReaderTests } = require('./screen-reader-test');

/**
 * Run all accessibility tests
 */
async function runAllTests() {
  console.log('');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + 'MASE ACCESSIBILITY TEST SUITE' + ' '.repeat(28) + '║');
  console.log('║' + ' '.repeat(25) + 'Visual Redesign v2.0' + ' '.repeat(33) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  console.log('');
  
  const results = {
    contrast: false,
    keyboard: false,
    screenReader: false
  };
  
  const startTime = Date.now();
  
  try {
    // Test 1: Color Contrast
    console.log('');
    console.log('┌' + '─'.repeat(78) + '┐');
    console.log('│ TEST 1/3: Color Contrast Verification (WCAG 2.1 AA)' + ' '.repeat(25) + '│');
    console.log('└' + '─'.repeat(78) + '┘');
    console.log('');
    
    results.contrast = await runContrastTests();
    
    // Test 2: Keyboard Navigation
    console.log('');
    console.log('┌' + '─'.repeat(78) + '┐');
    console.log('│ TEST 2/3: Keyboard Navigation' + ' '.repeat(48) + '│');
    console.log('└' + '─'.repeat(78) + '┘');
    console.log('');
    
    results.keyboard = await runKeyboardTests();
    
    // Test 3: Screen Reader Compatibility
    console.log('');
    console.log('┌' + '─'.repeat(78) + '┐');
    console.log('│ TEST 3/3: Screen Reader Compatibility' + ' '.repeat(40) + '│');
    console.log('└' + '─'.repeat(78) + '┘');
    console.log('');
    
    results.screenReader = await runScreenReaderTests();
    
  } catch (error) {
    console.error('');
    console.error('Error running tests:', error);
    console.error('');
    return false;
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Final Summary
  console.log('');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(28) + 'FINAL SUMMARY' + ' '.repeat(37) + '║');
  console.log('╠' + '═'.repeat(78) + '╣');
  
  const contrastStatus = results.contrast ? '✓ PASSED' : '✗ FAILED';
  const keyboardStatus = results.keyboard ? '✓ PASSED' : '✗ FAILED';
  const screenReaderStatus = results.screenReader ? '✓ PASSED' : '✗ FAILED';
  
  console.log('║ Color Contrast (WCAG AA):        ' + contrastStatus + ' '.repeat(78 - 35 - contrastStatus.length) + '║');
  console.log('║ Keyboard Navigation:              ' + keyboardStatus + ' '.repeat(78 - 35 - keyboardStatus.length) + '║');
  console.log('║ Screen Reader Compatibility:      ' + screenReaderStatus + ' '.repeat(78 - 35 - screenReaderStatus.length) + '║');
  console.log('╠' + '═'.repeat(78) + '╣');
  
  const allPassed = results.contrast && results.keyboard && results.screenReader;
  const passedCount = Object.values(results).filter(r => r).length;
  const totalCount = Object.keys(results).length;
  
  if (allPassed) {
    console.log('║' + ' '.repeat(20) + '✓ ALL TESTS PASSED' + ' '.repeat(39) + '║');
    console.log('║' + ' '.repeat(15) + 'WCAG 2.1 Level AA Compliance Verified' + ' '.repeat(24) + '║');
  } else {
    console.log('║' + ' '.repeat(20) + '✗ SOME TESTS FAILED' + ' '.repeat(38) + '║');
    console.log('║' + ' '.repeat(18) + `${passedCount}/${totalCount} test suites passed` + ' '.repeat(78 - 18 - 23 - `${passedCount}/${totalCount}`.length) + '║');
  }
  
  console.log('╠' + '═'.repeat(78) + '╣');
  console.log('║ Test Duration: ' + duration + 's' + ' '.repeat(78 - 16 - duration.length - 1) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  console.log('');
  
  if (!allPassed) {
    console.log('RECOMMENDATIONS:');
    console.log('-'.repeat(80));
    
    if (!results.contrast) {
      console.log('• Review color contrast issues and adjust colors to meet WCAG AA standards');
      console.log('  - Normal text: 4.5:1 minimum contrast ratio');
      console.log('  - Large text: 3:1 minimum contrast ratio');
      console.log('  - Interactive elements: 3:1 minimum contrast ratio');
    }
    
    if (!results.keyboard) {
      console.log('• Fix keyboard navigation issues:');
      console.log('  - Ensure all interactive elements are keyboard accessible');
      console.log('  - Add visible focus indicators to all focusable elements');
      console.log('  - Verify logical tab order');
      console.log('  - Remove keyboard traps');
    }
    
    if (!results.screenReader) {
      console.log('• Fix screen reader compatibility issues:');
      console.log('  - Ensure semantic HTML structure');
      console.log('  - Add proper labels to form controls');
      console.log('  - Verify ARIA attributes are correct');
      console.log('  - Add alt text to images');
    }
    
    console.log('');
    console.log('For detailed information, review the test output above.');
    console.log('');
  }
  
  return allPassed;
}

// Run tests if called directly
if (require.main === module) {
  runAllTests()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runAllTests };
