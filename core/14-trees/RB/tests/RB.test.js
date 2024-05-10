const { it, describe } = require("node:test");
const assert = require("node:assert");
const RB = require("../RB.js");
const COLORS = require("../colors.js");
const Node = require("../RBNode.js");
const RBValidator = require("./RBValidator.js");

const comparator = (x1, x2) => {
  if (x1 > x2) return -1;
  else if (x1 === x2) return 0;
  else return 1;
};

describe("black height measurements", () => {
  it("should measure black height of null root tree correctly", () => {
    const [leftBlackHeight, rightBlackHeight] = RBValidator.getBlackHeight();
    assert.equal(leftBlackHeight, 1);
    assert.equal(rightBlackHeight, 1);
  });

  it("should measure black height of singleton tree correctly", () => {
    const root = new Node(5, COLORS.BLACK);
    const [leftBlackHeight, rightBlackHeight] =
      RBValidator.getBlackHeight(root);
    assert.equal(leftBlackHeight, 2);
    assert.equal(rightBlackHeight, 2);
  });

  it("should measure black height of invalid tree correctly", () => {
    const rb = createInvalidTree();
    // 	        10(B)
    // 	  /                \
    //  6(B)                     26(R)
    // /   \                  /                \
    // 4(B)  8(B)          18(B)              36(B)
    // \                   /  \               /         \
    // 5(R)              14(R) 24(R)        28(B)       44(R)
    // 				   /   \    /   \      /    \       /    \
    // 			  12(B) 16(B) 22(B) 25(B) 27(B) 32(B) 38(B)  46(B)

    const [leftBlackHeight, rightBlackHeight] = RBValidator.getBlackHeight(
      rb.root,
    );

    assert.equal(leftBlackHeight, 5);
    assert.equal(rightBlackHeight, 4);
  });

  it("should measure black height of valid tree correctly", () => {
    const rb = createValidTree();
    // 	        10(B)
    // 	  /                \
    //  6(B)                     26(R)
    // /   \                  /                \
    // 4(B)  8(B)          18(B)              36(B)
    //                    /  \               /         \
    //                  14(R) 24(R)        28(B)       44(R)
    // 				   /   \    /   \      /    \       /    \
    // 			  12(B) 16(B) 22(B) 25(B) 27(B) 32(B) 38(B)  46(B)

    const [leftBlackHeight, rightBlackHeight] = RBValidator.getBlackHeight(
      rb.root,
    );

    assert.equal(leftBlackHeight, 4);
    assert.equal(rightBlackHeight, 4);
  });
});

describe("validations", () => {
  it("should validate the null tree correctly", () => {
    const rb = new RB(comparator);
    assert.equal(RBValidator.validate(rb.root), true);
  });

  it("should validate the singletone tree correctly", () => {
    const rb = new RB(comparator);
    rb.root = new Node(10, COLORS.BLACK);
    assert.equal(RBValidator.validate(rb.root), true);
  });

  it("should validate the invalid singletone tree correctly", () => {
    const rb = new RB(comparator);
    rb.root = new Node(10, COLORS.RED);
    assert.equal(RBValidator.validate(rb.root), false);
  });

  it("should validate the valid tree correctly", () => {
    const rb = createValidTree();
    assert.equal(RBValidator.validate(rb.root, comparator), true);
  });

  it("should validate the valid tree correctly", () => {
    const rb = createInvalidTree();
    assert.equal(RBValidator.validate(rb.root, comparator), false);
  });

  it("should validate tree with invalid relationship correctly", () => {
    const rb = new RB(comparator);
    const root = new Node(10, COLORS.BLACK);
    rb.root = root;
    // root.left.parent = null, but should be equal to root
    root.left = new Node(5, COLORS.RED);
    assert.equal(RBValidator.validate(rb.root, comparator), false);
  });
});

