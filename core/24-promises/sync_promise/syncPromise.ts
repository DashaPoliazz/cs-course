enum Status {
  Pending,
  Fullfiled,
  Rejected,
}

type Resolve<T> = (value: T) => void;
type Reject = (error: Error) => void;
type Executer<T> = (resolve: Resolve<T>, reject: Reject) => void;

type Maybe<T> = T | null;

type KleislyArrow<T, U> = (value: T) => SyncPromise<U>;

class SyncPromise<T> {
  private status: Status;
  private triggered: boolean;
  private value: Maybe<T>;
  private error: Maybe<Error>;

  constructor(executer: Executer<T>) {
    this.status = Status.Pending;
    this.triggered = false;
    this.value = null;
    this.error = null;

    executer(this.resolve, this.reject);
  }

  then<U>(onResolve, onReject): SyncPromise<U> {}

  resolve(value: T): SyncPromise<T> {
    if (this.triggered) return this;
    this.triggered = true;
    this.status = Status.Fullfiled;
    this.value = value;
    return this;
  }

  reject(error: Error): SyncPromise<T> {
    if (this.triggered) return this;
    this.triggered = true;
    this.status = Status.Rejected;
    this.error = error;
    return this;
  }

  private new<U>(status: Status, value: U): SyncPromise<U> {
    return new SyncPromise();
  }
}
