"use strict";

class Range {
  constructor(start, end) {
    if (this.#incompatableTypes(start, end)) {
      throw new TypeError("'start' and 'end' should have same type");
    }

    this.type = typeof start;
    this.start = start;
    this.end = end;

    if (this.#invalidRange()) {
      throw new Error(`${this.start} > ${this.end}`);
    }
  }

  static new(start, end) {
    throw new Error("Abstract class could not be instantiated");
  }

  #incompatableTypes(start, end) {
    return typeof start !== typeof end;
  }
  #invalidRange() {
    if (this.type === "number")
      return this.#invalidNumberRange(this.start, this.end);
    if (this.type === "string")
      return this.#invalidStringRange(this.start, this.end);
    return false;
  }
  #invalidStringRange(start, end) {
    const incompatableLength = start.length !== 1 && end.length !== 1;
    if (incompatableLength) {
      // try to typecast to number ('1234', '12345');
      const numericStart = Number(start);
      const numericEnd = Number(end);
      const successfullNumberCast =
        !Number.isNaN(numericStart) && !Number.isNaN(numericEnd);
      if (!successfullNumberCast) return true;
      if (this.#invalidNumberRange(numericStart, numericEnd)) return true;
      return false;
    }
    const startGreaterThanEnd = start.localeCompare(end) === 1;
    if (startGreaterThanEnd) return true;
    return false;
  }
  #invalidNumberRange(start, end) {
    const startGreaterThanEnd = start > end;
    if (startGreaterThanEnd) return true;
    return false;
  }
}

module.exports = Range;
