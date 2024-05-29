const { it } = require("node:test");
const assert = require("node:assert");
const NumberRange = require("./NumberRange.js");

it("should be able to iterate over numbers inside exclude range", () => {
  const iter = NumberRange.new(1, 10);
  assert.deepEqual([...iter], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

it("should be able to iterate over numbers inside include range", () => {
  const iter = NumberRange.new(1, 10, true);
  assert.deepEqual([...iter], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

it("should be able to iterate over numbers with step", () => {
  const iter = NumberRange.new(1, 100, false, 5);
  assert.deepEqual(
    [...iter],
    [
      1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76, 81, 86, 91,
      96,
    ],
  );
});

it("should be able to iterate over numbers inside included range", () => {
  const iter = NumberRange.new(1, 10, true);
  assert.deepEqual([...iter], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});
