const curry = (f, ...args) => {
  const curried = (...params) => {
    return f.length > params.length
      ? curry(f.bind(null, ...params))
      : f(...params);
  };

  return args.length ? curried(...args) : curried;
};

module.exports = curry;
