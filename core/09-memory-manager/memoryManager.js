const Heap = require("./heap/heap.js");
const Stack = require("./stack/stack.js");

class MemoryManager {
  #MAX_STACK_SIZE_IN_BYTES = 10 * 1024;

  #heap;
  #stack;

  constructor(heapSize, stackSize) {
    if (stackSize > this.#MAX_STACK_SIZE_IN_BYTES)
      throw new Error(
        `Can't alloc ${stackSize} bytes. Max allowed limit is ${
          this.#MAX_STACK_SIZE_IN_BYTES
        }`,
      );

    this.#heap = new Heap(heapSize);
    this.#stack = new Stack(stackSize);
  }

  pushStack(frameBuffer) {
    return this.#stack.push(frameBuffer);
  }
  popStack() {
    return this.#stack.pop();
  }
  peekStack() {
    return this.#stack.peek();
  }

  allocHeap(pointerName, byteLength) {
    return this.#heap.alloc(pointerName, byteLength);
  }
  dropHeap(pointerName) {
    return this.#heap.drop(pointerName);
  }

  // For presentative purposes
  showStackBuffer() {
    this.#stack.debugBuffer();
  }
  showHeapBuffer() {
    this.#heap.debugMemory();
  }
}

{
  // Stack Usages
  const mm = new MemoryManager(0, 70);
  const memoryChunk1 = new Uint8Array([1, 2, 3]);
  const lense0 = mm.pushStack(memoryChunk1);

  // Setting first element 2
  lense0.set(0, 2);

  console.log("lense0.get(0)", lense0.get(0)); // 2
  console.log("lense0.get(1)", lense0.get(1)); // 2
  console.log("lense0.get(2)", lense0.get(2)); // 3

  console.log(...lense0.values()); // 2, 2, 3

  // s.debugBuffer("DebugBuffer");

  const memoryChunk2 = new Uint32Array([4, 5, 6, 7]);
  const lense1 = mm.pushStack(memoryChunk2);
  console.log("lense1.get(0)", lense1.get(0));
  console.log("lense1.get(1)", lense1.get(1));
  console.log("lense1.get(2)", lense1.get(2));
  console.log("lense1.get(2)", lense1.get(3));

  const memoryChunk3 = new Uint8Array([7, 8, 9]);
  mm.pushStack(memoryChunk3);

  const lense2 = mm.peekStack();
  console.log("lense2.get(0)", lense2.get(0));
  console.log("lense2.get(1)", lense2.get(1));
  console.log("lense2.get(2)", lense2.get(2));
  // console.log("get(4)", lense1.get(4)); // Out of bounds error

  mm.showStackBuffer("Before pop");
  const lense3 = mm.popStack();
  console.log("lense3.get(0)", lense3.get(0));
  console.log("lense3.get(1)", lense3.get(1));
  console.log("lense3.get(2)", lense3.get(2));

  mm.showStackBuffer("After pop");

  // s.push(memoryChunk2); // stack overflow

  const lense4 = mm.popStack();
  console.log("lense4.get(0)", lense4.get(0));
  console.log("lense4.get(1)", lense4.get(1));
  console.log("lense4.get(2)", lense4.get(2));
  console.log("lense4.get(2)", lense4.get(3));

  const lense5 = mm.popStack();
  console.log("lense5.get(0)", lense5.get(0));
  console.log("lense5.get(1)", lense5.get(1));
  console.log("lense5.get(2)", lense5.get(2));
}

{
  // Heap usages
  const mm = new MemoryManager(80, 0);
  const writePointer1 = mm.allocHeap("writePointer1", 8);

  writePointer1.set(0, 1);
  writePointer1.set(1, 2);
  writePointer1.set(2, 3);
  writePointer1.set(3, 4);
  writePointer1.set(4, 5);
  writePointer1.set(5, 6);
  writePointer1.set(6, 7);
  writePointer1.set(7, 8);

  console.log(...writePointer1.values()); // 1..8
  console.log(mm.dropHeap("writePointer1"));
  console.log(...writePointer1.values()); // 0..0

  const writePointer2 = mm.allocHeap("writePointer2", 8);

  writePointer2.set(0, 1);
  writePointer2.set(1, 2);
  writePointer2.set(2, 3);
  writePointer2.set(3, 4);
  writePointer2.set(4, 5);
  writePointer2.set(5, 6);
  writePointer2.set(6, 7);
  writePointer2.set(7, 8);

  mm.showHeapBuffer();

  console.log(...writePointer2.values()); // 1..8
  console.log(mm.dropHeap("writePointer2"));
  console.log(...writePointer2.values()); // 0..0

  mm.showHeapBuffer();

  const writePointer3 = mm.allocHeap("writePointer3", 8);

  writePointer3.set(0, 1);
  writePointer3.set(1, 2);
  writePointer3.set(2, 3);
  writePointer3.set(3, 4);
  writePointer3.set(4, 5);
  writePointer3.set(5, 6);
  writePointer3.set(6, 7);
  writePointer3.set(7, 8);

  mm.showHeapBuffer();

  const writePointer4 = mm.allocHeap("writePointer4", 8);

  writePointer4.set(0, 1);
  writePointer4.set(1, 2);
  writePointer4.set(2, 3);
  writePointer4.set(3, 4);
  writePointer4.set(4, 5);
  writePointer4.set(5, 6);
  writePointer4.set(6, 7);
  writePointer4.set(7, 8);

  mm.showHeapBuffer();
}
