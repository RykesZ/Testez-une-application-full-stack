describe('Account integration test for Admin User', () => {
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

describe('Account e2e', () => {
  describe('When the user logs in with an admin account', () => {
    beforeEach(() => {
      cy.visit('/login');

      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type(
        `${'test!1234'}{enter}{enter}`
      );

      cy.url().should('include', '/sessions');
    });

    it("should go in the Account section to see 'You are admin' message", () => {
      cy.contains('Account').click();
      cy.get('p').contains('admin').should('have.text', 'You are admin');
    });
  });

  describe('When the user logs in with a normal account', () => {
    beforeEach(() => {
      cy.visit('/login');

      cy.get('input[formControlName=email]').type('jean.jacques@gmail.com');
      cy.get('input[formControlName=password]').type(
        `${'test!1234'}{enter}{enter}`
      );

      cy.url().should('include', '/sessions');
    });

    it("should go in the Account section not to see 'You are admin' message", () => {
      cy.contains('Account').click();
      cy.get('p').contains('admin').should('not.exist');
    });
  });
});
