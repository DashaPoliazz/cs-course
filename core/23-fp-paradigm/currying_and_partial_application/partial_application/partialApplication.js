const partial =
  (f, ...args) =>
  (...rest) =>
    f(...args.concat(rest));

module.exports = partial;
