import { it } from "node:test";
import assert from "node:assert";
import Just from "./Just";

it("should map value correctly", () => {
  const addOne = (x: number) => x + 1;
  const just = Just.new(41).map(addOne);
  assert.equal(just.fold(), 42);
});

it("should map value correctly", () => {
  const addOne = (x: number) => x + 1;
  const just = Just.new(41)
    .map(addOne)
    .map((n) => n.toString());

  assert.deepStrictEqual(just.fold(), "42");
});

it("should flatMap value correctly", () => {
  const kleisli = (x: number) => {
    const someHardCalculations = x + 1;
    return Just.new(someHardCalculations);
  };
  const just = Just.new(41).flatMap(kleisli).fold();
  assert.equal(just, 42);
});
