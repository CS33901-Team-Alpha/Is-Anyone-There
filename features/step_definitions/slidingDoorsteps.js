import { Given, When, Then } from '@cucumber/cucumber';
import { SlidingDoorModel } from '../../src/models/puzzles/first/SlidingDoorModel.js';
import assert from 'assert';

let door;

Given('a sliding door that is unlocked', function () {
  door = new SlidingDoorModel({ locked: false });
});

Given('a sliding door that is locked', function () {
  door = new SlidingDoorModel({ locked: true });
});

Given('the locked condition is {word}', function (condition) {
  const bool = condition === 'true';
  door.lockedCondition = () => bool;
});

When('I toggle the door', function () {
  door.toggle();
});

When('I toggle the door again', function () {
  door.toggle();
});

Then('the door should be open', function () {
  assert.strictEqual(door.isOpen, true);
});

Then('the door should be closed', function () {
  assert.strictEqual(door.isOpen, false);
});

Then('the door should be animating', function () {
  assert.strictEqual(door.animating, true);
});

Then('the auto-close timer should be set', function () {
  assert.strictEqual(door.autoCloseTimer, door.autoCloseDelay);
});

Then('the door should remain closed', function () {
  assert.strictEqual(door.isOpen, false);
});
