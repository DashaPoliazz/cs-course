"use strict";

const Range = require("../Range/Range.js");

const DEFAULT_STEP = 1;
const INCLUDED = false;

/**
 * Represents a range of numbers.
 * @extends Range
 */
class NumberRange extends Range {
  /**
   * Creates an instance of NumberRange.
   * @param {number} start - The start of the range.
   * @param {number} end - The end of the range.
   * @param {boolean} [included=false] - Whether the end value is included in the range.
   * @param {number} [step=1] - The step value for iterating over the range.
   */
  constructor(start, end, included = INCLUDED, step = DEFAULT_STEP) {
    super(start, end);
    this.included = included;
    this.step = step;
  }

  /**
   * Returns an iterator object that iterates over the number range.
   * @returns {Iterator<number>} An iterator object.
   */
  [Symbol.iterator]() {
    let value = this.start - this.step;

    return {
      /**
       * Retrieves the next value in the number range.
       * @returns {{ done: boolean, value: number }} An object containing the `done` flag and the `value`.
       */
      next: () => {
        value += this.step;
        const excludedDone = value >= this.end;
        const includedDone = value > this.end;
        const done = this.included ? includedDone : excludedDone;
        if (done) return { done, value: undefined };
        return { done, value };
      },
    };
  }

  /**
   * Factory method to create instances of NumberRange.
   * @param {number} start - The start of the range.
   * @param {number} end - The end of the range.
   * @param {boolean} [included=false] - Whether the end value is included in the range.
   * @param {number} [step=1] - The step value for iterating over the range.
   * @returns {NumberRange} An instance of NumberRange.
   */
  static new(start, end, included, step) {
    return new NumberRange(start, end, included, step);
  }
}

module.exports = NumberRange;
