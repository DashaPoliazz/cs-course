const enumerate = require("./enumerate.js");
const { iterable } = require("../mocks/iterable.js");
const random = require("../01-rand/rand.js");
const take = require("../02-take/take.js");

{
  const iterable = random();
  console.log([...take(enumerate(iterable), 3)]);
}

{
  console.log([...take(enumerate(iterable), 3)]);
}
