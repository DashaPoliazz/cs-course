"use strict";

/**
 * Creates an iterator that filters elements from the given iterable based on a predicate function.
 *
 * @param {Iterable<T>} iterable - The iterable to filter elements from.
 * @param {(item: T) => bool} predicate - A function that determines whether an element should be included in the result.
 *                               It should accept an element as its parameter and return a boolean value.
 * @returns {Iterable<T>} An iterator that yields elements from the iterable that satisfy the predicate.
 *
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const filteredNumbers = [...filter(numbers, (num) => num % 2 === 0)];
 * console.log(filteredNumbers); // [2, 4]
 */
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
