import EventEmitter from "events";
import filter from "../filter/filter";
import repeat from "../repeat/repeat";
import seq from "../seq/seq";
import every from "../every/gen";
import any from "../any/any";
import { describe, it } from "node:test";
import on from "../on/on";
import once from "../once/once";
import forEach from "../forEach/forEach";
import assert from "node:assert";

interface EmittedData<T> {
  value: T;
  eventName: string;
}

// it("should be composable", async () => {
//   const box = new EventEmitter();
//   const body = new EventEmitter();
//   const onlyEvent =
//     <E>(eventName: string) =>
//     (iteratorResult: EmittedData<E>) => {
//       console.log("iteratorResult", iteratorResult);
//       return iteratorResult.value === eventName;
//     };

//   // handlers
//   setInterval(() => {
//     box.emit("mousedown", {
//       value: "box",
//       eventName: "mousedown",
//     });
//     body.emit("mousemove", {
//       value: "box",
//       eventName: "mousemove",
//     });
//     body.emit("mouseup", {
//       value: "box",
//       eventName: "mouseup",
//     });
//   }, 1_000);

//   const dnd = repeat(
//     filter(
//       seq(
//         once(box, "mousedown"),

//         every(
//           any(on(body, "mousemove"), on(box, "mouseup")),

//           onlyEvent("mousemove"),
//         ),
//       ),

//       onlyEvent("mousemove"),
//     ),
//   );

//
//   const dnd = every(
//     any(on(body, "mousemove"), on(box, "mouseup")),
//     onlyEvent("mousemove"),
//   );

//   const dnd = any(on(body, "mousemove"), on(box, "mouseup"));

//   const dnd = on(body, "mousemove");

//   forEach(dnd, (e) => {
//     console.log("triggered:", e);
//   });

//   (async () => {
//     for await (const item of dnd) {
//       console.log(item);
//     }
//   })();
// });

// it("seq + filter(once/on)", async () => {
//   const ee1 = new EventEmitter();
//   const ee2 = new EventEmitter();

//   const onlyEvent =
//     <E>(eventName: string) =>
//     (data: EmittedData<E>) => {
//       return data.eventName === eventName;
//     };

//   const intervalId = setInterval(() => {
//     ee1.emit("event1", {
//       value: "one",
//       eventName: "event1",
//     });
//     ee2.emit("event2", {
//       value: "two",
//       eventName: "event2",
//     });
//   }, 1000);

//   setTimeout(() => clearInterval(intervalId), 4000);

//   const sequence = seq(
//     filter(once<EmittedData<string>>(ee1, "event1"), onlyEvent("event1")),
//     filter(on<EmittedData<string>>(ee2, "event2"), onlyEvent("event2")),
//   );

//   const collectedEvents: EmittedData<string>[] = [];

//   for await (const item of sequence) {
//     collectedEvents.push(item);
//     if (collectedEvents.length >= 3) break;
//   }

//   assert.deepStrictEqual(collectedEvents, [
//     { value: "one", eventName: "event1" },
//     { value: "two", eventName: "event2" },
//     { value: "two", eventName: "event2" },
//   ]);
// });

// +
// it("any(on, on)", async () => {
//   const ee1 = new EventEmitter();
//   const ee2 = new EventEmitter();

//   const onlyEvent =
//     <E>(eventName: string) =>
//     (data: EmittedData<E>) => {
//       return data.eventName === eventName;
//     };

//   const intervalId = setInterval(() => {
//     ee1.emit("event1", {
//       value: "one",
//       eventName: "event1",
//     });
//     ee2.emit("event2", {
//       value: "two",
//       eventName: "event2",
//     });
//   }, 1000);

//   setTimeout(() => clearInterval(intervalId), 4000);

//   const sequence = any(on(ee1, "event1"), on(ee2, "event2"));

//   const collectedEvents: EmittedData<string>[] = [];

//   for await (const item of sequence) {
//     collectedEvents.push(item);
//   }

//   assert.deepStrictEqual(collectedEvents, [
//     { value: "one", eventName: "event1" },
//   ]);
// });

