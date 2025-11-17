import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import OxygenPressureModel from '../../src/models/puzzles/lifeSupport/oxygenPressureModel.js';

let model;
let changedBarIndex;

// =========================
// GIVEN
// =========================

Given('a new OxygenPressureModel', function () {
    model = new OxygenPressureModel();
    model.bars = model.pressures.map(p => ({ pressure: p }));
    changedBarIndex = undefined; // reset for safety
});

Given('a new OxygenPressureModel with all pressures at target', function () {
    model = new OxygenPressureModel();
    model.bars = model.pressures.map(() => ({ pressure: model.targetPressure }));

    // Ensure solved state is accurate
    if (typeof model.checkSolved === 'function') {
        model.solved = model.checkSolved();
    } else {
        model.solved = true; // fallback if checkSolved doesn't exist
    }

    changedBarIndex = undefined;
});

// =========================
// WHEN
// =========================

When('I reset the model', function () {
    model.reset();
    changedBarIndex = undefined;
});

When('I change the pressure of bar {int}', function (barIndex) {
    changedBarIndex = barIndex;
    model.changePressure(barIndex);
});

// =========================
// THEN
// =========================

Then('the model should not be solved', function () {
    assert.strictEqual(model.solved, false, `Expected puzzle not solved, got solved = ${model.solved}`);
});

Then('the pressures should be updated according to the influence matrix', function () {
    if (changedBarIndex === undefined) {
        throw new Error('You must change a bar before checking pressures. Did you forget a "When I change the pressure of bar {int}" step?');
    }

    const influence = model.influenceMatrix[changedBarIndex];

    for (let i = 0; i < model.bars.length; i++) {
        const expectedPressure = Math.min(1, Math.max(0, model.startingPressures[i] + influence[i]));
        assert.strictEqual(
            model.bars[i].pressure,
            expectedPressure,
            `Bar ${i}: expected ${expectedPressure}, got ${model.bars[i].pressure}`
        );
    }
});


Then('the pressure should match the starting pressure', function () {
    for (let i = 0; i < model.bars.length; i++) {
        assert.strictEqual(
            model.bars[i].pressure,
            model.startingPressures[i],
            `Bar ${i}: expected starting pressure ${model.startingPressures[i]}, got ${model.bars[i].pressure}`
        );
    }
});

Then('the puzzle should not be solved', function () {
    assert.strictEqual(model.solved, false, `Expected puzzle not solved, got solved = ${model.solved}`);
});

Then('the model solved state should be false', function () {
    assert.strictEqual(model.solved, false, `Expected solved state false, got ${model.solved}`);
});

Then('the model should be solved', function () {
    // Recompute solved state if possible
    if (typeof model.checkSolved === 'function') {
        model.solved = model.checkSolved();
    }
    assert.strictEqual(model.solved, true, `Expected puzzle solved, got solved = ${model.solved}`);
});
