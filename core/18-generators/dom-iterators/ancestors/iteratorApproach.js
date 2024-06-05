"use strict";

const BODY_TAG_NAME = "BODY";

function iteratorApproach(domNode) {
  return {
    [Symbol.iterator]() {
      let parent = domNode.parentNode;

      return {
        next: () => {
          const done = !parent || parent.tagName === BODY_TAG_NAME;
          if (done) return { done, value: undefined };
          const value = parent;
          parent = parent.parentNode;
          return { done, value };
        },
      };
    },
  };
}

module.exports = iteratorApproach;
