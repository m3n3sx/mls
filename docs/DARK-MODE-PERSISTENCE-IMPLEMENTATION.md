# Dark Mode Persistence Layer Implementation

## Overview

This document describes the implementation of the persistence layer for the dark mode toggle feature in Modern Admin Styler (MASE). The persistence layer ensures reliable storage and synchronization of user preferences across sessions and devices.

## Implementation Date

January 24, 2025

## Requirements Addressed

- **Requirement 4.1**: Save preference to localStorage
- **Requirement 4.2**: Send AJAX request to save to WordPress user meta
- **Requirement 4.3**: Add error handling for localStorage failures
- **Requirement 4.4**: Implement retry logic for failed AJAX requests
- **Requirement 4.5**: Add needsSync flag for offline changes
- **Requirement 11.1**: Log errors to console
- **Requirement 11.2**: Fall back to user meta only if localStorage unavailable

## Architecture

### Dual Storage Strategy

The persistence layer uses a dual storage approach:

1. **localStorage** (Client-side)
   - Immediate persistence
   - No server round-trip
   - Survives page refreshes
   - Limited to single browser

2. **WordPress User Meta** (Server-side)
   - Cross-device synchronization
   - Survives cache clears
   - Requires AJAX communication
   - Persistent across browsers

### Fallback Chain

```
localStorage → User Meta → System Preference → Default (light)
```

## Key Features

### 1. localStorage Save with Error Handling

**Location**: `assets/js/mase-admin.js` - `darkModeToggle.savePreference()`

**Features**:
- Saves mode to localStorage immediately
- Handles `QuotaExceededError` by clearing old MASE data
- Falls back to user meta only if localStorage unavailable
- Clears `needsSync` flag on successful save

**Error Handling**:
```javascript
try {
    localStorage.setItem(self.config.storageKey, mode);
    localStorage.removeItem(self.config.storageKey + '_needsSync');
} catch (error) {
    if (error.name === 'QuotaExceededError') {
        // Clear old MASE items and retry
        // If still fails, set needsSync flag
    } else {
        // Other errors: set needsSync flag
    }
}
```

### 2. AJAX Save with Retry Logic

**Location**: `assets/js/mase-admin.js` - `darkModeToggle.savePreference()`

**Features**:
- Sends AJAX request to save to WordPress user meta
- Implements exponential backoff retry (1s, 2s, 4s)
- Maximum 3 retry attempts
- Shows user-friendly notices on failure

**Retry Logic**:
```javascript
if (self.state.retryCount < self.state.maxRetries) {
    var retryDelay = Math.pow(2, self.state.retryCount) * 1000;
    setTimeout(function() {
        self.state.retryCount++;
        self.syncPreference(mode);
    }, retryDelay);
}
```

### 3. needsSync Flag Management

**Purpose**: Track when local changes need to be synchronized to server

**State Management**:
```javascript
state: {
    needsSync: false,      // Flag for offline changes
    retryCount: 0,         // Number of retry attempts
    maxRetries: 3          // Maximum retry attempts
}
```

**Flag Persistence**:
- Saved to localStorage as `mase_dark_mode_needsSync`
- Loaded on initialization
- Cleared on successful sync

### 4. syncPreference Method

**Location**: `assets/js/mase-admin.js` - `darkModeToggle.syncPreference()`

**Purpose**: Retry failed AJAX saves

**Features**:
- Only syncs if `needsSync` flag is true
- Sends AJAX request to server
- Clears flags on success
- Shows success notice to user

**Usage**:
```javascript
// Called automatically on retry
darkModeToggle.syncPreference('dark');

// Can be called manually on page load
if (darkModeToggle.state.needsSync) {
    setTimeout(function() {
        darkModeToggle.syncPreference(darkModeToggle.state.currentMode);
    }, 2000);
}
```

### 5. Storage Quota Exceeded Handling

**Problem**: localStorage has limited space (typically 5-10MB)

**Solution**:
1. Catch `QuotaExceededError`
2. Clear old MASE-related items (except current preference)
3. Retry save operation
4. If still fails, set `needsSync` flag

**Implementation**:
```javascript
if (error.name === 'QuotaExceededError') {
    // Find old MASE items
    var keysToRemove = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.startsWith('mase_') && key !== self.config.storageKey) {
            keysToRemove.push(key);
        }
    }
    
    // Remove old items
    keysToRemove.forEach(function(key) {
        localStorage.removeItem(key);
    });
    
    // Retry save
    localStorage.setItem(self.config.storageKey, mode);
}
```

## Error Scenarios and Handling

### Scenario 1: localStorage Unavailable

**Cause**: Private browsing, browser settings, or security policies

**Handling**:
- Set `needsSync` flag
- Continue with AJAX save to user meta
- Show warning notice to user
- Mode persists via user meta only

### Scenario 2: AJAX Request Fails

**Cause**: Network error, server timeout, or permission denied

