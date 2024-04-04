const Memory = require("./memory.js");

class Dequeue {
  #memory;
  #maxLength;
  #middleIdx;
  #leftIdx;
  #rightIdx;
  #initialLeftIdx;
  #initialRightIdx;

  leftLength;
  rightLength;

  constructor(TypedArray, capacity) {
    this.#memory = new Memory(TypedArray, capacity);

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
    if (this.leftLength < 0) throw new Eror("Out of bounds");
    this.#memory.write(this.#leftIdx, value);
    // Let indexes get out of bounds if pushing at 0 idx
    if (this.#leftIdx >= 0) this.#leftIdx--;
    return ++this.leftLength;
  }
  pushRight(value) {
    if (this.rightLength >= this.#maxLength) throw new Error("Out of bounds");
    this.#memory.write(this.#rightIdx, value);
    // Let indexes get out of bounds if pushing at maxLength - 1 idx
    if (this.#rightIdx < this.#maxLength) this.#rightIdx++;
    return ++this.rightLength;
  }
  popLeft() {
    if (this.#leftIdx === this.#initialLeftIdx) return 0;
    // since leftIdx becomes leftIdx - 1 each time we perform .pushLeft
    // we stay at 'unitialized position', so we have pop at leftIdx + 1
    const leftmostElementIdx = this.#leftIdx + 1;
    const out = this.#memory.read(leftmostElementIdx);
    this.#memory.write(leftmostElementIdx, 0);
    this.#leftIdx++;
    this.leftLength--;
    return out;
  }
  popRight() {
    if (this.#rightIdx === this.#initialRightIdx) return 0;
    const rightmostElementIdx = this.#rightIdx - 1;
    const out = this.#memory.read(rightmostElementIdx);
    this.#memory.write(rightmostElementIdx, 0);
    this.#rightIdx--;
    this.rightLength--;
    return out;
  }
  peekLeft() {
    const readIdx =
      this.#leftIdx === this.#initialLeftIdx
        ? this.#leftIdx
        : this.#leftIdx + 1;
    return this.#memory.read(readIdx);
  }
  peekRight() {
    const readIdx =
      this.#rightIdx === this.#initialRightIdx
        ? this.#rightIdx
        : this.#rightIdx - 1;
    return this.#memory.read(readIdx);
  }

  get length() {
    return this.leftLength + this.rightLength;
  }
}

// {
//   const dequeue = new Dequeue(Uint8Array, 64);

//   dequeue.pushLeft(1); // Возвращает длину - 1
//   dequeue.pushLeft(2); // 2
//   dequeue.pushLeft(3); // 3

//   console.log(dequeue.length); // 3
//   console.log(dequeue.popLeft()); // Удаляет с начала, возвращает удаленный элемент - 1

//   dequeue.pushRight(4);
//   dequeue.pushRight(5);
//   dequeue.pushRight(6);

//   console.log(dequeue.popRight()); // Удаляет с конца, возвращает удаленный элемент - 6
// }

// {
//   // Left operations:
//   const dequeue = new Dequeue(Uint8Array, 8);

//   console.log("initLeft", dequeue.debugInitLeft());
//   console.log("initRight", dequeue.debuginitRight());
//   console.log("middle", dequeue.debugMiddleIdx());
//   console.log("defaultLeft", dequeue.debugLeftIdx());

//   console.log("\n");

//   console.log("peekLeft before pushLeft", dequeue.peekLeft());

//   console.log("pushLeft(1)", dequeue.pushLeft(1));
//   console.log("pushLeft(2)", dequeue.pushLeft(2));
//   console.log("pushLeft(3)", dequeue.pushLeft(3));

//   console.log("peekLeft after push pushLeft(3)", dequeue.peekLeft());

//   console.log("leftIdx after push", dequeue.debugLeftIdx());
//   console.log("memory after add:", dequeue.debugmemory());

//   console.log("\n");

//   console.log("popLeft() 1", dequeue.popLeft());
//   console.log("leftIdx after pop 1", dequeue.debugLeftIdx());
//   console.log("memory after pop 1:", dequeue.debugmemory());

//   console.log("\n");

//   console.log("popLeft() 2", dequeue.popLeft());
//   console.log("leftIdx after pop 2", dequeue.debugLeftIdx());
//   console.log("memory after pop 2:", dequeue.debugmemory());

//   console.log("\n");

//   console.log("popLeft() 3", dequeue.popLeft());
//   console.log("popLeft() 3", dequeue.popLeft());
//   console.log("popLeft() 3", dequeue.popLeft());
//   console.log("leftIdx after pop 3", dequeue.debugLeftIdx());
//   console.log("memory after pop 3:", dequeue.debugmemory());
// }

// {
// // Right operations:
// const dequeue = new Dequeue(Uint8Array, 8);

// console.log("initLeft", dequeue.debugInitLeft());
// console.log("initRight", dequeue.debuginitRight());
// console.log("middle", dequeue.debugMiddleIdx());
// console.log("defaultLeft", dequeue.debugLeftIdx());

// console.log("peekRight before push", dequeue.peekRight());

// console.log("pushRight(1)", dequeue.pushRight(1));
// console.log("pushRight(2)", dequeue.pushRight(2));
// console.log("pushRight(3)", dequeue.pushRight(3));

// console.log("peekRight after push", dequeue.peekRight());

// console.log("RightIdx after push", dequeue.debugRightIdx());
// console.log("memory after add:", dequeue.debugmemory());

// console.log("\n");

// console.log("popRight() 1", dequeue.popRight());
// console.log("RightIdx after pop 1", dequeue.debugRightIdx());
// console.log("peekRight after pop 1", dequeue.peekRight());

// console.log("memory after pop 1:", dequeue.debugmemory());

// console.log("\n");

// console.log("popRight() 2", dequeue.popRight());
// console.log("RightIdx after pop 2", dequeue.debugRightIdx());
// console.log("memory after pop 2:", dequeue.debugmemory());

// console.log("\n");

// console.log("popRight() 3", dequeue.popRight());
// console.log("popRight() 3", dequeue.popRight());
// console.log("popRight() 3", dequeue.popRight());
// console.log("RightIdx after pop 3", dequeue.debugRightIdx());
// console.log("memory after pop 3:", dequeue.debugmemory());
// }
