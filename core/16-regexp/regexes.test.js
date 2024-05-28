const { it, describe } = require("node:test");
const assert = require("node:assert");

describe("1-latin-letters-symbols", () => {
  const latinLettersSymbols = require("./1-latin-letters-symbols.js");

  it("should return true for strings with only latin letters, digits, underscore and $ sign", () => {
    assert.equal(latinLettersSymbols("hello"), true);
    assert.equal(latinLettersSymbols("Hello123"), true);
    assert.equal(latinLettersSymbols("test_123"), true);
    assert.equal(latinLettersSymbols("hello$world"), true);
    assert.equal(latinLettersSymbols("HELLO_WORLD123$"), true);
  });

  it("should return false for strings with characters other than latin letters, digits, underscore and $ sign", () => {
    assert.equal(latinLettersSymbols("hello world"), false); // contains space
    assert.equal(latinLettersSymbols("hello!"), false); // contains exclamation mark
    assert.equal(latinLettersSymbols("привет"), false); // contains Cyrillic letters
    assert.equal(latinLettersSymbols("123#"), false); // contains #
    assert.equal(latinLettersSymbols("test@test.com"), false); // contains @ and .
  });
});

describe("2-number-separator", () => {
  const numberSeparator = require("./2-number-separator.js");
  const str = "762120,0,22;763827,0,50;750842,0,36;749909,0,95;755884,0,41;";
  assert.deepEqual(numberSeparator(str), [
    "762120",
    "763827",
    "750842",
    "749909",
    "755884",
  ]);
});

describe("3-iterator", () => {
  const iterate = require("./3-iterator.js");

  it("should be able to iterate over the string correcrly", () => {
    const str = '{"a": 1, "b": "2"}';
    const iter = iterate(str);
    const ziped = Array.from(iter).map((match) => [
      match[0],
      match[1],
      match[2],
    ]);

    assert.deepEqual(ziped, [
      ['"a": 1', "a", "1"],
      ['"b": "2"', "b", '"2"'],
    ]);
  });
});
