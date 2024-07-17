import { it } from "node:test";
import assert from "node:assert";
import seq from "./seq";
import filter from "../filter/filter";
import take from "../take/take";
import on from "../on/on";
import once from "../once/once";
import { EventEmitter } from "node:events";

it("should work correctly", async () => {
  const ee = new EventEmitter();
  const eventName = "your_event_name";
  const asyncIterator = on(ee, eventName);

  const intervalId = setInterval(() => {
    const dataToEmit = "your_data_to_emit";
    ee.emit(eventName, dataToEmit);
  }, 1_000);
  setTimeout(() => clearInterval(intervalId), 4_000);

  (async () => {
    const chain = seq(once(ee, eventName));
  })();
});
