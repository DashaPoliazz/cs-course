{
  // Iterable
  const iterableObject = {
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [Symbol.iterator]() {
      let index = 0;
      const data = this.data;
      return {
        next() {
          if (index < data.length) {
            return { value: data[index++], done: false };
          } else {
            return { done: true };
          }
        },
      };
    },
  };

  for (const item of iterableObject) {
    console.log("Iterable", item);
  }
}

{
  // Iterator
  const iteratorObject = {
    data: [1, 2, 3],
    index: 0,
    next() {
      if (this.index < this.data.length) {
        return { value: this.data[this.index++], done: false };
      } else {
        return { done: true };
      }
    },
  };

  console.log("iterator", iteratorObject.next()); // { value: 1, done: false }
  console.log("iterator", iteratorObject.next()); // { value: 2, done: false }
  console.log("iterator", iteratorObject.next()); // { value: 3, done: false }
  console.log("iterator", iteratorObject.next()); // { done: true }

  // Error -> iteratorObject is not iterable
  //   for (const item of iteratorObject) {
  //     console.log("item");
  //   }
}

{
  const iterableIteratorObject = {
    data: [1, 2, 3],
    index: 0,
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (this.index < this.data.length) {
        return { value: this.data[this.index++], done: false };
      } else {
        return { done: true };
      }
    },
  };

  for (const item of iterableIteratorObject) {
    console.log("IterableIterator", item);
  }
}
