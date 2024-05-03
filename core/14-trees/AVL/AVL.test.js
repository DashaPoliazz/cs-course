const { it, describe } = require("node:test");
const assert = require("node:assert");
const AVL = require("./AVL.js");
const buildTreeFrompPreorderInorder = require("../helpers/buildTreeFromPreorderInorderTraversals.js");
const compareTrees = require("../helpers/compareTrees.js");

const comparator = (x1, x2) => {
  if (x1 > x2) return -1;
  else if (x1 === x2) return 0;
  else return 1;
};

describe("rotations", () => {
  describe("left-left rotations", () => {
    it("should handle small 'left-left' case correctly", () => {
      const avl = new AVL(comparator);
      avl.insert(5);
      avl.insert(4);
      avl.insert(3);

      // height after inserting 3 should be equal to 2
      // that's how tree looks before rebalance
      //     5
      //    /
      //   4
      //  /
      // 3
      // that's how it looks after rebalance
      //   4
      //  / \
      // 3   5
      assert.equal(avl.height, 2);
      assert.deepEqual([...avl.preorder()], [4, 3, 5]);
      assert.deepEqual([...avl.inorder()], [3, 4, 5]);
      assert.equal(avl.validate(), true);
    });
    it("should handle big 'left-left' case correctly", () => {
      const avl = new AVL(comparator);
      avl.insert(8);
      avl.insert(10);
      avl.insert(6);
      avl.insert(7);
      avl.insert(4);

      // that's how tree looks before adding 3
      //       8
      //     /   \
      //   6      10
      //  / \
      // 4   7
      assert.equal(avl.height, 3);
      assert.equal(avl.validate(), true);

      // before rebalance but after adding 3
      //         8
      //       /   \
      //     6     10
      //    /  \
      //   4    7
      //  /
      // 3

      avl.insert(3);

      // after rebalancing
      //       6
      //     /   \
      //   4       8
      //  /       / \
      // 3       7   10

      const inorder = [...avl.inorder()];
      const preorder = [...avl.preorder()];
      const compareWith = buildTreeFrompPreorderInorder(preorder, inorder);
      assert.equal(compareTrees(compareWith, avl.head), true);
    });
  });
  describe("left-right rotations", () => {
    it("should handle small 'left-right' case correctly", () => {
      const avl = new AVL(comparator);

      avl.insert(6);
      avl.insert(3);
      avl.insert(4);

      assert.equal(avl.height, 2);

      const inorder = [...avl.inorder()];
      const preorder = [...avl.preorder()];
      const compareWith = buildTreeFrompPreorderInorder(preorder, inorder);
      assert.equal(compareTrees(compareWith, avl.head), true);
    });

    it("should handle big 'left-right' case correctly", () => {
      const avl = new AVL(comparator);

      avl.insert(10);
      avl.insert(6);
      avl.insert(12);
      avl.insert(4);
      avl.insert(9);
      avl.insert(8);

      assert.equal(avl.height, 3);

      const inorder = [...avl.inorder()];
      const preorder = [...avl.preorder()];
      const compareWith = buildTreeFrompPreorderInorder(preorder, inorder);
      assert.equal(compareTrees(compareWith, avl.head), true);
    });
  });
  describe("right-right rotations", () => {
    it("should handle small 'right-right' case correctly", () => {
      const avl = new AVL(comparator);

      avl.insert(3);
      avl.insert(4);
      avl.insert(5);

      assert.equal(avl.height, 2);
      const inorder = [...avl.inorder()];
      const preorder = [...avl.preorder()];
      const compareWith = buildTreeFrompPreorderInorder(preorder, inorder);
      assert.equal(compareTrees(compareWith, avl.head), true);
    });

    it("should handle big 'right-right' case correctly", () => {
      const avl = new AVL(comparator);

      avl.insert(3);
      avl.insert(2);
      avl.insert(7);
      avl.insert(4);
      avl.insert(9);
      avl.insert(10);

      assert.equal(avl.height, 3);
      const inorder = [...avl.inorder()];
      const preorder = [...avl.preorder()];
      const compareWith = buildTreeFrompPreorderInorder(preorder, inorder);
      assert.equal(compareTrees(compareWith, avl.head), true);
    });
  });
  describe("right-left rotations", () => {
    it("should handle small 'right-left' case correctly", () => {
      const avl = new AVL(comparator);

      avl.insert(3);
      avl.insert(6);
      avl.insert(5);

      assert.equal(avl.height, 2);
      const inorder = [...avl.inorder()];
      const preorder = [...avl.preorder()];
      const compareWith = buildTreeFrompPreorderInorder(preorder, inorder);
      assert.equal(compareTrees(compareWith, avl.head), true);
    });
    it("should handle big 'right-left' case correctly", () => {
      const avl = new AVL(comparator);

      avl.insert(2);
      avl.insert(1);
      avl.insert(5);
      avl.insert(6);
      avl.insert(3);
      avl.insert(4);

      assert.equal(avl.height, 3);
      const inorder = [...avl.inorder()];
      const preorder = [...avl.preorder()];
      const compareWith = buildTreeFrompPreorderInorder(preorder, inorder);
      assert.equal(compareTrees(compareWith, avl.head), true);
    });
  });
});

