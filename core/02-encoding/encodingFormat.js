"use strict";

class CustomEncoding {
  constants = {
    MAX_TYPED_ARRAY_SIZE: 64,
  };

  #encoder;
  #decoder;

  constructor(encoder, decoder, bytesPerChar) {
    this.#encoder = encoder;
    this.#decoder = decoder;
    this.charSize = bytesPerChar;
  }

  encode(s) {
    this.#validateString(s);

    const typedArray = this.#createTypedArray(s.length, this.charSize);

    [...s].forEach((char, idx) => {
      const encodedChar = this.#encoder(char);
      typedArray[idx] = encodedChar;
    });

    return typedArray;
  }

  decode(buff) {
    return Array.from(buff).map(this.#decoder).join("");
  }

  #createTypedArray(length, type) {
    const { MAX_TYPED_ARRAY_SIZE } = this.constants;

    if (type % 8 !== 0 || type > MAX_TYPED_ARRAY_SIZE) {
      throw new Error("Can not create typed Array");
    }

    const typedArrayClassName = `Uint${type}Array`;
    const TypedArrayConstructor = global[typedArrayClassName];

    return new TypedArrayConstructor(length);
  }

  #validateString(s) {
    const validChars = this.#encoder.validChars;

    [...s].forEach((char) => {
      const isValid = validChars.includes(char);
      if (!isValid) throw new Error(`Char ${char} is not supported`);
    });
  }
}

module.exports = CustomEncoding;
