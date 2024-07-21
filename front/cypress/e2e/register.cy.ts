describe('User Registration', () => {
  it('should register a new user and redirect to the login page', () => {
    // Visiter la page d'inscription'
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      body: {},
    });

    // Saisir le prénom
    cy.get('input[formcontrolname="firstName"]').type('Jean');

    // Saisir le nom
    cy.get('input[formcontrolname="lastName"]').type('Jacques');

    // Saisir l'email
    cy.get('input[formcontrolname="email"]').type('jean.jacques@gmail.com');

    // Saisir le mot de passe
    cy.get('input[formcontrolname="password"]').type('test!1234');

    // Appuyer sur "Entrée" pour soumettre le formulaire
    cy.get('input[formcontrolname="password"]').type('{enter}');

    // Vérifier que l'URL est "/login" après la soumission du formulaire
    cy.url().should('include', '/login');
  });
});
