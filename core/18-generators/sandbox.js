"use strict";

// function* floatParser(text) {
//   const regex = /-?\d+\.\d+/g;
//   const floatingPointNumbers = text.matchAll(regex);
//   console.log(text);
//   for (const floatintPointNumber of floatingPointNumbers) {
//     const newText = yield floatintPointNumber[0];
//     console.log(newText);
//   }
//   throw new Error("");
// }

// const iter = floatParser("hello 123 534.234 -56.78");
// try {
//   console.log(iter.next());
//   console.log(iter.next());
//   console.log(iter.next());
// } catch (e) {
//   console.log("err", e);
//   console.log(iter.next("123.123"));
// }

// const iter = floatParser("hello 123 534.234 -56.78");
// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next("123.32"));

function* gen() {
  return;
}

console.log(gen().next());
