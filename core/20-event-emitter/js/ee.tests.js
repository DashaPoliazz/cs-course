const { it } = require("node:test");
const assert = require("node:assert");
const EventEmitter = require("./ee.js");

it("should register events correctly", () => {
  const ee = new EventEmitter();
  const events = ["click", "move", "scroll"];

  events.forEach((event) => ee.on(event));
  const registeredEvents = ee.names();

  assert.equal(registeredEvents[0], "click");
  assert.equal(registeredEvents[1], "move");
  assert.equal(registeredEvents[2], "scroll");
});

it("should emit events correctly", () => {
  const ee = new EventEmitter();
  ee.on("click", (err, data) => {
    if (err) {
      throw new Error(err);
    } else {
      assert.deepEqual(data, { foo: "bar" });
    }
  });
  ee.emit("click", { foo: "bar" });
});

it("should catch errors correctly", () => {
  const ee = new EventEmitter();
  ee.on("click", (err, _) => {
    if (err) {
      assert.equal(true);
    }
  });
  ee.emit("click", new Error("Oops..."));
});

it("should return all listeners of event correctly", () => {
  const ee = new EventEmitter();
  const listener = (err, _) => {
    if (err) {
      assert.equal(true);
    }
  };
  ee.on("click", listener);
  const needle = [...ee.listeners("click").values()].find(
    (l) => l === listener,
  );
  assert.deepStrictEqual(true, needle === listener);
});

it("should remove listeners correctly", () => {
  const ee = new EventEmitter();
  const listener = (err, _) => {
    if (err) {
      assert.equal(true);
    }
  };
  ee.on("click", listener);
  assert.equal(ee.listeners("click").size, 1);
  ee.removeListener("click", listener);
  assert.equal(ee.listeners("click").size, 0);
});

it("should handle 'once' event correcrly", () => {
  const ee = new EventEmitter();
  let counter = 0;
  const listener = (err, data) => {
    if (err) {
    } else {
      counter += 1;
    }
  };
  ee.once("click", listener);

  assert.equal(ee.listeners("click").size, 1);
  for (let i = 0; i < 10; i++) ee.emit("click", "data");
  assert.equal(counter, 1);
});
