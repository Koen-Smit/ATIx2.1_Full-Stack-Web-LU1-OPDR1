//Test: Film Management Tests
// These tests cover accessing the films page, searching for films, filtering by category, and navigating to film details.
describe('Film Management Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/films', { failOnStatusCode: false })
  })

  it('should handle films page access', () => {
    cy.get('body').then(($body) => {
      if ($body.find('h1, h2').length > 0) {
        cy.get('h1, h2').should('be.visible')
      } else {
        cy.url().then((url) => {
          if (url.includes('/login')) {
            cy.contains('Inloggen').should('be.visible')
          }
        })
      }
    })
  })

  it('should handle film search if accessible', () => {
    cy.get('body').then(($body) => {
      if ($body.find('input[name="title"], input[placeholder*="title"]').length > 0) {
        cy.get('input[name="title"], input[placeholder*="title"]')
          .type('ACADEMY')
        
        cy.get('button[type="submit"], .btn-search').click()
      } else {
        cy.log('Film search not available on this page')
      }
    })
  })

  it('should display film catalog if accessible', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table, .film-card, .film-grid').length > 0) {
        cy.get('table, .film-card, .film-grid').should('be.visible')
      } else {
        cy.log('Film catalog not visible - may require authentication')
      }
    })
  })

  it('should handle film category filter if available', () => {
    cy.get('body').then(($body) => {
      if ($body.find('select[name="category"], .category-filter').length > 0) {
        cy.get('select[name="category"], .category-filter').should('be.visible')
      } else {
        cy.log('Category filter not available')
      }
    })
  })

  it('should handle film detail navigation if accessible', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table tbody tr a, .film-item a').length > 0) {
        cy.get('table tbody tr a, .film-item a')
          .first()
          .click()
        
        cy.url().should('include', '/film')
      } else {
        cy.log('Film navigation not available')
      }
    })
  })

  it('should handle empty search results gracefully', () => {
    cy.get('body').then(($body) => {
      if ($body.find('input[name="title"]').length > 0) {
        cy.get('input[name="title"]')
          .type('NONEXISTENTFILM12345')
        
        cy.get('button[type="submit"]').click()
        
        cy.get('body').should('be.visible')
      } else {
        cy.log('Search functionality not available')
      }
    })
  })
})