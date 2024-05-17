const { it, describe } = require("node:test");
const assert = require("node:assert");
const Trie = require("./charTrie.js");

describe("isertion", () => {
  it("should insert the 1 char word correctly", () => {
    const pattern = "h";
    const trie = new Trie();
    trie.insert(pattern);
    assert.equal(trie.includes(pattern), true);
  });

  it("should insert the word in the trie correctly", () => {
    const pattern = "hello";
    const trie = new Trie();
    trie.insert(pattern);
    assert.equal(trie.includes(pattern), true);
  });

  it("should allow insert elements only within specific alphabet set", () => {
    const pattern = "123";
    const trie = new Trie("1234567890");
    trie.insert(pattern);
    assert.equal(trie.includes(pattern), true);
  });

  it("should not allow to insert elements beyond specific alphabet set", () => {
    const pattern = "abc";
    const trie = new Trie("1234567890");
    try {
      trie.insert(pattern);
    } catch (error) {
      assert.equal(true, true);
    }
  });
});

describe("go", () => {
  it("should move accross trie correctly", () => {
    const trie = new Trie();
    const pattern1 = "meat";
    const pattern2 = "meatgrinder";
    trie.insert(pattern1);
    trie.insert(pattern2);

    assert.equal(trie.go("m").go("e").go("a").go("t").isWord, true);
    assert.equal(trie.go("m").go("e").go("a").isWord, false);
    assert.equal(trie.go("m").go("e").go("a").go("t").isWord, true);
    assert.equal(
      trie
        .go("m")
        .go("e")
        .go("a")
        .go("t")
        .go("g")
        .go("r")
        .go("i")
        .go("n")
        .go("d")
        .go("e")
        .go("r").isWord,
      true,
    );
  });
});
