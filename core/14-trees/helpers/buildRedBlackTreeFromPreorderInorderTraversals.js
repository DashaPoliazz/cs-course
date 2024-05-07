const Node = require("../RB/RBNode.js");

const buildRedBlackTreeFromPreorderAndInorderTraversals = (
  preorder,
  inorder,
) => {
  if (preorder.length === 1) {
    const { value, color, parent } = preorder[0];
    return new Node(value, color, parent);
  }
  if (preorder.length === 0) return null;

  const delimiter = inorder.indexOf(preorder[0]);
  const head = new Node(preorder[0]);

  const leftSlicedInorder = inorder.slice(0, delimiter);
  const leftSlicedPreorder = preorder.slice(1, delimiter + 1);

  head.left = buildRedBlackTreeFromPreorderAndInorderTraversals(
    leftSlicedPreorder,
    leftSlicedInorder,
  );

  const rightSlicedInorder = inorder.slice(delimiter + 1);
  const rightSlicedPreorder = preorder.slice(delimiter + 1);

  head.right = buildRedBlackTreeFromPreorderAndInorderTraversals(
    rightSlicedPreorder,
    rightSlicedInorder,
  );

  return head;
};

module.exports = buildRedBlackTreeFromPreorderAndInorderTraversals;
