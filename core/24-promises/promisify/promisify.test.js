const assert = require("node:assert");
const { it } = require("node:test");
const promisify = require("./promisify.js");
const fs = require("node:fs");

it("should promisify readfile function correctly", () => {
  // read file with cb
  let length_one = null;
  fs.readFile("./input.txt", (err, data) => {
    length_one = data.toString().split("\n").length;
  });
  // read file with promise
  let length_two = null;
  const readFileAsync = promisify(fs.readFile);
  readFileAsync("./input.txt").then((data) => {
    length_two = data.toString().split("\n").length;
  });
  // 1 secund later it should be done, but who knows...
  setTimeout(() => {
    assert.equal(length_one, length_two);
  }, 1_000);
});

it("should handle errors correctly", (done) => {
  const readFileAsync = promisify(fs.readFile);

  readFileAsync("./nonexistentfile.txt")
    .then(() => {})
    .catch((err) => {
      assert(err instanceof Error);
    });
});

it("should work with functions that have multiple arguments", () => {
  function add(a, b, callback) {
    callback(null, a + b);
  }

  const addAsync = promisify(add);
  addAsync(1, 2)
    .then((result) => {
      assert.equal(result, 3);
    })
    .catch((err) => {});
});
