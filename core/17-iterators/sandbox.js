// // Iterable
// const iterableObject = {
//   data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [Symbol.iterator]() {
//     let index = 0;
//     const data = this.data;
//     return {
//       next() {
//         if (index < data.length) {
//           return { value: data[index++], done: false };
//         } else {
//           return { done: true };
//         }
//       },
//     };
//   },
// };

// const iterator1 = iterableObject[Symbol.iterator]();
// console.log(iterator1.next());
// console.log(iterator1.next());
// console.log(iterator1.next());

// const iterator2 = iterableObject[Symbol.iterator]();
// console.log(iterator2.next());
// console.log(iterator2.next());
// console.log(iterator2.next());

const iterables = [[1, 2], new Set([3, 4]), "bl"];
const iterators = iterables.map((iterable) => iterable[Symbol.iterator]());
console.log(iterators.map((iterator) => iterator.next()));
console.log(iterators.map((iterator) => iterator.next()));
