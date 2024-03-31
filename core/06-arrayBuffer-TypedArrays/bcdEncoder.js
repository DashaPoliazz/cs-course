"use strict";

const BinaryCalculator = require("./binaryCalculator.js");
const {
  Adapter,
  NumberAdapter,
  BigintAdapter,
  StringAdapter,
} = require("./adapters/adapters.js");

class BCD {
  BCD_BITS_SIZE = 4;
  NINE_MASK = 0b1001;
  LAST_VALID_BCD = 0b1001;
  NORMALIZE_VALUE = 0b0110;
  BIGGEST_FOUR_BIT_VALUE = 0b1111;
  OVERFLOWING_FOR_TENS = 0b1000;

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

  // summand should be typeof 'number'
  // summand could be float number
  // summand is a instance of Adapter
  add(summand) {
    if (!(summand instanceof Adapter))
      throw new Error(
        "Adapted entity should be instanced from 'Adapter' class",
      );

    const [s1, s2] = this.#alignedSummands(this, summand);
    let result = "";

    let i = s1.length - 1;
    let carry = 0;

    while (i >= 0 || carry) {
      const n1 = Number(s1[i]);
      const n2 = Number(s2[i]);

      console.log(`n1 = ${n1} n2 = ${n2}`);
      let sum = BinaryCalculator.add(n1, n2);
      console.log("sum:", sum.toString(2));
      console.log("carry:", carry);
      if (carry) {
        sum = BinaryCalculator.add(sum, 1);
        console.log("after carry block:", sum.toString());
        carry = 0;
      }
      const overflow = (sum & 0b10000) >> this.BCD_BITS_SIZE;
      console.log("overflow:", overflow);
      // Taking last 4 bits
      sum &= 0b1111;
      console.log("take 4 bits:", sum.toString(2));
      const needToNormalize = sum > this.LAST_VALID_BCD;
      const sixteenBound = n1 >= 0b1000 && n2 >= 0b1000;
      if (needToNormalize || sixteenBound) {
        console.log("need to normalize block");
        sum = BinaryCalculator.add(sum, this.NORMALIZE_VALUE);
        console.log("sum after normalizastion:", sum);
        carry = ((sum & 0b10000) >> this.BCD_BITS_SIZE) | overflow;
        sum &= 0b1111;
        console.log("carry after normalization:", carry);
      }

      carry |= overflow;
      result = sum.toString().concat(result);

      i--;
    }

    return result;
  }

  #alignedSummands(s1, s2) {
    // s1 = "123.456"
    // s2 = "1.23456"
    // normalizedS1 = "123.45600"
    // normalizedS2 = "001.23456"
    let [intPartS1, floatPartS1] = s1.integerAndFloatParts;
    let [intPartS2, floatPartS2] = s2.integerAndFloatParts;
    intPartS1 = intPartS1[0] === "-" ? intPartS1.substring(1) : intPartS1;
    intPartS2 = intPartS2[0] === "-" ? intPartS2.substring(1) : intPartS2;
    const maxIntPart = Math.max(intPartS1.length, intPartS2.length);
    const maxFloatPart = Math.max(floatPartS1.length, floatPartS2.length);
    const alignedS1 = intPartS1
      .padStart(maxIntPart, 0)
      .concat(floatPartS1.padEnd(maxFloatPart, 0));
    const alignedS2 = intPartS2
      .padStart(maxIntPart, 0)
      .concat(floatPartS2.padEnd(maxFloatPart, 0));
    const out = [alignedS1, alignedS2];
    console.log("===ALIGNED PARTS===");
    console.log(alignedS1);
    console.log(alignedS2);
    console.log("===ALIGNED PARTS===");
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
// console.log("Round:", float.round());
// console.log("GET:", float.get(-7));

console.log("Add:", float.add(new NumberAdapter(3)));

// {
// const bcd = new BCD(new BigintAdapter(123n));
// console.log("BigintAdapter:", bcd.initialEntity);
// }

{
  // Integer and float parts:
  const bcd1 = new BCD(new BigintAdapter(12345n));
  console.log("BigInt and float parts:", bcd1.integerAndFloatParts);

  const bcd2 = new BCD(new NumberAdapter(12345));
  console.log("Number integer and float parts:", bcd2.integerAndFloatParts);

  const bcd3 = new BCD(new NumberAdapter(-12345));
  console.log(
    "Negative number integer and float parts:",
    bcd3.integerAndFloatParts,
  );

  const bcd4 = new BCD(new NumberAdapter(12345.6789));
  console.log("Float number and float parts:", bcd4.integerAndFloatParts);

  const bcd5 = new BCD(new StringAdapter("12345"));
  console.log("String and float parts:", bcd5.integerAndFloatParts);

  const bcd6 = new BCD(new StringAdapter("12345.6789"));
  console.log("String and float parts:", bcd6.integerAndFloatParts);
}

{
  // Add
  // Numbers:
  const bcd1 = new BCD(new NumberAdapter(123456789));
  console.log("Number + Number", bcd1.add(new NumberAdapter(987654321)));

  const bcd2 = new BCD(new NumberAdapter(2));
  console.log("Number + Number", bcd2.add(new NumberAdapter(3)));

  const bcd3 = new BCD(new NumberAdapter(9999_9999));
  console.log("Number + Number", bcd3.add(new NumberAdapter(9999_9999)));

  const bcd4 = new BCD(new NumberAdapter(123.9987));
  console.log("Number + Number", bcd4.add(new NumberAdapter(99.9)));
}
