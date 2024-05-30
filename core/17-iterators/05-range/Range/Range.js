"use strict";

/**
 * Abstract class representing a range of values.
 * This class is only for type checking and validation.
 * It throws whether start and end are both incompatable types
 * or start > end.
 *
 * DON'T INVOKE CONSTRUCTOR OF THIS CLASS OUTSIDE THE CLASSES THAT
 * SHOULD BE EXTENDED FROM THIS CLASS
 *
 * @abstract
 */
class Range {
  /**
   * Creates an instance of Range.
   * @param {*} start - The start of the range.
   * @param {*} end - The end of the range.
   * @throws {TypeError} When start and end have different types.
   * @throws {Error} When start is greater than end.
   */
  constructor(start, end) {
    if (this.#incompatibleTypes(start, end)) {
      throw new TypeError("'start' and 'end' should have the same type");
    }

    this.type = typeof start;
    this.start = start;
    this.end = end;

    if (this.#invalidRange()) {
      throw new Error(`${this.start} > ${this.end}`);
    }
  }

  /**
   * Factory method to create instances of subclasses.
   * @abstract
   * @param {*} start - The start of the range.
   * @param {*} end - The end of the range.
   * @returns {Range} An instance of a subclass of Range.
   * @throws {Error} When invoked directly on the abstract class.
   */
  static new(start, end) {
    throw new Error("Abstract class could not be instantiated");
  }

  /**
   * Checks if start and end have incompatible types.
   * @private
   * @param {*} start - The start of the range.
   * @param {*} end - The end of the range.
   * @returns {boolean} True if start and end have different types, otherwise false.
   */
  #incompatibleTypes(start, end) {
    return typeof start !== typeof end;
  }

  /**
   * Checks if the range is invalid.
   * @private
   * @returns {boolean} True if the range is invalid, otherwise false.
   */
  #invalidRange() {
    if (this.type === "number")
      return this.#invalidNumberRange(this.start, this.end);
    if (this.type === "string")
      return this.#invalidStringRange(this.start, this.end);
    return false;
  }

  /**
   * Checks if the range of numbers is invalid.
   * @private
   * @param {number} start - The start of the range.
   * @param {number} end - The end of the range.
   * @returns {boolean} True if the range is invalid, otherwise false.
   */
  #invalidNumberRange(start, end) {
    return start > end;
  }

  /**
   * Checks if the range of strings is invalid.
   * @private
   * @param {string} start - The start of the range.
   * @param {string} end - The end of the range.
   * @returns {boolean} True if the range is invalid, otherwise false.
   */
  #invalidStringRange(start, end) {
    const incompatibleLength = start.length !== 1 && end.length !== 1;
    if (incompatibleLength) {
      const numericStart = Number(start);
      const numericEnd = Number(end);
      const successfulNumberCast =
        !Number.isNaN(numericStart) && !Number.isNaN(numericEnd);
      if (!successfulNumberCast) return true;
      if (this.#invalidNumberRange(numericStart, numericEnd)) return true;
      return false;
    }
    return start.localeCompare(end) === 1;
  }
}

module.exports = Range;
