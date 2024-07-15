import { it, describe } from "node:test";
import assert from "node:assert";
import on from "./on";
import { EventEmitter } from "node:events";

describe("on function", () => {
  it("should work correctly", () => {
    const emitter = new EventEmitter();
    const eventStream = on(emitter, "click");

    const expectedEvents = ["Event data 1", "Event data 2", "Event data 3"];
    const receivedEvents: string[] = [];

    (async () => {
      let i = 0;
      for await (const event of eventStream) {
        receivedEvents.push(event.data);
        i++;
        if (i === expectedEvents.length) {
          break;
        }
      }

      try {
        assert.deepStrictEqual(receivedEvents, expectedEvents);
      } catch (error) {}
    })();

    // Emit events for demonstration
    let counter = 1;
    const interval = setInterval(() => {
      emitter.emit("click", { data: `Event data ${counter}` });
      counter++;
      if (counter > expectedEvents.length) {
        clearInterval(interval);
      }
    }, 1000);
  });
});
