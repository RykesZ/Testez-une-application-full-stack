describe('User Registration', () => {
  it('should register a new user and redirect to the login page', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      body: {},
    });

    cy.get('input[formcontrolname="firstName"]').type('Jean');
    cy.get('input[formcontrolname="lastName"]').type('Jacques');
    cy.get('input[formcontrolname="email"]').type('jean.jacques@gmail.com');
    cy.get('input[formcontrolname="password"]').type('test!1234');
    cy.get('input[formcontrolname="password"]').type('{enter}');

    cy.url().should('include', '/login');
  });
});
