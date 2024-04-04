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

module.exports = Memory;
