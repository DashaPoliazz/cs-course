class AhoCorasickNode {
  constructor() {
    this.children = {};
    this.output = [];
    this.failure = null;
  }
}

class AhoCorasick {
  constructor() {
    this.root = new AhoCorasickNode();
  }

  addPattern(pattern, output) {
    let node = this.root;

    for (const char of pattern) {
      if (!node.children[char]) {
        node.children[char] = new AhoCorasickNode();
      }
      node = node.children[char];
    }

    node.output.push(output);
  }

  buildFailureFunction() {
    const queue = [];

    // Set failure for depth 1 nodes to root
    for (const child in this.root.children) {
      this.root.children[child].failure = this.root;
      queue.push(this.root.children[child]);
    }

    while (queue.length > 0) {
      const currentNode = queue.shift();

      for (const key in currentNode.children) {
        const child = currentNode.children[key];
        queue.push(child);

        let failureNode = currentNode.failure;

        while (failureNode !== null && !failureNode.children[key]) {
          failureNode = failureNode.failure;
        }

        child.failure = failureNode
          ? failureNode.children[key] || this.root
          : this.root;

        child.output = child.output.concat(child.failure.output);
      }
    }
  }

  search(text, callback) {
    let currentNode = this.root;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      while (currentNode !== null && !currentNode.children[char]) {
        currentNode = currentNode.failure;
      }

      currentNode = currentNode
        ? currentNode.children[char] || this.root
        : this.root;

      for (const output of currentNode.output) {
        callback(i - output.length + 1, output);
      }
    }
  }
}

// Example:

const ac = new AhoCorasick();

ac.addPattern("a", "a");
ac.addPattern("b", "ab");
ac.addPattern("bab", "bab");
ac.addPattern("bc", "bc");
ac.addPattern("bca", "bca");
ac.addPattern("c", "c");
ac.addPattern("caa", "caa");

ac.buildFailureFunction();

const text = "abcbbcababz";

ac.search(text, (index, output) => {
  console.log(`Pattern "${output}" found at index ${index}`);
});
