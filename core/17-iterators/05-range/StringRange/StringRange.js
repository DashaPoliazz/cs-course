const Range = require("../Range/Range.js");

class StringRange extends Range {
  constructor(start, end) {
    super(start, end);
  }

  static new(start, end) {
    return new StringRange(start, end);
  }

  [Symbol.iterator]() {
    let asciiPosition = this.start.charCodeAt();

    return {
      next() {},
    };
  }
}

module.exports = StringRange;
