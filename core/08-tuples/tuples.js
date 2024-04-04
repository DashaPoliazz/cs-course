const Struct = require("../08-structures/structures.js");

const correctTypes = {
  8: 8,
  16: 16,
  32: 32,
  64: 64,
};

const getGetSetForDataView = (dataView, typedArray) => {
  switch (typedArray) {
    case Int8Array:
      return [dataView.getInt8, dataView.setInt8];
    case Uint8Array:
      return [dataView.getUint8, dataView.setUint8];
    case Uint8ClampedArray:
      return [dataView.getUint8, dataView.setUint8];
    case Int16Array:
      return [dataView.getInt16, dataView.setInt16];
    case Uint16Array:
      return [dataView.getUint16, dataView.setUint16];
    case Int32Array:
      return [dataView.getInt32, dataView.setInt32];
    case Uint32Array:
      return [dataView.getUint32, dataView.setUint32];
    case Float32Array:
      return [dataView.getFloat32, dataView.setFloat32];
    case Float64Array:
      return [dataView.getFloat64, dataView.setFloat64];
    case BigInt64Array:
      return [dataView.getBigInt64, dataView.setBigInt64];
    case BigUint64Array:
      return [dataView.getBigUint64, dataView.setBigUint64];
    default:
      throw new Error("Unsupported TypedArray type");
  }
};

class Tuple {
  constructor(...types) {
    this.types = types;
    this.byteLength = 0;
    this.offsets = new Map();
    this.created = false;

    this.byteLength = this.#calcMemory(types, []);
    this.buffer = new ArrayBuffer(this.byteLength);
  }

  #calcMemory(types, keys, externalOffset = 0) {
    let offset = externalOffset;

    for (let i = 0; i < types.length; i++) {
      const currentKey = [...keys, i];

      const isTupleType = Array.isArray(types[i]);
      let type = isTupleType ? types[i][0] : types[i];

      const isNumber = typeof type === "number";
      if (isNumber) {
        const validNumber = correctTypes[type];
        if (!validNumber) throw new Error(`Invalid number type ${type}`);
        const TypedArray = types[i][1];
        this.offsets.set(currentKey.join("-"), [offset, TypedArray]);
        offset += type / 8;
      }

      const isTuple = type instanceof Tuple;
      const isStruct = type instanceof Struct;
      if (isTuple || isStruct) {
        const nestedOffset = this.#calcMemory(type.types, currentKey, offset);
        offset = Math.max(offset, nestedOffset);
      }
    }

    return offset;
  }

  create(...values) {
    if (this.created) return;

    const setValuesRecursively = (values, key = []) => {
      for (let i = 0; i < values.length; i++) {
        const currentKey = [...key, i];
        const value = values[i];
        const isTuple = Array.isArray(value);

        if (isTuple) setValuesRecursively(value, currentKey);
        else {
          const key = currentKey.join("-");
          const [offset, TypedArray] = this.offsets.get(key);
          const dataView = new DataView(this.buffer, offset);
          const [get, set] = getGetSetForDataView(dataView, TypedArray);
          set.call(dataView, 0, value, false);
          this.offsets.set(key, [get.bind(dataView), set.bind(dataView)]);
        }
      }
    };

    setValuesRecursively(values);
    this.created = true;

    return this;
  }

  get(...indexes) {
    const path = indexes.join("-");
    const dataViewFunctions = this.offsets.get(path);
    if (!dataViewFunctions) return null;
    const [get] = dataViewFunctions;
    return get();
  }
}

const t1 = new Tuple(Struct.U8, Struct.U8, Struct.U8);
const t2 = new Tuple(Struct.U32, t1);
const t3 = new Tuple(Struct.U16, Struct.U16, t2);

console.log(t3.byteLength);
console.log(t3.offsets);

const r = t3.create(1, 2, [3, [4, 5, 6]]);
console.log(r.buffer);
console.log(r.offsets);

console.log(r.get(2, 1, 2));
