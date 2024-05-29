function enumerate(iterable) {
  return {
    [Symbol.iterator]() {
      let idx = 0;
      let iter = iterable[Symbol.iterator]();

      return {
        next: () => {
          const { done, value } = iter.next();
          if (done) return { done, value };
          return { done: false, value: [idx++, value] };
        },
      };
    },
  };
}

module.exports = enumerate;
