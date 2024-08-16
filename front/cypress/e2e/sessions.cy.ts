describe('Session List Display integration test', () => {
  describe('When the user is admin', () => {
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

      cy.intercept('GET', 'api/session', [
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
        {
          id: 2,
          name: 'Session 2',
          description: 'Description 2',
          date: new Date(),
          teacher_id: 2,
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Session 3',
          description: 'Description 3',
          date: new Date(),
          teacher_id: 2,
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]).as('sessionsRequest');

      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type(
        `${'test!1234'}{enter}{enter}`
      );

      cy.url().should('include', '/sessions');
      cy.wait('@sessionsRequest');
    });

    it('should display 3 sessions', () => {
      cy.get('.items').children('mat-card').should('have.length', 3);
    });

    it('should display the Create button for admin user', () => {
      cy.get('button').contains('Create').should('be.visible');
    });

    it('should display Detail and Edit buttons for each session ', () => {
      cy.get('mat-card').each(($row) => {
        cy.wrap($row).find('button').contains('Detail').should('be.visible');
        cy.wrap($row).find('button').contains('Edit').should('be.visible');
      });
    });
  });

  describe('When the user is not admin', () => {
    const user = {
      id: 1,
      username: 'userName',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: false,
    };

    beforeEach(() => {
      cy.visit('/login');

      cy.intercept('POST', '/api/auth/login', user);

      cy.intercept('GET', 'api/session', [
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
        {
          id: 2,
          name: 'Session 2',
          description: 'Description 2',
          date: new Date(),
          teacher_id: 2,
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Session 3',
          description: 'Description 3',
          date: new Date(),
          teacher_id: 2,
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]).as('sessionsRequest');

      cy.get('input[formControlName=email]').type('jean.jacques');
      cy.get('input[formControlName=password]').type(
        `${'test!1234'}{enter}{enter}`
      );

      cy.url().should('include', '/sessions');
      cy.wait('@sessionsRequest');
    });

    it('should display 3 sessions', () => {
      cy.get('.items').children('mat-card').should('have.length', 3);
    });

    it('should not display the Create button for normal user', () => {
      cy.get('button').contains('Create').should('not.exist');
    });

    it('should display Detail button but not Edit button for each session', () => {
      cy.get('mat-card').each(($row) => {
        cy.wrap($row).find('button').contains('Detail').should('be.visible');
        cy.wrap($row).find('button').contains('Edit').should('not.exist');
      });
    });
  });
});
