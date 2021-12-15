let baseHref = "http://localhost:3000";
beforeEach(() => {
  cy.fixture("./domain.json").then(domains =>{
    const thisEnv = Cypress.env().env;
    console.log("thisEnv", Cypress.env());
    baseHref = domains[thisEnv] || "http://localhost:3000";
  })
 })

describe('Stopwatch Timer Works', () => {
  it('Displays as expected once created', () => {
    cy.visit(baseHref + '/add');
    cy.contains("Add New Timer").click();
    cy.get('input').last().click().type('5');
    cy.contains("Timers").click();
    cy.contains("START").should('not.have.attr', 'disabled');
    cy.get("#display-time").should('contain', '00:00:00');
    cy.get('input').last().should("have.value", '5');
  });

  it('Starts running, and increments as expected', () => {
    cy.contains("START").click();
    cy.get("#display-time").should('contain', '00:00:01');
    cy.get("#display-time").should('contain', '00:00:02');
    cy.get("#display-time").should('contain', '00:00:03');
    cy.get("#display-time").should('contain', '00:00:04');
    cy.get("#display-time").should('contain', '00:00:05');
    cy.get("#display-time").wait(1000).should('not.contain', '00:00:06');
  });

  it('Is resettable', () => {
    cy.contains("RESET").click();
    cy.contains("START").should('not.have.attr', 'disabled');
    cy.get("#display-time").should('contain', '00:00:00');
    cy.get('input').last().should("have.value", '5');
  });

  it('Runs properly as a multi-step routine', () => {
    cy.contains("Add to Routine").click();
    cy.contains("Add New Timer").click();
    cy.get('input').last().click().type("2");
    cy.contains("Timers").click();
    cy.contains("START").should('not.have.attr', 'disabled');
    cy.get("#display-time").should('contain', '00:00:00');
    cy.get('input').last().should("have.value", '5');
    cy.contains("START").click();
    cy.get("#display-time").should('contain', '00:00:01');
    cy.get("#display-time").should('contain', '00:00:02');
    cy.contains("STOP").click();
    cy.get("#display-time").wait(1000).should('not.contain', '00:00:03');
    cy.contains("RESUME").click();
    cy.get("#display-time").should('contain', '00:00:03');
    cy.contains("SKIP").click();
    cy.get("#display-time").should('contain', '00:00:00');
    cy.get("#display-time").should('contain', '00:00:01');
    cy.get("#display-time").should('contain', '00:00:02');
    cy.get("#display-time").wait(1000).should('not.contain', '00:00:03');
  });
});

