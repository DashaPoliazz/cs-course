import take from "./take";
import { it } from "node:test";
import assert from "node:assert";

it("should take the whole string", () => {
  const takeWhole = take(/\d/)("1234 foo");

  const result = takeWhole.next();
  assert.strictEqual(result.done, true);
  assert.deepStrictEqual(result.value[0], { type: "TAKE", value: "1234" });
});

it("should take a limited number of characters", () => {
  const takeLimited = take(/\d/, { max: 2, min: 0 })("1234 foo");

  const result = takeLimited.next();
  assert.strictEqual(result.done, true);
  assert.deepStrictEqual(result.value[0], { type: "TAKE", value: "12" });
});
