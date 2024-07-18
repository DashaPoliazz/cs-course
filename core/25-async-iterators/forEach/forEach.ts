function forEach<T>(asyncIterable: AsyncIterable<T>, cb: (e: T) => void) {
  (async () => {
    for await (const item of asyncIterable) {
      cb(item);
    }
  })();
}

export default forEach;
