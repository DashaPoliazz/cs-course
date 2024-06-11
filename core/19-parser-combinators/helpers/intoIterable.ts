const ITERABLE_MARKER = Symbol("iterable_marker");

const intoIterable = <T>(iter: Iterator<T>): Iterable<T> & Iterator<T> => {
  // Check if the iterator is already wrapped
  if ((iter as any)[ITERABLE_MARKER]) {
    return iter as Iterable<T> & Iterator<T>;
  }

  // Cache the next method
  const next = iter.next.bind(iter);

  const iterableIterator = {
    [Symbol.iterator]() {
      return this;
    },
    next,
    [ITERABLE_MARKER]: true, // Mark this object as an iterable iterator
  };

  return iterableIterator;
};

export default intoIterable;
