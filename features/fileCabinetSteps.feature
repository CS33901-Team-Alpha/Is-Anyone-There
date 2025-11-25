Feature: File Cabinet Models

  Scenario: Creating a new FileCabinetModel
    Given a FileCabinetModel with id "cab1" at position 5 10
    Then the cabinet should be locked
    And the cabinet width should be 1.93
    And the cabinet height should be 2.3

  Scenario: Detecting a point inside the cabinet
    Given a FileCabinetModel with id "cab1" at position 5 10
    When I check if point 6 11 is inside
    Then the result should be true

  Scenario: Detecting a point outside the cabinet
    Given a FileCabinetModel with id "cab1" at position 5 10
    When I check if point 20 20 is inside
    Then the result should be false


  Scenario: Creating a new OpenCabinetModel
    Given a new OpenCabinetModel
    Then the cabinet should not be active
    And the random number should be between 0 and 3
