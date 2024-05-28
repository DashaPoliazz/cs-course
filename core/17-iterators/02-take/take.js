"use strict";

function take(iterable, count) {
  return {
    [Symbol.iterator]() {
      const iter = iterable[Symbol.iterator]();

      return {
        next: () => {
          const value = iter.next().value;
          // Iterable could yield 'undefined'
          const done = count <= 0 || value === undefined;

          count -= 1;

          return {
            done,
            value,
          };
        },
      };
    },
  };
}

module.exports = take;
