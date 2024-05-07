const RB = require("../RB.js");
const COLORS = require("../colors.js");

class RBValidator {
  /**
   * Measures the black height of the provided node. Current node is
   * included (if the current node is black, then it will be included in the height)
   *
   * @param {Node} node
   * @returns {[number, number]} [leftSubtreeBlackHeight, rightSubtreeBlackHeight]
   */
  static getBlackHeight(node = this.root) {
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

  /**
   * Validates Red-Black tree according to following rules:
   * 1. All nodes should be painted at either 'Red' or 'Black.
   * 2. The root should always be painted at 'Black'.
   * 3. Each node should have at least 2 children. They could be leafs without values.
   * 4. All red's children are black.
   * 5. All nodes's 'black-height' should be equal
   *
   * @param {Node} node
   * @param {(x1: T, x2: T) => -1 | 0 | 1} comparator
   * @returns boolean
   */
  static validate(node, comparator) {
    const sequenceValidation = RBValidator.validateSequence(node, comparator);
    const colorsValidation = RBValidator.validateColors(node);
    const blackHegithValidation = RBValidator.validateBlackHeight(node);

    return sequenceValidation && colorsValidation && blackHegithValidation;
  }

  /**
   * Red-black tree must maintain the binary search tree requirements.
   *
   * @param {Node} node
   * @param {(x1: T, x2: T) => -1 | 0 | 1} comparator
   * @returns boolean
   */
  static validateSequence(node, comparator) {
    if (node?.left) {
      const comparison = comparator(node.value, node.left.value);
      if (comparison > 0) return false;
      else return RBValidator.validateSequence(node.left, comparator);
    }

    if (node?.right) {
      const comparison = comparator(node.value, node.right.value);
      if (comparison < 1) return false;
      else return RBValidator.validateSequence(node.right, comparator);
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
  static validateColors(node) {
    if (!node) return true;
    // rule #2 violation
    if (node === this.root && node.color === COLORS.RED) return false;
    if (node.color === COLORS.RED) {
      // rule #4 violation
      if (node.parent && node.parent.color === COLORS.RED) return false;
    }

    const left = RBValidator.validateColors(node.left);
    const right = RBValidator.validateColors(node.right);

    return left && right;
  }

  /**
   * Validates the rule #5: "All nodes's 'black-height' should be equal"
   *
   * @param {Node} node
   * @returns boolean
   */
  static validateBlackHeight(node = this.root) {
    const [leftBlackHeight, rightBlackHeight] =
      RBValidator.getBlackHeight(node);
    return leftBlackHeight === rightBlackHeight;
  }
}

module.exports = RBValidator;
