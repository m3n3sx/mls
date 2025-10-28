# AJAX Migration Map

This document maps all AJAX calls in the legacy `mase-admin.js` to their corresponding API Client methods for migration to the modern architecture.

## Overview

The legacy code contains **11 distinct AJAX endpoints** that need to be migrated to use the API Client module. This migration is part of Task 14 in the modern architecture refactor.

## AJAX Endpoints Inventory

### 1. Apply Palette
**Location:** `assets/js/mase-admin.js:82-130`
**Action:** `mase_apply_palette`
**Method:** POST
**Data:**
- `action`: 'mase_apply_palette'
- `nonce`: Security nonce
- `palette_id`: ID of palette to apply

**Current Implementation:**
```javascript
$.ajax({
    url: self.config.ajaxUrl,
    type: 'POST',
    data: {
        action: 'mase_apply_palette',
        nonce: self.config.nonce,
        palette_id: paletteId
    },
    success: function(response) { /* ... */ },
    error: function(xhr, status, error) { /* ... */ }
});
```

**API Client Method:** `applyPalette(paletteId)`
**Requirements:** 8.1

---

### 2. Save Custom Palette
**Location:** `assets/js/mase-admin.js:149-189`
**Action:** `mase_save_custom_palette`
**Method:** POST
**Data:**
- `action`: 'mase_save_custom_palette'
- `nonce`: Security nonce
- `name`: Palette name
- `colors`: Color values object

**API Client Method:** `saveCustomPalette(name, colors)`
**Requirements:** 8.1

---

### 3. Delete Custom Palette
**Location:** `assets/js/mase-admin.js:198-238`
**Action:** `mase_delete_custom_palette`
**Method:** POST
**Data:**
- `action`: 'mase_delete_custom_palette'
- `nonce`: Security nonce
- `palette_id`: ID of palette to delete

**API Client Method:** `deleteCustomPalette(paletteId)`
**Requirements:** 8.1

---

### 4. Apply Template
**Location:** `assets/js/mase-admin.js:295-360`
**Action:** `mase_apply_template`
**Method:** POST
**Data:**
- `action`: 'mase_apply_template'
- `nonce`: Security nonce
- `template_id`: ID of template to apply

**Current Implementation:**
```javascript
$.ajax({
    url: self.config.ajaxUrl,
    type: 'POST',
    data: {
        action: 'mase_apply_template',
        nonce: self.config.nonce,
        template_id: templateId
    },
    success: function(response) { /* ... */ },
    error: function(xhr) { /* ... */ }
});
```

**API Client Method:** `applyTemplate(templateId)`
**Requirements:** 8.1

---

### 5. Save Custom Template
**Location:** `assets/js/mase-admin.js:520-560`
**Action:** `mase_save_custom_template`
**Method:** POST
**Data:**
- `action`: 'mase_save_custom_template'
- `nonce`: Security nonce
- `name`: Template name
- `settings`: Complete settings snapshot

**API Client Method:** `saveCustomTemplate(name, settings)`
**Requirements:** 8.1

---

### 6. Delete Custom Template
**Location:** `assets/js/mase-admin.js:569-615`
**Action:** `mase_delete_custom_template`
**Method:** POST
**Data:**
- `action`: 'mase_delete_custom_template'
- `nonce`: Security nonce
- `template_id`: ID of template to delete

**API Client Method:** `deleteCustomTemplate(templateId)`
**Requirements:** 8.1

---

### 7. Export Settings
**Location:** `assets/js/mase-admin.js:1650-1710`
**Action:** `mase_export_settings`
**Method:** POST
**Data:**
- `action`: 'mase_export_settings'
- `nonce`: Security nonce

**API Client Method:** `exportSettings()`
**Requirements:** 8.1

---

### 8. Import Settings
**Location:** `assets/js/mase-admin.js:1760-1810`
**Action:** `mase_import_settings`
**Method:** POST
**Data:**
- `action`: 'mase_import_settings'
- `nonce`: Security nonce
- `settings_data`: JSON string of settings

**API Client Method:** `importSettings(settingsData)`
**Requirements:** 8.1

---

### 9. Create Backup
**Location:** `assets/js/mase-admin.js:1880-1920`
**Action:** `mase_create_backup`
**Method:** POST
**Data:**
- `action`: 'mase_create_backup'
- `nonce`: Security nonce
- `trigger`: Optional trigger type ('manual', 'template_apply', 'import')

**API Client Method:** `createBackup(trigger)`
**Requirements:** 8.1

---

### 10. Restore Backup
**Location:** `assets/js/mase-admin.js:1930-1980`
**Action:** `mase_restore_backup`
**Method:** POST
**Data:**
- `action`: 'mase_restore_backup'
- `nonce`: Security nonce
- `backup_id`: ID of backup to restore

**API Client Method:** `restoreBackup(backupId)`
**Requirements:** 8.1

---

### 11. Get Backups List
**Location:** `assets/js/mase-admin.js:1990-2030`
**Action:** `mase_get_backups`
**Method:** POST
**Data:**
- `action`: 'mase_get_backups'
- `nonce`: Security nonce

**API Client Method:** `getBackups()`
**Requirements:** 8.1

