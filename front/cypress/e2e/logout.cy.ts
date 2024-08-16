describe('Logout integration test for Admin User', () => {
  const sessions = [];

  const user = {
    id: 1,
    username: 'Admin',
    firstName: 'Admin',
    lastName: 'Admin',
    admin: true,
  };

  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', user);
    cy.intercept('GET', 'api/session', sessions).as('sessionsRequest');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
    cy.wait('@sessionsRequest');
  });

  it('should logout', () => {
    cy.contains('Logout').click();

    cy.url().should('eq', 'http://localhost:4200/');
  });
});

describe('Logout e2e', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
    cy.wait(500);
  });

  it('should logout', () => {
    cy.contains('Logout').click();

    cy.url().should('eq', 'http://localhost:4200/');
  });
});
