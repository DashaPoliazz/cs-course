const FizzBuzzSymbolIterator = require("./symbol-iterator.js");

const symbolIterator = new FizzBuzzSymbolIterator();
for (const item of symbolIterator) {
  console.log("symbolIterator:", item);
}

console.log("\n");

const fizzBuzzGenerator = require("./generator.js");

const generatorIterator = fizzBuzzGenerator(16n, 30n);
for (const item of generatorIterator) {
  console.log("generatorIterator:", item);
}

console.log("\n");

const fizzbuzz = require("./homework-contract.js");
const myFizzBazz = fizzbuzz();

console.log(myFizzBazz.next()); // 1n
console.log(myFizzBazz.next()); // 2n
console.log(myFizzBazz.next()); // Fizz
console.log(myFizzBazz.next()); // 4n
console.log(myFizzBazz.next()); // Fizz
