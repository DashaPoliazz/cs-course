const { it, describe } = require("node:test");
const assert = require("node:assert");
const BST = require("./BST.js");
const Node = require("../Node/Node.js");

describe("Validation", () => {
  it("should validate invalid tree correctly", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    // Creating invalid tree
    bst.head = new Node(100);
    bst.head.left = new Node(200);
    bst.head.right = new Node(50);

    assert.equal(bst.validate(bst.head), false);
  });

  it("should validate valid tree correctly", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    // Creating invalid tree
    bst.head = new Node(100);
    bst.head.left = new Node(50);
    bst.head.right = new Node(200);

    assert.equal(bst.validate(bst.head), true);
  });
});

describe("Insertion operations", () => {
  it("should should insert as head correctly", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    bst.insert(22);
    assert.equal(bst.head.value, 22);
    assert.equal(bst.length, 1);
  });

  it("should should insert as leaf correcly", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    bst.insert(9);
    bst.insert(13);
    bst.insert(14);
    bst.insert(15);
    bst.insert(21);
    bst.insert(22);
    bst.insert(33);
    bst.insert(27);
    bst.insert(31);
    bst.insert(47);

    assert.equal(bst.validate(bst.head), true);
    assert.equal(bst.length, 10);
  });

  it("should not allow to insert copies", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    bst.insert(3);
    bst.insert(2);
    bst.insert(1);
    bst.insert(0);

    bst.insert(0);
    bst.insert(0);
    bst.insert(0);

    assert.equal(bst.length, 4);
    assert.equal(bst.validate(bst.head), true);
    assert.deepEqual(bst.inorderTraversal(), [0, 1, 2, 3]);
  });

  it("should correctly work with negative numbers", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    bst.insert(-1);
    bst.insert(-2);
    bst.insert(-3);
    bst.insert(-4);

    assert.equal(bst.length, 4);
    assert.equal(bst.validate(bst.head), true);
    assert.deepEqual(bst.inorderTraversal(), [-4, -3, -2, -1]);
  });
});

describe("Finding operations", () => {
  it("should find value correctly", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    bst.insert(9);
    bst.insert(13);
    bst.insert(14);
    bst.insert(15);
    bst.insert(21);
    bst.insert(22);
    bst.insert(33);
    bst.insert(27);
    bst.insert(31);
    bst.insert(47);

    const needle1 = bst.find(9)?.node.value;
    assert.equal(needle1, 9);

    const needle2 = bst.find(47)?.node.value;
    assert.equal(needle2, 47);

    const needle3 = bst.find(555)?.node.value;
    assert.equal(needle3, undefined);
  });
});

describe("Removing operations", () => {
  it("should remove head with only 2 children and without grandchildren correctly", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    bst.insert(10);
    bst.insert(5);
    bst.insert(15);

    bst.remove(10);

    assert.equal(bst.length, 2);
    assert.equal(true, bst.head.value === 5 || bst.head.value === 15);
  });

  it("should remove head with many grandchildren correctly", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    bst.insert(22);
    bst.insert(15);
    bst.insert(17);
    bst.insert(18);
    bst.insert(21);
    bst.insert(19);

    bst.remove(22);

    assert.equal(bst.head.value, 21);
    assert.deepEqual(bst.inorderTraversal(), [15, 17, 18, 19, 21]);
    assert.equal(bst.validate(bst.head), true);
    assert.equal(bst.head.left.value, 15);
  });

  it("should remove head with many grandchildren correctly", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    bst.insert(22);
    bst.insert(33);
    bst.insert(27);
    bst.insert(26);
    bst.insert(24);
    bst.insert(25);

    bst.remove(22);

    assert.equal(bst.head.value, 24);
    assert.equal(bst.validate(bst.head), true);
  });

  it("should remove middle node with many grandchildren correctly", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    bst.insert(22);
    bst.insert(33);
    bst.insert(27);
    bst.insert(26);
    bst.insert(24);
    bst.insert(25);

    bst.remove(24);

    assert.equal(bst.head.value, 22);
    assert.equal(bst.validate(bst.head), true);
  });
});

describe("Iterators", () => {
  it("should perform inorder traversal corerctly", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    bst.insert(22);
    bst.insert(15);
    bst.insert(17);
    bst.insert(18);
    bst.insert(21);
    bst.insert(19);

    assert.deepEqual([...bst.inorder(bst.head)], [15, 17, 18, 19, 21, 22]);
  });

  it("should perform preorder traversal corerctly", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    bst.insert(22);
    bst.insert(15);
    bst.insert(17);
    bst.insert(18);
    bst.insert(21);
    bst.insert(19);

    assert.deepEqual([...bst.preorder(bst.head)], [22, 15, 17, 18, 21, 19]);
  });

  it("should perform postorder traversal corerctly", () => {
    const bst = new BST((parent, child) => (child > parent ? true : false));

    bst.insert(22);
    bst.insert(15);
    bst.insert(17);
    bst.insert(18);
    bst.insert(21);
    bst.insert(19);

    assert.deepEqual([...bst.postorder(bst.head)], [19, 21, 18, 17, 15, 22]);
  });
});
