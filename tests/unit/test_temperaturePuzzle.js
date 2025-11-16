import assert from 'node:assert/strict';

import {ThermalNodeModel, TemperaturePuzzleModel} from '../../src/models/puzzles/lifeSupport/temperatureRegulationModel.js'
import { test } from './common.js';


console.log('--- TESTS FOR TEMPERATURE PUZZLE --- \n')

test('Check solved win condition', () => {
    const model = new TemperaturePuzzleModel()
    const correctTemps = model.target
    
    // set node temps to be target temps
    for (const [k, v] of Object.entries(model.nodes)) {
        v.temp = correctTemps[k]
    }

    assert(model.checkSolved() == true)
})

test('Check solved non-win condition', () => {
    const model = new TemperaturePuzzleModel()
    const correctTemps = model.target
    
    for (const [k, v] of Object.entries(model.nodes)) {
        v.temp = correctTemps[k]+1
    }

    assert(model.checkSolved() == false)
})

test('Check solved partially correct win condition', () => {
    const model = new TemperaturePuzzleModel()
    const correctTemps = model.target
    
    for (const [k, v] of Object.entries(model.nodes)) {
        v.temp = correctTemps[k]

        // force one of the nodes to be wrong
        if(k == 'A'){ 
            v.temp = correctTemps[k]+1
        }
    }

    assert(model.checkSolved() == false)
})

test('Temperature within bounds', () => {
    const model = new TemperaturePuzzleModel()
    
    model.nodes.A.temp = 33;
    model.nodes.B.temp = 33;
    model.nodes.C.temp = 33;

    assert(!model.checkOverflow())
})

test('Below min temperature detected', () => {
    const model = new TemperaturePuzzleModel()
    
    model.nodes.A.temp = 0;

    assert(model.checkOverflow())
    
    model.nodes.A.temp = -10;

    assert(model.checkOverflow())
})

test('Above max temperature detected', () => {
    const model = new TemperaturePuzzleModel()
    
    model.nodes.A.temp = 100;

    assert(model.checkOverflow())
    
    model.nodes.A.temp = 110;

    assert(model.checkOverflow())
})

test('Change +/- temperature for node', () => {
    const model = new ThermalNodeModel()

    model.temp = 50;
    model.adjust(10);
    assert(model.temp === 60)

    model.temp = 50;
    model.adjust(-10);
    assert(model.temp === 40)
})

test('Change +/- temperature for node (above/below max/min)', () => {
    const model = new ThermalNodeModel()

    model.temp = 90;
    model.adjust(20);
    assert(model.temp === 100)

    model.temp = 10;
    model.adjust(-20);
    assert(model.temp === 0)
})

test('Node coordinate update', () => {
    const model = new ThermalNodeModel()

    model.x = 0;
    model.y = 0;

    model.setPosition(5, 5);
    assert(model.x === 5 && model.y === 5)
})

console.log('\n Tests successfully completed')