const { it, describe } = require("node:test");
const assert = require("node:assert");
const c = require("./skipCurry.js");

describe("curry function tests", () => {
  it("should curry and subtract correctly with skipped placeholders", () => {
    const subtract = (a, b) => a - b;
    const diff = c(subtract);
    const result = diff(c._)(c._)(15)(10);
    assert.strictEqual(result, 5);
  });

  it("should curry and add correctly with mixed placeholders", () => {
    const add = (a, b, c, d, e) => a + b + c + d + e;
    const curriedAddWith_a_c_e = c(add)(/*a*/ 1)(/*b*/ c._)(/*c*/ 2)(/*d*/ c._)(
      /*e*/ 3,
    );
    const fullCurriedAdd = curriedAddWith_a_c_e(4)(5);
    assert.strictEqual(fullCurriedAdd, 15);
  });

  it("should curry and subtract correctly with interspersed placeholders", () => {
    const subtract = (a, b) => a - b;
    const diff2 = c(subtract)(c._, 10)(15);
    const result = diff2;
    assert.strictEqual(result, 5);
  });

  // Additional tests
  it("should curry and subtract correctly without placeholders", () => {
    const subtract = (a, b) => a - b;
    const diff = c(subtract);
    const result = diff(15)(10);
    assert.strictEqual(result, 5);
  });

  it("should curry and add correctly with no placeholders", () => {
    const add = (a, b, c, d, e) => a + b + c + d + e;
    const result = c(add)(1)(2)(3)(4)(5);
    assert.strictEqual(result, 15);
  });

  it("should curry and add correctly with multiple placeholders", () => {
    const add = (a, b, c, d, e) => a + b + c + d + e;

    assert.throws(() => {
      c(add)(c._)(2)(1)(c._)(4)(c._)(3)(5);
    }, new Error("There is only possible to skip 5 argumnet. Trying to skip 5"));
  });
});
