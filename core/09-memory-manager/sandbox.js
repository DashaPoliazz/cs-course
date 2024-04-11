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

const createNullableDeepCopy = (entity) => {
  // Creates null as value for each key in object
  if (entity === null || typeof entity !== "object") return null;
  const clone = Array.isArray(entity) ? [] : {};
  for (let key in entity) clone[key] = createNullableDeepCopy(entity[key]);
  return clone;
};
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

class Lense {
  #TypedArray;
  #dataView;
  #get;
  #set;

  constructor(TypedArray, dataView) {
    this.#TypedArray = TypedArray;
    this.#dataView = dataView;
    const [get, set] = getContextifiedGetSet(TypedArray, dataView);
    this.#get = get;
    this.#set = set;
    this.length = dataView.byteLength / TypedArray.BYTES_PER_ELEMENT;
  }

  get(idx) {
    if (idx > this.length)
      throw new Error(`Out of bounds error. 0 <= ${idx} < ${this.length}`);
    const offset = this.#TypedArray.BYTES_PER_ELEMENT * idx;
    return this.#get(offset, true);
  }

  set(idx, value) {
    if (idx > this.length)
      throw new Error(`Out of bounds error. 0 <= ${idx} < ${this.length}`);
    const offset = this.#TypedArray.BYTES_PER_ELEMENT * idx;
    return this.#set(offset, value, true);
  }
}

class Stack {
  // Please, keep in mind aligning when adding new metadata!
  // Keep in mind, that we calculate offsets to the next frame based on the
  // it's aligned value to the first metaDataItem (prevOffset);
  #metaData = {
    _prevOffset: [Uint32Array, 1],
    _nextOffset: [Uint32Array, 1],
    _frameBufferLength: [Uint32Array, 1],
    _code: [Uint8Array, 1],
  };
  #metaDataOffsets;
  #newFrameAlignmentValue;
  #metaDataLength;

  #buffer;
  #capacity;

  #basePointer = 0; // points to the start of last added element in stack
  #stackPointer = 0; // points to the top
  #prevPointer = 0; // points to the prev element

  constructor(capacity) {
    this.#capacity = capacity;
    this.#initMetaDataLength();
    this.#initBuffer();
    // We will align stack frames by first element size in metadata
    this.#newFrameAlignmentValue = Object.entries(
      this.#metaData,
    )[0][1][0].BYTES_PER_ELEMENT;
  }

  debugBuffer(msg) {
    console.log(msg, this.#buffer);
  }

  // Pushes buffer on the top
  push(frameBuffer) {
    // To push element on the top we have to:
    // 1. Create frame with metadata
    console.log("BEFORE", this.#basePointer);
    this.#basePointer = this.#stackPointer;
    this.#createFrame(frameBuffer);
    this.#prevPointer = this.#basePointer;
    console.log("AFTER", this.#basePointer);
    // 2. Return pointer to frameBuffer with ability to perform read/write operations
    return this.peek();
  }
  // Pops last frame from the stack
  pop() {
    const metaData = this.#parseMetaData(this.#basePointer);
    const lense = this.peek();

    // To remove frame we have to:
    // 1. Know it's bounds
    const leftBound = this.#basePointer;
    const { _prevOffset, _nextOffset } = metaData;
    const rightBound = _nextOffset;

    // Reading memory as Uint8 and fill data with 0
    new Uint8Array(this.#buffer).fill(0, leftBound, rightBound);
    this.#stackPointer = this.#basePointer;
    this.#basePointer = _prevOffset;

    return lense;
  }
  // Todo:
  // [ ] Should return lenses instead of getset
  peek() {
    const metaData = this.#parseMetaData(this.#basePointer);
    const lense = this.#createLense(metaData);
    return lense;
  }
  #createLense(metaData) {
    const frameBufferOffset = this.#getFrameBufferOffest(metaData);
    const { _code, _frameBufferLength } = metaData;
    const TypedArray = getTypedArrayFromCode(_code);
    const byteLength = _frameBufferLength * TypedArray.BYTES_PER_ELEMENT;
    const dataView = new DataView(this.#buffer, frameBufferOffset, byteLength);
    const lense = new Lense(TypedArray, dataView);
    return lense;
  }
  #getFrameBufferOffest(metaData) {
    const maybeOffset = this.#basePointer + this.#metaDataLength;
    const { _code } = metaData;
    const TypedArray = getTypedArrayFromCode(_code);
    return this.#getAlignedValue(maybeOffset, TypedArray.BYTES_PER_ELEMENT);
  }

  // Parses metadata starting with startOffset
  #parseMetaData(startOffset) {
    const metaData = createNullableDeepCopy(this.#metaData);
    let offset = startOffset;
    let metaDataOffsetsIdx = 0;

    console.log(this.#metaDataOffsets);

    for (const [k, v] of Object.entries(this.#metaData)) {
      const [TypedArray, len] = v;
      offset += this.#metaDataOffsets[metaDataOffsetsIdx++];
      const byteLength = TypedArray.BYTES_PER_ELEMENT * len;
      const dataView = new DataView(this.#buffer, offset, byteLength);
      const [get, _] = getContextifiedGetSet(TypedArray, dataView);
      const metaDataValue = get(0, true);
      metaData[k] = metaDataValue;
    }

    return metaData;
  }
  #createFrame(frameBuffer) {
    // To create stack frame we have to:
    // 1. insert metadata
    this.#insertMetadata(frameBuffer);
    // 2. insert frame buffer
    this.#insertFrameBuffer(frameBuffer);
    // *remember about aligning
  }
  #insertMetadata(frameBuffer) {
    // To insert metadata we have to:
    // 1. Know information about this.#metaData:
    //    - frameBufferLength
    const frameBufferLength = frameBuffer.length;
    //    - code
    const code = getTypedArrayCode(frameBuffer.constructor);
    //    - prevOffset
    const prevOffset = this.#prevPointer;
    //    - nextOffset
    //    next offset consists of following information:

    //           already calculated   | we have to calculate it
    //      - [ ___alignedMetadata___ , -maybeSomeAligngingHere-, frameBufferSize]
    const alignedFrameBufferOffset = this.#getAlignedValue(
      this.#basePointer + this.#metaDataLength,
      frameBuffer.BYTES_PER_ELEMENT,
    );
    const frameBufferByteLength =
      frameBuffer.BYTES_PER_ELEMENT * frameBufferLength;
    const alignmentValue = this.#metaData._prevOffset[0].BYTES_PER_ELEMENT;
    const nextOffset = this.#getAlignedValue(
      alignedFrameBufferOffset + frameBufferByteLength,
      alignmentValue,
    );

    let metadataIdx = 0;
    const metadata = [prevOffset, nextOffset, frameBufferLength, code];

    for (const [TypedArray, len] of Object.values(this.#metaData)) {
      const bytesPerElement = TypedArray["BYTES_PER_ELEMENT"];
      const metadataItemLength = bytesPerElement * len;
      const newMetaDataLength = this.#stackPointer + metadataItemLength;
      const alignedMetaDataLength = this.#getAlignedValue(
        newMetaDataLength,
        bytesPerElement,
      );

      // Todo:
      // [ ] hardcoded solution. We can have multiple metadataItem length
      const metaDataBuffer = new TypedArray(
        this.#buffer,
        this.#stackPointer,
        len,
      );
      metaDataBuffer[0] = metadata[metadataIdx++];

      this.#stackPointer = alignedMetaDataLength;
    }
  }
  #insertFrameBuffer(frameBuffer) {
    const TypedArray = frameBuffer.constructor;
    const length = frameBuffer.length;

    // Aligning stack pointer before inserting
    this.#stackPointer = this.#getAlignedValue(
      this.#stackPointer,
      TypedArray.BYTES_PER_ELEMENT,
    );

    const memoryChunk = new TypedArray(
      this.#buffer,
      this.#stackPointer,
      length,
    );
    // To insert frame buffer in the buffer we have to:
    // 1. "Move" data from old frameBuffer in the current buffer
    // * T -> O(1), S -> O(N). It's impossible to make it better in JS
    memoryChunk.set(frameBuffer);

    // Todo:
    // [ ] Maybe move all stackPointers changes to the 'createFrame' or another place?
    const frameBufferByteLength = TypedArray.BYTES_PER_ELEMENT * length;
    const maybeNewStackPointer = this.#stackPointer + frameBufferByteLength;
    this.#stackPointer = this.#getAlignedValue(
      maybeNewStackPointer,
      this.#newFrameAlignmentValue,
    );
  }

  #initMetaDataLength() {
    const values = Object.values(this.#metaData);
    const offsets = [];
    let prev = 0;
    let initialOffset = 0;

    let metadataLength = 0;
    for (const [ta, taLength] of values) {
      const bytesPerElement = ta["BYTES_PER_ELEMENT"];
      const metadataItemLength = bytesPerElement * taLength;
      const newMetaDataLength = metadataLength + metadataItemLength;
      const alignedMetaDataLength = this.#getAlignedValue(
        newMetaDataLength,
        bytesPerElement,
      );
      metadataLength = alignedMetaDataLength;

      // Memoizining offsets
      const delta = alignedMetaDataLength - prev;
      const isFirstIteration = offsets.length === 0;
      if (isFirstIteration) initialOffset = delta;
      const offset = isFirstIteration ? 0 : delta;
      prev = alignedMetaDataLength;
      offsets.push(offset);
    }

    // Forwading offset
    offsets[offsets.length - 1] = initialOffset;

    this.#metaDataOffsets = offsets;
    this.#metaDataLength = metadataLength;
    console.log("LENGTH:", this.#metaDataLength);
  }
  #getAlignedValue(value, alignmentValue) {
    const remainder = value % alignmentValue;
    if (remainder) return value + (alignmentValue - remainder);
    return value;
  }
  #initBuffer() {
    this.#buffer = new ArrayBuffer(this.#capacity);
  }
}

