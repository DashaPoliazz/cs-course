"use strict";

// TODO:
// [ ] some race conditions ?

const timeout = (promise, ms) => {
  let expired = false;
  let resolved = false;
  let result = null;
  let error = null;

  const onResolve = (data) =>
    expired ? null : ((result = data), (resolved = true));
  const onReject = (err) =>
    expired ? null : ((error = err), (resolved = true));
  // trying to process the promise
  promise.then(onResolve).catch(onReject);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // did promise make it?
      if (resolved) {
        // did promise make it with error?
        if (error) reject(error);
        // he did it
        resolve(result);
        return;
      }

      // toggle flag
      expired = true;

      reject(`Expired after ${ms}ms`);
    }, ms);
  });
};

module.exports = timeout;
