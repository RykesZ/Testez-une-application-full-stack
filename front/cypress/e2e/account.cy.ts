describe('Session List Display for Admin User', () => {
  const sessions = [];

  const user = {
    id: 1,
    username: 'Admin',
    firstName: 'Admin',
    lastName: 'Admin',
    admin: true,
  };

  const userDetail = {
    id: 1,
    email: 'yoga@studio.com',
    lastName: 'Admin',
    firstName: 'Admin',
    admin: true,
    createdAt: '2024-07-11T22:51:23',
    updatedAt: '2024-07-11T22:51:23',
  };

  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', user);
    cy.intercept('GET', 'api/session', sessions).as('sessionsRequest');
    cy.intercept('GET', `api/user/${user.id}`, userDetail).as('userRequest');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
    cy.wait('@sessionsRequest');
  });

  it("should go in the Account section to see 'You are admin' message", () => {
    cy.contains('Account').click();
    cy.wait('@userRequest');

    cy.get('p').contains('admin').should('have.text', 'You are admin');
  });
});
