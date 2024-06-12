"use strict";

const throttle = (fn, ms) => {
  let invokable = true;
  let requestedArguments = null;

  const wrapper = (...args) => {
    // if we can't invoke fn, then we have to
    // save arguments which were provided in
    // request call
    if (!invokable) {
      requestedArguments = args;
      return;
    }

    // otherwise, we can invoke fn
    fn(...args);
    // next 'ms' we block ability to invoke fn
    invokable = false;
    // after 'ms' we have to unblick ability to invoke fn
    setTimeout(() => {
      invokable = true;
      // we should call last call request of fn with
      // saved arguments if so exists
      if (requestedArguments) {
        fn(...requestedArguments);
        // Don't forget to clear arguments after they've been used.
        requestedArguments = null;
      }
    }, ms);
  };

  return wrapper;
};

module.exports = throttle;
