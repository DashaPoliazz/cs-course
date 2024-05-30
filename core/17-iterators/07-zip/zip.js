"use strict";

const getLength = require("../helpers/getLength.js");

/**
 * Combines multiple iterables into a single iterable of tuples, where the nth tuple contains the nth element from each of the input iterables.
 * Iterator is done when the smalles iterable of the iterables will be consumed.
 * @param {Iterable<T>[]} iterables - The iterables to zip.
 * @returns {Iterable<T>} An iterable of tuples containing elements from all the input iterables.
 */
function zip(...iterables) {
  // Get the lengths of all input iterables
  const lengths = iterables.map(getLength);

  return {
    /**
     * Returns an iterator object that iterates over the zipped sequence of iterables.
     * @returns {Iterator<T>} An iterator object.
     */
    [Symbol.iterator]() {
      // Determine the minimum length among all input iterables
      let minLength = Math.min(...lengths);

      // Get iterators for all input iterables
      const iterators = iterables.map((iterable) =>
        iterable[Symbol.iterator](),
      );

      return {
        next: () => {
          // Check if the zipped sequence has been fully traversed
          const done = minLength <= 0;
          if (done) return { done, value: undefined };

          minLength -= 1;

          // Retrieve the next element from each iterable and construct a tuple
          const value = iterators
            .map((iterator) => iterator.next())
            .map((iterator) => iterator.value);

          return { done, value };
        },
      };
    },
  };
}

module.exports = zip;
