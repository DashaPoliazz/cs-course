async function* any(...asyncIterables) {
  while (true) {
    const asyncIterators = asyncIterables
      .map((asyncIterable) => asyncIterable[Symbol.asyncIterator]())
      .map((asyncIterator) => asyncIterator.next());

    const finisher = await Promise.any(asyncIterators);
    yield finisher.value;
  }
}

export default any;
