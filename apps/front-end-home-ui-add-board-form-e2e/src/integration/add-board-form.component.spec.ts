describe('front-end-home-ui-add-board-form', () => {
  beforeEach(() => cy.visit('/iframe.html?id=addboardformcomponent--primary'));
  it('should render the component', () => {
    cy.get('budgetello-add-board-form').should('exist');
  });
});