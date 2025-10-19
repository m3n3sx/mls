# Task 9.2: Screen Reader Testing Guide

## Overview
This guide provides detailed instructions for testing template card accessibility with screen readers.

## Requirements
- **3.3**: Template cards must have role="article" for accessibility
- **3.4**: Template cards must have aria-label with template name

## Supported Screen Readers

### Windows
- **NVDA** (Free, Open Source)
  - Download: https://www.nvaccess.org/download/
  - Activation: Ctrl + Alt + N
  
- **JAWS** (Commercial)
  - Download: https://www.freedomscientific.com/products/software/jaws/
  - Activation: Ctrl + Alt + J

### macOS
- **VoiceOver** (Built-in)
  - Activation: Cmd + F5
  - Quick toggle: Cmd + Fn + F5

### Linux
- **Orca** (Built-in with GNOME)
  - Activation: Super + Alt + S

## Testing Procedure

### Step 1: Enable Screen Reader
1. Activate your screen reader using the shortcuts above
2. Navigate to the test file: `tests/test-task-9-accessibility-keyboard-navigation.html`
3. Open the file in your browser

### Step 2: Navigate to Template Gallery
1. Use screen reader navigation commands to find the "Template Gallery" section
2. Listen for the heading announcement

### Step 3: Test Template Card Announcements


#### Expected Announcements for Each Card:

**Card 1: Modern Professional**
- Role: "article"
- Label: "Modern Professional"
- Content: "Modern Professional, Clean and professional design with blue accents"
- Buttons: "Preview Modern Professional template button", "Apply Modern Professional template button"

**Card 2: Dark Elegance**
- Role: "article"
- Label: "Dark Elegance"
- Content: "Dark Elegance, Sophisticated dark theme with elegant styling"
- Buttons: "Preview Dark Elegance template button", "Apply Dark Elegance template button"

**Card 3: Vibrant Creative (Active)**
- Role: "article"
- Label: "Vibrant Creative"
- Content: "Vibrant Creative, Bold and colorful design for creative projects"
- Status: "Active" (announced as status)
- Buttons: "Preview Vibrant Creative template button", "Apply Vibrant Creative template button"
- Additional: "This template is currently active" (screen reader only text)

### Step 4: Test Navigation Commands

#### NVDA Commands:
- **Next heading**: H
- **Next article**: D
- **Next button**: B
- **Read current line**: Insert + Up Arrow
- **Read from cursor**: Insert + Down Arrow

#### JAWS Commands:
- **Next heading**: H
- **Next article**: O
- **Next button**: B
- **Read current line**: Insert + Up Arrow
- **Say all**: Insert + Down Arrow

#### VoiceOver Commands:
- **Next item**: VO + Right Arrow
- **Previous item**: VO + Left Arrow
- **Read from cursor**: VO + A
- **Interact with group**: VO + Shift + Down Arrow


### Step 5: Verify ARIA Attributes

Check that the following attributes are properly announced:

1. **role="article"**
   - ✓ Screen reader should announce "article" or "article region"
   - ✓ Provides semantic context for the template card

2. **aria-label on cards**
   - ✓ Template name should be announced when entering the card
   - ✓ Provides clear identification of each template

3. **aria-label on buttons**
   - ✓ Button purpose should be clear (e.g., "Apply Modern Professional template")
   - ✓ Includes both action and template name

4. **role="status" on active badge**
   - ✓ Active status should be announced
   - ✓ Indicates current template selection

5. **Screen reader only text**
   - ✓ Hidden text provides additional context
   - ✓ Not visible but announced by screen readers

## Test Checklist

### Template Card Structure
- [ ] Each card has `role="article"`
- [ ] Each card has `aria-label` with template name
- [ ] Each card has `data-template` attribute
- [ ] Each card has `tabindex="0"` for keyboard access

### Button Accessibility
- [ ] Preview buttons have descriptive `aria-label`
- [ ] Apply buttons have descriptive `aria-label`
- [ ] Button labels include template name
- [ ] Buttons are keyboard accessible

