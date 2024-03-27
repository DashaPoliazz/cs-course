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

class Adapter {
  BCD_BITS_SIZE = 4;
  BITS_PER_BYTE = 8;

  byteLength;
  buff;
  u8Array;

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

class BigintAdapter extends Adapter {
  constructor(entity) {
    if (typeof entity !== "bigint") {
      throw new Error(`${typeof entity} !== 'bigint'`);
    }

    super();

    let num = entity;
    // entity = 10.42
    // need to alloc 2 byte (as for 1042)
    const stringifiedBigInt = num.toString();
    const grades = stringifiedBigInt.length;
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

class NumberAdapter extends Adapter {
  constructor(entity) {
    if (typeof entity !== "number") {
      throw new Error(`${typeof entity} !== 'number'`);
    }

    super();

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

class BCDAdapter extends Adapter {
  constructor(entity) {
    if (!(entity instanceof BCD)) {
      throw new Error(`Entity is instance of BCD class`);
    }

    super();

    const bcd = entity;

    this.byteLength = bcd.byteLength;
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

class StringAdapter extends Adapter {
  constructor(entity) {
    if (typeof entity !== "string") {
      throw new Error(`${typeof entity} !== 'string'`);
    }

    super();

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

class BCD {
  constructor(adaptedEntity, precision) {
    if (!(adaptedEntity instanceof Adapter)) {
      throw new Error(
        "Adapted entity should be instanced from 'Adapter' class",
      );
    }

    Object.assign(this, adaptedEntity);
    this.precision = precision;
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

const bcd = new BCD(new NumberAdapter(40.42));
console.log("Value of:", bcd.valueOf()); // Также вернет ArrayBuffer
console.log("Buffer:", bcd.buffer);
