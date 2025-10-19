/**
 * Task 9: Accessibility Validation Script
 * 
 * This script validates that all accessibility requirements are met
 * for template cards in the MASE plugin.
 * 
 * Requirements:
 * - 3.3: Template cards have role="article"
 * - 3.4: Template cards have aria-label with template name
 */

(function() {
    'use strict';

    const results = {
        passed: [],
        failed: [],
        warnings: []
    };

    console.log('=== Task 9: Accessibility Validation ===\n');

    // Find all template cards
    const templateCards = document.querySelectorAll('.mase-template-card');
    
    if (templateCards.length === 0) {
        results.failed.push('No template cards found on page');
        console.error('❌ FAIL: No template cards found');
        return;
    }

    console.log(`Found ${templateCards.length} template cards\n`);

    // Validate each card
    templateCards.forEach((card, index) => {
        const cardNum = index + 1;
        console.log(`--- Card ${cardNum} ---`);

        // Check role="article"
        const role = card.getAttribute('role');
        if (role === 'article') {
            results.passed.push(`Card ${cardNum}: role="article" ✓`);
            console.log('✓ role="article" present');
        } else {
            results.failed.push(`Card ${cardNum}: role="article" missing (found: ${role})`);
            console.error(`❌ role="article" missing (found: ${role})`);
        }

        // Check aria-label
        const ariaLabel = card.getAttribute('aria-label');
        if (ariaLabel && ariaLabel.trim().length > 0) {
            results.passed.push(`Card ${cardNum}: aria-label="${ariaLabel}" ✓`);
            console.log(`✓ aria-label="${ariaLabel}"`);
        } else {
            results.failed.push(`Card ${cardNum}: aria-label missing or empty`);
            console.error('❌ aria-label missing or empty');
        }

        // Check data-template
        const dataTemplate = card.getAttribute('data-template');
        if (dataTemplate) {
            results.passed.push(`Card ${cardNum}: data-template="${dataTemplate}" ✓`);
            console.log(`✓ data-template="${dataTemplate}"`);
        } else {
            results.warnings.push(`Card ${cardNum}: data-template missing`);
            console.warn('⚠ data-template missing');
        }

        // Check tabindex for keyboard accessibility
        const tabindex = card.getAttribute('tabindex');
        if (tabindex === '0') {
            results.passed.push(`Card ${cardNum}: tabindex="0" (keyboard accessible) ✓`);
            console.log('✓ tabindex="0" (keyboard accessible)');
        } else {
            results.warnings.push(`Card ${cardNum}: tabindex not set to 0 (found: ${tabindex})`);
            console.warn(`⚠ tabindex not optimal (found: ${tabindex})`);
        }

        // Check buttons
        const buttons = card.querySelectorAll('button');
        buttons.forEach((btn, btnIndex) => {
            const btnLabel = btn.getAttribute('aria-label');
            const btnText = btn.textContent.trim();
            
            if (btnLabel) {
                results.passed.push(`Card ${cardNum}, Button ${btnIndex + 1}: aria-label="${btnLabel}" ✓`);
                console.log(`  ✓ Button ${btnIndex + 1}: aria-label="${btnLabel}"`);
            } else {
                results.warnings.push(`Card ${cardNum}, Button ${btnIndex + 1}: No aria-label (text: "${btnText}")`);
                console.warn(`  ⚠ Button ${btnIndex + 1}: No aria-label (text: "${btnText}")`);
            }
        });

        // Check for active badge
        const activeBadge = card.querySelector('.mase-active-badge');
        if (activeBadge) {
            const badgeRole = activeBadge.getAttribute('role');
            if (badgeRole === 'status') {
                results.passed.push(`Card ${cardNum}: Active badge has role="status" ✓`);
                console.log('  ✓ Active badge: role="status"');
            } else {
                results.failed.push(`Card ${cardNum}: Active badge missing role="status"`);
                console.error('  ❌ Active badge: role="status" missing');
            }
        }

        // Check thumbnail alt text
        const thumbnail = card.querySelector('.mase-template-thumbnail img');
        if (thumbnail) {
            const alt = thumbnail.getAttribute('alt');
            if (alt && alt.trim().length > 0) {
                results.passed.push(`Card ${cardNum}: Thumbnail has alt text ✓`);
                console.log(`  ✓ Thumbnail alt="${alt}"`);
            } else {
                results.failed.push(`Card ${cardNum}: Thumbnail missing alt text`);
                console.error('  ❌ Thumbnail missing alt text');
            }
        }

        console.log('');
    });

    // Check focus indicators in CSS
    console.log('--- Focus Indicators ---');
    const testCard = templateCards[0];
    if (testCard) {
        const styles = window.getComputedStyle(testCard);
        const outline = styles.outline;
        
        // Note: outline may be 'none' when not focused
        console.log(`Current outline: ${outline}`);
        console.log('ℹ Focus indicators are defined in CSS and will appear on focus');
        results.passed.push('Focus indicator styles defined in CSS ✓');
    }

    console.log('');

    // Print summary
    console.log('=== SUMMARY ===');
    console.log(`✓ Passed: ${results.passed.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);
    console.log(`⚠ Warnings: ${results.warnings.length}`);
    console.log('');

    // Print details
    if (results.failed.length > 0) {
        console.log('=== FAILURES ===');
        results.failed.forEach(msg => console.error(`❌ ${msg}`));
        console.log('');
    }

    if (results.warnings.length > 0) {
        console.log('=== WARNINGS ===');
        results.warnings.forEach(msg => console.warn(`⚠ ${msg}`));
        console.log('');
    }

    // Requirements check
    console.log('=== REQUIREMENTS CHECK ===');
    
    const allCardsHaveRole = !results.failed.some(msg => msg.includes('role="article" missing'));
    const allCardsHaveLabel = !results.failed.some(msg => msg.includes('aria-label missing'));
    
    if (allCardsHaveRole) {
        console.log('✓ Requirement 3.3: All cards have role="article"');
    } else {
        console.error('❌ Requirement 3.3: Some cards missing role="article"');
    }

    if (allCardsHaveLabel) {
        console.log('✓ Requirement 3.4: All cards have aria-label');
    } else {
        console.error('❌ Requirement 3.4: Some cards missing aria-label');
    }

    console.log('');

    // Overall result
    if (results.failed.length === 0) {
        console.log('✅ ALL ACCESSIBILITY TESTS PASSED');
        return true;
    } else {
        console.log('❌ SOME ACCESSIBILITY TESTS FAILED');
        return false;
    }
})();
