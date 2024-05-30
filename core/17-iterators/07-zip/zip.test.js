const zip = require("./zip.js");
const { it } = require("node:test");
const assert = require("node:assert");

it("should be aligned at minimum length", () => {
  assert.deepEqual(
    [...zip([1, 2], new Set([3, 4]), "bl")],
    [
      [1, 3, "b"],
      [2, 4, "l"],
    ],
  );
});

it("should ignore the iterators with the length greater than minumum", () => {
  assert.deepEqual([...zip([1], new Set([1, 2]), "abc")], [[1, 1, "a"]]);
});

it("should ignore the iterators with the length greater than 0", () => {
  assert.deepEqual([...zip([], new Set([1, 2]), "abc")], []);
});
