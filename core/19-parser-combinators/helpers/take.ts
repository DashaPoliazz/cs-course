"use strict";

function take<T>(iterable: Iterable<T>, count: number) {
  return {
    [Symbol.iterator]() {
      const iterator = iterable[Symbol.iterator]();

      return {
        next: () => {
          const { value, done } = iterator.next();
          const doneFlag = count <= 0 || done;
          count -= 1;

          return {
            done: doneFlag,
            value,
          };
        },
      };
    },
  };
}

export default take;
