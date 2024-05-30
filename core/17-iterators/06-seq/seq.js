"use strict";

/**
 * Combines multiple iterables into a single iterable sequence.
 * @param {Iterable<T>[]} iterables - The iterables to combine.
 * @returns {Iterable<T>} An iterable sequence containing elements from all the input iterables.
 */
function seq(...iterables) {
  return {
    /**
     * Returns an iterator object that iterates over the combined sequence of iterables.
     * @returns {Iterator<T>} An iterator object.
     */
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

    /**
     * Returns an iterator object that represents a consumed sequence.
     * @returns {Iterator} An iterator object.
     */
    consumedIterator() {
      return {
        next: () => ({ done: true, value: undefined }),
      };
    },
  };
}

module.exports = seq;
