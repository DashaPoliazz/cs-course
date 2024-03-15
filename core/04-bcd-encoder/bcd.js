"use strict";

// [] Create BCD encoder
// [] Add negative number support
// [] Add ability to perform math operation
// 	[]  - "+"
// 	[]  - "-"
//  []  - "*"
//  []  - "/"

class BCD {
  #BIN_PREFIX = "0b";
  #BCD_BIT_LEN = 4;

  #numbers;

  constructor(number) {
    this.#numbers = [];
    this.number = number;
    this.bcd = 0;
  }

  // decimal = 65536
  // returns 0b01100101010100110110 или 415030
  valueOf() {
    let decimal = this.number;

    for (let shift = 0; decimal > 0; shift += this.#BCD_BIT_LEN) {
      const digit = decimal % 10;
      const binDigit = digit.toString(2).padStart(4, 0);
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

  add(summand) {}

  substract(minuend) {}

  multiply(multiplier) {}

  divide(divisor) {}
}

const n = new BCD(65536);
console.log(n.valueOf()); // 0b01100101010100110110 или 415030

console.log(n.get(0)); // 6
console.log(n.get(1)); // 3

console.log(n.get(-1)); // 6
console.log(n.get(-2)); // 5
console.log(n.get(-3)); // 5
console.log(n.get(-4)); // 3
