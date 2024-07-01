const MonadInterface = require("../Interfaces/Monad.interface.js");

const STATE = {
  OK: "OK",
  ERR: "ERR",
};

class Result extends MonadInterface {
  #state;
  #value;
  #isFn;

  constructor(value, state = STATE.OK) {
    super();

    this.#state = state;
    this.#value = value;
    this.#isFn = typeof this.#value === "function";
  }

  static new(value, state = STATE.OK) {
    return new Result(value, state);
  }

  then(f) {
    if (this.#state === STATE.ERR) return this;

    try {
      f(this.#value()); // goto catch block
      return Result.new(this.#isFn ? () => f(this.#value()) : f(this.#value));
    } catch (err) {
      return Result.new(this.#isFn ? () => err : err, STATE.ERR);
    }
  }

  catch(f) {
    // do nothing if it's not error
    if (this.#state === STATE.OK) return;

    const errorMessage = this.#isFn
      ? this.#value().message
      : this.#value.message;

    f(errorMessage);
  }

  // Monad interface
  map(f) {
    return this.then(f);
  }

  // f should return a monad!
  flatMap(f) {
    return this.then((value) => f(value).fold());
  }

  fold() {
    return this.#isFn ? this.#value() : this.#value;
  }

  apply(anotherMonad) {
    return anotherMonad.map(this.#value);
  }
}

module.exports = Result;
