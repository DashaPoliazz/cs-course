const heap = require("./memory/heap.js");
const stack = require("./memory/stack.js");
const parser = require("./parser.js");
const path = require("node:path");
const execute = require("./execute.js");

const logger = {
  log: (msg) => console.log("\x1b[33m", "LOGGER: ", msg, "\x1b[0m"),
};

const sandbox = Object.freeze({ stack, heap, console: logger });
const filepath = path.join(process.cwd(), "bytecode.csff");

(async () => {
  // parses file and creates "/notBin/output.js"
  await parser(filepath);
  // executes parsed file
  await execute(sandbox);
})();
