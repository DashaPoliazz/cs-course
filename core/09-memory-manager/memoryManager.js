// Rule of indexes:
// Any insertion index stays on it's position.
// Any removing index is it's position + 1.
// - to remove value in the memory we have to decrement index
//   and then remove value

class MemoryManager {
  #MAX_STACK_SIZE_IN_BYTES = 10 * 1024;

  constructor(heapSize, stackSize) {
    if (stackSize > this.#MAX_STACK_SIZE_IN_BYTES)
      throw new Error(
        `Can't alloc ${stackSize} bytes. Max allowed limit is ${
          this.#MAX_STACK_SIZE_IN_BYTES
        }`,
      );
  }
}
