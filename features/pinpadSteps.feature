Feature: Pinpad and Passkey system

  # pinpad 
  Scenario: Pressing a pin button returns its value
    Given a PinButton at grid 1 1 with value 7
    When I press the pin button
    Then the returned value should be 7


  Scenario: Transform converts coordinates correctly
    When I transform coordinates 3 4
    Then the transformed result should be 3 4


  Scenario: Constrain limits values inside min/max
    When I constrain value 15 between 0 and 10
    Then the constrained result should be 10


  Scenario: Random returns a number within range
    When I generate a random number between 1 and 9
    Then the random result should be within 1 and 9


  Scenario: Entering correct password unlocks the Passkey
    Given a Passkey with password 3 4 5
    When I enter the sequence 3 4 5
    Then the passkey should unlock

  Scenario: Entering wrong password does not unlock Passkey
    Given a Passkey with password 1 2 3
    When I enter the sequence 9 9 9
    Then the passkey should not unlock


  # passkey

  Scenario: Reset clears the entered password
    Given a Passkey with password 3 4 5
    When I enter the sequence 3 4 5
      And I reset the passkey
    Then the entry should be empty


  # pinpad

  Scenario: Pinpad initializes with correct state
    Given a new Pinpad
    Then the pinpad state should be IDLE
    And the pinpad should have 10 pin buttons
    And the pinpad password should have length 3
