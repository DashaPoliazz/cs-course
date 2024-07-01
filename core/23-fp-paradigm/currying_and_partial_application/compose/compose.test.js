const assert = require("node:assert");
const { it } = require("node:test");
const compose = require("./compose");

// Test case 1: Basic composition
it("should compose correctly", () => {
  const f = compose(
    (a) => a ** 2,
    (a) => a * 10,
    (a) => Math.sqrt(a),
  );

  const result = f(16);
  assert.strictEqual(
    result,
    1600,
    "Composition did not produce the expected result",
  );
});

// Test case 2: Composition with identity function
it("should return identity function if no functions are provided", () => {
  const f = compose();
  const result = f(10);
  assert.strictEqual(
    result,
    10,
    "Identity function should return the argument unchanged",
  );
});

// Test case 3: Composition with a single function
it("should return the result of a single function", () => {
  const f = compose((a) => a * 2);
  const result = f(5);
  assert.strictEqual(
    result,
    10,
    "Composition with a single function did not produce the expected result",
  );
});

// Test case 4: Composition with functions that throw errors
it("should handle functions that throw errors", () => {
  const throwError = () => {
    throw new Error("Test error");
  };

  const f = compose(throwError, (a) => a * 2);

  assert.throws(
    () => {
      f(5);
    },
    Error,
    "Composition did not throw the expected error",
  );
});

// Test case 6: Composition with no arguments passed to `compose`
it("should return identity function if no arguments are passed to compose", () => {
  const f = compose();
  const result = f(10);
  assert.strictEqual(
    result,
    10,
    "Identity function should return the argument unchanged",
  );
});
