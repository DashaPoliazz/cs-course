async function* filter(asyncIterable, predicate) {
  for await (const item of asyncIterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

export default filter;
