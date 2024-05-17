const { it, describe } = require("node:test");
const assert = require("node:assert");
const Trie = require("./wordTrie.js");

describe("isertion", () => {
  it("should insert single word in the trie correctly", () => {
    const trie = new Trie();
    trie.insert("foo");
    assert.equal(trie.includes("foo"), true);
  });

  it("should insert keys correctly", () => {
    const trie = new Trie(".");
    trie.insert("foo");
    trie.insert("foo.bla.bar.baz");
    trie.insert("foo.bag.bar.ban.bla");
    assert.equal(trie.includes("foo"), true);
    assert.equal(trie.includes("foo.bla.bar.baz"), true);
    assert.equal(trie.includes("foo.bag.bar.ban.bla"), true);
  });
});

describe("includes", () => {
  it("should return true if the key doens't exist in the trie", () => {
    const trie = new Trie();
    trie.insert("foo");
    assert.equal(trie.includes("bar"), false);
  });
});
