const Adapter = require("./mainAdapter");

class StringAdapter extends Adapter {
  constructor(entity) {
    if (typeof entity !== "string") {
      throw new Error(`${typeof entity} !== 'string'`);
    }

    super(entity);

    const splittedWithDot = entity.split(".");
    const isFloat = splittedWithDot.length > 1;
    const precision = isFloat && splittedWithDot.at(-1).length;
    this.precision = precision;
    this.isFloat = isFloat;
    this.serialized = entity.split(".").join("");

    const grades = entity.split(".").reduce((acc, n) => acc + n.length, 0);
    // each bcd number takes 4 bits
    let bitsQuery = grades * this.BCD_BITS_SIZE;
    // "-4".length * 4 = 8.
    // negative numbers will be represented as 9's complement
    if (entity[0] === "-") bitsQuery -= this.BCD_BITS_SIZE;
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

module.exports = StringAdapter;
