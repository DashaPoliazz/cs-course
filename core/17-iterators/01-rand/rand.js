"use strict";

const crypto = require("node:crypto");

const ZERO = 0;
const ONE_MILLION = 1e6;

function random(min = ZERO, max = ONE_MILLION) {
  return {
    next() {
      return {
        done: false,
        value: crypto.randomInt(min, max),
      };
    },
  };
}

module.exports = random;
