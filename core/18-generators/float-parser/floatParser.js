"use strict";

function* floatParser(text) {
  const regex = /-?\d+\.\d+/g;
  const floatingPointNumbers = text.matchAll(regex);
  for (const floatintPointNumber of floatingPointNumbers) {
    yield floatintPointNumber[0];
  }
  return floatParser(text);
}

module.exports = floatParser;
