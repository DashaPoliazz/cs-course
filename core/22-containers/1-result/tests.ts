import Result from "./Result";
import { it } from "node:test";
import assert from "assert";

it("should execute all .then if the value is not an Error", () => {
  const result = new Result(() => 42);
  let count = 0;
  result
    .then((value) => {
      count++;
      assert.strictEqual(count, 1);
      assert.strictEqual(value, 42);
      return value;
    })
    .then((value) => {
      count++;
      assert.strictEqual(count, 2);
      assert.strictEqual(value, 42);
      return value;
    })
    .then((value) => {
      count++;
      assert.strictEqual(count, 3);
      assert.strictEqual(value, 42);
      return value;
    })
    .then((value) => {
      count++;
      assert.strictEqual(count, 4);
      assert.strictEqual(value, 42);
      return value;
    })
    .then((value) => {
      count++;
      assert.strictEqual(count, 5);
      assert.strictEqual(value, 42);
      return value;
    });
});

it("should return new returned value from the 'then' chain", () => {
  const result = new Result(() => 42);
  let count = 0;
  result
    .then((value) => {
      count++;
      assert.strictEqual(count, 1);
      assert.strictEqual(value, 42);
      return value + 1;
    })
    .then((value) => {
      count++;
      assert.strictEqual(count, 2);
      assert.strictEqual(value, 43);
      return value + 1;
    })
    .then((value) => {
      count++;
      assert.strictEqual(count, 3);
      assert.strictEqual(value, 44);
      return value + 1;
    })
    .then((value) => {
      count++;
      assert.strictEqual(count, 4);
      assert.strictEqual(value, 45);
      return value + 1;
    })
    .then((value) => {
      count++;
      assert.strictEqual(count, 5);
      assert.strictEqual(value, 46);
      return value;
    });
});

it("should gracefully handle error in catch block", () => {
  const result = new Result(() => {
    throw new Error("Boom!");
  });

  const doNothing = () => undefined;
  const modify = (value: number) => value + 1;

  result
    .then(doNothing)
    .then(doNothing)
    .then(modify)
    .then(modify)
    .catch(console.error);

  // should be unreachable
  process.on("uncaughtException", (_) => assert.equal(true, false));
});
