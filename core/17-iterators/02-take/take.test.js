const take = require("./take.js");
const random = require("../01-rand/rand.js");
const { iterable } = require("../mocks/iterable.js");

{
  const rnd = random();
  console.log([...take(rnd, 3)]);
}

{
  console.log([...take(iterable, 5)]);
  console.log([...take(iterable, 10)]);
}
