type Value<T> = () => T;
type Executer<T> = (value: T) => any;
type OnError = (e: Error) => any;
enum State {
  Ok,
  Err,
}

class Result<T> {
  value: Value<T>;
  #state: State;

  constructor(value: Value<T>, state: State = State.Ok) {
    this.value = value;
    this.#state = state;
  }

  then(executer: Executer<T>) {
    // Preventing by calling cb with error
    if (this.#state === State.Err) {
      return new Result(this.value, State.Err);
    }

    try {
      const executerResult = executer(this.value());
      const newValue = executerResult ? () => executerResult : this.value;
      const newResult = new Result(newValue);
      return newResult;
    } catch (error) {
      // Gracefully catching executer with error
      const newResult = new Result(() => error, State.Err);
      return newResult;
    }
  }

  catch(onError: OnError) {
    onError(this.value() as Error);
  }
}

export default Result;