{
  const s = new Stack(70);
  const memoryChunk1 = new Uint8Array([1, 2, 3]);
  const lense0 = s.push(memoryChunk1);

  // Setting first element 2
  console.log("lense0.set(0)", lense0.set(0, 2));

  console.log("lense0.get(0)", lense0.get(0)); // 2
  console.log("lense0.get(1)", lense0.get(1)); // 2
  console.log("lense0.get(2)", lense0.get(2)); // 3

  // s.debugBuffer("DebugBuffer");

  const memoryChunk2 = new Uint32Array([4, 5, 6, 7]);
  const lense1 = s.push(memoryChunk2);
  console.log("lense1.get(0)", lense1.get(0));
  console.log("lense1.get(1)", lense1.get(1));
  console.log("lense1.get(2)", lense1.get(2));
  console.log("lense1.get(2)", lense1.get(3));

  const memoryChunk3 = new Uint8Array([7, 8, 9]);
  s.push(memoryChunk3);

  const lense2 = s.peek();
  // Todo: it's inconvinient to keep in mind correct offsets
  // [ ] Implement lenses for it
  console.log("lense2.get(0)", lense2.get(0));
  console.log("lense2.get(1)", lense2.get(1));
  console.log("lense2.get(2)", lense2.get(2));
  // console.log("get(4)", lense1.get(4)); // Out of bounds error

  s.debugBuffer("Before pop");
  const poped = s.pop();
  s.debugBuffer("After pop");
}
