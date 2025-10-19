#!/bin/bash

# Task 10 Verification Script
# Verifies that live preview is enabled by default

echo "=========================================="
echo "Task 10: Live Preview Default - Verification"
echo "=========================================="
echo ""

# Test 1: Check HTML has checked attribute
echo "Test 1: Checking HTML for 'checked' attribute..."
if grep -q 'id="mase-live-preview-toggle"' includes/admin-settings-page.php; then
    echo "✓ Found live preview toggle element"
    
    # Check for checked attribute
    if grep -A 5 'id="mase-live-preview-toggle"' includes/admin-settings-page.php | grep -q 'checked'; then
        echo "✓ 'checked' attribute is present"
    else
        echo "✗ 'checked' attribute is MISSING"
    fi
    
    # Check for aria-checked="true"
    if grep -A 5 'id="mase-live-preview-toggle"' includes/admin-settings-page.php | grep -q 'aria-checked="true"'; then
        echo "✓ aria-checked='true' is present"
    else
        echo "✗ aria-checked='true' is MISSING"
    fi
    
    # Check for role="switch"
    if grep -A 5 'id="mase-live-preview-toggle"' includes/admin-settings-page.php | grep -q 'role="switch"'; then
        echo "✓ role='switch' is present"
    else
        echo "✗ role='switch' is MISSING"
    fi
else
    echo "✗ Live preview toggle element NOT found"
fi

echo ""

# Test 2: Check JavaScript initialization
echo "Test 2: Checking JavaScript initialization..."
if grep -q 'Live Preview enabled by default' assets/js/mase-admin.js; then
    echo "✓ Found 'Live Preview enabled by default' console log"
else
    echo "✗ Console log message NOT found"
fi

if grep -q "this.state.livePreviewEnabled = true" assets/js/mase-admin.js; then
    echo "✓ Found state.livePreviewEnabled = true"
else
    echo "✗ State initialization NOT found"
fi

if grep -q ".prop('checked', true)" assets/js/mase-admin.js; then
    echo "✓ Found programmatic checkbox check"
else
    echo "✗ Programmatic checkbox check NOT found"
fi

if grep -q ".attr('aria-checked', 'true')" assets/js/mase-admin.js; then
    echo "✓ Found ARIA attribute update"
else
    echo "✗ ARIA attribute update NOT found"
fi

if grep -q "this.livePreview.bind()" assets/js/mase-admin.js; then
    echo "✓ Found live preview bind call"
else
    echo "✗ Live preview bind call NOT found"
fi

echo ""

# Test 3: Check requirements references
echo "Test 3: Checking requirement references..."
if grep -q "Requirement 10" assets/js/mase-admin.js; then
    echo "✓ Found Requirement 10 references in JavaScript"
else
    echo "✗ Requirement 10 references NOT found"
fi

echo ""
echo "=========================================="
echo "Verification Complete"
echo "=========================================="
echo ""
echo "To test manually:"
echo "1. Open the WordPress admin settings page"
echo "2. Check that the Live Preview toggle is checked by default"
echo "3. Open browser console and verify 'Live Preview enabled by default' message"
echo "4. Change a color picker without clicking the toggle"
echo "5. Verify that changes are applied immediately"
echo "6. Uncheck the toggle and verify live preview stops"
echo "7. Reload the page and verify live preview is enabled again"
echo ""
echo "Test file available at:"
echo ".kiro/specs/critical-fixes-v1.2.0/test-task-10-live-preview-default.html"
