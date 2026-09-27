/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM elements by data-cy attribute.
       * @example cy.getBySel('checkout-btn')
       */
      getBySel(dataCy: string, options?: Partial<Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to reset the API database to seed state before tests.
       * @example cy.resetDatabase()
       */
      resetDatabase(): Chainable<Cypress.Response<any>>;
    }
  }
}

Cypress.Commands.add('getBySel', (selector, options) => {
  return cy.get(`[data-cy="${selector}"]`, options);
});

Cypress.Commands.add('resetDatabase', () => {
  return cy.request({
    method: 'POST',
    url: 'http://127.0.0.1:3001/api/reset',
  });
});

export {};
