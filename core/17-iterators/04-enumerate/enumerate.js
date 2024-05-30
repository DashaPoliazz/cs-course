"use strict";
/**
 * Creates an iterator that yields elements of the given iterable along with their indices.
 *
 * @param {Iterable<T>} iterable - The iterable to enumerate.
 * @returns {Iterable<T>} An iterator that yields elements along with their indices.
 *
 * @example
 * const fruits = ['apple', 'banana', 'cherry'];
 * const enumeratedFruits = [...enumerate(fruits)];
 * console.log(enumeratedFruits);
 * // Output: [[0, 'apple'], [1, 'banana'], [2, 'cherry']]
 */
function enumerate(iterable) {
  return {
    [Symbol.iterator]() {
      let idx = 0;
      let iter = iterable[Symbol.iterator]();

      return {
        next: () => {
          const { done, value } = iter.next();
          if (done) return { done, value };
          return { done: false, value: [idx++, value] };
        },
      };
    },
  };
}

module.exports = enumerate;
