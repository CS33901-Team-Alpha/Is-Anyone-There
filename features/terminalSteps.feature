Feature: Terminal command system

  Scenario: Printing text adds to history
    Given a new TerminalModel
    When I print "Hello World"
    Then the history should contain "Hello World"

  Scenario: Unknown commands print error
    Given a new TerminalModel
    When I run the command "fly"
    Then the history should contain 'Unknown command: fly (type "help")'

  Scenario: Registered commands execute
    Given a new TerminalModel
    And I register a command "echo" that prints its argument
    When I run the command "echo Hello"
    Then the history should contain "Hello"

  Scenario: Commands are case-insensitive
    Given a new TerminalModel
    And I register a command "echo" that prints its argument
    When I run the command "EcHo Test"
    Then the history should contain "Test"

  Scenario: Command arguments are split correctly
    Given a new TerminalModel
    And I register a command "say" that prints its argument
    When I run the command "say this is a test"
    Then the history should contain "this is a test"

