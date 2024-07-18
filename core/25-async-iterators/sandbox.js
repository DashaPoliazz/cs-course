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

// {
//   const { EventEmitter } = require("node:events");
//   const ee = new EventEmitter();

//   function asyncEmitter(emitter, event) {
//     const promises = [];
//     emitter.on(event, (data) => {
//       promises.splice(0, promises.length).forEach((resolve) => {
//         resolve({ done: false, value: data });
//       });
//     });

//     return {
//       [Symbol.asyncIterator]() {
//         return this;
//       },
//       next() {
//         const promise = Promise.withResolvers();
//         promises.push(promise);
//         return promise.promise;
//       },
//     };
//   }
// }

// {
//   const { EventEmitter } = require("node:events");
//   const ee = new EventEmitter();
//   ee.on("foo", (...args) => console.log(...args));
//   ee.emit("foo");
// }

{
  const promises = [];

  for (let i = 0; i < 3; i++) {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(i), 1_000 * i);
    });
    promises.push(promise);
  }

  const intoAsyncIterable = (collection) => ({
    [Symbol.asyncIterator]() {
      let idx = 0;
      return {
        async next() {
          const done = idx >= collection.length;
          const value = done ? undefined : await collection[idx];
          idx += 1;
          return { done, value };
        },
      };
    },
  });

  (async () => {
    const asyncIterable = intoAsyncIterable(promises);
    for await (const item of asyncIterable) {
      console.log(item);
    }
    console.log("done");
  })();
}

{
  // every:
  // function every(asyncIterable, predicate) {
  //   const { promise, resolve } = (() => {
  //     let resolve;
  //     const promise = new Promise((res) => {
  //       resolve = res;
  //     });
  //     return { promise, resolve };
  //   })();

  //   (async () => {
  //     const collection = [];
  //     for await (const item of asyncIterable) {
  //       if (!predicate(item)) {
  //         resolve([false, []]);
  //         return;
  //       }
  //       collection.push(item);
  //     }
  //     resolve([true, collection]);
  //   })();

  //   return {
  //     [Symbol.asyncIterator]() {
  //       let iter = null;
  //       let iterInited = false;
  //       return {
  //         async next() {
  //           const [corrupted, collection] = await promise;
  //           if (corrupted) return { done: true, value: undefined };
  //           if (!iterInited) {
  //             iterInited = true;
  //             iter = collection[Symbol.iterator]();
  //           }
  //           return iter.next();
  //         },
  //       };
  //     },
  //   };
  // }

  async function* every(asyncIterable, predicate) {
    const collection = [];
    for await (const item of asyncIterable) {
      collection.push(item);
    }
    console.log(collection);
    yield* collection;
  }

  const promises = [];

  for (let i = 0; i < 5; i++) {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(i), 1_000 * i);
    });
    promises.push(promise);
  }

  const intoAsyncIterable = (collection) => ({
    [Symbol.asyncIterator]() {
      let idx = 0;
      return {
        async next() {
          const done = idx >= collection.length;
          const value = done ? undefined : await collection[idx];
          idx += 1;
          return { done, value };
        },
      };
    },
  });

  const asyncIterable = intoAsyncIterable(promises);
  const predicate = (item) => item % 2 === 0;

  (async () => {
    for await (item of every(asyncIterable, predicate)) {
      console.log(item);
    }
  })();
}
