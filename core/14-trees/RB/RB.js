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

  /**
   * Measures the black height of the provided node. Current node is
   * included (if the current node is black, then it will be included in the height)
   *
   * @param {Node} node
   * @returns {[number, number]} [leftSubtreeBlackHeight, rightSubtreeBlackHeight]
   */
  getBlackHeight(node = this.root) {
    const measureBlackHeight = (node, counter) => {
      // The leaf nullPtr is black, that's why 'counter + 1'
      if (!node) return [counter + 1, counter + 1];

      let leftCounter =
        node.left?.color === COLORS.BLACK ? counter + 1 : counter;
      let rightCounter =
        node.right?.color === COLORS.BLACK ? counter + 1 : counter;

      let [leftLeftHeight, leftRightHeight] = measureBlackHeight(
        node.left,
        leftCounter,
      );
      let [rightLeftHeight, rightRightHeight] = measureBlackHeight(
        node.right,
        rightCounter,
      );

      return [
        Math.max(leftLeftHeight, leftRightHeight),
        Math.max(rightLeftHeight, rightRightHeight),
      ];
    };

    const counter = node?.color === COLORS.BLACK ? 1 : 0;

    return measureBlackHeight(node, counter);
  }

  // TODO:
  // [ ] move validations from the RB logic
  /**
   * Validates Red-Black tree according to following rules:
   * 1. All nodes should be painted at either 'Red' or 'Black.
   * 2. The root should always be painted at 'Black'.
   * 3. Each node should have at least 2 children. They could be leafs without values.
   * 4. All red's children are black.
   * 5. All nodes's 'black-height' should be equal
   *
   * @param {Node} node
   * @returns boolean
   */
  validate(node = this.root) {
    const sequenceValidation = this.validateSequence(node);
    const colorsValidation = this.validateColors(node);
    const blackHegithValidation = this.validateBlackHeight(node);

    return sequenceValidation && colorsValidation && blackHegithValidation;
  }

  /**
   * Red-black tree must maintain the binary search tree requirements.
   *
   * @param {Node} node
   * @returns boolean
   */
  validateSequence(node = this.root) {
    if (node?.left) {
      const comparison = this.comparator(node.value, node.left.value);
      if (comparison > 0) return false;
      else return this.validateSequence(node.left);
    }

    if (node?.right) {
      const comparison = this.comparator(node.value, node.right.value);
      if (comparison < 1) return false;
      else return this.validateSequence(node.right);
    }

    return true;
  }

  /**
   * Validates the rule #2: "The root should always be painted at 'Black'."
   * Validates the rule #4: "All red's children are black."
   *
   * @param {Node} node
   * @returns boolean
   */
  validateColors(node) {
    if (!node) return true;
    // rule #2 violation
    if (node === this.root && node.color === COLORS.RED) return false;
    if (node.color === COLORS.RED) {
      // rule #4 violation
      if (node.parent && node.parent.color === COLORS.RED) return false;
    }

    const left = this.validateColors(node.left);
    const right = this.validateColors(node.right);

    return left && right;
  }

  /**
   * Validates the rule #5: "All nodes's 'black-height' should be equal"
   *
   * @param {Node} node
   * @returns boolean
   */
  validateBlackHeight(node = this.root) {
    const [leftBlackHeight, rightBlackHeight] = this.getBlackHeight(node);
    return leftBlackHeight === rightBlackHeight;
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
