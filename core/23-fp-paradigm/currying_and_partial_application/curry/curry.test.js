const assert = require("node:assert");
const { it } = require("node:test");
const curry = require("./curry.js");

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

it("should return correct result when called with all arguments at once", () => {
  const result = curriedAdd(1, 2, 3);
  assert.strictEqual(result, 6, "curriedAdd(1, 2, 3) should equal 6");
});

it("should return correct result when called with one argument at a time", () => {
  const result = curriedAdd(1)(2)(3);
  assert.strictEqual(result, 6, "curriedAdd(1)(2)(3) should equal 6");
});

it("should return correct result when called with two arguments first and one argument later", () => {
  const result = curriedAdd(1, 2)(3);
  assert.strictEqual(result, 6, "curriedAdd(1, 2)(3) should equal 6");
});

it("should return correct result when called with one argument first and two arguments later", () => {
  const result = curriedAdd(1)(2, 3);
  assert.strictEqual(result, 6, "curriedAdd(1)(2, 3) should equal 6");
});
