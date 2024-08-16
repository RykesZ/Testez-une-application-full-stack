describe('Session suppression integration test for Admin User', () => {
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

  const teacher = {
    id: 1,
    lastName: 'DELAHAYE',
    firstName: 'Margot',
    createdAt: '2024-07-11T22:51:18',
    updatedAt: '2024-07-11T22:51:18',
  };

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

    cy.intercept('GET', '/api/teacher/1', {
      body: teacher,
    }).as('teacherRequest');

    cy.intercept('DELETE', `/api/session/${sessions[0].id}`, {}).as(
      'deleteRequest'
    );

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
    cy.wait('@sessionsRequest');

    cy.get('mat-card').find('button').contains('Detail').click();
    cy.wait('@sessionRequest');
    cy.wait('@teacherRequest');
  });

  it('should delete the session', () => {
    cy.get('span').contains('delete').click();
    cy.wait('@deleteRequest');

    cy.url().should('contain', '/sessions');
    cy.get('simple-snack-bar').should('contain', 'Session deleted !');
  });
});

describe('Session suppression e2e', () => {
  describe('When the user logs in with an admin account', () => {
    beforeEach(() => {
      cy.visit('/login');

      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type(
        `${'test!1234'}{enter}{enter}`
      );

      cy.url().should('include', '/sessions');
      cy.wait(500);

      cy.get('mat-card').find('button').contains('Detail').click();
    });

    it('should delete an already created session', () => {
      cy.get('span').contains('delete').click();
      cy.url().should('contain', '/sessions');
      cy.get('simple-snack-bar').should('contain', 'Session deleted !');
    });
  });
});
