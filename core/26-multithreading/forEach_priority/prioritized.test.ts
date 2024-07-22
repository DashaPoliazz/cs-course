import { describe, it } from "node:test";
import assert from "node:assert";
import createTask from "../forEach_concurrent/createTask";
import SchedulerWithPriority from "./SchedulerWIthPriority";

import Heap from "../../13-heap/PQ";

enum PRIORITIES {
  HIGH = 2,
  MEDIUM = 1,
  LOW = 0,
}

it("should process items with priority", () => {
  const options = {
    timeQuant: 1000,
    timeGap: 1000,
  };
  const gap1000Quant1000 = createTask(options);

  // task1
  const iterable1 = new Array(100_000).fill(0).map((_, i) => i);
  const cb1 = (item: number) =>
    console.log(`priority = ${PRIORITIES.HIGH} value => ${item}`);
  const highPriorityTask1 = {
    priority: PRIORITIES.HIGH,
    value: gap1000Quant1000(iterable1, cb1),
  };

  // task2
  const iterable2 = new Array(100_000).fill(0).map((_, i) => i);
  const cb2 = (item: number) =>
    console.log(`priority = ${PRIORITIES.LOW} value => ${item}`);
  const lowPriorityTask1 = {
    priority: PRIORITIES.LOW,
    value: gap1000Quant1000(iterable2, cb2),
  };

  // Additional tasks for thorough testing

  // task3
  const iterable3 = new Array(100_000).fill(0).map((_, i) => i);
  const cb3 = (item: number) =>
    console.log(`priority = ${PRIORITIES.MEDIUM} value => ${item}`);
  const mediumPriorityTask1 = {
    priority: PRIORITIES.MEDIUM,
    value: gap1000Quant1000(iterable3, cb3),
  };

  // task4
  const iterable4 = new Array(100_000).fill(0).map((_, i) => i);
  const cb4 = (item: number) =>
    console.log(`priority = ${PRIORITIES.HIGH} value => ${item}`);
  const highPriorityTask2 = {
    priority: PRIORITIES.HIGH,
    value: gap1000Quant1000(iterable4, cb4),
  };

  // task5
  const iterable5 = new Array(100_000).fill(0).map((_, i) => i);
  const cb5 = (item: number) =>
    console.log(`priority = ${PRIORITIES.LOW} value => ${item}`);
  const lowPriorityTask2 = {
    priority: PRIORITIES.LOW,
    value: gap1000Quant1000(iterable5, cb5),
  };

  // scheduler
  const scheduler = new SchedulerWithPriority(options);
  scheduler.enqueueWithPriority(
    lowPriorityTask1,
    lowPriorityTask2,
    mediumPriorityTask1,
    highPriorityTask1,
    highPriorityTask2,
  );
});