// const dnd = repeat(
// 	filter(
// 	  seq(
// 		once(box, "mousedown"),

// 		every(
// 		  any(on(body, "mousemove"), on(box, "mouseup")),

// 		  onlyEvent("mousemove"),
// 		),
// 	  ),

// 	  onlyEvent("mousemove"),
// 	),
//   );

// +
// it("event(any(on, on), predicate)", async () => {
//   const ee1 = new EventEmitter();
//   const ee2 = new EventEmitter();

//   const onlyEvent =
//     <E>(eventName: string) =>
//     (data: EmittedData<E>) => {
//       return data.eventName === eventName;
//     };

//   const intervalId = setInterval(() => {
//     ee1.emit("event1", {
//       value: "one",
//       eventName: "event1",
//     });
//     ee2.emit("event2", {
//       value: "two",
//       eventName: "event2",
//     });
//   }, 1000);

//   setTimeout(() => clearInterval(intervalId), 4000);

//   const sequence = every<EmittedData<string>>(
//     any(on(ee1, "event1"), on(ee2, "event2")),
//     onlyEvent("event1"),
//   );

//   const collectedEvents: EmittedData<string>[] = [];

//   for await (const item of sequence) {
//     collectedEvents.push(item);
//   }

//   assert.deepStrictEqual(collectedEvents, [
//     { value: "one", eventName: "event1" },
//   ]);
// });

describe("event(any(on, on), predicate)", () => {
  it("valid flow", async () => {
    const ee1 = new EventEmitter();
    const ee2 = new EventEmitter();

    const onlyEvent =
      <E>(eventName: string) =>
      (data: EmittedData<E>) => {
        return data.eventName === eventName;
      };

    const validFlow = setInterval(() => {
      // once (ee1, 'event') => emit once event in ee1
      ee1.emit("event1", {
        value: "one",
        eventName: "event1",
      });
      // THIS IS WRAPPED IN THE every(... , onlyEvent('event1'));
      // any(on(ee1, "event1"), on(ee2, "event2")) => emits very first event
      ee2.emit("event2", {
        value: "two",
        eventName: "event2",
      });
    }, 1000);
    setTimeout(() => clearInterval(validFlow), 4000);

    const flow = every<EmittedData<string>>(
      any(on(ee1, "event1"), on(ee2, "event2")),
      onlyEvent("event1"),
    );
    // sequence of events should have following order:
    const sequence = seq(once(ee1, "event1"), flow);

    const collectedEvents: EmittedData<string>[] = [];

    for await (const item of sequence) {
      collectedEvents.push(item);
    }

    console.log(collectedEvents);

    assert.deepStrictEqual(collectedEvents, [
      { value: "one", eventName: "event1" },
      { value: "one", eventName: "event1" },
    ]);
  });
  it("invalid flow", async () => {
    const ee1 = new EventEmitter();
    const ee2 = new EventEmitter();

    const onlyEvent =
      <E>(eventName: string) =>
      (data: EmittedData<E>) => {
        return data.eventName === eventName;
      };

    const validFlow = setInterval(() => {
      // THIS IS WRAPPED IN THE every(... , onlyEvent('event1'));
      // any(on(ee1, "event1"), on(ee2, "event2")) => emits very first event
      ee2.emit("event2", {
        value: "two",
        eventName: "event2",
      });
      // once (ee1, 'event') => emit once event in ee1
      ee1.emit("event1", {
        value: "one",
        eventName: "event1",
      });
    }, 1000);
    setTimeout(() => clearInterval(validFlow), 4000);

    const flow = every<EmittedData<string>>(
      any(on(ee1, "event1"), on(ee2, "event2")),
      onlyEvent("event1"),
    );
    // sequence of events should have following order:
    const sequence = seq(once(ee1, "event1"), flow);

    const collectedEvents: EmittedData<string>[] = [];

    for await (const item of sequence) {
      collectedEvents.push(item);
    }

    console.log(collectedEvents);

    assert.deepStrictEqual(collectedEvents, [
      { value: "one", eventName: "event1" },
    ]);
  });
});
