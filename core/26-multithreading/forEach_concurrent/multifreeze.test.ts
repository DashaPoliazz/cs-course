import { describe, it } from "node:test";
import createTask from "./createTask";
import Scheduler from "./Scheduler";

it("should work correctly", () => {
  const options = {
    timeQuant: 1000,
    timeGap: 1000,
  };
  const gap1000Quant1000 = createTask(options);
  // task1
  const iterable1 = new Array(100_000).fill(0).map((_, i) => i + 1);
  const cb1 = (item: number) =>
    console.log(`from 'gap1000Quant100' cb ONE => ${item}`);
  const task1 = gap1000Quant1000(iterable1, cb1);
  // task2
  const iterable2 = new Array(100_000).fill(0).map((_, i) => -i);
  const cb2 = (item: number) =>
    console.log(`from 'gap1000Quant100' cb TWO => ${item}`);
  const task2 = gap1000Quant1000(iterable2, cb2);

  // scheduler
  const scheduler = new Scheduler(options);
  scheduler.enqueueTask(task1, task2);
});
