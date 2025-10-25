# CSS Generation Test Suite

## Overview

This test suite validates the CSS generation logic from the legacy `mase-admin.js` file. These tests serve as regression tests to ensure the new Preview Engine module maintains identical functionality during the modern architecture refactor.

## Files

- **tests/unit/css-generation.test.js** - Complete test suite with 30+ test cases
- **docs/CSS-GENERATION-ANALYSIS.md** - Detailed documentation of CSS generation logic

## Running Tests

```bash
# Run all CSS generation tests
npm test tests/unit/css-generation.test.js

# Run with watch mode
npm run test:watch tests/unit/css-generation.test.js

# Run with coverage
npm run test:coverage tests/unit/css-generation.test.js
```

## Test Coverage

### Shadow Calculator (5 tests)
- ✓ Returns "none" for no shadow
- ✓ Calculates subtle bottom shadow
- ✓ Calculates medium right shadow
- ✓ Calculates strong top shadow
- ✓ Uses default values when not provided

### Admin Bar CSS (4 tests)
- ✓ Generates default admin bar CSS
- ✓ Generates glassmorphism effect CSS
- ✓ Generates floating admin bar CSS
- ✓ Disables glassmorphism when turned off

### Admin Menu CSS (4 tests)
- ✓ Generates default admin menu CSS
- ✓ Generates custom width CSS
- ✓ Generates content height mode CSS
- ✓ Generates hover state CSS

### Typography CSS (3 tests)
- ✓ Generates admin bar typography CSS
- ✓ Generates admin menu typography CSS
- ✓ Generates content typography CSS

### Visual Effects CSS (2 tests)
- ✓ Generates border radius CSS
- ✓ Generates box shadow CSS

### Complete Integration (3 tests)
- ✓ Generates complete CSS from all settings
- ✓ Handles empty settings gracefully
- ✓ Handles partial settings

### Performance (1 test)
- ✓ Generates CSS within 50ms (Requirement 3.1)

## Test Data Examples

### Default Settings
```javascript
{
    admin_bar: {
        bg_color: '#23282d',
        text_color: '#ffffff',
        height: 32
    },
    admin_menu: {
        bg_color: '#23282d',
        text_color: '#ffffff',
        width: 160
    }
}
```

### Glassmorphism Effect
```javascript
{
    visual_effects: {
        admin_bar: {
            glassmorphism: true,
            blur_intensity: 20
        }
    }
}
```

### Floating Admin Bar
```javascript
{
    visual_effects: {
        admin_bar: {
            floating: true,
            floating_margin: 8,
            border_radius: 8
        }
    }
}
```

## Expected CSS Output Examples

### Default Admin Bar
```css
body.wp-admin #wpadminbar{
    position:fixed!important;
    top:0!important;
    left:0!important;
    right:0!important;
    z-index:99999!important;
    background-color:#23282d!important;
    height:32px!important;
}
html.wp-toolbar{
    padding-top:32px!important;
}
```

### Glassmorphism Effect
```css
body.wp-admin #wpadminbar{
    backdrop-filter:blur(20px)!important;
    -webkit-backdrop-filter:blur(20px)!important;
    background-color:rgba(35,40,45,0.8)!important;
}
```

### Custom Menu Width
```css
body.wp-admin:not(.folded) #adminmenu{
    width:200px!important;
}
body.wp-admin:not(.folded) #wpcontent{
    margin-left:200px!important;
}
```

## Migration Checklist

When implementing the new Preview Engine module, ensure:

- [ ] All test cases pass with identical CSS output
- [ ] Performance requirement (<50ms) is met
- [ ] Side effects (body padding, content margin) are preserved
- [ ] Conditional logic (glassmorphism, floating) works identically
- [ ] Default values match legacy implementation
- [ ] CSS selectors are unchanged
- [ ] !important declarations are maintained

## Requirements Mapping

- **Requirement 3.1**: CSS generation within 50ms (tested in performance suite)
- **Requirement 3.2**: Generate CSS from settings (tested in all suites)
- **Requirement 11.1**: Unit test coverage (30+ tests)
- **Requirement 11.4**: Regression testing (all expected outputs captured)

## Next Steps

1. Implement Preview Engine module (`assets/js/modules/preview-engine.js`)
2. Run this test suite against new implementation
3. Fix any discrepancies in CSS output
4. Add additional tests for edge cases discovered during migration
5. Update tests if intentional improvements are made to CSS generation

## Notes

- Tests use pure JavaScript functions (no DOM dependencies)
- All CSS generation logic is replicated from `mase-admin.js:820-1425`
- Tests capture exact CSS output including whitespace and !important declarations
- Performance test uses `performance.now()` for accurate timing
