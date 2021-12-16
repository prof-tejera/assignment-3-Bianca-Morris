let baseHref;
const timerTypes = ['stopwatch', 'countdown', 'tabata', 'xy'];
const idPrefixGenerator = (timerType) => `[id^=${timerType}-]`;

beforeEach(() => {
  cy.fixture("./domain.json").then(domains =>{
    const thisEnv = Cypress.env().env;
    baseHref = domains[thisEnv] || "http://localhost:3000";
  })
 })

describe('Creating Stopwatch timer works', () => {
  it('Visits the Add page', () => {
    cy.visit(baseHref + '/add');
  });

  it('Can Add a New Stopwatch (from none pre-existing)', () => {
    cy.contains("Add to Workout Routine");
    cy.contains("Add New Timer").click();
    cy.contains("Timers").click();
    cy.get(idPrefixGenerator(timerTypes[0])).should('exist');
    cy.contains("START").should('have.attr', 'disabled');
    cy.get("#display-time").should('contain', '00:00:00');
  });

  it('Can update a pre-existing stopwatch', () => {
    cy.contains("Add to Routine").click();
    cy.get('input').last().should('have.attr', 'name', 'secondInput')
      .should("not.have.attr", 'disabled');
    cy.get('input').last().click().type('x').type('5'); // testing input validation, too
    cy.contains("Timers").click();
    cy.get(idPrefixGenerator(timerTypes[0])).should('exist');
    cy.contains("START").should('not.have.attr', 'disabled');
    cy.get("#display-time").should('contain', '00:00:00');
    cy.get('input').last().should("have.value", '5');
  });

  it('Can delete stopwatch', () => {
    cy.contains("Add to Routine").click();
    cy.get('button').first().click();
    cy.get('input').should('not.exist');
    cy.contains("Timers").click();
    cy.get(idPrefixGenerator(timerTypes[0])).should('not.exist');
    cy.contains("Ready to work out?").should('exist');
  })
});

describe('Creating Countdown timer works', () => {
  it('Visits the Add page', () => {
    cy.visit(baseHref + '/add');
  });

  it('Can Add a New Countdown (from none pre-existing)', () => {
    cy.contains("Add to Workout Routine");
    cy.contains("Add New Timer").click();
    cy.get('select').select('Countdown');
    cy.contains("Timers").click();
    cy.get(idPrefixGenerator(timerTypes[1])).should('exist');
    cy.contains("START").should('have.attr', 'disabled');
    cy.get("#display-time").should('contain', '00:00:00');
  });

  it('Can update a pre-existing countdowh', () => {
    cy.contains("Add to Routine").click();
    cy.get('input').last().should('have.attr', 'name', 'secondInput')
      .should("not.have.attr", 'disabled');
    cy.get('input').first().click().type('x').type('5');
    cy.contains("Timers").click();
    cy.get(idPrefixGenerator(timerTypes[1])).should('exist');
    cy.contains("START").should('not.have.attr', 'disabled');
    cy.get("#display-time").should('contain', '00:00:00');
    cy.get('input').first().should("have.value", '5');
  });

  it('Can delete countdown', () => {
    cy.contains("Add to Routine").click();
    cy.get('button').first().click();
    cy.get('input').should('not.exist');
    cy.contains("Timers").click();
    cy.get(idPrefixGenerator(timerTypes[1])).should('not.exist');
    cy.contains("Ready to work out?").should('exist');
  })
});
  
describe('Creating XY timer works', () => {
  it('Visits the Add page', () => {
    cy.visit(baseHref + '/add');
  });

  it('Can Add a New XY timer (from none pre-existing)', () => {
    cy.contains("Add to Workout Routine");
    cy.contains("Add New Timer").click();
    cy.get('select').select('XY');
    cy.contains("Timers").click();
    cy.get(idPrefixGenerator(timerTypes[3])).should('exist');
    cy.contains("START").should('have.attr', 'disabled');
    cy.get("#display-time").should('contain', '00:00:00');
  });

  it('Can update a pre-existing XY timer', () => {
    cy.contains("Add to Routine").click();
    cy.get('input').first().should('have.attr', 'name', 'hourInput')
      .should("not.have.attr", 'disabled');
    cy.get('input').first().click().type('x').type('5');
    cy.get('input').eq(3).click().type('{backspace}').type('zxcxS?FSD}+!@$%^&**()');
    cy.contains("Timers").click();
    cy.get(idPrefixGenerator(timerTypes[3])).should('exist');
    cy.contains("START").should('not.have.attr', 'disabled');
    cy.get("#display-time").should('contain', '00:00:00');
    cy.get('input').first().should("have.value", '5');
    cy.contains("(Round: 1 of 1)"); // invalid input (0 or any symbols) should default to numRounds = 1
  });

  it('Can delete XY', () => {
    cy.contains("Add to Routine").click();
    cy.get('button').first().click();
    cy.get('input').should('not.exist');
    cy.contains("Timers").click();
    cy.get(idPrefixGenerator(timerTypes[3])).should('not.exist');
    cy.contains("Ready to work out?").should('exist');
  })
});

describe('Creating Tabata timer works', () => {
  it('Visits the Add page', () => {
    cy.visit(baseHref + '/add');
  });

  it('Can Add a New Tabata timer (from none pre-existing)', () => {
    cy.contains("Add to Workout Routine");
    cy.contains("Add New Timer").click();
    cy.get('select').select('Tabata');
    cy.contains("Timers").click();
    cy.get(idPrefixGenerator(timerTypes[2])).should('exist');
    cy.contains("START").should('have.attr', 'disabled');
    cy.get("#display-time").should('contain', '00:00:00');
  });

  it('Can update a pre-existing Tabata timer', () => {
    cy.contains("Add to Routine").click();
    cy.get('input').eq(1).should('have.attr', 'name', 'minuteInput')
      .should("not.have.attr", 'disabled');
    cy.get('input').eq(1).click().type('x').type('5');
    cy.get('input').eq(3).click().type('x').type('2');
    cy.get('input').eq(6).click().type('{backspace}').type('zxcxS?FSD}+!@$%^&**()');
    cy.contains("Timers").click();
    cy.get(idPrefixGenerator(timerTypes[2])).should('exist');
    cy.contains("START").should('not.have.attr', 'disabled');
    cy.get("#display-time").should('contain', '00:00:00');
    cy.get('input').eq(1).should("have.value", '5');
    cy.get('input').eq(3).should("have.value", '2');
    cy.contains("(Round: 1 of 1)"); // invalid input (0 or any symbols) should default to numRounds = 1
  });

  it('Can delete Tabata timer', () => {
    cy.contains("Add to Routine").click();
    cy.get('button').first().click();
    cy.get('input').should('not.exist');
    cy.contains("Timers").click();
    cy.get(idPrefixGenerator(timerTypes[2])).should('not.exist');
    cy.contains("Ready to work out?").should('exist');
  })
});