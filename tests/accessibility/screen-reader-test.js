/**
 * Screen Reader Compatibility Test
 * 
 * Verifies that visual changes don't break screen reader functionality:
 * - Semantic HTML structure is maintained
 * - ARIA labels are preserved
 * - Form controls have proper labels
 * - Headings create logical document outline
 * - Images have alt text
 * - Interactive elements have accessible names
 * 
 * Requirements: 11.3
 */

const { chromium } = require('playwright');

/**
 * Check semantic HTML structure
 * @param {object} page - Playwright page object
 * @returns {object} Results of semantic structure check
 */
async function checkSemanticStructure(page) {
  return await page.evaluate(() => {
    const results = {
      passed: true,
      issues: []
    };
    
    // Check for proper heading hierarchy
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      
      // Check if heading skips levels (e.g., h1 to h3)
      if (level > previousLevel + 1 && previousLevel !== 0) {
        results.passed = false;
        results.issues.push({
          type: 'heading-skip',
          element: heading.tagName,
          text: heading.textContent.trim().substring(0, 50),
          message: `Heading skips from h${previousLevel} to h${level}`
        });
      }
      
      previousLevel = level;
    });
    
    // Check for landmark regions
    const landmarks = {
      header: document.querySelectorAll('header, [role="banner"]').length,
      nav: document.querySelectorAll('nav, [role="navigation"]').length,
      main: document.querySelectorAll('main, [role="main"]').length,
      footer: document.querySelectorAll('footer, [role="contentinfo"]').length
    };
    
    // Check for proper form structure
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
      // Check if form has accessible name
      if (!form.getAttribute('aria-label') && !form.getAttribute('aria-labelledby')) {
        const legend = form.querySelector('legend');
        if (!legend) {
          results.issues.push({
            type: 'form-no-label',
            element: 'form',
            message: `Form ${index + 1} has no accessible name`
          });
        }
      }
    });
    
    // Check for proper button labels
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
      const hasText = button.textContent.trim().length > 0;
      const hasAriaLabel = button.getAttribute('aria-label');
      const hasAriaLabelledby = button.getAttribute('aria-labelledby');
      const hasTitle = button.getAttribute('title');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
        results.passed = false;
        results.issues.push({
          type: 'button-no-label',
          element: 'button',
          className: button.className,
          message: `Button has no accessible name`
        });
      }
    });
    
    // Check for proper link labels
    const links = document.querySelectorAll('a[href]');
    links.forEach((link, index) => {
      const hasText = link.textContent.trim().length > 0;
      const hasAriaLabel = link.getAttribute('aria-label');
      const hasAriaLabelledby = link.getAttribute('aria-labelledby');
      const hasTitle = link.getAttribute('title');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
        results.passed = false;
        results.issues.push({
          type: 'link-no-label',
          element: 'a',
          href: link.getAttribute('href'),
          message: `Link has no accessible name`
        });
      }
    });
    
    return results;
  });
}

/**
 * Check form labels
 * @param {object} page - Playwright page object
 * @returns {object} Results of form label check
 */
async function checkFormLabels(page) {
  return await page.evaluate(() => {
    const results = {
      passed: true,
      issues: [],
      totalInputs: 0,
      labeledInputs: 0
    };
    
    // Check all form inputs
    const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
    results.totalInputs = inputs.length;
    
    inputs.forEach((input, index) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');
      const title = input.getAttribute('title');
      
      // Check for associated label
      let hasLabel = false;
      
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) {
          hasLabel = true;
        }
      }
      
      // Check for aria-label or aria-labelledby
      if (ariaLabel || ariaLabelledby || title) {
        hasLabel = true;
      }
      
      // Check if input is wrapped in label
      const parentLabel = input.closest('label');
      if (parentLabel) {
        hasLabel = true;
      }
      
      if (hasLabel) {
        results.labeledInputs++;
      } else {
        results.passed = false;
        results.issues.push({
          type: 'input-no-label',
          element: input.tagName.toLowerCase(),
          inputType: input.type || 'text',
          name: input.name || 'unnamed',
          message: `Input has no associated label`
        });
      }
    });
    
    return results;
  });
}

/**
 * Check ARIA attributes
 * @param {object} page - Playwright page object
 * @returns {object} Results of ARIA check
 */
async function checkARIA(page) {
  return await page.evaluate(() => {
    const results = {
      passed: true,
      issues: [],
      ariaElements: 0
    };
    
    // Check for proper ARIA usage
    const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');
    results.ariaElements = ariaElements.length;
    
    ariaElements.forEach((element) => {
      // Check aria-labelledby references
      const labelledby = element.getAttribute('aria-labelledby');
      if (labelledby) {
        const ids = labelledby.split(' ');
        ids.forEach(id => {
          if (!document.getElementById(id)) {
            results.passed = false;
            results.issues.push({
              type: 'aria-labelledby-invalid',
              element: element.tagName.toLowerCase(),
              id: id,
              message: `aria-labelledby references non-existent ID: ${id}`
            });
          }
        });
      }
      
      // Check aria-describedby references
      const describedby = element.getAttribute('aria-describedby');
      if (describedby) {
        const ids = describedby.split(' ');
        ids.forEach(id => {
          if (!document.getElementById(id)) {
            results.passed = false;
            results.issues.push({
              type: 'aria-describedby-invalid',
              element: element.tagName.toLowerCase(),
              id: id,
              message: `aria-describedby references non-existent ID: ${id}`
            });
          }
        });
      }
      
      // Check for valid ARIA roles
      const role = element.getAttribute('role');
      if (role) {
        const validRoles = [
          'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
          'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo',
          'definition', 'dialog', 'directory', 'document', 'feed', 'figure',
          'form', 'grid', 'gridcell', 'group', 'heading', 'img', 'link', 'list',
          'listbox', 'listitem', 'log', 'main', 'marquee', 'math', 'menu',
          'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'navigation',
          'none', 'note', 'option', 'presentation', 'progressbar', 'radio',
          'radiogroup', 'region', 'row', 'rowgroup', 'rowheader', 'scrollbar',
          'search', 'searchbox', 'separator', 'slider', 'spinbutton', 'status',
          'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term', 'textbox',
          'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem'
        ];
        
        if (!validRoles.includes(role)) {
          results.passed = false;
          results.issues.push({
            type: 'invalid-aria-role',
            element: element.tagName.toLowerCase(),
            role: role,
            message: `Invalid ARIA role: ${role}`
          });
        }
      }
    });
    
    return results;
  });
}

