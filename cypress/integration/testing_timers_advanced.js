const { _, $ } = Cypress;

let baseHref;
beforeEach(() => {
    cy.fixture("./domain.json").then(domains =>{
        const thisEnv = Cypress.env().env;
        baseHref = domains[thisEnv] || "http://localhost:3000";
    })
});

describe('Stopwatch Timer Bug and State Checks', () => {
    it('Handles invalid end times', () => {
        cy.visit(baseHref + '/add');
        cy.contains("Add New Timer").click();
        cy.get('input').last().click().type('5');
        // Start Timer
        cy.contains("Timers").click();
        cy.contains("START").should('not.have.attr', 'disabled');
        cy.get("#display-time").should('contain', '00:00:00');
        cy.get('input').last().should("have.value", '5');
        cy.contains("START").click();
        cy.get("#display-time").should('contain', '00:00:01');
        cy.get("#display-time").should('contain', '00:00:02');
        cy.get("#display-time").should('contain', '00:00:03');
        cy.contains("STOP").click();
        // Set End Time to Less than Current Time
        cy.contains("Add to Routine").click();
        cy.get('input').last().click().type('{backspace}002')
        cy.contains("Timers").click();
        // Return to the Timers and be forced to restart
        cy.contains("RESUME").should('have.attr', 'disabled');
        cy.contains("RESET").should('exist').should('not.have.attr', 'disabled');
        cy.contains("RESET").click();
        cy.get("#display-time").should('contain', '00:00:00');
        cy.contains("START").should('exist').should('not.have.attr', 'disabled');
    });

    it('Allows RESET on complete', () => {
        cy.contains("START").click();
        cy.contains("FF").click();
        cy.contains("RESUME").should('not.exist');
        cy.contains("RESET").should('exist').should('not.have.attr', 'disabled');
    });
});

describe('Countdown Timer Bug and State Checks', () => {
    it('Handles invalid start times', () => {
        cy.visit(baseHref + '/add');
        cy.contains("Add New Timer").click();
        cy.get('select').select('Countdown');
        cy.get('input').last().click().type('5');
        // Start Timer
        cy.contains("Timers").click();
        cy.contains("START").should('not.have.attr', 'disabled');
        cy.get("#display-time").should('contain', '00:00:05');
        cy.get('input').last().should("have.value", '5');
        cy.contains("START").click();
        cy.get("#display-time").should('contain', '00:00:04');
        cy.get("#display-time").should('contain', '00:00:03');
        cy.contains("STOP").click();
        // Set End Time to Less than Current Time
        cy.contains("Add to Routine").click();
        cy.get('input').last().click().type('{backspace}007');
        cy.contains("Timers").click();
        // Return to the Timers; can resume from where left off or reset
        cy.contains("RESUME").should('exist').should('not.have.attr', 'disabled');
        cy.contains("RESET").should('exist').should('not.have.attr', 'disabled');
        cy.contains("RESET").click();
        cy.get("#display-time").should('contain', '00:00:07');
        cy.contains("START").should('exist').should('not.have.attr', 'disabled');
    });

    it('Allows RESET on complete', () => {
        cy.contains("START").click();
        cy.contains("FF").click();
        cy.contains("RESUME").should('not.exist');
        cy.contains("RESET").should('exist').should('not.have.attr', 'disabled');
    });
});

describe('XY Timer Bug and State Checks', () => {
    it('Handles invalid start times', () => {
        cy.visit(baseHref + '/add');
        cy.contains("Add New Timer").click();
        cy.get('select').select('XY');
        cy.get('input').eq(2).click().type('5');
        // Start Timer
        cy.contains("Timers").click();
        cy.contains("START").should('not.have.attr', 'disabled');
        cy.get("#display-time").should('contain', '00:00:05');
        cy.get('input').last().should("have.value", '5');
        cy.contains("START").click();
        cy.get("#display-time").should('contain', '00:00:04');
        cy.get("#display-time").should('contain', '00:00:03');
        cy.contains("STOP").click();
        // Set End Time to Less than Current Time
        cy.contains("Add to Routine").click();
        cy.get('input').eq(2).click().type('{backspace}007');
        cy.contains("Timers").click();
        // Return to the Timers; can resume from where left off or reset
        cy.contains("RESUME").should('exist').should('not.have.attr', 'disabled');
        cy.contains("RESET").should('exist').should('not.have.attr', 'disabled');
        cy.contains("RESET").click();
        cy.get("#display-time").should('contain', '00:00:07');
        cy.contains("START").should('exist').should('not.have.attr', 'disabled');
    });

    it('Allows RESET on complete', () => {
        cy.contains("START").click();
        cy.contains("FF").click();
        cy.contains("RESUME").should('not.exist');
        cy.contains("RESET").should('exist').should('not.have.attr', 'disabled');
    });

    it('Handles invalid round state', () => {
        // Add 0 rounds
        cy.contains("Add to Routine").click();
        cy.get('input').last().click().type('{backspace}');
        // Return to XY Timer and alert forces reset
        cy.contains("Timers").click();
        cy.on('window:alert', (text) => {
            expect(text).to.contains("Invalid numRounds for Timer (must be >=1). Setting to 1 and re-loading.");
        });
        // Reset integrity check
        cy.contains("(Round: 1 of 1)");
        cy.get("#display-time").should('contain', '00:00:07');
        cy.contains("START").should('exist').should('not.have.attr', 'disabled');
    });
});

describe('Tabata Timer Bug and State Checks', () => {
    it('Handles invalid round state', () => {
        cy.visit(baseHref + '/add');
        cy.contains("Add New Timer").click();
        cy.get('select').select('Tabata');
        cy.get('input').eq(2).click().type('5');
        cy.get('input').eq(5).click().type('3');
        // Start Timer
        cy.contains("Timers").click();
        cy.contains("START").should('not.have.attr', 'disabled');
        cy.get('input').eq(2).should("have.value", '5');
        cy.get('input').eq(5).should("have.value", '3');
        cy.contains("(Round: 1 of 1)");
        cy.contains("START").click();
        cy.get("#display-time").should('contain', '00:00:05');
        cy.get("#display-time").should('contain', '00:00:04');
        cy.get("#display-time").should('contain', '00:00:03');
        cy.get("#display-time").should('contain', '00:00:02');
        cy.get("#display-time").should('contain', '00:00:01');
        cy.get("#display-time").should('contain', '00:00:00');
        cy.contains("(Round: 1 of 1 - Rest)");
        cy.get("#display-time").should('contain', '00:00:03');
        cy.contains("STOP").click();
        // Set End Time to Less than Current Time
        cy.contains("Add to Routine").click();
        cy.get('input').last().click().type('{backspace}00');
        cy.contains("Timers").click();
        cy.on('window:alert', (text) => {
            expect(text).to.contains("Invalid numRounds for Timer (must be >=1). Setting to 1 and re-loading.");
        });
        // Return to the Timers; can re-start
        cy.contains("(Round: 1 of 1)");
        cy.get("#display-time").should('contain', '00:00:05');
        cy.contains("START").should('exist').should('not.have.attr', 'disabled');
    });
});
