const Range = require("../Range/Range");

class NumberRange extends Range {
  constructor(start, end) {
    super(start, end);
  }

  static new(start, end) {
    return new NumberRange(start, end);
  }
}
