class Struct {
  constructor(scheme) {}

  static get U8() {
    return [8, Uint8Array];
  }
  static get I8() {
    return [8, Int8Array];
  }

  static get U16() {
    return [16, Uint16Array];
  }
  static get I16() {
    return [16, Int16Array];
  }

  static get U32() {
    return [32, Uint32Array];
  }
  static get I32() {
    return [32, Int32Array];
  }

  static get U64() {
    return [64, BigUint64Array];
  }
  static get I64() {
    return [64, BigInt64Array];
  }

  static get F32() {
    return [32, Float32Array];
  }

  static get F64() {
    return [64, Float64Array];
  }

  static get F64() {
    return 64;
  }
  static String(encoding) {
    switch (encoding) {
      case "ASCII":
        8;
      default:
        throw new Error(`Unsupported string encoding ${encoding}`);
    }
  }
}

module.exports = Struct;
