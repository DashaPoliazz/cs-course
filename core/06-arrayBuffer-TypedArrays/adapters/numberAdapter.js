const Adapter = require("./mainAdapter.js");

class NumberAdapter extends Adapter {
  constructor(entity) {
    if (typeof entity !== "number") {
      throw new Error(`${typeof entity} !== 'number'`);
    }

    super(entity);
    const stringifiedEntity = entity.toString();
    const splittedWithDot = stringifiedEntity.split(".");

    const isFloat = splittedWithDot.length > 1;
    const integerAndFloatParts = isFloat
      ? [splittedWithDot[0], splittedWithDot[1]]
      : [splittedWithDot[0], ""];
    const precision = isFloat && splittedWithDot.at(-1).length;
    this.isSigned = entity < 0;
    this.precision = precision === false ? 0 : precision;
    this.isFloat = isFloat;
    this.serialized = splittedWithDot.join("");
    this.integerAndFloatParts = integerAndFloatParts;

    let num = entity;
    // entity = 10.42
    // need to alloc 2 byte (as for 1042)
    if (this.precision) num *= 10 ** this.precision;
    const grades = this.isSigned
      ? splittedWithDot.join("").length - 1
      : splittedWithDot.join("").length;
    // each bcd number takes 4 bits
    let bitsQuery = grades * this.BCD_BITS_SIZE;
    // "-4".length * 4 = 8.
    // negative numbers will be represented as 9's complement
    if (this.isSigned) bitsQuery -= this.BCD_BITS_SIZE;
    const byteLength = Math.ceil(bitsQuery / this.BITS_PER_BYTE);

    this.grades = grades;
    this.byteLength = byteLength;
    this.buff = new ArrayBuffer(this.byteLength);
    this.u8Array = new Uint8Array(this.buff);
    this.operationResult = new Uint8Array(this.byteLength + 1);
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

module.exports = NumberAdapter;
