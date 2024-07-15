// {
//   const asyncIterable = {
//     [Symbol.asyncIterator]() {
//       let counter = 0;
//       return {
//         async next() {
//           return counter > 2
//             ? {
//                 done: true,
//                 value: undefined,
//               }
//             : {
//                 done: false,
//                 value: ++counter,
//               };
//         },
//       };
//     },
//   };

//   (async () => {
//     const iter = asyncIterable[Symbol.asyncIterator]();
//     for await (n of asyncIterable) {
//       console.log(n);
//     }
//     console.log(await iter.next());
//     console.log(await iter.next());
//     console.log(await iter.next());
//     console.log(await iter.next());
//   })();
// }

// {
//   async function* asyncCount() {
//     let count = 0;
//     while (count < 3) {
//       yield ++count;
//     }
//   }

//   (async () => {
//     for await (n of asyncCount()) {
//       console.log(n);
//     }
//   })();
// }

{
  const { EventEmitter } = require("node:events");
  const ee = new EventEmitter();

  function asyncEmitter(emitter, event) {
    const promises = [];
    emitter.on(event, (data) => {
      promises.splice(0, promises.length).forEach((resolve) => {
        resolve({ done: false, value: data });
      });
    });

    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      next() {
        const promise = Promise.withResolvers();
        promises.push(promise);
        return promise.promise;
      },
    };
  }
}