---

### 12. Reset Settings
**Location:** `assets/js/mase-admin.js:2070-2130`
**Action:** `mase_reset_settings`
**Method:** POST
**Data:**
- `action`: 'mase_reset_settings'
- `nonce`: Security nonce

**API Client Method:** `resetSettings()`
**Requirements:** 8.1

---

### 13. Save Settings (Main Form)
**Location:** `assets/js/mase-admin.js:3570-3670`
**Action:** `mase_save_settings`
**Method:** POST
**Data:**
- `action`: 'mase_save_settings'
- `nonce`: Security nonce
- `settings`: Complete form data object

**Current Implementation:**
```javascript
$.ajax({
    url: this.config.ajaxUrl,
    type: 'POST',
    data: {
        action: 'mase_save_settings',
        nonce: self.config.nonce,
        settings: formData
    },
    success: function(response) { /* ... */ },
    error: function(xhr, status, error) { /* ... */ }
});
```

**API Client Method:** `saveSettings(settings)`
**Requirements:** 4.4, 8.1

---

### 14. Invalidate Cache
**Location:** `assets/js/mase-admin.js:3690-3710`
**Action:** `mase_invalidate_cache`
**Method:** POST
**Data:**
- `action`: 'mase_invalidate_cache'
- `nonce`: Security nonce

**API Client Method:** `invalidateCache()`
**Requirements:** 8.1

---

## Data Transformations Needed

### 1. Form Data Collection
**Current:** `collectFormData()` method collects all form inputs into nested object
**New:** State Manager will maintain this data structure
**Transformation:** None - structure remains the same

### 2. Response Handling
**Current:** Direct response.success and response.data.message checks
**New:** API Client will standardize response format
**Transformation:** API Client wraps responses in consistent format

### 3. Error Handling
**Current:** Manual xhr.status checks and custom error messages
**New:** API Client provides standardized error handling with retry logic
**Transformation:** API Client maps HTTP status codes to user-friendly messages

### 4. Loading States
**Current:** Manual button disable/enable and spinner management
**New:** State Manager tracks loading states
**Transformation:** UI components subscribe to loading state changes

## Migration Strategy

### Phase 1: API Client Implementation (Task 13 - COMPLETE)
- ✅ Create API Client class with all endpoint methods
- ✅ Implement error handling and retry logic
- ✅ Add request queuing
- ✅ Implement nonce handling

### Phase 2: State Manager Integration (Task 14.2)
- [ ] Update `loadFromServer` to use `apiClient.getSettings()`
- [ ] Update `saveToServer` to use `apiClient.saveSettings()`
- [ ] Add loading states during API calls
- [ ] Remove direct AJAX calls from State Manager

### Phase 3: Feature Modules Migration (Task 14.3)
- [ ] Update palette manager to use API Client methods
- [ ] Update template manager to use API Client methods
- [ ] Update import/export to use API Client methods
- [ ] Update backup manager to use API Client methods
- [ ] Remove all direct AJAX calls from feature modules

### Phase 4: Testing (Task 14.4 - Optional)
- [ ] Test complete save/load workflow
- [ ] Test template application workflow
- [ ] Test error scenarios and recovery
- [ ] Verify all AJAX calls migrated

## API Client Method Mapping

| Legacy AJAX Action | API Client Method | Module |
|-------------------|-------------------|---------|
| `mase_apply_palette` | `applyPalette(paletteId)` | Color System |
| `mase_save_custom_palette` | `saveCustomPalette(name, colors)` | Color System |
| `mase_delete_custom_palette` | `deleteCustomPalette(paletteId)` | Color System |
| `mase_apply_template` | `applyTemplate(templateId)` | Template Manager |
| `mase_save_custom_template` | `saveCustomTemplate(name, settings)` | Template Manager |
| `mase_delete_custom_template` | `deleteCustomTemplate(templateId)` | Template Manager |
| `mase_export_settings` | `exportSettings()` | Import/Export |
| `mase_import_settings` | `importSettings(settingsData)` | Import/Export |
| `mase_create_backup` | `createBackup(trigger)` | Backup Manager |
| `mase_restore_backup` | `restoreBackup(backupId)` | Backup Manager |
| `mase_get_backups` | `getBackups()` | Backup Manager |
| `mase_reset_settings` | `resetSettings()` | Settings |
| `mase_save_settings` | `saveSettings(settings)` | State Manager |
| `mase_invalidate_cache` | `invalidateCache()` | Cache |

## Notes

- All AJAX calls use the same nonce from `maseAdmin.nonce`
- All AJAX calls use the same URL from `maseAdmin.ajaxUrl`
- Error handling patterns are consistent across all calls
- Loading states follow the same pattern (disable button, show spinner)
- Success responses trigger page reload in most cases
- API Client will centralize these patterns for consistency

## References

- Requirements: `.kiro/specs/modern-architecture-refactor/requirements.md` (Requirement 8)
- Design: `.kiro/specs/modern-architecture-refactor/design.md` (API Client Module)
- API Client Implementation: `assets/js/modules/api-client.js`
- Legacy Code: `assets/js/mase-admin.js`
