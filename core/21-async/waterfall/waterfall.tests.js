const waterfall = require("./waterfall");

waterfall(
  [
    (cb) => {
      cb(null, "one", "two");
    },

    (arg1, arg2, cb) => {
      console.log(arg1); // one
      console.log(arg2); // two
      cb(null, "three");
    },

    (arg1, cb) => {
      console.log(arg1); // three
      cb(null, "done");
    },
  ],
  (err, result) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log(result); // done
    }
  },
);
