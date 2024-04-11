const getContextifiedGetSet = (typedArray, dataView) => {
  if (!typedArray) throw new Error("Typed array not initialized.");
  const getGetSet = () => {
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
  const getset = getGetSet();
  return getset.map((f) => f.bind(dataView));
};

module.exports = getContextifiedGetSet;
