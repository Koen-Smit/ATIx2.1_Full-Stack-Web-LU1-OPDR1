const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Enable video recording in CI environments
      if (process.env.CI) {
        config.video = true;
        config.videoCompression = 32;
      }
      return config;
    },
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false, // Disabled locally, enabled in CI via setupNodeEvents
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    excludeSpecPattern: ['**/examples/*', '**/1-getting-started/*', '**/2-advanced-examples/*']
  },
});
