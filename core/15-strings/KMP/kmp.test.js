const { it, describe } = require("node:test");
const assert = require("node:assert");
const { KMP, buildP } = require("./kmp.js");

describe("p", () => {
  it("should buil array of prefixes and suffixes correctly", () => {
    const pattern = "лилила";
    const p = buildP(pattern);
    assert.deepEqual(p, [0, 0, 1, 2, 3, 0]);
  });
});

describe("KMP", () => {
  it("should find the substring correctly", () => {
    const haystack = "лилилилась лилилось";
    const pattern = "лилила";
    assert.deepEqual(KMP(haystack, pattern), true);
  });

  it("should find the substring that doesn't exist correctly", () => {
    const haystack = "лилилилась лилилось";
    const pattern = "x";
    assert.deepEqual(KMP(haystack, pattern), false);
  });
});
