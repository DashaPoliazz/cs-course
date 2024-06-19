import IMonad from "../Monad";

class Just<T> implements IMonad<T> {
  #value: T;

  constructor(value: T) {
    this.#value = value;
  }

  static new<T>(value: T) {
    return new Just(value);
  }

  map<U>(f: (value: T) => U): Just<U> {
    return Just.new(f(this.#value));
  }

  flatMap<U>(f: (value: T) => Just<U>): Just<U> {
    return f(this.#value);
  }

  fold(): T {
    return this.#value;
  }
}

export default Just;
