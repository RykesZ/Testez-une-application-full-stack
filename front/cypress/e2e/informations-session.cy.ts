describe('Session informations integration test for Admin User', () => {
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

  it('should display retrieved info', () => {
    cy.get('h1').should('contain', sessions[0].name);
    cy.get('mat-card-subtitle')
      .find('div')
      .find('span')
      .should('contain', `${teacher.firstName} ${teacher.lastName}`);
    cy.get('mat-card-content')
      .find('div')
      .find('div')
      .find('span')
      .should('contain', sessions[0].users.length);
    cy.get('div.description').should('contain', sessions[0].description);

    cy.get('div.created')
      .should('exist')
      .then(($dateCreated) => {
        const text = $dateCreated.text().trim();
        const regex = /Create at:\s*(.*)/;
        const matches = text.match(regex);
        const extractedDate = matches ? matches[1] : '';

        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        const retrievedCreatedDate = sessions[0].createdAt;
        const expectedDate = new Intl.DateTimeFormat('en-US', options).format(
          retrievedCreatedDate
        );
        cy.wrap(extractedDate).should('equal', expectedDate);
      });

    cy.get('div.updated')
      .should('exist')
      .then(($dateUpdated) => {
        const text = $dateUpdated.text().trim();
        const regex = /Last update: \s*(.*)/;
        const matches = text.match(regex);
        const extractedDate = matches ? matches[1] : '';

        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        const retrievedUpdatedDate = sessions[0].updatedAt;
        const expectedDate = new Intl.DateTimeFormat('en-US', options).format(
          retrievedUpdatedDate
        );
        cy.wrap(extractedDate).should('equal', expectedDate);
      });

    cy.get('mat-card-content')
      .find('div')
      .eq(2)
      .find('span')
      .should('exist')
      .then(($sessionDate) => {
        const text = $sessionDate.text().trim();

        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        const retrievedDate = sessions[0].date;
        const expectedDate = new Intl.DateTimeFormat('en-US', options).format(
          retrievedDate
        );
        cy.wrap(text).should('equal', expectedDate);
      });
  });

  it('should display Delete button when admin', () => {
    if (user.admin) {
      cy.get('mat-card-title')
        .find('div')
        .find('div')
        .eq(1)
        .find('button')
        .find('span')
        .find('span')
        .contains('Delete')
        .should('be.visible');
    }
  });
});

describe('Session informations e2e', () => {
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

    it('should display Delete button', () => {
      cy.get('mat-card-title')
        .find('div')
        .find('div')
        .eq(1)
        .find('button')
        .find('span')
        .find('span')
        .contains('Delete')
        .should('be.visible');
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
      cy.wait(500);

      cy.get('mat-card').find('button').contains('Detail').click();
    });

    it('should not display Delete button', () => {
      cy.get('mat-card-title')
        .find('div')
        .find('div')
        .eq(1)
        .find('button')
        .find('span')
        .find('span')
        .contains('Delete')
        .should('not.exist');
    });
  });
});
