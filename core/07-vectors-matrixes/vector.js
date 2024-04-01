const DEFAULT_GROWTH_FACTOR = 2;
const START_INDEX = 0;

class Vector {
  #memory;
  #growthFactor;
  #TypedArray;
  length;
  capacity;

  constructor(TypedArray, options = {}) {
    const { capacity = 100 } = options;

    this.#growthFactor = DEFAULT_GROWTH_FACTOR;
    this.#memory = new Memory(TypedArray, capacity);
    this.buffer = this.#memory.buffer;
    this.length = 0;
    this.#TypedArray = TypedArray;
    this.capacity = capacity;
  }

  // Adds element in the end
  // T -> O(1) (O(N) if reallocation is needed)
  // S -> O(1) (O(N) if reallocation is needed)
  push(value) {
    if (this.#isResizeNeeded()) {
      this.#reallocMemory();
    }

    const index = this.length;

    this.#memory.write(index, value);
    this.length += 1;

    return value;
  }

  // Removed element from the end
  // T -> O(1)
  // S -> O(1)
  pop() {
    const index = this.length - 1;
    const value = this.#memory.read(index);

    this.#memory.write(index, 0);
    this.length -= 1;

    return value;
  }

  shift() {
    const value = this.#memory.read(0);

    // moving all element in the left
    for (let i = 0; i < this.length - 1; i++) {
      const value = this.#memory.read(i + 1);
      this.#memory.write(i, value);
    }

    const lastValue = this.#memory.read(this.length - 1);

    this.#memory.write(this.length - 2, lastValue);
    this.#memory.write(this.length - 1, 0);
    this.length -= 1;

    return value;
  }

  unshift(value) {
    if (this.#isResizeNeeded()) {
      this.#reallocMemory();
    }

    // Moving all elements in the right
    for (let i = this.length - 1; i >= 0; i--) {
      const value = this.#memory.read(i);
      this.#memory.write(i + 1, value);
    }

    this.#memory.write(START_INDEX, value);
    this.length += 1;

    return value;
  }

  get(index) {
    return this.#memory.read(index);
  }

  shrinkToFit() {
    const newCapacity = this.length;
    this.#reallocMemory(newCapacity);
  }

  #reallocMemory(newCapacity = this.capacity * this.#growthFactor) {
    const reallocedMemory = new Memory(this.#TypedArray, newCapacity);

    for (let i = 0; i < this.length; i++) {
      const value = this.#memory.read(i);
      reallocedMemory.write(i, value);
    }

    this.#memory = reallocedMemory;
    this.capacity = newCapacity;
  }

  // Check if resize is needed
  #isResizeNeeded() {
    const lengthAfterAddingNewElement = this.length + 1;
    return lengthAfterAddingNewElement > this.capacity;
  }

  *values() {
    const ctx = this;
    let i = 0;
    while (i < ctx.length) {
      yield ctx.#memory.typedArray[i++];
    }
  }
}

class Memory {
  capacity;
  buffer;
  typedArray;

  constructor(TypedArray, capacity) {
    const bufferLength = TypedArray.BYTES_PER_ELEMENT * capacity;

    this.capacity = capacity;
    this.buffer = new ArrayBuffer(bufferLength);
    this.typedArray = new TypedArray(this.buffer);
  }

  // Reading element by index
  // T -> O(1)
  // S -> O(1)
  read(index) {
    return this.typedArray[index];
  }

  // Reading element by index
  // T -> O(N)
  // S -> O(N)
  write(index, value) {
    const stringifiedValue = value.toString();
    const valueSize = Buffer.from(stringifiedValue).length;
    const allowedValueSize = this.typedArray.BYTES_PER_ELEMENT;

    if (valueSize > this.allowedValueSize) {
      throw new Error(
        `Memory size per element exceeded. Value to write = '${value}' has size '${valueSize}' while allowed size is '${allowedValueSize}'`,
      );
    }

    this.typedArray[index] = value;
  }
}

// Usages:
{
  // 1. Vector
  const vec = new Vector(Int32Array, { capacity: 4 });

  vec.push(1); // Возвращает длину - 1
  vec.push(2); // 2
  vec.push(3); // 3
  vec.push(4); // 4
  vec.push(5); // 5 Увеличение буфера

  console.log(vec.capacity); // 8
  console.log(vec.length); // 5

  vec.pop(); // Удаляет с конца, возвращает удаленный элемент - 5

  console.log(vec.capacity); // 8

  vec.shrinkToFit(); // Новая емкость 4
  console.log(vec.capacity); // 4

  console.log(vec.buffer); // Ссылка на ArrayBuffer
}

{
  // 2. Iterator
  const vec = new Vector(Int32Array, { capacity: 1 });

  const i = vec.values();

  vec.push(1);
  vec.push(2);
  vec.push(3);

  console.log(i.next()); // {done: false, value: 1}
  console.log(i.next()); // {done: false, value: 2}
  console.log(i.next()); // {done: false, value: 3}
  console.log(i.next()); // {done: true, value: undefined}
}

module.exports = Vector;
