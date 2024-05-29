"use strict";

function filter(iterable, predicate) {
  return {
    [Symbol.iterator]() {
      const iter = iterable[Symbol.iterator]();

      return {
        next: () => {
          for (
            let iterator = iter.next();
            !iterator.done;
            iterator = iter.next()
          ) {
            const { value } = iterator;
            if (predicate(value)) return { done: false, value };
          }
          return { done: true, value: undefined };
        },
      };
    },
  };
}

module.exports = filter;