**Handling**:
- Set `needsSync` flag
- Implement retry with exponential backoff
- Show user-friendly error message
- Mode persists locally via localStorage

### Scenario 3: Storage Quota Exceeded

**Cause**: localStorage full (5-10MB limit)

**Handling**:
- Clear old MASE data
- Retry save operation
- If still fails, use user meta only
- Set `needsSync` flag

### Scenario 4: Max Retries Reached

**Cause**: Persistent network or server issues

**Handling**:
- Stop retrying
- Keep `needsSync` flag set
- Show detailed error message
- Sync will retry on next user action

## User Notifications

### Success Messages
- "Dark mode preference synced successfully" (2s)

### Warning Messages
- "Dark mode applied locally. Preference will sync on next save." (3s)
- "Network unavailable. Preference will sync when connection is restored." (5s)

### Error Messages
- "Permission denied. Please refresh the page." (5s)
- "Server error. Preference will sync later." (5s)

## Testing

### Unit Tests

**Location**: `tests/unit/test-dark-mode-persistence.test.js`

**Coverage**:
- localStorage save/load
- AJAX request handling
- Retry logic
- Error handling
- needsSync flag management
- Storage quota handling

### Integration Tests

**Location**: `tests/test-dark-mode-persistence-integration.html`

**Tests**:
1. localStorage Save
2. needsSync Flag
3. Load Saved Preference
4. Sync Preference
5. Quota Exceeded Handling

**How to Run**:
1. Open `tests/test-dark-mode-persistence-integration.html` in browser
2. Click "Run All Tests"
3. View results and logs

## Performance Considerations

### localStorage Operations
- **Target**: < 5ms per operation
- **Actual**: ~1-2ms (synchronous)

### AJAX Requests
- **Target**: < 500ms per request
- **Actual**: Varies by network (typically 100-300ms)

### Retry Delays
- **First retry**: 1 second
- **Second retry**: 2 seconds
- **Third retry**: 4 seconds
- **Total max delay**: 7 seconds

## Browser Compatibility

### localStorage Support
- ✅ Chrome 4+
- ✅ Firefox 3.5+
- ✅ Safari 4+
- ✅ Edge (all versions)
- ✅ IE 8+

### matchMedia Support (for system preference)
- ✅ Chrome 9+
- ✅ Firefox 6+
- ✅ Safari 5.1+
- ✅ Edge (all versions)
- ❌ IE (not supported)

## Security Considerations

### localStorage Security
- Data stored in plain text
- Accessible via JavaScript
- Same-origin policy applies
- No sensitive data stored (only 'light' or 'dark')

### AJAX Security
- Nonce verification required
- Capability check: `manage_options`
- Input sanitization on server
- CSRF protection via WordPress nonces

## Future Enhancements

### Potential Improvements
1. **IndexedDB Support**: For larger storage capacity
2. **Service Worker Sync**: For offline-first approach
3. **WebSocket Sync**: For real-time cross-tab synchronization
4. **Compression**: For storing larger preference objects
5. **Encryption**: For sensitive preference data

### Monitoring
1. **Error Tracking**: Log sync failures to analytics
2. **Performance Metrics**: Track save/load times
3. **Success Rate**: Monitor AJAX success/failure ratio
4. **Retry Statistics**: Track retry attempts and success

## Troubleshooting

### Issue: Preference not persisting

**Symptoms**: Mode resets on page refresh

**Diagnosis**:
1. Check browser console for errors
2. Verify localStorage is enabled
3. Check network tab for AJAX requests
4. Look for `needsSync` flag in state

**Solutions**:
- Enable localStorage in browser settings
- Check network connectivity
- Verify WordPress user has `manage_options` capability
- Clear browser cache and retry

### Issue: Sync keeps failing

**Symptoms**: Warning notices on every toggle

**Diagnosis**:
1. Check network tab for AJAX errors
2. Verify nonce is valid
3. Check server logs for PHP errors
4. Verify AJAX handler is registered

**Solutions**:
- Refresh page to get new nonce
- Check server error logs
- Verify AJAX handler in `includes/class-mase-admin.php`
- Test with different network connection

## Code References

### Main Implementation
- `assets/js/mase-admin.js` (lines 689-1200)
  - `darkModeToggle.savePreference()` - Main save logic
  - `darkModeToggle.syncPreference()` - Retry logic
  - `darkModeToggle.loadSavedPreference()` - Load logic

### Server-side Handler
- `includes/class-mase-admin.php`
  - `handle_ajax_toggle_dark_mode()` - AJAX handler

### Tests
- `tests/unit/test-dark-mode-persistence.test.js` - Unit tests
- `tests/test-dark-mode-persistence-integration.html` - Integration tests

## Conclusion

The persistence layer provides robust, reliable storage of dark mode preferences with comprehensive error handling and retry logic. The dual storage strategy ensures preferences persist across sessions and devices while maintaining performance and user experience.

The implementation follows WordPress best practices for AJAX communication and security, and provides graceful degradation when storage or network is unavailable.
