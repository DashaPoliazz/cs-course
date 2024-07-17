import { it } from "node:test";
import assert from "node:assert";
import on from "../on/on";
import take from "./take";
import { EventEmitter } from "node:events";

it("should work correctly", async () => {
  const ee = new EventEmitter();
  const eventName = "your_event_name";
  const asyncIterator = on(ee, eventName);

  const intervalId = setInterval(() => {
    const dataToEmit = "your_data_to_emit";
    ee.emit(eventName, dataToEmit);
  }, 1_000);
  setTimeout(() => clearInterval(intervalId), 6_000);

  (async () => {
    const storage = [];
    for await (const data of take(asyncIterator, 3)) {
      storage.push(data);
      console.log(data);
    }
    assert.equal(3, storage.length);
  })();
});
