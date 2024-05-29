const iterable = {
  collection: [1, 2, 3, 4, 5],
  [Symbol.iterator]() {
    let idx = 0;

    return {
      next: () => {
        const done = idx >= this.collection.length;
        const value = this.collection[idx];
        idx += 1;
        return { done, value };
      },
    };
  },
};

module.exports = { iterable };