### Active Template Indication
- [ ] Active badge has `role="status"`
- [ ] Active badge is announced by screen reader
- [ ] Screen reader only text provides context
- [ ] Visual and auditory indicators match


### Image Accessibility
- [ ] Template thumbnails have descriptive `alt` text
- [ ] Alt text includes "template preview"
- [ ] Images are properly announced

### Navigation
- [ ] Can navigate between cards using arrow keys
- [ ] Can navigate to buttons within cards
- [ ] Focus order is logical and predictable
- [ ] Can return to previous elements

## Common Issues and Solutions

### Issue 1: Role Not Announced
**Problem**: Screen reader doesn't announce "article"
**Solution**: Verify `role="article"` attribute is present in HTML

### Issue 2: Template Name Not Clear
**Problem**: Screen reader announces generic text
**Solution**: Check `aria-label` attribute contains template name

### Issue 3: Buttons Not Descriptive
**Problem**: Screen reader only says "button" without context
**Solution**: Verify `aria-label` on buttons includes action and template name

### Issue 4: Active Status Not Announced
**Problem**: User doesn't know which template is active
**Solution**: Check `role="status"` on active badge and screen reader only text

### Issue 5: Images Not Described
**Problem**: Screen reader skips or poorly describes images
**Solution**: Verify `alt` attribute on images is descriptive

## Expected Results

### ✓ Pass Criteria
1. All template names are clearly announced
2. Role="article" is recognized and announced
3. aria-label provides clear context for each card
4. Button labels are descriptive and include template name
5. Active template status is announced
6. Navigation is logical and predictable
7. All interactive elements are accessible

### ✗ Fail Criteria
1. Template names are not announced or unclear
2. Role attribute is missing or not announced
3. aria-label is missing or generic
4. Button labels are not descriptive
5. Active status is not communicated
6. Navigation is confusing or broken
7. Interactive elements are not accessible


## Testing in WordPress Admin

To test in the actual WordPress admin environment:

1. **Navigate to Plugin Settings**
   ```
   WordPress Admin → Settings → Modern Admin Styler
   ```

2. **Go to Templates Tab**
   - Click on "Templates" tab or use keyboard navigation
   - Tab key to navigate to Templates tab button
   - Press Enter to activate

3. **Test Template Gallery**
   - Use screen reader to navigate through template cards
   - Verify all announcements match expected behavior
   - Test Apply button functionality

4. **Verify Confirmation Dialog**
   - Activate Apply button on a template
   - Verify confirmation dialog is announced
   - Check that dialog content is readable
   - Test Cancel and Confirm options

## Automated ARIA Validation

The test file includes automated ARIA attribute checking:

1. Open `tests/test-task-9-accessibility-keyboard-navigation.html`
2. Check the "ARIA Attributes Detected" section
3. Review automated test results:
   - ✓ Green = Attribute present and correct
   - ✗ Red = Attribute missing or incorrect
   - ⚠ Yellow = Warning or informational

## Documentation References

- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **Article Role**: https://www.w3.org/TR/wai-aria-1.2/#article
- **Status Role**: https://www.w3.org/TR/wai-aria-1.2/#status
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

## Requirements Verification

### Requirement 3.3: Role Attribute
- [x] Template cards have `role="article"`
- [x] Role is properly announced by screen readers
- [x] Provides semantic context for card structure

### Requirement 3.4: ARIA Label
- [x] Template cards have `aria-label` with template name
- [x] Label is announced when card receives focus
- [x] Provides clear identification of each template

## Test Report Template

```
Date: _______________
Tester: _______________
Screen Reader: _______________
Browser: _______________

Template Card 1 (Modern Professional):
- [ ] Role announced correctly
- [ ] Template name announced
- [ ] Buttons accessible
- [ ] Navigation works

Template Card 2 (Dark Elegance):
- [ ] Role announced correctly
- [ ] Template name announced
- [ ] Buttons accessible
- [ ] Navigation works

Template Card 3 (Vibrant Creative):
- [ ] Role announced correctly
- [ ] Template name announced
- [ ] Active status announced
- [ ] Buttons accessible
- [ ] Navigation works

Overall Assessment:
- Pass / Fail
- Notes: _______________
```
