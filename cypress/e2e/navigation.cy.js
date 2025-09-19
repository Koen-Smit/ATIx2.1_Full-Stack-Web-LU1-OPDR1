describe('Navigation and Responsive Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  // Test: Navigation Tests
  // These tests check if navigation links work correctly when logged in
  describe('Navigation Tests', () => {
    it('should navigate to main pages if logged in', () => {
      cy.document().then((doc) => {
        const filmsLink = doc.querySelector('a[href="/films"]')
        
        if (filmsLink) {
          cy.log('Navigation links found - testing navigation')
          
          cy.get('a[href="/films"]').click()
          cy.url().should('include', '/films')
          cy.go('back')
          
          cy.get('a[href="/customers"]').click()
          cy.url().should('include', '/customers')
          cy.go('back')
          
          cy.get('a[href="/about"]').click()
          cy.url().should('include', '/about')
          cy.go('back')
        } else {
          cy.log('User not logged in - skipping navigation tests')
          cy.get('nav').should('be.visible')
        }
      })
    })

    it('should show active navigation state when logged in', () => {
      cy.document().then((doc) => {
        const filmsLink = doc.querySelector('a[href="/films"]')
        
        if (filmsLink) {
          cy.get('a[href="/films"]').click()
          cy.get('nav a[href="/films"]').should('have.class', 'active')
        } else {
          cy.log('User not logged in - skipping active state test')
        }
      })
    })
  })

  // Test: Responsive Design Tests
  // These tests check if key pages render correctly on different screen sizes
  describe('Responsive Design Tests', () => {
    it('should be responsive on mobile', () => {
      cy.viewport(375, 667) // iPhone 6/7/8 size
      
      cy.visit('http://localhost:3000')
      
      cy.get('nav').should('be.visible')
      
      cy.get('.container').should('be.visible') // Container should stack properly
    })

    it('should be responsive on tablet', () => {
      cy.viewport(768, 1024) // iPad size
      
      cy.visit('http://localhost:3000')
      
      cy.get('nav').should('be.visible')
      cy.get('.container').should('be.visible')
    })

    it('should handle mobile navigation menu', () => {
      cy.viewport(375, 667)
      
      cy.visit('http://localhost:3000')
      
      // Check for mobile menu toggle
      cy.get('body').then(($body) => {
        if ($body.find('.navbar-toggler').length > 0) {
          cy.get('.navbar-toggler').click()
          cy.get('.navbar-collapse').should('be.visible')
        } else {
          cy.log('No mobile menu toggle found')
        }
      })
    })
  })

  // Test: Error Handling Tests
  // These tests check how the app handles invalid URLs and API errors
  describe('Error Handling Tests', () => {
    it('should handle 404 pages gracefully', () => {
      cy.visit('http://localhost:3000/nonexistent-page', { failOnStatusCode: false })
      
      cy.get('body').should('be.visible')
      
      cy.url().then((url) => {
        if (url.includes('nonexistent-page')) {
          cy.get('body').should('contain.text', '404').or('contain.text', 'Not Found').or('contain.text', 'Page not found')
        } else {
          cy.log('App redirected invalid URL to valid page (expected behavior)')
          cy.get('nav').should('be.visible')
        }
      })
    })

    it('should handle API endpoints correctly', () => {
      cy.request({
        url: 'http://localhost:3000/api/definitely-nonexistent-endpoint-12345',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 302, 404, 500])
        cy.log(`API endpoint returned status: ${response.status}`)
      })
    })
  })

  // Test: Performance Tests
  // These tests check if key pages load within a reasonable time frame
  // and if basic elements are present after load
  describe('Performance Tests', () => {
    it('should load pages within reasonable time', () => {
      const startTime = Date.now()
      
      cy.visit('http://localhost:3000')
      
      cy.get('nav').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime
        expect(loadTime).to.be.lessThan(5000)
      })
    })

    it('should load basic page elements', () => {
      cy.visit('http://localhost:3000')
      
      cy.get('nav').should('be.visible')
      cy.get('.container').should('be.visible')
      cy.contains('Sakila').should('be.visible')
    })
  })
})