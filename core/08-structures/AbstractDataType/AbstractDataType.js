class AbstractDataType {
  byteLength;
  markup;

  constructor() {}
  // TODO:
  // [ ] Support custom bit size format
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
        const [byteLength, TypedArray] = AbstractDataType.U8;
        const encodeDecode = {
          encode: (s) => [...s].map((c) => c.charCodeAt(0)),
          decode: (c) => c.map((c) => String.fromCharCode(c)),
        };
        return [byteLength * length, TypedArray, encodeDecode, length];
      }
      default:
        throw new Error(`Unsupported string encoding ${encoding}`);
    }
  }

  // Method to create the markup based on the shape provided
  static createMarkup(shape) {
    const markup = {};
    const sizes = {};
    let byteLength = 0;
    let offset = 0;

    const buildMarkup = (shape, keys = []) => {
      let currentSize = 0;
      for (const [k, v] of Object.entries(shape)) {
        const key = [...keys, k];
        const joinedKey = key.join(".");

        const isShape = !Array.isArray(v);
        if (isShape) {
          sizes[k] = buildMarkup(v, key);
          continue;
        }

        markup[joinedKey] = {
          byteOffset: offset,
          TypedArray: v[1],
          byteLength: v[1].BYTES_PER_ELEMENT,
        };

        const encodeDecode = v[2];
        const length = v[3];
        if (encodeDecode) {
          markup[joinedKey].encodeDecode = encodeDecode;
          markup[joinedKey].length = length;
        }

        const bytes = v[0] / 8;
        currentSize += bytes;
        offset += bytes;

        byteLength = Math.max(byteLength, offset);
      }
      return currentSize;
    };

    buildMarkup(shape);

    sizes.TOTAL_SIZE = byteLength;

    return { sizes, byteLength, markup };
  }

  // Method to initialize the getters and setters for the data structure
  static initGetSet(ctx, markup) {
    Object.entries(markup).forEach(([k, v]) => {
      const { TypedArray, encodeDecode, byteLength, length } = v;
      const getset = getGetSetForDataView(TypedArray, ctx.dataView);
      const contextifiedGetSet = getset.map((f) => f.bind(ctx.dataView));

      ctx.markup[k] = {
        byteOffset: v.byteOffset,
        getset: contextifiedGetSet,
        byteLength,
      };

      if (encodeDecode) {
        ctx.markup[k].encodeDecode = encodeDecode;
        ctx.markup[k].length = length;
      }
    });
  }

  // Method to lazily initialize the data structure
  // All data initializes only when we call .create()
  lazyInit() {
    this.buildShape();
    const { markup, byteLength, sizes } = AbstractDataType.createMarkup(
      this.shape,
    );
    this.markup = markup;
    this.byteLength = byteLength;
    this.sizes = sizes;

    const { buffer, dataView } = AbstractDataType.createBuffer(this.byteLength);
    this.buffer = buffer;
    this.dataView = dataView;

    const ctx = this;
    AbstractDataType.initGetSet(ctx, markup);
    AbstractDataType.initGettersAndSetters(ctx, markup);
  }

  // Method to create a buffer and dataView to it for the data structure
  static createBuffer(byteLength) {
    const buffer = new ArrayBuffer(byteLength);
    const dataView = new DataView(buffer);
    return { buffer, dataView };
  }

  // Filling up buffer bases on provided values
  create(...values) {
    this.lazyInit();

    // since values could have n-level of nesting, we have to plain it
    // and then filling buffer with plains values
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

      const [__, set] = getset;
      const valueToInsert = plainValues[plainValuesIndex];
      if (encodeDecode) {
        const { encode } = encodeDecode;
        const chars = encode(valueToInsert);
        let offset = byteOffset;
        chars.forEach((char) => {
          set(offset, char);
          offset += byteLength;
        });
        plainValuesIndex++;
        continue;
      }
      set(byteOffset, valueToInsert);
      plainValuesIndex++;
    }

    return this;
  }

  // Method to initialize the getters and setters for the data structure
  static initGettersAndSetters(ctx, markup) {
    const keys = Object.entries(markup);
    for (const [key, value] of keys) {
      const { getset, encodeDecode, byteOffset, length, byteLength } = value;
      const isString = encodeDecode;
      const [get, set] = getset;

      Object.defineProperty(ctx, key, {
        get: () => {
          // It's not string, just single value
          if (!isString) {
            return get(byteOffset);
          }
          // Otherwise, it's string
          const codes = [];
          for (let i = 0; i < length; i++) {
            const offset = byteOffset + byteLength * i;
            codes.push(get(offset));
          }
          const { decode } = encodeDecode;
          const str = decode(codes).join("");
          return str;
        },
        set: (v) => {
          // v is string
          const isValueString = typeof v === "string";
          if (isString && isValueString) {
            // we support only static string
            if (v.length > length) return false;
            const { encode } = encodeDecode;
            const encoded = encode(v);
            for (let i = 0; i < length; i++) {
              // We can set newString with length less than current
              const valueToInsert = i >= encoded.length ? 0 : encoded[i];
              const offset = byteOffset + byteLength * i;
              set(offset, valueToInsert);
            }
            return true;
          }

          set(byteOffset, v);
          return true;
        },
      });
    }
  }
  // Creates deep copy of provided shape
  #copyShape(shape) {
    if (shape === null || typeof shape !== "object") return shape;
    const clone = Array.isArray(shape) ? [] : {};
    for (let key in shape) clone[key] = this.#copyShape(shape[key]);
    return clone;
  }

  // Returns light-weighted copy.
  from(buffer) {
    const shape = this.#copyShape(this.shape);
    const { markup, byteLength, sizes } = AbstractDataType.createMarkup(shape);
    const buff = buffer.slice();
    const dataView = new DataView(buff);
    const abstractDataTypeLike = {
      shape,
      markup,
      byteLength,
      sizes,
      buffer: buff,
      dataView,
    };
    AbstractDataType.initGetSet(abstractDataTypeLike, markup);
    AbstractDataType.initGettersAndSetters(abstractDataTypeLike, markup);
    return abstractDataTypeLike;
  }

  buildShape() {
    throw new Error("not implemented");
  }

  static createScheme() {
    throw new Error("not implemented");
  }
}

const getGetSetForDataView = (typedArray, dataView) => {
  if (!typedArray) throw new Error("Typed array not initialized.");
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

module.exports = AbstractDataType;
