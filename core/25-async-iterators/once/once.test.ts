import { it } from "node:test";
import assert from "node:assert";
import once from "./once";
import { EventEmitter } from "node:events";

it("should work correctly", async () => {
  const ee = new EventEmitter();
  const eventName = "your_event_name";
  const asyncIterator = once(ee, eventName);

  const intervalId = setInterval(() => {
    const dataToEmit = "your_data_to_emit";
    ee.emit(eventName, dataToEmit);
  }, 1_000);
  setTimeout(() => clearInterval(intervalId), 4_000);

  (async () => {
    const storage = [];
    for await (const data of asyncIterator) {
      storage.push(data);
    }
    assert.deepEqual(["your_data_to_emit"], storage);
  })();
});
