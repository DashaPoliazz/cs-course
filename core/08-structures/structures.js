const allowedSizes = {
  8: 8,
  16: 16,
  32: 32,
  64: 64,
};

const isArrayTypedArray = (entity) => {
  return (
    entity instanceof Int8Array ||
    entity instanceof Uint8Array ||
    entity instanceof Uint8ClampedArray ||
    entity instanceof Int16Array ||
    entity instanceof Uint16Array ||
    entity instanceof Int32Array ||
    entity instanceof Uint32Array ||
    entity instanceof Float32Array ||
    entity instanceof Float64Array ||
    entity instanceof BigInt64Array ||
    entity instanceof BigUint64Array
  );
};

const getGetSetForDataView = (typedArray, dataView) => {
  if (!typedArray) throw new Error("Data view is not initialized.");
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

class AbstractDataType {
  byteLength;
  markup;

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

  static String(encoding, length) {
    if (!length) throw new Error("Only static strings is supported");

    switch (encoding) {
      case "ASCII": {
        const [byteLength, TypedArray] = Struct.U8;
        const encodeDecode = {
          encode: (s) => [...s].map((c) => c.charCodeAt(0)),
          decode: (c) => c.map((c) => String.fromCharCode(c)),
        };
        return [byteLength * length, TypedArray, encodeDecode];
      }
      default:
        throw new Error(`Unsupported string encoding ${encoding}`);
    }
  }

  createMarkup() {
    const markup = {};
    const shape = this.shape;
    let byteLength = 0;
    let offset = 0;

    const buildMarkup = (shape, keys = []) => {
      for (const [k, v] of Object.entries(shape)) {
        const key = [...keys, k];
        const joinedKey = key.join("-");

        const isShape = !Array.isArray(v);
        if (isShape) {
          buildMarkup(v, key);
          continue;
        }

        markup[joinedKey] = {
          byteOffset: offset,
          TypedArray: v[1],
          byteLength: v[1].BYTES_PER_ELEMENT,
        };

        const encodeDecode = v[2];
        if (encodeDecode) markup[joinedKey].encodeDecode = encodeDecode;

        offset += v[0] / 8;

        byteLength = Math.max(byteLength, offset);
      }
    };

    buildMarkup(shape);

    this.byteLength = byteLength;
    this.markup = markup;
  }

  initGetSet() {
    Object.entries(this.markup).forEach(([k, v]) => {
      const { TypedArray, encodeDecode, byteLength } = v;
      const getset = getGetSetForDataView(TypedArray, this.dataView);
      const contextifiedGetSet = getset.map((f) => f.bind(this.dataView));

      this.markup[k] = {
        byteOffset: v.byteOffset,
        getset: contextifiedGetSet,
        byteLength,
      };

      if (encodeDecode) this.markup[k].encodeDecode = encodeDecode;
    });
  }

  create(...values) {
    this.lazyInit();

    const plainValues = ((arr) => {
      const getPlainValues = (arr) => {
        return arr.flatMap((item) => {
          if (Array.isArray(item)) {
            return getPlainValues(item);
          } else if (typeof item === "object" && item !== null) {
            return getPlainValues(Object.values(item));
          } else {
            return item;
          }
        });
      };

      return getPlainValues(arr);
    })(values);

    const availableSlots = Object.entries(this.markup);
    const valuesToInsert = plainValues.length;
    if (availableSlots.length !== valuesToInsert)
      throw new Error("Not all values entered");

    let plainValuesIndex = 0;
    for (const [_, v] of availableSlots) {
      const { byteOffset, getset, encodeDecode, byteLength } = v;

      const [get, set] = getset;
      const valueToInsert = plainValues[plainValuesIndex];
      if (encodeDecode) {
        const { encode } = encodeDecode;
        const chars = encode(valueToInsert);
        let offset = byteOffset;
        chars.forEach((char, idx) => {
          console.log(char);
          set(offset, char);
          offset += byteLength;
        });
        plainValuesIndex++;
        continue;
      }
      set(byteOffset, valueToInsert);
      plainValuesIndex++;
    }
  }

  buildShape() {
    throw new Error("not implemented");
  }

  static createScheme() {
    throw new Error("not implemented");
  }
}

class Tuple extends AbstractDataType {
  constructor(...types) {
    super();
    this.types = types;
    this.shape = {};
  }

  lazyInit() {
    this.buildShape();
    this.createMarkup();
    this.buffer = new ArrayBuffer(this.byteLength);
    this.dataView = new DataView(this.buffer);
    this.initGetSet();
  }

  buildShape() {
    this.shape = Tuple.getShape(this.types);
  }

  static getShape(types) {
    const shape = {};

    const getShape = (types) => {
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        const isStruct = Struct.isStruct(type);
        if (isStruct) shape[i] = Struct.getShape(type.scheme);
        else shape[i] = type;
      }
    };

    getShape(types);

    return shape;
  }

  static isTuple(entity) {
    return entity instanceof Tuple;
  }
}

class Struct extends AbstractDataType {
  constructor(scheme) {
    super();
    this.scheme = scheme;
    this.shape = {};
  }

  lazyInit() {
    this.buildShape();
    this.createMarkup();
    this.buffer = new ArrayBuffer(this.byteLength);
    this.dataView = new DataView(this.buffer);
    this.initGetSet();
  }

  buildShape() {
    this.shape = Struct.getShape(this.scheme);
  }

  static getShape(scheme) {
    const result = {};

    const getShape = (scheme) => {
      for (const [k, v] of Object.entries(scheme)) {
        const isTuple = Tuple.isTuple(v);
        if (isTuple) result[k] = Tuple.getShape(v.types);
        else result[k] = v;
      }
    };

    getShape(scheme);

    return result;
  }

  static isStruct(entity) {
    return entity instanceof Struct;
  }
}

{
  const Color = new Tuple(
    Struct.U8,
    Struct.U16,
    Struct.U32,
    new Struct({
      firstName: Struct.String("ASCII", 4),
      color: new Tuple(Struct.U64, Struct.U32, Struct.U16),
      address: new Tuple(Struct.U8, Struct.U8),
    }),
  );

  Color.create([
    8,
    16,
    32,
    {
      firstName: "name",
      color: [64n, 32, 16],
      address: [8, 8],
    },
  ]);

  console.log("Instance before changes:", Color.markup);
  console.log(Color.buffer);
}

console.log("\n");

// {
//   const Person = new Struct({
//     firstName: Struct.String("ASCII", 4),
//     color: new Tuple(
//       Struct.U64,
//       new Struct({
//         address: new Tuple(Struct.U16),
//       }),
//       Struct.U16,
//     ),
//   });

//   Person.create({
//     firstName: "Name",
//     color: [
//       64n,
//       {
//         address: [1],
//       },
//       1,
//     ],
//   });

//   console.log(Person.markup);
//   console.log(Person.buffer);
// }
