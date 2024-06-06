"use strict";

class Inorder {
  constructor(domNode) {
    this.domNode = domNode;
  }

  static new(domNode) {
    return new Inorder(domNode);
  }

  [Symbol.iterator]() {
    const stack = [];
    this.#fillStack(stack, this.domNode);

    return {
      next: () => {
        if (stack.length === 0) return { done: true, value: undefined };
        const node = stack.pop();
        this.#fillStack(stack, node);
        return { done: false, value: node };
      },
    };
  }

  #fillStack = (stack, domNode) => {
    const children = Array.from(domNode.children);
    if (!children.length) return;
    for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
  };
}

module.exports = Inorder;
