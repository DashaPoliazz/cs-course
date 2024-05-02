const Node = require("../AVL/AVLNode.js");

const buildTreeFromPreorderAndInorderTraversals = (preorder, inorder) => {
  if (preorder.length === 1) return new Node(preorder[0]);
  if (preorder.length === 0) return null;

  const delimiter = inorder.indexOf(preorder[0]);
  const head = new Node(preorder[0]);

  const leftSlicedInorder = inorder.slice(0, delimiter);
  const leftSlicedPreorder = preorder.slice(1, delimiter + 1);

  head.left = buildTreeFromPreorderAndInorderTraversals(
    leftSlicedPreorder,
    leftSlicedInorder,
  );

  const rightSlicedInorder = inorder.slice(delimiter + 1);
  const rightSlicedPreorder = preorder.slice(delimiter + 1);

  head.right = buildTreeFromPreorderAndInorderTraversals(
    rightSlicedPreorder,
    rightSlicedInorder,
  );

  return head;
};

module.exports = buildTreeFromPreorderAndInorderTraversals;
