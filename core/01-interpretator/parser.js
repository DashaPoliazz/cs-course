const fs = require("node:fs");
const os = require("os");
const path = require("node:path");
const transpile = require("./transpile.js");

const prepareFile = (code) => {
  const tokens = code
    .split(os.EOL)
    .filter((l) => l.length)
    .map((l) => l.split(" "));

  return tokens;
};

const parseFile = async (filepath) => {
  const code = await fs.promises.readFile(filepath, "utf-8");
  const preparedFile = prepareFile(code);

  const outputPath = path.join(process.cwd(), "./not-bin", "output.js");

  await transpile(preparedFile, outputPath);
};

module.exports = parseFile;
