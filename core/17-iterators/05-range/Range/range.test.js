const { it } = require("node:test");
const assert = require("node:assert");
const Range = require("./Range.js");

it("should throw error if the types are incompatable", () => {
  try {
    const str = "foo";
    const num = 42;
    new Range(str, num);
  } catch (error) {
    assert(true);
  }
});

it("should accept 'start' and 'end' of the same types", () => {
  const start = "a";
  const end = "z";
  const range = new Range(start, end);
});

it("should throw error if 'start' and 'end' are strings but have different lengthes", () => {
  try {
    const start = "foo";
    const end = "bazz";
    new Range(start, end);
  } catch (error) {
    assert(true);
  }
});

it("should typecast 'start' and 'end' if both are strings that could be typecasted to numbers", () => {
  const start = "12";
  const end = "156";
  new Range(start, end);
});

it("should throw error if 'start' and 'end' if both are strings that could be typecasted to numbers but end > start", () => {
  try {
    const start = "42";
    const end = "10";
    new Range(start, end);
  } catch (error) {
    assert(true);
  }
});
