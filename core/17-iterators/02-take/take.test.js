const { it, describe } = require("node:test");
const take = require("./take.js");
const assert = require("assert");

// Create a test suite using the describe function
describe("take", () => {
  // Test case 1: Taking elements from an array
  it("should take elements from an array", () => {
    const iterable = [1, 2, 3, 4, 5];
    const result = [...take(iterable, 3)];
    assert.deepStrictEqual(result, [1, 2, 3]);
  });

  // Test case 2: Taking elements from a string
  it("should take elements from a string", () => {
    const iterable = "hello";
    const result = [...take(iterable, 2)];
    assert.deepStrictEqual(result, ["h", "e"]);
  });

  // Test case 3: Taking elements from an iterable with a custom iterator
  it("should take elements from an iterable with a custom iterator", () => {
    const customIterable = {
      *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
        yield 5;
      },
    };
    const result = [...take(customIterable, 4)];
    assert.deepStrictEqual(result, [1, 2, 3, 4]);
  });

  // Test case 4: Taking more elements than available
  it("should take all available elements when count exceeds iterable length", () => {
    const iterable = [1, 2, 3];
    const result = [...take(iterable, 5)];
    assert.deepStrictEqual(result, [1, 2, 3]);
  });

  // Test case 5: Taking elements from an empty iterable
  it("should return an empty array when taking elements from an empty iterable", () => {
    const emptyIterable = [];
    const result = [...take(emptyIterable, 3)];
    assert.deepStrictEqual(result, []);
  });
});
