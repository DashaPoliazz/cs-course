"use strict";

const encodeTypedArrayData = (typedArray) => {
  switch (typedArray.constructor) {
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

const decodeTypedArrayData = (code) => {
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
      throw new Error("Unsupported code for TypedArray");
  }
};

const getGetSetForDataView = (typedArray, dataView) => {
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
  const getSet = getGetSet().map((f) => f.bind(dataView));
  return getSet;
};

class Stack {
  #basePointer = 0; // points on last start of last added element
  #servicePointer = 0; // inner pointer to to insertions
  #stackPointer = 0; // points on the insertion position

  #capacity;
  #buffer;
  #byteLength;

  #metadata = {
    nextStackPointerTypedArray: Uint32Array,
    frameBufferCodeTypedArray: Uint8Array,
    frameBufferLengthTypedArray: Uint32Array,
  };
  #metadataLength =
    this.#metadata.nextStackPointerTypedArray.BYTES_PER_ELEMENT +
    this.#metadata.frameBufferCodeTypedArray.BYTES_PER_ELEMENT +
    this.#metadata.frameBufferLengthTypedArray.BYTES_PER_ELEMENT;

  constructor(capacity) {
    this.#capacity = capacity;
    this.#buffer = new ArrayBuffer(capacity);
  }

  push(typedArray) {
    // Checking for stack overflow error
    const typedArrayByteLength =
      typedArray.BYTES_PER_ELEMENT * typedArray.length;
    const memoryNeededToPush =
      this.#basePointer + this.#metadataLength + typedArrayByteLength;
    const isStackOverflow = memoryNeededToPush > this.#capacity;
    if (isStackOverflow) throw new Error("Maximum call stack size exceeded");

    this.#insertStackFrame(typedArray);
    const handler = this.#createView();

    return handler;
  }

  // Creates view by base pointer
  #createView() {
    // To create view we have to parse metadata:
    // 1. byteLength of currnet payloadTypedArray
    const lengthBufferOffset =
      this.#basePointer +
      this.#metadata.nextStackPointerTypedArray.BYTES_PER_ELEMENT;
    const bufferLength = new this.#metadata.frameBufferLengthTypedArray(
      this.#buffer,
      lengthBufferOffset,
      1,
    )[0];
    // 2. type of current payloadTypedArray
    const typeBufferOffset =
      lengthBufferOffset +
      this.#metadata.frameBufferLengthTypedArray.BYTES_PER_ELEMENT;
    const code = new this.#metadata.frameBufferCodeTypedArray(
      this.#buffer,
      typeBufferOffset,
      1,
    )[0];

    const typedArrayType = decodeTypedArrayData(code);
    let payloadBufferOffset =
      typeBufferOffset +
      this.#metadata.frameBufferCodeTypedArray.BYTES_PER_ELEMENT;
    // Maybe we have to align start offset
    const remainder = payloadBufferOffset % typedArrayType.BYTES_PER_ELEMENT;
    if (remainder) payloadBufferOffset += remainder;

    const view = new DataView(
      this.#buffer,
      payloadBufferOffset,
      bufferLength * typedArrayType.BYTES_PER_ELEMENT,
    );
    const [get, set] = getGetSetForDataView(typedArrayType, view);

    const out = {
      get,
      set,
      length: bufferLength,
      start: payloadBufferOffset,
    };
    return out;
  }
  #parseMetadata() {
    // Representatino of metadata in the stack
    //  0                 4                  8          9
    // [nextStackPointer, frameBufferLength, bufferCode]

    // Parsing nextStackPointer:
    const nextStackPointerOffset = this.#basePointer;
    const nextStackPointerByteTypedArray =
      this.#metadata.nextStackPointerTypedArray;
    const nextStackPointerBuff = this.#parseMetadataChunk(
      nextStackPointerOffset,
      nextStackPointerByteTypedArray,
    );
    const nextStackPointer = nextStackPointerBuff[0];

    // Parsing frameBufferLength
    const frameBufferLengthOffset =
      nextStackPointerOffset +
      this.#metadata.frameBufferLengthTypedArray.BYTES_PER_ELEMENT;
    const frameBufferLengthTypedArray =
      this.#metadata.frameBufferLengthTypedArray;
    const frameBufferLengthBuff = this.#parseMetadataChunk(
      frameBufferLengthOffset,
      frameBufferLengthTypedArray,
    );
    const frameBufferLength = frameBufferLengthBuff[0];

    // Parsing bufferCode
    const frameBufferCodeOffset =
      frameBufferLengthOffset +
      this.#metadata.frameBufferLengthTypedArray.BYTES_PER_ELEMENT;
    const frameBufferCodeTypedArray = this.#metadata.frameBufferCodeTypedArray;
    const frameBufferCodeBuff = this.#parseMetadataChunk(
      frameBufferCodeOffset,
      frameBufferCodeTypedArray,
    );
    const frameBufferCode = frameBufferCodeBuff[0];

    // console.log(
    //   "Offsets:",
    //   nextStackPointerOffset,
    //   frameBufferLengthOffset,
    //   frameBufferCodeOffset,
    // );

    // console.log({
    //   nextStackPointer,
    //   frameBufferLength,
    //   frameBufferCode,
    // });

    let frameBufferOffset =
      frameBufferCodeOffset +
      this.#metadata.frameBufferCodeTypedArray.BYTES_PER_ELEMENT;
    const frameBufferTypedArray = decodeTypedArrayData(frameBufferCode);
    const remainder =
      frameBufferOffset % frameBufferTypedArray.BYTES_PER_ELEMENT;
    if (remainder) frameBufferOffset += remainder;

    const out = {
      nextStackPointer,
      frameBufferLength,
      frameBufferCode,
    };

    return out;
  }
  #insertMetadata(payloadTypedArrray) {
    // To insert metadata we have to perform following steps:
    // 1. Align currentPointer
    {
      const remainder =
        this.#servicePointer %
        this.#metadata.nextStackPointerTypedArray.BYTES_PER_ELEMENT;
      if (remainder > 0) this.#servicePointer += remainder;
    }

    // 2. Insert Uint32Array with offset to the next element
    //    2.1. Calculate offset of the payload data of current frame
    let payloadTypedArrrayOffset = this.#servicePointer + this.#metadataLength;
    {
      const remainder =
        payloadTypedArrrayOffset % payloadTypedArrray.BYTES_PER_ELEMENT;
      if (remainder) payloadTypedArrrayOffset += remainder;
    }

    //    2.2. Calculate offset to the next element
    const payloadTypedArrayByteLength =
      payloadTypedArrray.BYTES_PER_ELEMENT * payloadTypedArrray.length;
    let nextElementOffset =
      payloadTypedArrrayOffset + payloadTypedArrayByteLength;
    {
      const remainder =
        nextElementOffset %
        this.#metadata.nextStackPointerTypedArray.BYTES_PER_ELEMENT;
      if (remainder) nextElementOffset += remainder;
    }
    //   2.3. Initialize nextElementOffset buffer
    const nextElementOffsetBufffer =
      new this.#metadata.nextStackPointerTypedArray(
        this.#buffer,
        this.#servicePointer,
        1,
      );
    nextElementOffsetBufffer[0] = nextElementOffset;
    this.#servicePointer +=
      this.#metadata.nextStackPointerTypedArray.BYTES_PER_ELEMENT;
    // 3. Inseting length data
    const lengthBuffer = new this.#metadata.frameBufferLengthTypedArray(
      this.#buffer,
      this.#servicePointer,
      1,
    );
    lengthBuffer[0] = payloadTypedArrray.length;
    this.#servicePointer +=
      this.#metadata.frameBufferLengthTypedArray.BYTES_PER_ELEMENT;

    // 4. Insert type of typedArray
    console.log("FROMSTACKFRAME2:", payloadTypedArrray);

    const code = encodeTypedArrayData(payloadTypedArrray);
    const currElementType = new this.#metadata.frameBufferCodeTypedArray(
      this.#buffer,
      this.#servicePointer,
      1,
    );
    currElementType[0] = code;
    this.#servicePointer = payloadTypedArrrayOffset;
    // Metadata has been inserted

    return nextElementOffset;
  }
  #parseMetadataChunk(offset, TypedArray) {
    const buff = new TypedArray(this.#buffer, offset, 1);
    return buff;
  }
  #insertPayloadData(typedArray, offset) {
    // Reallocating typedArray's data in current buffer
    console.log("offset:", offset);
    const buffer = this.#buffer;
    const length = typedArray.length;

    // Align offset
    const remainder = offset % typedArray.BYTES_PER_ELEMENT;
    if (remainder > 0) offset += remainder;

    const newTypedArray = new typedArray.constructor(buffer, offset, length);
    // Filling memory chunk with old values
    newTypedArray.set(typedArray);

    return newTypedArray;
  }
  // Frame consists of 3 parts:
  // 1. Uint32Array contains pointer(offset) to the next element
  // 2. Uint8Array contains type of typedArray in current frame
  // 3. Typed array data represents payload
  #insertStackFrame(payloadTypedArrray) {
    this.#basePointer = this.#servicePointer;
    // Now, we have to create stack frame and insert metadata and data sequencely
    // 1. Insert metadata
    const nextElementOffset = this.#insertMetadata(payloadTypedArrray);
    // 2. Insert payload data
    this.#insertPayloadData(payloadTypedArrray, this.#servicePointer);

    this.#servicePointer = nextElementOffset;
    this.#stackPointer = nextElementOffset;
  }

  pop() {
    console.log("POINTER:", this.#basePointer);
    const metadata = this.#parseMetadata();
    console.log("METADATA", metadata);
    this.debugMemory("mesasge");
  }
  peek() {}

  // returns offset of the element
  deref() {}
  change() {}

  debugMemory(msg) {
    console.log(msg, this.#buffer);
  }
}

// Usages:
{
  const stack = new Stack(60);

  const memoryChunk1 = new Uint8Array([1, 2, 3, 4, 5]);
  const push1 = stack.push(memoryChunk1);
  console.log("push1", push1);

  {
    // Insertion after pushing 1
    const { get, set, length, start } = push1;
    for (let i = 0; i < length; i++) {
      set(i, i + 5);
      console.log(get(i));
    }
  }
  // stack.debugMemory("after pushing 1");

  const memoryChunk2 = new Uint32Array([1, 2, 3, 4, 5]);
  const push2 = stack.push(memoryChunk2);
  console.log("push2", push2);

  {
    // Insertion after pushing 2
    const { get, set, length, start } = push2;
    console.log("start:", start);
    // set(0, 3300);
    for (let i = 0; i < length; i++) {
      // To do: Iterator that can track offsets
      set(i * 4, i + 5);
    }
  }

  // stack.debugMemory("after pushing 2");

  // Pop:
  const pop1 = stack.pop();
  console.log("pop:", pop1);
}
