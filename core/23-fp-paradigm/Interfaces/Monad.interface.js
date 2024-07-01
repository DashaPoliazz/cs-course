const Functor = require("./Functor.interface.js");

class Monad extends Functor {
  apply(anotherMonad) {
    throw new Erorr("Method 'apply' should be implemented");
  }

  chain(kleisliArrow) {
    throw new Erorr("Method 'chain' should be implemented");
  }

  fold() {
    throw new Erorr("Method 'fold' should be implemented");
  }
}

module.exports = Monad;
