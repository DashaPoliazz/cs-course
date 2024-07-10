const assert = require("node:assert");
const { it } = require("node:test");
const { setImmediate, clearImmediate } = require("./immediates.js");

it("should queue macrotask correctly", () => {
  const storage = [];
  queueMicrotask(() => storage.push("microtask"));
  setImmediate(() => {
    storage.push("macrotask");
    assert.deepEqual(storage, ["microtask", "macrotask"]);
  });
});

it("should return unique id", () => {
  const immediate = setImmediate(() => "");
  const symbols = Object.getOwnPropertySymbols(immediate);
  const triggerIdSymbol = symbols.find(
    (symbol) => symbol.toString() === "Symbol(triggerId)",
  );
  const triggerId = immediate[triggerIdSymbol];
  assert(typeof triggerId === "number");
});

it("should clear immediated after correctly", () => {
  const storage = [];
  const microTask = () => storage.push("microtask");
  const macrotask = () => storage.push("macrotask");
  const immediate = setImmediate(macrotask);
  for (let i = 0; i < 100; i++) queueMicrotask(microTask);
  clearImmediate(immediate);
  setTimeout(() => assert.equal(storage.length, 100));
});
