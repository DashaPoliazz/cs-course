const getTypedArrayCode = (typedArray) => {
  switch (typedArray) {
    case Uint8Array:
      return 1;
    case Uint8ClampedArray:
      return 2;
    case Int8Array:
      return 3;
    case Uint16Array:
      return 4;
    case Int16Array:
      return 5;
    case Uint32Array:
      return 6;
    case Int32Array:
      return 7;
    case Float32Array:
      return 8;
    case Float64Array:
      return 9;
    case BigInt64Array:
      return 10;
    case BigUint64Array:
      return 11;
    default:
      throw new Error("Unsupported TypedArray");
  }
};

module.exports = getTypedArrayCode;
