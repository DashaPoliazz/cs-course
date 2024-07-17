async function* take<T>(asyncItearble: AsyncIterable<T>, n: number) {
  let count = 0;
  for await (const item of asyncItearble) {
    if (count >= n) return;
    yield item;
    count += 1;
  }
}

export default take;
