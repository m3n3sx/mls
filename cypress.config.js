const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    screenshotOnRunFailure: true,
    
    // WordPress specific settings
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    
    // Test files
    specPattern: 'tests/cypress/e2e/**/*.cy.js',
    supportFile: 'tests/cypress/support/e2e.js',
    fixturesFolder: 'tests/cypress/fixtures',
    screenshotsFolder: 'tests/cypress/screenshots',
    videosFolder: 'tests/cypress/videos',
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  
  env: {
    // WordPress credentials
    wpUsername: 'admin',
    wpPassword: 'admin',
    wpAdminUrl: '/wp-admin',
    maseSettingsUrl: '/wp-admin/admin.php?page=mase-settings',
  },
});
