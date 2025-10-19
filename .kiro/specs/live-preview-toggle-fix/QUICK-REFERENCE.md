# JavaScript Architecture - Quick Reference Card
## MASE Plugin - Developer Cheat Sheet

---

## 🏗️ Architecture at a Glance

```
Pattern: IIFE with Single Namespace
Global: MASE (only 1 global variable)
Modules: 18 total
Init: $(document).ready() → MASE.init()
```

---

## 📦 Module Map

### Core (2)
- `MASE.config` - Settings (nonce, AJAX URL)
- `MASE.state` - App state (5 properties)

### Features (8)
- `MASE.paletteManager` - Palette CRUD
- `MASE.templateManager` - Template CRUD
- `MASE.livePreview` - Real-time preview
- `MASE.importExport` - Import/export
- `MASE.backupManager` - Backup/restore
- `MASE.keyboardShortcuts` - Keyboard nav
- `MASE.tabNavigation` - Tab switching
- `MASE.modules` - Module registry

### Utilities
- `MASE.showNotice(type, message)` - Notifications
- `MASE.debounce(func, wait)` - Performance

---

## 🔄 State Properties

```javascript
MASE.state = {
    livePreviewEnabled: false,  // Live preview on/off
    currentPalette: null,        // Active palette ID
    currentTemplate: null,       // Active template ID
    isDirty: false,              // Unsaved changes?
    isSaving: false              // Save in progress?
}
```

**Read:** `MASE.state.livePreviewEnabled`  
**Write:** `MASE.state.livePreviewEnabled = true`

---

## 🎯 Common Tasks

### Add New Event Handler

```javascript
// Delegated (for dynamic content)
$(document).on('click', '.my-selector', function(e) {
    e.preventDefault();
    // Your code here
});

// Direct (for static elements)
$('#my-element').on('click', function(e) {
    e.preventDefault();
    // Your code here
});
```

### Call Another Module

```javascript
// Inside a module method
var self = MASE;
self.paletteManager.apply(paletteId);
self.showNotice('success', 'Done!');
```

### Update State

```javascript
// Set state
MASE.state.isDirty = true;

// Check state
if (MASE.state.isSaving) {
    return; // Prevent double submit
}
```

### Make AJAX Call

```javascript
$.ajax({
    url: MASE.config.ajaxUrl,
    type: 'POST',
    data: {
        action: 'mase_my_action',
        nonce: MASE.config.nonce,
        // ... your data
    },
    success: function(response) {
        if (response.success) {
            MASE.showNotice('success', response.data.message);
        } else {
            MASE.showNotice('error', response.data.message);
        }
    },
    error: function(xhr) {
        MASE.showNotice('error', 'Network error');
    }
});
```

### Show Notification

```javascript
// Success
MASE.showNotice('success', 'Settings saved!');

// Error
MASE.showNotice('error', 'Failed to save');

// Warning
MASE.showNotice('warning', 'Please review');

// Info
MASE.showNotice('info', 'Processing...');

// Non-dismissible
MASE.showNotice('info', 'Loading...', false);
```

---

## ⚠️ Common Pitfalls

### ❌ DON'T: Bind Events Multiple Times

```javascript
// BAD - Creates duplicate handlers
$(document).on('click', '.my-btn', handler);
$(document).on('click', '.my-btn', handler); // Duplicate!
```

### ✅ DO: Check Before Binding

```javascript
// GOOD - Remove before adding
$(document).off('click', '.my-btn');
$(document).on('click', '.my-btn', handler);
```

### ❌ DON'T: Forget Error Handling

```javascript
// BAD - No error handling
function myFunction() {
    // Code that might throw
}
```

### ✅ DO: Wrap in Try-Catch

```javascript
// GOOD - Protected
function myFunction() {
    try {
        // Code that might throw
    } catch (error) {
        console.error('MASE: Error in myFunction:', error);
        MASE.showNotice('error', 'Something went wrong');
    }
}
```

### ❌ DON'T: Forget to Clean Up Events

```javascript
// BAD - Events never removed
$(document).on('click', '.my-btn', handler);
// ... no cleanup
```

### ✅ DO: Add Unbind Method

```javascript
// GOOD - Cleanup provided
myModule: {
    bind: function() {
        $(document).on('click.mymodule', '.my-btn', handler);
    },
    unbind: function() {
        $(document).off('click.mymodule');
    }
}
```

### ❌ DON'T: Modify State Directly Without Validation

```javascript
// BAD - No validation
MASE.state.currentPalette = someValue; // What if undefined?
```

### ✅ DO: Validate Before Setting

```javascript
// GOOD - Validated
if (paletteId && typeof paletteId === 'string') {
    MASE.state.currentPalette = paletteId;
} else {
    console.error('Invalid palette ID');
}
```

---

## 🐛 Debugging Tips

### Check State

```javascript
// In browser console
console.log(MASE.state);
```

### Check Config

```javascript
// In browser console
console.log(MASE.config);
```

### Check Event Listeners

```javascript
// In browser console
$._data(document, 'events');
```

### Check Module Exists

```javascript
// In browser console
console.log(typeof MASE.paletteManager); // 'object' if exists
```

### Enable Verbose Logging

```javascript
// Add to init() for debugging
MASE.config.debug = true;

// Then in your code
if (MASE.config.debug) {
    console.log('Debug info:', data);
}
```

