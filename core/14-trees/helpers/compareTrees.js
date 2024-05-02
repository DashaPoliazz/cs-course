const compareTrees = (node1, node2) => {
  if (!node1 && !node2) return true;
  if (node1?.val !== node2?.val) return false;

  return (
    compareTrees(node1.left, node2.left) &&
    compareTrees(node1.right, node2.right)
  );
};

module.exports = compareTrees;
