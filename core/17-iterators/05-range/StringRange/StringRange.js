"use strict";

const Range = require("../Range/Range.js");
const NumberRange = require("../NumberRange/NumberRange.js");

const DEFAULT_STEP = 1;
const INCLUDED = false;

/**
 * Represents a range of strings or characters.
 * @extends Range
 */
class StringRange extends Range {
  /**
   * Creates an instance of StringRange.
   * @param {string} start - The start of the range.
   * @param {string} end - The end of the range.
   * @param {boolean} [included=false] - Whether the end value is included in the range.
   * @param {number} [step=1] - The step value for iterating over the range.
   */
  constructor(start, end, included = INCLUDED, step = DEFAULT_STEP) {
    super(start, end);
    this.start = start.codePointAt(0);
    this.end = end.codePointAt(0);
    this.included = included;
    this.step = step;
  }

  /**
   * Returns an iterator object that iterates over the string or character range.
   * @returns {Iterator<string>} An iterator object.
   */
  [Symbol.iterator]() {
    let value = this.start - this.step;

    return {
      /**
       * Retrieves the next value in the string or character range.
       * @returns {{ done: boolean, value: string }} An object containing the `done` flag and the `value`.
       */
      next: () => {
        value += this.step;
        const excludedDone = value >= this.end;
        const includedDone = value > this.end;
        const done = this.included ? includedDone : excludedDone;
        if (done) return { done, value: undefined };
        return { done, value: String.fromCodePoint(value) };
      },
    };
  }

  /**
   * Factory method to create instances of StringRange or NumberRange based on the input.
   * @param {string} start - The start of the range.
   * @param {string} end - The end of the range.
   * @param {boolean} [included=false] - Whether the end value is included in the range.
   * @param {number} [step=1] - The step value for iterating over the range.
   * @returns {Range} An instance of StringRange or NumberRange, depending on the input values.
   */
  static new(start, end, included, step) {
    const numericStart = Number(start);
    const numericEnd = Number(end);
    const numericIterator =
      !Number.isNaN(numericStart) && !Number.isNaN(numericEnd);

    return numericIterator
      ? new NumberRange(start, end, included, step)
      : new StringRange(start, end, included, step);
  }
}

module.exports = StringRange;
