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

module.exports = BinaryCalculator;
