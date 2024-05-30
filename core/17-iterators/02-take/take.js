"use strict";

/**
 * Creates an iterator that yields the first `count` elements from the given iterable.
 *
 * @param {Iterable} iterable - The iterable to take elements from.
 * @param {number} count - The number of elements to take.
 * @returns {Iterable<T>} An iterable that yields the first `count` elements from the iterable.
 *
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const firstThreeNumbers = [...take(numbers, 3)];
 * console.log(firstThreeNumbers); // [1, 2, 3]
 */
function take(iterable, count) {
  return {
    [Symbol.iterator]() {
      const iterator = iterable[Symbol.iterator]();

      return {
        next: () => {
          const { value, done } = iterator.next();
          const doneFlag = count <= 0 || done;
          count -= 1;

          return {
            done: doneFlag,
            value,
          };
        },
      };
    },
  };
}

module.exports = take;
