"use strict";

const debounce = (fn, ms) => {
  let timeout;

  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, ms);
  };
};

module.exports = debounce;
