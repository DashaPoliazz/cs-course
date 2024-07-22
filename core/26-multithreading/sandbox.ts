// import { Worker, isMainThread, workerData } from "node:worker_threads";

// if (isMainThread) {
//   const THREADS = 4;
//   let workers = 0;
//   let mutRef = {
//     counter: 0,
//   };
//   for (let i = 0; i < THREADS; i++) {
//     const worker = new Worker(__filename, {
//       workerData: mutRef,
//     });
//     worker.on("exit", () => {
//       workers += 1;
//       if (workers >= THREADS) {
//         console.log("done:", mutRef);
//       }
//     });
//   }
// } else {
//   workerData.counter += 1;
// }

setTimeout(() => {
  for (let i = 0; i < 10e8; i++) {
    // blocking event loop
  }
  console.log("free");
}, 0);
