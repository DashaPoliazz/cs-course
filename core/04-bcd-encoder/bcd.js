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

      // move sum
      sum <<= shift;

      // reset carry
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

    // Reading each 4 bits of BCD and perform binary substraction
    // BCD = 0001 0010 0101 (125)
    //   1. 1001(9) - 0101(5) = 0100(4)
    //   2. 1001(9) - 0010(2) = 0111(7)
    //   3. 1001(9) - 0001(1) = 1000(8)
    // OUT = 1000(8) 0111(7) 0100(4)
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
      // Takes first grade of decimal number
      const digit = decimal % 10;
      // Adds it to the bcd
      this.bcd |= digit << shift;
      // Chops the already added first grade
      decimal = Math.floor(decimal / 10);
    }

    return this.bcd;
  }

  get(idx = 0) {
    // Calculating the amount of grades of the number
    const len = Math.floor(Math.log10(Math.abs(this.number))) + 1;
    // Calculating the 'shift'. Shift describes the offset we have
    // to apply to mask to read exactly that 4 bits we need
    const shift = (idx < 0 ? len + idx : idx) * this.#BCD_BIT_LEN;
    // Let's imagine we want read 0 idx
    //   4   3    2    1    0   -> indexes
    //   6   5    5    3    6   -> decimal
    // 0110 0101 0101 0011 0110 -> BCD
    //          &1111           -> 0101 & 1111 = 0101
    const mask = 0b1111 << shift;
    const out = (mask & this.bcd) >> shift;

    return out;
  }

  // TODO:
  // [ ] Incorrect result will be occured if 9 would stay in any grade of the number.
  add(summand1, summand2, options = { isDecimal: true }) {
    let out = 0;
    const mask = 0b1111;

    let shift = 0;
    summand1 = options.isDecimal ? new BCD(summand1).valueOf() : summand1;
    summand2 = options.isDecimal ? new BCD(summand2).valueOf() : summand2;

    // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
    // const maxLength = Math.max(
    //   summand1.toString(2).length,
    //   summand2.toString(2).length,
    // );
    // console.log("S1 = ", summand1.toString(2).padStart(maxLength, 0));
    // console.log("S2 = ", summand2.toString(2).padStart(maxLength, 0));
    // console.log("\n");
    // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS

    let carry = 0;
    while (summand1 !== 0 || summand2 !== 0 || carry !== 0) {
      let needToNormalize = false;

      // reading first bits of summands
      const bits1 = summand1 & mask;
      const bits2 = summand2 & mask;
      // adding them
      let sum = BinaryCalculator.add(bits1, bits2);
      if (sum > this.#MAX_VALID_BCD_SIZE) needToNormalize = true;

      // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
      // console.log(" bits1: ", bits1.toString(2).padStart(4, 0));
      // console.log("+bits2: ", bits2.toString(2).padStart(4, 0));
      // console.log("result: ", sum.toString(2));
      // console.log("\n");
      // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS

      // Adding carry
      sum = BinaryCalculator.add(sum, carry);
      // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
      // console.log(" sum  : ", sum.toString(2).padStart(4, 0));
      // console.log("+carry: ", carry.toString(2).padStart(4, 0));
      // console.log("result: ", sum.toString(2));
      // console.log("\n");
      // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
      carry = 0;

      // Potentially, carry could appear again
      // If the sum will be bigger or equal to 16 (10000)
      // Thus, 10000 takes 5 bits, but we can work only with 4
      // Then we need to set carry again

      if (sum > this.#CARRY_OVER_SIZE) carry = 1;

      // the sum can be made of 5bits
      // therefore we have to read first 4
      sum &= mask;

      // sum > 9 is invalid n
      // memoizing places we have to normalize later
      if (
        sum > this.#MAX_VALID_BCD_SIZE ||
        (bits1 >= this.#OVERFLOWING_FOR_TENS &&
          bits2 >= this.#OVERFLOWING_FOR_TENS) ||
        needToNormalize
      ) {
        // Creating normalizer mask. For example
        // 1001 1000 1111 0101
        //           !!!!
        //           0110 0000 -> normalizing mask has been created with 'shift'

        // trying to fix this problem manually
        // According to fact that we either have a carry or invalid num
        // we can perform +6 here

        // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
        // console.log("Invalid sum = ", sum.toString(2), "(", sum, ">", "9", ")");
        // console.log(" ", sum.toString(2).padStart(4, 0));
        // console.log("+", this.#NORMALIZER.toString(2).padStart(4, 0));
        // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS

        sum = BinaryCalculator.add(sum, this.#NORMALIZER);

        // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
        // console.log("=", sum.toString(2).padStart(4, 0));
        // console.log("\n");
        // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS

        // But carry may appear again!
        if (sum > this.#CARRY_OVER_SIZE) {
          // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
          // console.log("Invalid sum again =", sum.toString(2).padStart(4, 0));
          // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS

          carry = 1;
          sum &= mask;

          // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
          // console.log("Taking last 4 bits= ", sum.toString(2).padStart(4, 0));
          // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
        }
      }

      // Creating the mask that will be inserted into 'maybeResult'
      const resultSum = sum << shift;

      // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
      // console.log("result:", resultSum.toString(2).padStart(4, 0));
      // console.log("\n");
      // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS

      // Inserting resultSum into 'maybeResult'
      out |= resultSum;

      // moving summands for 4 bits in the right
      summand1 >>= this.#BCD_BIT_LEN;
      summand2 >>= this.#BCD_BIT_LEN;
      // moving shift for 4 bits in the right (iterating over every 4 bits)
      shift += this.#BCD_BIT_LEN;

      // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
      // console.log("===========ITERATION===========");
      // console.log("\n");
      // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
    }

    return out;
  }
  substract(subtrahend) {
    // Since substracting is a + (-b), where b is 9's complement of b,
    // it's possible to perform substraction operation via summation
    if (this.bcd === subtrahend) return 0;

    // We have to know til what grade we want to complement our number
    // We can calculate how many grades has decimal with simple formula:
    const complementGrade = Math.floor(Math.log10(Math.abs(this.number))) + 1;
    const ninesComplementOfSubtrahend = new BCD(subtrahend).complementToNine(
      complementGrade,
    );

    // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
    // console.log("MINUEND   :", this.bcd.toString(2));
    // console.log("SUBTRAHEND:", new BCD(subtrahend).valueOf().toString(2));
    // console.log("GRADES    :", complementGrade);
    // console.log("COMPLEMENT:", ninesComplementOfSubtrahend.toString(2));
    // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS

    const sum = this.add(this.bcd, ninesComplementOfSubtrahend, {
      isDecimal: false,
    });

    // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS
    // console.log("SUM OF BCD AND COMPLEMENT = ", sum.toString(2));
    // UNCOMMENT THIS CODE TO VISUALISE THE ADDING PROCESS

    // Problem:
    // In case of overflowing to elder 4 bits we have to carry bit
    // and add it to the start of number instead of just adding additional
    // 4 bits!
    //
    // Let's consider case (305 + 831);
    //   0011 0000 0101
    // + 1000 0011 0001
    //  ----------------
    // 1 0001 0011 0110
    // . <- this bit is extra. We have to add it to the first group
    // of 4 bits (0110) instead of writing it to the end.
    // Perhaps it's logic valid only for subtracting because it has been
    // took of the substracting example.

    // We need to understand if the overflowing is exists
    let substractionResult = sum;
    let significantBit = 0;
    while (substractionResult !== 0) {
      const currentBits = substractionResult & 0b1111;
      significantBit = currentBits;
      substractionResult >>= this.#BCD_BIT_LEN;
    }

    if (significantBit === 1) {
      // Creating number without leading bit
      // 1 0001 0011 0110 -> 0001 0011 0110
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
