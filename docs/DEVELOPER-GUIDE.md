# MASE Developer Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Testing Procedures](#testing-procedures)
4. [Build and Deployment](#build-and-deployment)
5. [Debugging Techniques](#debugging-techniques)
6. [Code Standards](#code-standards)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- PHP 7.4+ (WordPress requirement)
- WordPress 5.8+ installation
- Git for version control

### Initial Setup

1. **Clone the repository**:
```bash
git clone https://github.com/your-org/modern-admin-styler.git
cd modern-admin-styler
```

2. **Install dependencies**:
```bash
npm install
```

3. **Install WordPress plugin**:
```bash
# Copy plugin to WordPress plugins directory
cp -r . /path/to/wordpress/wp-content/plugins/modern-admin-styler/

# Or create symlink for development
ln -s $(pwd) /path/to/wordpress/wp-content/plugins/modern-admin-styler
```

4. **Activate plugin in WordPress**:
- Navigate to WordPress admin → Plugins
- Activate "Modern Admin Styler"

### Project Structure

```
modern-admin-styler/
├── assets/
│   ├── css/                    # Stylesheets
│   │   ├── mase-admin.css     # Main admin styles
│   │   ├── mase-palettes.css  # Color palettes
│   │   └── mase-templates.css # Template styles
│   └── js/
│       ├── modules/            # Modern ES6 modules
│       │   ├── state-manager.js
│       │   ├── event-bus.js
│       │   ├── api-client.js
│       │   ├── preview-engine.js
│       │   ├── color-system.js
│       │   ├── typography.js
│       │   ├── animations.js
│       │   ├── palette-manager.js
│       │   ├── template-manager.js
│       │   ├── main-admin.js
│       │   └── index.js        # Module exports
│       └── mase-admin.js       # Legacy monolith (being phased out)
├── includes/
│   ├── class-mase-admin.php        # Asset enqueuing, AJAX handlers
│   ├── class-mase-settings.php     # Settings CRUD
│   ├── class-mase-rest-api.php     # REST API endpoints
│   ├── class-mase-css-generator.php # Server-side CSS generation
│   ├── class-mase-cache.php        # Caching layer
│   ├── class-mase-feature-flags.php # Feature flag system
│   └── admin-settings-page.php     # Admin page template
├── tests/
│   ├── unit/                   # Unit tests (Vitest)
│   ├── integration/            # Integration tests
│   ├── e2e/                    # End-to-end tests (Playwright)
│   └── utils/                  # Test utilities
├── docs/                       # Documentation
├── .eslintrc.json             # ESLint configuration
├── .prettierrc.json           # Prettier configuration
├── package.json               # Node dependencies and scripts
├── vite.config.js             # Vite build configuration
├── vitest.config.js           # Vitest test configuration
├── playwright.config.js       # Playwright E2E configuration
└── modern-admin-styler.php    # Main plugin file
```

## Development Workflow

### Starting Development

1. **Start Vite dev server** (with Hot Module Replacement):
```bash
npm run dev
```

This starts Vite in development mode with:
- Hot Module Replacement (HMR) for instant updates
- Source maps for debugging
- Fast rebuild times (< 100ms)

2. **Open WordPress admin** in your browser:
```
http://localhost:8080/wp-admin/admin.php?page=mase-settings
```

3. **Make changes** to JavaScript modules in `assets/js/modules/`

4. **See changes instantly** - Vite HMR will update the browser automatically

### Development Scripts

```bash
# Development
npm run dev              # Start Vite dev server with HMR
npm run dev:watch        # Watch mode with auto-rebuild

# Building
npm run build            # Production build with optimizations
npm run build:dev        # Development build with source maps
npm run preview          # Preview production build locally

# Testing
npm run test             # Run all tests
npm run test:unit        # Run unit tests only
npm run test:integration # Run integration tests only
npm run test:e2e         # Run E2E tests (requires WordPress running)
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Lint JavaScript with ESLint
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check formatting without changes

# Utilities
npm run analyze          # Analyze bundle sizes
npm run clean            # Clean build artifacts
```

### Git Workflow

1. **Create feature branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes and commit**:
```bash
git add .
git commit -m "feat: add new feature"
```

Commit message format (Conventional Commits):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process or auxiliary tool changes

3. **Push and create pull request**:
```bash
git push origin feature/your-feature-name
```

### Pre-commit Hooks

Husky runs automatically before each commit:
1. Lints staged files with ESLint
2. Formats code with Prettier
3. Runs relevant tests

If checks fail, commit is blocked. Fix issues and try again.

## Testing Procedures

### Unit Testing with Vitest

**Location**: `tests/unit/`

**Run tests**:
```bash
npm run test:unit
```

**Write a unit test**:
```javascript
// tests/unit/color-system.test.js
import { describe, it, expect } from 'vitest';
import { ColorSystem } from '../../assets/js/modules/color-system.js';

describe('ColorSystem', () => {
  describe('hexToRgb', () => {
    it('should convert hex to RGB correctly', () => {
      const colorSystem = new ColorSystem();
      const result = colorSystem.hexToRgb('#ff0000');
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });
    
    it('should throw error for invalid hex', () => {
      const colorSystem = new ColorSystem();
      expect(() => colorSystem.hexToRgb('invalid')).toThrow();
    });
  });
});
```

**Test structure**:
- `describe()` - Group related tests
- `it()` - Individual test case
- `expect()` - Assertion

**Mocking**:
```javascript
import { vi } from 'vitest';

// Mock a function
const mockFn = vi.fn();
mockFn.mockReturnValue('mocked value');

// Mock a module
vi.mock('../../assets/js/modules/api-client.js', () => ({
  APIClient: vi.fn().mockImplementation(() => ({
    getSettings: vi.fn().mockResolvedValue({ colors: {} })
  }))
}));
```

### Integration Testing

**Location**: `tests/integration/`

**Run tests**:
```bash
npm run test:integration
```

**Write an integration test**:
```javascript
// tests/integration/palette-application.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { StateManager } from '../../assets/js/modules/state-manager.js';
import { PaletteManager } from '../../assets/js/modules/palette-manager.js';
import { ColorSystem } from '../../assets/js/modules/color-system.js';

describe('Palette Application Integration', () => {
  let stateManager, paletteManager, colorSystem;
  
  beforeEach(() => {
    stateManager = new StateManager();
    colorSystem = new ColorSystem();
    paletteManager = new PaletteManager(stateManager, colorSystem);
  });
  
  it('should apply palette and update state', async () => {
    await paletteManager.applyPalette('ocean-blue');
    const colors = stateManager.getState().settings.colors;
    expect(colors.primary).toBe('#0066cc');
  });
});
```

### E2E Testing with Playwright

**Location**: `tests/e2e/`

**Run tests**:
```bash
# Start WordPress first
npm run test:e2e
```

**Write an E2E test**:
```javascript
// tests/e2e/color-palette.spec.js
import { test, expect } from '@playwright/test';

test.describe('Color Palette Selection', () => {
  test.beforeEach(async ({ page }) => {
    // Login to WordPress
    await page.goto('/wp-login.php');
    await page.fill('#user_login', 'admin');
    await page.fill('#user_pass', 'password');
    await page.click('#wp-submit');
    
    // Navigate to MASE settings
    await page.goto('/wp-admin/admin.php?page=mase-settings');
  });
  
  test('should preview and apply color palette', async ({ page }) => {
    // Click on palette
    await page.click('[data-palette-id="ocean-blue"]');
    
    // Verify preview is active
    const previewStyle = await page.locator('#mase-preview-style');
    await expect(previewStyle).toBeVisible();
    
    // Apply palette
    await page.click('[data-action="apply-palette"]');
    
    // Verify success message
    await expect(page.locator('.mase-notice--success')).toBeVisible();
    
    // Reload page and verify persistence
    await page.reload();
    const primaryColor = await page.locator('#mase_primary_color').inputValue();
    expect(primaryColor).toBe('#0066cc');
  });
});
```

**Playwright tips**:
- Use `data-*` attributes for test selectors (more stable than classes)
- Take screenshots on failure: `await page.screenshot({ path: 'error.png' })`
- Use `page.pause()` for debugging
- Run headed mode: `npx playwright test --headed`

### Test Coverage

**Generate coverage report**:
```bash
npm run test:coverage
```

**View coverage**:
```bash
open coverage/index.html
```

**Coverage targets**:
- Overall: 80%+
- Statements: 80%+
- Branches: 75%+
- Functions: 80%+
- Lines: 80%+

## Build and Deployment

### Development Build

```bash
npm run build:dev
```

Generates:
- Unminified bundles
- Source maps
- Development-friendly output

### Production Build

```bash
npm run build
```

Generates:
- Minified bundles
- Optimized code splitting
- Tree-shaken dependencies
- Hashed filenames for cache busting
- Manifest file for WordPress integration

**Output**:
```
dist/
├── assets/
│   ├── main-[hash].js          # Main bundle
│   ├── preview-[hash].js       # Preview Engine
│   ├── color-[hash].js         # Color System
│   ├── typography-[hash].js    # Typography
│   ├── animations-[hash].js    # Animations
│   └── vendor-[hash].js        # Third-party dependencies
├── manifest.json               # Asset manifest for WordPress
└── stats.html                  # Bundle analysis (if enabled)
```

### Bundle Analysis

```bash
npm run analyze
```

Opens interactive bundle analyzer showing:
- Bundle sizes
- Module dependencies
- Largest modules
- Optimization opportunities

### Deployment Process

1. **Run tests**:
```bash
npm run test
```

2. **Build production bundle**:
```bash
npm run build
```

3. **Verify build**:
```bash
npm run preview
```

4. **Create release package**:
```bash
./create-release-package.sh
```

This creates `modern-admin-styler-[version].zip` with:
- Production bundles
- PHP files
- CSS files
- Documentation
- No development files (node_modules, tests, etc.)

5. **Deploy to WordPress**:
- Upload ZIP via WordPress admin → Plugins → Add New → Upload
- Or deploy via FTP/SFTP to `wp-content/plugins/`

6. **Activate and test**:
- Activate plugin
- Test critical workflows
- Monitor error logs

### Version Management

**Update version**:
1. Update `package.json` version
2. Update `modern-admin-styler.php` version header
3. Update `CHANGELOG.md`
4. Commit: `git commit -m "chore: bump version to X.Y.Z"`
5. Tag: `git tag vX.Y.Z`
6. Push: `git push && git push --tags`

## Debugging Techniques

### Browser DevTools

**Console debugging**:
```javascript
// Add debug logging
console.log('State:', useStore.getState());
console.log('Event emitted:', eventName, data);

// Breakpoints
debugger; // Pauses execution

// Performance profiling
console.time('CSS Generation');
const css = previewEngine.generateCSS(settings);
console.timeEnd('CSS Generation');
```

**Network tab**:
- Monitor AJAX requests
- Check request/response payloads
- Verify nonces and headers
- Check response times

**Performance tab**:
- Profile JavaScript execution
- Identify bottlenecks
- Check frame rates
- Monitor memory usage

### Vite Dev Server Debugging

**Source maps**: Vite generates source maps automatically in dev mode, so you can debug original source code in browser DevTools.

**HMR debugging**:
```javascript
// In your module
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    console.log('Module updated:', newModule);
  });
}
```

### WordPress Debugging

**Enable WordPress debug mode** in `wp-config.php`:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);
```

**Check debug log**:
```bash
tail -f wp-content/debug.log
```

**PHP debugging**:
```php
// Add to PHP files
error_log('Debug: ' . print_r($variable, true));
```

### Module-Specific Debugging

**State Manager**:
```javascript
// Log all state changes
useStore.subscribe((state) => {
  console.log('State changed:', state);
});

// Check history
console.log('Can undo:', useStore.getState().canUndo());
console.log('History:', useStore.getState().history);
```

**Event Bus**:
```javascript
// Log all events
eventBus.on('*', (event, data) => {
  console.log('Event:', event, data);
});
```

**API Client**:
```javascript
// Enable request logging
apiClient.setDebug(true);

// Check request queue
console.log('Queue:', apiClient.getQueue());
```

### Common Issues

**Issue**: Changes not reflecting in browser
- **Solution**: Check if Vite dev server is running
- **Solution**: Hard refresh (Ctrl+Shift+R)
- **Solution**: Clear browser cache

**Issue**: Module not found errors
- **Solution**: Check import paths are correct
- **Solution**: Verify file exists
- **Solution**: Restart Vite dev server

**Issue**: Tests failing
- **Solution**: Check test setup in `tests/setup.js`
- **Solution**: Verify mocks are correct
- **Solution**: Run tests in isolation: `npm run test -- color-system.test.js`

**Issue**: Build errors
- **Solution**: Check for syntax errors
- **Solution**: Verify all imports are valid
- **Solution**: Clear build cache: `npm run clean && npm run build`

## Code Standards

### JavaScript Style Guide

**Use ES6+ features**:
```javascript
// Good
const colors = { primary: '#ff0000' };
const { primary } = colors;
const newColors = { ...colors, secondary: '#00ff00' };

// Avoid
var colors = { primary: '#ff0000' };
var primary = colors.primary;
```

**Use arrow functions**:
```javascript
// Good
const double = (x) => x * 2;
array.map(item => item.value);

// Avoid
function double(x) { return x * 2; }
array.map(function(item) { return item.value; });
```

**Use template literals**:
```javascript
// Good
const message = `Hello, ${name}!`;
const css = `
  .class {
    color: ${color};
  }
`;

// Avoid
const message = 'Hello, ' + name + '!';
```

**Use destructuring**:
```javascript
// Good
const { colors, typography } = settings;
const [first, second] = array;

// Avoid
const colors = settings.colors;
const typography = settings.typography;
```

### Naming Conventions

**Variables and functions**: camelCase
```javascript
const primaryColor = '#ff0000';
function calculateContrast() {}
```

**Classes**: PascalCase
```javascript
class ColorSystem {}
class PreviewEngine {}
```

**Constants**: UPPER_SNAKE_CASE
```javascript
const MAX_HISTORY_SIZE = 50;
const DEFAULT_TIMEOUT = 30000;
```

**Private methods**: prefix with underscore
```javascript
class MyClass {
  _privateMethod() {}
  publicMethod() {}
}
```

**Event names**: kebab-case with namespace
```javascript
'settings:changed'
'palette:applied'
'font:loaded'
```

### File Organization

**One module per file**:
```javascript
// color-system.js
export class ColorSystem {
  // Implementation
}

// Don't mix multiple classes in one file
```

**Group related functions**:
```javascript
// utils/color-utils.js
export function hexToRgb() {}
export function rgbToHsl() {}
export function hslToRgb() {}
```

**Export at bottom**:
```javascript
class ColorSystem {
  // Implementation
}

export { ColorSystem };
```

### Documentation

**JSDoc comments for public APIs**:
```javascript
/**
 * Converts hex color to RGB
 * @param {string} hex - Hex color code (e.g., '#ff0000')
 * @returns {{r: number, g: number, b: number}} RGB object
 * @throws {Error} If hex format is invalid
 */
hexToRgb(hex) {
  // Implementation
}
```

**Inline comments for complex logic**:
```javascript
// Calculate contrast ratio using WCAG formula
// https://www.w3.org/TR/WCAG20/#contrast-ratiodef
const ratio = (lighter + 0.05) / (darker + 0.05);
```

### Error Handling

**Always handle errors**:
```javascript
// Good
try {
  const result = await apiClient.getSettings();
  return result;
} catch (error) {
  console.error('Failed to load settings:', error);
  eventBus.emit('mase:error', { error });
  return defaultSettings;
}

// Avoid
const result = await apiClient.getSettings(); // Unhandled rejection
```

**Throw meaningful errors**:
```javascript
// Good
throw new Error(`Invalid color format: ${color}`);

// Avoid
throw new Error('Error');
```

## Common Tasks

### Adding a New Module

1. **Create module file**:
```bash
touch assets/js/modules/my-module.js
```

2. **Implement module**:
```javascript
// assets/js/modules/my-module.js
export class MyModule {
  constructor(stateManager, eventBus) {
    this.stateManager = stateManager;
    this.eventBus = eventBus;
  }
  
  init() {
    // Initialization logic
  }
}
```

3. **Export from index**:
```javascript
// assets/js/modules/index.js
export { MyModule } from './my-module.js';
```

4. **Register in main-admin.js**:
```javascript
// assets/js/modules/main-admin.js
import { MyModule } from './my-module.js';

async function init() {
  // ... existing initialization
  const myModule = new MyModule(stateManager, eventBus);
  await myModule.init();
}
```

5. **Write tests**:
```bash
touch tests/unit/my-module.test.js
```

### Adding a New REST API Endpoint

1. **Add endpoint to PHP**:
```php
// includes/class-mase-rest-api.php
public function register_routes() {
  register_rest_route('mase/v1', '/my-endpoint', [
    'methods' => 'POST',
    'callback' => [$this, 'handle_my_endpoint'],
    'permission_callback' => [$this, 'check_permissions'],
  ]);
}

public function handle_my_endpoint($request) {
  $data = $request->get_json_params();
  
  // Validate
  if (empty($data['required_field'])) {
    return new WP_Error('invalid_data', 'Required field missing', ['status' => 400]);
  }
  
  // Process
  $result = $this->process_data($data);
  
  return rest_ensure_response($result);
}
```

2. **Add method to API Client**:
```javascript
// assets/js/modules/api-client.js
async myEndpoint(data) {
  return this.request('/mase/v1/my-endpoint', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

3. **Use in module**:
```javascript
const result = await apiClient.myEndpoint({ field: 'value' });
```

### Adding a New Event

1. **Define event constant**:
```javascript
// assets/js/modules/event-bus.js
export const EVENTS = {
  // ... existing events
  MY_NEW_EVENT: 'my:new-event',
};
```

2. **Emit event**:
```javascript
eventBus.emit(EVENTS.MY_NEW_EVENT, { data });
```

3. **Subscribe to event**:
```javascript
eventBus.on(EVENTS.MY_NEW_EVENT, (data) => {
  console.log('Event received:', data);
});
```

4. **Document in EVENT-CONTRACTS.md**:
```markdown
### my:new-event

**Emitted by**: MyModule
**Payload**: `{ field: string }`
**Description**: Emitted when something happens
```

### Adding a New Feature Flag

1. **Add flag to PHP**:
```php
// includes/class-mase-feature-flags.php
private function get_default_flags() {
  return [
    // ... existing flags
    'MASE_MY_FEATURE' => false,
  ];
}
```

2. **Pass to JavaScript**:
```php
// includes/class-mase-admin.php
wp_localize_script('mase-modern', 'maseData', [
  'features' => MASE_Feature_Flags::get_all_flags(),
]);
```

3. **Check flag in JavaScript**:
```javascript
// assets/js/modules/feature-flags.js
if (isFeatureEnabled('MASE_MY_FEATURE')) {
  // New feature code
} else {
  // Legacy code
}
```

4. **Add UI toggle**:
```php
// includes/admin-settings-page.php
<label>
  <input type="checkbox" name="mase_feature_flags[MASE_MY_FEATURE]" 
         <?php checked(MASE_Feature_Flags::is_enabled('MASE_MY_FEATURE')); ?>>
  Enable My Feature (Experimental)
</label>
```

## Troubleshooting

### Build Issues

**Error**: `Cannot find module`
```bash
# Solution: Install dependencies
npm install

# Or clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error**: `Vite build failed`
```bash
# Solution: Check for syntax errors
npm run lint

# Clear cache and rebuild
npm run clean
npm run build
```

### Test Issues

**Error**: `Test timeout`
```javascript
// Solution: Increase timeout
test('slow test', async () => {
  // ...
}, 10000); // 10 second timeout
```

**Error**: `Module not found in tests`
```javascript
// Solution: Check vitest.config.js resolve aliases
export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './assets/js'),
    },
  },
};
```

### WordPress Integration Issues

**Error**: `Nonce verification failed`
```php
// Solution: Check nonce is passed correctly
wp_localize_script('mase-modern', 'maseData', [
  'nonce' => wp_create_nonce('wp_rest'),
]);
```

```javascript
// And included in requests
headers: {
  'X-WP-Nonce': window.maseData.nonce,
}
```

**Error**: `Permission denied`
```php
// Solution: Check user capabilities
if (!current_user_can('manage_options')) {
  return new WP_Error('forbidden', 'Insufficient permissions', ['status' => 403]);
}
```

### Performance Issues

**Issue**: Slow preview updates
```javascript
// Solution: Debounce rapid updates
const debouncedUpdate = debounce(() => {
  previewEngine.generateCSS(settings);
}, 100);
```

**Issue**: Large bundle size
```bash
# Solution: Analyze bundle
npm run analyze

