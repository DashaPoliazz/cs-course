const assert = require("node:assert");
const { it } = require("node:test");
const partial = require("./partialApplication.js");

const add = (a, b, c) => a + b + c;

it("should apply arguments partially", () => {
  const partialAdd = partial(add, 1);
  const result = partialAdd(2, 3);
  assert.strictEqual(result, 6, "partialAdd(2, 3) should equal 6");
});

it("should handle multiple partial applications", () => {
  const partialAdd = partial(add, 1, 2);
  const result = partialAdd(3);
  assert.strictEqual(result, 6, "partialAdd(3) should equal 6");
});

it("should work with no initial arguments", () => {
  const partialAdd = partial(add);
  const result = partialAdd(1, 2, 3);
  assert.strictEqual(result, 6, "partialAdd(1, 2, 3) should equal 6");
});

it("should return the same result as the original function when no arguments are partially applied", () => {
  const partialAdd = partial(add);
  const result = partialAdd(1, 2, 3);
  const expected = add(1, 2, 3);
  assert.strictEqual(
    result,
    expected,
    "partialAdd(1, 2, 3) should equal add(1, 2, 3)",
  );
});
