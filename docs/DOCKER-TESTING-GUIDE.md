# Docker Visual Testing Guide

## Quick Start

```bash
# 1. Start WordPress environment
./docker-setup.sh

# 2. Access WordPress admin
# URL: http://localhost:8080/wp-admin
# Username: admin
# Password: admin

# 3. Go to plugin settings
# http://localhost:8080/wp-admin/admin.php?page=modern-admin-styler
```

## Testing Live Preview Toggle

### Test Scenario 1: Basic Toggle Functionality
1. Open plugin settings page
2. Open browser DevTools (F12) → Console tab
3. Click "Live Preview" toggle
4. **Expected:** Toggle switches state, no console errors
5. **Check:** Preview panel appears/disappears smoothly

### Test Scenario 2: Template Selection
1. Enable Live Preview
2. Click on different templates in the gallery
3. **Expected:** Preview updates immediately
4. **Check:** No duplicate AJAX calls in Network tab

### Test Scenario 3: Apply Template
1. Select a template
2. Click "Apply Template" button
3. **Expected:** Success message appears
4. **Check:** Settings saved correctly

### Test Scenario 4: Race Conditions
1. Quickly toggle Live Preview on/off multiple times
2. **Expected:** No JavaScript errors
3. **Check:** Event handlers don't stack up

## Debugging in Browser

### Console Commands
```javascript
// Check if toggle exists
jQuery('.mase-live-preview-toggle').length

// Check event handlers
jQuery._data(jQuery('.mase-live-preview-toggle')[0], 'events')

// Check preview panel state
jQuery('.mase-live-preview-panel').is(':visible')

// Test AJAX endpoint
jQuery.post(ajaxurl, {
    action: 'mase_apply_template',
    template_id: 'default',
    nonce: maseAdmin.nonce
}, console.log)
```

### Network Tab
- Filter by "mase_" to see plugin AJAX calls
- Check for duplicate requests
- Verify response status codes

### Elements Tab
- Inspect `.mase-live-preview-toggle`
- Check computed CSS for `pointer-events`, `z-index`
- Verify no overlapping elements

## Docker Commands

```bash
# View WordPress logs
docker-compose logs -f wordpress

# Access WordPress container
docker exec -it mase_wordpress bash

# Check PHP errors
docker exec mase_wordpress tail -f /var/www/html/wp-content/debug.log

# Restart containers
docker-compose restart

# Stop everything
docker-compose down

# Clean restart (removes data)
docker-compose down -v
docker-compose up -d
```

## Common Issues

### Port 8080 already in use
```bash
# Change port in docker-compose.yml
ports:
  - "8081:80"  # Use 8081 instead
```

### Plugin not visible
```bash
# Check plugin files
docker exec mase_wordpress ls -la /var/www/html/wp-content/plugins/modern-admin-styler

# Reactivate plugin
docker exec mase_wordpress wp plugin deactivate modern-admin-styler --allow-root
docker exec mase_wordpress wp plugin activate modern-admin-styler --allow-root
```

### Permission errors
```bash
# Fix permissions
docker exec mase_wordpress chown -R www-data:www-data /var/www/html/wp-content/plugins/modern-admin-styler
```

## Visual Testing Checklist

- [ ] Toggle switches smoothly without lag
- [ ] Preview panel animates correctly
- [ ] No console errors when toggling
- [ ] Template thumbnails load properly
- [ ] Apply button works on first click
- [ ] Settings persist after page reload
- [ ] No duplicate event handlers (check with jQuery._data)
- [ ] AJAX calls complete successfully (Network tab)
- [ ] CSS animations work smoothly
- [ ] Responsive design works on different screen sizes
