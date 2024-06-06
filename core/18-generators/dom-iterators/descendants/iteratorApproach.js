"use strict";

const fillStack = (stack, domNode) => {
  console.log(domNode);
  const children = Array.from(domNode.children);
  if (!children.length) return;
  for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
};

const dfsInorder = (domNode) => ({
  [Symbol.iterator]() {
    const stack = [];
    fillStack(stack, domNode);
    console.log("INIT", stack);

    return {
      next: () => {
        if (stack.length === 0) return { done: true, value: undefined };
        const node = stack.pop();
        fillStack(stack, node);
        return { done: false, value: node };
      },
    };
  },
});

function descendants(domNode) {}
