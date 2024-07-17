import { it } from "node:test";
import assert from "node:assert";
import on from "../on/on";
import filter from "./filter";
import { EventEmitter } from "node:events";

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
  setTimeout(() => clearInterval(intervalId), 6_000);

  (async () => {
    const storage = [];
    const onlyEvent = (eventName: string) => (item: EmittedItem) => {
      return item.eventName === eventName;
    };

    for await (const data of filter(asyncIterator, onlyEvent(eventName))) {
      storage.push(data);
      console.log(data);
    }
    assert.equal(3, storage.length);
  })();
});
