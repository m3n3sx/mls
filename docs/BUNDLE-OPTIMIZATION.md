# Bundle Optimization Guide

Task 18.3: Optimize bundle sizes
Requirement 12.5: Minimize bundle sizes to meet <100KB target

## Bundle Size Targets

The MASE plugin has the following bundle size targets to ensure fast loading:

| Bundle | Target Size | Purpose |
|--------|-------------|---------|
| Core | < 30KB | State Manager, Event Bus, API Client |
| Preview | < 40KB | Preview Engine and CSS generation |
| Color | < 30KB | Color System and accessibility |
| Typography | < 30KB | Font loading and text scaling |
| Animations | < 20KB | Visual effects and micro-interactions |
| Managers | < 25KB | Palette and Template Managers |
| Utils | < 15KB | Feature flags and Event Adapter |
| Vendor (Zustand) | < 20KB | State management library |
| **Total** | **< 100KB** | **All bundles combined** |

## Code Splitting Strategy

### Manual Chunks

The Vite configuration uses manual chunks to split code optimally:

```javascript
manualChunks(id) {
  // Vendor dependencies
  if (id.includes('node_modules')) {
    if (id.includes('zustand')) return 'vendor-zustand';
    return 'vendor';
  }
  
  // Core modules (loaded immediately)
  if (id.includes('state-manager.js') || 
      id.includes('event-bus.js') || 
      id.includes('api-client.js')) {
    return 'core';
  }
  
  // Feature modules (lazy loaded)
  if (id.includes('preview-engine.js')) return 'preview';
  if (id.includes('color-system.js')) return 'color';
  if (id.includes('typography.js')) return 'typography';
  if (id.includes('animations.js')) return 'animations';
  
  // Managers
  if (id.includes('palette-manager.js') || 
      id.includes('template-manager.js')) {
    return 'managers';
  }
  
  // Utilities
  if (id.includes('feature-flags.js') || 
      id.includes('event-adapter.js')) {
    return 'utils';
  }
}
```

### Lazy Loading

Feature modules are lazy loaded on demand to reduce initial bundle size:

- **Color System**: Loaded when color tab is clicked
- **Typography**: Loaded when typography tab is clicked
- **Animations**: Loaded when effects tab is clicked
- **Template Manager**: Loaded when templates tab is clicked

This reduces the initial JavaScript payload by ~60KB.

## Optimization Techniques

### 1. Tree Shaking

Vite automatically removes unused code through tree shaking. To ensure it works:

- Use ES6 module syntax (`import`/`export`)
- Avoid side effects in module initialization
- Mark side-effect-free packages in `package.json`

### 2. Minification

Production builds use Terser with aggressive compression:

```javascript
terserOptions: {
  compress: {
    drop_console: true,
    drop_debugger: true,
    passes: 2,
    pure_funcs: ['console.log', 'console.debug'],
    pure_getters: true,
  },
  mangle: {
    safari10: true,
  },
  format: {
    comments: false,
  },
}
```

### 3. Code Splitting

- **Vendor splitting**: Third-party dependencies in separate chunks
- **Feature splitting**: Each feature module in its own chunk
- **Dynamic imports**: Lazy load modules with `import()`

### 4. Bundle Analysis

Use the bundle analyzer to identify optimization opportunities:

```bash
npm run analyze
```

This generates an interactive visualization showing:
- Bundle composition
- Module sizes
- Duplicate dependencies
- Optimization opportunities

## Checking Bundle Sizes

### Automated Check

Run the bundle size checker after building:

```bash
npm run build:check
```

This will:
1. Build the production bundles
2. Check each bundle against its target
3. Report any bundles exceeding targets
4. Provide optimization recommendations

### Manual Check

Check bundle sizes manually:

```bash
npm run build
npm run check-size
```

## Optimization Workflow

1. **Build and analyze**:
   ```bash
   npm run analyze
   ```

2. **Identify large modules**:
   - Look for unexpectedly large chunks
   - Check for duplicate dependencies
   - Find unused code

3. **Optimize**:
   - Move large dependencies to separate chunks
   - Lazy load non-critical modules
   - Remove unused imports
   - Use lighter alternatives for heavy libraries

4. **Verify**:
   ```bash
   npm run build:check
   ```

5. **Test**:
   - Ensure functionality still works
   - Check loading performance
   - Verify lazy loading works correctly

## Common Issues

### Bundle Too Large

**Symptoms**: Bundle exceeds target size

**Solutions**:
1. Check for duplicate dependencies across chunks
2. Lazy load the module if not needed immediately
3. Split large modules into smaller pieces
4. Remove unused code and imports
5. Use lighter alternatives for heavy dependencies

### Duplicate Dependencies

**Symptoms**: Same code appears in multiple chunks

**Solutions**:
1. Adjust `manualChunks` configuration
2. Move shared code to a common chunk
3. Use Vite's automatic chunk splitting

### Lazy Loading Not Working

**Symptoms**: Modules load immediately instead of on demand

**Solutions**:
1. Verify dynamic `import()` syntax is used
2. Check that modules aren't imported statically
3. Ensure tab listeners are attached correctly
4. Check browser console for errors

## Performance Targets

The bundle optimization aims to meet these performance targets:

- **Initial load**: < 200ms on 3G connection (Requirement 12.1)
- **Preview update**: < 50ms (Requirement 12.2)
- **Lighthouse score**: 90+ (Requirement 12.4)
- **Total bundle size**: < 100KB (Requirement 12.5)

## Monitoring

### Development

During development, Vite shows bundle sizes in the terminal:

```
vite v5.0.10 building for production...
✓ 45 modules transformed.
dist/main-admin.js      28.5 kB │ gzip: 9.2 kB
dist/chunks/core.js     25.3 kB │ gzip: 8.1 kB
dist/chunks/preview.js  38.7 kB │ gzip: 12.4 kB
...
```

### CI/CD

Add bundle size checks to your CI/CD pipeline:

```yaml
- name: Check bundle sizes
  run: npm run build:check
```

This will fail the build if bundles exceed targets.

## Best Practices

1. **Keep modules focused**: Each module should have a single responsibility
2. **Avoid circular dependencies**: They prevent effective tree shaking
3. **Use dynamic imports**: For code that's not needed immediately
4. **Monitor bundle sizes**: Check after every significant change
5. **Profile in production**: Test with production builds, not development
6. **Measure real impact**: Use Lighthouse and real device testing

## Resources

- [Vite Code Splitting](https://vitejs.dev/guide/build.html#chunking-strategy)
- [Rollup Manual Chunks](https://rollupjs.org/configuration-options/#output-manualchunks)
- [Web.dev Bundle Size](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [Lighthouse Performance](https://developer.chrome.com/docs/lighthouse/performance/)
