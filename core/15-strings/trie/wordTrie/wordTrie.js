const Node = require("./wordNode.js");

class WordTrie {
  /**
   * Create a WordTrie.
   * @param {string} splitter - The delimiter used to split the keys.
   */
  constructor(splitter) {
    this.splitter = splitter;
    this.root = new Node();
  }

  /**
   * Insert a key into the trie.
   * @param {string} key - The key to be inserted.
   * @timecomplexity O(n) where n is the length of pattern
   * @spacecomplexity O(n) where n is the length of pattern
   */
  insert(key) {
    const words = key.split(this.splitter);
    let curr = this.root;
    for (const word of words) {
      if (!curr.children.has(word)) curr.children.set(word, new Node());
      curr = curr.children.get(word);
    }
    curr.term = true;
  }

  /**
   * Check if a key is present in the trie.
   * @param {string} key - The key to be checked.
   * @returns {boolean} - Returns true if the key is found, false otherwise.
   * @timecomplexity O(n) where n is the number of all nodes in tree
   * @spacecomplexity O(n) where n is the number of all nodes in tree
   */
  includes(key) {
    const words = key.split(this.splitter);

    const lookup = (node, cursor) => {
      if (cursor >= words.length) return true;
      if (!node.children.has(words[cursor])) return false;

      for (const child of node.children.values()) {
        if (lookup(child, cursor + 1)) return true;
      }
    };

    return lookup(this.root, 0);
  }
}

module.exports = WordTrie;
