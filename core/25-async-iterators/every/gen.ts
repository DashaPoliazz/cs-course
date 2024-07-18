async function* every<T>(
  asyncIterable: AsyncIterable<T>,
  predicate: (item: T) => boolean,
) {
  const results = [];
  for await (const item of asyncIterable) {
    if (!predicate(item)) return;
    results.push(item);
  }
  yield* results;
}

// for testing purposes:
// {
//   const promises = [];

//   for (let i = 0; i < 3; i++) {
//     const promise = new Promise<number>((resolve, reject) => {
//       setTimeout(() => resolve(i), 3_000 * i);
//     });
//     promises.push(promise);
//   }

//   const intoAsyncIterable = <T>(
//     collection: Promise<T>[],
//   ): AsyncIterable<T> => ({
//     [Symbol.asyncIterator](): AsyncIterator<T> {
//       let idx = 0;
//       return {
//         async next(): Promise<IteratorResult<T>> {
//           if (idx >= collection.length) {
//             return { done: true, value: undefined } as IteratorResult<T>;
//           }
//           const value = await collection[idx++];
//           return { done: false, value };
//         },
//       };
//     },
//   });

//   const asyncIterable = every(
//     intoAsyncIterable(promises),
//     (item: number) => item >= 0,
//   );

//   (async () => {
//     for await (const item of asyncIterable) {
//       console.log(item);
//     }
//   })();
// }

export default every;
