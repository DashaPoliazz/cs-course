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
  #BCD_BIT_LEN = 4;
  #CARRY_OVER_SIZE = 15;
  #MAX_VALID_BCD_SIZE = 9;
  #NORMALIZER = 0b0110;
  #NINE_MASK = 0b1001;
  #OVERFLOWING_FOR_TENS = 8;

  constructor(number) {
    this.number = number;
    this.bcd = 0;

    this.valueOf();
  }

  complementToNine(complementGrade) {
    const mask = 0b1111;
    let bcd = this.bcd;
    let out = 0;

    for (
      let shift = 0;
      complementGrade > 0;
      shift += this.#BCD_BIT_LEN, bcd >>>= 4, complementGrade--
    ) {
      const bits = bcd & mask;
      let substraction = BinaryCalculator.subtract(this.#NINE_MASK, bits);
      substraction <<= shift;
      out |= substraction;
    }

    return out;
  }

  valueOf() {
    let decimal = this.number;

    for (let shift = 0; decimal > 0; shift += this.#BCD_BIT_LEN) {
      const digit = decimal % 10;
      this.bcd |= digit << shift;
      decimal = Math.floor(decimal / 10);
    }

    return this.bcd;
  }

  get(idx = 0) {
    const len = Math.floor(Math.log10(Math.abs(this.number))) + 1;
    const shift = (idx < 0 ? len + idx : idx) * this.#BCD_BIT_LEN;
    const mask = 0b1111 << shift;
    const out = (mask & this.bcd) >> shift;

    return out;
  }

  add(summand1, summand2, options = { isDecimal: true }) {
    let out = 0;
    const mask = 0b1111;

    let shift = 0;
    summand1 = options.isDecimal ? new BCD(summand1).valueOf() : summand1;
    summand2 = options.isDecimal ? new BCD(summand2).valueOf() : summand2;

    let carry = 0;
    while (summand1 !== 0 || summand2 !== 0 || carry !== 0) {
      let needToNormalize = false;

      const bits1 = summand1 & mask;
      const bits2 = summand2 & mask;

      let sum = BinaryCalculator.add(bits1, bits2);
      if (sum > this.#MAX_VALID_BCD_SIZE) needToNormalize = true;

      sum = BinaryCalculator.add(sum, carry);
      carry = 0;

      if (sum > this.#CARRY_OVER_SIZE) carry = 1;

      sum &= mask;

      if (
        sum > this.#MAX_VALID_BCD_SIZE ||
        (bits1 >= this.#OVERFLOWING_FOR_TENS &&
          bits2 >= this.#OVERFLOWING_FOR_TENS) ||
        needToNormalize
      ) {
        sum = BinaryCalculator.add(sum, this.#NORMALIZER);

        if (sum > this.#CARRY_OVER_SIZE) {
          carry = 1;
          sum &= mask;
        }
      }

      const resultSum = sum << shift;

      out |= resultSum;

      summand1 >>= this.#BCD_BIT_LEN;
      summand2 >>= this.#BCD_BIT_LEN;
      shift += this.#BCD_BIT_LEN;
    }

    return out;
  }
  substract(subtrahend) {
    if (this.bcd === subtrahend) return 0;

    const complementGrade = Math.floor(Math.log10(Math.abs(this.number))) + 1;
    const ninesComplementOfSubtrahend = new BCD(subtrahend).complementToNine(
      complementGrade,
    );

    const sum = this.add(this.bcd, ninesComplementOfSubtrahend, {
      isDecimal: false,
    });

    let substractionResult = sum;
    let significantBit = 0;
    while (substractionResult !== 0) {
      const currentBits = substractionResult & 0b1111;
      significantBit = currentBits;
      substractionResult >>= this.#BCD_BIT_LEN;
    }

    if (significantBit === 1) {
      let mask = 1 << Math.floor(Math.log2(sum));
      const withoutSignificantBit = sum & ~mask;

      this.bcd = withoutSignificantBit;
      const substractionResult = this.add(withoutSignificantBit, 1, {
        isDecimal: false,
      });

      return substractionResult;
    }

    return sum;
  }

  multiply(multiplier) {
    if (multiplier === 0 && this.bcd === 0) return 1;
    if (multiplier === 0) return 0;
    if (multiplier === 1) return this.bcd;

    let product = 0;
    while (multiplier > 0) {
      product = new BCD().add(product, this.bcd, {
        isDecimal: false,
      });
      multiplier--;
    }

    return product;
  }

  divide(divisor) {
    if (divisor > this.number) throw new Error("Unsupported operation :(");
    if (divisor === 1) return this.bcd;
    if (divisor === 0) throw new Error("Cannot divide by zero");

    let count = this.number;
    let quotient = 0;

    while (count > 0) {
      this.bcd = this.substract(divisor);
      quotient++;
      count -= divisor;
    }

    return new BCD(quotient).valueOf();
  }
}

// Usage:
const n1 = new BCD(65536);

console.log(n1.valueOf()); // 0b01100101010100110110 или 415030
console.log(n1.get(0)); // 6
console.log(n1.get(1)); // 3
console.log(n1.get(-1)); // 6
console.log(n1.get(-2)); // 5
console.log("NINES COMLEMENT", n1.complementToNine(5).toString(2));
console.log("\n");

const n2 = new BCD(678);
console.log(n2.valueOf().toString(2)); // 0110 0111 1000

// 9999999 + 9999999 = 19 999 998
// 1  9    9    9    9    9    9   8
// 1 1001 1001 1001 1001 1001 1001 1000
console.log("ADDITION", new BCD().add(9999999, 9999999).toString(2));
// 1234567 + 7654321 = 8 8 8 8 8 8 8
//   8   8    8    8    8    8    8
// 1000 1000 1000 1000 1000 1000 1000
console.log("ADDITION", new BCD().add(1234567, 7654321).toString(2)); // 1000 1000 1000 1000 1000 1000 1000

console.log("SUBTRACTION", n2.substract(67).toString(2)); // 110 0001 0001 (6 1 1)

const n3 = new BCD(123456789);
// 123456789 * 2 = 246 913 578
//  4    6    9   1    3    5    7    8
// 100 0110 1001 0001 0011 0101 0111 1000
// Bug -> lack of 2 (0010) in the start
console.log("MULTIPLICATION 1", n3.multiply(2).toString(2)); // 100 0110 1001 0001 0011 0101 0111 1000

const n4 = new BCD(2);
console.log("MULTIPLICATION 2", n4.multiply(2).toString(2)); // 100   (4)
console.log("MULTIPLICATION 3", n4.multiply(4).toString(2)); // 1000  (8)
console.log("MULTIPLICATION 4", n4.multiply(6).toString(2)); // 10010 (12)

const n5 = new BCD(999);
console.log("DIVISION 1", n5.divide(111).toString(2)); // 1001 (9)
console.log("DIVISION 2", n5.divide(999).toString(2)); // 1    (1)
console.log("DIVISION 3", n5.divide(333).toString(2)); // 11   (3)
