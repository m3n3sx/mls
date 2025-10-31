# MD3 Performance Testing

Performance testing suite for Material Design 3 animations and optimizations.

## Overview

This directory contains tools for testing and monitoring the performance of MD3 animations, ensuring they maintain 60fps and meet performance requirements.

## Test Files

### 1. `md3-fps-monitor.html`

**Browser-based FPS monitor** - Open directly in a browser to test animations in real-time.

**Features:**
- Real-time FPS display
- Min/Max/Average FPS tracking
- Memory usage monitoring
- Interactive test scenarios
- Visual test results

**Usage:**
```bash
# Open in browser
open tests/performance/md3-fps-monitor.html
```

**Test Scenarios:**
- Template card hover animations
- Button ripple effects
- Toggle switch interactions
- Mass animation stress test

**Thresholds:**
- Target FPS: 60
- Minimum acceptable FPS: 55
- Maximum memory: 100 MB

### 2. `md3-performance-test.cjs`

**Automated performance testing** using Puppeteer and Lighthouse.

**Features:**
- Automated FPS measurement for all animation scenarios
- Lighthouse performance audit
- Memory profiling
- Layout thrashing detection
- JSON results export

**Requirements:**
```bash
npm install puppeteer lighthouse
```

**Usage:**
```bash
# Set WordPress admin URL (optional)
export WP_ADMIN_URL="http://localhost:8080/wp-admin/admin.php?page=modern-admin-styler"

# Run tests
node tests/performance/md3-performance-test.cjs
```

**Results:**
- Console output with pass/fail indicators
- JSON results saved to `tests/performance-results/md3-performance-results.json`

### 3. `css-animation-performance.html`

**CSS animation profiling** - Tests specific CSS animations in isolation.

## Performance Requirements

Based on Task 16 requirements (22.1, 22.2, 22.3, 22.4, 22.5):

### Animation FPS (Requirement 22.1)
- **Target:** 60 FPS
- **Minimum:** 55 FPS
- **Test:** All animation scenarios must maintain minimum FPS

### GPU Acceleration (Requirement 22.2, 22.3)
- Use `transform` and `opacity` for animations
- Apply `translateZ(0)` for GPU layers
- Avoid animating layout properties (width, height, top, left)

### Will-Change Management (Requirement 22.1, 22.4)
- Add `will-change` before animations
- Remove `will-change` after animations complete
- Only use for properties that will actually change

### RequestAnimationFrame (Requirement 22.2)
- Use RAF for JavaScript animations
- Maintain 60fps performance
- Profile animation performance

### Memory Usage (Requirement 22.5)
- **Maximum:** 100 MB JS heap
- Monitor for memory leaks
- Clean up after animations

### Lighthouse Performance (Requirement 22.1)
- **Target Score:** 90+
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.8s
- Total Blocking Time: < 200ms

## Implementation Files

### CSS Performance Optimization
- `assets/css/mase-md3-performance.css` - GPU acceleration and will-change management

### JavaScript Performance Optimization
- `assets/js/mase-md3-motion.js` - RAF-based animations and performance monitoring

## Running Tests

### Quick Browser Test
1. Open `md3-fps-monitor.html` in browser
2. Click "Run All Tests"
3. Review FPS results

### Full Automated Test
1. Ensure WordPress is running
2. Set `WP_ADMIN_URL` environment variable
3. Run `node tests/performance/md3-performance-test.cjs`
4. Review console output and JSON results

### Manual Testing
1. Navigate to WordPress admin settings page
2. Open browser DevTools Performance tab
3. Start recording
4. Interact with animations (hover cards, click buttons, etc.)
5. Stop recording and analyze:
   - FPS should be 60fps
   - No layout thrashing
   - Smooth animation curves

## Performance Optimization Techniques

### 1. GPU Acceleration
```css
.animated-element {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
}
```

### 2. Will-Change Management
```javascript
// Before animation
element.style.willChange = 'transform, opacity';

// After animation completes
setTimeout(() => {
    element.style.willChange = 'auto';
}, 300);
```

### 3. RequestAnimationFrame
```javascript
function animate() {
    // Update animation
    element.style.transform = `translateY(${progress}px)`;
    
    if (progress < 100) {
        requestAnimationFrame(animate);
    }
}
requestAnimationFrame(animate);
```

### 4. Batch DOM Operations
```javascript
// Read all values first
const heights = elements.map(el => el.offsetHeight);

// Then write all values
requestAnimationFrame(() => {
    elements.forEach((el, i) => {
        el.style.height = heights[i] + 'px';
    });
});
```

## Troubleshooting

### Low FPS
- Check for layout thrashing (read/write DOM in same frame)
- Verify GPU acceleration is applied
- Check for expensive CSS properties (box-shadow, filter)
- Profile with DevTools Performance tab

### High Memory Usage
- Check for memory leaks (event listeners not removed)
- Verify will-change is removed after animations
- Check for orphaned DOM elements

### Janky Animations
- Use transform instead of position properties
- Use opacity instead of visibility
- Avoid animating width/height
- Check for forced synchronous layouts

## Best Practices

1. **Always use transform and opacity** for animations
2. **Add will-change before** animations start
3. **Remove will-change after** animations complete
4. **Use requestAnimationFrame** for JavaScript animations
5. **Batch DOM reads and writes** to avoid layout thrashing
6. **Profile regularly** to catch performance regressions
7. **Test on low-end devices** to ensure broad compatibility
8. **Respect prefers-reduced-motion** for accessibility

## References

- [Material Design 3 Motion](https://m3.material.io/styles/motion/overview)
- [Web Performance Best Practices](https://web.dev/performance/)
- [CSS GPU Animation](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)
- [RequestAnimationFrame Guide](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
