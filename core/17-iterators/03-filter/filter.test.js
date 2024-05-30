const { it, describe } = require("node:test");
const filter = require("./filter.js");
const assert = require("assert");
const random = require("../01-rand/rand.js");
const take = require("../02-take/take.js");

// Create a test suite using the describe function
describe("filter", () => {
  // Test case 1: Filtering even numbers from an array
  it("should filter even numbers from an array", () => {
    const iterable = [1, 2, 3, 4, 5];
    const result = [...filter(iterable, (num) => num % 2 === 0)];
    assert.deepStrictEqual(result, [2, 4]);
  });

  // Test case 2: Filtering strings with length greater than 3
  it("should filter strings with length greater than 3", () => {
    const iterable = ["apple", "banana", "kiwi", "grape", "orange"];
    const result = [...filter(iterable, (str) => str.length > 3)];
    assert.deepStrictEqual(result, [
      "apple",
      "banana",
      "kiwi",
      "grape",
      "orange",
    ]);
  });

  // Test case 3: Filtering numbers greater than 10
  it("should filter numbers greater than 10", () => {
    const iterable = [5, 10, 15, 20, 25];
    const result = [...filter(iterable, (num) => num > 10)];
    assert.deepStrictEqual(result, [15, 20, 25]);
  });

  // Test case 4: Filtering elements from an empty iterable
  it("should return an empty array when filtering elements from an empty iterable", () => {
    const emptyIterable = [];
    const result = [...filter(emptyIterable, () => true)];
    assert.deepStrictEqual(result, []);
  });

  // Test case 5: Take with filter
  it("should take and filter random elements correcrly", () => {
    const randomIterable = random();
    const predicate = (el) => el < 30;
    const filterIterable = filter(randomIterable, predicate);
    const limit = 10;
    const generatedElements = [...take(filterIterable, limit)];
    const incorrectValues = generatedElements.filter(predicate);
    assert.equal(generatedElements.length, incorrectValues.length);
  });
});
