describe('Session List Display for Admin User', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    // Intercepter la requête des sessions et simuler une réponse
    cy.intercept('GET', '/api/sessions', {
      body: [
        {
          id: 1,
          name: 'Morning Yoga',
          description: 'A relaxing morning session.',
          date: new Date().toISOString(),
          teacher_id: 1,
          users: [],
        },
        {
          id: 2,
          name: 'Evening Yoga',
          description: 'An invigorating evening session.',
          date: new Date().toISOString(),
          teacher_id: 2,
          users: [],
        },
      ],
    }).as('sessionsRequest');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
  });

  it('should display the Create button for admin user', () => {
    // Vérifier que le bouton Create est visible
    cy.get('button').contains('Create').should('be.visible');
  });

  it('should display Detail and Edit buttons for each session', () => {
    // Intercepter la requête des sessions et simuler une réponse
    cy.intercept('GET', '/api/sessions', {
      body: [
        {
          id: 1,
          name: 'Morning Yoga',
          description: 'A relaxing morning session.',
          date: new Date().toISOString(),
          teacher_id: 1,
          users: [],
        },
        {
          id: 2,
          name: 'Evening Yoga',
          description: 'An invigorating evening session.',
          date: new Date().toISOString(),
          teacher_id: 2,
          users: [],
        },
      ],
    }).as('sessionsRequest');

    // Visiter la page des sessions
    cy.visit('/sessions');

    // Attendre la fin de la requête de sessions
    cy.wait('@sessionsRequest');

    // Vérifier que les boutons Detail et Edit sont visibles pour chaque session
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).find('button').contains('Detail').should('be.visible');
      cy.wrap($row).find('button').contains('Edit').should('be.visible');
    });
  });
});
