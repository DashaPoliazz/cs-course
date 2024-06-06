class Preorder {
  constructor(domNode) {
    this.domNode = domNode;
  }

  static new(domNode) {
    return new Preorder(domNode);
  }

  [Symbol.iterator]() {
    const stack = [{ node: this.domNode, path: "" }];
    let counter = 1;

    return {
      next: () => {
        if (stack.length === 0) {
          return { done: true };
        }

        const { node, path } = stack.pop();
        const children = Array.from(node.children);
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push({ node: children[i], path: `${path}.${counter + i}` });
        }

        return { value: node, done: false };
      },
    };
  }
}

module.exports = Preorder;
