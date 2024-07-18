async function* every(asyncIterable, predicate) {
  while (true) {
    const results = [];
    for await (const item of asyncIterable) {
      if (!predicate(item)) return;
      results.push(item);
    }
    yield* results;
  }
}

export default every;
