import { it } from "node:test";
import assert from "node:assert";
import once from "../once/once";
import repeat from "./repeat";
import { EventEmitter, on } from "node:events";

it("should work correctly", async () => {
  const ee = new EventEmitter();
  const eventName = "your_event_name";
  const asyncIterator = repeat(on(ee, eventName));

  const intervalId = setInterval(() => {
    const dataToEmit = "your_data_to_emit";
    ee.emit(eventName, dataToEmit);
  }, 1_000);
  setTimeout(() => clearInterval(intervalId), 4_000);

  (async () => {
    for await (const item of asyncIterator) {
      console.log(item);
    }
  })();
});