# Check for duplicate dependencies
npm dedupe

# Use code splitting
const module = await import('./heavy-module.js');
```

### Getting Help

1. **Check documentation**: Read relevant docs in `docs/` directory
2. **Search issues**: Check GitHub issues for similar problems
3. **Enable debug mode**: Set `WP_DEBUG` and check logs
4. **Ask team**: Post in team chat or create GitHub issue
5. **Pair programming**: Schedule session with experienced developer

## Additional Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Migration Guide](./MIGRATION-GUIDE.md)
- [Testing Guide](../tests/README.md)
- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)


## Admin Menu Enhancement Architecture

The admin menu enhancement system provides comprehensive customization of the WordPress left sidebar menu, including spacing optimization, gradient backgrounds, Google Fonts, submenu styling, and logo placement.

### CSS Generation Architecture

The CSS generation system is built around modular methods in `includes/class-mase-css-generator.php` that generate targeted CSS for specific features.

#### Main Generation Method

```php
/**
 * Generate admin menu CSS with all enhancements
 * Location: includes/class-mase-css-generator.php
 */
private function generate_admin_menu_css( $settings ) {
    $css = '';
    $menu = $settings['admin_menu'] ?? [];
    
    // Base styles (background, width, borders, shadows)
    $css .= $this->generate_menu_base_styles( $menu );
    
    // Menu item padding optimization
    $css .= $this->generate_menu_item_padding_css( $menu );
    
    // Icon color synchronization
    $css .= $this->generate_menu_icon_color_css( $menu );
    
    // Dynamic submenu positioning
    $css .= $this->generate_submenu_positioning_css( $menu );
    
    // Height Mode (full vs content)
    $css .= $this->generate_height_mode_css( $menu );
    
    // Submenu styles
    $css .= $this->generate_menu_submenu_css( $settings );
    
    // Logo placement
    $css .= $this->generate_menu_logo_css( $menu );
    
    // Google Fonts import
    $css .= $this->generate_google_fonts_import( $settings );
    
    return $css;
}
```

#### Modular CSS Generation Methods

Each feature has its own generation method for maintainability:

**Menu Item Padding**:
```php
private function generate_menu_item_padding_css( $menu ) {
    $v_padding = $menu['padding_vertical'] ?? 10;
    $h_padding = $menu['padding_horizontal'] ?? 15;
    
    return "#adminmenu li.menu-top > a {
        padding: {$v_padding}px {$h_padding}px !important;
    }";
}
```

**Icon Color Synchronization**:
```php
private function generate_menu_icon_color_css( $menu ) {
    $mode = $menu['icon_color_mode'] ?? 'auto';
    
    if ( $mode === 'auto' ) {
        // Sync with text color
        $color = $menu['text_color'] ?? '#ffffff';
    } else {
        // Use custom color
        $color = $menu['icon_color'] ?? '#ffffff';
    }
    
    return "#adminmenu .wp-menu-image,
            #adminmenu .wp-menu-image:before,
            #adminmenu .dashicons {
        color: {$color} !important;
    }";
}
```

**Dynamic Submenu Positioning**:
```php
private function generate_submenu_positioning_css( $menu ) {
    $width = $menu['width'] ?? 160;
    $spacing = $settings['admin_menu_submenu']['spacing'] ?? 0;
    
    // Position submenu at menu width + spacing offset
    return "#adminmenu .wp-submenu {
        left: {$width}px !important;
        top: {$spacing}px !important;
    }";
}
```

**Height Mode**:
```php
private function generate_height_mode_css( $menu ) {
    $mode = $menu['height_mode'] ?? 'full';
    
    if ( $mode === 'content' ) {
        return "#adminmenuback, #adminmenuwrap {
            height: auto !important;
            min-height: 100vh;
        }";
    }
    
    return "#adminmenuback, #adminmenuwrap {
        height: 100% !important;
    }";
}
```

**Gradient Backgrounds**:
```php
private function generate_gradient_background( $menu ) {
    $type = $menu['gradient_type'] ?? 'linear';
    $angle = $menu['gradient_angle'] ?? 90;
    $colors = $menu['gradient_colors'] ?? [];
    
    // Build color stops
    $stops = array_map(function($stop) {
        return $stop['color'] . ' ' . $stop['position'] . '%';
    }, $colors);
    
    $gradient_str = implode(', ', $stops);
    
    switch ($type) {
        case 'linear':
            return "background: linear-gradient({$angle}deg, {$gradient_str}) !important;";
        case 'radial':
            return "background: radial-gradient(circle, {$gradient_str}) !important;";
        case 'conic':
            return "background: conic-gradient(from {$angle}deg, {$gradient_str}) !important;";
    }
}
```
**Bo
rder Radius (Individual Corners)**:
```php
private function generate_border_radius_css( $menu ) {
    $mode = $menu['border_radius_mode'] ?? 'uniform';
    
    if ( $mode === 'uniform' ) {
        $radius = $menu['border_radius'] ?? 0;
        return "border-radius: {$radius}px !important;";
    }
    
    // Individual corners
    $tl = $menu['border_radius_tl'] ?? 0;
    $tr = $menu['border_radius_tr'] ?? 0;
    $br = $menu['border_radius_br'] ?? 0;
    $bl = $menu['border_radius_bl'] ?? 0;
    
    return "border-radius: {$tl}px {$tr}px {$br}px {$bl}px !important;";
}
```

**Shadow Effects**:
```php
private function generate_shadow_css( $menu ) {
    $mode = $menu['shadow_mode'] ?? 'preset';
    
    if ( $mode === 'preset' ) {
        $presets = [
            'none' => 'none',
            'subtle' => '0 2px 4px rgba(0,0,0,0.1)',
            'medium' => '0 4px 8px rgba(0,0,0,0.15)',
            'strong' => '0 8px 16px rgba(0,0,0,0.2)',
            'dramatic' => '0 12px 24px rgba(0,0,0,0.3)',
        ];
        
        $preset = $menu['shadow_preset'] ?? 'none';
        return "box-shadow: {$presets[$preset]} !important;";
    }
    
    // Custom shadow
    $h = $menu['shadow_h_offset'] ?? 0;
    $v = $menu['shadow_v_offset'] ?? 4;
    $blur = $menu['shadow_blur'] ?? 8;
    $spread = $menu['shadow_spread'] ?? 0;
    $color = $menu['shadow_color'] ?? 'rgba(0,0,0,0.15)';
    
    return "box-shadow: {$h}px {$v}px {$blur}px {$spread}px {$color} !important;";
}
```

**Floating Margins**:
```php
private function generate_floating_css( $menu ) {
    $mode = $menu['floating_margin_mode'] ?? 'uniform';
    
    if ( $mode === 'uniform' ) {
        $margin = $menu['floating_margin'] ?? 8;
        return "margin: {$margin}px !important;";
    }
    
    // Individual margins
    $top = $menu['floating_margin_top'] ?? 8;
    $right = $menu['floating_margin_right'] ?? 8;
    $bottom = $menu['floating_margin_bottom'] ?? 8;
    $left = $menu['floating_margin_left'] ?? 8;
    
    return "margin: {$top}px {$right}px {$bottom}px {$left}px !important;";
}
```

**Logo Placement**:
```php
private function generate_menu_logo_css( $menu ) {
    if ( ! ($menu['logo_enabled'] ?? false) ) {
        return '';
    }
    
    $url = esc_url( $menu['logo_url'] ?? '' );
    $position = $menu['logo_position'] ?? 'top';
    $width = $menu['logo_width'] ?? 100;
    $alignment = $menu['logo_alignment'] ?? 'center';
    
    $css = ".mase-menu-logo {
        display: block;
        width: {$width}px;
        height: auto;
        text-align: {$alignment};
        order: " . ($position === 'top' ? '-1' : '999') . ";
    }
    
    .mase-menu-logo img {
        max-width: 100%;
        height: auto;
    }";
    
    return $css;
}
```

**Google Fonts Import**:
```php
private function generate_google_fonts_import( $settings ) {
    $fonts = [];
    
    // Collect fonts from menu and submenu
    if ( !empty($settings['typography']['admin_menu']['font_family']) ) {
        $font = $settings['typography']['admin_menu']['font_family'];
        if ( $font !== 'system' ) {
            $fonts[] = $font;
        }
    }
    
    if ( !empty($settings['admin_menu_submenu']['font_family']) ) {
        $font = $settings['admin_menu_submenu']['font_family'];
        if ( $font !== 'system' ) {
            $fonts[] = $font;
        }
    }
    
    if ( empty($fonts) ) {
        return '';
    }
    
    // Remove duplicates
    $fonts = array_unique($fonts);
    
    // Generate @import statements
    $imports = array_map(function($font) {
        $font_url = str_replace(' ', '+', $font);
        return "@import url('https://fonts.googleapis.com/css2?family={$font_url}:wght@300;400;500;600;700&display=swap');";
    }, $fonts);
    
    return implode("\n", $imports);
}
```

#### CSS Generation Best Practices

1. **Modular Methods**: Each feature has its own generation method
2. **Default Values**: Always provide fallback defaults
3. **Sanitization**: Escape all user input
4. **Specificity**: Use `!important` to override WordPress defaults
5. **Performance**: Cache generated CSS
6. **Validation**: Validate ranges and enum values


### Live Preview System

The live preview system provides real-time visual feedback as users adjust settings, without requiring page reload or save.

#### Architecture Overview

```
User Input → Event Listener → Update Method → DOM Manipulation → Visual Feedback
```

#### Implementation in mase-admin.js

The live preview system is organized into the `adminMenuPreview` module:

```javascript
// Location: assets/js/mase-admin.js
adminMenuPreview: {
    /**
     * Initialize all event listeners
     */
    init: function() {
        // Color controls
        $('#admin-menu-bg-color').on('change', this.updateBackgroundColor.bind(this));
        $('#admin-menu-text-color').on('change', this.updateTextAndIconColor.bind(this));
        
        // Dimension controls
        $('#admin-menu-width').on('input', this.updateWidth.bind(this));
        $('#admin-menu-padding-vertical').on('input', this.updatePadding.bind(this));
        $('#admin-menu-padding-horizontal').on('input', this.updatePadding.bind(this));
        
        // Typography controls
        $('#admin-menu-font-family').on('change', this.updateFontFamily.bind(this));
        $('#admin-menu-font-size').on('input', this.updateFontSize.bind(this));
        
        // Visual effects
        $('#admin-menu-height-mode').on('change', this.updateHeightMode.bind(this));
        $('#admin-menu-border-radius').on('input', this.updateBorderRadius.bind(this));
        $('#admin-menu-shadow-preset').on('change', this.updateShadow.bind(this));
        
        // Gradient controls
        $('#admin-menu-bg-type').on('change', this.updateBackgroundType.bind(this));
        $('#admin-menu-gradient-angle').on('input', this.updateGradientAngle.bind(this));
        $('.admin-menu-gradient-color').on('change', this.updateGradient.bind(this));
        
        // Submenu controls
        $('#admin-menu-submenu-spacing').on('input', this.updateSubmenuSpacing.bind(this));
        $('#admin-menu-submenu-bg-color').on('change', this.updateSubmenuBgColor.bind(this));
        
        // Logo controls
        $('#admin-menu-logo-enabled').on('change', this.updateLogoVisibility.bind(this));
        $('#admin-menu-logo-position').on('change', this.updateLogoPosition.bind(this));
    },
    
    /**
     * Update menu width and recalculate submenu position
     */
    updateWidth: function(e) {
        const width = $(e.target).val();
        
        // Update menu width
        $('#adminmenu, #adminmenuback, #adminmenuwrap').css('width', width + 'px');
        
        // Recalculate submenu position (critical for proper alignment)
        const spacing = parseInt($('#admin-menu-submenu-spacing').val()) || 0;
        $('#adminmenu .wp-submenu').css({
            'left': width + 'px',
            'top': spacing + 'px'
        });
        
        // Adjust content area margin
        $('#wpcontent, #wpfooter').css('margin-left', width + 'px');
    },
    
    /**
     * Update text and icon color with synchronization
     */
    updateTextAndIconColor: function(e) {
        const color = $(e.target).val();
        const iconMode = $('#admin-menu-icon-color-mode').val();
        
        // Update text color
        $('#adminmenu a, #adminmenu .wp-menu-name').css('color', color);
        
        // Update icon color if in auto mode
        if (iconMode === 'auto') {
            $('#adminmenu .wp-menu-image, #adminmenu .dashicons').css('color', color);
        }
    },
    
    /**
     * Update Height Mode
     */
    updateHeightMode: function(e) {
        const mode = $(e.target).val();
        
        if (mode === 'content') {
            $('#adminmenuback, #adminmenuwrap').css({
                'height': 'auto',
                'min-height': '100vh'
            });
        } else {
            $('#adminmenuback, #adminmenuwrap').css('height', '100%');
        }
    },
    
    /**
     * Update submenu spacing with position recalculation
     */
    updateSubmenuSpacing: function(e) {
        const spacing = $(e.target).val();
        const width = parseInt($('#admin-menu-width').val()) || 160;
        
        // Update submenu position
        $('#adminmenu .wp-submenu').css({
            'top': spacing + 'px',
            'left': width + 'px'
        });
    },
    
    /**
     * Load Google Font dynamically
     */
    loadGoogleFont: function(fontName) {
        // Check if already loaded
        if ($('link[href*="' + fontName + '"]').length > 0) {
            $('#adminmenu').css('font-family', '"' + fontName + '", sans-serif');
            return;
        }
        
        // Create link element
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=' + 
                    fontName.replace(' ', '+') + ':wght@300;400;500;600;700&display=swap';
        
        link.onerror = function() {
            console.error('MASE: Failed to load Google Font:', fontName);
            MASE.showNotice('error', 'Failed to load font. Using fallback.');
            $('#adminmenu').css('font-family', 'system-ui, sans-serif');
        };
        
        link.onload = function() {
            $('#adminmenu').css('font-family', '"' + fontName + '", sans-serif');
        };
        
        document.head.appendChild(link);
    },
    
    /**
     * Update logo visibility
     */
    updateLogoVisibility: function(e) {
        const enabled = $(e.target).is(':checked');
        
        if (enabled) {
            $('.mase-menu-logo').show();
        } else {
            $('.mase-menu-logo').hide();
        }
    }
}
```

#### Live Preview Best Practices

1. **Bind Context**: Always use `.bind(this)` for event handlers
2. **Debounce Sliders**: Use debounce for rapid input changes
3. **Error Handling**: Wrap updates in try-catch blocks
4. **Recalculation**: Update dependent values (e.g., submenu position when width changes)
5. **Performance**: Use CSS transforms for animations
6. **Fallbacks**: Provide fallback values for missing settings


### Logo Upload Process

The logo upload system allows users to add custom branding to the admin menu with security validation.

#### Upload Flow

```
User Selects File → JavaScript Handler → AJAX Request → PHP Validation → 
WordPress Media Upload → URL Storage → Preview Update
```

#### JavaScript Implementation

```javascript
// Location: assets/js/mase-admin.js
$('#admin-menu-logo-upload').on('change', function(e) {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Client-side validation
    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
        MASE.showNotice('error', 'Only PNG, JPG, and SVG files are allowed.');
        return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB
        MASE.showNotice('error', 'File size must be less than 2MB.');
        return;
    }
    
    // Create FormData
    const formData = new FormData();
    formData.append('action', 'mase_upload_menu_logo');
    formData.append('nonce', MASE.config.nonce);
    formData.append('logo', file);
    
    // Show loading state
    MASE.showNotice('info', 'Uploading logo...');
    
    // Upload via AJAX
    $.ajax({
        url: MASE.config.ajaxUrl,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            if (response.success) {
                // Update preview
                $('.mase-menu-logo img').attr('src', response.data.url);
                $('.mase-menu-logo').show();
                
                // Store URL in hidden input
                $('#admin-menu-logo-url').val(response.data.url);
                
                MASE.showNotice('success', 'Logo uploaded successfully.');
            } else {
                MASE.showNotice('error', response.data.message || 'Upload failed.');
            }
        },
        error: function() {
            MASE.showNotice('error', 'Upload failed. Please try again.');
        }
    });
});
```

#### PHP Implementation

```php
// Location: includes/class-mase-admin.php

