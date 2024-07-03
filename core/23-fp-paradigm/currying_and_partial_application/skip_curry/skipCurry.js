"use strict";

const curry = (fn, ...params) => {
  curry._ = Symbol();
  // Incapsulating metadata in the closure keeping keys of curry untouched
  const collection = new Array(fn.length).fill(null);
  const hulls = [];
  let filled = 0;

  const wrapper = (idx, fn, ...params) => {
    const curried = (...args) => {
      for (const arg of args) {
        if (arg === curry._) {
          if (idx >= fn.length) {
            // There is possible to skip only first 'fnLength' arguments.
            throw new Error(
              `There is only possible to skip ${fn.length} argumnet. Trying to skip ${idx}`,
            );
          }
          // Memoizing hulls position.
          hulls.push(idx);
          idx += 1;
        } else {
          if (idx >= fn.length) {
            // It'f hull filler
            if (!hulls.length) throw new Error(`Hull ${idx} can't be filled`);
            collection[hulls.shift()] = arg;
            idx += 1;
            filled += 1;
          } else {
            collection[idx] = arg;
            idx += 1;
            filled += 1;
          }
        }
      }

      // Since there is each element could be skipped just oncely,
      // upper bound for idx :  fn.length (skip per each element) + fn.length (applying arguments)
      if (idx > collection.length * 2) {
        throw new Error("Each element could be skipped only once");
      }

      return filled >= collection.length ? fn(...collection) : wrapper(idx, fn);
    };

    return params.length ? curried(...params) : curried;
  };

  return wrapper(0, fn, ...params);
};

module.exports = curry;
