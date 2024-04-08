const ll = require("../05-linked-list/doubly-linked-list.js");
const Memory = require("./memory.js");

class Deq {
  #memory;
  #maxLength;
  #middleIdx;
  #leftIdx;
  #rightIdx;
  #initialLeftIdx;
  #initialRightIdx;
  #leftNode;
  #rightNode;

  TypedArray;
  capacity;
  leftLength;
  rightLength;

  constructor(TypedArray, capacity) {
    this.#memory = new Memory(TypedArray, capacity);
    this.TypedArray = TypedArray;
    this.capacity = capacity;

    ll.append(this.#memory);
    this.#leftNode = this.#rightNode = ll.head;

    const totalElements = capacity / TypedArray.BYTES_PER_ELEMENT;
    const middleIdx = Math.floor(totalElements / 2);
    this.#middleIdx = middleIdx;
    this.#maxLength = totalElements;

    const leftIdx = middleIdx;
    const rightIdx = middleIdx + 1;
    this.#leftIdx = leftIdx;
    this.#rightIdx = rightIdx;
    this.#initialLeftIdx = leftIdx;
    this.#initialRightIdx = rightIdx;
    this.leftLength = 0;
    this.rightLength = 0;
    this.length;
  }

  debugMiddleIdx() {
    return this.#middleIdx;
  }
  debugInitLeft() {
    return this.#initialLeftIdx;
  }
  debuginitRight() {
    return this.#initialRightIdx;
  }
  debugmemory() {
    return this.#memory;
  }
  debugLeftIdx() {
    return this.#leftIdx;
  }
  debugRightIdx() {
    return this.#rightIdx;
  }

  pushLeft(value) {
    this.leftLength++;
    if (this.#leftIdx < 0) {
      const prevNode = this.#leftNode.prev;
      // If there is no node in the left, it means that we've never
      // was out of bounds, then the we have create node
      if (!prevNode) {
        // Allocating new buffer
        const memory = new Memory(this.TypedArray, this.capacity);
        ll.prepend(memory);
        // Moving left index at it's initial position
        this.#leftNode = ll.head;
        this.#leftIdx = this.#initialLeftIdx;
        // Writing item in the memory
        memory.write(this.#leftIdx, value);
        this.#leftIdx--;
        return this.leftLength;
      }
      // Otherwise we can not create node because it has already been created
      // when prev reaalloc was triggered. Memory has been allocated also
      this.#leftNode = prevNode;
      this.#leftIdx = this.#initialLeftIdx;
      const memory = this.#leftNode.value;
      memory.write(this.#leftIdx, value);
      this.#leftIdx--;
      return this.leftLength;
    }
    // Otherwise, values fits in the current memory chunk
    const memory = this.#leftNode.value;
    memory.write(this.#leftIdx, value);
    this.#leftIdx--;
    return this.leftLength;
  }
  pushRight(value) {
    this.rightLength++;
    if (this.#rightIdx >= this.#maxLength) {
      const nextNode = this.#rightNode.next;
      // If there is no node in the right, it means that we've never
      // was out of bounds, then the we have to create a node
      if (!nextNode) {
        // Allocating new buffer
        const memory = new Memory(this.TypedArray, this.capacity);
        ll.append(memory);
        // Moving right index at it's initial position
        this.#rightNode = ll.tail;
        this.#rightIdx = this.#initialRightIdx;
        // Writing item in the memory
        memory.write(this.#rightIdx, value);
        this.#rightIdx++;
        return this.rightLength;
      }
      // Otherwise we can not create a node because it has already been created
      // when the next realloc was triggered. Memory has been allocated also
      this.#rightNode = nextNode;
      this.#rightIdx = this.#initialRightIdx;
      const memory = this.#rightNode.value;
      memory.write(this.#rightIdx, value);
      this.#rightIdx++;
      return this.rightLength;
    }
    // Otherwise, values fits in the current memory chunk
    const memory = this.#rightNode.value;
    memory.write(this.#rightIdx, value);
    this.#rightIdx++;
    return this.rightLength;
  }
  // Task is to left writeIndex always on it's position
  popLeft() {
    // Can't pop empty left part
    const nextNode = this.#leftNode.next;
    if (this.leftLength === 0 && !nextNode) return 0;
    // Otherwise we can perform popLeft
    this.leftLength--;
    if (this.#leftIdx === this.#initialLeftIdx) {
      // We have to keep leftIdx at insert position
      this.#leftNode = nextNode;
      this.#leftIdx = 0;
      const memory = this.#leftNode.value;
      const out = memory.read(this.#leftIdx);
      memory.write(this.#leftIdx, 0);
      return out;
    }
    // within current node
    this.#leftIdx += 1;
    const memory = this.#leftNode.value;
    const out = memory.read(this.#leftIdx);
    memory.write(this.#leftIdx, 0);
    return out;
  }
  popRight() {
    // Can't pop empty right part
    const prevNode = this.#rightNode.prev;
    if (this.rightLength === 0 && !prevNode) return 0;
    // Otherwise we can perform popRight
    this.rightLength--;
    if (this.#rightIdx === this.#initialRightIdx) {
      // We have to keep rightIdx at insert position
      this.#rightNode = prevNode;
      this.#rightIdx = this.#maxLength - 1;
      const memory = this.#rightNode.value;
      const out = memory.read(this.#rightIdx);
      memory.write(this.#rightIdx, 0);
      return out;
    }
    // within current node
    this.#rightIdx -= 1;
    const memory = this.#rightNode.value;
    const out = memory.read(this.#rightIdx);
    memory.write(this.#rightIdx, 0);
    return out;
  }

  peekLeft() {
    const readIdx =
      this.#leftIdx === this.#initialLeftIdx
        ? this.#leftIdx
        : this.#leftIdx + 1;
    const memory = this.#leftNode.value;
    return memory.read(readIdx);
  }
  peekRight() {
    const readIdx =
      this.#rightIdx === this.#initialRightIdx
        ? this.#rightIdx
        : this.#rightIdx - 1;
    const memory = this.#rightNode.value;
    return memory.read(readIdx);
  }

  get length() {
    return this.leftLength + this.rightLength;
  }
}

// Usage

{
  // Push left
  const deq = new Deq(Uint8Array, 6);
  console.log("initial left position", deq.debugInitLeft());

  deq.pushLeft(1);
  console.log(deq.peekLeft()); // 1
  console.log(deq.leftLength); // 1
  console.log("Left position after pushLeft(1)", deq.debugLeftIdx());

  deq.pushLeft(2);
  deq.pushLeft(3);
  console.log(deq.peekLeft()); // 3
  console.log(deq.leftLength); // 3
  console.log("Left position after pushLeft(3)", deq.debugLeftIdx());

  deq.pushLeft(4);
  deq.pushLeft(5);
  console.log(deq.peekLeft()); // 5
  console.log(deq.leftLength); // 5
  console.log(
    "Left position after pushLeft(3)",
    deq.debugLeftIdx() === deq.debugInitLeft(),
    deq.debugLeftIdx(),
  ); // currentLeft === initLeft

  {
    // Pop left
    console.log("Pop left");
    console.log("Iniital left position in pop", deq.debugLeftIdx());

    console.log(deq.popLeft()); // 5
    console.log(deq.debugLeftIdx()); // Stays 0 when we popLeft single element in next node
    console.log(deq.popLeft()); // 4
    console.log(deq.popLeft()); // 3
    console.log(deq.popLeft()); // 2
    console.log(deq.popLeft()); // 1
    console.log(deq.popLeft()); // 0
    console.log(deq.popLeft()); // 0
    console.log(deq.debugLeftIdx()); // Keeps it's insert position
  }

  for (const node of ll) {
    console.log(node);
  }
}

console.log("\n");

{
  // Push right
  const deq = new Deq(Uint8Array, 6);
  console.log("initial right position", deq.debuginitRight());

  deq.pushRight(1);
  console.log(deq.peekRight()); // 1
  console.log(deq.rightLength); // 1
  console.log("Right position after pushRight(1)", deq.debugRightIdx()); // 5

  deq.pushRight(2);
  console.log("Right position after pushRight(2)", deq.debugRightIdx()); // 6

  deq.pushRight(3);
  console.log("Rightmost value after pushRight(3)", deq.peekRight()); // 3
  console.log(deq.rightLength); // 3
  console.log("Right position after pushRight(3)", deq.debugRightIdx());

  deq.pushRight(4);
  console.log(deq.peekRight()); // 4
  console.log(deq.rightLength); // 4

  {
    // PopRight
    console.log("Initial right position in pop", deq.debugRightIdx());

    console.log(deq.popRight()); // 4
    console.log(deq.popRight()); // 3
    console.log(deq.popRight()); // 2
    console.log(deq.popRight()); // 1
    console.log(deq.popRight()); // 0
    console.log(deq.popRight()); // 0
    console.log(deq.debugRightIdx()); // Should be equal to it's initial position (4)
  }

  for (const node of ll) {
    console.log(node);
  }
}
