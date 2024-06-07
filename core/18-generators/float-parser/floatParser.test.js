const assert = require("node:assert");
const { it, describe } = require("node:test");
const FloatParser = require("./FloatParser.js");

describe("FloatParser", () => {
  it("should parse floating-point numbers correctly and handle new text inputs", () => {
    const iter = FloatParser.Parse(
      "hello 123 534.234 -56.78 9.0 100. 0.001 -0.5",
    ).iter();

    assert.strictEqual(iter.next().value, "534.234");
    assert.strictEqual(iter.next().value, "-56.78");
    assert.strictEqual(iter.next().value, "9.0");
    assert.strictEqual(iter.next().value, "100.");
    assert.strictEqual(iter.next().value, "0.001");
    assert.strictEqual(iter.next().value, "-0.5");
    assert.strictEqual(iter.next().value, "_");

    assert.strictEqual(iter.next("-56.78 9.0").value, "-56.78");
    assert.strictEqual(iter.next().value, "9.0");
    assert.strictEqual(iter.next().value, "_");
  });

  it("should handle queue correcrly", () => {
    const iter = FloatParser.Parse().iter();

    iter.next("534.234");
    assert.strictEqual(iter.next("534.234").value, "534.234");
    iter.next("423.4 22.2");
    assert.strictEqual(iter.next().value, "423.4");
    assert.strictEqual(iter.next("1.0").value, "22.2");
    assert.strictEqual(iter.next().value, "_");
    assert.strictEqual(iter.next().value, "1.0");
  });
});
