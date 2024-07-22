import EventEmitter from "node:events";
import { setTimeout } from "node:timers/promises";
import { Options, Commands, SchedulerState } from "./types";

class Scheduler extends EventEmitter {
  state: SchedulerState;
  #queue: Generator<any>[];
  #options: Options;

  constructor(options: Options) {
    super();

    this.#options = options;
    this.state = SchedulerState.IDLE;
    this.#queue = [];
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

  enqueueTask<T>(...tasks: Generator<T>[]) {
    this.#queue = this.#queue.concat(tasks);
    this.emit(Commands.ENQUEUE_TASK);
  }

  async execute() {
    // Task is an iterator
    let task = null;
    while ((task = this.#queue.shift())) {
      // Task should be able to track time
      // and exeucte each task during 'options.timeQuant' time
      let start = Date.now();
      const { done, value } = task.next(start);
      if (done) continue;
      // we should let rest code to be executed during 'options.gap' time
      await setTimeout(this.#options.timeGap);
      // enquing unfinfined task
      this.enqueueTask(task);
    }
    this.state = SchedulerState.IDLE;
  }
}

export default Scheduler;
