"use strict";

const promisify = (f) => {
  return (...args) => {
    const promise = new Promise((resolve, reject) => {
      const cb = (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      };

      f(...args, cb);
    });

    return promise;
  };
};

module.exports = promisify;
