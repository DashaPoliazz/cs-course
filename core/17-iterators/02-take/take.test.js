const take = require("./take.js");
const random = require("../01-rand.js");

const iterable = {
  collection: [1],
  [Symbol.iterator]() {
    let idx = 0;

    return {
      next: () => {
        const done = idx >= this.collection.length;
        const value = this.collection[idx];
        idx += 1;
        return { done, value };
      },
    };
  },
};

// for (const value of iterable) console.log(value);
// console.log(iterable[Symbol.iterator]().next());

{
}
