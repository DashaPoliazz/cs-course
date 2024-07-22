export interface Options {
  // time given to execute task
  timeQuant: number;
  // time given to execute rest code
  timeGap: number;
}
export enum Commands {
  ENQUEUE_TASK = "enqueueTak",
}
export enum SchedulerState {
  IN_WORK = "in_work",
  IDLE = "idle",
}
