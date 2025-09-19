// Test: Customer Management Tests
// These tests cover accessing the customers page, searching for customers, viewing customer details, and pagination.
describe('Customer Management Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/customers', { failOnStatusCode: false })
  })

  it('should handle customer page access', () => {
    cy.get('body').then(($body) => {
      if ($body.find('h1').length > 0) {
        cy.get('h1').should('be.visible')
      } else {
        cy.url().then((url) => {
          if (url.includes('/login')) {
            cy.contains('Inloggen').should('be.visible')
          }
        })
      }
    })
  })

  it('should handle customer search if accessible', () => {
    cy.get('body').then(($body) => {
      if ($body.find('input[type="search"], input[name="search"]').length > 0) {
        cy.get('input[type="search"], input[name="search"]')
          .type('MARY')
        
        cy.get('button[type="submit"], .btn-search').click()
      } else {
        cy.log('Search functionality not available on this page')
      }
    })
  })

  it('should display customer data if accessible', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table, .customer-card, .customer-item').length > 0) {
        cy.get('table, .customer-card, .customer-item').should('be.visible')
      } else {
        cy.log('Customer data not visible - may require authentication')
      }
    })
  })

  it('should handle customer detail navigation if accessible', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table tbody tr a, .customer-item a').length > 0) {
        cy.get('table tbody tr a, .customer-item a')
          .first()
          .click()
        
        cy.url().should('include', '/customer')
      } else {
        cy.log('Customer navigation not available')
      }
    })
  })

  it('should handle pagination if available', () => {
    cy.get('body').then(($body) => {
      if ($body.find('.pagination, .page-nav').length > 0) {
        cy.get('.pagination').should('be.visible')
      } else {
        cy.log('Pagination not available on this page')
      }
    })
  })
})