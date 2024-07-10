"use strict";

const setImmediate = (cb, ...args) => setTimeout(cb, 0, ...args);
const clearImmediate = (id) => clearTimeout(id);

module.exports = { setImmediate, clearImmediate };