/**
 * Check images for alt text
 * @param {object} page - Playwright page object
 * @returns {object} Results of image alt text check
 */
async function checkImageAltText(page) {
  return await page.evaluate(() => {
    const results = {
      passed: true,
      issues: [],
      totalImages: 0,
      imagesWithAlt: 0
    };
    
    const images = document.querySelectorAll('img');
    results.totalImages = images.length;
    
    images.forEach((img, index) => {
      const alt = img.getAttribute('alt');
      const role = img.getAttribute('role');
      const ariaLabel = img.getAttribute('aria-label');
      
      // Decorative images should have empty alt or role="presentation"
      const isDecorative = alt === '' || role === 'presentation' || role === 'none';
      
      if (alt !== null || ariaLabel || isDecorative) {
        results.imagesWithAlt++;
      } else {
        results.passed = false;
        results.issues.push({
          type: 'image-no-alt',
          element: 'img',
          src: img.src,
          message: `Image has no alt text`
        });
      }
    });
    
    return results;
  });
}

/**
 * Main test function
 */
async function runScreenReaderTests() {
  console.log('='.repeat(80));
  console.log('MASE Accessibility: Screen Reader Compatibility Test');
  console.log('='.repeat(80));
  console.log('');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to MASE settings page
  const baseUrl = process.env.WP_BASE_URL || 'http://localhost:8080';
  await page.goto(`${baseUrl}/wp-admin/admin.php?page=modern-admin-styler`);
  
  // Wait for page to load
  await page.waitForSelector('.mase-header', { timeout: 10000 });
  
  console.log('Test 1: Semantic HTML Structure');
  console.log('-'.repeat(80));
  
  const semanticResults = await checkSemanticStructure(page);
  
  if (semanticResults.passed) {
    console.log('✓ Semantic HTML structure is correct');
  } else {
    console.log('✗ Semantic HTML structure has issues:');
    semanticResults.issues.forEach(issue => {
      console.log(`  - ${issue.message}`);
      if (issue.text) console.log(`    Text: "${issue.text}"`);
    });
  }
  
  console.log('');
  console.log('Test 2: Form Labels');
  console.log('-'.repeat(80));
  
  const formResults = await checkFormLabels(page);
  
  console.log(`Total inputs: ${formResults.totalInputs}`);
  console.log(`Labeled inputs: ${formResults.labeledInputs}`);
  
  if (formResults.passed) {
    console.log('✓ All form inputs have proper labels');
  } else {
    console.log('✗ Some form inputs are missing labels:');
    formResults.issues.forEach(issue => {
      console.log(`  - ${issue.inputType} input (${issue.name}): ${issue.message}`);
    });
  }
  
  console.log('');
  console.log('Test 3: ARIA Attributes');
  console.log('-'.repeat(80));
  
  const ariaResults = await checkARIA(page);
  
  console.log(`Elements with ARIA attributes: ${ariaResults.ariaElements}`);
  
  if (ariaResults.passed) {
    console.log('✓ All ARIA attributes are valid');
  } else {
    console.log('✗ Some ARIA attributes have issues:');
    ariaResults.issues.forEach(issue => {
      console.log(`  - ${issue.message}`);
    });
  }
  
  console.log('');
  console.log('Test 4: Image Alt Text');
  console.log('-'.repeat(80));
  
  const imageResults = await checkImageAltText(page);
  
  console.log(`Total images: ${imageResults.totalImages}`);
  console.log(`Images with alt text: ${imageResults.imagesWithAlt}`);
  
  if (imageResults.passed) {
    console.log('✓ All images have proper alt text');
  } else {
    console.log('✗ Some images are missing alt text:');
    imageResults.issues.forEach(issue => {
      console.log(`  - ${issue.src}: ${issue.message}`);
    });
  }
  
  // Generate summary
  console.log('');
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  
  const allPassed = 
    semanticResults.passed &&
    formResults.passed &&
    ariaResults.passed &&
    imageResults.passed;
  
  const totalIssues = 
    semanticResults.issues.length +
    formResults.issues.length +
    ariaResults.issues.length +
    imageResults.issues.length;
  
  console.log(`Semantic structure: ${semanticResults.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`Form labels: ${formResults.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`ARIA attributes: ${ariaResults.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`Image alt text: ${imageResults.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`Total issues: ${totalIssues}`);
  console.log('');
  
  if (allPassed) {
    console.log('✓ PASSED: All screen reader compatibility tests passed');
    console.log('');
    console.log('Note: This automated test checks for common issues. For comprehensive');
    console.log('screen reader testing, manual testing with NVDA or JAWS is recommended.');
  } else {
    console.log('✗ FAILED: Some screen reader compatibility issues detected');
  }
  
  await browser.close();
  
  return allPassed;
}

// Run tests if called directly
if (require.main === module) {
  runScreenReaderTests()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Error running screen reader tests:', error);
      process.exit(1);
    });
}

module.exports = { runScreenReaderTests };
