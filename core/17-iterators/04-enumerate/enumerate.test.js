const { it, describe } = require("node:test");
const enumerate = require("./enumerate.js");
const assert = require("assert");

// Create a test suite using the describe function
describe("enumerate", () => {
  // Test case 1: Enumerate elements from an array
  it("should enumerate elements from an array", () => {
    const iterable = ["a", "b", "c"];
    const result = [...enumerate(iterable)];
    assert.deepStrictEqual(result, [
      [0, "a"],
      [1, "b"],
      [2, "c"],
    ]);
  });

  // Test case 2: Enumerate elements from a string
  it("should enumerate elements from a string", () => {
    const iterable = "hello";
    const result = [...enumerate(iterable)];
    assert.deepStrictEqual(result, [
      [0, "h"],
      [1, "e"],
      [2, "l"],
      [3, "l"],
      [4, "o"],
    ]);
  });

  // Test case 3: Enumerate elements from a custom iterable
  it("should enumerate elements from a custom iterable", () => {
    const customIterable = {
      *[Symbol.iterator]() {
        yield "x";
        yield "y";
        yield "z";
      },
    };
    const result = [...enumerate(customIterable)];
    assert.deepStrictEqual(result, [
      [0, "x"],
      [1, "y"],
      [2, "z"],
    ]);
  });

  // Test case 4: Enumerate elements from a generator function
  it("should enumerate elements from a generator function", () => {
    function* gen() {
      yield "one";
      yield "two";
      yield "three";
    }
    const result = [...enumerate(gen())];
    assert.deepStrictEqual(result, [
      [0, "one"],
      [1, "two"],
      [2, "three"],
    ]);
  });

  // Test case 5: Enumerate elements from an empty iterable
  it("should return an empty array when enumerating elements from an empty iterable", () => {
    const emptyIterable = [];
    const result = [...enumerate(emptyIterable)];
    assert.deepStrictEqual(result, []);
  });
});