describe('Countdown Timer Works', () => {
    it('Displays as expected once created', () => {
      cy.visit(baseHref + '/add');
      cy.contains("Add New Timer").click();
      cy.get('select').select('Countdown');
      cy.get('input').last().click().type('5');
      cy.contains("Timers").click();
      cy.contains("START").should('not.have.attr', 'disabled');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.get('input').last().should("have.value", '5');
    });
  
    it('Starts running, and decrements as expected', () => {
      cy.contains("START").click();
      cy.get("#display-time").should('contain', '00:00:05');
      cy.get("#display-time").should('contain', '00:00:04');
      cy.get("#display-time").should('contain', '00:00:03');
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.get("#display-time").wait(1000).should('contain', '00:00:00');
    });
  
    it('Is resettable', () => {
      cy.contains("RESET").click();
      cy.contains("START").should('not.have.attr', 'disabled');
      cy.get("#display-time").should('contain', '00:00:05');
      cy.get('input').last().should("have.value", '5');
    });
  
    it('Runs properly as a multi-step routine', () => {
      cy.contains("Add to Routine").click();
      cy.contains("Add New Timer").click();
      cy.get('select').last().select('Countdown');
      cy.get('input').last().click().type("3");
      cy.contains("Timers").click();
      cy.contains("START").should('not.have.attr', 'disabled');
      cy.get("#display-time").should('contain', '00:00:05');
      cy.get('input').last().should("have.value", '5');
      cy.contains("START").click();
      cy.get("#display-time").should('contain', '00:00:04');
      cy.get("#display-time").should('contain', '00:00:03');
      cy.contains("STOP").click();
      cy.get("#display-time").wait(1000).should('not.contain', '00:00:02');
      cy.contains("RESUME").click();
      cy.get("#display-time").should('contain', '00:00:02');
      cy.contains("SKIP").click();
      cy.get("#display-time").should('contain', '00:00:03');
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.get("#display-time").wait(1000).should('contain', '00:00:00');
      cy.get('input').last().should("have.value", '3');
    });
  });

  describe('XY Timer Works', () => {
    it('Displays as expected once created', () => {
      cy.visit(baseHref + '/add');
      cy.contains("Add New Timer").click();
      cy.get('select').select('XY');
      cy.get('input').eq(2).click().type('3');
      cy.get('input').last().click().type('{backspace}').type('{backspace}').type('2');
      cy.contains("Timers").click();
      cy.contains("START").should('not.have.attr', 'disabled');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.get('input').last().should("have.value", '3');
      cy.contains("(Round: 1 of 2)");
    });
  
    it('Starts running, and decrements as expected', () => {
      cy.contains("START").click();
      cy.get("#display-time").should('contain', '00:00:03');
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.contains("(Round: 2 of 2)");
      cy.get("#display-time").should('contain', '00:00:03');
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.get("#display-time").wait(1000).should('contain', '00:00:00');
    });
  
    it('Is resettable', () => {
      cy.contains("RESET").click();
      cy.contains("START").should('not.have.attr', 'disabled');
      cy.get("#display-time").should('contain', '00:00:03');
      cy.get('input').last().should("have.value", '3');
      cy.contains("(Round: 1 of 2)");
    });
  
    it('Runs properly as a multi-step routine', () => {
      cy.contains("Add to Routine").click();
      cy.contains("Add New Timer").click();
      cy.get('select').last().select('XY');
      cy.get('input').eq(6).click().type("5");
      cy.contains("Timers").click();
      cy.contains("START").should('not.have.attr', 'disabled');
      cy.contains("(Round: 1 of 2)");
      cy.get("#display-time").should('contain', '00:00:03');
      cy.get('input').last().should("have.value", '3');
      cy.contains("START").click();
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.contains("STOP").click();
      cy.get("#display-time").wait(1000).should('not.contain', '00:00:00');
      cy.contains("RESUME").click();
      cy.get("#display-time").should('contain', '00:00:00');
      cy.contains("(Round: 2 of 2)");
      cy.get("#display-time").should('contain', '00:00:03');
      cy.get("#display-time").should('contain', '00:00:02');
      cy.contains("SKIP").click();
      cy.contains("(Round: 1 of 1)");
      cy.contains("SKIP").click();
      cy.get("#display-time").should('contain', '00:00:00');
    });
  });

  describe.only('Tabata Timer Works', () => {
    it('Displays as expected once created', () => {
      cy.visit(baseHref + '/add');
      cy.contains("Add New Timer").click();
      cy.get('select').select('Tabata');
      cy.get('input').eq(2).click().type('3');
      cy.get('input').eq(5).click().type('2');
      cy.get('input').last().click().type('{backspace}').type('{backspace}').type('2');
      cy.contains("Timers").click();
      cy.contains("START").should('not.have.attr', 'disabled');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.get('input').eq(2).should("have.value", '3');
      cy.get('input').eq(5).should("have.value", '2');
      cy.contains("(Round: 1 of 2)");
    });
  
    it('Starts running, and decrements as expected', () => {
      cy.contains("START").click();
      cy.get("#display-time").should('contain', '00:00:03');
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.contains("(Round: 1 of 2 - Rest)");
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.contains("(Round: 2 of 2)");
      cy.get("#display-time").should('contain', '00:00:03');
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.contains("(Round: 2 of 2 - Rest)");
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.get("#display-time").wait(1000).should('contain', '00:00:00');
    });
  
    it('Is resettable', () => {
      cy.contains("RESET").click();
      cy.contains("START").should('not.have.attr', 'disabled');
      cy.get('input').eq(2).should("have.value", '3');
      cy.get('input').eq(5).should("have.value", '2');
      cy.contains("(Round: 1 of 2)");
    });
  
    it('Runs properly as a multi-step routine', () => {
      cy.contains("Add to Routine").click();
      cy.contains("Add New Timer").click();
      cy.get('select').last().select('Tabata');
      cy.get('input').eq(8).click().type('2');
      cy.get('input').eq(11).click().type('1');
      cy.get('input').last().click().type('{backspace}').type('{backspace}').type('2');
      cy.contains("Timers").click();
      cy.contains("START").should('not.have.attr', 'disabled');
      cy.contains("(Round: 1 of 2)");
      cy.get("#display-time").should('contain', '00:00:03');
      cy.contains("START").click();
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.contains("(Round: 1 of 2 - Rest)");
      cy.get("#display-time").should('contain', '00:00:02');
      cy.contains("STOP").click();
      cy.get("#display-time").wait(1000).should('not.contain', '00:00:01');
      cy.contains("RESUME").click();
      cy.get("#display-time").should('contain', '00:00:00');
      cy.contains("(Round: 2 of 2)");
      cy.get("#display-time").should('contain', '00:00:03');
      cy.get("#display-time").should('contain', '00:00:02');
      cy.contains("SKIP").click();
      cy.contains("(Round: 1 of 2)");
      cy.contains("SKIP").click();
      cy.contains("(Round: 2 of 2 - Rest)");
      cy.get("#display-time").should('contain', '00:00:00');
    });
  });
