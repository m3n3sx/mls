# Task 11: Dark Mode Live Preview Integration

## Overview

This document describes the implementation of Task 11 from the global dark/light mode toggle specification: Integration with the live preview system.

## Requirements Implemented

### Requirement 7.1: Dark mode toggle works with live preview active
- ✅ Dark mode toggle detects when live preview is active
- ✅ Calls `updateDarkMode()` instead of normal save flow when preview is active
- ✅ Mode changes are applied visually during preview

### Requirement 7.2: Mode changes are temporary during preview
- ✅ Dark mode changes during preview do not save to localStorage
- ✅ Dark mode changes during preview do not save to user meta
- ✅ Visual changes are applied immediately without persistence

### Requirement 7.3: Restore saved mode when exiting preview
- ✅ Current dark mode is saved when entering preview mode
- ✅ Saved dark mode is restored when exiting preview mode
- ✅ FAB icon is updated to reflect restored mode

### Requirement 7.4: Update preview on mode change
- ✅ Uses same `applyMode()` method for consistency
- ✅ CSS generation logic is shared between preview and normal mode

### Requirement 7.5: Trigger mase:previewUpdated event
- ✅ Event is triggered when preview is updated
- ✅ Event includes dark mode information
- ✅ Event includes preview flag

### Requirement 7.6: Prevent saving during preview mode
- ✅ `savePreference()` is not called during preview
- ✅ Early return prevents AJAX save during preview
- ✅ localStorage is not updated during preview

### Requirement 7.7: isActive() method
- ✅ `livePreview.isActive()` method returns preview state
- ✅ Other modules can check if preview is active
- ✅ Used by dark mode toggle to determine behavior

## Implementation Details

### Modified Files

#### assets/js/mase-admin.js

**1. Added preview state management to livePreview module:**
```javascript
previewState: {
    savedDarkMode: null,      // Store the saved mode before preview
    isPreviewActive: false    // Track if preview is active
}
```

**2. Added isActive() method:**
```javascript
isActive: function() {
    return this.previewState.isPreviewActive;
}
```

**3. Modified toggle() method to save/restore dark mode:**
```javascript
toggle: function() {
    if (self.state.livePreviewEnabled) {
        // Entering preview mode
        this.previewState.isPreviewActive = true;
        this.previewState.savedDarkMode = self.darkModeToggle.state.currentMode;
        // ... bind and update
    } else {
        // Exiting preview mode
        if (this.previewState.savedDarkMode !== null) {
            self.darkModeToggle.applyMode(this.previewState.savedDarkMode, false);
            self.darkModeToggle.state.currentMode = this.previewState.savedDarkMode;
            self.darkModeToggle.updateIcon();
        }
        this.previewState.isPreviewActive = false;
        this.previewState.savedDarkMode = null;
    }
}
```

**4. Added updateDarkMode() method:**
```javascript
updateDarkMode: function(mode) {
    // Apply mode visually without saving
    self.darkModeToggle.applyMode(mode, true);
    self.darkModeToggle.state.currentMode = mode;
    self.darkModeToggle.updateIcon();
    
    // Trigger preview updated event
    $(document).trigger('mase:previewUpdated', { 
        darkMode: mode,
        isPreview: true 
    });
}
```

**5. Modified update() method to trigger event:**
```javascript
update: function() {
    var settings = this.collectSettings();
    var css = this.generateCSS(settings);
    this.applyCSS(css);
    
    // Trigger preview updated event
    $(document).trigger('mase:previewUpdated', { settings: settings });
}
```

**6. Modified darkModeToggle.setMode() to check preview status:**
```javascript
setMode: function(mode) {
    // Check if live preview is active
    if (MASE.livePreview && MASE.livePreview.isActive()) {
        // Temporary mode change for preview
        MASE.livePreview.updateDarkMode(mode);
        return; // Don't save during preview
    }
    
    // Normal mode change with save
    // ...
}
```

## Test Files Created

### 1. Integration Test (HTML)
**File:** `tests/integration/test-dark-mode-live-preview-integration.html`

Interactive test page that allows manual testing of:
- Preview toggle functionality
- Dark mode toggle during preview
- Mode restoration on preview exit
- Event triggering
- Status indicators

**Features:**
- Visual status indicators for preview and dark mode
- Event log showing all triggered events
- Automated test suite with 6 comprehensive tests
- Real-time feedback on test results

### 2. Unit Test (JavaScript)
**File:** `tests/unit/test-dark-mode-live-preview.test.js`

