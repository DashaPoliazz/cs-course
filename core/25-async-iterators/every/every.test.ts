import { it } from "node:test";
import assert from "node:assert";
import on from "../on/on";
import every from "./gen";
import { EventEmitter } from "node:events";

const intoAsyncIterable = <T>(collection: T[]): AsyncIterable<T> => ({
  [Symbol.asyncIterator](): AsyncIterator<T> {
    let idx = 0;
    return {
      async next(): Promise<IteratorResult<T>> {
        const done = idx >= collection.length;
        const value = done ? undefined : await collection[idx++];
        return { done, value } as IteratorResult<T>;
      },
    };
  },
});

it("should work correctly", async () => {
  const ee = new EventEmitter();
  const eventName = "your_event_name";
  type EmittedItem = { eventName: string; data: string };
  const asyncIterator = on<EmittedItem>(ee, eventName);

  const intervalId = setInterval(() => {
    const dataToEmit = {
      eventName,
      data: "your_data_to_emit",
    };
    ee.emit(eventName, dataToEmit);
  }, 1_000);

  setTimeout(() => clearInterval(intervalId), 3_000);

  (async () => {
    const storage = [];
    const onlyEvent = (eventName: string) => (item: EmittedItem) => {
      return item.eventName === eventName;
    };

    for await (const item of every(asyncIterator, onlyEvent(eventName))) {
      console.log("ITEM", item);
    }

    assert.equal(3, storage.length);
  })();
});

// it("should be compatable with async iterable", () => {
//   // setup
//   const promises = [];
//   for (let i = 0; i < 5; i++) {
//     const promise = new Promise((resolve, reject) => {
//       setTimeout(() => resolve(i), 1_000 * i);
//     });
//     promises.push(promise);
//   }
//   // tests
//   const predicate = (item: number) => true;
//   const asyncIterable = intoAsyncIterable(promises);
//   const everyGreaterThanOne = every<Promise<number>>(asyncIterable, predicate);
//   (async () => {
//     for await (const item of everyGreaterThanOne) {
//       console.log(item);
//     }
//     console.log("suka");
//   })();
// });
