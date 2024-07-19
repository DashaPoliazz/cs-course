"use strict";

// {
//   // 1
//   function* processTask(time) {
//     const startTime = Date.now();
//     for (let i = 0; i < 1e9; i++) {}
//     const endTime = Date.now();
//     const diff = endTime - startTime;
//     console.log(diff);
//   }

//   processTask().next();
// }

{
  const createTask = (task) =>
    new Promise((resolve, reject) => {
      const startTime = Date.now();
      const result = task();
      const endTime = Date.now();
      const diff = endTime - startTime;
      resolve(diff);
    });

  console.log("I'm not blocked");

  (async () => {
    const task = () => {
      for (let i = 0; i < 1e9; i++) {
        // Performing some calculations
      }
    };

    const completedTask = await createTask(task);
    console.log("Completed within", completedTask, "ms");
  })();

  console.log("I'm not blocked");
}
