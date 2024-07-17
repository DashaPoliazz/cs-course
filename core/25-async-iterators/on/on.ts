import { EventEmitter } from "node:events";

interface IteratorResult<T> {
  done: boolean;
  value: T | undefined;
}

type Resolver<T> = (iteratorResult: IteratorResult<T>) => void;

interface AsyncIterator<T> {
  next(): Promise<IteratorResult<T>>;
}

interface AsyncIterable<T> {
  [Symbol.asyncIterator](): AsyncIterator<T>;
}

function on<T>(emitter: EventEmitter, eventName: string): AsyncIterable<T> {
  const queue: Resolver<T>[] = [];

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
        next() {
          const { promise, resolve } =
            Promise.withResolvers<IteratorResult<T>>();
          queue.push(resolve);
          return promise;
        },
      };
    },
  };
}

export default on;
