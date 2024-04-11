const getTypedArrayFromCode = (code) => {
  switch (code) {
    case 1:
      return Uint8Array;
    case 2:
      return Uint8ClampedArray;
    case 3:
      return Int8Array;
    case 4:
      return Uint16Array;
    case 5:
      return Int16Array;
    case 6:
      return Uint32Array;
    case 7:
      return Int32Array;
    case 8:
      return Float32Array;
    case 9:
      return Float64Array;
    case 10:
      return BigInt64Array;
    case 11:
      return BigUint64Array;
    default:
      throw new Error("Unsupported TypedArray code");
  }
};

module.exports = getTypedArrayFromCode;
