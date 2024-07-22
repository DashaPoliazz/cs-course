import { describe, it } from "node:test";
import forEach from "../freeze/1-promise_forEach";

it("should work correctly", () => {
  let total = 0n;

  forEach(new Array(10e5), () => {
    total += 1n;
  });
  forEach(new Array(10e5), () => {
    total += 1n;
  });
  forEach(new Array(10e5), () => {
    total += 1n;
  });
  forEach(new Array(10e5), () => {
    total += 1n;
  });
  forEach(new Array(10e5), () => {
    total += 1n;
  });

  console.log(total);
});
