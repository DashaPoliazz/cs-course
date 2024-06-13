"use strict";

const isIterable = (entity) => typeof entity[Symbol.iterator] === "function";

const waterfall = (flow, cb) => {
  // flow must be iterable
  if (!isIterable(flow)) throw new TypeError("Flow must be iterable!");
  // typecast any iterable into Array
  const tasks = Array.from(flow);

  // The goal is to change the callbacks inside the tasks with
  // custom callback that will be chained between each other.

  const swim = (taskIdx, ...args) => {
    // We've done
    if (taskIdx >= tasks.length) return void cb(null, ...args);

    const task = tasks[taskIdx];

    // We have to run task with callback. This callback will be the
    // replaced callback
    const callback = (err, ...results) => {
      // If error occures, than we immediately have to break chain and
      // panic with the cb(err);
      if (err) return void cb(err, ...results);

      // Inside this callback we have to recursively run the next 'swim' function
      swim(taskIdx + 1, ...results);
    };

    // Calling task with
    task(...args, callback);
  };

  swim(0);
};

// waterfall([
//   (cb) => {
//     cb(null, 'one', 'two');
//   },

//   (arg1, arg2, cb) => {
//     console.log(arg1); // one
//     console.log(arg2); // two
//     cb(null, 'three');
//   },

//   (arg1, cb) => {
//     console.log(arg1); // three
//     cb(null, 'done');
//   }
// ], (err, result) => {
//   console.log(result); // done
// });

module.exports = waterfall;
