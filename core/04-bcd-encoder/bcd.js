// [] Create BCD encoder
// [] Add negative number support
// [] Add ability to perform math operation
// 	[]  - "+"
// 	[]  - "-"
//  []  - "*"
//  []  - "/"

class BCD {
  #numbers;

  constructor(number) {
    this.decimal = number;
  }

  // decimal = 65536
  // returns 0b01100101010100110110 или 415030
  valueOf() {
    // each n takes 8 bits, but each n in BCD - 4
    const stringifiedDecimal = this.decimal.toString();
    let bcd = "";
    for (let i = stringifiedDecimal.length - 1; i >= 0; i--) {
      const n = Number(stringifiedDecimal[i]);
      const binaryRepresentation = n.toString(2).padStart(4, 0);
      bcd = binaryRepresentation.concat(bcd);
    }
    bcd = "0b".concat(bcd);
    return Number(bcd);
  }

  // decimal = 65536
  // idx = 0 =>    6
  // idx = 1 =>   3
  // idx = 2 =>  5
  // idx= -1 =>6
  // idx= 02 => 5
  get(idx) {
    const stringifiedDecimal = this.decimal.toString();
    const littleEndianIndex = stringifiedDecimal.length - 1 - idx;
    const negativeLittleEndianIndex = Math.abs(idx) - 1;
    const normalizedIndex =
      idx < 0 ? negativeLittleEndianIndex : littleEndianIndex;
    console.log("IDX", normalizedIndex);
    return stringifiedDecimal[normalizedIndex];
  }
}

const n = new BCD(65536);
console.log(n.valueOf()); // 0b01100101010100110110 или 415030

console.log(n.get(0)); // 6
console.log(n.get(1)); // 3

console.log(n.get(-1)); // 6
console.log(n.get(-2)); // 5
