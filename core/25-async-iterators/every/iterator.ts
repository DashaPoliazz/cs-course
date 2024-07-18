function every<T>(
  asyncIterable: AsyncIterable<T>,
  predicate: (item: T) => boolean,
): AsyncIterable<T> {
  const { promise, resolve } = Promise.withResolvers<[boolean, T[]]>();
  // executer
  (async () => {
    const collection: T[] = [];
    for await (const item of asyncIterable) {
      if (!predicate(item)) {
        resolve([false, []]);
        return;
      }
      collection.push(item);
    }
    resolve([true, collection]);
  })();

  return {
    [Symbol.asyncIterator]() {
      let iter: Iterator<T> | null = null;
      let iterInited = false;
      return {
        async next() {
          const [corrupted, collection] = await promise;
          if (corrupted) return { done: true, value: undefined };
          if (!iterInited) {
            iterInited = true;
            iter = collection[Symbol.iterator]();
          }
          return iter!.next();
        },
      };
    },
  };
}

export default every;
