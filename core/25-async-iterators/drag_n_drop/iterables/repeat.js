async function* repeat(asyncIterable) {
  while (true) {
    for await (const item of asyncIterable) {
      yield item;
    }
  }
}

export default repeat;
