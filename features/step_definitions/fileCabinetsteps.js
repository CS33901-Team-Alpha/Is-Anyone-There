import { Given, When, Then } from "@cucumber/cucumber";
import assert from "assert";
import { FileCabinetModel, OpenCabinetModel } from "../../src/models/puzzles/first/FileCabinetModel.js";

let cabinet;
let result;
let openModel;

Given('a FileCabinetModel with id {string} at position {int} {int}', function (id, x, y) {
  cabinet = new FileCabinetModel(id, x, y);
});


When('I check if point {int} {int} is inside', function (mx, my) {
  result = cabinet.containsPoint(mx, my);
});


Then('the result should be true', function () {
  assert.equal(result, true);
});


Then('the result should be false', function () {
  assert.equal(result, false);
});


Given('a new OpenCabinetModel', function () {
  openModel = new OpenCabinetModel();
});


Then('the cabinet should not be active', function () {
  assert.equal(openModel.active, false);
});


Then('the random number should be between 0 and 3', function () {
  assert.ok(openModel.number >= 0 && openModel.number <= 3);
});


Then('the cabinet should be locked', function () {
  assert.equal(cabinet.locked, true);
});


Then('the cabinet width should be {float}', function (width) {
  assert.equal(cabinet.width, width);
});


Then('the cabinet height should be {float}', function (height) {
  assert.equal(cabinet.height, height);
});
