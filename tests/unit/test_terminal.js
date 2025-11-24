import assert from 'node:assert/strict';

import TerminalModel from '../../src/models/puzzles/first/TerminalModel.js'
import { test } from './common.js';


console.log('--- TESTS FOR TERMINAL FUNCTIONALITY --- \n')

test('Test types at initialization of terminal', () => {
    const term = new TerminalModel()

    /**
     * Note: in JS both arrays [] and objects {} are 'object' so we need Array.isArray to actually
     * verify the type.
     */

    assert(typeof term.input === 'string')
    assert(Array.isArray(term.history))
    assert((typeof term.commands === 'object') && (!Array.isArray(term.commands == 'object')))
    assert(typeof term.maxLines === 'number')
})

test('State retrieval', () => {
    const term = new TerminalModel()

    const state = term.getState()

    assert(typeof state.input === 'string')
    assert(Array.isArray(state.history))
    assert(typeof state.maxLines === 'number')
})

test('Outputting to terminal (printing)', () => {
    const term = new TerminalModel()

    // single
    term.print('help')

    assert(term.history.length === 1)
    assert(term.history[0] === 'help')
    
    term.history = []
    // multiple
    term.print('help')
    term.print('help2')
    term.print('help3')
    term.print('help4')

    assert(term.history.length === 4)
    assert(term.history[0] === 'help')
    assert(term.history[3] === 'help4')
})

test('Terminal line limit and removal', () => {
    const LINE_LIMIT = 5;

    const term = new TerminalModel()
    term.maxLines = LINE_LIMIT;

    // try to print more than line limit
    for(let i = 0; i < LINE_LIMIT+1; i++){
        term.print(`command attempted ${i}`)
    }

    assert(term.history.length === LINE_LIMIT)

    // also wanna test if the oldest command was removed
    // since we did LINE_LIMIT+1, oldest should not be command 0, but command 1
    assert(term.history[0] == `command attempted ${1}`)
})

test('Adding new commands', () => {
    const COMMAND_NAME = 'help';
    const term = new TerminalModel();

    term.registerCommand(COMMAND_NAME, ()  => {})

    assert(COMMAND_NAME in term.commands)

    term.commands = {}
    // register multiple
    
    for (let i = 0; i < 5; i++) {
        term.registerCommand(COMMAND_NAME+i, ()  => {})
    }

    for(let i = 0; i < 5; i++){
        assert((COMMAND_NAME+i) in term.commands)  
    }

    term.commands = {}
    // also check if commands are made lowercase (should be)
    term.registerCommand('HELP', () => {})
    assert('help' in term.commands)
})

test('Running a command functionality', () => {
    const term = new TerminalModel();

    let handlerCalled = false; // use this to check if handler was called

    // no args command
    term.registerCommand('help', () => {handlerCalled = true})

    term.runCommand('help')
    assert(handlerCalled)
    handlerCalled = false;
    term.commands = {}

    // also try running command when there are multiple registered (see if it can find the right one)
    term.registerCommand('help', () => {handlerCalled = true})
    term.registerCommand('help2', () => {})
    term.registerCommand('help3', () => {})

    term.runCommand('help')
    assert(handlerCalled)
    handlerCalled = false;
    term.commands = {}

    // command passed with args (spaces)
    let externalValue = '0';
    term.registerCommand('updateValue', (newValue) => {externalValue = newValue;})

    term.runCommand('updateValue 3')

    assert(externalValue === '3')
})

test('Running a non existent command outputs error', () => {
    const term = new TerminalModel();
    term.history = []

    term.registerCommand('help', () => {})

    /**
     * Running a non-existent command like this should result in a line with an error message
     * being added to history
     */
    term.runCommand('doesntexist')

    assert(term.history.length === 1)
    assert(term.history[0].toLowerCase().includes('unknown command'))
})