describe("rotations", () => {
  it("should handle 'left-left' case correctly", () => {
    const rb = new RB(comparator);
    rb.insert(15);
    rb.insert(10);
    rb.insert(5);
    // that's how tree looks before rebalance
    //     15(B)
    //    /
    //   10(R)
    //  /
    // 5(R)
    // that's how it looks after rebalance
    //   10(B)
    //   /  \
    // 5(R) 15(R)
    assert.equal(RBValidator.validate(rb.root, comparator), true);
  });
  it("should handle 'left-right' case correctly", () => {
    const rb = new RB(comparator);
    rb.insert(15);
    rb.insert(5);
    rb.insert(10);
    assert.equal(RBValidator.validate(rb.root, comparator), true);
  });
  it("should handle 'right-right' case correctly", () => {
    const rb = new RB(comparator);
    rb.insert(10);
    rb.insert(15);
    rb.insert(20);
    assert.equal(RBValidator.validate(rb.root, comparator), true);
  });
  it("should handle 'right-left' case correctly", () => {
    const rb = new RB(comparator);
    rb.insert(5);
    rb.insert(15);
    rb.insert(10);
    assert.equal(RBValidator.validate(rb.root, comparator), true);
  });
});

describe("insertions", () => {
  it("should handle #1 insertion (no root) case correctly", () => {
    const rbt = new RB(comparator);
    rbt.insert(1);
    assert.equal(rbt.size, 1);
    assert.equal(rbt.root.value, 1);
    assert.equal(RBValidator.validate(rbt.root), true);
  });
  it("should handle #2.1 insertion (Grandpa is not Root, Uncle is Red) case correctly", () => {
    const rbt = new RB(comparator);

    rbt.insert(10);
    const root = rbt.root;

    rbt.insert(6);
    root.left.color = COLORS.BLACK;
    rbt.insert(12);
    root.right.color = COLORS.BLACK;
    rbt.insert(4);
    rbt.insert(8);
    // rbt.insert(5);
    //     10(B)                     10(B)
    //     /   \                    /   \
    //    6(B)  12(B)            6(R)  12(B)
    //   / \              =>     / \
    //  4(R) 8(R)             4(B) 8(B)
    //     \                     \
    //     5(R)                  5(R)
    assert.equal(RBValidator.validate(rbt.root, comparator), true);
  });
  it("should handle #2.1 insertion (Grandpa is not Root, Uncle is Red) mirror case correctly", () => {
    const rbt = new RB(comparator);
    rbt.insert(3);
    const root = rbt.root;
    rbt.insert(2);
    root.left.color = COLORS.BLACK;
    rbt.insert(6);
    root.right.color = COLORS.BLACK;
    rbt.insert(4);
    rbt.insert(8);
    rbt.insert(12);
    //   3(B)                      3(B)
    //   /   \                     /   \
    // 2(B)  6(B)               2(B)  6(R)
    //      / \           =>          / \
    //    4(R) 8(R)               4(B) 8(B)
    //              \                      \
    //              12(R)                 12(R)
    assert.equal(RBValidator.validate(root, comparator), true);
  });
  it("should handle #2.2 insertion (Grandpa is Root, Uncle is Red) case correctly", () => {
    const rbt = new RB(comparator);
    rbt.insert(10);
    const root = rbt.root;
    rbt.insert(6);
    rbt.insert(12);
    rbt.insert(8);
    //     10(B)                     10(B)
    //     /   \                    /   \
    //    6(R)  12(R)            6(R)  12(B)
    //   / \              =>     / \
    //  nil 8(R)             4(B) 8(B)
    assert.equal(RBValidator.validate(root, comparator), true);
  });
  it("should handle #2.2 insertion (Grandpa is Root, Uncle is Red) mirror case correctly", () => {
    const rbt = new RB(comparator);
    rbt.insert(3);
    const root = rbt.root;
    rbt.insert(1);
    rbt.insert(8);
    rbt.insert(5);
    //     3(B)                          3(B)
    //    /   \                         /   \
    //  1(R)  8(R)                   1(B)  8(B)
    //       /                             /
    //      5(R)                         5(R)
    assert.equal(RBValidator.validate(root, comparator), true);
  });
  it("should prevent from the insertions of duplicates", () => {
    const rbt = new RB(comparator);
    rbt.insert(1);
    rbt.insert(1);
    rbt.insert(1);
    assert.equal(rbt.size, 1);
  });

  it("should be able to insert linear right elements", () => {
    const rbt = new RB(comparator);
    for (let i = 0; i < 1000; i++) rbt.insert(i);
    assert.equal(RBValidator.validate(rbt.root, comparator), true);
  });

  it("should be able to insert linear left elements", () => {
    const rbt = new RB(comparator);
    for (let i = 1000; i >= 0; i--) rbt.insert(i);
    assert.equal(RBValidator.validate(rbt.root, comparator), true);
  });

  it("should be able to insert many random elements", () => {
    const rbt = new RB(comparator);
    for (let i = 0; i < 1000; i++) {
      const rnd = Math.floor(Math.random() * 10000);
      rbt.insert(rnd);
    }
    assert.equal(RBValidator.validate(rbt.root, comparator), true);
  });
});

