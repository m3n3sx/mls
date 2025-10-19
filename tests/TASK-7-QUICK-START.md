# Task 7: Apply Button Functionality - Quick Start Guide

## Quick Test (5 minutes)

### 1. Open the Test File
```bash
# From project root
open tests/test-task-7-apply-button-functionality.html
```

### 2. Test Subtask 7.1: Confirmation Dialog
1. Click the "Apply" button on "Professional Blue" template
2. Verify the confirmation dialog shows:
   - Template name: "Professional Blue"
   - Affected settings: Color scheme, Typography, Visual effects
   - Warning: "This action cannot be undone"
3. Click "Cancel" - operation should abort
4. Check all 6 items in the verification checklist

### 3. Test Subtask 7.2: Successful Application
1. Click the "Apply" button on "Modern Dark" template
2. Click "OK" to confirm
3. Verify:
   - Button becomes disabled and shows "Applying..."
   - Card opacity reduces to 0.6
   - Success notification appears
   - Console shows "Page would reload in 1 second"
4. Check all 6 items in the verification checklist

### 4. Test Subtask 7.3: Error Handling
1. Check the "Simulate Network Error" checkbox
2. Select "500 Server Error" radio button
3. Click the "Apply" button on "Minimal Light" template
4. Click "OK" to confirm
5. Verify:
   - Error notification appears: "Server error. Please try again later."
   - Button returns to enabled state with "Apply" text
   - Card opacity returns to 1
   - Error logged to console
6. Check all 6 items in the verification checklist

### 5. Export Results
1. Click "Export Test Results" button
2. Save the JSON file
3. Review the pass rate (should be 100%)

## Expected Results

All 18 verification items should pass:
- Subtask 7.1: 6/6 ✓
- Subtask 7.2: 6/6 ✓
- Subtask 7.3: 6/6 ✓

**Total: 18/18 (100%)**

## Troubleshooting

### Issue: Confirmation dialog doesn't appear
**Solution:** Check browser console for JavaScript errors. Ensure jQuery is loaded.

### Issue: AJAX request fails
**Solution:** This is expected in standalone testing. The test uses mocked responses.

### Issue: Page actually reloads
**Solution:** The test disables page reload for testing. Check the console log instead.

## Next Steps

After completing Task 7:
1. Mark task 7 as complete in tasks.md
2. Proceed to Task 8: Test gallery layout and responsiveness
3. Continue with remaining tasks

## Requirements Verified

- ✓ 2.1: AJAX request timing
- ✓ 2.2: Confirmation dialog
- ✓ 2.3: Success notification
- ✓ 2.4: Template application
- ✓ 2.5: Error handling
- ✓ 6.1: Confirmation content
- ✓ 6.2: Irreversibility warning
- ✓ 6.3: Affected settings list
- ✓ 8.1: Button disable
- ✓ 8.2: Loading state
- ✓ 8.3: Console logging
- ✓ 10.5: Error messages
