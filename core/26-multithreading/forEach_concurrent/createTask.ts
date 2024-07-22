import { Options } from "./types";

// Task fabric with configuration
const createTask = (options: Options) =>
  function* <T>(iterable: Iterable<T>, cb: (item: T) => void): Generator {
    let start = Date.now();
    let end = start + options.timeQuant;

    for (const item of iterable) {
      if (Date.now() > end) {
        const newStart = yield;
        start = newStart as number;
        end = start + options.timeQuant;
      }
      cb(item);
    }
  };

export default createTask;
