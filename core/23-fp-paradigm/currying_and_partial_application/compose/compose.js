const compose = (...fns) => {
  return (...args) => fns.reduceRight((acc, fn) => fn(acc), ...args);
};

module.exports = compose;
