class Matrix {
  constructor(TypedArray, ...dimensions) {}
}

const buffer = new ArrayBuffer(1);
const u8 = new Uint8Array(buffer);
const view = new DataView(buffer, 0, 1);
view.setInt8(0, 255);
console.log(u8);
new BigInt64Array(4);
