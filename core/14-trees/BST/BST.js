const Node = require("../Node/Node.js");

class BST {
  /**
   * The comparator function should accept two arguments: parent and child
   * and return bool.
   * If child is greater than parent, it should return true, otherwise false.
   *
   * child <= parent | false
   * child > parent  | true
   *
   * @param {<T>(parent: T, child: T) => boolean} comparator
   * @returns {BST} The newly created BST instance
   */
  constructor(comparator) {
    this.comparator = comparator;
    this.head = null;
    this.length = 0;
  }

  // T -> O(N)
  // S -> O(N)
  insert(value) {
    const nodeToInsert = new Node(value);

    const doInsertion = (node) => {
      // Insert as head
      if (!this.head) {
        this.head = nodeToInsert;
        this.length += 1;
        return;
      }

      // Insert as leaf
      if (!node.left && !node.right) {
        // Preventing copies
        if (node.value === value) return;

        const insertToRight = this.comparator(node.value, value);
        insertToRight
          ? (node.right = nodeToInsert)
          : (node.left = nodeToInsert);

        this.length += 1;

        return;
      }

      // Perhaps, insert as left
      if (node.right && !node.left) {
        const insertToLeft = !this.comparator(node.value, value);
        if (insertToLeft) {
          node.left = nodeToInsert;
          this.length += 1;

          return;
        } else {
          // Preventing copies
          if (node.right.value === value) return;

          doInsertion(node.right);
        }
      }

      // Perhaps, insert as right
      if (node.left && !node.right) {
        const insertToRight = this.comparator(node.value, value);
        if (insertToRight) {
          node.right = nodeToInsert;
          this.length += 1;

          return;
        } else {
          // Preventing copies
          if (node.left.value === value) return;

          doInsertion(node.left);
        }
      }
    };

    doInsertion(this.head);

    return nodeToInsert.value;
  }

  // T -> O(N)
  // S -> O(1)
  remove(needle) {
    const maybeNodeToRemove = this.find(needle);
    if (!maybeNodeToRemove) return;

    let { node: nodeToRemove, parent } = maybeNodeToRemove;
    if (nodeToRemove === this.head) this.head = null;

    this.length -= 1;

    if (nodeToRemove.left) {
      let curr = nodeToRemove.left;
      let prev = nodeToRemove.left;
      // moving right until the biggest value has beeen met
      while (curr.right) {
        prev = curr;
        curr = curr.right;
      }

      prev.right = curr.left;
      curr.left = nodeToRemove.left;
      curr.right = nodeToRemove.right;
      nodeToRemove = curr;

      // removing from the middle
      if (parent) parent.left = curr;
      // removing from the head
      else this.head = curr;

      return nodeToRemove.value;
    }

    if (nodeToRemove.right) {
      let curr = nodeToRemove.right;
      let prev = nodeToRemove.right;
      // moving left until the smallest value has beeen met
      while (curr.left) {
        prev = curr;
        curr = curr.left;
      }

      prev.left = curr.right;
      curr.left = nodeToRemove.left;
      curr.right = nodeToRemove.right;
      nodeToRemove = curr;

      // removing from the middle
      if (parent) parent.right = curr;
      // removing from the head
      else this.head = curr;

      return nodeToRemove.value;
    }

    // remove as head
    if (!parent) {
      const out = this.head.value;
      this.head = null;
      return out;
    }
  }

  // T -> O(N)
  // S -> O(N)
  find(needle) {
    const doLookup = (node, parent) => {
      if (!node) return;
      // Head is a needle
      if (node.value === needle) return { node, parent };

      if (node.right) {
        if (node.right.value === needle) return { node: node.right, parent };
        // needle is in the right subtree
        const isInRightSubtree = this.comparator(node.right.value, needle);
        if (isInRightSubtree) return doLookup(node.right, node);
      }

      if (node.left) {
        if (node.left.value === needle) return { node: node.left, parent };
        // needle is in the left subtree
        const isInLeftSubtree = !this.comparator(node.left.value, needle);
        if (isInLeftSubtree) return doLookup(node.left, node);
      }
    };

    return doLookup(this.head, null);
  }

  // T -> O(N)
  // S -> O(N)
  validate(head) {
    if (head.right) {
      const comparison = this.comparator(head.value, head.right.value);
      if (!comparison) return false;
      if (!this.validate(head.right)) return false;
    }

    if (head.left) {
      const comparison = this.comparator(head.value, head.left.value);
      if (comparison) return false;
      if (!this.validate(head.left)) return false;
    }

    return true;
  }

  // T -> O(N)
  // S -> O(N)
  inorderTraversal() {
    const out = [];

    const doInorderTraversal = (node) => {
      if (!node) return;
      doInorderTraversal(node.left);
      out.push(node.value);
      doInorderTraversal(node.right);
    };

    doInorderTraversal(this.head);

    return out;
  }

  *inorder(head) {
    if (!head) return;
    yield* this.inorder(head.left);
    yield head.value;
    yield* this.inorder(head.right);
  }

  *preorder(head) {
    if (!head) return;
    yield head.value;
    yield* this.preorder(head.left);
    yield* this.preorder(head.right);
  }

  *postorder(head) {
    if (!head) return;
    yield* this.postorder(head.left);
    yield* this.postorder(head.right);
    yield head.value;
  }
}

module.exports = BST;
