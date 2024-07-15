import { EventEmitter } from "events";

interface PromiseIterator<T> {
  done: boolean;
  value: T;
}

type Resolver<T> = (promiseIterator: PromiseIterator<T>) => void;

function on<T>(emitter: EventEmitter, event: string): AsyncIterableIterator<T> {
  const queue: Resolver<T>[] = [];

  const handler = (data: T) => {
    queue.length ? queue.shift()!({ done: false, value: data }) : null;
  };
  emitter.on(event, handler);

  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next(): Promise<IteratorResult<T>> {
      return new Promise<IteratorResult<T>>((resolve, reject) => {
        queue.push(resolve);
      });
    },
  };
}

export default on;
