const Node = require("./node.js");

const DEFAULT_ALPHABET = "abcdefghijklmnopqrstuvwxyz";

/**
 * Represents a trie data structure.
 */
class Trie {
  #createNode;

  /**
   * Creates an instance of Trie. The nodes is stored in the array.
   * @param {string} [alphabet=DEFAULT_ALPHABET] - The alphabet used for constructing the trie.
   */
  constructor(alphabet = DEFAULT_ALPHABET) {
    /**
     * An array to store all nodes in the trie.
     * @type {Node[]}
     */
    this.nodes = [];

    /**
     * A function to create a new node with the specified alphabet.
     * @type {Function}
     * @private
     */
    this.#createNode = Node.new.bind(null, alphabet);

    /**
     * The root node of the trie.
     * @type {Node}
     */
    this.root = this.#createNode();
    this.nodes.push(this.root);

    /**
     * The alphabet used for constructing the trie.
     * @type {string}
     */
    this.alphabet = alphabet;
  }

  /**
   * Inserts a pattern into the trie.
   *
   * @param {string} pattern - The pattern to insert into the trie.
   * @timecomplexity O(m) where m is the length of pattern
   * @spacecomplexity O(m) where m is the length of pattern
   */
  insert(pattern) {
    let curr = this.root;

    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i];
      const [outOfBounds, charPosition] = this.#charPosition(char);
      if (outOfBounds) throw new Error(`${char} ∉ ${this.alphabet}`);

      if (curr.children[charPosition] === -1) {
        const newNode = this.#createNode();
        this.nodes.push(newNode);
        curr.children[charPosition] = this.nodes.at(-1);
      }

      curr = curr.children[charPosition];
    }

    curr.term = true;
  }

  /**
   * Checks if the trie includes the given pattern.
   *
   * @param {string} pattern - The pattern to search for in the trie.
   * @returns {boolean} - True if the trie includes the pattern, false otherwise.
   * @timecomplexity O(m) where m is the length of pattern
   * @spacecomplexity O(1) where m is the length of pattern
   */
  includes(pattern) {
    let curr = this.root;

    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i];
      const [_, charPosition] = this.#charPosition(char);
      if (curr.children[charPosition] === -1) return false;
      curr = curr.children[charPosition];
    }

    return curr.term;
  }

  /**
   * Returns a functor that represents the traversal of the
   * trie starting from the current node with the given character.
   *
   * @param {string} char
   * @returns {Object}
   */
  go(char) {
    const Box = (node) => ({
      go: (char) => {
        const [_, charPosition] = this.#charPosition(char);
        const boxedNode =
          node.children[charPosition] === -1
            ? this.#createNode()
            : node.children[charPosition];
        return Box(boxedNode);
      },
      isWord: node.term,
    });

    return Box(this.root).go(char);
  }

  /**
   * Determines the position of a character in the alphabet.
   * If char doesn't exist in the set, then the true as first item of tuple
   * will be returned
   * @param {string} char - The character to find the position of.
   * @returns {[boolean, number]} - A tuple containing a boolean indicating whether the character is out of bounds and the position of the character in the alphabet.
   */
  #charPosition(char) {
    const charPosition = char.charCodeAt() - this.alphabet[0].charCodeAt();
    const outOfBounds =
      charPosition < 0 || charPosition >= this.alphabet.length;
    return [outOfBounds ? true : false, charPosition];
  }
}

module.exports = Trie;
