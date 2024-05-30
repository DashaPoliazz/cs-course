"use strict";

const crypto = require("node:crypto");

const ZERO = 0;
const ONE_MILLION = 1e6;

/**
 * Generates an infinite sequence of random numbers within the specified range.
 *
 * @param {number} [min=0] - The lower bound of the range (inclusive).
 * @param {number} [max=1e6] - The upper bound of the range (exclusive).
 * @returns {IterableIterator<number>} An iterable iterator that generates random numbers.
 *
 * @example
 * const randomNumbers = random(1, 10);
 * const firstFiveNumbers = Array.from({ length: 5 }, () => randomNumbers.next().value);
 * console.log(firstFiveNumbers); // [random_number_1, random_number_2, ..., random_number_5]
 */
function random(min = ZERO, max = ONE_MILLION) {
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      return {
        done: false,
        value: crypto.randomInt(min, max),
      };
    },
  };
}

module.exports = random;
