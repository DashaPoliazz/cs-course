"use strict";

function* floatParser(text) {
  const regex = /-?\d+\.\d+/g;
  const floatingPointNumbers = text.matchAll(regex);
  for (const floatintPointNumber of floatingPointNumbers) {
    yield floatintPointNumber[0];
  }

  yield "#";
  const newText = yield "new Text provided";
  yield* floatParser(newText);
}

module.exports = floatParser;
