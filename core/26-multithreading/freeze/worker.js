const { parentPort, Worker, workerData } = require("node:worker_threads");

const { chunk, cb } = workerData;
const callback = new Function("return " + cb)();
console.log(callback);

try {
  for (const item of chunk) {
    callback(item);
  }
  parentPort?.postMessage("done");
} catch (error) {
  throw error;
}
