"use strict";

const vm = require("vm");
const fs = require("node:fs");
const path = require("node:path");

const filepath = path.join(process.cwd(), "./notBin", "output.js");
const RUN_OPTIONS = { timeout: 5000, displayErrors: true };

module.exports = async (sandbox) => {
  const src = await fs.promises.readFile(filepath);
  const code = `"use strict";\n${src}`;
  const script = new vm.Script(code);
  const context = vm.createContext(sandbox);
  const result = script.runInContext(context, RUN_OPTIONS);
  return result;
};
