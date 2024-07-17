async function* any(
  ...asyncIterables: AsyncIterable<any>[]
): AsyncGenerator<any> {
  const asyncIterators = asyncIterables
    .map((asyncIterable) => asyncIterable[Symbol.asyncIterator]())
    .map((asyncIterator) => asyncIterator.next());

  const finisher = await Promise.any(asyncIterators);
  yield finisher.value;
}

export default any;
