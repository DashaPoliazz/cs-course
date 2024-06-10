console.log("hello");

class Parser<T> {
  constructor(item: T) {
    console.log(item);
  }
}

module.exports = Parser;
