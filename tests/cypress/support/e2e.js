// Cypress support file for MASE tests

// Import commands
import './commands';

// Disable uncaught exception handling for WordPress
Cypress.on('uncaught:exception', (err, runnable) => {
  // WordPress sometimes has minor JS errors that don't affect functionality
  // Return false to prevent test failure
  if (err.message.includes('jQuery') || 
      err.message.includes('wp-') ||
      err.message.includes('favicon')) {
    return false;
  }
  return true;
});

// Custom commands for MASE testing
Cypress.Commands.add('loginToWordPress', (username, password) => {
  cy.visit('/wp-login.php');
  cy.get('#user_login').type(username || Cypress.env('wpUsername'));
  cy.get('#user_pass').type(password || Cypress.env('wpPassword'));
  cy.get('#wp-submit').click();
  cy.url().should('include', '/wp-admin');
});

Cypress.Commands.add('navigateToMASE', () => {
  cy.visit(Cypress.env('maseSettingsUrl'));
  cy.get('.mase-settings-wrap', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('switchTab', (tabName) => {
  cy.get(`[data-tab="${tabName}"]`).click();
  cy.wait(300);
  cy.get(`#tab-${tabName}`).should('have.class', 'active');
});

Cypress.Commands.add('enableLivePreview', () => {
  cy.get('#mase-live-preview-toggle').then($toggle => {
    if (!$toggle.is(':checked')) {
      cy.get('#mase-live-preview-toggle').click();
      cy.wait(1000);
    }
  });
});

Cypress.Commands.add('disableLivePreview', () => {
  cy.get('#mase-live-preview-toggle').then($toggle => {
    if ($toggle.is(':checked')) {
      cy.get('#mase-live-preview-toggle').click();
      cy.wait(500);
    }
  });
});

Cypress.Commands.add('applyPalette', (paletteName) => {
  cy.contains('.mase-palette-card', paletteName)
    .find('button:contains("Apply")')
    .click();
  cy.wait(1000);
});

Cypress.Commands.add('applyTemplate', (templateName) => {
  cy.switchTab('templates');
  cy.contains('.mase-template-card', templateName)
    .find('button:contains("Apply")')
    .click();
  cy.wait(1000);
});

Cypress.Commands.add('saveSettings', () => {
  cy.contains('button', 'Save Settings').click();
  cy.wait(2000);
  // Wait for success message or page reload
});

// Screenshot helper
Cypress.Commands.add('screenshotWithName', (name) => {
  cy.screenshot(name, {
    capture: 'viewport',
    overwrite: true
  });
});
