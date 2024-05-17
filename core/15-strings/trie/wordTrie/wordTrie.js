const Node = require("./wordNode.js");

class WordTrie {
  constructor(splitter) {
    this.splitter = splitter;
    this.root = new Node();
  }

  insert(key) {
    const words = key.split(this.splitter);
    let curr = this.root;
    for (const word of words) {
      if (!curr.children.has(word)) curr.children.set(word, new Node());
      curr = curr.children.get(word);
    }
    curr.term = true;
  }

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
