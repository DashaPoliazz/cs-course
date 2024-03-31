"use strict";

const BinaryCalculator = require("./binaryCalculator.js");
const { Adapter, NumberAdapter } = require("./adapters/adapters.js");

class BCD {
  BCD_BITS_SIZE = 4;
  NINE_MASK = 0b1001;

  byteLength;
  buff;
  u8Array;
  complementedToNine;

  constructor(adaptedEntity, precision) {
    if (!(adaptedEntity instanceof Adapter)) {
      throw new Error(
        "Adapted entity should be instanced from 'Adapter' class",
      );
    }

    Object.assign(this, adaptedEntity);
    if (precision) this.precision = precision;
    this.isNegative = this.serialized[0] === "-";
    console.log("PRECISION:", this.precision);
    this.#initBuffer();
  }

  #initBuffer() {
    let insertionIndex = this.byteLength - 1;
    let endIndex = this.serialized[0] === "-" ? 1 : 0;
    const s = this.serialized;

    for (let i = s.length; i >= endIndex; i -= 2) {
      const startIndex = i - 2;
      const endIndex = i;
      const numbers = [...s.substring(startIndex, endIndex)];

      let shift = 0;
      let bcd = 0;
      while (numbers.length) {
        // Not pop because uint8Array visulise as littleEndian
        const number = Number(numbers.pop()) << shift;
        bcd |= number;
        shift += this.BCD_BITS_SIZE;
      }

      this.u8Array[insertionIndex--] = bcd;
    }

    // If it's signed value we have to create 9's complement of it
    if (this.isNegative) {
      const complementedToNine = new Uint8Array(this.byteLength);
      this.complementedToNine = complementedToNine;

      for (let i = this.byteLength - 1; i >= 0; i--) {
        const twoBcd = this.u8Array[i];
        const ninesComplement = this.#complementToNine(twoBcd, 2);
        complementedToNine[i] = ninesComplement;
      }
    }
  }

  // Returns 9's complement if it's signed value
  valueOf() {
    return this.isNegative ? this.complementedToNine : this.u8Array;
  }

  get(idx = 1) {
    const isNegative = idx < 0;
    const grades = !isNegative ? this.grades - 1 : this.grades;
    if (Math.abs(idx) > grades)
      idx = !isNegative ? (idx % grades) - 1 : idx % grades;
    const isEven = idx % 2 === 0;
    if (isNegative) idx = grades + idx;
    const positiveMask = isEven ? 0b0000_1111 : 0b1111_0000;
    const negativeMask = isEven ? 0b1111_0000 : 0b0000_1111;
    const mask = !isNegative ? positiveMask : negativeMask;
    const needToShift = mask === 0b1111_0000;
    const cellIdx = Math.abs(this.u8Array.length - 1 - Math.floor(idx / 2));
    const bcdPair = this.u8Array[cellIdx];
    const out = bcdPair & mask;
    return needToShift ? out >> this.BCD_BITS_SIZE : out;
  }

  #complementToNine(bcd, complementGrade) {
    const mask = 0b1111;
    let out = 0;

    for (
      let shift = 0;
      complementGrade > 0;
      shift += this.BCD_BITS_SIZE, bcd >>>= 4, complementGrade--
    ) {
      const bits = bcd & mask;
      let substraction = BinaryCalculator.subtract(this.NINE_MASK, bits);
      substraction <<= shift;
      out |= substraction;
    }

    return out;
  }

  get buffer() {
    return this.buff;
  }

  toString() {
    if (!this.precision) return this.serialized;
    const out = this.#getFloat(this.precision);
    return out;
  }

  toBigInt() {
    if (Number.isNaN(this.serialized))
      throw new Error(`Can't get 'bigInt' type from ${this.serialized}`);

    return BigInt(this.serialized);
  }

  toNumber() {
    if (Number.isNaN(this.serialized))
      throw new Error(`Can't get 'number' type from ${this.serialized}`);
    if (!this.precision) return Number(this.serialized);

    const stringifiedFloat = this.#getFloat(this.serialized);
    return Number(stringifiedFloat);
  }

  floor() {
    return this.#extractIntegerPart();
  }
  round() {
    console.log(this.debugVisualiseUint8Array(this.u8Array));
    // Taking first value after dot
    const floatingPointsBytes = Math.ceil(this.precision / 2);
    const position = this.byteLength - floatingPointsBytes;
    const mask = this.precision % 2 === 0 ? 0b1111_0000 : 0b0000_1111;
    const shift = this.precision % 2 === 0 ? 4 : 0;
    const compareValue = (this.u8Array[position] & mask) >> shift;
    console.log("CompareValue:", compareValue.toString(2).padStart(4, 0));
    const needToIncrease = compareValue >= 5;
    const integerPart = this.#extractIntegerPart();
    if (needToIncrease) {
      console.log(
        "INGEGERPART:",
        this.debugVisualiseUint8Array(integerPart, "integerPart:"),
      );
      const increasedValue = (integerPart.at(-1) & 0b0000_1111) + 1;
      console.log(increasedValue);
    }
  }
  ceil() {}

  #getFloat(insertionIndex) {
    if (this.isNegative) insertionIndex++;
    const wholeString = this.serialized;
    const boundIndex = wholeString.length - this.precision;
    const leftPart = wholeString.substring(0, boundIndex);
    const rightPart = wholeString.substring(boundIndex);
    const insertionValue = ".";
    const out = leftPart.concat(insertionValue).concat(rightPart);
    return out;
  }

  #extractIntegerPart() {
    if (!this.precision) return this.u8Array;
    const floatingPointsBytes = Math.ceil(this.precision / 2);
    const position = this.byteLength - floatingPointsBytes;
    const endIndex = this.precision % 2 === 0 ? position : position + 1;
    //      1    2     3  .   1       2     3
    // [ '0001 0010', '0011 0001', '0010 0011' ]
    // taking value elements
    const slice = this.u8Array.slice(0, endIndex);
    const needToMove = this.precision % 2 !== 0;
    //               1    2       3 . 1
    // slice be [ '0001 0010', '0011 0001' ]
    if (needToMove) {
      // Removing last 4 bits
      slice[slice.length - 1] >>= 4;
      for (let i = slice.length - 1; i > 0; i--) {
        // taking last 4 bits in prev
        const bitsToMove = slice[i - 1] & 0b1111;
        slice[i] |= bitsToMove << 4;
        slice[i - 1] >>= 4;
      }
    }

    return slice;
  }

  debugCompareDirectedAndComplemented() {
    for (let i = this.byteLength - 1; i >= 0; i--) {
      const item = this.complementedToNine[i];
      console.log("Complemented: ", item.toString(2).padStart(8, 0));
      console.log("Bcd         : ", this.u8Array[i].toString(2).padStart(8, 0));
      console.log("========================");
    }
  }

  debugVisualiseUint8Array(u8a, msg) {
    console.log(msg, u8a);
    const a = new Array(this.buff.length);
    for (let i = u8a.length - 1; i >= 0; i--) {
      const bcd = u8a[i].toString(2).padStart(8, 0);
      const l = bcd.substring(0, 4);
      const r = bcd.substring(4);
      a[i] = l.concat(" ").concat(r);
    }
    console.log(msg, a);
  }
}

