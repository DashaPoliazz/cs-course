import { it } from "node:test";
import assert from "node:assert";
import on from "../on/on";
import any from "./any";
import { EventEmitter } from "node:events";

it("should work correctly", async () => {
  const ee = new EventEmitter();
  const eventName1 = "1";
  const eventName2 = "2";
  type EmittedItem = { eventName: string; data: string };
  const asyncIterator1 = on<EmittedItem>(ee, eventName1);
  const asyncIterator2 = on<EmittedItem>(ee, eventName2);

  // emiting first event after 1sec
  const intervalId1 = setTimeout(() => {
    const dataToEmit = {
      eventName: eventName1,
      data: "1",
    };
    ee.emit(eventName1, dataToEmit);
  }, 1_000);
  // emiting second event after 999ms
  const intervalId2 = setTimeout(() => {
    const dataToEmit = {
      eventName: eventName2,
      data: "2",
    };
    ee.emit(eventName2, dataToEmit);
  }, 1);

  setTimeout(() => {
    clearInterval(intervalId1);
    clearInterval(intervalId2);
  }, 2000);

  (async () => {
    let winner = "";
    for await (const item of any(asyncIterator1, asyncIterator2)) {
      winner = item.data;
    }
    console.log("awaited");
    console.log(winner);
    assert.equal(winner, 2);
  })();
});
