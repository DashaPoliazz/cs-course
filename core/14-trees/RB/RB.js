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
    this.size = 0;
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
   *
   * @param {T} value
   */
  insert(value) {
    // Case 1. (z === root)
    if (!this.root) {
      const newNode = new Node(value, COLORS.BLACK, null, null, null);
      this.root = newNode;
      this.size += 1;
      return;
    }

    // Traversing until the insertion place will be found
    let z = this.root;
    let parent = null;

    while (z !== null) {
      const comparisonResult = this.comparator(z.value, value);
      parent = z;

      switch (comparisonResult) {
        case -1:
          z = z.left;
          break;
        case 1:
          z = z.right;
          break;
        // Prevent adding duplicates
        case 0:
          return;
      }
    }

    const nodeToInsert = new Node(value, COLORS.RED, parent, null, null);
    const insertToLeft = this.comparator(parent.value, value) === -1;
    if (insertToLeft) {
      parent.left = nodeToInsert;
      this.fix(parent.left);
    } else {
      parent.right = nodeToInsert;
      this.fix(parent.right);
    }

    this.size += 1;
  }

  /**
   * T - O(LogN)
   * S - O(LogN)
   *
   * @param {T} value
   * @returns {T | undefined}
   */
  find(value) {
    let curr = this.root;

    while (curr) {
      const cmp = this.comparator(curr.value, value);

      if (cmp === 0) return curr.value;
      if (cmp === -1) curr = curr.left;
      if (cmp === 1) curr = curr.right;
    }
  }

  fix(node) {
    while (
      node.parent &&
      node.parent.color === COLORS.RED &&
      node.color === COLORS.RED
    ) {
      // Let's firstly define branches the node is in
      const grandparent = node.parent.parent;
      const parent = node.parent;
      if (parent === grandparent?.left) {
        // The node is in the left branch
        const uncle = grandparent.right;
        if (uncle?.color === COLORS.RED) {
          // (Uncle is RED) ('recursive' case)
          parent.color = COLORS.BLACK;
          uncle.color = COLORS.BLACK;
          grandparent.color = COLORS.RED;
          node = grandparent;
        } else {
          // (Uncle is BLACK) (either left rotation or right)
          if (parent.right === node) {
            // Zig-zag case (listing 2.2)
            node = this.leftRightCase(grandparent);
          } else {
            // Linear case (listing 1.2)
            node = this.leftLeftCase(grandparent);
          }
          // Repaint the nodes
          node.left.color = COLORS.RED;
          node.right.color = COLORS.RED;
          node.color = COLORS.BLACK;
        }
      } else {
        // The node is in the right branch
        const uncle = grandparent.left;
        if (uncle?.color === COLORS.RED) {
          // (Uncle is RED) ('recursive' case)
          parent.color = COLORS.BLACK;
          uncle.color = COLORS.BLACK;
          grandparent.color = COLORS.RED;
          node = grandparent;
        } else {
          // (Uncle is BLACK) (either left rotation or right)
          if (parent.left === node) {
            // Zig-zag case (listing 2.1)
            node = this.rightLeftCase(grandparent);
          } else {
            // Linear case (listing 1.1)
            node = this.rightRightCase(grandparent);
          }
          // Repaint the nodes
          node.left.color = COLORS.RED;
          node.right.color = COLORS.RED;
          node.color = COLORS.BLACK;
        }
      }

      this.root.color = COLORS.BLACK;
    }
  }

  leftLeftCase(node) {
    return this.rotateToRight(node);
  }
  leftRightCase(node) {
    node.left = this.rotateToLeft(node.left);
    return this.leftLeftCase(node);
  }
  rightRightCase(node) {
    return this.rotateToLeft(node);
  }
  rightLeftCase(node) {
    node.right = this.rotateToRight(node.right);
    return this.rightRightCase(node);
  }
  rotateToRight(node) {
    let newHead = node.left;
    node.left = newHead.right;
    if (newHead.right) newHead.right.parent = node;
    newHead.parent = node.parent;
    if (!node.parent) this.root = newHead;
    if (node.parent && node === node.parent.left) node.parent.left = newHead;
    else node.parent && (node.parent.right = newHead);
    newHead.right = node;
    node.parent = newHead;
    return newHead;
  }
  rotateToLeft(node) {
    let newHead = node.right;
    node.right = newHead.left;
    if (newHead.left) newHead.left.parent = node;
    newHead.parent = node.parent;
    if (!node.parent) this.root = newHead;
    if (node.parent && node === node.parent.left) node.parent.left = newHead;
    else node.parent && (node.parent.right = newHead);
    newHead.left = node;
    node.parent = newHead;
    return newHead;
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
