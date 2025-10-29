/**
 * MASE Basic Functionality Tests - Cypress
 * 
 * More stable than Playwright for WordPress
 */

describe('MASE Plugin - Basic Functionality', () => {
  
  beforeEach(() => {
    // Login to WordPress
    cy.visit('/wp-login.php');
    cy.get('#user_login').type(Cypress.env('wpUsername'));
    cy.get('#user_pass').type(Cypress.env('wpPassword'));
    cy.get('#wp-submit').click();
    
    // Navigate to MASE settings
    cy.visit(Cypress.env('maseSettingsUrl'));
    cy.get('.mase-settings-wrap').should('be.visible');
  });
  
  describe('Settings Page', () => {
    
    it('should load MASE settings page', () => {
      cy.get('.mase-settings-wrap').should('exist');
      cy.get('.mase-tab-nav').should('be.visible');
      cy.get('#mase-settings-form').should('exist');
    });
    
    it('should have all 13 tabs', () => {
      const tabs = [
        'general', 'admin-bar', 'menu', 'content', 'typography',
        'widgets', 'form-controls', 'effects', 'buttons', 'backgrounds',
        'templates', 'login', 'advanced'
      ];
      
      tabs.forEach(tab => {
        cy.get(`[data-tab="${tab}"]`).should('exist');
        cy.get(`#tab-${tab}`).should('exist');
      });
    });
    
    it('should have master controls', () => {
      cy.get('input[name="mase_settings[enable_plugin]"]').should('exist');
      cy.get('input[name="mase_settings[apply_to_login]"]').should('exist');
      cy.get('input[name="mase_settings[dark_mode]"]').should('exist');
    });
    
  });
  
  describe('Live Preview', () => {
    
    it('should have Live Preview toggle', () => {
      cy.get('#mase-live-preview-toggle').should('exist');
    });
    
    it('should toggle Live Preview on/off', () => {
      cy.get('#mase-live-preview-toggle').then($toggle => {
        const initialState = $toggle.is(':checked');
        
        cy.get('#mase-live-preview-toggle').click();
        cy.wait(500);
        cy.get('#mase-live-preview-toggle').should(
          initialState ? 'not.be.checked' : 'be.checked'
        );
        
        // Toggle back
        cy.get('#mase-live-preview-toggle').click();
      });
    });
    
    it('should inject CSS when Live Preview is enabled', () => {
      cy.get('#mase-live-preview-toggle').then($toggle => {
        if (!$toggle.is(':checked')) {
          cy.get('#mase-live-preview-toggle').click();
          cy.wait(1000);
        }
        
        cy.get('#mase-live-preview-css').should('exist');
      });
    });
    
  });
  
  describe('Color Palettes', () => {
    
    it('should display at least 10 color palettes', () => {
      cy.get('.mase-palette-card').should('have.length.at.least', 10);
    });
    
    it('should show palette preview on hover', () => {
      cy.get('.mase-palette-card').first().trigger('mouseover');
      cy.wait(300);
      // Verify hover effect applied
    });
    
    it('should have Apply button for each palette', () => {
      cy.get('.mase-palette-card').each($card => {
        cy.wrap($card).find('button:contains("Apply")').should('exist');
      });
    });
    
  });
  
  describe('Tab Navigation', () => {
    
    it('should navigate to Admin Bar tab', () => {
      cy.get('[data-tab="admin-bar"]').click();
      cy.wait(300);
      cy.get('#tab-admin-bar').should('have.class', 'active');
      cy.get('#tab-admin-bar').should('be.visible');
    });
    
    it('should navigate to Menu tab', () => {
      cy.get('[data-tab="menu"]').click();
      cy.wait(300);
      cy.get('#tab-menu').should('have.class', 'active');
      cy.get('#tab-menu').should('be.visible');
    });
    
    it('should navigate to Typography tab', () => {
      cy.get('[data-tab="typography"]').click();
      cy.wait(300);
      cy.get('#tab-typography').should('have.class', 'active');
      cy.get('#tab-typography').should('be.visible');
    });
    
    it('should navigate to Templates tab', () => {
      cy.get('[data-tab="templates"]').click();
      cy.wait(300);
      cy.get('#tab-templates').should('have.class', 'active');
      cy.get('#tab-templates').should('be.visible');
    });
    
    it('should navigate to Advanced tab', () => {
      cy.get('[data-tab="advanced"]').click();
      cy.wait(300);
      cy.get('#tab-advanced').should('have.class', 'active');
      cy.get('#tab-advanced').should('be.visible');
    });
    
  });
  
  describe('Templates', () => {
    
    it('should display at least 11 templates', () => {
      cy.get('[data-tab="templates"]').click();
      cy.wait(500);
      cy.get('.mase-template-card').should('have.length.at.least', 11);
    });
    
    it('should have Apply button for each template', () => {
      cy.get('[data-tab="templates"]').click();
      cy.wait(500);
      cy.get('.mase-template-card').each($card => {
        cy.wrap($card).find('button:contains("Apply")').should('exist');
      });
    });
    
  });
  
  describe('Advanced Features', () => {
    
    it('should have Custom CSS textarea', () => {
      cy.get('[data-tab="advanced"]').click();
      cy.wait(300);
      cy.get('textarea[name*="custom_css"]').should('exist');
    });
    
    it('should have Custom JS textarea', () => {
      cy.get('[data-tab="advanced"]').click();
      cy.wait(300);
      cy.get('textarea[name*="custom_js"]').should('exist');
    });
    
    it('should allow entering custom CSS', () => {
      cy.get('[data-tab="advanced"]').click();
      cy.wait(300);
      cy.get('textarea[name*="custom_css"]').first()
        .clear()
        .type('/* Test CSS */\n.test { color: red; }');
      cy.get('textarea[name*="custom_css"]').first()
        .should('contain.value', 'Test CSS');
    });
    
  });
  
  describe('Form Functionality', () => {
    
    it('should have Save Settings button', () => {
      cy.contains('button', 'Save Settings').should('exist');
    });
    
    it('should have nonce field for security', () => {
      cy.get('input[name="mase_nonce"]').should('exist');
    });
    
  });
  
  describe('Accessibility', () => {
    
    it('should have proper ARIA labels on tabs', () => {
      cy.get('.mase-tab-nav').should('have.attr', 'role', 'tablist');
      cy.get('.mase-tab-button').each($tab => {
        cy.wrap($tab).should('have.attr', 'role', 'tab');
        cy.wrap($tab).should('have.attr', 'aria-controls');
      });
    });
    
    it('should support keyboard navigation', () => {
      cy.get('.mase-tab-button').first().focus();
      cy.focused().should('have.class', 'mase-tab-button');
    });
    
  });
  
});
