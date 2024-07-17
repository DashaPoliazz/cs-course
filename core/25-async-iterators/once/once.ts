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

function once<T>(emitter: EventEmitter, eventName: string): AsyncIterable<T> {
  const queue: Resolver<T>[] = [];
  let triggered = false;

  const handler = (valueToEmit: T) => {
    if (queue.length) {
      const resolve = queue.shift()!;
      if (triggered) return void resolve({ done: true, value: undefined });
      const iteratorResult = { done: false, value: valueToEmit };
      resolve(iteratorResult);
      triggered = true;
    }
  };
  emitter.once(eventName, handler);

  return {
    [Symbol.asyncIterator](): AsyncIterator<T> {
      return {
        next() {
          if (triggered) {
            return Promise.resolve({ done: true, value: undefined });
          }

          const { promise, resolve } =
            Promise.withResolvers<IteratorResult<T>>();
          queue.push(resolve);
          return promise;
        },
      };
    },
  };
}

export default once;
