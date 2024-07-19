import { describe, it } from "node:test";
import assert from "node:assert";

import promiseForEach from "./1-promise_forEach";
import forEachParallel from "./2-threads_forEach";

// describe("promiseForEach", () => {
//   // Delegating computation payload to event loop
//   it("should not freeze", async () => {
//     const time = await promiseForEach(new Array(10e6), (item) => {});
//     console.log(time);
//   });
// });

describe("parallelForEach", () => {
  it("'n' times calculating fibonacci inside 1 thread", async () => {
    const itearble = new Array(10).fill(0);
    const calculateFibo = () => {
      function fibonacci(n: number): number {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }

      return fibonacci(35);
    };
    const time = await promiseForEach(itearble, calculateFibo);
    console.log(time);
  });

  it("'n' times calculating fibonacci inside n threads", async () => {
    const THREADS = 5;
    const itearble = new Array(10).fill(0);
    const calculateFibo = () => {
      function fibonacci(n: number): number {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }

      return fibonacci(35);
    };
    const forEach = forEachParallel(itearble, calculateFibo);
    const time = await forEach(THREADS);
    console.log(time);
  });
});
