describe('Flujo Exitoso (Happy Path) - Pedido en Cafetería', () => {
  beforeEach(() => {
    // Isolation: Reset database to seed state before each test
    cy.resetDatabase();
    // Intercept initial GET /api/products
    cy.intercept('GET', '/api/products').as('getProducts');
    cy.visit('/');
    cy.wait('@getProducts');
  });

  it('Debe permitir seleccionar productos, agregarlos al carrito, modificar cantidades y confirmar la orden exitosamente', () => {
    // 1. Intercept network call for order creation
    cy.intercept('POST', '/api/orders').as('createOrder');

    // 2. Select first product (Espresso Doble - Q18.00)
    cy.getBySel('product-card')
      .filter('[data-product-id="prod-espresso"]')
      .within(() => {
        cy.getBySel('product-title').should('contain.text', 'Espresso Doble Artesanal');
        cy.getBySel('product-price').should('contain.text', 'Q18.00');
        cy.getBySel('add-to-cart-btn').click();
      });

    // Verify item is added to cart
    cy.getBySel('cart-item')
      .should('have.length', 1)
      .and('contain.text', 'Espresso Doble Artesanal');

    // Real-time total calculation check (Q18.00)
    cy.getBySel('cart-total').should('contain.text', 'Q18.00');

    // 3. Select second product with quantity modification (Caramel Oat Latte - Q28.00 x 2)
    cy.getBySel('product-card')
      .filter('[data-product-id="prod-latte"]')
      .within(() => {
        cy.getBySel('quantity-increment').click();
        cy.getBySel('quantity-input').should('have.value', '2');
        cy.getBySel('add-to-cart-btn').click();
      });

    // Verify cart now has 2 products
    cy.getBySel('cart-item').should('have.length', 2);

    // Total expected: Q18.00 + (Q28.00 * 2) = Q74.00
    cy.getBySel('cart-total').should('contain.text', 'Q74.00');

    // 4. Enter customer name
    cy.getBySel('customer-name-input').type('Carlos Gómez');

    // 5. Submit order
    cy.getBySel('checkout-btn').click();

    // 6. Wait for API response alias
    cy.wait('@createOrder').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      expect(interception.response?.body.success).to.be.true;
    });

    // 7. Verify confirmation modal elements persist on screen
    cy.getBySel('order-confirmation-modal').should('be.visible');
    
    // Check order ID starts with "ORD-"
    cy.getBySel('order-id')
      .should('be.visible')
      .invoke('text')
      .should('match', /^ORD-/);

    // Verify total amount persists on modal screen
    cy.getBySel('order-confirmed-total').should('contain.text', 'Q74.00');

    // 8. Close modal & verify cart is emptied
    cy.getBySel('close-modal-btn').click();
    cy.getBySel('order-confirmation-modal').should('not.exist');
    cy.getBySel('cart-empty').should('be.visible');
  });
});
