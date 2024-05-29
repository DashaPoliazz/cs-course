"use strict";

const Range = require("../Range/Range.js");
const NumberRange = require("../NumberRange/NumberRange.js");

const DEFAULT_STEP = 1;
const INCLUDED = false;

class StringRange extends Range {
  constructor(start, end, included = INCLUDED, step = DEFAULT_STEP) {
    super(start, end);
    this.start = start.charCodeAt();
    this.end = end.charCodeAt();
    this.included = included;
    this.step = step;
  }

  [Symbol.iterator]() {
    let value = this.start - this.step;

    return {
      next: () => {
        value += this.step;
        const excludedDone = value >= this.end;
        const includedDone = value > this.end;
        const done = this.included ? includedDone : excludedDone;
        if (done) return { done, value: undefined };
        return { done, value: String.fromCharCode(value) };
      },
    };
  }

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
