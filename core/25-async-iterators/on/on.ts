import { EventEmitter } from "node:events";

function on<T>(emitter: EventEmitter, eventName: string): AsyncIterable<T> {
  const queue: ((result: IteratorResult<T>) => void)[] = [];

  const handler = (valueToEmit: T) => {
    if (queue.length) {
      const resolve = queue.shift()!;
      const iteratorResult = { done: false, value: valueToEmit };
      resolve(iteratorResult);
    }
  };
  emitter.on(eventName, handler);

  return {
    [Symbol.asyncIterator](): AsyncIterator<T> {
      return {
        next(): Promise<IteratorResult<T>> {
          return new Promise<IteratorResult<T>>((resolve) => {
            queue.push(resolve);
          });
        },
      };
    },
  };
}

export default on;
