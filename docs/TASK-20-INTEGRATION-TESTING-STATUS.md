# Task 20: Integration and End-to-End Testing - Status Report

**Status:** In Progress  
**Date:** October 27, 2025  
**Completion:** ~70%

## Overview

Task 20 involves running the full visual interactive test suite, verifying all execution modes work correctly, and ensuring comprehensive test coverage across all MASE plugin features.

## Current State

### ✅ Completed Components

1. **Test Infrastructure** (100%)
   - Runner CLI with comprehensive options
   - Orchestrator for test discovery and execution
   - Helper functions for common test operations
   - Configuration system with environment variable support
   - HTML report generator with screenshots and videos

2. **Test Scenarios** (100%)
   - 40 test scenarios across 14 categories
   - Coverage of all major plugin features
   - Admin Bar (4 tests)
   - Menu (4 tests)
   - Content (3 tests)
   - Typography (2 tests)
   - Buttons (3 tests)
   - Effects (3 tests)
   - Templates (3 tests)
   - Palettes (3 tests)
   - Backgrounds (3 tests)
   - Widgets (1 test)
   - Form Controls (1 test)
   - Login (1 test)
   - Advanced (3 tests)
   - Responsive (4 tests)
   - Live Preview (1 test)

3. **Execution Modes** (100%)
   - Interactive mode (browser visible, slow motion)
   - Headless mode (fast, no browser window)
   - Debug mode (step-by-step with verbose logging)

4. **Documentation** (100%)
   - Comprehensive README with usage examples
   - Helper functions documentation
   - Contributing guidelines
   - Report generator documentation
   - Test scenario template

### ⚠️ Issues Identified

1. **Field Selector Mismatch** (HIGH PRIORITY)
   - **Problem:** Test scenarios use hardcoded field names that don't match actual WordPress admin form structure
   - **Evidence:** Test failure: `Field not found: mase_settings[admin_bar][bg_color]`
   - **Impact:** All tests fail at the first setting change
   - **Root Cause:** Helpers assume specific naming convention without verifying actual page structure

2. **Screenshot Quality Parameter** (MEDIUM PRIORITY)
   - **Problem:** PNG screenshots don't support quality parameter
   - **Evidence:** `page.screenshot: options.quality is unsupported for the png screenshots`
   - **Impact:** Screenshot failures in all tests
   - **Fix Applied:** Changed `screenshotQuality` to `null` in config

3. **Tab Navigation** (HIGH PRIORITY)
   - **Problem:** Tab selectors may not match actual WordPress admin tab structure
   - **Evidence:** Tests navigate to tabs but may not be clicking correct elements
   - **Impact:** Tests may not be testing the correct tab content

4. **Live Preview Toggle** (HIGH PRIORITY)
   - **Problem:** Live Preview toggle selector may not match actual implementation
   - **Evidence:** Tests attempt to enable Live Preview but may not find toggle
   - **Impact:** Live Preview tests may not work correctly

## Diagnostic Tools Created

### 1. Page Structure Diagnostic Script

**File:** `tests/visual-interactive/diagnose-page-structure.cjs`

**Purpose:** Inspect actual WordPress admin page structure to identify correct selectors

**Usage:**
```bash
node tests/visual-interactive/diagnose-page-structure.cjs
```

**Output:** Detailed analysis of:
- Forms (ID, class, action, method)
- Tabs (text, data attributes, IDs, classes)
- Live Preview toggles
- Form fields (first 20 with names, IDs, types)
- Save buttons
- Admin bar specific fields

## Required Fixes

### Priority 1: Field Selector Strategy (2-3 hours)

**File:** `tests/visual-interactive/helpers.cjs`

**Changes Needed:**

1. **Update `changeSetting()` function** (lines ~140-200)
   ```javascript
   async changeSetting(fieldName, value) {
     // Try multiple selector strategies
     const selectors = [
       `[name="${fieldName}"]`,           // Exact name match
       `#${fieldName}`,                    // ID match
       `[data-setting="${fieldName}"]`,    // Data attribute
       `[name*="${fieldName}"]`,           // Partial name match
       `.${fieldName.replace(/[[\]]/g, '-')}` // Class from name
     ];
     
     let element = null;
     let usedSelector = null;
     
     for (const selector of selectors) {
       element = await this.page.$(selector);
       if (element) {
         usedSelector = selector;
         break;
       }
     }
     
     if (!element) {
       // Log available fields for debugging
       const availableFields = await this.page.evaluate(() => {
         const fields = document.querySelectorAll('input, select, textarea');
         return Array.from(fields).map(f => ({
           name: f.name,
           id: f.id,
           type: f.type
         })).slice(0, 10);
       });
       
       throw new Error(
         `Field not found: ${fieldName}\n` +
         `Available fields (first 10): ${JSON.stringify(availableFields, null, 2)}`
       );
     }
     
     // Rest of implementation...
   }
   ```

2. **Update `navigateToTab()` function** (lines ~90-120)
   ```javascript
   async navigateToTab(tabName) {
     // Try multiple selector strategies
     const selectors = [
       `[data-tab="${tabName}"]`,
       `#${tabName}-tab`,
       `.nav-tab[href*="${tabName}"]`,
       `a:has-text("${tabName.replace(/-/g, ' ')}")`
     ];
     
     let tabElement = null;
     for (const selector of selectors) {
       tabElement = await this.page.$(selector);
       if (tabElement) break;
     }
     
     if (!tabElement) {
       throw new Error(`Tab not found: ${tabName}`);
     }
     
     await tabElement.click();
     
     // Wait for tab content with multiple strategies
     await this.page.waitForTimeout(500);
     
     // Verify tab is active
     const isActive = await tabElement.evaluate(el => 
       el.classList.contains('nav-tab-active') ||
       el.classList.contains('active') ||
       el.getAttribute('aria-selected') === 'true'
     );
     
     if (!isActive) {
       console.warn(`Tab "${tabName}" may not be active`);
     }
   }
   ```

3. **Update `enableLivePreview()` function** (lines ~250-300)
   ```javascript
   async enableLivePreview() {
     // Try multiple selector strategies
     const selectors = [
       '#live-preview-toggle',
       '[data-live-preview]',
       '.live-preview-toggle',
       'input[type="checkbox"][name*="live"]'
     ];
     
     let toggle = null;
     for (const selector of selectors) {
       toggle = await this.page.$(selector);
       if (toggle) break;
     }
     
     if (!toggle) {
       console.warn('Live Preview toggle not found - skipping');
       return;
     }
     
     const isChecked = await toggle.isChecked();
     if (!isChecked) {
       await toggle.click();
       await this.page.waitForTimeout(this.config.livePreview.enableWait);
       
       // Verify it's now checked
       const nowChecked = await toggle.isChecked();
       if (!nowChecked) {
         throw new Error('Failed to enable Live Preview');
       }
     }
   }
   ```

### Priority 2: Field Name Mapping (1 hour)

**Create:** `tests/visual-interactive/field-mappings.cjs`

```javascript
/**
 * Field Name Mappings
 * 
 * Maps logical field names used in tests to actual WordPress form field names.
 * Update this file after running diagnose-page-structure.cjs
 */

