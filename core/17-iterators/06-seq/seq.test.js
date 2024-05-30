const seq = require("./seq.js");
const { it } = require("node:test");
const assert = require("node:assert");

it("should traverse all iterators in the iterables", () => {
  assert.deepEqual(
    [...seq([1, 2], new Set([3, 4]), "bla")],
    [1, 2, 3, 4, "b", "l", "a"],
  );
});

it("should return empty collection if the args.length === 0", () => {
  assert.deepEqual([...seq()], []);
});
