describe('Session modification integration test for Admin User', () => {
  const sessions = [
    {
      id: 1,
      name: 'Session 1',
      description: 'Description 1',
      date: new Date(),
      teacher_id: 1,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const teachers = [
    {
      id: 1,
      lastName: 'DELAHAYE',
      firstName: 'Margot',
      createdAt: '2024-07-11T22:51:18',
      updatedAt: '2024-07-11T22:51:18',
    },
  ];

  const user = {
    id: 1,
    username: 'userName',
    firstName: 'firstName',
    lastName: 'lastName',
    admin: true,
  };

  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', user);
    cy.intercept('GET', 'api/session', sessions).as('sessionsRequest');
    cy.intercept('GET', '/api/session/1', sessions[0]).as('sessionRequest');
    cy.intercept('PUT', '/api/session/1', {});
    cy.intercept('GET', '/api/teacher', teachers).as('teachersRequest');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
    cy.wait('@sessionsRequest');

    cy.get('mat-card').find('button').contains('Edit').click();
    cy.wait('@sessionRequest');
    cy.wait('@teachersRequest');
  });

  it('should modify the session', () => {
    cy.get("textarea[formControlName='description']").type(
      'Modification de la description de la nouvelle session à venir.'
    );

    cy.get("button[type='submit']").click();

    cy.get('simple-snack-bar').should('contain.text', 'Session updated');

    cy.url().should('contain', '/sessions');
  });
});

describe('Session modification e2e', () => {
  describe('As an admin', () => {
    beforeEach(() => {
      cy.visit('/login');

      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type(
        `${'test!1234'}{enter}{enter}`
      );

      cy.url().should('include', '/sessions');
      cy.wait(500);

      cy.get('mat-card').find('button').contains('Edit').click();
      cy.wait(500);
    });

    it('should modify the session', () => {
      cy.get("textarea[formControlName='description']").type(
        'Modification de la description de la nouvelle session à venir.'
      );

      cy.get("button[type='submit']").click();

      cy.get('simple-snack-bar').should('contain.text', 'Session updated');

      cy.url().should('contain', '/sessions');
    });
  });
});
