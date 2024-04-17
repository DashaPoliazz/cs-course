"use strict";

class Matrix {
  #get;
  #set;
  #products;

  constructor(TypedArray, ...dimensions) {
    const invalidDimensionIdx = dimensions.indexOf(0);
    if (invalidDimensionIdx !== -1)
      throw new Error(
        `Dimension ${dimensions[invalidDimensionIdx]} can not be equal to zero`,
      );

    this.dimensions = dimensions;
    const totalElements = dimensions.reduce((acc, n) => acc * n, 1);
    const byteLength = totalElements * TypedArray.BYTES_PER_ELEMENT;
    const buffer = new ArrayBuffer(byteLength);
    this.buffer = buffer;

    const typedArray = new TypedArray(buffer);
    this.typedArray = typedArray;

    this.#calcProducts();

    const dataView = new DataView(buffer);
    this.dataView = dataView;
    const [get, set] = this.#getGetSetForDataView(typedArray);
    this.#get = (byteOffset, littleEndian = true) =>
      get.call(dataView, byteOffset, littleEndian);
    this.#set = (byteOffset, value, littleEndian = true) =>
      set.call(dataView, byteOffset, value, littleEndian);
  }

  #getGetSetForDataView(typedArray) {
    if (!typedArray) throw new Error("Data view is not initialized.");
    const dataView = this.dataView;
    switch (typedArray.constructor) {
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
  }

  #calcProducts() {
    const products = new Array(this.dimensions.length).fill(1);
    for (let i = 1; i < products.length; i++) {
      products[i] = products[i - 1] * this.dimensions[i];
    }
    this.#products = products;
  }

  getOffset(...coords) {
    if (coords.length !== this.dimensions.length)
      throw new Error("Number of coords must match number of dimensions");

    let offset = 0;

    for (let i = 0; i < coords.length; i++) {
      const productIdx = [this.#products.length - 1 - i];
      const product = this.#products[productIdx];
      offset += coords[i] * product;
    }

    return offset * this.typedArray.BYTES_PER_ELEMENT;
  }

  set(...args) {
    const value = args.pop();
    const byteOffset = this.getOffset(...args);
    this.#set(byteOffset, value);
  }

  get(...coords) {
    const byteOffset = this.getOffset(...coords);
    return this.#get(byteOffset);
  }

  *values() {
    for (let i = 0; i < this.typedArray.length; i++) {
      const byteOffset = i * this.typedArray.BYTES_PER_ELEMENT;
      yield this.#get(byteOffset);
    }
  }
}

// {
//   const matrix2n2n2 = new Matrix(Int32Array, 2, 2, 2);

//   matrix2n2n2.set(0, 0, 0, 1);
//   matrix2n2n2.set(0, 0, 1, 2);
//   matrix2n2n2.set(0, 1, 0, 3);
//   matrix2n2n2.set(0, 1, 1, 4);

//   matrix2n2n2.set(1, 0, 0, 5);
//   matrix2n2n2.set(1, 0, 1, 6);
//   matrix2n2n2.set(1, 1, 0, 7);
//   matrix2n2n2.set(1, 1, 1, 8);

//   matrix2n2n2.get(0, 0, 0); // 1
//   matrix2n2n2.get(0, 1, 0); // 2
//   matrix2n2n2.get(0, 0, 1); // 3
//   matrix2n2n2.get(0, 1, 1); // 4

//   matrix2n2n2.get(1, 0, 0); // 5
//   matrix2n2n2.get(1, 1, 0); // 6
//   matrix2n2n2.get(1, 0, 1); // 7
//   matrix2n2n2.get(1, 1, 1); // 8

//   console.log(matrix2n2n2.buffer);
// }
// {
//   const matrix3n4n5 = new Matrix(Int32Array, 2, 2, 2);

//   matrix3n4n5.set(0, 0, 0, 1);
//   matrix3n4n5.set(0, 0, 1, 2);
//   matrix3n4n5.set(0, 1, 0, 3);
//   matrix3n4n5.set(0, 1, 1, 4);

//   matrix3n4n5.set(1, 0, 0, 5);
//   matrix3n4n5.set(1, 0, 1, 6);
//   matrix3n4n5.set(1, 1, 0, 7);
//   matrix3n4n5.set(1, 1, 1, 8);

//   // [1, 2, 3, 4, 5, 6, 7, 8, 9]
//   console.log(Array.from(matrix3n4n5.values()));
// }

module.exports = Matrix;
