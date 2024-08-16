describe('User Registration integration test', () => {
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

describe('User Registration e2e', () => {
  it('should should register a new user and redirect to the login page', () => {
    cy.visit('/register');

    cy.get('input[formcontrolname="firstName"]').type('Jean');
    cy.get('input[formcontrolname="lastName"]').type('Jean');
    cy.get('input[formcontrolname="email"]').type('jean.jean@gmail.com');
    cy.get('input[formcontrolname="password"]').type('test!1234');
    cy.get('input[formcontrolname="password"]').type('{enter}');

    cy.url().should('include', '/login');
  });

  it('should then delete the newly created account', () => {
    cy.visit('/login');

    cy.get('input[formControlName=email]').type('jean.jean@gmail.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
    cy.wait(500);

    cy.contains('Account').click();
    cy.wait(500);
    cy.contains('Detail').click();
    cy.url().should('eq', 'http://localhost:4200/');
    cy.get('simple-snack-bar').should(
      'contain.text',
      'Your account has been deleted !'
    );
  });
});
