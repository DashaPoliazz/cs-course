import EventEmitter from "events";
import PriorityQueue from "../../13-heap/PQ";
import Scheduler from "../forEach_concurrent/Scheduler";
import { Options, SchedulerState } from "../forEach_concurrent/types";
import { Commands } from "../forEach_concurrent/types";
import { setTimeout } from "timers/promises";

enum PRIORITIES {
  HIGH = 2,
  MEDIUM = 1,
  LOW = 0,
}
type PQItem<T> = {
  priority: PRIORITIES;
  value: Generator<T>;
};
type PQComparator<T> = (a: PQItem<T>, b: PQItem<T>) => boolean;

class SchedulerWithPriotity<T> extends EventEmitter {
  // max pq
  #queue: PriorityQueue<PQItem<T>>;
  #options: Options;
  state: SchedulerState;

  constructor(options: Options) {
    super();

    this.#options = options;
    const comparator: PQComparator<any> = (a, b) => a.priority > b.priority;
    this.#queue = new PriorityQueue([], comparator);
    this.state = SchedulerState.IDLE;
    // We should not block main thread
    // and make scheduler work only if we have tasks
    this.on(Commands.ENQUEUE_TASK, () => {
      console.log("emitted");
      if (this.state === SchedulerState.IDLE) {
        this.state = SchedulerState.IN_WORK;
        this.execute();
      }
    });
  }

  enqueueWithPriority(...tasks: PQItem<T>[]): void {
    for (const task of tasks) {
      this.#queue.push(task);
    }
    this.emit(Commands.ENQUEUE_TASK);
  }

  async execute() {
    // Task is an iterator
    let task: PQItem<T> | null = null;
    while ((task = this.#queue.shift())) {
      // Task should be able to track time
      // and exeucte each task during 'options.timeQuant' time
      let start = Date.now();
      const { done, value } = task.value.next(start);
      if (done) continue;
      // we should let rest code to be executed during 'options.gap' time
      await setTimeout(this.#options.timeGap);
      // enquing unfinfined task
      this.enqueueWithPriority(task);
    }
    this.state = SchedulerState.IDLE;
  }

  debugQueue() {
    return this.#queue;
  }

  shift() {
    return this.#queue.shift();
  }
}

export default SchedulerWithPriotity;
