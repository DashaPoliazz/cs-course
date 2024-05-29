"use strict";

const Range = require("../Range/Range.js");

const DEFAULT_STEP = 1;
const INCLUDED = false;

class NumberRange extends Range {
  constructor(start, end, included = INCLUDED, step = DEFAULT_STEP) {
    super(start, end);
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
        return { done, value };
      },
    };
  }

  static new(start, end, included, step) {
    return new NumberRange(start, end, included, step);
  }
}

module.exports = NumberRange;
