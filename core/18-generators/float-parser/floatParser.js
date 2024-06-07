"use strict";

const regex = /[+-]?(\d*\.\d+|\d+\.\d*)([eE][+-]?\d+)?/g;

class FloatParser {
  constructor(text) {
    this.queue = [];
    if (text) this.queue.push(text);
  }

  static Parse(text) {
    return new FloatParser(text);
  }

  iter() {
    return this[Symbol.iterator]();
  }

  *[Symbol.iterator]() {
    while (true) {
      const text = this.queue.shift();
      if (text) {
        const floatNumbers = text.matchAll(regex);
        for (const floatNumber of floatNumbers) {
          const newText = yield floatNumber[0];
          if (newText) this.queue.push(newText);
        }
      }
      const newText = yield "_";
      if (newText) this.queue.push(newText);
    }
  }
}

module.exports = FloatParser;
