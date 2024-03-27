"use strict";

class BinaryCalculator {
  static add(summand1, summand2) {
    let result = 0;
    const mask = 1;
    let carry = 0;
    let shift = 0;

    while (summand1 !== 0 || summand2 !== 0 || carry !== 0) {
      const bit1 = summand1 & mask;
      const bit2 = summand2 & mask;

      let sum = bit1 ^ bit2 ^ carry;

      sum <<= shift;

      carry = (bit1 & bit2) | (bit1 & carry) | (bit2 & carry);

      if (bit1 & bit2) carry |= 1;

      summand1 >>>= 1;
      summand2 >>>= 1;
      shift++;

      result |= sum;
    }

    return result;
  }

  static subtract(minuend, subtrahend) {
    const binaryMinuend = minuend.toString(2);
    const binarySubtrahend = subtrahend.toString(2);

    const binaryMaxLength = Math.max(
      binaryMinuend.length,
      binarySubtrahend.length,
    );

    const onesComplement = (~subtrahend + 1) & ((1 << binaryMaxLength) - 1);

    const diff = minuend + onesComplement;

    let binaryDiff = diff.toString(2);

    binaryDiff = binaryDiff
      .padStart(binaryMaxLength, "0")
      .slice(-binaryMaxLength);

    return parseInt(binaryDiff, 2);
  }
}

class BCD {
  #BCD_BITS_SIZE = 4;
  #BITS_PER_BYTE = 8;

  buff;
  u8Array;

  constructor(entity, precision) {
    this.entity = entity;
    this.precision = precision;
    this.byteLength = 0;

    this.#initBuffer();
  }

  #initBuffer() {
    let entity = this.entity;

    if (typeof entity === "bigint") {
      // Should be able to work with decimal
      let num = entity;
      // entity = 10.42
      // need to alloc 2 byte (as for 1042)
      const stringifiedBigInt = num.toString();
      const grades = stringifiedBigInt.length;
      // each bcd number takes 4 bits
      let bitsQuery = grades * this.#BCD_BITS_SIZE;
      // "-4".length * 4 = 8.
      // negative numbers will be represented as 9's complement
      if (num < 0) bitsQuery -= this.#BCD_BITS_SIZE;
      const byteLength = Math.ceil(bitsQuery / this.#BITS_PER_BYTE);

      this.byteLength = byteLength;
      this.buff = new ArrayBuffer(this.byteLength);
      this.u8Array = new Uint8Array(this.buff);
    } else if (typeof entity === "number") {
      // Should be able to work with decimal
      let num = entity;
      // entity = 10.42
      // need to alloc 2 byte (as for 1042)
      if (this.precision) num *= 10 ** this.precision;
      const grades = num.toString().length;
      // each bcd number takes 4 bits
      let bitsQuery = grades * this.#BCD_BITS_SIZE;
      // "-4".length * 4 = 8.
      // negative numbers will be represented as 9's complement
      if (num < 0) bitsQuery -= this.#BCD_BITS_SIZE;
      const byteLength = Math.ceil(bitsQuery / this.#BITS_PER_BYTE);

      this.byteLength = byteLength;
      this.buff = new ArrayBuffer(this.byteLength);
      this.u8Array = new Uint8Array(this.buff);
    } else if (entity instanceof BCD) {
      const bcd = entity;

      this.byteLength = bcd.byteLength;
      this.buff = new ArrayBuffer(this.byteLength);
      this.u8Array = new Uint8Array(this.buff);
    } else if (entity instanceof ArrayBuffer) {
      const buff = entity;

      this.byteLength = buff.byteLength;
      this.buff = new ArrayBuffer(this.byteLength);
      this.u8Array = new Uint8Array(this.buff);
    } else if (typeof entity === "string") {
      const grades = entity.split(".").reduce((acc, n) => acc + n.length, 0);
      // each bcd number takes 4 bits
      let bitsQuery = grades * this.#BCD_BITS_SIZE;
      // "-4".length * 4 = 8.
      // negative numbers will be represented as 9's complement
      if (entity[0] === "-") bitsQuery -= this.#BCD_BITS_SIZE;
      const byteLength = Math.ceil(bitsQuery / this.#BITS_PER_BYTE);

      this.byteLength = byteLength;
      this.buff = new ArrayBuffer(this.byteLength);
      this.u8Array = new Uint8Array(this.buff);
    } else {
      throw new Error(`typeof entity === ${typeof entity} is not supported`);
    }

    console.log("byteLength", this.byteLength);
  }

  valueOf() {}

  get buffer() {
    return this.buff;
  }

  toString() {}

  toBigInt() {}

  toNumber() {}

  floor() {}
  rount() {}
  ceil() {}
}

const bcd = new BCD(12345n);
console.log("Value of:", bcd.valueOf()); // Также вернет ArrayBuffer
console.log("Buffer:", bcd.buffer);
