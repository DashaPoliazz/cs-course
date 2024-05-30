"use strict";

function mapSeq(iterable, ...mappers) {
  return {
    [Symbol.iterator]() {
      const iterator = iterable[Symbol.iterator]();
      return {
        next: () => {
          const itemToYield = iterator.next();
          const done = itemToYield.done;
          if (done) return { done, value: undefined };
          const value = this.mapReduce(itemToYield.value);
          return { done: false, value };
        },
      };
    },
    mapReduce: (value) => mappers.reduce((acc, f) => f(acc), value),
  };
}

module.exports = mapSeq;
