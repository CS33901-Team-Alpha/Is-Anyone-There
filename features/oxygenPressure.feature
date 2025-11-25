Feature: oxygenPressureModel
    As a player 
    I want to manipulate oxygen pressures
    So that i can solve the pressure puzzle

    Scenario: Resseting Oxygen Pressure
        Given a new OxygenPressureModel
        When I reset the model 
        Then the pressure should match the starting pressure
        And the puzzle should not be solved


    Scenario: Changing pressure within valid range
        Given a new OxygenPressureModel
        When I change the pressure of bar 0
        Then the pressures should be updated according to the influence matrix
        And the model solved state should be false


    Scenario: Winning the puzzle
        Given a new OxygenPressureModel with all pressures at target
        Then the model should be solved




