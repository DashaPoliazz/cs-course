async function* take(asyncIterable, n) {
  let count = 0;
  const iterator = asyncIterable[Symbol.asyncIterator]();

  while (count < n) {
    const { done, value } = await iterator.next();
    if (done) break;
    yield value;
    count += 1;
  }
}

export default take;