/**
 * Register AJAX handler for logo upload
 */
public function register_ajax_handlers() {
    add_action('wp_ajax_mase_upload_menu_logo', [$this, 'handle_logo_upload']);
}

/**
 * Handle logo upload with security validation
 */
public function handle_logo_upload() {
    // Verify nonce
    check_ajax_referer('wp_rest', 'nonce');
    
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        wp_send_json_error([
            'message' => __('Insufficient permissions.', 'modern-admin-styler')
        ], 403);
    }
    
    // Check if file was uploaded
    if (empty($_FILES['logo'])) {
        wp_send_json_error([
            'message' => __('No file uploaded.', 'modern-admin-styler')
        ], 400);
    }
    
    $file = $_FILES['logo'];
    
    // Validate file type
    $allowed_types = ['image/png', 'image/jpeg', 'image/svg+xml'];
    $file_type = wp_check_filetype($file['name']);
    
    if (!in_array($file_type['type'], $allowed_types)) {
        wp_send_json_error([
            'message' => __('Only PNG, JPG, and SVG files are allowed.', 'modern-admin-styler')
        ], 400);
    }
    
    // Validate file size (2MB max)
    if ($file['size'] > 2 * 1024 * 1024) {
        wp_send_json_error([
            'message' => __('File size must be less than 2MB.', 'modern-admin-styler')
        ], 400);
    }
    
    // Sanitize SVG content if SVG file
    if ($file_type['type'] === 'image/svg+xml') {
        $svg_content = file_get_contents($file['tmp_name']);
        $svg_content = $this->sanitize_svg($svg_content);
        file_put_contents($file['tmp_name'], $svg_content);
    }
    
    // Upload file using WordPress media handling
    require_once(ABSPATH . 'wp-admin/includes/file.php');
    require_once(ABSPATH . 'wp-admin/includes/media.php');
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    
    $upload = wp_handle_upload($file, ['test_form' => false]);
    
    if (isset($upload['error'])) {
        wp_send_json_error([
            'message' => $upload['error']
        ], 500);
    }
    
    // Return success with URL
    wp_send_json_success([
        'url' => $upload['url'],
        'file' => $upload['file']
    ]);
}

