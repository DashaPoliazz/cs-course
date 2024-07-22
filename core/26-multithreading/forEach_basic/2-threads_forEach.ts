import { Worker } from "node:worker_threads";

const sliceCollection = <T>(collection: T[], pieces: number): T[][] => {
  const slices = [];
  const len = collection.length;
  const sliceSize = Math.ceil(len / pieces);

  let left = 0;
  let right = sliceSize;
  while (left < collection.length) {
    const slice = collection.slice(left, right);
    slices.push(slice);

    left = right;
    right += sliceSize;
  }

  return slices;
};

// wrapping forEach into parallel fn
const forEachParallel =
  <T>(iterable: Iterable<T>, cb: (value: T) => void) =>
  (threads: number): Promise<number> => {
    const { promise, resolve, reject } = Promise.withResolvers<number>();

    // 1. Slicing collection into itearble pieces of data based on the threads amount
    const collection = Array.from(iterable);
    const slicedCollection = sliceCollection(collection, threads);

    // 2. Paralleling
    let completedThreads = 0;

    /* TIME MEASUREMENTS */
    const start = Date.now();
    /* TIME MEASUREMENTS */

    const serializedCb = cb.toString();
    const errors: Error[] = [];

    for (const chunk of slicedCollection) {
      const workerPath = "./worker.js";
      const worker = new Worker(workerPath, {
        workerData: { chunk, cb: serializedCb },
      });
      worker.on("message", () => {
        completedThreads += 1;
        if (completedThreads === threads) {
          /* TIME MEASUREMENTS */
          const end = Date.now();
          /* TIME MEASUREMENTS */

          if (errors.length) reject(errors);
          else resolve(end - start);
        }
      });
      worker.on("error", (error) => {
        errors.push(error);
        completedThreads += 1;
        if (completedThreads === threads) reject(errors);
      });
    }

    return promise;
  };

export default forEachParallel;
