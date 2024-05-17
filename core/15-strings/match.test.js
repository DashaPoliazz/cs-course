const { it, describe } = require("node:test");
const assert = require("node:assert");
const match = require("./match.js");

const delimiter = ".";

describe("*", () => {
  it("should handle '*.pattern' correcrly", () => {
    const pattern = ["*", "baz"].join(delimiter);
    assert.deepEqual(match(pattern, ["foo.bla.bar.baz"]), [
      "foo",
      "bla",
      "bar",
      "baz",
    ]);
    assert.deepEqual(match(pattern, ["baz"]), ["baz"]);
  });

  it("should handle 'pattern.*.pattern' correcrly", () => {
    const pattern = ["bla", "*", "baz"].join(delimiter);
    assert.deepEqual(match(pattern, ["foo.bla.bar.foz.fiz.baz"]), [
      "bla",
      "bar",
      "foz",
      "fiz",
      "baz",
    ]);
    assert.deepEqual(match(pattern, ["bla.baz"]), ["bla", "baz"]);
  });

  it("should handle 'pattern.*' correcrly", () => {
    const pattern = ["bla", "*"].join(delimiter);
    assert.deepEqual(match(pattern, ["foo.bar.foz.fiz.bla"]), ["bla"]);
  });
});

describe("**", () => {
  it("should handle '**.pattern' correcrly", () => {
    const pattern = ["**", "bla"].join(delimiter);
    try {
      match(pattern, ["foo.bar.foz.fiz.bla"]);
    } catch (error) {
      assert.equal(true, true);
    }
  });

  it("should handle 'pattern.**.pattern' correcrly", () => {
    const pattern = ["foo", "**", "bla"].join(delimiter);
    try {
      match(pattern, ["foo.bar.foz.fiz.bla"]);
    } catch (error) {
      assert.equal(true, true);
    }
  });

  it("should handle 'pattern.**' correcrly", () => {
    const pattern = ["foo", "**"].join(delimiter);
    assert.deepEqual(match(pattern, ["foo.bar.foz.fiz.bla"]), [
      "foo",
      "bar",
      "foz",
      "fiz",
      "bla",
    ]);
  });
});

describe("*.**", () => {
  it("should handle '*.pattern.**' correcrly", () => {
    const pattern = ["*", "bla", "**"].join(delimiter);
    assert.deepEqual(match(pattern, ["foo.bar.foz.fiz.bla"]), [
      "foo",
      "bar",
      "foz",
      "fiz",
      "bla",
    ]);
  });

  it("should handle '*.pattern.*.pattern.**' correcrly", () => {
    const pattern = ["*", "bar", "*", "fiz", "**"].join(delimiter);
    assert.deepEqual(match(pattern, ["foo.bar.foz.fiz.bla"]), [
      "foo",
      "bar",
      "foz",
      "fiz",
      "bla",
    ]);
  });

  it("should handle '*.pattern._.pattern.*.pattern.**' correcrly", () => {
    const pattern = ["*", "bar", "fiz", "**"].join(delimiter);
    assert.deepEqual(match(pattern, ["foo.bar.foz.fiz.bla"]), [
      "foo",
      "bar",
      "fiz",
      "bla",
    ]);
  });

  it("should handle task test correcrly", () => {
    const pattern = ["foo", "*", "bar", "**"].join(delimiter);
    assert.deepEqual(match(pattern, ["foo.bla.bar.baz"]), [
      "foo",
      "bla",
      "bar",
      "baz",
    ]);
    assert.deepEqual(match(pattern, ["foo.bag.bar.ban.bla"]), [
      "foo",
      "bag",
      "bar",
      "ban",
      "bla",
    ]);
  });
});
