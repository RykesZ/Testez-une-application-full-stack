describe('User Registration integration test', () => {
  beforeEach(() => {
    cy.visit('/register');
  });
  
  it('should display validation errors for empty required fields', () => {
    // Attempt to submit the form with empty fields
    cy.get('input[formcontrolname="firstName"]').focus().blur();
    cy.get('input[formcontrolname="lastName"]').focus().blur();
    cy.get('input[formcontrolname="email"]').focus().blur();
    cy.get('input[formcontrolname="password"]').focus().blur();

    // Check for validation messages
    cy.get('input[formcontrolname="firstName"]')
      .should('have.class', 'ng-invalid');
    cy.get('input[formcontrolname="lastName"]')
      .should('have.class', 'ng-invalid');
    cy.get('input[formcontrolname="email"]')
      .should('have.class', 'ng-invalid');
    cy.get('input[formcontrolname="password"]')
      .should('have.class', 'ng-invalid');
  });

  it('should validate email format', () => {
    // Type an invalid email
    cy.get('input[formcontrolname="email"]').type('invalid-email');

    // Check for invalid email format error
    cy.get('input[formcontrolname="email"]').should('have.class', 'ng-invalid');
  });

  it('should validate the length of first name and last name', () => {
    // Type a first name and last name that are too short
    cy.get('input[formcontrolname="firstName"]').type('Jo');
    cy.get('input[formcontrolname="lastName"]').type('Ja');

    // Check for minlength validation errors
    cy.get('input[formcontrolname="firstName"]').should(
      'have.class',
      'ng-invalid'
    );
    cy.get('input[formcontrolname="lastName"]').should(
      'have.class',
      'ng-invalid'
    );

    // Type a first name and last name that are too long
    cy.get('input[formcontrolname="firstName"]').clear().type('A'.repeat(21));
    cy.get('input[formcontrolname="lastName"]').clear().type('B'.repeat(21));

    // Check for maxlength validation errors
    cy.get('input[formcontrolname="firstName"]').should(
      'have.class',
      'ng-invalid'
    );
    cy.get('input[formcontrolname="lastName"]').should(
      'have.class',
      'ng-invalid'
    );
  });

  it('should validate the length of password', () => {
    // Type a password that is too short
    cy.get('input[formcontrolname="password"]').type('12');

    // Check for minlength validation error
    cy.get('input[formcontrolname="password"]').should(
      'have.class',
      'ng-invalid'
    );

    // Type a password that is too long
    cy.get('input[formcontrolname="password"]').clear().type('A'.repeat(41));

    // Check for maxlength validation error
    cy.get('input[formcontrolname="password"]').should(
      'have.class',
      'ng-invalid'
    );
  });

  it('should allow form submission when all fields are valid and redirect to the login page', () => {
    // Fill in the form with valid data
    cy.get('input[formcontrolname="firstName"]').type('Jean');
    cy.get('input[formcontrolname="lastName"]').type('Jacques');
    cy.get('input[formcontrolname="email"]').type('jean.jacques@gmail.com');
    cy.get('input[formcontrolname="password"]').type('test!1234');

    // Check that the form is valid
    cy.get('form').should('have.class', 'ng-valid');

    // Mock the register API response
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {},
    }).as('registerRequest');

    // Submit the form
    cy.get('input[formcontrolname="password"]').type('{enter}');

    // Wait for the request to be made and check the redirect
    cy.wait('@registerRequest');
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
