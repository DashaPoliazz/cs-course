const Node = require("./RBNode.js");
const COLORS = require("./colors.js");

class RB {
  /**
   * Comparison result should return: -1, 0 or 1.
   * -1 if the x1 > x2
   * 0  if x1 === x2
   * 1  if the x2 > x1
   *
   * @param {(x1: T, x2: T) => -1 | 0 | 1} comparator
   */
  constructor(comparator) {
    this.comparator = comparator;
    this.root = null;
  }

  /**
   * Returns the height of the tree.
   *
   * Complexity:
   * - T = O(N)
   * - S = O(N)
   *
   * @returns {number}
   */
  get height() {
    return this.#height(this.root);
  }

  /**
   * Returns the height of the tree.
   *
   * Complexity:
   * - T = O(N)
   * - S = O(N)
   *
   * @param {Node} node
   * @param {number} h
   * @returns {number} the height of the node
   */
  #height(node, h = 0) {
    if (!node) return h;

    const leftSubtreeHeight = this.#height(node.left, h + 1);
    const rightSubtreeHeight = this.#height(node.right, h + 1);

    return Math.max(leftSubtreeHeight, rightSubtreeHeight);
  }

  *inorder(root = this.root) {
    if (!root) return;
    yield* this.inorder(root.left);
    yield root.value;
    yield* this.inorder(root.right);
  }
  *preorder(root = this.root) {
    if (!root) return;
    yield root.value;
    yield* this.preorder(root.left);
    yield* this.preorder(root.right);
  }
}

module.exports = RB;
