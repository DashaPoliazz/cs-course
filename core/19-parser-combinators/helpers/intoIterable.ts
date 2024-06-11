const intoIterable = <T>(iter: Iterator<T>): Iterable<T> & Iterator<T> => ({
  [Symbol.iterator]() {
    return this;
  },
  next: iter.next.bind(iter),
});

export default intoIterable;
