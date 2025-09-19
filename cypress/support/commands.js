// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command voor login
Cypress.Commands.add('login', (email = 'staff@sakila.com', password = 'password123') => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()
    cy.url().should('not.include', '/login')
  })
})

// Custom command voor uitloggen
Cypress.Commands.add('logout', () => {
  cy.get('a[href="/logout"], button:contains("Logout"), .logout-btn')
    .click()
  cy.url().should('include', '/')
})

// Custom command voor wachten op pagina load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible')
  cy.get('nav').should('be.visible')
})

// Custom command voor database reset (voor testing)
Cypress.Commands.add('resetDatabase', () => {
  // Dit kun je gebruiken als je een API endpoint hebt voor database reset
  cy.request('POST', '/api/test/reset-database')
})

// Custom command voor responsive testing
Cypress.Commands.add('testResponsive', (sizes = ['mobile', 'tablet', 'desktop']) => {
  const viewports = {
    mobile: [375, 667],
    tablet: [768, 1024], 
    desktop: [1280, 720]
  }
  
  sizes.forEach(size => {
    cy.viewport(viewports[size][0], viewports[size][1])
    cy.get('body').should('be.visible')
  })
})

// Custom command voor form validation testing
Cypress.Commands.add('testFormValidation', (formSelector, fields) => {
  // Submit empty form
  cy.get(formSelector).within(() => {
    cy.get('button[type="submit"]').click()
  })
  
  // Check for validation errors
  cy.get('.alert-danger, .error, .invalid-feedback').should('be.visible')
  
  // Test individual field validation
  fields.forEach(field => {
    if (field.invalid) {
      cy.get(`input[name="${field.name}"]`)
        .clear()
        .type(field.invalid)
        .blur()
      
      cy.get('.alert-danger, .error, .invalid-feedback')
        .should('contain', field.errorMessage || 'Invalid')
    }
  })
})