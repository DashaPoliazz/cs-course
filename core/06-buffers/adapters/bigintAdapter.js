const Adapter = require("./mainAdapter.js");

class BigintAdapter extends Adapter {
  constructor(entity) {
    if (typeof entity !== "bigint") {
      throw new Error(`${typeof entity} !== 'bigint'`);
    }

    super(entity);

    if (this.precision) {
      throw new Error("Bigint can't be float");
    }

    this.serialized = entity.toString();
    this.integerAndFloatParts = [this.serialized, ""];

    let num = entity;
    // entity = 10.42
    // need to alloc 2 byte (as for 1042)
    const stringifiedBigInt = num.toString();
    const grades =
      stringifiedBigInt[0] === "-"
        ? stringifiedBigInt.length - 1
        : stringifiedBigInt.length;
    this.grades = grades;
    // each bcd number takes 4 bits
    let bitsQuery = grades * this.BCD_BITS_SIZE;
    // "-4".length * 4 = 8.
    // negative numbers will be represented as 9's complement
    if (num < 0n) {
      bitsQuery -= this.BCD_BITS_SIZE;
      this.isSigned = true;
    }

    const byteLength = Math.ceil(bitsQuery / this.BITS_PER_BYTE);

    this.byteLength = byteLength;
    this.buff = new ArrayBuffer(this.byteLength);
    this.u8Array = new Uint8Array(this.buff);
    this.operationResult = new Uint8Array(this.byteLength + 1);
    this.grades = grades;
  }

  get byteLength() {
    return this.byteLength;
  }

  get buffer() {
    return this.buff;
  }

  get u8Array() {
    return this.u8Array;
  }
}

module.exports = BigintAdapter;
