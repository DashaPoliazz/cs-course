class Adapter {
  BCD_BITS_SIZE = 4;
  BITS_PER_BYTE = 8;

  byteLength;
  buff;
  u8Array;
  isFloat = false;
  precision = 0;
  grades;

  constructor(entity) {
    this.initialEntity = entity;
    this.serialized = entity;
  }

  get byteLength() {
    throw new Error("getter 'byteLength' should be implemented in subclass");
  }

  get buffer() {
    throw new Error("getter 'buffer' should be implemented in subclass");
  }

  get u8Array() {
    throw new Error("getter 'u8Array' should be implemented in subclass");
  }
}

module.exports = Adapter;
