const { describe, it } = require("node:test");
const assert = require("node:assert");

const Heap = require("../Heap.js");

it("should build heap up with heapify-up correctly", () => {
  const arr = [35, 12, 56, 61, 48, 73, 26];
  const comparator = (x1, x2) => x1 >= x2;

  const h = new Heap(arr, comparator);
  for (let i = 1; i < arr.length; i++) {
    h.heapifyUp(i);
  }
  assert.deepEqual(true, h.validate(0));
});

it("should build heap up with heapify-down correctly", () => {
  const arr = [35, 12, 56, 61, 48, 73, 26];
  const comparator = (x1, x2) => x1 >= x2;

  const h = new Heap(arr, comparator);
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    h.heapifyDown(i);
  }

  assert.deepEqual(true, h.validate(0));
});

describe("sorting", () => {
  it("should sort the small array correctly", () => {
    const arr = [35, 12, 56, 61, 48, 73, 26];
    const comparator = (x1, x2) => x1 >= x2;
    const heap = new Heap(arr, comparator);
    const sortedCopy = [...arr].sort((a, b) => a - b);
    heap.sort();
    assert.deepEqual(arr, sortedCopy);
  });

  it("should sort the huge array of random elements correctly", () => {
    const arr = [];
    for (let i = 0; i < 1000; i++) {
      const randomNumber = Math.floor(Math.random() * 1000);
      arr.push(randomNumber);
    }

    const comparator = (x1, x2) => x1 >= x2;
    const heap = new Heap(arr, comparator);
    const sortedCopy = [...arr].sort((a, b) => a - b);
    heap.sort();
    assert.deepEqual(arr, sortedCopy);
  });
});
