describe('Session List Display for Admin User', () => {
  const user = {
    id: 1,
    username: 'userName',
    firstName: 'firstName',
    lastName: 'lastName',
    admin: true,
  };

  const sessions = [];

  const teachers = [
    {
      id: 1,
      lastName: 'DELAHAYE',
      firstName: 'Margot',
      createdAt: '2024-07-11T22:51:18',
      updatedAt: '2024-07-11T22:51:18',
    },
  ];

  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', user);
    cy.intercept('GET', 'api/session', sessions).as('sessionsRequest');
    cy.intercept('POST', 'api/session', {});
    cy.intercept('GET', '/api/teacher', teachers);

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
    cy.wait('@sessionsRequest');
    cy.get('mat-card')
      .find('mat-card-header')
      .find('button')
      .find('span')
      .find('span')
      .contains('Create')
      .click();
  });

  it('should create a new session', () => {
    cy.get("button[type='submit']").should('be.disabled');

    cy.get("input[formControlName='name']").type('Nouvelle session');
    cy.get("input[formControlName='date']").type(
      new Date()
        .toLocaleDateString()
        .replace(/(\d{2})\/(\d{2})\/(\d{4})/g, '$3-$2-$1')
    );
    cy.get("mat-select[formControlName='teacher_id']")
      .click()
      .get('mat-option')
      .contains('DELAHAYE')
      .click();
    cy.get("textarea[formControlName='description']").type(
      'Description de la nouvelle session à venir.'
    );

    cy.get("button[type='submit']").should('not.be.disabled');

    cy.get("button[type='submit']").click();

    cy.get('simple-snack-bar').should('contain.text', 'Session created');

    cy.url().should('contain', '/sessions');
  });
});