// const bcd = new BCD(new BigintAdapter(-1234567890n), 1);
// console.log("Value of:", bcd.valueOf()); // Также вернет ArrayBuffer
// console.log("Buffer:", bcd.buffer);

// console.log(bcd.toString()); // '-1234567890'
// console.log(bcd.toBigInt());
// console.log(bcd.toNumber()); // -1234567890

// const stringifiedBCD = new BCD(new StringAdapter("10.42"));
// console.log(stringifiedBCD.valueOf()); // Также вернет ArrayBuffer
// console.log(stringifiedBCD.buffer);

// console.log("StringAdapter.toString():", stringifiedBCD.toString()); // '-10.42'
// console.log("StringAdapter.toBigint():", stringifiedBCD.toBigInt());
// console.log("StringAdapter.toNumber():", stringifiedBCD.toNumber()); // -10.42

// const bcdBcd = new BCD(
//   new BCDAdapter(new BCD(new BigintAdapter(-1234567890n))),
// );
// console.log("BCDAdapter.toString():", bcdBcd.toString()); // '-1234567890'
// console.log("BCDAdapter.toBigint():", bcdBcd.toBigInt());
// console.log("BCDAdapter.toNumber():", bcdBcd.toNumber()); // -1234567890

const float = new BCD(new NumberAdapter(-1234.5));

// console.log("Valueof:", float.valueOf());
// console.log("toString:", float.toString());
// console.log("Floor:", float.floor());
console.log("Round:", float.round());
console.log("GET:", float.get(-7));
