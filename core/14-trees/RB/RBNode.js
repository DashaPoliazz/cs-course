const COLORS = require("./colors.js");

class RBNode {
  /**
   *
   * @param {T} value value of the node
   * @param {COLORS.RED | COLORS.BLACK} color color of the node
   * @param {RBNode} parent parent node
   * @param {RBNode} left left node
   * @param {RBNode} right right node
   */
  constructor(value, color, parent = null, left = null, right = null) {
    this.value = value;
    this.color = color;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

module.exports = RBNode;
