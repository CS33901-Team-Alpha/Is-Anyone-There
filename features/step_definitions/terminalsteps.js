import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import TerminalModel from '../../src/models/puzzles/first/TerminalModel.js';

let terminal;

Given("a new TerminalModel", function () {
    terminal = new TerminalModel();
});

When("I print {string}", function (text) {
    terminal.print(text);
});

Then("the history should contain {string}", function (expected) {
    assert(
        terminal.history.includes(expected),
        `History does not contain "${expected}": ${terminal.history}`
    );
});

When("I run the command {string}", function (line) {
    terminal.runCommand(line);
});

Given('I register a command {string} that prints its argument', function (commandName) {
    terminal.registerCommand(commandName, (args) => {
        terminal.print(args);
    });
});
