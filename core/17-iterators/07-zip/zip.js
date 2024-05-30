"use strict";

const getLength = require("../helpers/getLength.js");

function zip(...iterables) {
  const lengths = iterables.map(getLength);

  return {
    [Symbol.iterator]() {
      let minLength = Math.min(...lengths);
      const iterators = iterables.map((iterable) =>
        iterable[Symbol.iterator](),
      );

      return {
        next: () => {
          const done = minLength <= 0;
          if (done) return { done, value: undefined };
          minLength -= 1;

          const value = iterators
            .map((iterator) => iterator.next())
            .map((iterator) => iterator.value);

          return { done, value };
        },
      };
    },
  };
}

module.exports = zip;