describe("insertion", () => {
  it("should track length correct", () => {
    const avl = new AVL(comparator);

    avl.insert(1);
    avl.insert(2);
    avl.insert(3);
    avl.insert(4);
    avl.insert(5);

    assert.equal(avl.length, 5);
  });

  it("should now allow to add duplicates", () => {
    const avl = new AVL(comparator);

    avl.insert(1);
    avl.insert(2);
    avl.insert(3);
    avl.insert(4);
    avl.insert(5);

    avl.insert(5);
    avl.insert(5);
    avl.insert(5);
    avl.insert(3);
    avl.insert(3);
    avl.insert(3);

    assert.equal(avl.length, 5);
  });
});

describe("lookup", () => {
  it("should find the value that exists for T = O(log(H))", () => {
    const calcRecursiveCalls = () => {
      let calls = 0;

      // this is copy of the AVL class 'find' method
      const find = (value, node) => {
        if (!node) return [null, calls];

        calls += 1;
        const cmp = comparator(node.value, value);

        if (cmp === 0) return [value, calls];
        if (cmp === -1) return find(value, node.left);
        if (cmp === 1) return find(value, node.right);
      };

      return find;
    };

    const avl = new AVL(comparator);

    // create a 'linked-list'
    for (let i = 0; i < 16; i++) avl.insert(i);
    const height = avl.height;
    assert.equal(height, 5);

    let maxCalls = 0;
    for (let i = 0; i < 16; i++) {
      const [_, calls] = calcRecursiveCalls()(i, avl.head);
      maxCalls = Math.max(maxCalls, calls);
    }

    // Max calls to find value should not be greater than Log(H), where H - height
    assert.equal(maxCalls <= height, true);
  });

  it("should return 'undefined' if the value doesn't exist", () => {
    const avl = new AVL(comparator);

    // create a 'linked-list'
    for (let i = 0; i < 16; i++) avl.insert(i);
    const height = avl.height;
    assert.equal(height, 5);

    assert.equal(avl.find(42), undefined);
  });

  it("should find the value correctly", () => {
    const avl = new AVL(comparator);

    avl.insert(1);

    const result1 = avl.find(1);

    assert.equal(result1.node.value, 1);
    assert.equal(result1.parent, null);

    avl.insert(2);
    avl.insert(3);
    avl.insert(4);
    avl.insert(5);

    const result2 = avl.find(5);

    assert.equal(result2.node.value, 5);
    assert.equal(result2.parent.value, 4);
  });
});

describe("removing", () => {
  it("should remove remove head correctly", () => {
    const avl = new AVL(comparator);

    avl.insert(1);
    avl.remove(1);

    assert.equal(avl.length, 0);
    assert.equal(avl.head, null);
  });

  it("should remove middle node correctly", () => {
    const avl = new AVL(comparator);

    avl.insert(1);
    avl.insert(2);
    avl.insert(3);
    avl.insert(4);
    avl.insert(5);
    avl.insert(6);

    avl.remove(5);

    assert.equal(avl.length, 5);
    assert.equal(avl.validate(avl.head), true);
  });
});