/**
 * Sanitize SVG content to prevent XSS
 */
private function sanitize_svg($svg_content) {
    // Remove script tags
    $svg_content = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $svg_content);
    
    // Remove event handlers
    $svg_content = preg_replace('/\s*on\w+\s*=\s*["\'][^"\']*["\']/i', '', $svg_content);
    
    // Remove javascript: protocol
    $svg_content = preg_replace('/javascript:/i', '', $svg_content);
    
    // Remove data: protocol (except for images)
    $svg_content = preg_replace('/data:(?!image)/i', '', $svg_content);
    
    return $svg_content;
}
```

#### Security Considerations

1. **Nonce Verification**: Always verify nonce before processing
2. **Capability Check**: Ensure user has `manage_options` capability
3. **File Type Validation**: Whitelist allowed MIME types
4. **File Size Validation**: Enforce maximum file size
5. **SVG Sanitization**: Remove scripts and event handlers from SVG
6. **WordPress Media Handling**: Use WordPress functions for secure upload
7. **Error Handling**: Provide clear error messages without exposing system details

#### Testing Logo Upload

```javascript
// Unit test for client-side validation
describe('Logo Upload', () => {
  it('should reject files larger than 2MB', () => {
    const file = new File(['x'.repeat(3 * 1024 * 1024)], 'large.png', {
      type: 'image/png'
    });
    
    const result = validateLogoFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('2MB');
  });
  
  it('should accept valid PNG files', () => {
    const file = new File(['data'], 'logo.png', {
      type: 'image/png'
    });
    
    const result = validateLogoFile(file);
    expect(result.valid).toBe(true);
  });
});
```

```php
// Integration test for PHP upload handler
class Test_Logo_Upload extends WP_UnitTestCase {
    public function test_upload_requires_authentication() {
        wp_set_current_user(0); // Not logged in
        
        $response = $this->admin->handle_logo_upload();
        
        $this->assertInstanceOf('WP_Error', $response);
        $this->assertEquals(403, $response->get_error_code());
    }
    
