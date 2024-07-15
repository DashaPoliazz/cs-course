const Adapter = require("./mainAdapter");

class StringAdapter extends Adapter {
  constructor(entity) {
    if (typeof entity !== "string") {
      throw new Error(`${typeof entity} !== 'string'`);
    }

    super(entity);

    const splittedWithDot = entity.split(".");
    const isFloat = splittedWithDot.length > 1;
    const integerAndFloatParts = isFloat
      ? [splittedWithDot[0], splittedWithDot[1]]
      : [splittedWithDot[0], ""];
    const precision = isFloat && splittedWithDot.at(-1).length;
    this.precision = precision === false ? 0 : precision;
    this.isFloat = isFloat;
    this.serialized = entity.split(".").join("");
    this.integerAndFloatParts = integerAndFloatParts;
    this.isSigned = entity[0] === "-";

    const grades = this.isSigned
      ? splittedWithDot.join("").length - 1
      : splittedWithDot.join("").length;
    // each bcd number takes 4 bits
    let bitsQuery = grades * this.BCD_BITS_SIZE;
    // "-4".length * 4 = 8.
    // negative numbers will be represented as 9's complement
    if (this.isSigned) bitsQuery -= this.BCD_BITS_SIZE;
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

module.exports = StringAdapter;
