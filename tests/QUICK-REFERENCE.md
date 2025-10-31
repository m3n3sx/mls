# QA Testing Quick Reference

## Quick Commands

```bash
# Run all QA tests
npm run test:qa

# Individual test suites
npm run test:qa:visual          # Visual regression
npm run test:qa:cross-browser   # Cross-browser compatibility
npm run test:qa:mobile          # Mobile devices
npm run test:qa:performance     # Performance metrics
npm run test:qa:accessibility   # Accessibility compliance

# Browser-specific
npm run test:qa:chrome          # Chrome only
npm run test:qa:firefox         # Firefox only
npm run test:qa:safari          # Safari only

# View results
npx playwright show-report
```

## Test Coverage

| Suite | Tests | Coverage |
|-------|-------|----------|
| Visual Regression | 7 | All themes, variants, intensities |
| Cross-Browser | 15 | Chrome, Firefox, Safari, Edge |
| Mobile Device | 14 | iOS, Android, tablets |
| Performance | 10 | FPS, memory, load times |
| Accessibility | 15 | WCAG 2.1 AA compliance |

## Expected Results

✅ **Visual Regression**
- All themes render correctly
- Variants maintain effects
- No visual regressions

✅ **Cross-Browser**
- Features work in all browsers
- Graceful degradation
- Consistent UX

✅ **Mobile Device**
- Responsive layouts
- Touch interactions work
- Optimized performance

✅ **Performance**
- 60 FPS maintained
- < 100MB memory
- < 3s load times

✅ **Accessibility**
- Zero violations
- WCAG 2.1 AA compliant
- Keyboard accessible

## Result Locations

```
tests/
├── screenshots/              # Visual regression
├── performance-results/      # Performance data
└── test-results/            # Test results

playwright-report/           # HTML report
```

## Troubleshooting

**WordPress not running:**
```bash
docker-compose up -d
```

**Browsers not installed:**
```bash
npx playwright install
```

**View detailed report:**
```bash
npx playwright show-report
```

## Performance Targets

| Metric | Target |
|--------|--------|
| FPS | 60 |
| Memory | < 50MB |
| Load Time | < 2s |
| CSS Size | < 30KB |
| JS Size | < 50KB |
| Lighthouse | > 90 |

## Accessibility Standards

- WCAG 2.1 Level AA
- Contrast ratio ≥ 4.5:1
- Focus visible (3px min)
- Keyboard accessible
- Screen reader compatible
