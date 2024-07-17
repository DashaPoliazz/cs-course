async function* filter<T>(
  asyncIterable: AsyncIterable<T>,
  predicate: (item: T) => boolean,
) {
  for await (const item of asyncIterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

export default filter;
