const { it } = require("node:test");
const assert = require("node:assert");
const StringRange = require("./StringRange.js");

it("should iterate over range of strings exclusively", () => {
  const iter = StringRange.new("a", "z");
  assert.deepEqual(
    [...iter],
    [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
    ],
  );
});

it("should iterate over range of strings inclusively", () => {
  const iter = StringRange.new("a", "z", true);
  assert.deepEqual(
    [...iter],
    [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ],
  );
});

it("should iterate over range of strings which is numbers inclusively", () => {
  const iter = StringRange.new("1", "10");
  assert.deepEqual([...iter], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
