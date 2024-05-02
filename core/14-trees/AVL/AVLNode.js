const Node = require("../Node/Node.js");

class AVLNode extends Node {
  /**
   * Represents a node in an AVL tree.
   * @template T
   * @typedef {Object} AVLNode
   * @property {T} value - The value of the node.
   * @property {AVLNode<T>} left - The left child node.
   * @property {AVLNode<T>} right - The right child node.
   * @property {number} height - The height of the node. (height of the leaf node is 0)
   * @property {number} balanceFactor - balance factor (bf is right subtree height - left subtree height)
   */
  constructor(value) {
    super(value);
    this.balanceFactor = 0;
    this.height = 0;
  }
}

module.exports = AVLNode;
