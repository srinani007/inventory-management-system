describe('Inventory App E2E Flow', () => {
  const apiUrl = 'http://localhost:8081/login';

  before(() => {
    // Ensure the backend has an admin user
    cy.request({
      method: 'POST',
      url: `${apiUrl}/auth/signup`,
      body: {
        username: 'e2eadmin',
        password: 'adminpass',
        roles: ['ROLE_ADMIN']
      },
      failOnStatusCode: false // in case user already exists
    });
  });

  it('logs in as Admin', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('e2eadmin');
    cy.get('input[name="password"]').type('adminpass');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/inventory');
    cy.contains('Inventory List');
  });

  it('creates a new inventory item', () => {
    cy.contains('+ New Item').click();
    cy.get('input[name="skuCode"]').type('E2E001');
    cy.get('input[name="name"]').type('E2E Test Item');
    cy.get('input[name="quantityAvailable"]').clear().type('10');
    cy.contains('Save').click();
    cy.contains('E2E001').should('be.visible');
    cy.contains('E2E Test Item').should('be.visible');
  });

  it('views the detail page of the new item', () => {
    cy.contains('E2E001').click();
    cy.url().should('match', /\/inventory\/\d+$/);
    cy.contains('SKU: E2E001');
    cy.contains('Name: E2E Test Item');
  });
});
