/**
 * Represents a node in the tree.
 * @class
 */
class Node {
  /**
   * Creates an instance of Node.
   * @constructor
   */
  constructor(alphabet) {
    /**
     * Holds all children nodes.
     * @type {Node[]}
     */
    this.children = new Array(alphabet.length).fill(-1);

    /**
     * Indicates whether this node is a terminal node in the tree.
     * @type {boolean}
     */
    this.term = false;
  }

  static new(alphabet) {
    return new Node(alphabet);
  }
}

module.exports = Node;
