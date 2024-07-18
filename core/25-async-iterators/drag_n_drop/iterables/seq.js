async function* seq(...asyncIterables) {
  for (const asyncIterable of asyncIterables) {
    for await (const value of asyncIterable) {
      yield value;
    }
  }
}

export default seq;
