const { _, $ } = Cypress;

let baseHref;
beforeEach(() => {
  cy.fixture("./domain.json").then(domains =>{
    const thisEnv = Cypress.env().env;
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
    cy.contains("FF").click();
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
      cy.contains("FF").click();
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
      cy.contains("FF").click();
      cy.contains("(Round: 1 of 1)");
      cy.contains("FF").click();
      cy.get("#display-time").should('contain', '00:00:00');
    });
  });

  describe('Tabata Timer Works', () => {
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
      cy.contains("FF").click();
      cy.contains("(Round: 1 of 2)");
      cy.contains("FF").click();
      cy.contains("(Round: 2 of 2 - Rest)");
      cy.get("#display-time").should('contain', '00:00:00');
    });
  });

  describe('Timers work in mixed order', () => {
    it('Sets up timers properly', () => {
      cy.visit(baseHref + '/add');
      // add 5 timers
      _.times(5, () => cy.contains("Add New Timer").click());
      // ensure one of each type is selected
      cy.get('select').eq(1).select('Tabata');
      cy.get('select').eq(2).select('Countdown');
      cy.get('select').eq(3).select('XY');
      // populate with a few seconds each
      cy.get('input').eq(2).click().type('2'); // Stopwatch
      cy.get('input').eq(5).click().type('2'); // Tabata
      cy.get('input').eq(8).click().type('1'); // Tabata
      cy.get('input').eq(9).click().type('{backspace}').type('2'); // Tabata rounds
      cy.get('input').eq(12).click().type('2'); // Countdown
      cy.get('input').eq(15).click().type('2'); // XY
      cy.get('input').eq(16).click().type('{backspace}').type('2'); // XY rounds
      cy.get('input').eq(19).click().type('2'); // Stopwatch
      // return to timers page and check that it makes sense.
      cy.contains("Timers").click();
      cy.get("#display-time").should('contain', '00:00:00');
      cy.contains("Total Time: Hours: 0, Minutes: 0, Seconds: 16");
    });

    it('Runs timers as expected', () => {
      cy.contains("START").click();
      // First stopwatch
      cy.get("#display-time").should('contain', '00:00:00');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:02');
      // Tabata
      cy.contains("(Round: 1 of 2)");
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.contains("(Round: 1 of 2 - Rest)");
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.contains("(Round: 2 of 2)");
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.contains("(Round: 2 of 2 - Rest)");
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      // Countdown
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      // XY
      cy.contains("(Round: 1 of 2)");
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      cy.contains("(Round: 2 of 2)");
      cy.get("#display-time").should('contain', '00:00:02');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:00');
      // Last stopwatch
      cy.get("#display-time").should('contain', '00:00:00');
      cy.get("#display-time").should('contain', '00:00:01');
      cy.get("#display-time").should('contain', '00:00:02');
    });
  });
