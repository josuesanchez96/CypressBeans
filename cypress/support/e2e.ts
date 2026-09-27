import './commands';

// Prevent uncaught exception failures if third-party/uncaught errors happen
Cypress.on('uncaught:exception', (_err, _runnable) => {
  return false;
});
