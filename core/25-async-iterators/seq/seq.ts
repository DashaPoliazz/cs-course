async function* seq(
  ...asyncIterables: AsyncIterable<any>[]
): AsyncGenerator<any> {
  for await (const asyncIterable of asyncIterables) {
    for await (const value of asyncIterable) {
      yield value;
    }
  }
}

export default seq;