    public function test_upload_validates_file_type() {
        wp_set_current_user(1); // Admin user
        
        $_FILES['logo'] = [
            'name' => 'test.txt',
            'type' => 'text/plain',
            'tmp_name' => '/tmp/test.txt',
            'size' => 1024
        ];
        
        $response = $this->admin->handle_logo_upload();
        
        $this->assertFalse($response['success']);
        $this->assertStringContainsString('PNG, JPG, and SVG', $response['data']['message']);
    }
}
```

### Adding New Admin Menu Features

To add a new customization feature to the admin menu:

1. **Add Setting to Data Structure**:
```php
// includes/class-mase-settings.php
$defaults['admin_menu']['my_new_setting'] = 'default_value';
```

2. **Add UI Control**:
```php
// includes/admin-settings-page.php
<div class="mase-control">
    <label for="admin-menu-my-setting">My New Setting</label>
    <input type="text" 
           id="admin-menu-my-setting" 
           name="mase_settings[admin_menu][my_new_setting]"
           value="<?php echo esc_attr($settings['admin_menu']['my_new_setting']); ?>">
</div>
```

3. **Add CSS Generation Method**:
```php
// includes/class-mase-css-generator.php
private function generate_my_new_setting_css($menu) {
    $value = $menu['my_new_setting'] ?? 'default_value';
    
    return "#adminmenu {
        my-property: {$value};
    }";
}
```

4. **Add Live Preview Handler**:
```javascript
// assets/js/mase-admin.js
$('#admin-menu-my-setting').on('change', function(e) {
    const value = $(e.target).val();
    $('#adminmenu').css('my-property', value);
});
```

5. **Add Validation**:
```php
// includes/class-mase-settings.php
if (isset($input['admin_menu']['my_new_setting'])) {
    $sanitized['admin_menu']['my_new_setting'] = 
        sanitize_text_field($input['admin_menu']['my_new_setting']);
}
```

6. **Write Tests**:
```php
// tests/unit/test-css-generator.php
public function test_my_new_setting_css_generation() {
    $settings = ['admin_menu' => ['my_new_setting' => 'test_value']];
    $css = $this->generator->generate_admin_menu_css($settings);
    $this->assertStringContainsString('my-property: test_value', $css);
}
```

## Additional Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Migration Guide](./MIGRATION-GUIDE.md)
- [Testing Guide](../tests/README.md)
- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
