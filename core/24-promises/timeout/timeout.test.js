const assert = require("node:assert");
const { it } = require("node:test");
const timeout = require("./timeout.js");

it("should fulfill promise if it resolves within the timeout", async () => {
  const resolveIn100ms = new Promise((resolve) =>
    setTimeout(() => resolve("I DID IT"), 100),
  );
  const ms = 200;

  const result = await timeout(resolveIn100ms, ms);
  assert.equal(result, "I DID IT");
});

it("should reject promise if it resolves after the timeout", async () => {
  const resolveIn200ms = new Promise((resolve) =>
    setTimeout(() => resolve("I DID IT"), 200),
  );
  const ms = 100;

  try {
    await timeout(resolveIn200ms, ms);
    assert.fail("Promise should have timed out");
  } catch (err) {
    assert.equal(err, `Expired after ${ms}ms`);
  }
});

it("should reject promise if it rejects within the timeout", async () => {
  const rejectIn100ms = new Promise((_, reject) =>
    setTimeout(() => reject("I FAILED"), 100),
  );
  const ms = 200;

  try {
    await timeout(rejectIn100ms, ms);
    assert.fail("Promise should have been rejected");
  } catch (err) {
    assert.equal(err, "I FAILED");
  }
});

it("should reject promise if it rejects after the timeout", async () => {
  const rejectIn200ms = new Promise((_, reject) =>
    setTimeout(() => reject("I FAILED"), 200),
  );
  const ms = 100;

  try {
    await timeout(rejectIn200ms, ms);
    assert.fail("Promise should have timed out");
  } catch (err) {
    assert.equal(err, `Expired after ${ms}ms`);
  }
});

it("should resolve immediately if the promise resolves immediately", async () => {
  const resolveImmediately = Promise.resolve("I DID IT");
  const ms = 100;

  const result = await timeout(resolveImmediately, ms);
  assert.equal(result, "I DID IT");
});

it("should reject immediately if the promise rejects immediately", async () => {
  const rejectImmediately = Promise.reject("I FAILED");
  const ms = 100;

  try {
    await timeout(rejectImmediately, ms);
    assert.fail("Promise should have been rejected");
  } catch (err) {
    assert.equal(err, "I FAILED");
  }
});
