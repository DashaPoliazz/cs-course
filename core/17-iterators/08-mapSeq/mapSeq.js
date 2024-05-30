"use strict";

/**
 * Creates an iterable sequence by applying a sequence of mappers to each element of the input iterable.
 * @param {Iterable<T>} iterable - The input iterable.
 * @param {...Function} mappers - The sequence of mapper functions to apply to each element.
 * @returns {Iterable<T>} An iterable sequence containing the mapped elements.
 */
function mapSeq(iterable, ...mappers) {
  return {
    /**
     * Returns an iterator object that iterates over the mapped sequence of elements.
     * @returns {Iterator} An iterator object.
     */
    [Symbol.iterator]() {
      const iterator = iterable[Symbol.iterator]();
      return {
        next: () => {
          const itemToYield = iterator.next();
          const done = itemToYield.done;
          if (done) return { done, value: undefined };
          const value = this.mapReduce(itemToYield.value);
          return { done: false, value };
        },
      };
    },
    /**
     * Applies the sequence of mapper functions to a value.
     * @param {*} value - The value to be mapped.
     * @returns {*} The mapped value.
     */
    mapReduce: (value) => mappers.reduce((acc, f) => f(acc), value),
  };
}

module.exports = mapSeq;