function createValidTree() {
  // 	        10(B)
  // 	  /                \
  //  6(B)                     26(R)
  // /   \                  /                \
  // 4(B)  8(B)          18(B)              36(B)
  //                    /  \               /         \
  //                  14(R) 24(R)        28(B)       44(R)
  // 				   /   \    /   \      /    \       /    \
  // 			  12(B) 16(B) 22(B) 25(B) 27(B) 32(B) 38(B)  46(B)

  const rb = new RB(comparator);
  const root = new Node(10, COLORS.BLACK, null, null, null);
  rb.root = root;

  const six = new Node(6, COLORS.BLACK, root, null, null);
  const four = new Node(4, COLORS.BLACK, six, null, null);
  const eight = new Node(8, COLORS.BLACK, six, null, null);

  const twentySix = new Node(26, COLORS.RED, root, null, null);
  const eighteen = new Node(18, COLORS.BLACK, twentySix, null, null);
  const fourteen = new Node(14, COLORS.RED, eighteen, null, null);
  const twelve = new Node(12, COLORS.BLACK, fourteen, null, null);
  const sixteen = new Node(16, COLORS.BLACK, fourteen, null, null);
  const twentyFour = new Node(24, COLORS.RED, eighteen, null, null);
  const twentyTwo = new Node(22, COLORS.BLACK, twentyFour, null, null);
  const twentyFive = new Node(25, COLORS.BLACK, twentyFour, null, null);
  const thirtySix = new Node(36, COLORS.BLACK, twentySix, null, null);
  const twentyEight = new Node(28, COLORS.RED, thirtySix, null, null);
  const twentySeven = new Node(27, COLORS.BLACK, twentyEight, null, null);
  const thirtyTwo = new Node(32, COLORS.BLACK, twentyEight, null, null);
  const fortyFour = new Node(44, COLORS.RED, thirtySix, null, null);
  const thirtyEight = new Node(38, COLORS.BLACK, fortyFour, null, null);
  const fortySix = new Node(46, COLORS.BLACK, fortyFour, null, null);

  root.left = six;
  root.right = twentySix;

  six.left = four;
  six.right = eight;

  twentySix.left = eighteen;
  twentySix.right = thirtySix;
  eighteen.left = fourteen;
  eighteen.right = twentyFour;
  fourteen.left = twelve;
  fourteen.right = sixteen;
  twentyFour.left = twentyTwo;
  twentyFour.right = twentyFive;
  thirtySix.left = twentyEight;
  thirtySix.right = fortyFour;
  twentyEight.left = twentySeven;
  twentyEight.right = thirtyTwo;

  fortyFour.left = thirtyEight;
  fortyFour.right = fortySix;

  return rb;
}

function createInvalidTree() {
  // 	        10(B)
  // 	  /                \
  //  6(B)                     26(R)
  // /   \                  /                \
  // 4(B)  8(B)          18(B)              36(B)
  //    \                  /  \               /         \
  //    5(B)            14(R) 24(R)        28(B)       44(R)
  // 				   /   \    /   \      /    \       /    \
  // 			  12(B) 16(B) 22(B) 25(B) 27(B) 32(B) 38(B)  46(B)

  const rb = createValidTree();
  const parent = rb.root.left.left;
  parent.right = new Node(5, COLORS.BLACK, parent);
  return rb;
}
