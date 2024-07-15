class Adapter {
  BCD_BITS_SIZE = 4;
  BITS_PER_BYTE = 8;

  byteLength;
  buff;
  u8Array;
  isFloat = false;
  isSigned = false;
  precision;
  grades;
  operationResult;

  constructor(entity) {
    this.initialEntity = entity.toString();
    this.serialized = entity;
    this.precision = 0;
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
