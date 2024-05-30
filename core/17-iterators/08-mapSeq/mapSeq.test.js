const mapSeq = require("./mapSeq.js");
const { it } = require("node:test");
const assert = require("node:assert");

it("should mapSeq correctly with simple transformations", () => {
  const mappers = [(el) => el * 2, (el) => el - 1];
  const iterable = mapSeq([1, 2, 3], ...mappers);
  const result = [...iterable];
  assert.deepStrictEqual(result, [1, 3, 5]);
});

it("should handle empty iterables", () => {
  const mappers = [(el) => el * 2, (el) => el - 1];
  const iterable = mapSeq([], ...mappers);
  const result = [...iterable];
  assert.deepStrictEqual(result, []);
});

it("should handle single element iterable", () => {
  const mappers = [(el) => el * 2, (el) => el - 1];
  const iterable = mapSeq([5], ...mappers);
  const result = [...iterable];
  assert.deepStrictEqual(result, [9]);
});

it("should handle no mappers", () => {
  const iterable = mapSeq([1, 2, 3]);
  const result = [...iterable];
  assert.deepStrictEqual(result, [1, 2, 3]);
});

it("should handle different types of iterables", () => {
  const mappers = [(el) => el.toUpperCase(), (el) => `${el}!`];
  const iterable = mapSeq("abc", ...mappers);
  const result = [...iterable];
  assert.deepStrictEqual(result, ["A!", "B!", "C!"]);
});

it("should handle complex mappers", () => {
  const mappers = [
    (el) => ({ ...el, value: el.value * 2 }),
    (el) => ({ ...el, value: el.value - 1 }),
  ];
  const iterable = mapSeq(
    [{ value: 1 }, { value: 2 }, { value: 3 }],
    ...mappers,
  );
  const result = [...iterable];
  assert.deepStrictEqual(result, [{ value: 1 }, { value: 3 }, { value: 5 }]);
});

console.log("All tests passed!");
