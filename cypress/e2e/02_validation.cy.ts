describe('Validaciones y Manejo de Errores en Frontend', () => {
  beforeEach(() => {
    // Reset database to initial seed state
    cy.resetDatabase();
    cy.intercept('GET', '/api/products').as('getProducts');
    cy.visit('/');
    cy.wait('@getProducts');
  });

  it('Debe bloquear el envío cuando el carrito está vacío y NO realizar peticiones HTTP a la API', () => {
    // Intercept order endpoint to verify it is NOT invoked
    cy.intercept('POST', '/api/orders').as('orderApiCall');

    // Attempt to submit empty cart
    cy.getBySel('checkout-btn').click();

    // Verify validation message is shown
    cy.getBySel('cart-validation-error')
      .should('be.visible')
      .and('contain.text', 'Tu carrito está vacío');

    // Verify that NO API request was dispatched
    cy.get('@orderApiCall.all').should('have.length', 0);
  });

  it('Debe bloquear la adición de cantidades inválidas o superiores al stock disponible', () => {
    // Target product with limited stock (Muffin - stock 1)
    cy.getBySel('product-card')
      .filter('[data-product-id="prod-limited-muffin"]')
      .within(() => {
        // Try incrementing past stock limit
        cy.getBySel('quantity-increment').should('be.disabled');

        // Type invalid quantity 0 directly
        cy.getBySel('quantity-input').clear().type('0');
        cy.getBySel('validation-error')
          .should('be.visible')
          .and('contain.text', 'La cantidad debe ser al menos 1.');

        // Verify add button is disabled when quantity is invalid
        cy.getBySel('add-to-cart-btn').should('be.disabled');
      });
  });

  it('Debe mostrar el producto agotado como deshabilitado para compra', () => {
    // Target sold out product (Galleta Choco Chunk - stock 0)
    cy.getBySel('product-card')
      .filter('[data-product-id="prod-cookie-soldout"]')
      .within(() => {
        cy.getBySel('stock-badge').should('contain.text', 'Agotado');
        cy.getBySel('add-to-cart-btn')
          .should('be.disabled')
          .and('contain.text', 'Agotado');
        cy.getBySel('quantity-decrement').should('be.disabled');
        cy.getBySel('quantity-increment').should('be.disabled');
      });
  });
});
