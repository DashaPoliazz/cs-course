const assert = require("node:assert");
const { it } = require("node:test");
const sleep = require("./sleep.js");

it("should go to sleep correctly", async () => {
  const start = Date.now();
  const ms = 1_000;
  await sleep(ms);
  const end = Date.now();
  const duration = end - start;
  assert(duration >= ms);
});