---

## 📝 Code Style Guide

### Naming Conventions

```javascript
// Modules: camelCase
MASE.paletteManager

// Methods: camelCase
MASE.paletteManager.apply()

// Variables: camelCase
var paletteId = 'professional-blue';

// Constants: UPPER_SNAKE_CASE
var MAX_RETRIES = 3;

// Private: underscore prefix
var _privateMethod = function() { ... };

// jQuery objects: $ prefix
var $button = $('#my-button');
```

### Function Structure

```javascript
/**
 * Brief description
 * Requirement X.Y: Specific requirement
 * 
 * @param {string} param1 - Description
 * @param {Object} param2 - Description
 * @return {boolean} Description
 */
myMethod: function(param1, param2) {
    var self = MASE;
    
    // 1. Validate inputs
    if (!param1) {
        console.error('MASE: param1 required');
        return false;
    }
    
    // 2. Main logic
    try {
        // Your code here
        
    } catch (error) {
        console.error('MASE: Error in myMethod:', error);
        self.showNotice('error', 'Operation failed');
        return false;
    }
    
    // 3. Return result
    return true;
}
```

### Event Handler Structure

```javascript
/**
 * Handle button click
 * Requirements: X.Y, Z.W
 */
handleButtonClick: function(e) {
    var self = MASE;
    
    try {
        // 1. Validate event
        if (!e || !e.target) {
            console.warn('MASE: Invalid event');
            return;
        }
        
        // 2. Prevent default
        e.preventDefault();
        e.stopPropagation();
        
        // 3. Get data
        var $button = $(e.currentTarget);
        var data = $button.data('value');
        
        // 4. Validate data
        if (!data) {
            console.error('MASE: Missing data');
            return;
        }
        
        // 5. Process
        self.processData(data);
        
    } catch (error) {
        console.error('MASE: Error in handleButtonClick:', error);
        self.showNotice('error', 'Failed to handle click');
    }
}
```

---

## 🔍 Finding Things

### Where is...?

| What | Where |
|------|-------|
| Palette logic | `MASE.paletteManager` |
| Template logic | `MASE.templateManager` |
| Live preview | `MASE.livePreview` |
| Tab switching | `MASE.tabNavigation` |
| Keyboard shortcuts | `MASE.keyboardShortcuts` |
| Import/export | `MASE.importExport` |
| Backup/restore | `MASE.backupManager` |
| Notifications | `MASE.showNotice()` |
| Debouncing | `MASE.debounce()` |
| State | `MASE.state` |
| Config | `MASE.config` |

### Line Numbers (Approximate)

| Section | Lines |
|---------|-------|
| IIFE wrapper | 1-10 |
| Config | 15-30 |
| State | 30-40 |
| Palette Manager | 40-400 |
| Template Manager | 400-800 |
| Live Preview | 800-1200 |
| Dark Mode | 1200-1300 |
| Import/Export | 1300-1600 |
| Backup Manager | 1600-1900 |
| Keyboard Shortcuts | 1900-2200 |
| Init | 2200-2300 |
| Color Pickers | 2300-2500 |
| Event Binding | 2500-2700 |
| Tab Navigation | 2700-2900 |
| Save Settings | 2900-3100 |
| Utilities | 3100-3300 |
| Module Events | 3300-3445 |

---

## 🚀 Performance Tips

### Debounce Expensive Operations

```javascript
// BAD - Fires on every keystroke
$('#input').on('input', function() {
    expensiveOperation();
});

// GOOD - Debounced
$('#input').on('input', MASE.debounce(function() {
    expensiveOperation();
}, 300));
```

### Use Event Delegation

```javascript
// BAD - Binds to each element
$('.my-buttons').each(function() {
    $(this).on('click', handler);
});

// GOOD - Single delegated listener
$(document).on('click', '.my-buttons', handler);
```

### Cache jQuery Selectors

```javascript
// BAD - Queries DOM repeatedly
$('#my-element').addClass('active');
$('#my-element').text('Hello');
$('#my-element').show();

// GOOD - Cache selector
var $element = $('#my-element');
$element.addClass('active');
$element.text('Hello');
$element.show();
```

### Batch DOM Updates

```javascript
// BAD - Multiple reflows
$element.css('width', '100px');
$element.css('height', '100px');
$element.css('color', 'red');

// GOOD - Single reflow
$element.css({
    width: '100px',
    height: '100px',
    color: 'red'
});
```

---

## 📚 Further Reading

- **Full Analysis:** [JS-ARCHITECTURE-REPORT.md](./JS-ARCHITECTURE-REPORT.md)
- **Visual Diagrams:** [JS-DEPENDENCY-DIAGRAM.md](./JS-DEPENDENCY-DIAGRAM.md)
- **Executive Summary:** [ARCHITECTURE-SUMMARY.md](./ARCHITECTURE-SUMMARY.md)
- **Index:** [ARCHITECTURE-INDEX.md](./ARCHITECTURE-INDEX.md)

---

## 🆘 Need Help?

1. Check this quick reference first
2. Review the full technical report
3. Look at visual diagrams
4. Search code for examples
5. Ask team for clarification

---

**Keep this card handy while coding!**

*Last Updated: October 19, 2025*
