import './commands.js'

// Hide fetch/XHR requests from command log
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');
    app.document.head.appendChild(style);
}

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false here prevents Cypress from failing the test
    console.log('Uncaught exception:', err.message)
    return false;
});

// Custom configuration
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('requestTimeout', 15000);
Cypress.config('responseTimeout', 15000);

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false here prevents Cypress from failing the test
    return false;
});

// Custom configuration
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('requestTimeout', 15000);
Cypress.config('responseTimeout', 15000);