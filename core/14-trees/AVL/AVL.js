const Node = require("./AVLNode.js");

class AVL {
  /**
   * Comparison result should return: -1, 0 or 1.
   * -1 if the x1 > x2
   * 0  if x1 === x2
   * 1  if the x2 > x1
   *
   * @param {(x1: T, x2: T) => -1 | 0 | 1} comparator
   */
  constructor(comparator) {
    this.length = 0;
    this.comparator = comparator;
  }

  get height() {
    return this.#height(this.head);
  }

  #height(node, h = 0) {
    if (!node) return h;

    const leftSubtreeHeight = this.#height(node.left, h + 1);
    const rightSubtreeHeight = this.#height(node.right, h + 1);

    return Math.max(leftSubtreeHeight, rightSubtreeHeight);
  }

  insert(value) {
    if (!this.head) {
      this.head = new Node(value);
      this.length += 1;
      return this.head.value;
    }

    const doInsertion = (node) => {
      if (!node) {
        const newNode = new Node(value);
        // console.log(newNode);
        return newNode;
      }

      const comparison = this.comparator(node.value, value);
      // need tot turn left
      if (comparison === -1) node.left = doInsertion(node.left);
      else if (comparison === 1) node.right = doInsertion(node.right);
      else if (comparison === 0) {
        this.length -= 1;
        return node;
      }

      this.update(node);

      return this.rebalance(node);
    };

    this.length += 1;

    return doInsertion(this.head);
  }
  rebalance(node) {
    if (node.balanceFactor === -2) {
      // left-left rotation
      if (node.left.balanceFactor === -1) {
        return this.leftLeftCase(node);
      }

      // left-right rotation
      if (node.left.balanceFactor === 1) {
        return this.leftRightCase(node);
      }
    }

    if (node.balanceFactor === 2) {
      // right-right rotation
      if (node.right.balanceFactor === 1) {
        return this.rightRightCase(node);
      }

      // right-left rotation
      if (node.right.balanceFactor === -1) {
        return this.rightLeftCase(node);
      }
    }

    return node;
  }
  update(node) {
    const rightSubtreeHeight = node.right === null ? -1 : node.right.height;
    const leftSubtreerHeight = node.left === null ? -1 : node.left.height;

    node.balanceFactor = rightSubtreeHeight - leftSubtreerHeight;
    node.height = 1 + Math.max(rightSubtreeHeight, leftSubtreerHeight);
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
    const newHead = node.left;
    node.left = newHead.right;
    newHead.right = node;
    this.update(node);
    this.update(newHead);
    if (node === this.head) this.head = newHead;
    return newHead;
  }
  rotateToLeft(node) {
    const newHead = node.right;
    node.right = newHead.left;
    newHead.left = node;
    this.update(node);
    this.update(newHead);
    if (node === this.head) this.head = newHead;
    return newHead;
  }

  validate(node = this.head) {
    if (node.left) {
      const comparison = this.comparator(node.value, node.left.value);
      if (comparison > 0) return false;
      else return this.validate(node.left);
    }

    if (node.right) {
      const comparison = this.comparator(node.value, node.right.value);
      if (comparison < 1) return false;
      else return this.validate(node.right);
    }

    return true;
  }

  *inorder(head = this.head) {
    if (!head) return;
    yield* this.inorder(head.left);
    yield head.value;
    yield* this.inorder(head.right);
  }
  *preorder(head = this.head) {
    if (!head) return;
    yield head.value;
    yield* this.preorder(head.left);
    yield* this.preorder(head.right);
  }
}

module.exports = AVL;
