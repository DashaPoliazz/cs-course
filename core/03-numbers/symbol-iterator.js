"use strict";

module.exports = class {
  #DEFAULT_THRESHOLD = 15n;
  #DEFAULT_STEP = 1n;

  constructor(threshold = this.#DEFAULT_THRESHOLD, step = this.#DEFAULT_STEP) {
    this.threshold = threshold;
    this.step = step;
  }

  [Symbol.iterator]() {
    const threshold = this.threshold;
    const step = this.step;

    let current = 0n;

    return {
      next() {
        const zero = current === 0n;
        const fizz = !zero && current % 3n === 0n;
        const buzz = !zero && current % 5n === 0n;
        const fizzbuzz = !zero && fizz && buzz;

        const done = current >= threshold;
        const value = current;
        const iterator = {
          done,
          value,
        };

        current += step;

        if (fizzbuzz) {
          console.log(`[${value}] - [fizzbuzz]`);
          return iterator;
        } else if (fizz) {
          console.log(`[${value}] - [fizz]`);
          return iterator;
        } else if (buzz) {
          console.log(`[${value}] - [buzz]`);
          return iterator;
        } else {
          return iterator;
        }
      },
    };
  }
};
