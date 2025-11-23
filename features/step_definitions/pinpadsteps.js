import { Given, When, Then } from "@cucumber/cucumber";
import assert from "assert";

import { 
  PinButton, 
  Passkey, 
  Pinpad, 
  transform,
  constrain,
  random,
  PASSWORD_SIZE
} from "../../src/models/puzzles/first/pinpad-module.js";

let button;
let passkey;
let pad;
let result;
let transformed;
let constrained;
let randomResult;


//pin button

Given('a PinButton at grid {int} {int} with value {int}', function (x, y, v) {
  button = new PinButton(x, y, v);
});

When('I press the pin button', function () {
  result = button.press();
});

Then('the returned value should be {int}', function (expected) {
  assert.equal(result, expected);
});


When('I transform coordinates {int} {int}', function (x, y) {
  transformed = transform(x, y);
});

Then('the transformed result should be {int} {int}', function (x, y) {
  assert.equal(transformed.x, x);
  assert.equal(transformed.y, y);
});




When('I constrain value {int} between {int} and {int}', function (value, min, max) {
  constrained = constrain(value, min, max);
});

Then('the constrained result should be {int}', function (expected) {
  assert.equal(constrained, expected);
});


When('I generate a random number between {int} and {int}', function (min, max) {
  randomResult = random(min, max);
});

Then('the random result should be within {int} and {int}', function (min, max) {
  assert.ok(randomResult >= min && randomResult <= max);
});


//passkey

Given('a Passkey with password {int} {int} {int}', function (a, b, c) {
  passkey = new Passkey([a, b, c]);
});

When('I enter the sequence {int} {int} {int}', function (a, b, c) {
  passkey.enter(a);
  passkey.enter(b);
  passkey.enter(c);
});

Then('the passkey should unlock', function () {
  assert.equal(passkey.unlock, true);
});

Then('the passkey should not unlock', function () {
  assert.equal(passkey.unlock, false);
});

When('I reset the passkey', function () {
  passkey.reset(true);
});

Then('the entry should be empty', function () {
  assert.deepEqual(passkey.getEntry(), new Array(PASSWORD_SIZE));
});

// pinpad

Given('a new Pinpad', function () {
  pad = new Pinpad();
});

Then('the pinpad state should be IDLE', function () {
  assert.equal(pad.state, 0); // state.IDLE = 0
});

Then('the pinpad should have 10 pin buttons', function () {
  assert.equal(pad.pins.length, 10);
});

Then('the pinpad password should have length 3', function () {
  assert.equal(pad.key.answer.length, PASSWORD_SIZE);
});
