const Heap = require("./Heap.js");

const comparator = (x1, x2) => x1 > x2;

{
  const arr = [35, 12, 56, 61, 48, 73, 26];
  const h = new Heap(arr, comparator);
  for (let i = 1; i < arr.length; i++) {
    h.heapifyUp(i);
  }
  console.log("Heap bulided for T = O(NLogN)", arr, h.validate(0));
}

{
  const arr = [35, 12, 56, 61, 48, 73, 26];
  const h = new Heap(arr, comparator);
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    h.heapifyDown(i);
  }
  console.log("Heap bulided for T = O(LogN)", arr, h.validate(0));
}

{
  const arr = [35, 12, 56, 61, 48, 73, 26];
  const copy = [...arr].sort((a, b) => a - b);
  const h = new Heap(arr, comparator);
  console.log("sorted:", h.sort(), copy);
}
