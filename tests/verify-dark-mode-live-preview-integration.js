#!/usr/bin/env node

/**
 * Verification script for Dark Mode Live Preview Integration
 * Task 11: Integrate with live preview system
 */

console.log('='.repeat(80));
console.log('Dark Mode Live Preview Integration Verification');
console.log('='.repeat(80));
console.log('');

const fs = require('fs');
const path = require('path');

// Read the mase-admin.js file
const jsFilePath = path.join(__dirname, '..', 'assets', 'js', 'mase-admin.js');
const jsContent = fs.readFileSync(jsFilePath, 'utf8');

const checks = [];

// Check 1: livePreview has previewState
if (jsContent.includes('previewState: {') && 
    jsContent.includes('savedDarkMode: null') && 
    jsContent.includes('isPreviewActive: false')) {
    checks.push({ name: 'Preview state management', passed: true });
} else {
    checks.push({ name: 'Preview state management', passed: false });
}

// Check 2: isActive() method exists
if (jsContent.includes('isActive: function()') && 
    jsContent.includes('return this.previewState.isPreviewActive')) {
    checks.push({ name: 'isActive() method (Req 7.7)', passed: true });
} else {
    checks.push({ name: 'isActive() method (Req 7.7)', passed: false });
}

// Check 3: Preview saves dark mode on enter
if (jsContent.includes('this.previewState.savedDarkMode = self.darkModeToggle.state.currentMode')) {
    checks.push({ name: 'Save dark mode on preview enter (Req 7.3)', passed: true });
} else {
    checks.push({ name: 'Save dark mode on preview enter (Req 7.3)', passed: false });
}

// Check 4: Preview restores dark mode on exit
if (jsContent.includes('self.darkModeToggle.applyMode(this.previewState.savedDarkMode, false)') &&
    jsContent.includes('self.darkModeToggle.state.currentMode = this.previewState.savedDarkMode')) {
    checks.push({ name: 'Restore dark mode on preview exit (Req 7.3)', passed: true });
} else {
    checks.push({ name: 'Restore dark mode on preview exit (Req 7.3)', passed: false });
}

// Check 5: updateDarkMode method exists
if (jsContent.includes('updateDarkMode: function(mode)')) {
    checks.push({ name: 'updateDarkMode() method (Req 7.1, 7.2)', passed: true });
} else {
    checks.push({ name: 'updateDarkMode() method (Req 7.1, 7.2)', passed: false });
}

// Check 6: Dark mode checks if preview is active
if (jsContent.includes('if (MASE.livePreview && MASE.livePreview.isActive())') &&
    jsContent.includes('MASE.livePreview.updateDarkMode(mode)')) {
    checks.push({ name: 'Dark mode checks preview status (Req 7.1)', passed: true });
} else {
    checks.push({ name: 'Dark mode checks preview status (Req 7.1)', passed: false });
}

// Check 7: Prevents saving during preview
if (jsContent.includes('return; // Don\'t save during preview')) {
    checks.push({ name: 'Prevent saving during preview (Req 7.6)', passed: true });
} else {
    checks.push({ name: 'Prevent saving during preview (Req 7.6)', passed: false });
}

// Check 8: Triggers mase:previewUpdated event
if (jsContent.includes('$(document).trigger(\'mase:previewUpdated\'')) {
    checks.push({ name: 'Trigger mase:previewUpdated event (Req 7.5)', passed: true });
} else {
    checks.push({ name: 'Trigger mase:previewUpdated event (Req 7.5)', passed: false });
}

// Check 9: Uses same CSS generation logic
if (jsContent.includes('self.darkModeToggle.applyMode(mode, true)')) {
    checks.push({ name: 'Use same CSS generation logic (Req 7.4)', passed: true });
} else {
    checks.push({ name: 'Use same CSS generation logic (Req 7.4)', passed: false });
}

// Check 10: Updates FAB icon during preview
if (jsContent.includes('self.darkModeToggle.updateIcon()')) {
    checks.push({ name: 'Update FAB icon', passed: true });
} else {
    checks.push({ name: 'Update FAB icon', passed: false });
}

// Print results
console.log('Verification Results:');
console.log('-'.repeat(80));

let passCount = 0;
let failCount = 0;

checks.forEach((check, index) => {
    const status = check.passed ? '✓ PASS' : '✗ FAIL';
    const color = check.passed ? '\x1b[32m' : '\x1b[31m';
    console.log(`${color}${status}\x1b[0m ${index + 1}. ${check.name}`);
    
    if (check.passed) {
        passCount++;
    } else {
        failCount++;
    }
});

console.log('-'.repeat(80));
console.log(`Total: ${checks.length} checks`);
console.log(`\x1b[32mPassed: ${passCount}\x1b[0m`);
if (failCount > 0) {
    console.log(`\x1b[31mFailed: ${failCount}\x1b[0m`);
}
console.log('');

// Overall result
if (failCount === 0) {
    console.log('\x1b[32m✓ All checks passed! Integration is complete.\x1b[0m');
    process.exit(0);
} else {
    console.log('\x1b[31m✗ Some checks failed. Please review the implementation.\x1b[0m');
    process.exit(1);
}
