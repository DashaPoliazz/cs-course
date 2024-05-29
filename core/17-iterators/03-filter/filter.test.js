const filter = require("./filter.js");
const take = require("../02-take/take.js");
const { iterable } = require("../mocks/iterable.js");
const random = require("../01-rand/rand.js");

{
  const predicate = (el) => el > 2;
  console.log([...take(filter(iterable, predicate), 3)]);
}

{
  const predicate = (el) => el < 100;
  console.log([...take(filter(random(), predicate), 5)]);
}
