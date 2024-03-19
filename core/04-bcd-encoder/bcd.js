"use strict";

class BinaryCalculator {
  static add(addend1, addend2) {
    let result = 0;
    const mask = 1;
    let carry = 0;
    let shift = 0;

    while (addend1 !== 0 || addend2 !== 0 || carry !== 0) {
      const bit1 = addend1 & mask;
      const bit2 = addend2 & mask;

      let sum = bit1 ^ bit2 ^ carry;

      // move sum
      sum <<= shift;

      // reset carry
      carry = (bit1 & bit2) | (bit1 & carry) | (bit2 & carry);

      if (bit1 & bit2) carry |= 1;

      addend1 >>>= 1;
      addend2 >>>= 1;
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
  #BIN_PREFIX = "0b";
  #BCD_BIT_LEN = 4;
  #CARRY_OVER_SIZE = 15;
  #MAX_VALID_BCD_SIZE = 9;
  #NORMALIZER = 0b0110;

  #numbers;
  #idx = 7;

  constructor(number) {
    this.#numbers = new Array(8);

    this.number = number;
    this.bcd = 0;

    this.valueOf();
  }

  complementToNine() {
    let result = 0;
    const mask = 0b1111;
    const nineMask = 0b1001;
    let n = this.bcd;

    for (let shift = 0; n !== 0; shift += this.#BCD_BIT_LEN, n >>>= 4) {
      const bits = n & mask;
      let complement = BinaryCalculator.subtract(nineMask, bits);
      // console.log(`${nineMask} - ${bits}`);
      // console.log(`${nineMask.toString(2)}`);
      // console.log(`${bits.toString(2).padStart(4, 0)}`);
      // console.log("===========");
      // console.log(`${complement.toString(2)}`);
      complement <<= shift;
      result |= complement;
    }

    console.log("9's COMPLEMENT:", result.toString(2));

    return result;
  }

  // decimal = 65536
  // returns 0b01100101010100110110 или 415030
  valueOf() {
    let decimal = this.number;

    let shift = 0;
    for (; decimal > 0; shift += this.#BCD_BIT_LEN) {
      const digit = decimal % 10;
      const binDigit = digit.toString(2).padStart(4, 0);
      this.#numbers[this.#idx] = binDigit;
      this.bcd |= parseInt(binDigit, 2) << shift;
      decimal = Math.floor(decimal / 10);
    }

    return this.bcd;
  }

  // decimal = 65536
  // idx = 0 =>    6
  // idx = 1 =>   3
  // idx = 2 =>  5
  // idx= -1 =>6
  // idx= 02 => 5
  get(idx) {
    // It's possible to calc amount of nums in number with
    // bit operation
    const len = this.number.toString().length;
    const shift = (idx < 0 ? len + idx : idx) * this.#BCD_BIT_LEN;
    const readMask = 0b1111 << shift;
    const result = (readMask & this.bcd) >> shift;

    return result;
  }

  // TODO:
  // [ ] Incorrect result will be occured if 9 would stay in any grade of the number.
  add(summand) {
    let invalidPlaces = 0;
    let maybeResult = 0;

    const mask = 0b1111;

    let shift = 0;
    let summand1 = this.bcd;
    let summand2 = new BCD(summand).valueOf();
    // DEBUG
    const maxLength = Math.max(
      summand1.toString(2).length,
      summand2.toString(2).length,
    );
    console.log("S1 = ", summand1.toString(2).padStart(maxLength, 0));
    console.log("S2 = ", summand2.toString(2).padStart(maxLength, 0));
    // DEBUG
    let carry = 0;
    while (summand1 !== 0 || summand2 !== 0 || carry !== 0) {
      // base case:
      // 1. Both summands are 0, then carry is 1
      // if (summand1 === 0 && summand2 === 0) {
      //   // We have 'cycle' adding 'carry' until it become 0.
      //   // But first of all let's move shift in the start
      //   // to perform all the operations below from the start
      //   shift = 0;
      // }

      // reading first bits of summands
      const bits1 = summand1 & mask;
      const bits2 = summand2 & mask;
      // adding them
      let sum = BinaryCalculator.add(bits1, bits2);
      console.log("SUM BEFORE ADDING CARRY:", sum.toString(2));
      // adding carry
      sum = BinaryCalculator.add(sum, carry);
      console.log("SUM AFTER ADDING CARRY:", sum.toString(2));
      carry = 0;
      // setting 'carry' if appears
      if (sum > this.#CARRY_OVER_SIZE) {
        carry = 1;
        console.log("CARRY BVLOCK");
      }
      // the sum can be made of 5bits
      // therefore we have to read first 4
      sum &= mask;
      // sum > 9 is invalid n
      // memoizing places we have to normalize later
      if (sum > this.#MAX_VALID_BCD_SIZE) {
        // Creating normalizer mask. For example
        // 1001 1000 1111 0101
        //           !!!!
        //           0110 0000 -> normalizing mask has been created with 'shift'
        const invalidPlace = this.#NORMALIZER << shift;
        // Inserting invalid place into 'invalidPlaces'
        invalidPlaces |= invalidPlace;

        // trying to fix this problem manually
        // According to fact that we either have a carry or invalid num
        // we can perform +6 here
        console.log("before normalizing", sum.toString(2));
        sum = BinaryCalculator.add(sum, this.#NORMALIZER);
        console.log("AFTER normalizing:", sum.toString(2));
        if (sum > this.#CARRY_OVER_SIZE) {
          carry = 1;
          sum &= mask;
          console.log("NORMALIZED SUM:", sum.toString(2));
        }
      }

      // Creating the mask that will be inserted into 'maybeResult'
      const resultSum = sum << shift;
      console.log("REULTSUM:", resultSum.toString(2).padStart(4, 0));
      // Inserting resultSum into 'maybeResult'
      maybeResult |= resultSum;

      console.log(`S1 = ${bits1.toString(2).padStart(4, 0)} / ${bits1}`);
      console.log(`S2 = ${bits2.toString(2).padStart(4, 0)} / ${bits2}`);
      console.log(`SUMM ${sum.toString(2).padStart(0, 3)} / ${sum}`);

      // moving summands for 4 bits in the right
      summand1 >>= this.#BCD_BIT_LEN;
      summand2 >>= this.#BCD_BIT_LEN;
      // moving shift for 4 bits in the right (iterating over every 4 bits)
      shift += this.#BCD_BIT_LEN;

      console.log("===========ITERATION===========");
    }

    console.log(`PLACES TO FIX: ${invalidPlaces.toString(2)}`);
    console.log(`MAYBERESULT: ${maybeResult.toString(2)}`);

    // now we have to fix invalid places in 'maybeResult
    return maybeResult;
  }

  // Substraction can be performed by addition with signed value
  substract(minuend) {
    // Perform nine's complement to the minuend
    console.log("CURRENT BCD:", this.bcd.toString(2));

    // TODO:
    // We have built-in nine's complement
    // but it doesn't work correctly with built-in because
    // of transoformation of summand inside "this.add"

    // adding decimal (nine's complement) becuase add supports decimals
    // TODO:
    // [ ] HARDCODED 999
    const sum = this.add(999 - minuend);

    console.log("SDIFOPSIDFPOISDOPFISDF", sum.toString(2));

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
    let significatnBits = 0;
    while (substractionResult !== 0) {
      const currentBits = substractionResult & 0b1111;
      significatnBits = currentBits;
      substractionResult >>= this.#BCD_BIT_LEN;
    }

    if (significatnBits === 1) {
      // Creating number without leading bit
      // 1 0001 0011 0110 -> 0001 0011 0110
      let mask = 1 << Math.floor(Math.log2(sum));
      const withoutSignificantBit = sum & ~mask;

      this.bcd = withoutSignificantBit;
      const substractionResult = this.add(1);
      return substractionResult;
    }

    return sum;
  }

  multiply(multiplier) {
    if (multiplier === 0 && this.bcd === 0) return 1;
    if (multiplier === 0) return 0;
    if (multiplier === 1) return this.bcd;

    for (let i = 0; i < multiplier - 1; i++) {
      const sum = this.add(this.number);
      this.bcd = sum;
    }

    return this.bcd;
  }

  divide(divisor) {
    if (divisor === 1) return this.bcd;
    if (divisor === 0) throw new Error("Cannot divide by zero");

    let quotient = 0;

    while (this.number >= divisor) {
      this.bcd = this.substract(divisor);
      this.number -= divisor;
      quotient++;
    }

    const divisionResult = new BCD(quotient).valueOf();

    return divisionResult;
  }
}
