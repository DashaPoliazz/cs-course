// {
// const { setTimeout } = require("node:timers/promises");

// // (async () => {
// //   while (true) {
// //     await setTimeout(1000);
// //     console.log("another timer");
// //   }
// // })();

// // (async () => {
// //   let counter = 0;
// //   while (true) {
// //     await setTimeout(1000);
// //     console.log(++counter);
// //   }
// // })();
// }

function* loop(quant) {
  const element = yield 5;
  console.log(element);
}

const iter = loop(100);
const item1 = iter.next(0);
console.log(item1);
const item2 = iter.next(10);
console.log(item2);
