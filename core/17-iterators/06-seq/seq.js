"use strict";

function seq(...iterables) {
  return {
    [Symbol.iterator]() {
      if (iterables.length === 0) return this.consumedIterator();

      let idx = 0;
      let iterable = iterables[idx];
      let iterator = iterable[Symbol.iterator]();

      return {
        next: () => {
          let itemToYield = iterator.next();
          while (itemToYield.done) {
            iterable = iterables[++idx];
            if (idx >= iterables.length) {
              return { done: true, value: undefined };
            }
            iterator = iterable[Symbol.iterator]();
            itemToYield = iterator.next();
          }
          return itemToYield;
        },
      };
    },
    consumedIterator() {
      return {
        next: () => ({ done: true, value: undefined }),
      };
    },
  };
}

module.exports = seq;
