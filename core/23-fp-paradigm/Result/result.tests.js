const Result = require("./Result.js");
const assert = require("node:assert");
const { it } = require("node:test");

it("should map over the value correctly", () => {
  const result = Result.new(() => 42);
  let count = 0;
  const addOne = (x) => x + 1;
  result
    .map(addOne)
    .map(addOne)
    .map(addOne)
    .map(addOne)
    .map(addOne)
    .then((x) => {
      assert.equal(x, 47);
    });
});

it("should flatMap value correctly", () => {
  const result = Result.new(10);

  result
    .map((value) => value + 5)
    .flatMap((value) => Result.new(value * 2))
    .catch(console.error);
});
