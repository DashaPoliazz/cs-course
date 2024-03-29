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
    const precision = isFloat && splittedWithDot.at(-1).length;
    this.precision = precision;
    this.isFloat = isFloat;
    this.serialized = splittedWithDot.join("");
    this.grades =
      this.serialized[0] === "-"
        ? this.serialized.length - 1
        : this.serialized.length;

    let num = entity;
    // entity = 10.42
    // need to alloc 2 byte (as for 1042)
    if (this.precision) num *= 10 ** this.precision;
    const grades = num.toString().length;
    // each bcd number takes 4 bits
    let bitsQuery = grades * this.BCD_BITS_SIZE;
    // "-4".length * 4 = 8.
    // negative numbers will be represented as 9's complement
    if (num < 0) bitsQuery -= this.BCD_BITS_SIZE;
    const byteLength = Math.ceil(bitsQuery / this.BITS_PER_BYTE);

    this.byteLength = byteLength;
    this.buff = new ArrayBuffer(this.byteLength);
    this.u8Array = new Uint8Array(this.buff);
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