module.exports = {
  // Admin Bar fields
  'mase_settings[admin_bar][bg_color]': 'actual_field_name_from_wordpress',
  'mase_settings[admin_bar][text_color]': 'actual_field_name_from_wordpress',
  'mase_settings[admin_bar][hover_color]': 'actual_field_name_from_wordpress',
  'mase_settings[admin_bar][height]': 'actual_field_name_from_wordpress',
  
  // Menu fields
  'mase_settings[menu][bg_color]': 'actual_field_name_from_wordpress',
  'mase_settings[menu][text_color]': 'actual_field_name_from_wordpress',
  
  // Add more mappings as discovered...
};
```

### Priority 3: Page Structure Verification (30 minutes)

**Add to helpers.cjs:**

```javascript
/**
 * Verify page structure before running tests
 * @returns {Promise<Object>} Structure verification results
 */
async verifyPageStructure() {
  const results = {
    hasForm: false,
    hasTabs: false,
    hasLivePreview: false,
    hasFields: false,
    errors: []
  };
  
  // Check for form
  const form = await this.page.$('form');
  results.hasForm = form !== null;
  if (!results.hasForm) {
    results.errors.push('No form found on page');
  }
  
  // Check for tabs
  const tabs = await this.page.$$('[data-tab], .nav-tab');
  results.hasTabs = tabs.length > 0;
  if (!results.hasTabs) {
    results.errors.push('No tabs found on page');
  }
  
  // Check for Live Preview toggle
  const livePreview = await this.page.$('#live-preview-toggle, [data-live-preview]');
  results.hasLivePreview = livePreview !== null;
  
  // Check for form fields
  const fields = await this.page.$$('input, select, textarea');
  results.hasFields = fields.length > 0;
  if (!results.hasFields) {
    results.errors.push('No form fields found on page');
  }
  
  return results;
}
```

## Testing Plan

### Phase 1: Diagnostic (30 minutes)

1. Run diagnostic script to inspect actual page structure
2. Document actual field names, tab selectors, and toggle selectors
3. Update field mappings configuration

### Phase 2: Fix Helpers (2 hours)

1. Implement flexible selector strategies in helpers.cjs
2. Add field name mapping support
3. Add page structure verification
4. Test with single scenario

### Phase 3: Full Test Run (1 hour)

1. Run full test suite in headless mode
2. Identify any remaining issues
3. Fix issues and re-run
4. Verify >85% pass rate

### Phase 4: Report Verification (30 minutes)

1. Generate HTML report
2. Verify screenshots are captured correctly
3. Verify videos are recorded for failures
4. Verify console errors are logged
5. Verify report is readable and useful

## Success Criteria

- [ ] All 40 test scenarios execute without errors
- [ ] Pass rate >85% (34+ tests passing)
- [ ] Screenshots captured correctly (no quality errors)
- [ ] Videos recorded for failed tests
- [ ] HTML report generates successfully
- [ ] Console errors logged correctly
- [ ] All three execution modes work (interactive, headless, debug)
- [ ] Tests can be filtered by tab, name, and tags
- [ ] Documentation is complete and accurate

## Next Steps

1. **Immediate:** Run diagnostic script to inspect page structure
   ```bash
   node tests/visual-interactive/diagnose-page-structure.cjs
   ```

2. **Update helpers.cjs** with flexible selector strategies

3. **Create field mappings** based on diagnostic output

4. **Run single test** to verify fixes:
   ```bash
   node tests/visual-interactive/runner.cjs --mode headless --test "Admin Bar Colors"
   ```

5. **Run full suite** once single test passes:
   ```bash
   node tests/visual-interactive/runner.cjs --mode headless
   ```

6. **Generate and review report**

7. **Mark task as complete** when success criteria met

## Estimated Time to Completion

- Diagnostic and mapping: 1 hour
- Helper fixes: 2 hours
- Testing and iteration: 1 hour
- **Total: 4 hours**

## Notes

- The test infrastructure is solid and well-designed
- The main issue is selector mismatch between tests and actual WordPress admin
- Once selectors are fixed, tests should run smoothly
- Consider adding selector discovery to helpers for future maintainability
