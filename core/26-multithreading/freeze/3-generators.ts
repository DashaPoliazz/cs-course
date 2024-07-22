import { setTimeout } from "timers/promises";

let EXECUTION_TIME = 1;
let SLEEP_TIME = 100;

async function* forEach<T>(iterable: Iterable<T>, cb: (value: T) => void) {
  let total = 0;
  let counter = 0;
  let sleep = false;
  let iter = iterable[Symbol.iterator]();

  while (true) {
    if (sleep) {
      sleep = false;
      counter = 0;
      await setTimeout(SLEEP_TIME);
      yield "Waked up";
    } else {
      const start = Date.now();
      const end = start + EXECUTION_TIME;

      while (Date.now() <= end) {
        const result = iter.next();
        if (result.done) {
          yield `${total} chunks has been executed`;
          return;
        }
        counter += 1;
        cb(result.value);
      }

      total += counter;
      sleep = true;

      yield `${counter} chunks were processed on iteration. ${total} chunks were processed`;
    }
  }
}

export default forEach;
