async function* repeat<T>(asyncIterable: AsyncIterable<T>) {
  while (true) {
    yield* asyncIterable;
  }
}

export default repeat;
