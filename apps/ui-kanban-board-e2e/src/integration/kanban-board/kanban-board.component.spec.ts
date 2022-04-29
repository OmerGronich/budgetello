describe('ui-kanban-board', () => {
  beforeEach(() => cy.visit('/iframe.html?id=kanbanboardcomponent--primary'));
  it('should render the component', () => {
    cy.get('budgetello-kanban-board').should('exist');
  });
});
