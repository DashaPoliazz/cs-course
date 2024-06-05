"use strict";

const consumedIterator = {
  next: () => ({ done: true, value: undefined }),
};

function siblings(domNode) {
  return {
    [Symbol.iterator]() {
      const parent = domNode.parentNode;
      if (!parent) return consumedIterator;
      const siblings = Array.from(parent.children).filter(
        (child) => child !== domNode,
      );
      return siblings[Symbol.iterator]();
    },
  };
}

module.exports = siblings;
