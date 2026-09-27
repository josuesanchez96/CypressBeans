describe('Simulación de Fallos de Red y Servidor', () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.intercept('GET', '/api/products').as('getProducts');
    cy.visit('/');
    cy.wait('@getProducts');
  });

  it('Debe manejar un error 500 del servidor usando cy.intercept(), mostrar alerta y permitir la recuperación mediante reintento', () => {
    // 1. Add product to cart
    cy.getBySel('product-card')
      .filter('[data-product-id="prod-espresso"]')
      .within(() => {
        cy.getBySel('add-to-cart-btn').click();
      });

    // 2. Intercept API with server error status 500 and alias @orderError
    cy.intercept('POST', '/api/orders', {
      statusCode: 500,
      body: {
        success: false,
        error: 'Error interno del servidor (500 Internal Error Simulado)',
      },
    }).as('orderError');

    // 3. Submit checkout
    cy.getBySel('checkout-btn').click();

    // 4. Wait strictly on alias @orderError
    cy.wait('@orderError');

    // 5. Verify UI displays error alert message
    cy.getBySel('error-message')
      .should('be.visible')
      .and('contain.text', 'Error interno del servidor (500 Internal Error Simulado)');

    // 6. Test UI recovery mechanism: update intercept to succeed with status 201
    cy.intercept('POST', '/api/orders', {
      statusCode: 201,
      body: {
        success: true,
        data: {
          id: 'ORD-RECOVERY-999',
          items: [
            {
              productId: 'prod-espresso',
              name: 'Espresso Doble Artesanal',
              quantity: 1,
              unitPrice: 18.0,
              subtotal: 18.0,
            },
          ],
          total: 18.0,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          customerName: 'Cliente Reintento',
        },
      },
    }).as('orderRecovery');

    // 7. Click Retry button on error banner
    cy.getBySel('retry-btn').click();

    // 8. Wait for recovery intercept
    cy.wait('@orderRecovery');

    // 9. Confirm success modal is displayed with recovered order ID
    cy.getBySel('order-confirmation-modal').should('be.visible');
    cy.getBySel('order-id').should('contain.text', 'ORD-RECOVERY-999');
  });

  it('Debe manejar una falla de conexión / red rechazada y mostrar la alerta correspondiente', () => {
    cy.getBySel('product-card')
      .filter('[data-product-id="prod-latte"]')
      .within(() => {
        cy.getBySel('add-to-cart-btn').click();
      });

    // Simulate network connection failure (forceNetworkError)
    cy.intercept('POST', '/api/orders', {
      forceNetworkError: true,
    }).as('networkFailure');

    cy.getBySel('checkout-btn').click();

    cy.wait('@networkFailure');

    cy.getBySel('error-message')
      .should('be.visible')
      .and('contain.text', 'Error de red');
  });
});
