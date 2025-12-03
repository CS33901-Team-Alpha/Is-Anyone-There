Feature: Sliding door behavior

  Scenario: Door opens when toggled
    Given a sliding door that is unlocked
    When I toggle the door
    Then the door should be open
    And the door should be animating
    And the auto-close timer should be set

  Scenario: Door closes when toggled twice
    Given a sliding door that is unlocked
    When I toggle the door
    And I toggle the door again
    Then the door should be closed
    And the door should be animating

  Scenario: Door respects locked condition
    Given a sliding door that is locked
    And the locked condition is true
    When I toggle the door
    Then the door should remain closed
