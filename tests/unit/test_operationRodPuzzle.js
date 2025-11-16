import assert from 'node:assert/strict';

import {NuclearRodModel, OperationRodModel} from '../../src/models/puzzles/reactorRoom/operationRodModel.js'
import { test } from './common.js';


console.log('--- TESTS FOR NUCLEAR OPERATION ROD PUZZLE --- \n')

test('Check success win condition', () => {
    const model = new OperationRodModel(3) // round count = 3

    const round = model.rounds[0]

    model.rod = new NuclearRodModel(round.start.x, round.start.y)
    model.currentRound = 2;

    assert(model.checkSolved())
})

test('Check unsuccess win condition', () => {
    const model = new OperationRodModel(3)

    const round = model.rounds[0]

    model.rod = new NuclearRodModel(round.start.x, round.start.y)
    model.currentRound = 1;

    assert(!model.checkSolved())
})

test('Check round count', () => {
    const model = new OperationRodModel(6)

    assert(model.rounds.length == 6)
})

test('Check checkpoint sequence in path generator', () => {
    const model = new OperationRodModel(2)

    const start = {x: 2, y: 5}
    const end = {x: 14, y: 5}

    const path = model.generatePath(start, end, 5) // 5 checkpoints
    
    // the x coordinate of every following path node must be > the previous
    let prev = 0;
    let isValidPath = true;
    for(const node of path){
        if(node.x > prev){
            prev = node.x
        }
        else{
            isValidPath = false;
        }
    }

    assert(isValidPath)
})

test('Check round initializer first round', () => {
    const model = new OperationRodModel(5)

    model.initRound()

    assert(model.rod)
})

test('Check round initializer after first round', () => {
    const model = new OperationRodModel(5)

    model.initRound()
    model.rod.completed = true;
    model.checkSolved()
    model.initRound()

    assert(model.rod)
})

test('Mistakes counter for rod', () => {
    const model = new NuclearRodModel()

    assert(model.mistakes === 0)

    model.mistakeCounter()

    assert(model.mistakes === 1)
})

test('Rod movement mechanics', () => {
    const model = new NuclearRodModel(0, 0) // start at x, y = 0, 0

    model.moveTo(3, 3)

    assert(model.x === 3 && model.y === 3)
})

test('Rod trail updates', () => {
    const trailMax = 20;
    const model = new NuclearRodModel(0, 0, trailMax) // start at x, y = 0, 0, trail size 20 max

    // move 50 times
    for(let i = 0; i < 50; i++){
        model.moveTo(3, 3)
    }

    assert(model.trail.length === trailMax) // trail size shouldn't pass the size we specified above
})


console.log('\n Tests successfully completed')