Automated unit tests using Vitest covering:
- All 7 requirements (7.1-7.7)
- Edge cases (multiple toggles, null values, transitions)
- Event triggering verification
- State management verification

**Test Coverage:**
- 15+ test cases
- All requirements covered
- Edge case handling
- Mock implementations for isolation

### 3. Verification Script
**File:** `tests/verify-dark-mode-live-preview-integration.js`

Node.js script that verifies implementation by checking:
- Code structure
- Method existence
- Requirement implementation
- Integration points

## Usage Examples

### Example 1: Toggle dark mode during preview
```javascript
// Enter preview mode
MASE.livePreview.toggle();

// Toggle dark mode (temporary change)
MASE.darkModeToggle.toggle();

// Exit preview mode (restores original mode)
MASE.livePreview.toggle();
```

### Example 2: Listen for preview updates
```javascript
$(document).on('mase:previewUpdated', function(e, data) {
    if (data.darkMode) {
        console.log('Dark mode changed in preview:', data.darkMode);
        console.log('Is preview:', data.isPreview);
    }
});
```

### Example 3: Check if preview is active
```javascript
if (MASE.livePreview.isActive()) {
    console.log('Preview is currently active');
    // Don't save changes
} else {
    console.log('Preview is not active');
    // Safe to save changes
}
```

## Integration Flow

```
User clicks dark mode toggle
         ↓
darkModeToggle.setMode() called
         ↓
Check: Is preview active?
         ↓
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    ↓         ↓
updateDarkMode()  Normal flow
    │         │
    ↓         ↓
Apply visually   Save to storage
    │         │
    ↓         ↓
Trigger event   Trigger event
    │         │
    └────┬────┘
         ↓
    Mode applied
```

## Event Flow

### During Preview
```
1. User toggles dark mode
2. setMode() detects preview is active
3. updateDarkMode() is called
4. applyMode() applies visual changes
5. mase:previewUpdated event is triggered
6. No save operations occur
```

### Exiting Preview
```
1. User exits preview
2. livePreview.toggle() is called
3. Saved dark mode is retrieved
4. applyMode() restores saved mode
5. updateIcon() updates FAB
6. Preview state is cleared
```

## Testing Instructions

### Manual Testing

1. Open `tests/integration/test-dark-mode-live-preview-integration.html` in a browser
2. Click "Run All Tests" to execute automated tests
3. Manually test using the control buttons:
   - Toggle preview on/off
   - Toggle dark mode
   - Observe status indicators
   - Check event log

### Automated Testing

Run the unit tests:
```bash
npm test -- tests/unit/test-dark-mode-live-preview.test.js
```

Run the verification script:
```bash
node tests/verify-dark-mode-live-preview-integration.js
```

## Verification Checklist

- [x] Preview state management implemented
- [x] isActive() method works correctly
- [x] Dark mode is saved when entering preview
- [x] Dark mode is restored when exiting preview
- [x] updateDarkMode() method exists and works
- [x] setMode() checks preview status
- [x] Saving is prevented during preview
- [x] mase:previewUpdated event is triggered
- [x] Same CSS generation logic is used
- [x] FAB icon updates correctly
- [x] Integration test created
- [x] Unit tests created
- [x] Documentation complete

## Known Limitations

None identified. The integration is complete and handles all edge cases.

## Future Enhancements

Potential improvements for future versions:
1. Add preview history (undo/redo for preview changes)
2. Add preview comparison view (side-by-side light/dark)
3. Add preview snapshots (save preview states)
4. Add preview sharing (share preview URL)

## Related Files

- `assets/js/mase-admin.js` - Main implementation
- `tests/integration/test-dark-mode-live-preview-integration.html` - Integration test
- `tests/unit/test-dark-mode-live-preview.test.js` - Unit tests
- `tests/verify-dark-mode-live-preview-integration.js` - Verification script
- `.kiro/specs/global-dark-light-mode-toggle/requirements.md` - Requirements
- `.kiro/specs/global-dark-light-mode-toggle/design.md` - Design document
- `.kiro/specs/global-dark-light-mode-toggle/tasks.md` - Task list

## Conclusion

Task 11 has been successfully implemented with full integration between the dark mode toggle and live preview system. All requirements (7.1-7.7) have been met, comprehensive tests have been created, and the implementation has been verified.

The integration ensures that:
- Dark mode works seamlessly with live preview
- Changes during preview are temporary and not saved
- Original mode is restored when exiting preview
- Events are properly triggered for other modules
- The user experience is smooth and intuitive
